import { user, dbUser } from './user.type';
import sqlite3 from 'sqlite3';
import * as _ from 'lodash';

const sqlite = sqlite3.verbose();
const { Database } = sqlite;

export class Users {
  private db;

  constructor(pth: string) {
    this.db = new Database(pth);
  }

  async create(user: user): Promise<void> {
    return new Promise(async (resolve) => {
      const allUsers = await this.getUsers();
      const idNewUser = allUsers.length;
      this.db.run(
        'INSERT INTO users VALUES (?, ?, ?)',
        [
          idNewUser + 1,
          user.uid,
          typeof user.filters === 'string'
            ? user.filters
            : _.join(user.filters, ',')
        ],
        () => {
          resolve();
        }
      );
    });
  }

  async getUsers(): Promise<user[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM users', (err: Error | null, res: dbUser[]) => {
        if (err) reject(err);
        const usrs: user[] = res.map((user) => {
          if (typeof user.filters === 'string') {
            user.filters = _.split(user.filters, ',');
          }
          return user;
        });
        resolve(usrs);
      });
    });
  }

  async exists(id: number): Promise<boolean> {
    const query = 'SELECT * FROM users WHERE id=?';
    return new Promise((resolve, reject) => {
      this.db.all(
        query,
        [id],
        (err: Error | null, res: Array<Record<string, unknown>>) => {
          if (err) reject(err);
          const count: number = res.length;
          resolve(count > 0);
        }
      );
    });
  }

  async update(user: user): Promise<void> {
    if (typeof user.filters !== 'string') {
      await user.filters.forEach((el, index) => {
        if (el == '' && typeof user.filters !== 'string') {
          user.filters.splice(index, 1);
        }
      });
      user.filters = _.join(user.filters, ',');
    }
    return new Promise((resolve) => {
      this.db.run(
        'UPDATE users SET id=?,uid=?,filters=? WHERE id=?',
        [...Object.values(user), user.id],
        () => {
          resolve();
        }
      );
    });
  }

  async getUser(id: number): Promise<user> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM users WHERE uid=?',
        [id],
        (err: Error | null, res: dbUser[]) => {
          if (err) reject(err);
          const user: user = res[0];
          if (typeof user.filters == 'string') {
            user.filters = _.split(user.filters, ',');
          }
          resolve(user);
        }
      );
    });
  }
}

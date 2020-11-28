import { user, dbUser, userExists } from './user.type';
import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

export class Users {
  private db: any;

  constructor(pth: string) {
    this.db = new sqlite.Database(pth);
  }

  async create(user: user): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const allUsers = await this.getUsers();
      const idNewUser = allUsers.length;
      this.db.run(
        'INSERT INTO users VALUES (?, ?, ?)',
        [
          idNewUser + 1,
          user.uid,
          typeof user.filters === 'string'
            ? user.filters
            : user.filters.join(',')
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
            user.filters = user.filters.split(',');
          }
          return user;
        });
        resolve(usrs);
      });
    });
  }

  async exists(id: number): Promise<any> {
    const query: string = 'SELECT * FROM users WHERE id=?';
    return new Promise((resolve, reject) => {
      this.db.all(query, [id], (err: Error | null, res: any) => {
        if (err) reject(err);
        const count: number = res.length;
        resolve(count > 0);
      });
    });
  }

  async update(user: user): Promise<void> {
    if (typeof user.filters !== 'string') {
      await user.filters.forEach((el, index) => {
        if (el == '') {
          // @ts-ignore
          user.filters.splice(index, 1);
        }
      });
      user.filters = user.filters.join(',');
    }
    return new Promise((resolve, reject) => {
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
            user.filters = user.filters.split(',');
          }
          resolve(user);
        }
      );
    });
  }
}

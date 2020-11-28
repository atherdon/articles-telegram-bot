import { Filter } from './filter.type';
import * as fs from 'fs/promises';

export class Filters {
  private filters: Filter[] = [];
  private path: string = '';

  constructor(pth: string) {
    this.path = pth;
  }

  async start(): Promise<void> {
    const filters: Filter[] = await this.data();
    this.filters = filters;
  }

  async data(): Promise<Filter[]> {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(this.path, { encoding: 'utf-8' }).then((json) => {
          resolve(JSON.parse(json));
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async getFilter(id: number): Promise<Filter> {
    return new Promise(async (resolve, reject) => {
      this.data()
        .then((dat) => {
          resolve(dat[id - 1]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  async save(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const saveData = JSON.stringify(this.filters, null, 2);
        fs.writeFile(this.path, saveData, { encoding: 'utf-8' }).then(() => {
          resolve(true);
        });
      } catch (e) {
        reject(false);
      }
    });
  }

  async create(filter: Filter): Promise<void> {
    if (typeof filter.id === 'undefined') {
      filter.id = this.filters.length + 1;
    }
    await this.filters.push(filter);
    await this.save();
  }
}

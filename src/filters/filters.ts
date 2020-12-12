import { Filter } from './filter.type';
import * as fs from 'fs/promises';
import * as _ from 'lodash';

export class Filters {
  private filters: Filter[] = [];
  private path = '';

  constructor(pth: string) {
    this.path = pth;
  }

  async start(): Promise<void> {
    const filters: Filter[] = await this.data();
    this.filters = filters;
  }

  makeSlug(name: string): string {
    return name.toLowerCase().split(' ').join('-');
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
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
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

  async delete(id: number): Promise<void> {
    let current_filters: Filter[] | undefined;
    // @ts-ignore
    current_filters = await _.map(_.filter(this.filters, (el: Filter) => el.id !== id), (el: Filter) => {
      if (typeof el.id !== 'undefined' && el.id > id) {
        return { ...el, id: el.id - 1 };
      }
    });
    if (typeof current_filters !== 'undefined') {
      this.filters = current_filters;
      await this.save();
    }
  }

  async correctFilter(
    filter: string | Array<string>,
    fid: number
  ): Promise<Array<string>> {
    return new Promise((resolve) => {
      if (filter.indexOf(String(fid)) === -1) {
        if (typeof filter === 'string') {
          filter = _.split(filter, ',');
        }
        filter.push(String(fid));
      } else {
        if (typeof filter === 'string') {
          filter = _.split(filter, ',');
        }
        filter.splice(filter.indexOf(String(fid)), 1);
      }
      resolve(filter);
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

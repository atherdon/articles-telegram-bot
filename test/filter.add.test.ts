import { Filters } from "../src/filters/filters";
import * as path from 'path';

describe("Filter tests", ()=>{
  test('Creating filter', async (done)=>{
    const filters: Filters = await new Filters(path.join(__dirname, '..', 'db', 'filters.json'));
    await filters.start();
    expect('Creating filter');
    await filters.create({
      name: 'Machine Learning',
      slug: 'machine-learning'
    });
    await expect('All normal');
    done();
  }, 10000);
})
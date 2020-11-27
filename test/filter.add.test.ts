import { Filters } from "../src/filters/filters";
import * as path from 'path';

describe("Filter tests", ()=>{
  const filters: Filters = new Filters(path.join(__dirname, '..', 'db', 'filters.json'));
  test('Creating filter', async (done)=>{
    expect('Creating filter');
    await filters.create({
      id: 1,
      name: 'Web',
      slug: 'web'
    });
    await expect('All normal');
    done();
  }, 10000);
})
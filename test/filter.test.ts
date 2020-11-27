import { Filters } from "../src/filters/filters";
import * as path from 'path';

describe("Filter tests", ()=>{
  const filters: Filters = new Filters(path.join(__dirname, '..', 'db', 'filters.json'));
  test('Get All filters', async (done)=>{
    console.log('Getting filters');
    await filters.data()
      .then((filtrs)=>{
        console.log(JSON.stringify(filtrs));
      });
    await console.log('All normal');
    done();
  }, 10000);
})
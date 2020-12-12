import { CLI, CLIOptions } from './src/utils/cli-model';
import { Filters } from './src/filters/filters';
import path from 'path';

const filters = new Filters(path.join(__dirname, 'db', 'filters.json'));


const options: CLIOptions = {
  commands: [
    {
      pattern: /help/,
      callback: (anotherCommands, options) => {
        console.log(`======${options.name}======`);
        console.log(`- Commands:`);
        console.log(`1) make filter <name>`);
        console.log(`2) delete filter <id|name>`);
      }
    },
    {
      pattern: /make/,
      callback: (anotherCommands, options) => {
        options.argv = anotherCommands;
        options.command = 'make';
        cli.render(options);
      }
    },
    {
      pattern: /delete/,
      callback: (anotherCommands, options) => {
        options.argv = anotherCommands;
        options.command = 'delete';
        cli.render(options);
      }
    },
    {
      pattern: /filter/,
      callback: async (anotherCommands, options) => {
        if (options.command == 'make') {
          const filterName = anotherCommands.join(' ');
          await filters.create({
            name: filterName,
            slug: filters.makeSlug(filterName)
          });
          console.log(`Filter with name ${filterName} created.`);
        } else if(options.command == 'delete') {
          const filterId = +(anotherCommands[0]);
          await filters.delete(filterId);
          console.log(`Filter with id ${filterId} deleted`);
        } else {
          console.log('Error: Unknown command');
        }
      }
    }
  ],
  name: 'articles-bot',
  argv: process.argv.slice(2)
}

const cli = new CLI(options);
filters.start().then(()=> {
  cli.render();
});
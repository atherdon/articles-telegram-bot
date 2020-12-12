type Commands = {
  pattern: RegExp,
  callback: (anotherCommands: string[], options: CLIOptions) => void
}
export type CLIOptions = {
  commands: Commands[],
  name: string,
  argv: string[],
  command?: string
}

export class CLI {
  private readonly options: CLIOptions;
  private currentCommand: string[] = [];

  constructor(options: CLIOptions) {
    this.options = options;

    return this;
  }

  private renderEl(argv: string[]) {
    if (argv.length !== 0) {
      this.currentCommand = argv;
    } else {
      this.currentCommand = ['help'];
    }
  }

  render(options: boolean | CLIOptions = false) {
    let opt: CLIOptions;
    if (typeof options == 'boolean') {
      opt = this.options;
    } else {
      opt = options;
    }
    this.renderEl(opt.argv);
    const command = this.currentCommand;

    opt.commands.forEach((com) => {
      if (command[0].match(com.pattern)) {
        com.callback(command.slice(1), opt);
      }
    });
  }
}
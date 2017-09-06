import { EventEmitter } from 'events';
import * as hasFlag from 'has-flag';

import { Command, Command$, CommandClass$, PlainObject$ } from './command';
import { ArgumentClass$ } from './argument';
import { Option$, OptionClass$ } from './option';

export interface Program$ {
  name(name: string): this;
  version(ver: string): this;
  description(desc: string): this;
}

class Program extends EventEmitter implements Program$ {
  private __name: string;
  private __version: string;
  private __description: string;
  private __commands: CommandClass$[] = [];
  private __argv: string[] = [];
  constructor() {
    super();
    this.on('help', () => {
      console.info('print help info');
    });
  }
  name(name: string) {
    this.__name = name;
    return this;
  }
  version(ver: string) {
    this.__version = ver;
    return this;
  }
  description(desc: string) {
    this.__description = desc;
    return this;
  }
  command(command: CommandClass$): this {
    this.__commands.push(command);
    return this;
  }
  parse(argv: string[]): void {
    this.__argv = argv.slice(1);

    const commandStr: string = (this.__argv[0] || '').trim();
    if (!commandStr) {
      this.emit('help');
      return;
    }

    const Commands: CommandClass$[] = [...this.__commands];

    while (Commands.length) {
      const Command: CommandClass$ = <CommandClass$>Commands.shift();
      const command: Command$ = new Command();
      if (command.name === commandStr) {
        const argvObject: PlainObject$ = {};
        const optionsObject: PlainObject$ = {};

        // 如果该命令需要参数
        if (command.argument) {
          const ArgumentClass: ArgumentClass$ = <ArgumentClass$>command.argument;
          const argument = new ArgumentClass();
          if (argument.required) {
            const inputArgumentStr: string =
              this.__argv[1] || argument.defaultValue || '';
            argvObject[argument.name] = inputArgumentStr;
          }
        }

        if (command.options) {
          const OptionClasses: OptionClass$[] = [...command.options];
          while (OptionClasses.length) {
            const OptionClass: OptionClass$ = <OptionClass$>OptionClasses.shift();
            const option: Option$ = new OptionClass();

            // 如果只是单纯的flag，则只有boolean类型
            if (option.flag) {
              option.value =
                hasFlag(option.short, this.__argv) ||
                hasFlag(option.long, this.__argv);

              optionsObject[option.name] = option.value;
            }
          }
        }

        command.action(argvObject, optionsObject);
      }
    }
  }
}

export default function(): Program {
  return new Program();
}

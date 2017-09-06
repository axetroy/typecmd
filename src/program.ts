import { EventEmitter } from 'events';
import * as hasFlag from 'has-flag';
import * as minimist from 'minimist';

import { Command$, CommandClass$, PlainObject$ } from './command';
import { ArgumentClass$ } from './argument';
import { Option$, OptionClass$ } from './option';

export interface Program$ {
  name(name: string): this;
  version(ver: string): this;
  description(desc: string): this;
  command(command: CommandClass$): this;
  parse(argv: string[]): this;
}

class Program extends EventEmitter implements Program$ {
  private __name: string;
  private __version: string;
  private __description: string;
  private __commands: CommandClass$[] = [];
  private __argv: string[] = [];

  public __command: Command$;
  public __command_argv: PlainObject$;
  public __command_options: PlainObject$;
  constructor() {
    super();
    this.on('help', () => {
      console.info('print help info');
    });
  }
  name(name: string): this {
    this.__name = name;
    return this;
  }
  version(ver: string): this {
    this.__version = ver;
    return this;
  }
  description(desc: string): this {
    this.__description = desc;
    return this;
  }
  command(command: CommandClass$): this {
    this.__commands.push(command);
    return this;
  }
  parse(argv: string[]): this {
    this.__argv = argv.slice(1);

    const commandStr: string = (this.__argv[0] || '').trim();
    if (!commandStr) {
      this.emit('help');
      return this;
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

        const argv = minimist(this.__argv);

        if (command.options) {
          const OptionClasses: OptionClass$[] = [...command.options];
          while (OptionClasses.length) {
            const OptionClass: OptionClass$ = <OptionClass$>OptionClasses.shift();
            const option: Option$ = new OptionClass();

            const name: string = option.name;

            // 如果只是单纯的flag，则只有boolean类型
            if (option.flag) {
              option.value =
                hasFlag(option.short, this.__argv) ||
                hasFlag(option.long, this.__argv);

              optionsObject[name] = <boolean>option.value;
            } else {
              // 如果不是flag，需要指定值
              const value: string = argv[option.name];
              optionsObject[name] = value || '';
            }
          }
        }

        this.__command = command;
        this.__command_argv = argvObject;
        this.__command_options = optionsObject;

        command.action(argvObject, optionsObject);
      }
    }

    return this;
  }
}

export default function(): Program {
  return new Program();
}

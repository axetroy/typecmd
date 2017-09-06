import { ArgumentClass$ } from './argument';
import { OptionClass$ } from './option';

export interface CommandClass$ {
  new (): Command$;
}

export interface PlainObject$ {
  [key: string]: string;
}

export interface Command$ {
  name: string;
  desc: string;
  argument?: ArgumentClass$;
  options?: OptionClass$[];
  action(argv: PlainObject$, options: PlainObject$): Promise<void>;
  parse(argv: string[]): void;
}

export class Command implements Command$ {
  name: string;
  desc: string;
  argument: ArgumentClass$;
  options?: OptionClass$[];
  constructor() {}
  async action(argv: PlainObject$, options: PlainObject$): Promise<void> {}
  parse(argv: string[]) {}
}

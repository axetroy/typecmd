export interface OptionClass$ {
  new (): Option$;
}

export interface Option$ {
  name: string;
  desc?: string;
  short: string;
  long: string;
  flag: boolean;
  defaultValue?: string | boolean;
  value?: any;
}

export class Option implements Option$ {
  name: string;
  desc?: string;
  short: string;
  long: string;
  flag: boolean = true;
  defaultValue?: string | boolean = false;
  value?: any;
  constructor() {}
}

export interface ArgumentClass$ {
  new (): Argument$;
}

export interface Argument$ {
  name: string;
  desc?: string;
  required?: boolean;
  defaultValue?: string;
}

export class Argument implements Argument$ {
  name: string;
  desc?: string;
  required?: boolean = true;
  defaultValue?: string;
  constructor() {}
}

import * as ava from 'ava';
import program from '../program';
import { Command } from '../command';
import { Argument } from '../argument';
import { Option } from '../option';

class FileArgument extends Argument {
  name = 'file';
  required = true;
  defaultValue = './README.md';
}

class ForceOption extends Option {
  name = 'force';
  desc = '开启强制模式，不论成功或者失败';
  short = '-f';
  long = '--force';
  flag = true;
}

class InfoCommand extends Command {
  name = 'info';
  argument = FileArgument;
  options = [ForceOption];
  desc = '显示制定文件的信息';
  constructor() {
    super();
  }
  async action(argv: any, options: any) {
    const dist = argv.file;
    console.info(argv, options);
    console.info(`显示文件的信息`, dist);
  }
}

ava.test('info命令', t => {
  program()
    .command(InfoCommand)
    .parse(['test', 'info', './package.json', '--force']);
  t.pass();
});

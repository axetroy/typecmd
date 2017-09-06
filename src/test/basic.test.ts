import * as ava from 'ava';
import program from '../program';
import { Command } from '../command';

class LsCommand extends Command {
  name = 'ls';
  desc = '显示当前目录文件列表';
  constructor() {
    super();
  }
  async action() {
    console.info(`正在打印当前文件目录...`);
  }
}

ava.test('ls命令', t => {
  program()
    .command(LsCommand)
    .parse(['test', 'ls']);
  t.pass();
});

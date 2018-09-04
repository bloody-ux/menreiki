#!/usr/bin/env node
const chalk = require('chalk');

const args = process.argv.slice(2);
// dev/build/debug always uses local modules
if (args.indexOf('build') >= 0 || args.indexOf('dev') >= 0 || args.indexOf('debug') >= 0) {
  const path = require('path');

  try {
    const localoc = require.resolve(path.join(process.cwd(), 'node_modules', 'menreiki', 'bin', 'menreiki.js'));
    if (__filename !== localoc) {
      console.log(chalk.yellow('script doesn\'t run with npm-script, trying to use local version `menreiki`'));
      require(localoc);
      return;
    }
  } catch (e) {
    console.error(e.stack);
    return;
  }
}

const program = require('commander');
const dev = require('../commands/dev');
const build = require('../commands/build');
const debug = require('../commands/debug');
const init = require('../commands/init');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .usage(chalk.magenta('[command] [options]'));

program
  .command('init')
  .description('`menreiki init` to create a project')
  .option('-p --plugin', 'generate plugin project')
  .action(init);

program
  .command('dev')
  .description('`menreiki dev` to start dev server, preferred to run with npm-script')
  .option('-p --production', 'use production config to run dev server')
  .action(dev);

program
  .command('debug')
  .description('`menreiki debug` to start debug process, preferred to run with npm-script')
  .option('-b --build', 'if `--build` is provided, debug with `menreiki build` instead of `menreiki dev` ')
  .action(debug);

program
  .command('build')
  .description('`menreiki build` to build assets to dist, preferred to run with npm-script')
  .option('-v --verbose', 'print detailed log to console')
  .action(build);

console.log(chalk.green(`${pkg.name}:  ${pkg.version}`));

program
  .parse(process.argv);

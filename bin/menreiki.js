#!/usr/bin/env node
const colors = require('colors');

const args = process.argv.slice(2);
// if not `init` cmd, always trying to using local version menreiki to
// prevent inconsistant menreiki versions between builds
if (args.indexOf('init') < 0) {
  const path = require('path');

  try {
    const localMenreiki = require.resolve(path.join(process.cwd(), 'node_modules', 'menreiki', 'bin', 'menreiki.js'));
    if (__filename !== localMenreiki) {
      console.log(colors.yellow('script doesn\'t run with npm-script, trying to use local version `menreiki`'));
      require(localMenreiki);
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
const init = require('../commands/init');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .usage(colors.magenta('[command] [options]'));

program
  .command('init')
  .description('`menreiki init` to create a project')
  .action(init);

program
  .command('dev')
  .description('`menreiki dev` to start dev server, preferred to run with npm-script')
  .option('-p --production', 'use production config to run dev server')
  .action(dev);

program
  .command('build')
  .description('`menreiki build` to build assets to dist, preferred to run with npm-script')
  .option('-v --verbose', 'print detailed log to console')
  .action(build);

program
  .parse(process.argv);

#!/usr/bin/env node
const program = require('commander');
const dev = require('../commands/dev');
const build = require('../commands/build');
const init = require('../commands/init');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .usage('[command] [options]');

program
  .command('dev')
  .description('`menreiki dev` to start dev server')
  .option('-p --production', 'use production config to run dev server')
  .action(dev);

program
  .command('build')
  .description('`menreiki build` to build assets to dist')
  .option('-v --verbose', 'print detailed log to console')
  .action(build);

program
  .command('init')
  .description('`menreiki init` to create a project')
  .action(init);

program
  .parse(process.argv);

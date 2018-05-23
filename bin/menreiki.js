#!/usr/bin/env node
const program = require('commander');
const dev = require('../commands/dev');

program
  .version('0.1.1')
  .usage('[command] [options]');

program
  .command('dev')
  .description('`menreiki dev` to start dev server')
  .option('-d --detail', 'which action to exec')
  .option('-p --picture', 'which action to exec')
  .action(dev);

program
  .parse(process.argv);

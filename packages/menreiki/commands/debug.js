const dev = require('./dev');
const build = require('./build');

const execArgv = [
  '--nolazy',
  '--inspect-brk=9229'
];

module.exports = function(cmd) {
  if (cmd.build) {
    build(null, execArgv);
  } else {
    dev(null, execArgv);
  }
};

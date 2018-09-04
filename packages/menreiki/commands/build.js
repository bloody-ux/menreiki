const cp = require('child_process');
const path = require('path');

function fork(execArgv = process.execArgv) {
  const child = cp.fork(
    path.resolve(__dirname, '../lib/server/webpack-build.js'),
    process.argv.slice(3),
    {
      execArgv
    }
  );

  // 编译时，子进程被杀，父进程一起退出
  child.on('close', () => {
    process.exit(0);
  });
}

module.exports = function(cmd, execArgv) {
  fork(execArgv);
};

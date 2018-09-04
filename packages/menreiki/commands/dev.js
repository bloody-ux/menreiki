const cp = require('child_process');
const path = require('path');
const gaze = require('gaze');
const chalk = require('chalk');

let child;

function fork(execArgv = process.execArgv) {
  child = cp.fork(
    path.resolve(__dirname, '../lib/server/webpack-dev.js'),
    process.argv.slice(3),
    {
      execArgv
    }
  );

  // 如果子进程被外界杀死，比如被进程管理器杀死，或者vscode debugger断开导致子进程被杀
  // 那么关闭父进程
  child.on('close', (code, signal) => {
    if (signal === 'SIGKILL') {
      process.exit(0);
    }
  });

  return execArgv;
}

function monitorConfig(execArgv) {
  gaze('./menreiki.config.js', function(err) {
    if (err) return;

    this.on('all', () => {
      console.log(chalk.magenta('Restarting...'));

      child.kill();
      // 等到child被关闭后，才能开启一个新的，否则调试端口未被释放
      child.on('close', (code, signal) => {
        // 如果是通过child.kill()杀死的，那么重启一个
        if (signal === 'SIGTERM') {
          fork(execArgv);
        }
      });
    });
  });
}

module.exports = function(cmd, execArgv) {
  monitorConfig(fork(execArgv));
};

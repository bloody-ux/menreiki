const emptyDir = require('empty-dir');
const chalk = require('chalk');
const path = require('path');
const copyDir = require('copy-dir');
const childProcess = require('child_process');

module.exports = function() {
  const cwd = process.cwd();
  const targetPath = cwd;
  const sourcePath = path.resolve(__dirname, '../plugin');

  if (!emptyDir.sync(targetPath)) {
    console.error(chalk.red('current directory is not empty, please empty the folder before executing the command'));
    return;
  }

  // copy other file to target path
  copyDir.sync(sourcePath, targetPath, (stat, filepath) => {
    const realPath = filepath.replace(sourcePath, '');
    console.log(chalk.magenta('generated: '), `${path.join(targetPath, realPath)}`);
    return true;
  });

  // start to install deps and devDeps
  console.log();
  console.log(chalk.magenta('generated plugin skeleton, start to install packages'));
  try {
    childProcess.spawnSync('tnpm', ['install'], {
      stdio: 'inherit',
    });
  } catch (ex) {
    childProcess.spawnSync('npm', ['install'], {
      stdio: 'inherit',
    });
  }

  // done
  console.log();
  console.log(chalk.magenta('all done'));
  process.exit(0);
};

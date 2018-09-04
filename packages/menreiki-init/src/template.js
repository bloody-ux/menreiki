const emptyDir = require('empty-dir');
const chalk = require('chalk');
const co = require('co');
const path = require('path');
const prompt = require('co-prompt');
const editJsonFile = require('edit-json-file');
const copyDir = require('copy-dir');
const fs = require('fs');
const childProcess = require('child_process');

function isOK(text) {
  if (text === '') return true;
  return /^y|yes|ok|true$/i.test(text);
}

module.exports = function(pkg) {
  const cwd = process.cwd();
  const targetPath = cwd;
  const sourcePath = path.resolve(__dirname, '../template');

  if (!emptyDir.sync(targetPath)) {
    console.error(chalk.red('current directory is not empty, please empty the folder before executing the command'));
    return;
  }

  co(function* () {
    console.log(
      chalk.green('This utility will walk you through creating the skeleton of a menreiki project.\nThe inputs are used to generate common items in package.json.\n'));

    const defaultStyle = text => chalk.cyan.bold(text);
    // name
    const defaultName = path.basename(cwd);
    const name = (yield prompt(`package name: (${defaultStyle(defaultName)})`)) || defaultName;

    // family
    const defaultFamily = defaultName;
    const family = (yield prompt(`family(gitlab group of the repository): (${defaultStyle(defaultFamily)})`)) || defaultName;

    // version
    const defaultVersion = '1.0.0';
    const version = (yield prompt(`version: (${defaultStyle(defaultVersion)})`)) || defaultVersion;

    // desc
    const description = yield prompt('description: ');

    // author
    const author = yield prompt('author: ');

    // liscence
    const defaultLicense = 'ISC';
    const license = (yield prompt(`version: (${defaultStyle(defaultLicense)})`)) || defaultLicense;

    // menreiki version
    const ocVersion = pkg.version;

    // generate content for package.json
    const file = editJsonFile(path.resolve(sourcePath, './package.json'));
    file.set('name', name);
    file.set('family', family);
    file.set('version', version);
    file.set('description', description);
    file.set('author', author);
    file.set('license', license);
    file.set('dependencies.menreiki', `^${ocVersion}`);

    console.log(file.get());
    console.log();

    const ok = yield prompt(chalk.yellow('Is this OK? (yes)'));
    if (!isOK(ok)) {
      console.log(chalk.red('Abort'));
      process.exit(0);
    }

    // copy pkg to target path
    const targetPkgPath = path.join(targetPath, 'package.json');
    fs.writeFileSync(targetPkgPath, JSON.stringify(file.get(), null, 2));
    console.log(`generated ${targetPkgPath}`);

    // copy other file to target path
    copyDir.sync(sourcePath, targetPath, (stat, filepath, filename) => {
      if (stat === 'file' && filename === 'package.json') {
        return false;
      }

      const realPath = filepath.replace(sourcePath, '');
      console.log(chalk.magenta('generated: '), `${path.join(targetPath, realPath)}`);
      return true;
    });

    // start to install deps and devDeps
    console.log();
    console.log(chalk.magenta('generated project skeleton, start to install packages'));
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
    console.log(chalk.magenta('all done, please run `npm start` to start'));
    process.exit(0);
  }).catch((ex) => {
    console.error(ex);
    process.exit(-1);
  });
};

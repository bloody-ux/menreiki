module.exports = function(pkg, type) {
  if (type === 'plugin') {
    require('./plugin')();
  } else {
    require('./template')(pkg);
  }
};

// commonjs module

// render react的element， 必须是一个id选择器
exports.elementId = '#app';

// dev server host, default: localhost
exports.host = 'localhost';

// dev server port, default: 3001，如果被占用，会自动递增
// 如果指定的端口<1024，那么启动是请使用`sudo npm start`
exports.port = 3001;

exports.plugins = [
  'menreiki-plugin-html',
  'menreiki-plugin-proxy',
  // ['menreiki-plugin-webpack', {
  //   webpack(webpackConfig) {
  //     console.log(webpackConfig);
  //   },
  //   babel(babelConfig) {
  //     console.log(babelConfig);
  //   },
  // }],
];

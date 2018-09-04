## 安装

``` bash
npm install -g menreiki
```

## 初始化一个oc项目

``` bash
menreiki init
```

## 开发

``` bash
npm start
```

> 注意不要直接运行`menreiki dev`，因为这样子会使用全局的`menreiki`安装包，而非本地的

## 构建发布资源

``` bash
npm run build
```

> 构建后会产生assets，以及`index.vm`， 可以将`index.vm`的内容放入到SOFA，

### 关于按需加载资源是的publicPath如何设置的问题

add more docs

## default menreiki.config.js

``` javascript

// commonjs module

// render react的element， 必须是一个id选择器
exports.elementId = '#app';

// 使用什么router，默认是browserRouter
exports.router = 'browserRouter';

// dev server host, default: localhost
exports.host = 'localhost'

exports.plugins = [
  ['menreiki-plugin-html', {
    // spm: {
    //   spmA: '<apos>',
    //   spmB: '<bpos>'
    // },
    // clue: '<pid>'
  }],
  'menreiki-plugin-proxy',
  // ['menreiki-plugin-webpack', {
  //   webpack: function(webpackConfig) {

  //   },
  //   babel: function(babelConfig) {

  //   }
  // }],
];

```
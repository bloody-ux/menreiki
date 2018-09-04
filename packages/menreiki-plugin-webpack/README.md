## menreiki的修改webpack及babel配置的插件

### 安装

`npm install menreiki-plugin-webpack -D`


### 使用配置

在`menreiki.config.js`中，添加如下代码：

``` javascript
exports.plugins = [
  ['menreiki-plugin-webpack', {
    webpack: function(webpackConfig) {
      // do something with webpackConfig
    },
    babel: function(babelConfig) {
      // do something with babelConfig
    }
  }]
];
```

### 如何区分环境

- 通过`process.env.NODE_ENV`来区分传入的配置是`dev`还是`prod`
- 通过`process.env.OC_ENV`来区分，当前是处于`menreiki dev`，还是`menreiki build`，从而知道是本地开发还是服务上构建
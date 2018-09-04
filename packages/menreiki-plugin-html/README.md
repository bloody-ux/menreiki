## oc的html入口文件生成

### 安装

`npm install menreiki-plugin-html -D`


### 使用配置

在`menreiki.config.js`中，添加如下代码：

``` javascript
exports.plugins = [
  ['menreiki-plugin-html', {
    spm: {
      spmA: '<apos>',
      spmB: '<bpos>'
    },
    clue: '<clue-pid>'
  }]
];
```

> 关于PC 自动spm埋点，可以参考[这篇文章](https://lark.alipay.com/openhome/docs/auto-tracert)
> 关于clue，请访问[clue官网](https://clue.alibaba-inc.com/)申请pid
> 由于默认oc自带了内联实现spm/clue的埋点的实现，这是提供的外置的实现，请按照需求选择，但是不能同时开启2个。


### 配置项

``` typescript

options: {
  clue?: string, // clue的pid，通过clue平台申请，不填写不启用
  spm?: { // spm自动埋点配置，根据文档https://lark.alipay.com/openhome/docs/auto-tracert 配置。不填写不启用
    spmA: string,
    spmB: string,
  },
  title?: string, // 页面标题，默认为空。一般不需要填写，因为routes配置会自动去填充当前路由下的title
  icon?: string, // 页面的icon，默认为蚂蚁金服logo
  charset?: string, // 页面编码，默认是utf-8
  template?: string | (styles, js, elementId, optional) => string // 页面模板，如果是string，那么代表是一个路径，会去路径读取对应的内容， 如果是一个函数，那么通过这个函数来产生对应的结果代码。
}

```

> 默认template的内容，请参考`./src/default.js`

> styles, js, elementId, optional结构：

- `styles`是的样式数组，内容为`["main.css"]`
- `js`是javascript数组，内容为`["main.js"]`
- `elementId`为配置的host dom，默认是`'#app'`
- `optional`是合并`icon`, `charset`, `title`，`cmsParseStatement`, `publicPath`的对象，其中`cmsParseStatement`是用于服务器构建时处理的。
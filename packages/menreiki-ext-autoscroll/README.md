## menreiki在路由变更时，自动将页面滚动到头部的扩展

### 安装

`npm install menreiki-ext-autoscroll -S`


### 使用配置

在`./src/config.js`中，添加如下代码：

``` javascript
import autoScroll from 'menreiki-ext-autoscroll';
export const extensions = [
  autoScroll(),
];
```

> 默认情况下，该扩展不会开启任何效果，只有在`./src/routes.js`的各个路由配置中，添加属性`autoScroll: true`才会在导航到该路由之后触发

### 参数Options

参数请参考[MDN scrollIntoView](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView)，注意对于不支持`scrollIntoViewOptions`的浏览器，默认会降级为参数`true`
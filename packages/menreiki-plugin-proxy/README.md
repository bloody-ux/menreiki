## menreiki的开发服务器代理能力支持，支持express类型的服务器

### 安装

`npm install menreiki-plugin-proxy -D`


### 使用配置

在`menreiki.config.js`中，添加如下代码：

``` javascript
exports.plugins = [
  'menreiki-plugin-proxy'
];
```

### 配置项

暂无

### 配置文件

> 请在项目的根目录添加`proxy.config.js`，如果插件添加到了`menreiki.config.js`，但是没有`proxy.config.js`那么会报错

典型格式：

``` javascript

module.exports = function(mockLocal) {
  return [
    [
      '**/*.json', // include， glob rule
      (req, res) =>
        mockLocal(req, res, { mockPath: '/mock', delay: 20 }),
      '**/*hot-update.json', // exclude
    ],
  ];
};

```

> 说明： 插件会根据配置的数组，按顺序进行查找匹配，一旦匹配就使用对应的处理函数（middleware)

#### 一个典型的配置

包含3个部分，分别对应数组的0，1，2元素：
- 匹配规则（基于glob表达式，使用`minimatch`包），必选项。 满足这个规则才可能使用对应的处理逻辑
- 处理逻辑，目前提供了2种: `mockLocal`和`mockRemote`，分别是module.exports对应函数的第一个参数和第二个参数
- 排除规则（基于glob表达式，使用`minimatch`包），非必选。 如果设置了这个规则，那么如果传入url满足了这个规则，这个配置也是不能被匹配的。

> 所以一个配置要被使用，需要满足： `匹配规则`匹配上，`排除规则`不匹配或者没设置

#### mockLocal

`mockLocal`指的是从本地读取mock数据进行返回，默认的`menreiki`项目采用这种方式

其签名为

``` javascript
function (req,
  res,
  options = {
    mockPath: '/mock',
    delay: 100,
    cors: true,
    exact: false
  }
) {

  }
```

所以我们在`proxy.config.js`的同样目录下添加一个`mock`目录，里面的文件格式对应的就是请求的接口。

比如请求了`/platform/getUser.json`，那么我们可以在`mock`目录下，新增子目录`platform`，然后在下面添加`getUser.json`文件。代理会自动将结果返回。

> 如果我们想要动态地根据输入去响应请求，那么可以将文件变为`getUser.js`。

这时候支持2种方式：
- 模块导出一个对象
- 模块导出一个函数

第一种方式下，我们可能不关注入参，只想动态随机产生结果。
第二种方式下，可能我们会关注输入的值，想要根据输入有不同的相应

举例来说：

``` javascript
module.exports = function(req, res, urlObject) {
  // urlObject是通过`url` npm包解析的包含query的对象
}

```

#### mockRemote

`mockRemote`指的是将请求代理到远程服务器上去

一个典型的使用方式：

``` javascript

module.exports = function(_, mockRemote) {
  return [
    [
      '**/*.json', // include， glob rule
      (req, res) =>
        mockRemote(req, res, { target: 'http://target.net' }),
      '**/*hot-update.json', // exclude
    ],
  ];
};

```

> 更多选项，请参考[http-proxy使用文档](https://www.npmjs.com/package/http-proxy)
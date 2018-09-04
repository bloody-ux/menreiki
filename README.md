## 准备工作

由于项目依赖于`lerna`，因此请先执行以下命令。[lerna文档直通车](https://lernajs.io)
``` bash
  npm install lerna -g
```

## 开发

``` bash
npm install
npm run install-deps
```

## 发布

``` bash
lerna publish
```

如果要发布特定某个包，而不是自动检测更新的方式，可以使用`lerna publish --force-publish=package-2,package-4`

## 文档

请参考[docs](./docs)
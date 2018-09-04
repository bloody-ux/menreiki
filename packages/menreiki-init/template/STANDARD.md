## 开发规范

> 当你接手项目时，无论服务端同学还是前端同学，不遵守规范，请马上制止。

### 前后端职能规范

- 服务端只处理接口，不处理任何页面的逻辑
- 任何页面相关，都放到前端代码库
- 如果某个功能需要服务端配合，首选方式是通过ajax接口支持

### 服务端接口规范

#### 返回格式

所有的接口返回必须符合以下数据结构：
``` json
{
  "stat": "ok" | "failed" | "deny",
  "code": string?,
  "data": object,
  "msg": string?
}
```

#### 接口URL规范

- 接口的URL必须以`/api`开头，如果接口是需要登录鉴权的，那么以`/api/admin`开头
- 接口以RESTful的形式暴露，不采用`.json`后缀


#### 标准接口定义

##### 分页数据结构举例

入参:

- pageSize
- pageNum

出参：

``` json
{
  "stat": "ok",
  "data": {
    "pageData": [
      {
        ...
      }
    ],
    "pageNum": 1,
    "paegSize": 10,
    "totalNumber": 15
  }
}
```

### 前端规范

- 组件文件命名以大写开头，且以`.jsx`作为后缀，比如`Home.jsx`。如果放到文件夹下面，那么文件夹大写，文件夹内部暴露`index.jsx`
- 此外所有的文件命名都采用驼峰式命名法(CamelCase)。
- dva model的引入都放入到页面对应的组件上，通过`preInit`静态方法引入。
- 禁用dva model的`subscriptions`属性，更不要在内部去调用`history.listen`方法，因为这样会导致model依赖router的路径，不利于维护。 转而采用在页面组件上，通过`init`静态方法来发请求。 `init`方法在每次路由命中时触发。
- api接口的地址，都在写对应的service文件内，**不要**专门抽取一个**api.js**来维护，原因是service和api是1对1的，同时放一起可以让服务更加内聚。也避免了中心化的**api.js**会造成merge conflict的问题。
- 通用的内容，比如外部系统链接等请专门写到一个文件中，不要分散在各个地方。

## babel stage-0-3的oc配置

### 使用

默认被`menreiki`使用，无需显式安装。

### 默认包含的babel插件特性：

> 参考自https://github.com/babel/babel/tree/48fe688a10d83486defdda223ac8d8d88057975d/packages/babel-preset-stage-0

// stage-3
- "@babel/plugin-proposal-json-strings"
- ["@babel/plugin-proposal-class-properties", { "loose": false }]
- "@babel/plugin-syntax-dynamic-import"

// stage-2
- ["@babel/plugin-proposal-decorators", { "legacy": true }]
- "@babel/plugin-proposal-export-namespace-from"
- "@babel/plugin-proposal-numeric-separator"

// stage-1
- "@babel/plugin-proposal-export-default-from"

// stage-0
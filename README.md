# 构建步骤

### step1：初始化 package.json

```
yarn init -y//-y会跳过填充步骤
```

### step2:安装

- webpack：必备
- webpack-cli：必备（打包使用）
- webpack-dev-server：用作搭建开发服务器
- webpack-merge：用于合并多个 webpack 配置
- html-webpack-plugin：用于根据模板生成 index.html 同时将打包的 js 引入
- clean-webpack-plugin：用于将每次打包前，先删除原打包文件

```
yarn add webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin clean-webpack-plugin -D
```

### step3:搭建开发和打包基本环境

- 创建 src 目录和 index.js 作为打包入口文件、index.html 作为模板,
- 创建 wepack 目录和 webpack.config.xxx 系列文件存放各种环境配置文件
- 配置 package.json 中的 scripts 字段，内容见文件
- 配置 webpack.config.base.js，内容见文件
- 配置 webpack.config.dev.js，内容见文件
- 配置 webpack.config.prod.js，内容见文件

### step4:处理 css

- css-loader：负责解析 css 中的@import 语法
- style-loader：将 css 转为 js 的可执行模式，形成内链模式
- mini-css-extract-plugin：将 css 抽离成一个文件，形成外链模式，与 style-loader 互斥（默认未开启hmr功能，需要配置）
- optimize-css-assets-webpack-plugin：配合 mini-css-extract-plugin，进行 css 的代码压缩（需要在 optimization 中配置，一旦配置，webpack 对 js 默认的压缩就会失去作用，需要手动对 js 进行压缩->uglifyjs-webpack-plugin）
- postcss-loader + autoprefixer：用于自动添加浏览器前缀（1.要在 css-loader 之前使用，2.在 postcss-loader 使用 autoprefixer 插件，3.需要设置.browserslistrc 文件，或者在 package.json 中配置 browserslist 字段）

```
yarn add css-loader style-loader -D
```

### step5:处理 less（或者 scss(node-sass sass-loader)、stylus(stylus stylus-loader)）

- less-loader：将 less 解析为 css（需要依赖第四步，即 css-loader 和 style-loader）

```
yarn add less less-loader -D
```

### step5:处理 js(降级之类)

- babel-loader：转换器
- @babel/core：babel 核心模块
- @babel/preset-env：语法降级
- @babel/plugin-proposal-decorators、@babel/plugin-proposal-class-properties、@babel/polyfill：其他 js 语法转换插件按需添加
- @babel/plugin-transform-runtime + @babel/runtime：保证高级语法可用于运行时

### step6：使用 eslint

- eslint eslint-loader babel-eslint
- 去 eslint 官网（http://eslint.cn/demo/）定制一份规范下载下来(要将eslintrc.json改为.eslintrc.json,否则无效果)
  > Ps：<br/>
  >
  > > pre-commit/husty：git 提交前进行代码检测<br/>
  > > eslint 与 prettier 冲突，安装 prettier eslint 插件

### step7：处理图片（js（require 或 import 引入）/css/html 中都可能会引用）

- file-loader：复制文件到打包目录，并修改其名称
- url-loader：根据图片大小做 base64 缓存

# 其他问题

1. 将某个库挂载 window 上，
   - 使用 expose-loader 的内联形式或者在 webpack 中配置
2. 在每个模块上注入一个库：new webpack.ProvidePlugin({\$:jquery}):
3. cdn 形式使用某个库：在 externals 中声明 externals:{jquery:$}:表示外部引用，无需打包（虽然在代码中使用了import $ from jquery）
4. html 中应用图片：html-withimg-loader
5. 将静态文件分类到不同位置
   - 图片：在 url-loader 中，添加 options 的 outputPath 属性（还可以设置 publicPath，用于设置图片的域名）
   - css：在 MiniCssExtractPlugin 中设置 filename 时路径上带上
   - js：在 output 上添加路径
6. 多页应用：

- 指定多个入口文件
- 指定出口文件的 filename 时，用[name]这种占位符形式(此处的 name 为多入口的 key)
- 调用多次在 HtmlWebpackPlugin，并设置其 chunk 属性，指定所需的出口文件

7. devtool 的值有哪些？

- source-map：生成单独文件，会标识报错行和列
- eval-source-map：不会生成单独文件，但是会标识报错的行和列
- cheap-module-source-map：生成单独文件，但不会标识列
- cheap-module-eval-source-map:不会生成单独文件，也不会标识列

8. 实时打包：设置 watch、watchOptions
9. 添加版权声明 banner：使用 webpack 内置的 bannerPlugin
10. 复制内容：copy-webpack-plugin
11. webpack 解决跨域问题

- devServer 的 proxy 字段
- devServer 的 before 字段，对本地服务劫持模拟
- 在服务端中启动 webpack，即后台和前台使用一个服务

12. 设置别名：在 resolve 的 alia 中设置
13. 引入文件时，去除后缀名：resolve 的 extensions
14. 设置环境变量：webpack-define-plugin（注意变量需要 json.stringify 转义）
15. webpack 的优化：

- 在 module 中使用 noParse 字段
- rule 中设置 exclude 和 include 字段
- 使用 webpack 的内部插件 ignore-plugin
- 将第三方库单独打包：动态链接库：使用 webpack 的内部插件 dll-plugin 打包，使用 dll-reference-plugin 引用
- 多线程打包：happy-webpack：loader+plugin 的形式
- webpack 内部优化：
  - tree-shaking（production 模式，且为 es6 的模块化模式才会进行）
  - scope hosting：作用域提升：console.log(1+2+3),会自动简化为 console.log(6)

16. 抽取公共代码：只适用于多页面应用

```
    optimization:{
        //以前的commonChunkPlugins功能
        splitChunks:{//分割代码块
            cacheGroups:{//缓存组
                common:{//自己的公共模块
                    chunks:'initial',
                    mineSize:0,
                    minChunks:2
                },
                vendor:{//第三方的公共模块
                    priority:1,
                    test:/node_modules/,
                    chunks:'initial',
                    mineSize:0,
                    minChunks:2
                }
            }
        }
    }
```

17. 懒加载：代码中，使用 import()语法（本质是 jsonp，返回值为 promise，返回值为 default 形式），打包时使用@babel/plugin-syntax-dynamic-import 进行解析
18. 热更新：
    1）devServer 中配置 hot，
    2）plugins 中使用 webpack 的内置模块，webpack.HotModuleReplacementPlugin
    3）入口文件中添加：`if (module.hot) {module.hot.accept()}`
19. 集成 ts

- yarn add typescript（tslint）
- tsc --init
- 笔记

> let v:void;//void 类型的值可以是 undefined（非严格模式时也可赋值 null）
> let a = ():never=>{}//当函数抛出错误或者死循环时，返回值类型为 never
> (a as string) = '';//类型断言，或者，(<string> a) = ''
> 函数重载
> 泛型：使多个变量保持为一种类型（泛型约束：使用<T extends 某种类型>）
> keyof：某个类型的所有 key 的集合
> es6 的类只有静态方法，没有静态属性，不支持私有属性和方法
> super 作为对象时，在在普通方法中代表父类的原型对象，在静态方法中，代表父类
> protected：修饰方法可以访问，属性则不可以，修饰 constructor 的时候，标识该类只能被继承不能被实例化
> ts 中，构造函数参数被修饰符修饰之后，会变为实例的属性
> 类型保护：typeof instanceof

20. NODE_ENV 问题
    1）通过 mode 定义或者 definePlugin 定义，process.env.NODE_EVN 只可以在页面中获取到（因为页面中没有 process 全局变量，所以在编译阶段就将 process.env.NODE_EVN 替换为具体 mode 值或者 definePlugin 中定义的 process.env.NODE_ENV 属性，而不是替换为 node 进程中 process.env.NODE_ENV 这个变量），在 config 中无法获取到
    2）通过'NODE_ENV=production webpack --config webpack.config.prod.js'这种形式定义，可以在 config 中获取到，但是在页面环境获取不到，同时为了兼容 windows 需要使用 cross-env 来定义

const path = require("path"); //node的内置对象
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AutoPreFixer = require("autoprefixer");

module.exports = {
  entry: path.resolve(__dirname, "../src/index.js"), //入口
  output: {
    //出口
    filename: "assets/js/bundle.[hash:8].js", //出口文件名,[]:占位符，8：截取前8位
    // filename: "[name].[hash:8].js", //多页应用时
    path: path.resolve(__dirname, "../dist"), //出口文件路径
    // library:'',//将打包结果作为一个变量导处去
    // libraryTarget:'commonjs'
  },
  // watch:true,//自动打包相关
  // watchOptions:{
  //   poll:1000,//每秒1000次轮询
  //   aggregateTimeout:500,//防抖间隔
  //   ignored:/node_modules/ //忽略的文件夹
  // },
  resolve: {
    modules: [path.resolve("node_modules")], //设置modules的查找范围
    // maiFileds:['style','main'],//设置索引入module的package.json中的字段所代表文件的优先顺序
    // mainFilds:[],//同上
    // extensions: [
    //   //当引入文件没有扩展名时，会依次按照数组顺序尝试引入下列文件
    //   ".js",
    //   ".css",
    //   ".json",
    // ],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  module: {
    //模块，使用各种loader处理各种类型文件，使其可以形成依赖关系
    // noParse:/jquery/,//打包时不解析此模块的依赖关系
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 8 * 1024,
            outputPath: "assets/image",
          },
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: "eslint-loader",
        },
        enforce: "pre", //规定匹配顺序，pre -> inline -> normal ->post
        include: path.resolve(__dirname, "../src"), //匹配包括
        exclude: /node_modules/, //匹配去除
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
        include: path.resolve(__dirname, "../src"), //匹配包括
        exclude: /node_modules/, //匹配去除
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], //执行顺序是从右往左，从下往上(多个规则匹配到css时)
        // use: [{//每个loader也可以适用对象，可以扩展更多配置
        //     loader: 'css-loader',
        //     options:{
        //           insertAt:'top'//插入位置
        //     }
        // }]
      },
      {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: (loader) => [AutoPreFixer()],
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    //插件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"), //模板地址
      filename: "index.html", //生成的文件名,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
      hash: true, //表示引入的js文件路径后会添加'?hash',而不是index.html添加hash
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "assets/css/index.css", //抽离的css文件名
    }),
  ],
};

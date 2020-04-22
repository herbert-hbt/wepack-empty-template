let merge = require("webpack-merge");
let baseConfig = require("./webpack.config.base");
let webpack = require("webpack");
const serveConfig = merge(baseConfig, {
  mode: "development", //模式为开发
  devtool: "source-map", //产生map文件的格式，方便调试
  devServer: {
    //本地服务的相关配置,配置项：https://www.webpackjs.com/configuration/dev-server/
    contentBase: "../dist", //告诉服务器去哪里找文件，只有项目中依赖静态文件时才需要
    host: "0.0.0.0", //此配置若是不配，本地的局域网ip无法访问服务
    port: 4500, //服务器端口
    progress: true, //进度条
    hot: true,
    // open:true,//是否自动打开浏览器
    //compress:true,//是否压缩
    // proxy: {
    //   //当访问webpack-dev-server所起的服务器时，会被代理到另一台服务器
    //   "/api": {
    //     target: "http://...",
    //     pathRewrite: { "/api": "" },//将路径替换
    //   },
    // },
    before(app) {
      //劫持本地服务
      app.get("api", (req, res) => {
        //模拟发送数据
        res.json({ name: "" });
      });
    },
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
});

module.exports = serveConfig;

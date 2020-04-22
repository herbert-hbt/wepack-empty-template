let merge = require("webpack-merge");
let baseConfig = require("./webpack.config.base");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  optimization: {
    minimizer: [
      new UglifyjsWebpackPlugin({
        cache: true,
        sourceMap: true,
        parallel: true,
      }), //如果没配置此项，webpack会默认压缩，配置之后需要手动
      new OptimizeCssAssetsWebpackPlugin(),
    ],
  },
});

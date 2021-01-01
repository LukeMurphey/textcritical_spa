const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require("terser-webpack-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  /*
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  */
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      exclude: ['bundle.js'],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  output: {
    publicPath: '/media/dist/',
  },
});

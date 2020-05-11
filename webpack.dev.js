const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: './dist',
    port: 8081,
    historyApiFallback: {
      disableDotRule: true,
      index: 'index.html',
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        secure: false,
      },
      '/work_image': {
        target: 'http://127.0.0.1:8080',
        secure: false,
      },
      'download/work': {
        target: 'http://127.0.0.1:8080',
        secure: false,
      },
    },
  },
});

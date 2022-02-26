const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Use this endpoint if you are connecting to the localhost running the textcritical backend
const localEndpoint = {
  target: 'http://127.0.0.1:8080',
  secure: false,
};

// Use this endpoint if you are connecting to the publicly deplyed version of TextCritical
const remoteEndpoint = {
  target: 'https://textcritical.net:443',
  secure: true,
  changeOrigin: true,
};

// Use either localEndpoint or remoteEndpoint
const endpoint = remoteEndpoint;

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
      '/api': endpoint,
      '/work_image': endpoint,
      'download/work': endpoint,
    },
  },
});

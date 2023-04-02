/**
 * The dev server can be changed to use a publicly available version of TextCritical or a local
 * version of a server. Make a file at webpack.config.json with the following to have the frontend
 * talk to a local server:
 * 
 *      {
 *        "endpoint": "local"
 *      }
 */

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

let config = null;

try {
  config = require('./webpack.config.json');
  console.log("Loaded config from the local config");
} catch (error) {
  // Default to using a public server
  config = {
    "endpoint": "remote"
  };
  console.log("No local config found");
}

// Use this endpoint if you are connecting to the localhost running the textcritical backend
const localEndpoint = {
  target: 'http://127.0.0.1:8080',
  secure: false,
};

// Use this endpoint if you are connecting to the publicly deployed version of TextCritical
const remoteEndpoint = {
  target: 'https://textcritical.net:443',
  secure: true,
  changeOrigin: true,
};

// Use either localEndpoint or remoteEndpoint
const endpoint = config.endpoint === 'local' ? localEndpoint : remoteEndpoint;

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
      '/account': endpoint,
    },
  },
});

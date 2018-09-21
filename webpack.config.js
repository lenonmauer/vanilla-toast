const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/vanilla-toast.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'vanilla-toast.bundle.min.js',
  },
  devtool: 'source-map'
};

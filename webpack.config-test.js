var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');

module.exports = {
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: nodeExternals(),
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader?plugins=rewire',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
  ],
  devtool: 'inline-source-map'
};

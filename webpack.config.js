var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'redux-oidc.js',
    libraryTarget: 'amd'
  },
  externals: {
    'react': 'React'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({comments: false})
  ]
};

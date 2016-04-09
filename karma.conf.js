// Karma configuration
// Generated on Fri Apr 08 2016 20:40:17 GMT+0200 (W. Europe Summer Time)
var webpack = require('karma-webpack');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    plugins: [webpack, 'karma-mocha', 'karma-phantomjs-launcher', 'karma-coverage'],


    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests/*.test.js'
    ],

    preprocessors: {
      'tests/*.test.js': ['webpack']
    },

    webpack: {
     module: {
       loaders: [{
         test: /\.(js|jsx)$/, exclude: /(bower_components|node_modules)/,
         loader: 'babel-loader'
       }],
       postLoaders: [{
         test: /\.(js|jsx)$/, exclude: /(node_modules|bower_components|tests)/,
         loader: 'istanbul-instrumenter'
       }]
     }
   },

   webpackMiddleware: { noInfo: true },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    node: {
      fs: "empty"
    },

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

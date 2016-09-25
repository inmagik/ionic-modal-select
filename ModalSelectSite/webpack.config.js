var webpack = require("webpack");

module.exports = {
  devtool: 'sourcemap',
  output: {
    filename: 'ionic-modal-select-site.js'
  },
  plugins : [

  ],
  module: {
    loaders: [
       { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'babel' },

    ],

  }
};

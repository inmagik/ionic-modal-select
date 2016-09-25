module.exports = {
  devtool: 'sourcemap',
  output: {
    filename: 'ionic-modal-select.js'
  },
  module: {
    loaders: [
       { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
       //{ test: /\.html$/, loader: 'raw' },
       //{ test: /\.css$/, loader: 'style!css' },

    ]
  }
};

var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var addsrc = require('gulp-add-src');
var replace = require('gulp-replace');
var jsifyTemplates = require('gulp-jsify-html-templates');
var uglify = require('gulp-uglify');
var order = require("gulp-order");
var plumber = require("gulp-plumber");

var webpack = require('webpack-stream');
// Import at the top of the file
var karma = require('karma').Server;


var paths = {
  es6: ['./src/*.js'],
  webpack: ['./src/main.js'],
  templates : ['./src/*.html'],
  output: './dist',
};


// use webpack.config.js to build modules
gulp.task('webpack', () => {
  return gulp.src(paths.webpack)
    .pipe(plumber())
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest(paths.output));
});

/**
* Test task, run test once and exit
*/
gulp.task('test', function(done) {
    var config = {
        configFile: __dirname + '/tests/my.conf.js',
        singleRun: true
    };
    var server = new karma(config);
    server.start();
});



gulp.task('css-modal-select', function() {
    return gulp.src( './src/ionic-modal-select.css')
    .pipe(gulp.dest('./dist/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./dist/'))

});


gulp.task('watch', function() {
  gulp.watch([paths.es6, paths.templates], ['webpack']);

});

gulp.task('default', ['webpack']);

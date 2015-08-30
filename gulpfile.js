var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var addsrc = require('gulp-add-src');
var replace = require('gulp-replace');
var jsifyTemplates = require('gulp-jsify-html-templates');
var uglify = require('gulp-uglify');
var order = require("gulp-order");


gulp.task('modal-select', function() {
    return  gulp.src( [
      './src/*.html',
      
      ])
    .pipe(jsifyTemplates())
    .pipe(replace("htmlTemplates", 'modalSelectTemplates'))
    .pipe(concat('templates.js'))
    .pipe(addsrc('src/banner.js'))
    .pipe(addsrc('src/ionic-modal-select.js'))
    .pipe(order(['src/banner.js', 'templates.js', 'src/ionic-modal-select.js']))
    .pipe(concat('ionic-modal-select.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify({mangle:false}))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist/'))

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
  gulp.watch(['./src/*.*'], ['modal-select']);

});

gulp.task('default', ['modal-select']);


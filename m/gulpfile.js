
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload');

gulp.task('compress', function () {
  return gulp.src('./src/js/*.js')
  .pipe(uglify())
  .pipe(rename('.min'))
  .pipe(gulp.dest('./dist/js/'));
});

// gulp.task('hi', function () {
//   console.log('111');
// });

//样式
gulp.task('styles', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opear 12.1', 'ios 6', 'andriod 4'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

//脚本
gulp.task('scripts', function () {
  return gulp.src('./src/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

//图片
gulp.task('images', function () {
  return gulp.src('./src/images/*')
    .pipe(cache(imagemin( { optimizationLevel: 3, progressive: true, interlaced: true } )))
    .pipe(gulp.dest('./dist/images'))
    .pipe(notify( { message: 'Images task complete' } ));
});

//清理
gulp.task('clean', function () {
  return gulp.src(['./dist/css', './dist/js', './dist/images'], {read: false})
    .pipe(clean());
});

//预设任务
gulp.task('default', ['clean'], function () {
  gulp.start('styles' , 'scripts', 'images');
});

//看守
gulp.task('watch', function () {
  // listen sass
  gulp.watch('./src/sass/*.sass', ['styles']);
  //listen js
  gulp.watch('./src/js/*.js', ['scripts']);
  //listen images
  gulp.watch('./src/images/*', ['images']);
  //create live reload
  var server = livereload();
  // list ls->dist , livereload
  gulp.watch(['./dist/**']).on('change', function (file) {
    server.changed(file.path);
  });
});

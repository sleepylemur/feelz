var gulp = require('gulp');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('servertests', function() {
  process.env.NODE_ENV = 'testing';
  return gulp.src('test/**/*.js', {read: false})
    .pipe(mocha());
});

//concatenates front-end js files into a single file so the browser needs only one require
gulp.task('scripts', function(){
  return gulp.src(['public/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/build/'));
});

gulp.task('watch_scripts', function(){
  gulp.watch(['public/js/**/*.js'], ['scripts']);
})

gulp.task('watch', function() {
  gulp.watch(['lib/**/*.js','test/**/*.js'], ['servertests']);
});

gulp.task('seed', function() {
});

gulp.task('default', ['watch']);

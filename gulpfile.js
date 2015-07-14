var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('servertests', function() {
  process.env.NODE_ENV = 'testing';
  return gulp.src('test/**/*.js', {read: false})
    .pipe(mocha());
});

gulp.task('watch', function() {
  gulp.watch(['lib/**/*.js','test/**/*.js'], ['servertests']);
});

gulp.task('default', ['watch']);

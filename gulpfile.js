var gulp = require('gulp');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

gulp.task('e2etests', function () {
  var protractor = spawn('protractor',['protractor.conf.js'],{stdio: 'inherit'});
});

gulp.task('alltests', ['servertests','e2etests']);

gulp.task('servertests', function() {
  process.env.NODE_ENV = 'testing';
  return gulp.src('test/*.js', {read: false})
    .pipe(mocha());
});

//concatenates front-end js files into a single file so the browser needs only one require
gulp.task('scripts', function(){
  if (process.env.NODE_ENV === 'production') {
    return gulp.src(['public/js/**/*.js', '!public/js/vendor/*'])
      .pipe(concat('bundle.js'))
      .pipe(uglify())
      .pipe(gulp.dest('public/build/'));
  } else {
    return gulp.src(['public/js/**/*.js', '!public/js/vendor/*'])
      .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('public/build/'));
  }
});

gulp.task('styles', function(){
  return gulp.src(['public/css/materialize-src/sass/*.scss', 'public/css/sass/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/build'));
});
gulp.task('build', ['styles','scripts']);

// gulp.task('watch_scripts', function(){
// });

gulp.task('watch', function() {
  // gulp.watch(['lib/**/*.js','test/**/*.js'], ['servertests']);
  gulp.watch(['public/js/**/*.js'], ['scripts']);
  gulp.watch(['public/css/materialize-src/sass/components/*.scss', 'public/css/sass/*.scss'], ['styles']);
});

gulp.task('seed', function() {
});

gulp.task('default', ['watch']);

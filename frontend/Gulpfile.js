// Load Gulp and your plugins
var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    open    = require('gulp-open');
    stylus  = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    include = require('gulp-include'),
    react   = require('gulp-react'),
    uglify  = require('gulp-uglifyjs');

var paths = {
    styles: 'app/sass/**/*',
    react:  'app/jsx/**/*.jsx'
};

// Connect task
gulp.task('connect', function() {
  connect.server({
    root: __dirname + '/',
    port: 5000,
    livereload: true
  });
});

// open task
gulp.task('open',function() {
    var options = {
        url: "http://localhost:5000",
        app: "Google Chrome Canary"
    };
    gulp.src("./index.html")
      .pipe(open('', options));
})

// React task
gulp.task('react', function () {
    gulp.src('./app/jsx/main.jsx')
        .pipe(include({extensions: 'jsx'}))
        .pipe(react())
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js'))
        .pipe(connect.reload());
});

// Stylus task
gulp.task('sass', function () {
    gulp.src('./app/sass/*.scss')
        .pipe(plumber())
        .pipe(stylus({
            use: ['nib'], 
            set: ['compress']
        }))
        .pipe(gulp.dest('./assets/css'))
        .pipe(connect.reload());
});

// Watch task
gulp.task('watch', function () {
    gulp.watch(paths.styles, ['sass']);
    gulp.watch(paths.react, ['react']);
});

// Set default task
gulp.task('default', ['connect', 'sass', 'react', 'watch']);
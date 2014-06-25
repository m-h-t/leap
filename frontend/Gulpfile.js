// Load Gulp and your plugins
var gulp           = require('gulp'),
    connect        = require('gulp-connect'),
    open           = require('gulp-open');
    sass           = require('gulp-sass'),
    minifyCSS      = require('gulp-minify-css')
    plumber        = require('gulp-plumber'),
    include        = require('gulp-include'),
    gulpBowerFiles = require('gulp-bower-files'),
    concat         = require('gulp-concat'),
    react          = require('gulp-react'),
    uglify         = require('gulp-uglifyjs');

var paths = {
    styles: 'app/sass/**/*',
    react:  'app/jsx/**/*'
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
gulp.task('open-html',function() {
    var options = {
        url: "http://localhost:5000",
        app: "Google Chrome Canary"
    };
    gulp.src("./index.html")
      .pipe(open('', options));
})

// merge bower files
var mergeBowerFiles = function () {
    var stream = gulpBowerFiles({paths: {
        bowerDirectory: './app/bower_components',
        bowerJson: './app/bower.json'
    }})
        .pipe(concat('vendor.js'));
    return stream;
}
gulp.task('bower', function () {
    mergeBowerFiles()
    .pipe(gulp.dest('./assets/js'));
});
gulp.task('bower-uglify', function () {
    mergeBowerFiles()
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'));
});

// React tasks
var precompileReact = function () {
    var stream = gulp.src('./app/jsx/main.jsx')
        .pipe(plumber())
        .pipe(include({extensions: ['jsx','js']}))
        .pipe(react());
    return stream;
};
gulp.task('react', function () {
    precompileReact()
        .pipe(gulp.dest('./assets/js'))
        .pipe(connect.reload());
});
gulp.task('react-uglify', function () {
    precompileReact()
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js'))
});

// Stylus task
var precompileSass = function () {
    var stream = gulp.src('./app/sass/*.scss')
        .pipe(plumber())
        .pipe(sass())
    return stream;
}
gulp.task('sass', function () {
   precompileSass()
        .pipe(gulp.dest('./assets/css'))
        .pipe(connect.reload());
});
gulp.task('sass-minify', function () {
   precompileSass()
        .pipe(minifyCSS())
        .pipe(gulp.dest('./assets/css'))
});

// Watch task
gulp.task('watch', function () {
    gulp.watch(paths.styles, ['sass']);
    gulp.watch(paths.react, ['react']);
});

// Set default task
gulp.task('default', ['connect', 'sass', 'bower', 'react', 'watch']);

// task that also opens the page
gulp.task('open', ['connect', 'open-html', 'sass', 'react', 'watch']);

// task that minifies the code
gulp.task('production', ['sass-minify', 'react-uglify', 'bower-uglify']);
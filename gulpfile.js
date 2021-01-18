const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imgMin = require('gulp-imagemin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const cleaner = require('gulp-clean');
gulp.task('htmlBuild', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream())
});
gulp.task('cssBuild', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 8 versions'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
});
gulp.task('jsBuild', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream())
});
gulp.task('libs:js', function () {
    return gulp.src([
        './node_modules/jquery/dist/jquery.js',
    ])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream())
});
gulp.task('image:minify', function () {
    return gulp.src('src/img/**/*.*')
        .pipe(imgMin())
        .pipe(gulp.dest('dist/img-min'))
        .pipe(browserSync.stream())
});
gulp.task('build', gulp.series(
    'htmlBuild',
    'cssBuild',
    'jsBuild',
    'image:minify',
    'libs:js',
));
gulp.task('dev', function () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    return gulp.watch(
        'src/**/*.*',
        gulp.series(
            'htmlBuild',
            'cssBuild',
            'jsBuild',
        )
    )
});

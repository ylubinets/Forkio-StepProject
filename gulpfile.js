let sourceFolder = "./dist";
let devFolder = "./src";

const path = {
    dist: {
        css: sourceFolder + "/css/",
        js: sourceFolder + "/js/",
        img: sourceFolder + "/img/",
    },

    src: {
        scss: devFolder + "/scss/style.scss",
        js: devFolder + "/js/*.js",
        img: devFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    watchers: {
        scss: devFolder + "/scss/**/*.scss",
    },
    clean: sourceFolder,
};

const gulp = require("gulp"),
    clean = require("gulp-clean"),
    sass = require("gulp-sass"),
    browserSync = require("browser-sync").create(),
    cleanCSS = require("gulp-clean-css"),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    imagemin = require("gulp-imagemin");

const { src, dest, watch, parallel, series } = require("gulp");

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        port: 5000,
        notify: false,
    });

    watch(path.watchers.scss, style).on("change", browserSync.reload);
    watch(path.src.js, scripts).on("change", browserSync.reload);
    watch(path.src.img, img).on("change", browserSync.reload);
    watch("./*.html").on("change", browserSync.reload);
};

const cleanDist = () =>
    src(path.clean, { allowEmpty: true }, { read: false }).pipe(clean());

const style = () =>
    src(path.src.scss)
        .pipe(concat("styles.min.css"))
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 3 versions"],
            })
        )
        .pipe(cleanCSS({ compatibility: "ie8" }))
        .pipe(dest(path.dist.css))
        .pipe(browserSync.stream());

const scripts = () =>
    src(["src/js/script.js"])
        .pipe(concat("scripts.min.js"))
        .pipe(uglify())
        .pipe(dest(path.dist.js))
        .pipe(browserSync.stream());

const img = () =>
    src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3,
            })
        )
        .pipe(dest(path.dist.img))
        .pipe(browserSync.stream());

exports.cleanDist = cleanDist;
exports.style = style;
exports.scripts = scripts;
exports.img = img;
exports.watcher = watcher;
exports.build = series(cleanDist, parallel(style, scripts, img));
exports.dev = watcher;
exports.clean = cleanDist;
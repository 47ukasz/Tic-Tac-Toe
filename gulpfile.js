const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const kit = require('gulp-kit');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const paths = {
    sass: './src/sass/**/*.scss',
    sassDest: './dist/css',
    js: './src/js/**/*.js',
    jsDest: './dist/js',
    img: './src/img/*',
    imgDest: './dist/img',
    dist: './dist',
    html: './html/**/*.kit'
}

const watchSass = (done) => {
    src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(paths.sassDest));
    done()
}

const javascipt = (done) => {
    src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(paths.jsDest));
    done()
}

const minImage = (done) => {
    src(paths.img)
        .pipe(imagemin())
        .pipe(dest(paths.imgDest));
    done()
}

const cleanStuff = (done) => {
    src(paths.dist, { read: false })
        .pipe(clean())
    done()
}

const handleKits = (done) => {
    src(paths.html)
        .pipe(kit())
        .pipe(dest('./'));
    done()
}

const startBrowserSync = (done) => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    done()
}

const watchForChanges = (done) => {

    watch('./*.html').on('change', reload)
    watch([paths.html, paths.sass, paths.js], parallel(handleKits, watchSass, javascipt)).on('change', reload)
    watch(paths.img, minImage).on('change', reload)
    done()
}

const mainFunctions = parallel(handleKits, watchSass, javascipt, minImage)
exports.default = series(mainFunctions, startBrowserSync, watchForChanges)
exports.cleanStuff = cleanStuff
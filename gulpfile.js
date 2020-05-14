'use strict';

// all plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const webpack       = require('webpack');
const webpackStream = require('webpack-stream');


// Expose the sas to css task
function sassworkflow() {
    return gulp
        .src('./sass/**/*.scss')
        // tasks go here
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
};

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp sassworkflow
exports.sassworkflow = sassworkflow;

function lint() {
    return gulp
        .src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
};
exports.lint = lint;

// Concatenate & Minify JS
function scripts() {
    return gulp
        .src([
            // 'node_modules/jquery/dist/jquery.js',
            './js/*.js'
        ])
        .pipe(webpackStream(require('./webpack.config.js')))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({
             stream: true
         }))
};
exports.scripts = scripts;


function watchtask(){
    browserSync.init({
        server: {
           baseDir: "./",
           index: "/index.html"
        }
    });

    gulp.watch( '.sass/**/*.sass', sassworkflow );
    gulp.watch( '.js/*.js', gulp.parallel( scripts, lint) );
}

// Expose the task by exporting it
exports.watchtask = watchtask;

// build the parallal task
const build = gulp.parallel(sassworkflow, scripts);

gulp.task('default', gulp.series(build, watchtask));
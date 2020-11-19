'use strict';

const gulp = require('gulp');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
let cleanCSS = require('gulp-clean-css');
const gaze = require('gaze');
let webpack = require("webpack");
let plumber = require("gulp-plumber");
let reload   = require('gulp-livereload');

gulp.task('less', function () {
    reload.listen();

    gaze('public/css/**/*.less', {cwd: './'}, function () {
        this.on("all", function (event, filePath) {
            console.log(filePath + " was " + event);
            return gulp.src('public/css/style.less')
                .pipe(plumber(function(err) {
                    console.log(err.message);
                    this.emit('end');
                }))
                .pipe(less({
                    plugins: [autoprefix]
                }))
                .pipe(cleanCSS({compatibility: 'ie8'}))
                .pipe(gulp.dest('./public/css'))
                .pipe(reload());
        });
    });
});

gulp.task('js', function () {
    gaze('public/js/controllers/**/*.js', {cwd: './'}, function () {
        this.on("all", function (event, filePath) {
            console.log(filePath + " was " + event);
            let config = require("./webpack.config");
            config = config();
            webpack(config, function(err, stats) {
                if (err) console.log(err);
                else console.log(stats.toString({
                    colors: true
                }));
            });
        });
    });
});

gulp.task("default", gulp.series(gulp.parallel('less', 'js')));

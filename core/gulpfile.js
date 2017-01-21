var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');

var serverTS = ["**/*.ts", "!node_modules/**", "!typings/**"];

gulp.task('ts', ['clean'], function() {
    return gulp
        .src(serverTS, {base: './'})
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./'));
});


gulp.task('deploy1', ['clean'], function () {
    return gulp
        .src('./../dist/core', { read: false })
        .pipe(clean({force: true}));
});

gulp.task('deploy2', ['deploy1'], function () {
    return gulp
        .src(serverTS, { base: './' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./../dist/core'));
});

gulp.task('deploy3', ['deploy2'], function () {
    return gulp
        .src('./package.json')
        .pipe(gulp.dest('./../dist/core'));
});


gulp.task('deploy', ['deploy3'], function () {

});

gulp.task('clean', function () {
    return gulp
        .src([
            '**/*.js',
            '**/*.js.map',
            '!node_modules/**',
            '!gulpfile.js'
        ], {read: false})
        .pipe(clean())
});

var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');

var serverTS = ["**/*.ts", "!node_modules/**", "!typings/**"];

gulp.task('ts', ['clean'], function () {
    return gulp
        .src(serverTS, { base: './' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('build1', ['clean'], function () {
    return gulp
        .src('./../dist/api/api', { read: false })
        .pipe(clean({force: true}));
});

gulp.task('build2', ['build1'], function () {
    return gulp
        .src(serverTS, { base: './' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./../dist/api/api'));
});

gulp.task('build3', ['build2'], function () {
    return gulp
        .src('./package.json')
        .pipe(gulp.dest('./../dist/api/api'));
});

gulp.task('build4', ['build3'], function () {
    return gulp
        .src('./Dockerfile')
        .pipe(gulp.dest('./../dist/api'));
});


gulp.task('build', ['build4'], function () {

});

gulp.task('clean', function () {
    return gulp
        .src([
            'app.js',
            '**/*.js',
            '**/*.js.map',
            '!node_modules/**',
            '!gulpfile.js'
        ], { read: false })
        .pipe(clean())
});

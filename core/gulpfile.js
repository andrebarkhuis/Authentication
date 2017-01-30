var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');

var serverTS = ["**/*.ts", "!node_modules/**", "!typings/**"];

// Compile typescript files
gulp.task('ts', ['clean'], function() {
    return gulp
        .src(serverTS, {base: './'})
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./'));
});


// Clean 'core' build directory
gulp.task('build1', ['clean'], function () {
    return gulp
        .src('./../dist/api/core', { read: false })
        .pipe(clean({force: true}));
});

// Compile typescript files to 'core' build directory
gulp.task('build2', ['build1'], function () {
    return gulp
        .src(serverTS, { base: './' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./../dist/api/core'));
});

// Copy 'package.json' file to 'core' build directory
gulp.task('build3', ['build2'], function () {
    return gulp
        .src('./package.json')
        .pipe(gulp.dest('./../dist/api/core'));
});


// Build to 'core' build directory
gulp.task('build', ['build3'], function () {

});

// Removes compiled js files
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

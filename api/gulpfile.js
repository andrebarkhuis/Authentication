// Imports
import gulp from 'gulp';
import ts from 'gulp-typescript';
import clean from 'gulp-clean';

let serverTS = ["**/*.ts", "!node_modules/**", "!typings/**"];

// Compile typescript files
gulp.task('ts', ['clean'], function () {
    return gulp
        .src(serverTS, { base: './' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./'));
});

// Clean 'api' build directory
gulp.task('build1', ['clean'], function () {
    return gulp
        .src('./../dist/api/api', { read: false })
        .pipe(clean({force: true}));
});

// Compile typescript files to 'api' build directory
gulp.task('build2', ['build1'], function () {
    return gulp
        .src(serverTS, { base: './' })
        .pipe(ts({ module: 'commonjs', noImplicitAny: false, allowJs: true, allowUnreachableCode: true }))
        .pipe(gulp.dest('./../dist/api/api'));
});

// Copy 'package.json' file to 'api' build directory
gulp.task('build3', ['build2'], function () {
    return gulp
        .src('./package.json')
        .pipe(gulp.dest('./../dist/api/api'));
});

// Copy 'Dockerfile' file to 'api' build directory
gulp.task('build4', ['build3'], function () {
    return gulp
        .src('./Dockerfile')
        .pipe(gulp.dest('./../dist/api'));
});


// Build to 'api' build directory
gulp.task('build', ['build4'], function () {

});

// Removes compiled js files
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

var gulp = require('gulp');
var clean = require('gulp-clean');


gulp.task('clean', function () {
    return gulp
        .src('./../dist/web', { read: false })
        .pipe(clean({force: true}));
});


gulp.task('build1', ['clean'], function () {
    return gulp
        .src('./Dockerfile')
        .pipe(gulp.dest('./../dist/web'));
});

gulp.task('build2', ['build1'], function () {
    return gulp
        .src('./nginx.conf')
        .pipe(gulp.dest('./../dist/web'));
});


gulp.task('build', ['build2'], function () {

});
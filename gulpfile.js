var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp
        .src('./dist', { read: false })
        .pipe(clean({force: true}));
});

gulp.task('build1', ['clean'], function () {
    return gulp
        .src('./docker-compose.yml')
        .pipe(gulp.dest('./dist'));
});


gulp.task('build', ['build1'], function () {

});
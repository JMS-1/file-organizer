const gulp = require('gulp')
const sass = require('gulp-sass')
const path = require('path')

const build = path.join(__dirname, 'build/app')

//
gulp.task('build-sass', () =>
    gulp
        .src(path.join(__dirname, 'src/index.scss'))
        .pipe(sass({ linefeed: 'crlf' }))
        .pipe(gulp.dest(path.join(build, 'styling')))
)

//
gulp.task('watch-sass', () => gulp.watch(path.join(__dirname, 'src/**/*.scss'), gulp.series('build-sass')))

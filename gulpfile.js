let gulp = require('gulp');
let sass = require('gulp-sass')(require('sass'));
let browserSync = require('browser-sync').create();

gulp.task('sass', () =>
  gulp.src('./scss/*.scss').pipe(sass()).pipe(gulp.dest('./css')).pipe(browserSync.stream())
);

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('./js/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('serve', 'sass'));

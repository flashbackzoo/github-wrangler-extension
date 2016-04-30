const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleancss = require('gulp-clean-css');
const gulp = require('gulp');
const gutil = require('gulp-util');
const packageJson = require('./package.json');
const sass = require('gulp-sass');
const semver = require('semver');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

// Make sure the version of Node being used is valid.
if (!semver.satisfies(process.versions.node, packageJson.engines.node)) {
  console.error( // eslint-disable-line
    `
Invalid Node.js version. You need to be using ${packageJson.engines.node}. \r
If you want to manage multiple Node.js versions try https://github.com/creationix/nvm
    `
  );
  process.exit(1);
}

process.env.NODE_ENV = typeof process.env.npm_config_development !== 'undefined'
  ? 'development'
  : 'production';

gulp.task('build', ['browserify', 'copy', 'css']);

gulp.task('browserify', () => {
  const b = browserify({
    entries: './src/Popup/Popup.js',
    debug: true,
    transform: [babelify],
  });

  return b.bundle()
    .pipe(source('Popup.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
      // Add transformation tasks to the pipeline here.
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/Popup'));
});

gulp.task('copy', () => {
  gulp
    .src([
      '!./src/__mocks__/*.js',
      '!./src/**/*-test.js',
      '!./src/Popup/*.js',
      '!./src/TypeIcon/*.js',
      './src/**/*.js',
      './src/**/*.html',
      './src/**/*.json',
      './src/**/*.png',
    ])
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', () =>
  gulp
    .src([
      '!./src/TypeIcon/*.scss',
      './src/**/*.scss',
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleancss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
);

gulp.task('css:watch', () =>
  gulp
    .src('./src/**/*.scss')
    .pipe(watch('./src/**/*.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleancss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
);

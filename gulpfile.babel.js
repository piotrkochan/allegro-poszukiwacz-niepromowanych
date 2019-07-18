import browserify from 'browserify';
import merge from 'merge-stream';
import fs from 'fs';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import preprocessify from 'preprocessify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

const $ = require('gulp-load-plugins')();

const production = process.env.NODE_ENV === 'production';
const target = process.env.TARGET || 'chrome';
const environment = process.env.NODE_ENV || 'development';

var generic = JSON.parse(fs.readFileSync(`./config/${environment}.json`));
var specific = JSON.parse(fs.readFileSync(`./config/${target}.json`));
var context = Object.assign({}, generic, specific);

var defaultManifest = {
  dev: {
    'background':
      {
        'scripts': [
          'scripts/livereload.js',
          'scripts/icon-changer.js'
        ]
      }
  },
  firefox: { 'applications': { 'gecko': { 'id': 'my-app-id@mozilla.org' } } }
};

function styles() {
  return gulp.src('src/styles/**/*.scss')
    .pipe($.plumber())
    .pipe(
      $.sass
        .sync({ outputStyle: 'expanded', precision: 10, includePaths: ['.'] })
        .on('error', $.sass.logError)
    )
    .pipe(gulp.dest(`./build/${target}/styles/`));
}

function clean() {
  return gulp.src([`./build/${target}/*`]).pipe($.clean({ force: true }))
}

function manifest() {
  return gulp.src('./manifest.json')
    .pipe(gulpif(!production, $.mergeJson({
      fileName: 'manifest.json',
      jsonSpace: ' '.repeat(4),
      endObj: defaultManifest.dev
    })))
    .pipe(gulpif(target === 'firefox', $.mergeJson({
      fileName: 'manifest.json',
      jsonSpace: ' '.repeat(4),
      endObj: defaultManifest.firefox
    })))
    .pipe(gulp.dest(`./build/${target}`))
}

exports.manifest = manifest;

function pipe(src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string';
    return stream.pipe(isDest ? gulp.dest(transform) : transform)
  }, gulp.src(src, { allowEmpty: true }))
}

function zip() {
  return pipe(`build/${target}/**/*`, $.zip(`${target}.zip`), './dist');
}

function buildJS(target) {
  let files = [
    'contentscript.js', 'icon-changer.js', 'popup.js',
  ];

  if (!production) {
    files.push('livereload.js');
  }

  let tasks = files.map(file => {
    return browserify({ entries: 'src/scripts/' + file, debug: true })
      .transform('babelify', { presets: ['@babel/preset-env'] })
      .transform(preprocessify, { includeExtensions: ['.js'], context: context })
      .bundle()
      .pipe(source(file))
      .pipe(buffer())
      .pipe(gulpif(!production, $.sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(!production, $.sourcemaps.write('./')))
      .pipe(gulpif(production, $.uglify({ 'mangle': false, 'output': { 'ascii_only': true } })))
      .pipe(gulp.dest(`./build/${target}/scripts`));
  });

  return merge(tasks)
}

function js(done) {
  buildJS(target);
  done()
}

function watch() {
  $.livereload.listen();
  gulp.watch('./src/**/*', gulp.series('build', function (done) {
    $.livereload.reload();
    done();
  }))

  // gulp.watch('./src/**/*', gulp.series('build'))
}

function files() {
  return merge(
    pipe('./src/icons/**/*', `./build/${target}/icons`),
    pipe(['./src/_locales/**/*'], `./build/${target}/_locales`),
    pipe([`./src/images/${target}/**/*`], `./build/${target}/images`),
    pipe(['./src/images/shared/**/*'], `./build/${target}/images`),
    pipe(['./src/**/*.html'], `./build/${target}`))
}

exports.clean = clean;
exports.zip = zip;

exports.assets = gulp.series(styles, js);
exports.build = gulp.series(exports.clean, exports.assets, files, manifest);
exports.watch = gulp.series(exports.build, watch);
exports.dist = gulp.series(exports.build, exports.zip);

exports.default = exports.build;

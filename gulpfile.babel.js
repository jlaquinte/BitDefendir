'use strict';

// IMPORTS
import sync from 'browser-sync'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import autoprefixer from 'gulp-autoprefixer'
import changed from 'gulp-changed'
import concat from 'gulp-concat'
import nano from 'gulp-cssnano'
import fileinclude from 'gulp-file-include'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'
import assign from 'lodash.assign'
import notifier from 'node-notifier'
import buffer from 'vinyl-buffer'
import source from 'vinyl-source-stream'
import babelify from 'babelify';
import browserify from "browserify";

const plugins = gulpLoadPlugins();

// ERROR HANDLER
const onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  })

  console.log(error)
  this.emit('end')
}

// HTML
gulp.task('html', () => {
  return gulp.src('src/html/**/*.html')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(fileinclude({ prefix: '@', basepath: 'src/html/' }))
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist/'))
})

// SASS

gulp.task('sass', () => {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: [ 'last 2 versions', 'ie >= 9', 'Android >= 4.1' ] }))
    .pipe(nano({ safe: true }))
    .pipe(sourcemaps.write('dist/css/'))
    .pipe(gulp.dest('dist/css/'))
})


// JS
gulp.task('js', ()=>  {
    browserify({
      entries: 'src/js/game.js',
      debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({ compress:{ drop_console:true }}))
    .pipe(sourcemaps.write('../maps/', { addComment: false }))
    .on('error', onError)
    .pipe(gulp.dest( 'dist/js/' ))
    .pipe(sync.stream())
});

// VENDOR JS
gulp.task('vendor-js', ()=> {
  return gulp.src(['src/js/vendor/**/*.js'])
  .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('../maps/', { addComment: false }))
    .pipe(gulp.dest('dist/js/'));
});

// IMAGES

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{gif,jpg,png,svg,json}')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(changed('dist/'))
    .pipe(imagemin({ progressive: true, interlaced: true,
      svgoPlugins: [{
          cleanupIDs: false
        // }, {
        //   sortAttrs: true
        // }, {
        //   convertPathData: false
        }, {
          removeHiddenElems: false
        }, {
          collapseGroups: false
        }]
    }))
    .pipe(gulp.dest('dist/images'))
})

// VIDEOS, FONTS, FAVICON

const inputs = [
  '/audio/**/*',
  '/video/**/*',
  '/fonts/**/*.{eot,svg,ttf,woff,woff2,otf}',
  '/favicon.ico',
  '/json/**/*',
  '/static/**/*'
]

const outputs = [
  '/audio',
  '/video',
  'css/fonts',
  '',
  '/json',
  '/static'
]

;['audio', 'video', 'fonts', 'favicon', 'json', 'static'].forEach((name, index) => {
  gulp.task(name, () => {
    return gulp.src('src' + inputs[index])
      .pipe(plumber({ errorHandler: onError }))
      .pipe(gulp.dest('dist/' + outputs[index]))
  })
})


// SERVER

const server = sync.create()
const reload = sync.reload

const sendMaps = (req, res, next) => {
  const filename = req.url.split('/').pop()
  const extension = filename.split('.').pop()

  if(extension === 'css' || extension === 'js') {
    res.setHeader('X-SourceMap', '/maps/' + filename + '.map')
  }

  return next()
}

const options = {
  notify: false,
  server: {
    baseDir: 'dist/',
    middleware: [
      sendMaps
    ]
  },
  watchOptions: {
    ignored: '*.map'
  }
}

gulp.task('server', () => sync(options))

// WATCH

gulp.task('watch', () => {
  gulp.watch('src/html/**/*.html', ['html', reload])
  gulp.watch('src/sass/**/*.scss', ['sass', reload])
  gulp.watch('src/js/**/*.js', ['js', reload])
  gulp.watch('src/audio/**/*.*', ['audio', reload])
  gulp.watch('src/video/**/*.*', ['video', reload])
  gulp.watch('src/json/**/*.*', ['json', 'js', reload])
  gulp.watch('src/static/**/*.*', ['static', reload])
  gulp.watch('src/images/**/*.{gif,jpg,png,svg}', ['images', reload])
})

// BUILD & DEFAULT TASK

gulp.task('build', ['images', 'html', 'sass', 'vendor-js', 'js', 'audio', 'video', 'fonts', 'favicon', 'json', 'static'])
gulp.task('default', ['build', 'watch', 'server'])

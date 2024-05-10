const { src, dest, watch } = require('gulp');
const { srcFolder, buildFolder } = require('./configs');

// FILES
const changed = require('gulp-changed');
const concat = require('gulp-concat');
const clean = require('gulp-clean');

// FILE SYSTEM
const fs = require('fs');

// SERVER
const server = require('gulp-server-livereload');

// ERRORS HANDLER AND NOTIFICATION
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// HTML
const includeHTML = require('gulp-file-include');
const cleanHTML = require('gulp-htmlclean');
const typograf = require('gulp-typograf');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const sourceMaps = require('gulp-sourcemaps');

// JS
const webpack = require('webpack-stream');
const babel = require('gulp-babel');

// IMAGES
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');

// SVG SPRITE
const svgsprite = require('gulp-svg-sprite');

// FONTS
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

function startServer() {
  return src(`./${buildFolder}`).pipe(server({ livereload: true, open: true }));
}

function html() {
  return src([`./${srcFolder}/**/*.html`, `!./${srcFolder}/components/*.html`])
    .pipe(changed(`./${buildFolder}`, { hasChanged: changed.compareContents }))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'HTML',
          message: 'Error <%= error.message %>',
          sound: false,
        }),
      })
    )
    .pipe(
      includeHTML({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(
      typograf({
        locale: ['ru', 'en-US'],
        htmlEntity: { type: 'digit' },
        safeTags: [
          ['<\\?php', '\\?>'],
          ['<no-typography>', '</no-typography>'],
        ],
      })
    )
    .pipe(cleanHTML())
    .pipe(dest(`./${buildFolder}`));
}

function styles() {
  return src([`./${srcFolder}/scss/*.scss`])
    .pipe(changed(`./${buildFolder}/css`))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'Styles',
          message: 'Error <%= error.message %>',
          sound: false,
        }),
      })
    )
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(sourceMaps.write())
    .pipe(concat('styles.min.css'))
    .pipe(dest(`./${buildFolder}/css`));
}

function scripts() {
  return src(`./${srcFolder}/js/*.js`)
    .pipe(changed(`./${buildFolder}/js`))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'JavaScript',
          message: 'Error <%= error.message %>',
          sound: false,
        }),
      })
    )
    .pipe(babel())
    .pipe(webpack(require('../webpack.config')))
    .pipe(dest(`./${buildFolder}/js`));
}

function img() {
  return src([
    `./${srcFolder}/images/**/*.*`,
    `!./${srcFolder}/images/**/*.svg`,
  ])
    .pipe(changed(`./${buildFolder}/images`))
    .pipe(avif({ quality: 50 }))

    .pipe(
      src([`./${srcFolder}/images/**/*.*`, `!./${srcFolder}/images/**/*.svg`])
    )
    .pipe(changed(`./${buildFolder}/images`))
    .pipe(webp())

    .pipe(
      src([`./${srcFolder}/images/**/*.*`, `!./${srcFolder}/images/**/*.svg`])
    )
    .pipe(changed(`./${buildFolder}/images`))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(`./${buildFolder}/images`));
}

function svg() {
  return src(`./${srcFolder}/images/**/*.svg`)
    .pipe(changed(`./${buildFolder}/images/**/*.svg`))
    .pipe(
      svgsprite({
        mode: {
          symbol: {
            sprite: '../sprite.symbol.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                js2svg: { indent: 4, pretty: true },
                plugins: [
                  {
                    name: 'removeAttrs',
                    params: {
                      attrs: '(fill|stroke)',
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    )
    .pipe(dest(`./${buildFolder}/images/svgsprite`));
}

function fonts() {
  return src(`./${srcFolder}/fonts/*.*`)
    .pipe(changed(`./${buildFolder}/fonts/*.*`))
    .pipe(fonter({ formats: ['woff', 'ttf'] }))
    .pipe(src(`./${srcFolder}/fonts/*.ttf`))
    .pipe(ttf2woff2())
    .pipe(dest(`./${buildFolder}/fonts`));
}

function files() {
  return src([`./${srcFolder}/files/**/*`])
    .pipe(changed(`./${buildFolder}/files`))
    .pipe(dest(`./${buildFolder}/files`));
}

function videos() {
  return src(`./${srcFolder}/videos/**/*`)
    .pipe(changed(`./${buildFolder}/videos`))
    .pipe(dest(`./${buildFolder}/videos`));
}

function watching() {
  watch([`./${srcFolder}/**/*.html`], html);
  watch([`./${srcFolder}/scss/**/*scss`], styles);
  watch([`./${srcFolder}/js/**/*.js`], scripts);
  watch(
    [`./${srcFolder}/images/**/*.*`, `!./${srcFolder}/images/**/*.svg`],
    img
  );
  watch([`./${srcFolder}/images/**/*.svg`], svg);
  watch([`./${srcFolder}/fonts/*.*`], fonts);
}

function cleanBuild(done) {
  if (fs.existsSync(`./${buildFolder}`)) {
    return src(`./${buildFolder}`, { read: false }).pipe(
      clean({ force: true })
    );
  }

  done();
}

module.exports = {
  html,
  styles,
  scripts,
  img,
  svg,
  fonts,
  files,
  videos,
  cleanBuild,
  startServer,
  watching,
};

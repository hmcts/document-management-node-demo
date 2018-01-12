let gulp = require('gulp')
let nodemon = require('gulp-nodemon')
let plumber = require('gulp-plumber')
let livereload = require('gulp-livereload')
let sass = require('gulp-sass')
let path = require('path')
let replace = require('gulp-replace')

const repoRoot = path.join(__dirname, '/')
const govUkFrontendToolkitRoot = path.join(repoRoot, 'node_modules/govuk_frontend_toolkit/stylesheets')
const govUkElementRoot = path.join(repoRoot, 'node_modules/govuk-elements-sass/public/sass')

const assetsDirectory = './src/main/assets/public'
const localStyleDirectory = './src/main/public/scss'
const stylesheetsDirectory = `${localStyleDirectory}`

// compile scss files
gulp.task('sass', () => {
  gulp.src(stylesheetsDirectory + '/*.scss')
    .pipe(sass({
      includePaths: [
        govUkFrontendToolkitRoot,
        govUkElementRoot
      ]
    }))
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(assetsDirectory + '/stylesheets'))
    .pipe(livereload())
})

// copy js, stylesheets and images from dependencies to frontend's public directory
gulp.task('copy-files', () => {
//COPY JS
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/govuk_frontend_toolkit/javascripts/**/*.js',
    './node_modules/govuk_template_jinja/assets/javascripts/**/*.js'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/js/lib/`))
//COPY IMG
  gulp.src([
    './node_modules/govuk_frontend_toolkit/images/**/*',
    './node_modules/govuk_template_jinja/assets/images/*.*'
  ])
  .pipe(gulp.dest(`${assetsDirectory}/img/lib/`))
//COPY CSS
  gulp.src([
    './node_modules/govuk_template_jinja/assets/stylesheets/**/*'
  ])
  .pipe(replace('images/', '/stylesheets/lib/images/', { skipBinary: true }))
  .pipe(gulp.dest(`${assetsDirectory}/stylesheets/lib/`))
})

// compile scss files whenever they're changed
gulp.task('watch', () => {
  gulp.watch(stylesheetsDirectory + '/**/*.scss', [ 'sass' ])
})

// start the application and watch for file changes (in which case it will be restarted)
gulp.task('develop', () => {
  setTimeout(() => {
    livereload.listen()

    nodemon({
      ext: 'ts js njk po html yml css',
      stdout: true
    }).on('start', () => {
        livereload.changed(__dirname)
    })
  }, 500)
})

gulp.task('default', [
  'sass',
  'copy-files',
  'develop',
  'watch'
])

const src = './src'
const dist = './dist'

const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const pxtorpx = require('postcss-px2rpx')
const base64 = require('postcss-font-base64')
const combiner = require('stream-combiner2')
const sourcemaps = require('gulp-sourcemaps')
const jdists = require('gulp-jdists')
const through = reuqire('through2')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const argv = require('minimist')(process.argv.slice(2))
const isProd = argv.type === 'prod'

gulp.task('wxml',()=>{
    return gulp.src(`${src}/**/*.wxml`).pipe(gulp.dest(dist))
})

gulp.task('wxss',()=>{
    const combined = combiner.obj([
        gulp.src(`${src}/**/*.{wxss,scss}`),
        sass().on('error',sass.logError),
        postcss([pxtorpx(),base64()]),
        rename((path)=>(path.extname = '.wxss')),
        gulp.dest(dist)
    ])
    combined.on('error',handleError)
})

gulp.task('js',()=>{
    gulp
        .src(`${src}/**/*.js`)
        .pipe(isProd ? jdists({trigger:'prod'}) : jdists({trigger:'dev'}))
        .pipe(isProd ? through.obj() : sourcemaps.init())
        .pipe(babel({presets:['env']}))
        .pipe(isProd ? uglify({compress:true}) : through.obj())
        .pipe(isProd ? through.obj() : sourcemaps.write('./'))
        .pipe(gulp.dest(dist))
        .pipe(isPord ? jdists({trigger:'prod'}) : jdists({trigger:'dev'}))
})

gulp.task('json',()=>{
    return gulp.src(`${src}/**/*.json`).pipe(gulp.dest(dist))
})

gulp.task('images',()=>{
    return gulp.src(`${src}/images/**`).pipe(gulp.dest(`${dist}/images`))
})

gulp.task('wxs',()=>{
    return gulp.src(`${src}/**/*.wxs`).pipe(gulp.dest(dist))
})

gulp.task('watch',()=>{
    ;['wxml','wxss','js','json','wxs'].forEach((v)=>{
        gulp.watch(`${src}/**/*.${v}`,[v])
    })
    gulp.watch(`${src}/images/**`,['images'])
    gulp.watch(`${src}/**/*.scss`,['wxss'])
})

gulp.task('clean',()=>{
    return del(['./dist/**'])
})

gulp.task('dev',['clean'],()=>{
    runSequence('json','images','wxml','wxss','js','wxs','cloud','watch')
})

gulp.task('build',['clean'],()=>{
    runSequence('json','images','wxml','wxss','js','wxs','cloud')
})
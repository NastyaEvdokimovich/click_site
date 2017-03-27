var gulp      	 = require('gulp'), 
	sass         = require('gulp-sass'),
	pug          = require('gulp-pug'),
	sourcemaps   = require('gulp-sourcemaps'), 
	browserSync  = require('browser-sync'), 
	concat       = require('gulp-concat'), 
	uglify       = require('gulp-uglifyjs'), 
	cssnano      = require('gulp-cssnano'), 
	rename       = require('gulp-rename'), 
	del          = require('del'), 
	imagemin     = require('gulp-imagemin'), 
	pngquant     = require('imagemin-pngquant'), 
	cache        = require('gulp-cache'), 
	autoprefixer = require('gulp-autoprefixer');

/* compile our sass */
gulp.task('sass', function(){ 
	return gulp.src('app/sass/**/*.sass') 
		.pipe(sass()) 
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(gulp.dest('app/css')) 
		.pipe(browserSync.reload({stream: true})) 
});
/* compile our pug */
gulp.task('pug', function ()  {
    return gulp.src('app/pug/*.pug')
      .pipe(pug({pretty: true}))
      .pipe(gulp.dest('app'))
      .pipe(browserSync.reload({stream: true}))
});

/* compile our scripts */
gulp.task('scripts', function() {
	return gulp.src([ 
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/owl-carousel/dist/owl.carousel.min.js'
		])
		.pipe(concat('libs.min.js')) 
		.pipe(uglify()) 
		.pipe(gulp.dest('app/js')); 
});

/* create one file for whole libs */
gulp.task('css-libs', ['sass'], function() {
	return gulp.src('app/css/libs.css') 
		.pipe(cssnano()) 
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css')); 
});

/* manify our main css */
gulp.task('css-manify', ['sass'], function() {
	return gulp.src('app/css/main.css') 
		.pipe(cssnano()) 
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css')); 
});

/* make img size smaller */
gulp.task('img', function() {
	return gulp.src('app/img/**/*') 
		.pipe(cache(imagemin({  
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); 
});

/* online watch for changings */
gulp.task('browser-sync', function() { 
	browserSync({ 
		server: { 
			baseDir: 'app' 
		},
		notify: false 
	});
});

/* just simple watch taks */
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts', 'css-manify'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']); 
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/*.html', browserSync.reload); 
	gulp.watch('app/js/**/*.js', browserSync.reload);   
});

/* delete our old production folder */
gulp.task('clean', function() {
	return del.sync('dist'); 
});
gulp.task('clear', function (callback) {
	return cache.clearAll();
})

/* build production */
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

	var buildCss = gulp.src([ 
		'app/css/main.css',
		'app/css/main.min.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') 
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') 
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') 
	.pipe(gulp.dest('dist'));

});

/* default task */
gulp.task('default', ['watch', 'pug']);

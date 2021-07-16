const src_folder = 'src';
const project_name = 'dist'

const path = {
	build: {
		html: project_name + '/',
		js: project_name + '/js/',
		css: project_name + '/css/',
		images: project_name + '/img/',
		fonts: project_name + '/fonts/'
	},
	src: {
		html: [src_folder + '/*.html', '!' + src_folder + '/_*.html'],
		js: [src_folder + '/js/app.js', src_folder + '/js/vendors.js'],
		css: src_folder + '/scss/style.scss',
		images: src_folder + '/img/**/*.+(jpg|png|svg|gif|ico|webp)',
		fonts: src_folder + '/fonts/*.ttf'
	},
	watch: {
		html: src_folder + '/**/*.html',
		js: src_folder + '/**/*.js',
		css: src_folder + '/scss/**/*.scss',
		images: src_folder + '/img/**/*.+(jpg|png|svg|gif|ico|webp)'
	},
	clean: ['./' + project_name + '/**/*', '!' + project_name + '/.git']
};

const { src, dest } 	= require('gulp'),
		gulp 			= require('gulp'),
		fs 				= require('fs'),
		browsersync 	= require('browser-sync').create(),
		autoprefixer 	= require('gulp-autoprefixer'),
		scss 			= require('gulp-sass')(require('sass')),
		group_media 	= require('gulp-group-css-media-queries'),
		plumber 		= require('gulp-plumber'),
		del 			= require('del'),
		imagemin 		= require('gulp-imagemin'),
		uglify 			= require('gulp-uglify-es').default,
		rename 			= require('gulp-rename'),
		fileinclude 	= require('gulp-file-include'),
		clean_css 		= require('gulp-clean-css');
		newer 			= require('gulp-newer'),
		webp 			= require('imagemin-webp'),
		webpcss 		= require('gulp-webp-css'),
		webphtml 		= require('gulp-webp-html'),
		fonter 			= require('gulp-fonter'),
		ttf2woff 		= require('gulp-ttf2woff'),
		ttf2woff2 		= require('gulp-ttf2woff2');

const browserSync = () => {
	browsersync.init({
		server: {
			baseDir: './' + project_name + '/'
		},
		notify: false
	});
};

const html = () => {
	return src(path.src.html)
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
};

const css = () => {
	return src(path.src.css)
		.pipe(plumber())
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(group_media())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 10 versions'],
			cascade: true
		}))
		.pipe(webpcss())
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
};

const js = () => {
	return src(path.src.js, {})
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify(/* options */))
		.pipe(rename({
			suffix: '.min',
			extname: '.js'
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
};

const images = () => {
	return src(path.src.images)
		.pipe(newer(path.build.images))
		.pipe(imagemin([
			webp({
				quality: 75
			})
		]))
		.pipe(rename({
			extname: '.webp'
		}))
		.pipe(dest(path.build.images))
		.pipe(src(path.src.images))
		.pipe(newer(path.build.images))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 3 // 0 to 7
		}))
		.pipe(dest(path.build.images));
};

const fonts_otf = () => {
	return src('./' + src_folder + '/fonts/*.otf')
		.pipe(plumber())
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest('./' + src_folder + +'/fonts/'));
};

const fonts = () => {
	src(path.src.fonts)
		.pipe(plumber())
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream());
};

const fontstyle = () => {
	let file_content = fs.readFileSync(src_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(src_folder + '/scss/fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, (err, items) => {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(src_folder + '/scss/fonts.scss', `@include font(${fontname}, ${fontname}, 400, normal);\r\n`, cb);
					}
					c_fontname = fontname;
				}
			}
		});
	}
};

const cb = () => {}

const clean = () => {
	return del(path.clean);
}

const watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
}

const build = gulp.series(clean, fonts_otf, gulp.parallel(html, css, js, images), fonts, gulp.parallel(fontstyle));

exports.default = gulp.parallel(build, watchFiles, browserSync);
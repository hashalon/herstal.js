/*
	to gulp enter the command :
	gulp
*/

var gulp   = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert'),
	babel  = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	srcmap = require('gulp-sourcemaps');

gulp.task('build-shared', function() {
	var
	prepend = "(function (){\n",
	append  = "\n})();",
	srcs = [
		"src/shared/Init.js",
		"src/shared/Util.js",
		"src/shared/**/*.js",
	],
	dist = "build",
	name = "herstal.shared.js",
	min  = "herstal.shared.min.js";

	// extended file
	var file = gulp.src(srcs)
		.pipe(concat(name))
		.pipe(insert.wrap(prepend, append))
		.pipe(babel({
			presets : ['es2015']
		}))
		.pipe(gulp.dest(dist));

	// minified file
	var min_file = file.pipe(rename(min))
		.pipe(srcmap.init())
		.pipe(uglify())
		.pipe(srcmap.write('./'))
		.pipe(gulp.dest(dist));
});

gulp.task('build-server', function() {
	var
	prepend = "(function (){\n",
	append  = "\n})();",
	srcs = [
		"src/server/Init.js",
		"src/server/**/*.js",
	],
	dist = "build",
	name = "herstal.server.js",
	min  = "herstal.server.min.js";

	return gulp.src(srcs)
		.pipe(concat(name))
		.pipe(insert.wrap(prepend, append))
		.pipe(babel({
			presets : ['es2015']
		}))
		.pipe(gulp.dest(dist));
	// server doesn't need minified files
});

gulp.task('build-client', function() {
	var
	prepend = "(function (){\n",
	append  = "\n})();",
	srcs = [
		"src/client/Init.js",
		"src/client/**/*.js",
	],
	dist = "build",
	name = "herstal.client.js",
	min  = "herstal.client.min.js";

	// extended file
	var file = gulp.src(srcs)
		.pipe(concat(name))
		.pipe(insert.wrap(prepend, append))
		.pipe(babel({
			presets : ['es2015']
		}))
		.pipe(gulp.dest(dist));

	// minified file
	var min_file = file.pipe(rename(min))
		.pipe(srcmap.init())
		.pipe(uglify())
		.pipe(srcmap.write('./'))
		.pipe(gulp.dest(dist));

});

gulp.task('min-cooman', function(){
	var
	srcs = [
		"gui/preferences/cookieReader.js",
		"gui/preferences/cookieManager.js",
		"gui/preferences/userPreferences.js",
	],
	min = [
		"cookieReader.min.js",
		"cookieManager.min.js",
		"userPreferences.min.js",
	],
	dist = "gui/preferences";
	for( var i=0; i<srcs.length; ++i ){
		var file = gulp.src(srcs[i])
			.pipe(rename(min[i]))
			.pipe(srcmap.init())
			.pipe(uglify())
			.pipe(srcmap.write('./'))
			.pipe(gulp.dest(dist));
	}
});

gulp.task('default', ['build-shared', 'build-server', 'build-client', 'min-cooman']);

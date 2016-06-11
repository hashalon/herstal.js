var gulp   = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	es6trp = require('gulp-es6-transpiler');

var files = {
	shared : {
		srcs : [
			"src/shared/Init.js",
			"src/shared/**/*.js",
		],
		src  : "src/shared/**/*.js",
		dest : "build/",
		name : "herstal.shared.js"
		min  : "herstal.shared.min.js",
	},
	server : {
		srcs : [
			"src/server/Init.js",
			"src/server/**/*.js",
		],
		src  : "src/server/**/*.js",
		dest : "build/"
		name : "herstal.server.js",
		min  : "herstal.shared.min.js",
	},
	client : {
		srcs : [
			"src/client/Init.js",
			"src/client/**/*.js",
		],
		src  : "src/client/**/*.js",
		dest : "build/"
		name : "herstal.client.js",
		min  : "herstal.client.min.js",
	},
};

gulp.task('build-shared', function() {
	var file = gulp.src(files.shared.srcs)
	.pipe(concat(files.shared.name));
	
});

gulp.task('build-server', function() {

	return gulp.src('')
});

gulp.task('build-client', function() {

	return gulp.src('')
});

gulp.task('default', ['build-shared', 'build-server', 'build-client']);

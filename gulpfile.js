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

// Scripts may be concatenated in a particular order
gulp.task('build-server', function() {
	var
	prepend = "(function (){\n",
	append  = "\n})();",
	srcs = [
		"src/server/Init.js",
		"src/server/Server.js",
		"src/server/Util.js",
		"src/server/Team.js",
		"src/server/Controller.js",
		"src/server/Controllable.js",
		"src/server/Character.js",
		"src/server/Vehicule.js",
		"src/server/weapons/Weapon.js",
		"src/server/projectiles/Projectile.js",
		"src/server/**/*.js",
		"src/server/End.js",
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
		"src/client/Client.js",
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

gulp.task('build-config', function(){
	var
	srcs = [
		"src/config/reader.js",
		"src/config/writer.js",
	],
	min = [
		"reader.min.js",
		"writer.min.js",
	],
	dist = "build";
	for( var i=0; i<srcs.length; ++i ){
		var file = gulp.src(srcs[i])
			.pipe(rename(min[i]))
			.pipe(srcmap.init())
			.pipe(uglify())
			.pipe(srcmap.write('./'))
			.pipe(gulp.dest(dist));
	}
});

gulp.task('default', [
	'build-server', 'build-client', 'build-config',
]);

var fs    = require('fs');
var grunt = require('grunt');

module.exports = function(grunt) {

    grunt.initConfig({
        encase : {
            dev_shared : {
                separator : '\n\n',
                enviroment : 'node',
                useStrict : false,
                exports : [
                    "WORLD",
                    "Player",
                    "Character",
                ],
                src : [
                    // first add those files
                    "src/shared/Init.js",
                    // then everything else
                    "src/shared/**/*.js",
                ],
                //src  : "src/shared/**/*.js",
                dest : "build/es6/herstal.shared.js",
            },
            dev_server : {
                separator : '\n\n',
                enviroment : 'node',
                useStrict : false,
                exports : [

                ],
                src : [
                    // first add those files
                    "src/server/Init.js",
                    // then everything else
                    "src/server/**/*.js",
                ],
                //src  : "src/server/**/*.js",
                dest : "build/es6/herstal.server.js",
            },
            dev_client : {
                separator : '\n\n',
                enviroment : 'browser',
                useStrict : false,
                exports : [

                ],
                src : [
                    // first add those files
                    "src/client/Init.js",
                    // then everything else
                    "src/client/**/*.js",
                ],
                //src  : "src/client/**/*.js",
                dest : "build/es6/herstal.client.js",
            },
        },
        '6to5' : {
            options : {
                sourceMap : false,
            },
            dist : {
                files : {
                 "build/es5/herstal.shared.js" : "build/es6/herstal.shared.js",
                 "build/es5/herstal.server.js" : "build/es6/herstal.server.js",
                 "build/es5/herstal.client.js" : "build/es6/herstal.client.js",
                }
            },
        },
        uglify : {
            dist : {
             files : {
              "build/min/herstal.shared.min.js" : "build/es5/herstal.shared.js",
              "build/min/herstal.client.min.js" : "build/es5/herstal.client.js",
             }
            }
        },
    });

    grunt.loadNpmTasks('grunt-encase');
    grunt.loadNpmTasks('grunt-6to5');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.registerTask('default', ['encase', '6to5', 'uglify']);
    //grunt.registerTask('test'   , ['nodeunit']);
};

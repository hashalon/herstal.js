var fs = require('fs')

module.exports = function(grunt) {
    
    var buildPath = {
        shared_src: "src/shared/**/*.js",
        server_src: "src/server/**/*.js",
        client_src: "src/client/**/*.js",
        shared:     "build/herstal.shared.js",
        server:     "build/herstal.server.js",
        client:     "build/herstal.client.js",
        shared_min: "build/herstal.shared.min.js",
        server_min: "build/herstal.server.min.js",
        client_min: "build/herstal.client.min.js"
    };

    grunt.initConfig({
        concat: {
            options: {
                separator: '\n\n'
            },
            src_shared : {
                src:  buildPath.shared_src,
                dest: buildPath.shared
            },
            src_server : {
                src:  buildPath.server_src,
                dest: buildPath.server
            },
            src_client : {
                src:  buildPath.client_src,
                dest: buildPath.client
            }
            
        },
        uglify : {
            files : {
                min_shared : {
                    src:  buildPath.shared,
                    dest: buildPath.shared_min
                },
                min_server : {
                    src:  buildPath.server,
                    dest: buildPath.server_min
                },
                min_client : {
                    src:  buildPath.client,
                    dest: buildPath.client_min
                }
            }
        },
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat', 'uglify']);
};
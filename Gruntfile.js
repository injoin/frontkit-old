module.exports = exports = function( grunt ) {
    "use strict";

    grunt.initConfig( exports.tasks );

    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-qunit" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );

    grunt.registerTask( "styles", [ "less" ] );
    grunt.registerTask( "scripts", [ "jshint:dev", "qunit:dev", "concat:dev" ] );
    grunt.registerTask( "default", [ "styles", "scripts" ] );
};

exports.tasks = {
    watch: {
        less: {
            files: [ "styles/*.less" ],
            tasks: [ "default" ]
        },
        js: {
            files: [ "scripts/*.js" ],
            tasks: [ "concat" ]
        }
    },
    jshint: {
        dev: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: {
                src: [ "scripts/*.js" ]
            }
        }
    },
    qunit: {
        dev: [
            "tests/unit/core.html",
            "tests/unit/affix.html"
        ]
    },
    concat: {
        dev: {
            src: [ "scripts/core.js", "scripts/*.js" ],
            dest: "dist/frontkit.js"
        }
    },
    less: {
        dev: {
            files: {
                "dist/frontkit.css": "styles/frontkit.less"
            }
        }
    }
};
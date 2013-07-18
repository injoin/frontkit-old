module.exports = exports = function( grunt ) {
    "use strict";

    grunt.initConfig( exports.tasks );

    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-qunit" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-jscs-checker" );
    grunt.loadNpmTasks( "grunt-jquery-builder" );

    grunt.registerTask( "styles", [ "less" ] );
    grunt.registerTask( "scripts", [
        "jshint:dev",
        "jscs:dev",
        "jquery:dev",
        "qunit:dev",
        "concat:dev"
    ]);
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
    jscs: {
        dev: [ "scripts/*.js", "tests/unit/spec/**/*.js" ]
    },
    jquery: {
        dev: {
            output: "tests/unit/lib/jquery",
            versions: [ "1.9.0", "1.10.0", "2.0.0" ]
        }
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
module.exports = exports = function( grunt ) {
    "use strict";

    grunt.initConfig({
        // Watch
        // ------------------------------------------------------------
        watch: {
            less: {
                files: [ "styles/*.less" ],
                tasks: [ "styles" ]
            },
            js: {
                files: [ "scripts/*.js" ],
                tasks: [ "scripts" ]
            }
        },

        // Styles
        // ------------------------------------------------------------
        less: {
            dev: {
                files: {
                    "dist/frontkit.css": "styles/frontkit.less"
                }
            }
        },

        // Scripts
        // ------------------------------------------------------------
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [ "scripts/*.js", "tests/unit/spec/**/*.js" ]
        },
        jscs: {
            all: [ "scripts/*.js", "tests/unit/spec/**/*.js" ]
        },
        concat: {
            dev: {
                src: [ "scripts/core.js", "scripts/*.js" ],
                dest: "dist/frontkit.js"
            }
        },
        qunit: {
            dev: [
                "tests/unit/core.html",
                "tests/unit/affix.html",
                "tests/unit/collapse.html"
            ]
        }
    });

    // Load all deps...
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-qunit" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-jscs-checker" );

    // Group tasks by scripts/styles
    grunt.registerTask( "styles", [ "less" ]);
    grunt.registerTask( "scripts", [ "jshint", "jscs", "qunit", "concat" ]);

    // Mixed tasks
    grunt.registerTask( "default", [ "styles", "scripts" ]);
};
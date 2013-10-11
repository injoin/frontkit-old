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
            all: "<%= jscs.all %>"
        },
        jscs: {
            all: [
                // Source
                "scripts/*.js",

                // Test specs
                "tests/unit/spec/**/*.js",

                // Test configs
                "tests/unit/*.js",

                // Our Gruntfile of course :)
                "Gruntfile.js"
            ]
        },
        concat: {
            dev: {
                src: [ "scripts/module.js", "scripts/jQLite.js", "scripts/*.js" ],
                dest: "dist/frontkit.js"
            }
        },
        karma: {
            unit: {
                configFile: "tests/unit/karma.conf.js",
                singleRun: true,
                browsers: [ "PhantomJS" ]
            }
        }
    });

    // Load all deps...
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-jscs-checker" );
    grunt.loadNpmTasks( "grunt-karma" );

    // Group tasks by scripts/styles
    grunt.registerTask( "styles", [ "less" ]);
    grunt.registerTask( "scripts", [ "jshint", "jscs", "karma", "concat" ]);

    // Mixed tasks
    grunt.registerTask( "default", [ "styles", "scripts" ]);
};
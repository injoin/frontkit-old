module.exports = exports = function( grunt ) {
	"use strict";

	grunt.initConfig( exports.tasks );

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-concat");

	grunt.registerTask( "default", [ "less", "concat" ] );
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
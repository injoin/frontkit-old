module.exports = exports = function( grunt ) {
	"use strict";

	grunt.initConfig( exports.tasks );

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask( "default", [ "less" ] );
};

exports.tasks = {
	watch: {
		dist: {
			files: [ "styles/*.less" ],
			tasks: [ "default" ]
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
// Karma configuration
module.exports = function( config ) {
    "use strict";

    config.set({
        // Point the base path to the project root
        basePath: "../../",
        frameworks: [ "mocha" ],
        files: [
            "tests/unit/lib/angular.js",
            "tests/unit/lib/angular-mocks.js",
            "tests/unit/lib/*.js",
            "tests/unit/config.js",

            // Source files
            "scripts/*.js",

            // Fixtures
            "tests/unit/fixtures/*",

            // Specs
            "tests/unit/spec/**/*.js"
        ],
        exclude: [],
        reporters: [ "progress" ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: [ "Chrome", "Firefox", "PhantomJS" ],
        captureTimeout: 60000,

        // CI mode is set in the Gruntfile.
        singleRun: false,

        // Sauce Labs configs
        sauceLabs: {
            testName: "Frontkit",
            startConnect: true,
            recordScreenshots: false,
            tunnelIdentifier: process.env.TRAVIS_JOB_RUNNER
        },
        customLaunchers: {
            "SL_Chrome": {
                base: "SauceLabs",
                browserName: "chrome"
            },
            "SL_Firefox": {
                base: "SauceLabs",
                browserName: "firefox"
            },
            "SL_Safari": {
                base: "SauceLabs",
                browserName: "safari",
                platform: "Mac 10.8",
                version: "6"
            },
            "SL_IE_9": {
                base: "SauceLabs",
                browserName: "internet explorer",
                platform: "Windows 2008",
                version: "9"
            },
            "SL_IE_10": {
                base: "SauceLabs",
                browserName: "internet explorer",
                platform: "Windows 2012",
                version: "10"
            }
        }
    });

    if ( process.env.TRAVIS ) {
        config.transports = [ "xhr-polling" ];
        config.reporters = [ "dots" ];
    }
};

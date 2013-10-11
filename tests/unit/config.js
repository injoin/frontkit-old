(function( global ) {
    "use strict";

    // jQLite
    global.$ = angular.element;

    // Mocha
    global.mocha.setup({
        ui: "tdd"
    });

    // Chai
    global.expect = global.chai.expect;
})( window );
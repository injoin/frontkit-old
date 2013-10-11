suite( "Frontkit Module", function() {
    "use strict";

    test( "should be registered", function() {
        expect(function() {
            angular.module( "frontkit" );
        }).to.not.throw( Error );
    });

});
(function( $, sinon ) {
    "use strict";

    module( "Frontkit debug", {
        setup: function() {
            $.frontkit.debug = true;
            this.console = sinon.stub( console, "log" );
        },
        teardown: function() {
            this.console.restore();
        }
    });

    test( "$.frontkit.debug switch", function() {
        $.frontkit.log( "frontkit debug test" );
        strictEqual(
            this.console.callCount,
            1,
            "Should console.log() things when $.frontkit.debug is falsy"
        );

        $.frontkit.debug = false;
        $.frontkit.log( "frontkit debug test" );
        strictEqual(
            this.console.callCount,
            1,
            "Should not console.log() things when $.frontkit.debug is falsy"
        );
    });

    test( "log format", function() {
        var testArr = [ "foobar", true, 1 ];
        var stringifiedArr = JSON.stringify( testArr );
        var json = sinon.spy( JSON, "stringify" );
        $.frontkit.log( testArr );

        ok( json.calledOnce, "stringify messages" );
        strictEqual(
            this.console.args[ 0 ][ 0 ],
            "[Frontkit " + $.frontkit.version + "] " + stringifiedArr,
            "log format is [Frontkit VERSION] stringified message"
        );

        json.restore();
    });
})( jQuery, sinon );
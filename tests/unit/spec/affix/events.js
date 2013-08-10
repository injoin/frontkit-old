(function( $, window, sinon ) {
    "use strict";

    module( "Events", {
        setup: function() {
            this.affix = $( "#test1" ).affix();
            this.instance = this.affix.data( "affix" );
        },
        teardown: function() {
            this.affix.affix( "destroy" );
        }
    });

    test( "activate", function() {
        // Setting up test
        var scrollTop = sinon.stub( $.fn, "scrollTop" );
        var event = sinon.spy();

        this.affix.affix( "option", "activate", event );
        this.instance.start = 10;

        // Activation
        scrollTop.returns( 30 );
        $( window ).trigger( "scroll" );

        strictEqual( event.callCount, 1, "trigger the activate event on activate" );
        strictEqual( event.args[ 0 ][ 1 ].active, true, "pass data object with active = true" );

        // Deactivation
        scrollTop.returns( 0 );
        $( window ).trigger( "scroll" );

        strictEqual( event.callCount, 2, "trigger the activate event on deactivate" );
        strictEqual( event.args[ 1 ][ 1 ].active, false, "pass data object with active = false" );

        scrollTop.restore();
    });

})( jQuery, window, sinon );
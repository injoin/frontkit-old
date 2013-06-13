(function( $, sinon ) {
    "use strict";

    module( "General", {
        setup: function() {
            this.affix = $( "#test1" ).affix();
            this.instance = this.affix.data( "affix" );
        },
        teardown: function() {
            this.affix.affix( "destroy" );
        }
    });

    test( "Classes", function() {
        expect( 2 );

        ok( this.affix.hasClass( "affix" ), "has class affix" );

        this.affix.affix( "option", "mobile", false );
        ok(
            this.affix.hasClass( "affix-no-mobile" ),
            "adds class affix-no-mobile depending on the mobile option"
        );
    });

    test( "Instance Cache", function() {
        expect( 2 );

        var $window = $( window );

        notStrictEqual(
            $window.data( "affixInstances" ).indexOf( this.instance ), -1,
            "holds each affix instance in a window data"
        );

        this.affix.affix( "destroy" );
        strictEqual(
            $window.data( "affixInstances" ).indexOf( this.instance ), -1,
            "frees the affix instance from the window data when destroyed"
        );

        // Restore the instance before calling teardown
        this.affix.affix();
    });

    test( "Positioning", function() {
        expect( 3 );

        var stub = sinon.stub( $.fn, "scrollTop" );

        this.instance.top = 100;
        this.instance.options.offset = 40;
        this.instance.options.position = 30;

        // Not enough scrolling
        stub.returns( 60 );
        $( window ).trigger( "scroll" );

        ok(
            this.affix.hasClass( "affix-inactive" ),
            "does not touch the positioning if not enough scrolling"
        );

        // Enough scrolling
        stub.returns( 80 );
        $( window ).trigger( "scroll" );

        ok(
            !this.affix.hasClass( "affix-inactive" ),
            "removes affix-inactive class when enough scrolling"
        );

        strictEqual(
            parseInt( this.affix.css( "top" ), 10 ), 30,
            "set the correct positioning when enough scrolling"
        );

        stub.restore();
    });

})( jQuery, sinon );
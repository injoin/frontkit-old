(function( $ ) {
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

})( jQuery );
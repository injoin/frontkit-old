(function( $ ) {
    "use strict";

    module( "General", {
        setup: function() {
            this.collapsible = $( "#collapsible" );
            this.trigger = $( "#collapse-trigger" ).collapse({
                duration: 0
            });
        },
        teardown: function() {
            this.trigger.collapse( "destroy" );
        }
    });

    test( "Wrapper element", function() {
        expect( 3 );

        var $collapse = $( ".collapse" );
        strictEqual(
            $collapse.length, 0,
            "No wrappers must exist if no wrapped element was passed"
        );

        this.trigger.collapse( "option", "element", this.collapsible );

        $collapse = $( ".collapse" );
        strictEqual(
            $collapse.length, 1,
            "The wrapper must be created upon setting the wrapped element"
        );

        ok( $collapse.parent().is( "body" ), "The wrapper must be appended to the body" );
    });

    test( "Toggle wrapper on click", function() {
        var $collapse;
        this.trigger.collapse( "option", "element", this.collapsible );
        $collapse = $( ".collapse" );
        console.log($collapse.length);

        this.trigger.trigger( "click" );
        ok( $collapse.is( ":visible" ), "Shows the wrapper" );

        this.trigger.trigger( "click" );
        ok( $collapse.is( ":hidden" ), "Hide the wrapper" );
    });

    test( "Destroy", function() {
        this.trigger.collapse( "destroy" );
        strictEqual( $( ".collapse" ).length, 0, "Removes the wrapper" );

        // To allow destruction in the teardown
        this.trigger.collapse();
    });

})( jQuery );
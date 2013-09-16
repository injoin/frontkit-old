(function( $ ) {
    "use strict";

    module( "General", {
        setup: function() {
            this.widget = $( "#modal-test1" ).modal();
        },
        teardown: function() {
            this.widget.modal( "destroy" );
        }
    });

    test( "markup", function() {
        var hadOverlay, hasOverlay;
        var $wrapper = this.widget.parent();

        ok( $wrapper.is( ".modal" ), "original element parent is the modal wrapper" );
        ok( $wrapper.parent().is( "body" ), "modal is child of body" );

        hadOverlay = $( ".overlay" ).length > 0;
        this.widget.modal( "open" );
        hasOverlay = $( ".overlay" ).length === 1;

        ok( !hadOverlay && hasOverlay, "overlay is created upon modal opening" );
    });
})( jQuery );
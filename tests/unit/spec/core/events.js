(function( $ ) {
    "use strict";

    module( "Events", {
        setup: function() {
            $.frontkit( "widget" );
        },
        teardown: function() {
            $.frontkit.unregister( "widget" );
        }
    });

    test( "create", function() {
        var spy = sinon.spy();
        var $widget = $( "#widget-test1" ).on( "widgetcreate", spy );
        $widget.widget({
            create: spy
        });

        strictEqual( spy.callCount, 2, "callback called via option and jQuery bind" );
        ok( spy.alwaysCalledWithMatch( $.Event ), "callback args" );

        $widget.widget( "destroy" );
    });

    test( "destroy", function() {
        var spy = sinon.spy();
        var $widgets = $( "#widget-test1" ).on( "widgetdestroy", spy );
        $widgets.widget({
            destroy: spy
        }).widget( "destroy" );

        strictEqual( spy.callCount, 2, "callback called via option and jQuery bind" );
        ok( spy.alwaysCalledWithMatch( $.Event ), "callback args" );
    });

})( jQuery, sinon );
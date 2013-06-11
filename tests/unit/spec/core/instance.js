(function( $, sinon ) {
    "use strict";

    module( "Widget - Instance", {
        setup: function() {
            $.frontkit( "widget" );
        },
        teardown: function() {
            $.frontkit.unregister( "widget" );
        }
    });

    test( "instantiation", function() {
        var spy = sinon.spy( $.frontkit, "Widget" );
        var $widgets = $( ".has-widget" ).widget();

        ok( spy.calledWithNew(), "class instances" );
        strictEqual( spy.callCount, $widgets.length, "class instantiated for each element" );
        ok( spy.alwaysCalledWithMatch(
            $.frontkit.widgets.widget,
            sinon.match.has( "nodeType" )
        ), "instantiates with widget API, some jQuery element and options" );

        spy.restore();
    });

    test( "instance access", function() {
        var spy = sinon.spy( $.fn, "widget" );
        try {
            $( ".has-widget" ).widget( "test" );
        } catch( e ) {}

        ok( spy.alwaysThrew(), "throws TypeError if accessing before instantiation" );
    });

})( jQuery, sinon );
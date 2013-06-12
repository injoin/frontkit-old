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
        expect( 4 );

        var spy = sinon.spy( $.frontkit, "Widget" );
        var $widgets = $( ".has-widget" ).widget();

        ok( spy.calledWithNew(), "class instances" );
        strictEqual( spy.callCount, $widgets.length, "class instantiated for each element" );
        ok( spy.alwaysCalledWithMatch(
            $.frontkit.widgets.widget,
        sinon.match.has( "nodeType" )
    ), "instantiates with widget API, some jQuery element and options" );

    $widgets.widget();
    strictEqual( spy.callCount, $widgets.length, "doesn't instantiate twice" );

    spy.restore();
});

    test( "instance access", function() {
        var spy = sinon.spy( $.fn, "widget" );
        var $widgets = $( ".has-widget" );

        try {
            $widgets.widget( "test" );
        } catch( e ) {}

        ok( spy.alwaysThrew(), "throws if accessing method before instantiation" );

        spy.restore();
    });

})( jQuery, sinon );
(function( $, sinon ) {
    "use strict";

    module( "Widget - Instance", {
        setup: function() {
            $.frontkit( "widget", {
                _privateMethod: function() {}
            });
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
        expect( 3 );

        var spy = sinon.spy( $.fn, "widget" );
        var $widgets = $( ".has-widget" );

        // If trying to access before instantiation
        try {
            $widgets.widget( "test" );
        } catch( e ) {}

        ok( spy.alwaysThrew( "Error" ), "throws if accessing method before instantiation" );

        // If trying to access undefined method
        $widgets.widget();
        try {
            $widgets.widget( "test" );
        } catch ( e ) {}
        ok( spy.getCall( 2 ).threw( "TypeError" ), "throws if accessing undefined method" );

        // Reset the current spy and create another one
        spy.restore();
        spy = sinon.spy( $.frontkit.widgets.widget, "_privateMethod" );

        // If trying to access private method
        $widgets.widget( "_privateMethod" );
        strictEqual( spy.callCount, 0, "doesn't call methods prefixed with _ - private" );

        spy.restore();
    });

})( jQuery, sinon );
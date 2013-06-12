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
        expect( 4 );

        var spy1, spy2;
        var $widgets = $( ".has-widget" );
        spy1 = sinon.spy( $.fn, "widget" );

        // If trying to access before instantiation
        try {
            $widgets.widget( "test" );
        } catch( e ) {}

        ok( spy1.alwaysThrew( "Error" ), "throws if accessing method before instantiation" );

        // If trying to access undefined method
        $widgets.widget();
        try {
            $widgets.widget( "test" );
        } catch ( e ) {}
        ok( spy1.getCall( 2 ).threw( "TypeError" ), "throws if accessing undefined method" );

        spy2 = sinon.spy( $.frontkit.widgets.widget, "_privateMethod" );

        // If trying to access private method
        try {
            $widgets.widget( "_privateMethod" );
        } catch ( e ) {}
        ok( spy1.getCall( 3 ).threw( "TypeError" ), "throws if tried to call private methods" );
        strictEqual( spy2.callCount, 0, "doesn't call methods prefixed with _ - private" );

        // Reset spies
        spy1.restore();
        spy2.restore();
    });

    test( "Options", function() {
        var options;
        var $widgets = $( ".has-widget" ).eq( 0 );

        $widgets.widget();
        options = $widgets.data( "widget" ).options;

        // Set - Single property
        $widgets.widget( "option", "test", 123 );
        strictEqual( options.test, 123, "set a single property" );

        // Set - Multi property
        $widgets.widget( "option", {
            a: true,
            b: "okay"
        });
        ok(
            sinon.match({ a: true, b: "okay" }).test( options ),
            "set multiple properties at once"
        );

        // Get - Single property
        strictEqual( $widgets.widget( "option", "a" ), true, "get a single property" );

        // Get - Multi property
        ok(
            sinon.match({ a: true, b: "okay", test: 123 }).test( $widgets.widget( "option" ) ),
            "get multiple properties at once"
        );
    });

})( jQuery, sinon );
(function( $, sinon ) {
    "use strict";

    module( "Widget - Static", {
        setup: function() {
            $.frontkit.reset();
        }
    });

    test( "Registration", function() {
        expect( 6 );

        // No args at all
        $.frontkit();
        deepEqual( $.frontkit.widgets.frontkitWidget1, {
            name: "frontkitWidget1"
        }, "register widget with default name and empty API if no args" );

        // Only API
        $.frontkit({
            api: 123
        });
        deepEqual( $.frontkit.widgets.frontkitWidget2, {
            name: "frontkitWidget2",
            api: 123
        }, "register widget with default name and defined API" );

        // Only name
        $.frontkit( "widget" );
        deepEqual( $.frontkit.widgets.widget, {
            name: "widget"
        }, "register widget with empty API when the name is given" );

        // Both name and API
        $.frontkit( "widget", {
            api: 123
        });
        deepEqual( $.frontkit.widgets.widget, {
            name: "widget",
            api: 123
        }, "register widget with his name and defined API when both args are given" );

        ok( $.fn.widget !== undefined, "defines a jQuery method" );
        ok( $.expr[ ":" ].widget !== undefined, "defines a jQuery :widget selector" );
    });

    test( "Unregistration", function() {
        expect( 3 );

        $.frontkit( "widget" );
        $.frontkit.unregister( "widget" );

        ok( !$.fn.widget, "unregister the jQuery method" );
        ok( !$.expr[ ":" ].widget, "unregister the jQuery :widget selector" );
        ok( !$.frontkit.widgets.widget, "unregister the API" );
    });

    test( "Reset", function() {
        expect( 2 );

        var spy = sinon.spy( $.frontkit, "unregister" );

        $.frontkit( "widget1" );
        $.frontkit( "widget2" );
        $.frontkit( "widget3" );
        $.frontkit.reset();

        strictEqual( spy.callCount, 3, "calls unregister for each registered widget" );
        ok(
            spy.alwaysCalledWithMatch( /widget\d/ ),
            "unregister called with the name of each widget"
        );
    });

    test( "Extension", function() {
        expect( 2 );

        // Valid widget extension
        var spy = sinon.spy( $, "extend" );

        $.frontkit( "widget" );
        $.frontkit.extend( "widget", {
            api1: 123
        }, {
            api2: 456
        });

        strictEqual( spy.firstCall.args.length, 2, "extends the widget with multiple args" );
        spy.restore();

        // Invalid widget extension
        spy = sinon.spy( $.frontkit, "extend" );
        try {
            $.frontkit.extend( "unknownWidget" );
        } catch ( e ) {}

        ok( spy.threw( "TypeError" ), "throws exception if extended widget doesn't exist" );
        spy.restore();
    });

})( jQuery, sinon );
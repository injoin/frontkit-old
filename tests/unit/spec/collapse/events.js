(function( $, sinon ) {
    "use strict";

    module( "Events", {
        setup: function() {
            this.trigger = $( "#collapse-trigger" ).collapse({
                element: "#collapsible"
            });
        },
        teardown: function() {
            this.trigger.collapse( "destroy" );
        }
    });

    test( "beforeCollapse", function() {
        expect( 2 );

        var stub = sinon.stub();
        stub.returns( false );

        this.trigger.collapse( "option", "beforeCollapse", stub );
        this.trigger.triggerHandler( "click" );

        ok( stub.calledOnce, "called before collapsing" );
        ok(
            stub.calledWith( sinon.match.object, sinon.match({ collapsed: false }) ),
            "the collapse state is passed in data.collapsed"
        );
    });

    test( "collapse", function() {
        expect( 2 );

        var stub = sinon.stub();
        stub.returns( false );

        this.trigger.collapse( "option", "collapse", stub );
        this.trigger.triggerHandler( "click" );

        ok( stub.calledOnce, "called after collapsing" );
        ok(
            stub.calledWith( sinon.match.object, sinon.match({ collapsed: true }) ),
            "the collapse state is passed in data.collapsed"
        );
    });

})( jQuery, sinon );
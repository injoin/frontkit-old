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
        var stub = sinon.stub();
        stub.returns( false );

        this.trigger.collapse( "option", "beforeCollapse", stub );
        this.trigger.triggerHandler( "click" );

        ok( stub.calledOnce, "called when collapsing" );
        ok( stub.calledWith( sinon.match.object, sinon.match({ collapsed: false }) ) );
    });

    test( "collapse", function() {
        var stub = sinon.stub();
        stub.returns( false );

        this.trigger.collapse( "option", "collapse", stub );
        this.trigger.triggerHandler( "click" );

        ok( stub.calledOnce, "called after collapsing" );
        ok( stub.calledWith( sinon.match.object, sinon.match({ collapsed: true }) ) );
    });

})( jQuery, sinon );
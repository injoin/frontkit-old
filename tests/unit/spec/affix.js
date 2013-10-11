suite( "Affix", function() {
    "use strict";

    // Inject frontkit.affix module
    setup( module( "frontkit.affix" ) );

    setup(inject(function( $rootScope, $compile ) {
        var that = this;
        this.element = angular.element( "<div fk-affix></div>" );

        // Function used whenever we need to stub values before the directive scope is instantiated
        this.compile = function() {
            that.element = $compile( that.element )( $rootScope );
            return that.element;
        };
    }));

    test( "should have class .affix", function() {
        this.compile();
        expect( this.element.hasClass( "affix" ) ).to.be.ok;
    });

    test(
        "position should be the same when page hasn't enough scrolling",
        inject(function( $window ) {
            var $element;
            var stub = sinon.stub( $.prototype, "offset" );

            stub.returns({
                top: 100
            });

            $element = this.compile();

            // Restore the stub, as it's no longer needed
            stub.restore();

            $element.scope().offsetTop = 40;
            $window.scrollY = 60;

            // Fire the event and assert its result
            $( $window ).triggerHandler( "scroll" );
            expect( $element.hasClass( "affix-inactive" ) ).to.be.ok;
        })
    );

    test(
        "top position should be offset-top when enough scrolling",
        inject(function( $window ) {
            var $element, scope;
            var stub = sinon.stub( $.prototype, "offset" );

            stub.returns({
                top: 100
            });

            $element = this.compile();

            // Restore the stub; we no longer need it.
            stub.restore();

            scope = $element.scope();

            scope.offsetTop = 40;
            $window.scrollY = 80;

            // Fire the event and assert its result
            $( $window ).triggerHandler( "scroll" );

            // Firstly: the class shouldn't be present
            expect( !$element.hasClass( "affix-inactive" ) ).to.be.ok;

            // Then: its position must match what's in offset-top attribute
            expect( $element.css( "top" ) ).to.equal( "40px" );
        })
    );

    test(
        "bottom position should be offset-bottom when exceeding document height",
        inject(function( $window ) {
            var stub = sinon.stub( $.prototype, "height" );
            var $element = this.compile();

            stub.returns( 50 );
            $element.scope().offsetBottom = 20;

            // Fire the event and assert its result
            $( $window ).triggerHandler( "scroll" );

            // Firstly: the class shouldn't be present
            expect( !$element.hasClass( "affix-inactive" ) ).to.be.ok;

            // Then: its position must match what's in offset-bottom attribute
            expect( $element.css( "bottom" ) ).to.equal( "20px" );

            // Restore stub
            stub.restore();
        })
    );

    test( "calls on-activate event", inject(function( $window ) {
        var spy = sinon.spy();
        var $element = this.compile();
        var scope = $element.scope();

        scope.active = false;
        scope.onActivate = spy;

        $window.scrollY = 100;
        $( $window ).triggerHandler( "scroll" );

        // Validates change false -> true
        expect( spy.args[ 0 ][ 0 ] ).to.deep.equal({
            $data: {
                active: true
            }
        });

        $window.scrollY = 0;
        $( $window ).triggerHandler( "scroll" );

        // Validates change true -> false
        expect( spy.args[ 1 ][ 0 ] ).to.deep.equal({
            $data: {
                active: false
            }
        });
    }));

});
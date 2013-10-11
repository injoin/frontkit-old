suite( "Utils", function() {
    "use strict";

    // Inject frontkit.modal module
    setup( module( "frontkit.utils" ) );

    suite( "$templatePromise", function() {
        var $templatePromise, $rootScope;

        setup( inject(function( $injector ) {
            $rootScope = $injector.get( "$rootScope" );
            $templatePromise = $injector.get( "$templatePromise" );
        }));

        test( "should return promise for template string", function() {
            var spy = sinon.spy();
            $templatePromise( "lorem ipsum" ).then( spy );
            $rootScope.$apply();

            expect( spy.args[ 0 ][ 0 ] ).to.equal( "lorem ipsum" );
        });

        test(
            "should return promise for template content from url",
            inject(function( $httpBackend ) {
                var spy = sinon.spy();

                $httpBackend.whenGET( "/template.html" ).respond( "lorem ipsum", {} );
                $httpBackend.expectGET( "/template.html" ).respond( "lorem ipsum", {} );

                $templatePromise( null, "/template.html" ).then( spy );
                $httpBackend.flush();

                expect( spy.args[ 0 ][ 0 ] ).to.equal( "lorem ipsum" );

                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            })
        );

        test( "should make use of $templateCache", inject(function( $templateCache ) {
            var spy = sinon.spy();
            var url = "/" + Date.now() + ".html";

            $templateCache.put( url, "lorem ipsum" );
            $templatePromise( null, url ).then( spy );
            $rootScope.$apply();

            expect( spy.args[ 0 ][ 0 ] ).to.equal( "lorem ipsum" );
        }));
    });
});
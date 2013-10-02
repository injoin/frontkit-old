suite( "Modal", function() {
    "use strict";

    var $rootScope, $compile, $document, $timeout;

    // Inject frontkit.modal module
    setup( module( "frontkit.modal" ) );

    setup( inject(function( $injector ) {
        this.element = $( "<fk-modal></fk-modal>" );

        $rootScope = $injector.get( "$rootScope" );
        $compile = $injector.get( "$compile" );
        $document = $injector.get( "$document" );
        $timeout = $injector.get( "$timeout" );

        // When there's need to modify the template before
        this.compile = function() {
            this.element = $compile( this.element )( $rootScope );
            this.controller = this.element.controller( "fkModal" );
            this.scope = this.element.scope();

            $rootScope.$apply();

            return this;
        };
    }));

    teardown(function() {
        this.controller && this.controller.$destroy();
    });

    suite( "provider", function() {
        var $modal;

        setup( inject(function( $injector ) {
            $modal = $injector.get( "$modal" );
        }));

        test( "should throw if no template given", function() {
            expect( $modal.create ).to.throw( Error );
        });

        test( "returns instance of modal manager", function() {
            var modal = $modal.create({
                template: "lorem ipsum"
            });

            expect( modal.open ).to.be.a( "function" );
            expect( modal.close ).to.be.a( "function" );
            expect( modal.isOpen ).to.be.a( "function" );
            expect( modal.destroy ).to.be.a( "function" );
        });
    });

    suite( "directive", function() {
        setup(function() {
            this.compile();
        });

        test( "initialization", function() {
            // 'opened' must be false
            expect( this.controller.opened ).not.to.be.ok;

            // must be hidden (.hide class)
            expect( this.element.hasClass( "hide" ) ).to.be.ok;

            // Needs an overlay
            expect( this.scope.overlay.next()[ 0 ] ).to.equal( this.element[ 0 ] );
        });

        // $open() method suite
        // --------------------
        suite( "$open()", function() {
            test( "opened status should be true", function() {
                this.controller.$open();
                expect( this.controller.$isOpen() ).to.be.ok;
            });

            test( "should make it visible", function() {
                this.controller.$open();

                expect( this.element.hasClass( "hide" ) ).not.to.be.ok;
                expect( this.element.hasClass( "invisible" ) ).not.to.be.ok;
            });

            test( "should make it appear over the other modals", function() {
                var element1 = this.element;
                var element2 = $compile( $( "<fk-modal></fk-modal>" ) )( $rootScope );
                var ctrl1 = this.controller;
                var ctrl2 = element2.controller( "fkModal" );

                ctrl1.$open();
                ctrl2.$open();
                expect( +element2.css( "z-index" ) ).to.be.gt( +element1.css( "z-index" ) );
            });

            test( "sets modal width and height", function() {
                var width = sinon.spy( $.prototype, "width" );
                var height = sinon.spy( $.prototype, "height" );

                this.scope.width = 500;
                this.scope.height = 350;
                this.controller.$open();

                expect( width.args[ 0 ][ 0 ] ).to.equal( 500 );
                expect( height.args[ 0 ][ 0 ] ).to.equal( 350 );

                width.restore();
                height.restore();
            });

            test( "centralizes the modal", function() {
                var css;
                var $element = this.element;
                this.controller.$open();

                css = $element.css([ "margin-left", "margin-top" ]);

                expect( css ).to.deep.equal({
                    "margin-left": parseInt( -$element.width() / 2, 10 ) + "px",
                    "margin-top": parseInt( -$element.height() / 2, 10 ) + "px"
                });
            });
        });

        // $close() method suite
        // ---------------------
        suite( "$close()", function() {
            test( "opened status should be false", function() {
                this.controller.$open();
                this.controller.$close();

                expect( this.controller.$isOpen() ).not.to.be.ok;
            });

            test( "should make it hidden", function() {
                this.controller.$open();
                this.controller.$close();

                expect( this.element.hasClass( "hide" ) ).to.be.ok;
                expect( this.scope.overlay.hasClass( "hide" ) ).to.be.ok;
            });
        });
    });

    suite( "options", function() {
        test( "title", function() {
            var $header;

            this.element.attr( "title", "lorem ipsum" );
            this.compile();

            $header = $( this.element[ 0 ].querySelector( ".modal-header-title" ) );
            expect( $header.html() ).to.equal( "lorem ipsum" );
        });

        suite( "closeOn", function() {
            // Utility to setup the option value and the spy
            function setupCloseOn( that, attr ) {
                that.element.attr( "close-on", attr );
                that.compile();

                return sinon.spy( that.controller, "$close" );
            }

            test( "both", function() {
                var spy = setupCloseOn( this, "both" );

                this.controller.$open();
                this.scope.overlay.triggerHandler( "click" );
                expect( spy.callCount ).to.equal( 1 );

                this.controller.$open();
                $document.triggerHandler( "keyup", {
                    keyCode: 27
                });
                expect( spy.callCount ).to.equal( 2 );

                spy.restore();
            });

            test( "overlay", function() {
                var spy = setupCloseOn( this, "overlay" );

                this.controller.$open();
                this.scope.overlay.triggerHandler( "click" );
                expect( spy.callCount ).to.equal( 1 );

                this.controller.$open();
                $document.triggerHandler( "keyup", {
                    keyCode: 27
                });
                expect( spy.callCount ).to.equal( 1 );

                spy.restore();
            });

            test( "escape", function() {
                var spy = setupCloseOn( this, "escape" );

                this.controller.$open();
                this.scope.overlay.triggerHandler( "click" );
                expect( spy.callCount ).to.equal( 0 );

                this.controller.$open();
                $document.triggerHandler( "keyup", {
                    keyCode: 27
                });
                expect( spy.callCount ).to.equal( 1 );

                spy.restore();
            });
        });
    });
});

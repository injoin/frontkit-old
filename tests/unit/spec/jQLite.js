suite( "jQLite", function() {
    "use strict";

    setup(function() {
        $( document.body ).append( "<div id='jqlite-test'></div>" );
        this.element = $( document.getElementById( "jqlite-test" ) );
    });

    teardown(function() {
        // We've put it into the DOM, we'll remove it aswell
       this.element.remove();
    });

    // offset() method suite
    // ---------------------
    suite( "offset()", function() {
        setup(function() {
            this.element.css({
                position: "fixed",
                top: "250px",
                marginTop: "50px",
                left: "150px",
                marginLeft: "50px"
            });
        });

        test( "should be defined", function() {
            expect( this.element.offset ).to.be.a( "function" );
        });

        test( "returns correct positioning", function() {
            var pos = this.element.offset();
            expect( pos ).to.deep.equal({
                top: 300,
                left: 200
            });
        });

        test( "returns correct positioning on nested elements", function() {
            var innerElement;
            this.element.html( "<div></div>" );

            innerElement = this.element.find( "div" );
            innerElement.css({
                position: "absolute",
                top: "100px",
                left: "50px"
            });

            // The parent has border of 1px, so we add this 1px to correctly match the offset
            expect( innerElement.offset() ).to.deep.equal({
                top: 401,
                left: 251
            });
        });
    });

    // css() method suite
    // ------------------
    suite( "css()", function() {
        test( "should be defined", function() {
            expect( this.element.css ).to.be.a( "function" );
        });

        test( "should return nothing if no args", function() {
            expect( this.element.css() ).to.be.undefined;
        });

        test( "should return computed style", function() {
            expect( this.element.css( "font-size" ) ).to.equal( "14px" );
        });

        test( "should return inline style (when available)", function() {
            // We set the inline style first
            this.element.attr( "style", "font-size: 15px" );

            // Then we test if it's being returned properly
            expect( this.element.css( "font-size" ) ).to.equal( "15px" );
        });

        test( "accepts array of properties to get", function() {
            // Because of Firefox, we can't simply get padding/border-style.
            // But oh well, let's try first with dashed properties
            var css = this.element.css([ "padding-top", "border-left-style" ]);

            expect( css ).to.deep.equal({
                "padding-top": "10px",
                "border-left-style": "solid"
            });

            // Now we'll try with camelcase properties
            css = this.element.css([ "paddingTop", "borderLeftStyle" ]);
            expect( css ).to.deep.equal({
                "paddingTop": "10px",
                "borderLeftStyle": "solid"
            });
        });

        test( "should set inline styles", function() {
            var ret = this.element.css( "cursor", "pointer" );

            // For chaining
            expect( ret ).to.equal( this.element );

            // Value should be set
            expect( this.element[ 0 ].style.cursor ).to.equal( "pointer" );
        });

        test( "accepts object of property-value pairs to set", function() {
            var ret = this.element.css({
                width: "200px",
                display: "inline-block"
            });

            // For chaining
            expect( ret ).to.equal( this.element );

            // Value should be set
            expect( this.element[ 0 ].style.width ).to.equal( "200px" );
            expect( this.element[ 0 ].style.display ).to.equal( "inline-block" );
        });

        test( "sets vendor-prefixed values", function() {
            this.element.css( "box-sizing", "border-box" );
            expect( this.element.css( "box-sizing" ) ).to.equal( "border-box" );
        });
    });

    // width/height method suite
    // -------------------------
    suite( "width/height", function() {
        test( "should be defined", function() {
            expect( this.element.width ).to.be.a( "function" );
            expect( this.element.height ).to.be.a( "function" );
        });

        test( "should return right value", function() {
            expect( this.element.width() ).to.equal( 150 );
            expect( this.element.height() ).to.equal( 100 );

            this.element.css( "box-sizing", "border-box" );
            expect( this.element.width() ).to.equal( 150 );
            expect( this.element.height() ).to.equal( 100 );
        });

        test( "sets right value", function() {
            this.element.width( 200 );
            expect( this.element.width() ).to.equal( 200 );

            this.element.css( "box-sizing", "border-box" );
            this.element.width( 200 );
            expect( this.element.width() ).to.equal( 200 );
        });
    });

    // innerWidth/innerHeight method suite
    // -----------------------------------
    suite( "innerWidth/innerHeight", function() {
        test( "should be defined", function() {
            expect( this.element.innerWidth ).to.be.a( "function" );
            expect( this.element.innerHeight ).to.be.a( "function" );
        });

        test( "should return right value", function() {
            expect( this.element.innerWidth() ).to.equal( 150 );
            expect( this.element.innerHeight() ).to.equal( 100 );

            this.element.css( "box-sizing", "border-box" );
            expect( this.element.innerWidth() ).to.equal( 128 );
            expect( this.element.innerHeight() ).to.equal( 78 );
        });

        test( "sets right value", function() {
            this.element.innerWidth( 200 );
            expect( this.element.innerWidth() ).to.equal( 200 );

            this.element.css( "box-sizing", "border-box" );
            this.element.innerWidth( 200 );
            expect( this.element.innerWidth() ).to.equal( 200 );
        });
    });

    // outerWidth/outerHeight method suite
    // -----------------------------------
    suite( "outerWidth/outerHeight", function() {
        test( "should be defined", function() {
            expect( this.element.outerWidth ).to.be.a( "function" );
            expect( this.element.outerHeight ).to.be.a( "function" );
        });

        test( "should return right value", function() {
            expect( this.element.outerWidth() ).to.equal( 172 );
            expect( this.element.outerHeight() ).to.equal( 122 );

            this.element.css( "box-sizing", "border-box" );
            expect( this.element.outerWidth() ).to.equal( 150 );
            expect( this.element.outerHeight() ).to.equal( 100 );
        });

        test( "sets right value", function() {
            this.element.outerWidth( 200 );
            expect( this.element.outerWidth() ).to.equal( 200 );

            this.element.css( "box-sizing", "border-box" );
            this.element.outerWidth( 200 );
            expect( this.element.outerWidth() ).to.equal( 200 );
        });
    });
});
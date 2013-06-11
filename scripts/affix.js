(function( $, window ) {
    "use strict";

    var $window = $( window );
    var $instances = $();

    $.frontkit( "affix", {
        top: 0,
        active: false,

        options: {
            offset: 0,
            position: 0,
            mobile: true,

            // Event callbacks
            activate: null
        },

        _initialize: function() {
            this.top = this.element.offset().top;
            this.element.addClass( "affix" );

            if ( !this.options.mobile ) {
                this.element.addClass( "affix-no-mobile" );
            }

            $instances = $instances.add( this.element );
        },

        _setOption: function( name, value ) {
            if ( name === "offset" || name === "position" ) {
                value = parseFloat( value );
            }

            this.super( name, value );
        },

        _positionElement: function( scrollTop ) {
            var wasActive = this.active;

            if ( this.element.is( ":hidden" ) ) {
                return;
            }

            if ( scrollTop > ( this.top - this.options.offset ) ) {
                this.element.css( "top", this.options.position );
                this.element.removeClass( "affix-inactive" );

                if ( !wasActive ) {
                    this.active = true;
                    this._trigger( "activate", {}, {
                        active: true
                    });
                }
            } else {
                this.element.addClass( "affix-inactive" );

                if ( wasActive ) {
                    this.active = false;
                    this._trigger( "activate", {}, {
                        active: false
                    });
                }
            }
        }
    });

    $window.on( "scroll.affix", function() {
        var scrollTop = $window.scrollTop();

        $instances.each(function() {
            $( this ).data( "affix" )._positionElement( scrollTop );
        });
    });

})( jQuery, window );
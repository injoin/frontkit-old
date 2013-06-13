(function( $, window ) {
    "use strict";

    var $window = $( window );
    var instances = [];

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
            this.element.addClass( "affix affix-inactive" );

            if ( !this.options.mobile ) {
                this.element.addClass( "affix-no-mobile" );
            }

            // Keep a cache of this instance, so when window event occurs,
            // we don't need to search the whole page again
            instances.push( this );
        },

        _setOption: function( name, value ) {
            if ( name === "offset" || name === "position" ) {
                value = parseFloat( value );
            } else if ( name === "mobile" ) {
                this.element.toggleClass( "affix-no-mobile", !value );
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
        },

        _destroy: function() {
            var index = instances.indexOf( this );
            instances.splice( index, 1 );

            this.element.removeClass( "affix affix-no-mobile affix-inactive" );
        }
    });

    $window.data( "affixInstances", instances ).on( "scroll.affix", function() {
        var scrollTop = $window.scrollTop();
        var i = 0;
        var len = instances.length;

        for ( ; i < len; i++ ) {
            instances[ i ]._positionElement( scrollTop );
        }
    });

})( jQuery, window );
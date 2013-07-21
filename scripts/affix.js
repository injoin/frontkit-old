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

            // Event callbacks
            activate: null
        },

        _initialize: function() {
            this.top = this.element.offset().top;
            this.element.addClass( "affix affix-inactive" );

            // Keep a cache of this instance, so when window event occurs,
            // we don't need to search the whole page again
            instances.push( this );
        },

        _setOption: function( name, value ) {
            if ( name === "offset" || name === "position" ) {
                value = parseFloat( value );
                value = isNaN( value ) ? 0 : value;
            }

            this.super( name, value );
        },

        _positionElement: function( scrollTop ) {
            var nowActive;
            var wasActive = this.active;

            // There's no why to adjust the position of an hidden element...
            if ( this.element.is( ":hidden" ) ) {
                return;
            }

            if ( scrollTop > ( this.top - this.options.offset ) ) {
                // We're activating the affix here
                this.element.css( "top", this.options.position );
                this.element.removeClass( "affix-inactive" );

                nowActive = true;
            } else {
                this.element.addClass( "affix-inactive" );
                nowActive = false;
            }

            // The event is only triggered when the affix was active but now it's not, OR
            // when the opposite situation occurs.
            if ( ( !wasActive && nowActive ) || ( wasActive && !nowActive ) ) {
                this.active = nowActive;
                this._trigger( "activate", {}, {
                    active: nowActive
                });
            }
        },

        _destroy: function() {
            // Remove the instance from our cache
            var index = instances.indexOf( this );
            instances.splice( index, 1 );

            // Our custom classes must go away too!
            this.element.removeClass( "affix affix-inactive" );
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
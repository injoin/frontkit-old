(function( $, window ) {
    "use strict";

    var $window = $( window );
    var instances = [];

    var classes = {
        AFFIX: "affix",
        AFFIX_INACTIVE: "affix-inactive"
    };

    $.frontkit( "affix", {
        start: 0,
        active: false,

        options: {
            offsetTop: 0,
            offsetBottom: 0,

            // Event callbacks
            activate: null
        },

        _initialize: function() {
            this.start = this.element.offset().top;
            this.element.addClass( classes.AFFIX + " " + classes.AFFIX_INACTIVE );

            // Keep a cache of this instance, so when window event occurs,
            // we don't need to search the whole page again
            instances.push( this );
        },

        _setOption: function( name, value ) {
            if ( name === "offsetTop" || name === "offsetBottom" ) {
                value = parseFloat( value );
                value = isNaN( value ) ? 0 : value;
            }

            this.super( name, value );
        },

        _positionElement: function( scrollTop ) {
            var position, nowActive;
            var wasActive =     this.active;
            var offsetHeight =  document.body.offsetHeight;
            var scrollHeight =  $( document ).height();
            var elemHeight =    this.element.outerHeight();
            var elemOffset =    this.element.offset().top;
            var offsetTop =     this.options.offsetTop;
            var offsetBottom =  this.options.offsetBottom;

            // There's no why to adjust the position of an hidden element...
            if ( this.element.is( ":hidden" ) ) {
                return;
            }

            position = {
                top: "auto",
                bottom: "auto"
            };

            if ( scrollTop > ( this.start - offsetTop ) ) {
                if ( ( elemOffset + elemHeight ) >= ( scrollHeight - offsetBottom ) ) {
                    position.bottom = offsetBottom;
                } else {
                    position.top = offsetTop;
                }

                // We're activating the affix here
                this.element.css( position );
                this.element.removeClass( classes.AFFIX_INACTIVE );

                nowActive = true;
            } else {
                this.element.addClass( classes.AFFIX_INACTIVE );
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
            this.element.removeClass( classes.AFFIX + " " + classes.AFFIX_INACTIVE );
        }
    });

    $window.data( "affixInstances", instances ).on( "scroll.affix", function() {
        var i, len;
        var scrollTop = $window.scrollTop();
        var height = $window.height();

        for ( i = 0, len = instances.length; i < len; i++ ) {
            instances[ i ]._positionElement( scrollTop, height );
        }
    });

})( jQuery, window );
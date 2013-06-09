(function( $, window ) {
    "use strict";

    var $window = $( window );
    var $instances = $();

    $.frontkit( "affix", {
        top: 0,

        options: {
            offset: 0,
            position: 0
        },

        _initialize: function() {
            this.top = this.element.offset().top;
            this.element.addClass( "affix" );

            $instances = $instances.add( this.element );
        },

        _setOption: function( name, value ) {
            if ( name === "offset" || name === "position" ) {
                value = parseFloat( value );
            }

            this.super( name, value );
        },

        _positionElement: function( scrollTop ) {
            if ( this.element.is( ":hidden" ) ) {
                return;
            }

            if ( scrollTop > ( this.top - this.options.offset ) ) {
                this.element.css( "top", this.options.position );
                this.element.removeClass( "affix-inactive" );
            } else {
                this.element.addClass( "affix-inactive" );
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
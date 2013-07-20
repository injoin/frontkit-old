(function( $, window ) {
    "use strict";

    var $body = $( "body" );
    var collapseStyles = [ "top", "side" ];

    $.frontkit( "collapse", {
        wrapper: null,

        options: {
            element: null,
            style: "top",
            duration: 400
        },

        _initialize: function() {
            this._on( "click", $.proxy( this._toggleCollapse, this ) );
        },

        _setOption: function( name, value ) {
            if ( name === "element" ) {
                if ( typeof value === "string" ) {
                    value = $( value );
                } else if ( !( value instanceof $ ) ) {
                    value = null;
                }

                return this._wrapElements( value );
            } else if ( name === "duration" ) {
                value = +value;
                value = isNaN( value ) ? 400 : value;
            } else if ( name === "style" ) {
                value = String( value ).toLowerCase().trim();
                value = collapseStyles.indexOf( value ) > -1 ? value : "top";
            }

            this.super( name, value );
        },

        _toggleCollapse: function() {
            this.wrapper.slideToggle( this.options.duration );
        },

        _wrapElements: function( $el ) {
            // Create the wrapper if it doesn't already exist
            if ( !this.wrapper ) {
                this.wrapper = $( "<div />" );
                this.wrapper.addClass( "collapse" ).prependTo( $body );
            }

            if ( this.options.element ) {
                this.options.element.removeClass( "collapse-item" );
            }

            this.wrapper.empty();
            if ( $el != null ) {
                $el.clone().appendTo( this.wrapper );
                $el.addClass( "collapse-item" );
            }

            this.options.element = $el;
        }
    });

})( jQuery, window );
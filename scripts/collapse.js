(function( $, document ) {
    "use strict";

    var $body = $( "body" );
    var collapseStyles = [ "top", "side" ];

    var classes = {};
    classes.HIDDEN_ACCESSIBLE = "hidden-accessible";
    classes.COLLAPSE = "collapse";
    classes.COLLAPSE_ITEM = "collapse-item";

    $.frontkit( "collapse", {
        wrapper: null,
        visible: false,

        options: {
            element: null,
            style: "top",
            duration: 400
        },

        _initialize: function() {
            this._on( "click", $.proxy( this.toggle, this ) );
        },

        _destroy: function() {
            if ( ( this.wrapper instanceof $ ) ) {
                // Let's simply remove our wrapper!
                this.wrapper.remove();
            }
        },

        _setOption: function( name, value ) {
            if ( name === "element" ) {
                if ( typeof value === "string" || value.nodeType ) {
                    value = $( value ).eq( 0 );
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

        // Toggle collapsed state of the wrapper element.
        toggle: function() {
            var sideWidth;
            var data = {
                collapsed: this.visible
            };

            // Allow canceling collapsing
            if ( !this._trigger( "beforeCollapse", null, data ) ) {
                return;
            }

            // Add a helper class
            this.wrapper.removeClass( "collapse-top collapse-side" );
            this.wrapper.addClass( "collapse-" + this.options.style );

            // Shows the wrapped elements
            if ( this.options.style === "side" ) {
                this.wrapper.addClass( classes.HIDDEN_ACCESSIBLE );
                sideWidth = this.wrapper.width();
                this.wrapper.css( "margin-left", -sideWidth );
                this.wrapper.removeClass( classes.HIDDEN_ACCESSIBLE );

                $body.css( "position", "relative" );

                // If we used margin/padding, the content would be pressed.
                $body.animate({
                    left: !this.visible ? sideWidth : 0
                });

                this.wrapper.toggle( this.options.duration );
            } else {
                this.wrapper.slideToggle( this.options.duration );
            }

            this.visible = !this.visible;
            data.collapsed = this.visible;
            this._trigger( "collapse", null, data );
        },

        // Wraps an element with a .collapse element
        _wrapElements: function( $el ) {
            if ( !this.wrapper ) {
                // Create the wrapper if it doesn't already exist
                this.wrapper = $( document.createElement( "div" ) );
                this.wrapper.hide()
                            .addClass( classes.COLLAPSE )
                            .prependTo( $body );
            } else {
                // We may clean the current contents of the wrapper...
                this.wrapper.empty();
            }

            if ( this.options.element ) {
                this.options.element.removeClass( classes.COLLAPSE_ITEM );
            }

            // If a valid element was provided, let's append a clone of it
            if ( $el != null ) {
                $el.clone().appendTo( this.wrapper );
                $el.addClass( classes.COLLAPSE_ITEM );
            }

            this.options.element = $el;
        }
    });

})( jQuery, document );
(function( $, document ) {
    "use strict";

    var zindexOverlay, zindexModal;
    var zindex = 1;
    var openModals = [];
    var $document = $( document );
    var classes = {
        HIDE: "hide",
        INVISIBLE: "invisible",
        WRAPPER: "modal",
        TITLE: "modal-header-title",
        CONTENT: "modal-content",
        OVERLAY: "overlay"
    };

    $.frontkit( "modal", {
        originalPosition: null,
        originalCss: null,
        overlay: null,
        wrapper: null,
        isOpen: false,
        options: {
            width: "auto",
            height: "auto",
            title: "",
            closeOn: "both"
        },

        _initialize: function() {
            var $element = this.element;

            // Keep the original position of the element
            this.originalPosition = {
                parent: $element.parent(),
                index: $element.parent().children().index( $element )
            };

            // Also keep the original CSS of the element
            this.originalCss = $element.css([
                "display",
                "width",
                "height",
                "min-height",
                "max-height"
            ]);

            // Create the wrapper structure of the modal
            this._createWrapper();

            // Bind some events somewhere else
            this._bindEvents();
        },

        _destroy: function() {
            // Place the element in its original position
            var $children = this.originalPosition.parent.children();
            var index = this.originalPosition.index;
            index = index > $children.length ? $children.length - 1 : index;

            $children.eq( index ).insertAfter( this.element );

            // Also restore the CSS
            this.element.css( this.originalCss );

            // Remove the content class from the element aswell
            this.element.removeClass( classes.CONTENT );

            // Remove other stuff from the DOM
            this.wrapper.remove();
            this.overlay && this.overlay.remove();
        },

        _setOption: function( key, value ) {
            if ( key === "title" && this.wrapper ) {
                this._setTitle( value );
            } else if ( key === "closeOn" ) {
                value = String( value ).toLowerCase();

                if ( [ "both", "escape", "overlay" ].indexOf( value.toLowerCase() ) === -1 ) {
                    value = false;
                }
            } else if ( key === "width" || key === "height" ) {
                value = !value ? "auto" : value;
            }

            this.super( key, value );
        },

        widget: function() {
            return this.wrapper;
        },

        // Sets the title of the modal in the element
        _setTitle: function( title ) {
            this.wrapper.find( "." + classes.TITLE ).html( title );
        },

        // Open the modal, sets its width/height and create the overlay (if needed)
        open: function() {
            var wrapperWidth, wrapperHeight;
            var modal = this;
            var $overlay = modal.overlay;
            var $wrapper = modal.wrapper;

            if ( modal.isOpen ) {
                // Nothing to do, we're already open
                return;
            }

            // Increment the zindex to keep it in the top of the stack
            zindex++;

            if ( !$overlay ) {
                modal.overlay = $overlay = $( document.createElement( "div" ) );
                $overlay.addClass( classes.OVERLAY );
                $overlay.css( "z-index", zindexOverlay + zindex );
                $overlay.appendTo( document.body );

                $overlay.on( "click", function() {
                    if ( modal._closeable( "overlay" ) ) {
                        modal.close();
                    }
                });
            }

            $overlay.show();

            $wrapper.css( "z-index", zindexModal + zindex );
            $wrapper.toggleClass( classes.INVISIBLE + " " + classes.HIDE );

            // Set and get the wrapper width
            if ( modal.options.width !== "auto" ) {
                wrapperWidth = $wrapper.outerWidth( modal.options.width ).outerWidth();
            } else {
                wrapperWidth = $wrapper.outerWidth();
                $wrapper.css( "width", wrapperWidth );
            }

            // Set and get the wrapper height
            if ( modal.options.height !== "auto" ) {
                wrapperHeight = $wrapper.outerHeight( modal.options.height ).outerHeight();
            } else {
                wrapperHeight = $wrapper.outerHeight();
                $wrapper.css( "height", wrapperHeight );
            }

            $wrapper.css({
                "margin-left": -( wrapperWidth / 2 ),
                "margin-top": -( wrapperHeight / 2 )
            });

            $wrapper.removeClass( classes.INVISIBLE );

            modal.isOpen = true;
            openModals.unshift( this );
        },

        // Closes the modal
        close: function() {
            this.overlay.hide();
            this.wrapper.addClass( classes.HIDE );
            this.isOpen = false;
        },

        // Toggle open/close the modal.
        toggle: function() {
            return this.isOpen ? this.close() : this.open();
        },

        _createWrapper: function() {
            var $wrapper, $content, $header, $close, $title;

            $wrapper = this.wrapper = $( document.createElement( "div" ) );
            $wrapper.addClass( classes.WRAPPER + " " + classes.HIDE );
            $wrapper.appendTo( document.body );

            $header = $( document.createElement( "div" ) );
            $header.addClass( "modal-header" );
            $header.appendTo( $wrapper );

            // The title bar will receive the title now, as the init runs after the options were set
            $title = $( document.createElement( "div" ) );
            $title.addClass( classes.TITLE );
            $title.appendTo( $header );
            this._setTitle( this.options.title );

            $close = $( document.createElement( "span" ) );
            $close.addClass( "close" ).html( "&times;" );
            $close.appendTo( $header );

            $content = this.element;
            $content.addClass( classes.CONTENT ).removeClass( classes.HIDE );
            $content.show();
            $content.appendTo( $wrapper  );
        },

        _bindEvents: function() {
            this._on( "click", ".close", $.proxy( this.close, this ) );
        },

        _closeable: function( type ) {
            var option = this.options.closeOn;
            if ( type === "escape" ) {
                return option === "both" || option === "escape";
            } else if ( type === "overlay" ) {
                return option === "both" || option === "overlay";
            }

            return false;
        }
    });

    $document.on( "ready", function() {
        // Create a test div to pick the z-index of overlays and modals.
        // This is done so we don't have to get calculating this everytime
        var $testDiv = $( document.createElement( "div" ) ).appendTo( document.body );
        zindexOverlay = +$testDiv.addClass( "overlay" ).css( "z-index" ) || 0;
        zindexModal = +$testDiv.toggleClass( "overlay modal" ).css( "z-index" ) || 0;

        // Everything we needed was done, just remove it.
        $testDiv.remove();
    });

    $document.on( "keyup", function( e ) {
        // ESC pressed? Let's close the topmost modal - if it can
        if ( e.keyCode === 27 && openModals.length && openModals[ 0 ]._closeable( "escape" ) ) {
            openModals.shift().close();
        }
    });

})( jQuery, document );
!function( angular, window, document ) {
    "use strict";

    var $ = angular.element;
    var jQLite = $.prototype;
    var forEach = angular.forEach;
    var isDefined = angular.isDefined;
    var docElem = document.documentElement;

    function contained( elem ) {
        if ( docElem.contains || docElem.compareDocumentPosition ) {
            return elem.nodeType === 9 || !!(
                docElem.contains ?
                    docElem.contains( elem ) :
                    docElem.compareDocumentPosition( elem ) & 16
            );
        }

        while ( elem = elem.parentNode ) {
            if ( docElem === elem ) {
                return true;
            }
        }

        return false;
    }

    // Get a CSS value from a element
    // Taken from this great answer http://stackoverflow.com/a/2664055/2083599
    function getCSS( elem, prop, noVendorPrefix ) {
        var value;
        var doc = ( elem.ownerDocument || document );
        var view = doc.defaultView;

        // Try with vendor prefixes
        if ( !noVendorPrefix && isDefined( jQLite.css.vendorPrefix[ prop ] ) ) {
            forEach( jQLite.css.vendorPrefix[ prop ], function( prefix ) {
                if ( isDefined( value ) && value !== "" ) {
                    return;
                }

                value = getCSS( elem, prefix + prop, true );
            });

            return value;
        }

        // Do we have W3C support (AKA not oldIE)?
        if ( view && view.getComputedStyle ) {
            // Try to get from the computed style first
            value = view.getComputedStyle( elem, null ).getPropertyValue( prop );

            // If nothing found and the element is detached,
            // we can go look into the style declaration.
            if ( value === "" && !contained( elem ) ) {
                value = elem.style.getPropertyValue( prop );
            }
        } else if ( elem.currentStyle ) {
            // Aaaaw crap, we're at oldIE :(
            // We need to make the property camelCase
            prop = prop.replace( /\-(\w)/g, function( str, letter ) {
                return letter.toUpperCase();
            });

            value = elem.currentStyle[ prop ];

            if ( /^\d+(em|pt|%|ex)?$/i.test( value ) ) {
                // Convert other units to pixels
                return (function( val ) {
                    var oldLeft = elem.style.left;
                    var oldRuntimeLeft = elem.runtimeStyle.left;

                    elem.runtimeStyle.left = elem.currentStyle.left;
                    elem.style.left = value || 0;
                    value = elem.style.pixelLeft + "px";
                    elem.style.left = oldLeft;
                    elem.runtimeStyle.left = oldRuntimeLeft;
                    return val;
                })( value );
            }
        }

        return value;
    }

    // Helper to identify border/padding of an element
    function getDimensionExtra( el, dimension, type ) {
        var extra = 0;
        var size1 = dimension === "width" ? "left" : "top";
        var size2 = dimension === "width" ? "right" : "bottom";
        var jqlite = $( el );

        if ( [ "border", "both" ].indexOf( type ) > -1 ) {
            extra += parseInt( jqlite.css( "border-" + size1 + "-width" ), 10 ) || 0;
            extra += parseInt( jqlite.css( "border-" + size2 + "-width" ), 10 ) || 0;
        }

        if ( [ "padding", "both" ].indexOf( type ) > -1 ) {
            extra += parseInt( jqlite.css( "padding-" + size1 ), 10 ) || 0;
            extra += parseInt( jqlite.css( "padding-" + size2 ), 10 ) || 0;
        }

        return extra;
    }

    function sanitizeCSSProperty( prop ) {
        // Sanitize to CSS notation
        return prop.replace( /([A-Z])/g, "-$1" ).toLowerCase();
    }

    // ---------------------------------------------------------------------------------------------

    jQLite.css = function( prop, value ) {
        var prefixes;
        var that = this;

        // No arg, nothing to do
        if ( !prop ) {
            return;
        }

        // Accept arrays as argument, so lots of props can be returned at once
        if ( angular.isArray( prop ) ) {
            value = {};

            angular.forEach( prop, function( key ) {
                value[ key ] = getCSS( that[ 0 ], sanitizeCSSProperty( key ) );
            });

            return value;
        }

        // Setting a bunch of values at once
        if ( angular.isObject( prop ) ) {
            forEach( prop, function( val, key ) {
                that.css( key, val );
            });

            return that;
        }

        prop = sanitizeCSSProperty( prop );

        // Setting value
        if ( value != null ) {
            prefixes = jQLite.css.vendorPrefix[ prop ] || [ "" ];

            forEach( this, function( element ) {
                forEach( prefixes, function( prefix ) {
                    element.style.setProperty( prefix + prop, value + "" );
                });
            });

            return this;
        }

        return getCSS( this[ 0 ], prop );
    };

    jQLite.css.vendorPrefix = {
        "box-sizing": [ "", "-moz-", "-webkit-" ]
    };

    jQLite.offset = function() {
        var offset, win, docElem;
        var element = this[ 0 ];
        var doc = element && element.ownerDocument;

        if ( !doc ) {
            return;
        }

        offset = element.getBoundingClientRect();
        docElem = doc.documentElement;
        win = doc.defaultView;

        return {
            top: offset.top + win.pageYOffset - docElem.clientTop,
            left: offset.left + win.pageXOffset - docElem.clientLeft
        };
    };

    // Dynamically create the following methods:
    // - innerWidth/innerHeight
    // - width/height
    // - outerWidth/outerHeight
    forEach( [ "Width", "Height" ], function( prop ) {
        var propLC = prop.toLowerCase();

        forEach( [ "inner", "", "outer" ], function( prefix ) {
            var method = prefix === "" ? propLC : prefix + prop;

            jQLite[ method ] = function( value ) {
                var boxSizing;
                var el = this[ 0 ];

                // Is it the window?
                el = el === el.window ? el.document : el;

                // Is it the document?
                if ( el.nodeType === 9 ) {
                    if ( value != null ) {
                        return;
                    }

                    return el[ prop ];
                }

                boxSizing = getCSS( el, "box-sizing" );
                if ( value == null ) {
                    value = el[ "offset" + prop ];

                    if ( prefix === "inner" ) {
                        value -= getDimensionExtra( el, propLC, "both" );
                    } else if ( prefix === "" ) {
                        if ( boxSizing === "padding-box" ) {
                            value -= getDimensionExtra( el, propLC, "border" );
                        } else if ( boxSizing === "content-box" ) {
                            value -= getDimensionExtra( el, propLC, "both" );
                        }
                    }

                    return value;
                }

                // Right now it'll go directly; however, the most accurate manner to
                // achieve the right value would be cloning the element...
                if ( /\d+(px|em|%|pt|ex)/.test( value ) ) {
                    return this.css( propLC, value );
                }

                value = parseFloat( value );
                if ( isNaN( value ) ) {
                    return this;
                }

                if ( prefix === "inner" ) {
                    if ( boxSizing === "border-box" ) {
                        value += getDimensionExtra( el, propLC, "both" );
                    } else if ( boxSizing === "padding-box" ) {
                        value += getDimensionExtra( el, propLC, "padding" );
                    }
                } else if ( prefix === "outer" ) {
                    if ( boxSizing === "padding-box" ) {
                        value -= getDimensionExtra( el, propLC, "border" );
                    } else if ( boxSizing === "content-box" ) {
                        value -= getDimensionExtra( el, propLC, "both" );
                    }
                }

                return this.css( propLC, value + "px" );
            };
        });
    });

}( angular, window, document );
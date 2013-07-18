(function( $, undefined ) {
    "use strict";

    var frontkitWidgetId = 0;

    function log( message ) {
        if ( console && console.log && $.frontkit.debug ) {
            console.log( "[FrontKit " + $.frontkit.version + "] " + message );
        }
    }

    $.frontkit = function( name, widget ) {
        // Update our widget unique ID control
        frontkitWidgetId++;

        // Generate default name if it wasn't passed
        if ( typeof name !== "string" ) {
            widget = name;
            name = "frontkitWidget" + frontkitWidgetId;
        }

        // Empty API if it wasn't passed
        if ( !$.isPlainObject( widget ) ) {
            widget = {};
        }

        widget = $.extend( {}, widget );
        widget.name = name;
        $.frontkit.widgets[ name ] = widget;

        $.fn[ name ] = function( arg ) {
            var instance, api, ret;
            var $el = this;
            var args = $.makeArray( arguments ).slice( 1 );

            // If not calling a method
            if ( typeof arg !== "string" ) {
                api = $.frontkit.widgets[ name ];

                return this.each(function( i ) {
                    // Don't create another instance over this one
                    if ( $el.eq( i ).is( ":" + name ) ) {
                        return;
                    }

                    instance = new $.frontkit.Widget( api, this, arg );
                    $el.eq( i ).data( name, instance );
                });
            }

            // Don't allow to call methods if instance is uninitialized.
            if ( !this.is( ":" + name ) ) {
                throw new Error( "Cannot call widget methods prior to initialization." );
            }

            // Also, are we accessing an public, callable thing?
            instance = $el.data( name );
            if ( !$.isFunction( instance[ arg ] ) || arg[ 0 ] === "_" ) {
                throw new TypeError(
                    "Method named " + arg +
                    " is not defined for widget " + name
                );
            }

            // If we didn't had a return, it'll be given the element for chaining
            ret = instance[ arg ].apply( instance, args );
            return ret === undefined ? $el : ret;
        };

        // Create a selector for the plugin
        $.expr[ ":" ][ name.toLowerCase() ] = function( elem ) {
            var data = $.data( elem, name );
            return !!data && data instanceof $.frontkit.Widget;
        };

        log( "Defined new widget " + name );
    };

    // Unregister an widget
    $.frontkit.unregister = function( name ) {
        // We can't unregister something that doesn't exists :)
        if ( !$.frontkit.widgets[ name ] ) {
            return false;
        }

        delete $.expr[ ":" ][ name.toLowerCase() ];
        delete $.fn[ name ];
        delete $.frontkit.widgets[ name ];

        return true;
    };

    // Resets the Frontkit API widget status
    $.frontkit.reset = function() {
        // This is just about loop thru all widgets and calling unregister() on them
        $.each( $.frontkit.widgets, function( name ) {
            $.frontkit.unregister( name );
        });

        // In this case we also reset the widgets ID
        frontkitWidgetId = 0;
    };

    // Extend an widget definition
    $.frontkit.extend = function( name, obj ) {
        var api = $.frontkit.widgets[ name ];

        // What we're going to extend exist?
        if ( !$.isPlainObject( api ) ) {
            throw new TypeError( "The widget name specified does not exist." );
        }

        obj = $.makeArray( arguments ).slice( 1 );
        obj.unshift( api );
        $.extend.apply( null, obj );
    };

    $.frontkit.version = "@VERSION";

    // Stores APIs for each widget
    $.frontkit.widgets = {};

    // Determine whether we're on FrontKit debug mode
    $.frontkit.debug = false;

    // Function to write debug messages
    $.frontkit.log = log;

    // The Widget class
    // ----------------
    $.frontkit.Widget = function( api, element, options ) {
        $.extend( this, api );

        // Applies proxies to this instance
        proxy( this );

        this.eventNamespace = "." + api.name;
        this.element = $( element );
        this.initialize( options );
    };

    $.extend( $.frontkit.Widget.prototype, {
        initialize: function( options ) {
            log( "Initializing " + this.name + " widget" );
            this.options = {};
            this.option( options );

            if ( $.isFunction( this._initialize ) ) {
                this._initialize();
            }

            this._trigger( "create" );
        },

        destroy: function() {
            // Actually destroying the widget is in the following lines
            if ( $.isFunction( this._destroy ) ) {
                this._destroy();
            }
            this.element.removeData( this.name );
            this._off();

            // Event triggering
            this._trigger( "destroy" );
        },

        // Get or set one or more options into/from the widget instance
        option: function( name, value ) {
            var widget = this,
                setOption = this._setOption;

            if ( typeof name === "string" ) {
                if ( value === undefined ) {
                    return this.options[ name ];
                }

                setOption.call( this, name, value );
            } else if ( $.isPlainObject( name ) ) {
                $.each( name, function( key, val ) {
                    setOption.call( widget, key, val );
                });
            } else if ( name === undefined ) {
                return this.options;
            } else {
                log( "Invalid argument passed to option(): " + $.type( name ) );
            }

            return this;
        },

        _setOption: function( name, value ) {
            this.options[ name ] = value;
            log( "Setted option '" + name + "' as " + JSON.stringify( value ));
        },

        _trigger: function( type, event, data ) {
            var orig, prop;

            if ( typeof type !== "string" ) {
                return;
            }

            // Build the event object
            event = $.Event( event || {} );
            event.type = ( this.name + type ).toLowerCase();
            event.target = this.element[ 0 ];
            event.currentTarget = event.currentTarget || event.target;
            event.preventDefault = event.preventDefault || $.noop;

            data = data || {};
            orig = event.originalEvent;
            if ( orig ) {
                for ( prop in orig ) {
                    if ( !( prop in event ) ) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }

            this.element.trigger( event, data );

            // If the instance option is a callback, we can call it!
            if ( $.isFunction( this.options[ type ] ) ) {
                this.options[ type ].call(
                    this.element[ 0 ],
                    event,
                    data
                );
            }

            log( "Triggered event '" + this.name + "." + event.type + "'" );
        },

        // Delegate events to the widget element
        _on: function( event, selector, handler ) {
            var widget = this;

            if ( $.isPlainObject( event ) ) {
                $.each( event, function( handler, evt ) {
                    evt = $.trim( evt ).split( " " );
                    event = evt[ 0 ];
                    selector = evt[ 1 ];

                    widget._on( event, selector, handler );
                });
            } else {
                if ( arguments.length === 2 ) {
                    handler = selector;
                    selector = null;
                }

                if ( !$.isFunction( handler ) ) {
                    return;
                }

                widget.element.on( ( event || "" ) + this.eventNamespace, selector, handler );
            }

            return this;
        },

        // Undelegate events to the widget element
        _off: function( event, selector ) {
            if ( $.isArray( event ) ) {
                var i, len;
                for ( i = 0, len = event.length; i < len; i++ ) {
                    this._off( event + this.eventNamespace );
                }
            } else {
                event = typeof event === "string" ? event : "";
                this.element.off( event + this.eventNamespace, selector );
            }

            return this;
        }
    });

    function proxy( object ) {
        var prototype = $.frontkit.Widget.prototype;

        $.each( object, function( prop, method ) {
            if ( !$.isFunction( method ) || !$.isFunction( prototype[ prop ] ) ) {
                return;
            }

            object[ prop ] = function() {
                if ( prototype[ prop ] != null ) {
                    this.super = $.proxy( prototype[ prop ], this );
                }

                return method.apply( this, arguments );
            };
        });
    }

})( jQuery );
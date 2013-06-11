(function( $, undefined ) {
	"use strict";

	var frontkitWidgetId = 0;

	function log( message ) {
		if ( console && console.log && $.frontkit.debug ) {
			console.log( "[FrontKit " + $.frontkit.version + "] " + message );
		}
	}

	$.frontkit = function( name, widget ) {
		frontkitWidgetId++;

		if ( typeof name !== "string" ) {
			widget = name;
			name = "frontkitWidget" + frontkitWidgetId;
		}

		if ( !$.isPlainObject( widget ) ) {
			widget = {};
		}

		widget = $.extend( {}, widget );
		widget.name = name;
		$.frontkit.widgets[ name ] = widget;

		$.fn[ name ] = function( arg ) {
			var instance, api;

			if ( typeof arg !== "string" ) {
				api = $.frontkit.widgets[ name ];

				return this.each(function() {
					instance = new Widget( api, this, arg );
					$( this ).data( name, instance );
				});
			}

			instance = $( this ).data( name );
			if ( !( instance instanceof Widget ) ) {
				throw new Error( "Cannot call widget methods prior to initialization." );
			}

			if ( options[ 0 ] !== "_" ) {
				instance[ arg ].apply( instance, $.makeArray( arguments ).slice( 1 ) );
			}
		};

        // Create a selector for the plugin
        $.expr[ ":" ][ name.toLowerCase() ] = function( elem ) {
            return !!$.data( elem, name );
        };
	};

    // Unregister an widget
    $.frontkit.unregister = function( name ) {
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
        $.each( $.frontkit.widgets, function( name ) {
            $.frontkit.unregister( name );
        });

        frontkitWidgetId = 0;
    };

	// Extend an widget definition
	$.frontkit.extend = function( name, obj ) {
		var api = $.frontkit.widgets[ name ];

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
	$.frontkit.debug = true;

	// Function to write debug messages
	$.frontkit.log = log;

	// The Widget class
	// ----------------
	function Widget( api, element, options ) {
		$.extend( this, api );

		// Applies proxies to this instance;
		proxy( this );

        this.eventNamespace = "." + api.name;
		this.element = $( element );
		this.initialize( options );
	}

	$.extend( Widget.prototype, {
		initialize: function( options ) {
            log( "Initializing " + this.name + " widget" );
			this.option( options );

			if ( $.isFunction( this._initialize ) ) {
				this._initialize();
			}

            this._trigger( "create" );
		},

		destroy: function() {
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

				setOption( name, value );
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

            if ( $.isFunction( this.options[ type ] ) ) {
                this.options[ type ].call(
                    this.element[ 0 ],
                    event,
                    data
                );
            }

            log( "Triggered event '" + event.type + "'" );
        }
	});

	function proxy( object ) {
		var prototype = Widget.prototype;

		$.each( object, function( prop, method ) {
			if ( !$.isFunction( method ) || !$.isFunction( prototype[ prop ] ) ) {
				return;
			}

			object[ prop ] = function() {
                if ( prototype[ prop ] != null ) {
					this.super = $.proxy( prototype[ prop ], this );
				}

				method.apply( this, arguments );
			};
		});
	}

})( jQuery );
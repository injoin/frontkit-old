!function( angular ) {
    "use strict";

    var $ = angular.element;
    var forEach = angular.forEach;
    var module = angular.module( "frontkit.modal", [ "frontkit.utils" ] );
    var modalScope = {
        title: "@",
        closeOn: "@",
        width: "@",
        height: "@"
    };

    var zindexOverlay, zindexModal;
    var zindex = 1;
    var openModals = [];

    function ModalManager() {
        var promise, element, controller;
        var that = this;

        that.$$setPromise = function( $promise ) {
            promise = $promise.then(function( $element ) {
                element = $element;
                controller = element.controller( "fkModal" );
            });

            return that;
        };

        forEach( [ "isOpen", "open", "close", "destroy" ], function( method ) {
            that[ method ] = function() {
                promise = promise.then(function() {
                    // Forward arguments to the method
                    controller[ "$" + method ].apply( controller, arguments );
                });

                return that;
            };
        });
    }

    module.directive( "fkModal", [
        "$document",
        function( $document ) {
            var definition = {};

            definition.replace = true;
            definition.transclude = true;
            definition.restrict = "EA";
            definition.scope = modalScope;

            definition.template =
                "<div class='modal hide'>" +
                    "<div class='modal-header'>" +
                        "<div class='modal-header-title'>{{ title }}</div>" +
                        "<span class='close' ng-click='$close()'>&times;</span>" +
                    "</div>" +
                    "<div ng-transclude></div>" +
                "</div>";

            definition.controller = [
                "$scope",
                "$element",
                function( $scope, $element ) {
                    var ctrl = this;
                    var opened = false;

                    ctrl.$open = function() {
                        var width, height;

                        if ( opened ) {
                            return ctrl;
                        }

                        // Make the element invisible to avoid an unpositioned flash
                        $element.addClass( "invisible" );
                        $element.removeClass( "hide" );

                        // Set and get modal width
                        if ( $scope.width !== "auto" ) {
                            width = $element.width( $scope.width ).width();
                        } else {
                            width = $element.width();
                            $element.width( width );
                        }

                        // Set and get modal height
                        if ( $scope.height !== "auto" ) {
                            height = $element.height( $scope.height ).height();
                        } else {
                            height = $element.height();
                            $element.height( height );
                        }

                        zindex++;

                        $scope.overlay.css( "z-index", zindexOverlay + zindex );
                        $scope.overlay.removeClass( "hide" );

                        $element.css({
                            "margin-left": parseInt( -width / 2, 10 ) + "px",
                            "margin-top": parseInt( -height / 2, 10 ) + "px",
                            "z-index": zindexModal + zindex
                        });

                        opened = true;
                        openModals.unshift( ctrl );

                        // Modal is good to go.
                        $element.removeClass( "invisible" );

                        return ctrl;
                    };

                    ctrl.$close = function() {
                        if ( !opened ) {
                            return ctrl;
                        }

                        $element.addClass( "hide" );
                        $scope.overlay.addClass( "hide" );
                        opened = false;

                        openModals.splice( openModals.indexOf( ctrl ), 1 );

                        return ctrl;
                    };

                    ctrl.$destroy = function() {
                        // The open modals array must no longer store this controller
                        var indexOf = openModals.indexOf( ctrl );
                        indexOf > -1 && openModals.splice( indexOf, 1 );

                        $scope.$destroy();
                        $element.remove();
                    };

                    ctrl.$isOpen = function() {
                        return opened;
                    };

                    ctrl.closeable = function( type ) {
                        var option = $scope.closeOn || "both";
                        return option === "both" || option === type;
                    };

                    return ctrl;
                }
            ];

            definition.compile = function( template, attrs ) {
                // Set default width
                if ( !attrs.width ) {
                    attrs.$set( "width", "auto" );
                }

                // Set default height
                if ( !attrs.height ) {
                    attrs.$set( "height", "auto" );
                }

                return definition.link;
            };

            definition.link = function( $scope, $element, $attr, ctrl ) {
                var $overlay;
                var $body = $document.find( "body" );

                // We create an overlay for our modal window
                $scope.overlay = $overlay = $( "<div></div>" ).addClass( "overlay hide" );
                $body.append( $scope.overlay );

                // Move the element to the body
                $body.append( $element );

                // Scope bindings
                // --------------
                // Provide a way to close the modal from inside itself
                $scope.$close = ctrl.$close;

                // DOM Events
                // ----------
                // Close the modal on clicking in its overlay
                $overlay.on( "click", function() {
                    if ( ctrl.closeable( "overlay" ) ) {
                        ctrl.$close();
                    }
                });

                // The overlay must go away together with the element itself
                $scope.$on( "$destroy", function() {
                    $overlay.remove();
                });
            };

            return definition;
        }
    ]);

    module.provider( "$modal", function() {
        var $provider = {};

        $provider.$get = [
            "$rootScope",
            "$templatePromise",
            "$compile",
            function( $rootScope, $templatePromise, $compile ) {
                return {
                    create: function( options ) {
                        var promise, instance, $element;
                        var scope = ( options.scope || $rootScope ).$new();

                        if ( !options.template && !options.templateUrl ) {
                            throw new Error(
                                "Either template or templateUrl option must be passed."
                            );
                        }

                        promise = $templatePromise(
                            options.template,
                            options.templateUrl
                        ).then(function( template ) {
                            $element = $( "<fk-modal></fk-modal>" );
                            $element.html( template );

                            scope.$modalOptions = {};
                            angular.forEach( modalScope, function( binding, key ) {
                                scope.$modalOptions[ key ] = options[ key ];
                                $element.attr(
                                    key,
                                    binding[ 0 ] === "@" ? options[ key ] : "$modalOptions." + key
                                );
                            });

                            $element = $compile( $element )( scope );
                        });

                        instance = new ModalManager();
                        instance.$$setPromise( promise );

                        return instance;
                    }
                };
            }
        ];

        return $provider;
    });

    module.run([
        "$document",
        function( $document ) {
            //$document.ready(function() {
                // Create a test div to pick the base z-index of overlays and modals.
                // This is done so we don't have to get calculating this everytime
                var $testDiv = $( $document[ 0 ].createElement( "div" ) );
                $document.find( "body" ).append( $testDiv );

                zindexOverlay = +$testDiv.addClass( "overlay" ).css( "z-index" ) || 0;
                zindexModal = +$testDiv.toggleClass( "overlay modal" ).css( "z-index" ) || 0;

                // Everything we need was done, remove this div.
                $testDiv.remove();
            //});

            $document.on( "keyup", function( e ) {
                var key = e.keyCode || e.which;
                if ( key === 27 &&
                    openModals.length &&
                    openModals[ 0 ].closeable( "escape" ) ) {
                    openModals.shift().$close();
                }
            });
        }
    ]);

}( angular );
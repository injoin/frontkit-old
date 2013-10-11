!function( angular ) {
    "use strict";

    var $ = angular.element;
    var classes = {
        AFFIX: "affix",
        AFFIX_INACTIVE: "affix-inactive"
    };

    angular.module( "frontkit.affix", [] ).directive( "fkAffix", [
        "$window",
        "$document",
        function( $window, $document ) {
            var definition = {};

            definition.restrict = "A";
            definition.scope = {
                offsetTop: "=",
                offsetBottom: "=",
                onActivate: "&"
            };

            definition.link = function( $scope, $element, $attrs ) {
                var start = $element.offset().top;
                $scope.active = false;

                // Define the element as inactive affix
                $attrs.$addClass( classes.AFFIX + " " + classes.AFFIX_INACTIVE );

                $( $window ).on( "scroll", function() {
                    // Setup a bunch of variables to help
                    var position, nowActive;
                    var scrollTop =     $window.scrollY;
                    var wasActive =     $scope.active;
                    var scrollHeight =  $document.height();
                    var elemHeight =    $element.height();
                    var elemOffset =    $element.offset().top;
                    var offsetTop =     $scope.offsetTop || 0;
                    var offsetBottom =  $scope.offsetBottom || 0;

                    // There's no why to adjust the position of an hidden element...
                    if ( $element.css( "display" ) === "none" ) {
                        return;
                    }

                    position = {
                        top: "auto",
                        bottom: "auto"
                    };

                    if ( scrollTop > ( start - offsetTop ) ) {
                        // Element is exceeding the page height?
                        if ( ( elemOffset + elemHeight ) >= ( scrollHeight - offsetBottom ) ) {
                            position.bottom = offsetBottom + "px";
                        } else {
                            position.top = offsetTop + "px";
                        }

                        // We're activating the affix here
                        $element.removeClass( classes.AFFIX_INACTIVE );
                        $element.css( position );

                        nowActive = true;
                    } else {
                        $element.addClass( classes.AFFIX_INACTIVE );
                        nowActive = false;
                    }

                    // The event is only triggered when the affix was active but now it's not, OR
                    // when the opposite situation occurs.
                    if ( ( !wasActive && nowActive ) || ( wasActive && !nowActive ) ) {
                        $scope.active = nowActive;
                        $scope.onActivate({
                            $data: { active: $scope.active }
                        });
                    }
                });

                // We should ensure that our element will be in the
                // right position upon instantiation
                $( $window ).triggerHandler( "scroll" );
            };

            return definition;
        }
    ]);

}( angular );
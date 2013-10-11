!function( angular ) {
    "use strict";

    var module = angular.module( "frontkit.utils", [] );

    module.provider( "$templatePromise", function() {
        var $provider = {};

        $provider.$get = [
            "$q",
            "$http",
            "$templateCache",
            function( $q, $http, $templateCache ) {
                return function( templateStr, templateUrl ) {
                    return templateStr ? $q.when( templateStr ) : $http.get( templateUrl, {
                        cache: $templateCache
                    }).then(function( result ) {
                        return result.data;
                    });
                };
            }
        ];

        return $provider;
    });

}( angular );
(function() {
    /*jshint evil:true */
    "use strict";

    var jq = location.search.match( /[?&]jquery=(.*?)(?=&|$)/ );
    var url = "lib/jquery/" + ( jq ? jq[ 1 ] : "1.10.0" ) + ".js";

    document.write( "<script src='" + url + "'></script>" );
})();
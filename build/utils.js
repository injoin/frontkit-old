(function() {
    "use strict";

    var indentation = "    ";

    module.exports = exports = {};
    exports.process = function( src, filepath ) {
        // Remove all "use strict" strings
        src = src.replace( /\s*("|')use strict\1;/g, "" );

        // Indent with 4 spaces each line
        src = src.replace( /^(.)/mg, indentation + "$1" );

        return src;
    };

    exports.wrapperIntro = function( args ) {
        return "(function( " + args.join( "," ) + " ) {\n" + indentation + "\"use strict\";\n";
    };

    exports.wrapperOutro = function( args ) {
        return "\n})( " + args.join( "," ) + " );";
    };

})();
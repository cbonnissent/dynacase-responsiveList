(function ()
{
    "use strict";
    var config = {
        paths: {
            "rsp" : "RESPONSIVE_LIST/JS",
            "dcpDocument": "DOCUMENT/IHM",
            "jquery": "lib/KendoUI/2014.3/js/jquery",
            "underscore": "lib/underscore/underscore",
            "backbone" : "lib/backbone/backbone"
        }
    };
    require.config(config);
})();
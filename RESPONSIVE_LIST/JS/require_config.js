(function ()
{
    "use strict";
    var config = {
        shim: {
            "bootstrap": ['jquery']
        },
        paths: {
            "rsp" : "RESPONSIVE_LIST/JS",
            "rspTemplate": "RESPONSIVE_LIST/templates.d",
            "dcpDocument": "DOCUMENT/IHM",
            "jquery": "lib/KendoUI/2014.3/js/jquery",
            "underscore": "lib/underscore/underscore",
            "backbone" : "lib/backbone/backbone",
            "bootstrap" : "lib/bootstrap/3/js/bootstrap.min",
            "text": 'lib/RequireJS/text'
        }
    };
    if (window.dcp.ws) {
        config.urlArgs = "ws=" + window.dcp.ws;
    }
    require.config(config);
})();
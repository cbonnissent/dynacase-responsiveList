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
            "jquery": "lib/jquery/ddui/jquery.min",
            "underscore": "lib/underscore/underscore-min",
            "backbone" : "lib/backbone/backbone-min",
            "bootstrap" : "lib/bootstrap/3/js/bootstrap.min",
            "text": 'lib/RequireJS/text'
        }
    };
    if (window.dcp.ws) {
        config.urlArgs = "ws=" + window.dcp.ws;
    }
    require.config(config);
})();
define([
    "underscore",
    "backbone"
], function (_)
{
    "use strict";

    return Backbone.Model.extend({

        idAttribute: "initid",

        defaults: {
            state: null,
            viewId : "!defaultConsultation",
            "title" : "Chargement...",
            "icon" : false
        },

        isNew: function ()
        {
            return true;
        },

        parse: function (response)
        {
            return response.properties;
        }
    });
});
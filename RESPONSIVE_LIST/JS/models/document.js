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
            "title" : "Chargement..."
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
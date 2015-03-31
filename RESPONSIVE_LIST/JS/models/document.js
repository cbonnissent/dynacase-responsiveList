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
            "icon" : false,
            "dateSelected" : 0
        },

        initialize : function () {
            this.set("dateSelected", Date.now());
        },

        isNew: function ()
        {
            return true;
        },

        parse: function (response)
        {
            var values = response.properties;
            values.attributes = response.attributes;
            return values;
        }
    });
});
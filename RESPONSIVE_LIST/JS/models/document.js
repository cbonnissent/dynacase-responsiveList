define([
    "underscore",
    "backbone"
], function (_)
{
    "use strict";

    return Backbone.Model.extend({

        defaults : {
            state : null
        },

        isNew : function() {
            return true;
        },

        parse: function (response)
        {
            return response.properties;
        }
    });
});
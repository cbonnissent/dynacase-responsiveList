define([
    "underscore",
    "rsp/models/document",
    "backbone"
], function (_, model)
{
    "use strict";

    var urlTemplate = _.template("<%= urlBase %>?slice=<%= slice %>&offset=<%= offset %>&keyword=<%= keyWord %>&fields=document.properties.all,document.attributes");

    return Backbone.Collection.extend({
        "model": model,

        url: function dc_url()
        {
            return urlTemplate(this);
        },

        initialize: function dc_initialize(values, options)
        {
            if (!options.url) {
                throw new Error("the document model needs an url conf");
            }
            this.urlBase = options.url;
            this.slice = 10;
            this.offset = 0;
            this.keyWord = "";
        },

        parse: function dc_parse(response)
        {
            this.nbResult = response.data.resultMax;
            return response.data.documents;
        },

        reset : function dc_reset() {
            this.nbResult = null;
            this.slice = 10;
            this.offset = 0;
            return Backbone.Collection.prototype.reset.apply(this, arguments);
        }

    });
});
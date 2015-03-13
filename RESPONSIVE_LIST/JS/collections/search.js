define([
    "rsp/models/search",
    "backbone"
], function (model)
{
    "use strict";

    return Backbone.Collection.extend({
        "url" : window.location.pathname + "api/v1/rspl/listDocument/DIR_RESPONSIVE_LIST",
        "model": model,

        parse : function searchCollection_parse(response) {
            return response.data.documents;
        }
    });
});
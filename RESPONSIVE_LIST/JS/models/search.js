define([
    "underscore",
    "rsp/collections/document",
    "backbone"
], function (_, CollectionDocument)
{
    "use strict";

    return Backbone.Model.extend({

        idAttribute: "initid",

        initialize: function rsp_init()
        {
            this.listenTo(this, "selected", this.prepareDocumentList);
            this.set("associatedDocumentList", new CollectionDocument([], {
                "url": window.location.pathname + "api/v1/rspl/listDocument/" + this.id
            }));
            this.collectionInitialized = false;
            this.listenTo(this.get("associatedDocumentList"), "add", this.propagateAdd);
            this.listenTo(this.get("associatedDocumentList"), "reset", this.propagateReset);
            this.listenTo(this.get("associatedDocumentList"), "sync", this.propagateSync);
        },

        parse: function (response)
        {
            return response.properties;
        },

        prepareDocumentList: function ()
        {
            if (!this.collectionInitialized) {
                this.get("associatedDocumentList").fetch();
            }
        },

        propagateAdd: function propagateAdd(currentDocument)
        {
            this.trigger("addDocumentList", this, this.get("associatedDocumentList"), currentDocument);
        },

        propagateReset: function propagateReset()
        {
            this.trigger("resetDocumentList", this, this.get("associatedDocumentList"));
        },

        propagateSync: function propagateSync()
        {
            this.trigger("syncDocumentList", this, this.get("associatedDocumentList"));
        }
    });
});
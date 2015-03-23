define([
    "jquery",
    "underscore",
    "dcpDocument/document",
    "backbone"
], function ($, _)
{

    "use strict";

    return Backbone.View.extend({

        className: "documentsWrapper__div",

        initialize: function opde_initialize()
        {
            //this.listenTo(this.model, "change:initid", this.render);
            this.listenTo(this.model, "change:selected", this.indicateSelected);
            this.listenTo(this.model, "change:title", this.indicateSelected);
            this.listenTo(this.model, "change", this.setFrameName);
            this.listenTo(this.model, "destroy", this.delete);
            $(window).on("resize", _.debounce(_.bind(this._resize, this), 100));
        },

        render: function dw_render()
        {
            var currentView = this;
            this.$el.document("fetchDocument", {
                "initid": this.model.id,
                "viewId": this.model.get("viewId"),
                withoutResize: true
            });
            this.$el.document("addEvent", "ready", function (event, document)
            {
                currentView.model.set("initid", document.initid);
                currentView.model.set("title", document.title || "");
                currentView.model.set("viewId", document.viewId);
                currentView.model.set("icon", document.icon);
                if (document.title) {
                    currentView.model.trigger("reloadDocument", document);
                }
                currentView.$el.show();
            });
            this.$el.document("addEvent", "beforeClose", function (event, document, newDocument)
            {
                var currentDocument = currentView.model.collection.get(newDocument.initid);
                if (parseInt(newDocument.initid, 10) === parseInt(currentView.model.get("initid"), 10)) {
                    currentDocument.trigger("selected", currentDocument);
                    return;
                }
                event.preventDefault();
                if (currentDocument) {
                    currentDocument.trigger("selected", currentDocument);
                } else {
                    currentView.model.collection.add({initid: newDocument.initid, title: "Chargement"});
                }
            });
            this.$el.document("addEvent", "afterSave", function (event, document, oldDocument)
            {
                // if oldDocument.id => 0 afterCreation save
                if (oldDocument.id === 0) {
                    currentView.model.trigger("reloadDocumentList");
                }
            });
            this.$el.document("addEvent", "afterDelete", function (event, document, oldDocument)
            {
                currentView.model.trigger("removeDocument", document);
            });
            this.setFrameName();
            return this;
        },

        indicateSelected: function opde__indicateSelected()
        {
            if (this.model.get("selected")) {
                this.$el.show();
                window.document.title = this.model.get("title");
                this._resize();
            } else {
                this.$el.hide();
            }
        },

        _resize: function opde_resize()
        {
            var currentView = this;
            if (this.$el.is(":visible")) {
                this.$el.find("iframe").height($(window).innerHeight() - this.$el.position().top - 40).width(this.$el.innerWidth() - 1);
                _.defer(function secondHeightResize()
                {
                    currentView.$el.find("iframe").height($(window).innerHeight() - currentView.$el.position().top - 40);
                }, 50);
            }
        },

        "delete": function opde_delete()
        {
            this.$el.remove();
        },

        setFrameName: function opde_setFrameName()
        {
            var name = "document_" + this.model.get("initid") + "_" + this.model.get("title");
            this.$el.find("iframe").attr("name", name);
        }

    });
});
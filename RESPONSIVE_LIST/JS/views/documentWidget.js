define([
    "jquery",
    "underscore",
    "rsp/hammer",
    "dcpDocument/document",
    "backbone"
], function ($, _, Hammer)
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
            var currentView = this, afterLoaded = _.bind(this.indicateSelected, this);
            this.$el.document("fetchDocument", {
                "initid": this.model.id,
                "viewId": this.model.get("viewId"),
                "revision" : -1,
                withoutResize: true
            });
            this.$el.document("addEventListener", "ready", function (event, document)
            {
                currentView.model.set(document);
                currentView.model.set("attributes", this.documentController("getValues"));
                if (!document.name || document.name !== "VOID_DOCUMENT") {
                    currentView.model.trigger("reloadDocument", currentView.model.toJSON());
                }
                $(this).find("header").hide();
                afterLoaded();
            });
            this.$el.document("addEventListener", "beforeClose", function (event, document, newDocument)
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
            this.$el.document("addEventListener", "afterSave", function (event, document, oldDocument)
            {
                // if oldDocument.id => 0 afterCreation save
                if (oldDocument.id === 0) {
                    currentView.model.trigger("reloadDocumentList");
                }
            });
            this.$el.document("addEventListener", "afterDelete", function (event, document, oldDocument)
            {
                currentView.model.trigger("removeDocument", document);
            });
            this.setFrameName();
            this.setSwipeEvent();
            return this;
        },

        indicateSelected: function opde__indicateSelected()
        {
            if (this.model.get("selected")) {
                this.$el.show();
                window.document.title = this.model.get("title");
                window.documentSelected = this.$el;
                this._resize();
            } else {
                this.$el.hide();
            }
        },

        _resize: function opde_resize()
        {
            var currentView = this, getTop = function (element)
            {
                element = element[0];
                return element.getBoundingClientRect().top + 5;
            };
            if (this.$el.is(":visible")) {
                this.$el.find("iframe").height($(window).innerHeight() - getTop(this.$el)).width(this.$el.innerWidth() - 1);
                _.defer(function secondHeightResize()
                {
                    currentView.$el.find("iframe").height($(window).innerHeight() - getTop(currentView.$el));
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
        },

        setSwipeEvent: function opde_setSwipeEvent()
        {
            var iframe = this.$el.find("iframe"), currentView = this, addHammer = _.bind(function addHammer()
            {
                var iframeBody = this.contentWindow.document.body;
                iframeBody.style.position = "absolute";
                iframeBody.style.top = 0;
                iframeBody.style.left = 0;
                iframeBody.style.right = 0;
                iframeBody.style.bottom = 0;
                Hammer(iframeBody).on("swipeleft", function (event)
                {
                    currentView.model.collection.trigger("selectNext", currentView.model);
                });
                Hammer(iframeBody).on("swiperight", function (event)
                {
                    currentView.model.collection.trigger("selectPrevious", currentView.model);
                });
            }, iframe[0]);
            iframe.on("load", addHammer);
            addHammer();
        }

    });
});
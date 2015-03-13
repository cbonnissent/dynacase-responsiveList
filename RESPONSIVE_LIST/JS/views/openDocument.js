define([
    "jquery",
    "underscore",
    "rsp/views/openDocumentListElement",
    "rsp/views/documentWidget",
    "backbone"
], function ($, _, ViewOpenDocumentListElement, ViewDocumentWidget)
{

    "use strict";

    var template = {
        "global": _.template('<ul class="nav nav-tabs documentList">' +
        '   <li class="openDocuments__openDocumentList visible-xs">' +
        '       <button class="btn btn-default"><span class="glyphicon glyphicon-menu-hamburger"></span></button>' +
        '   </li>' +
        '</ul><div class="documentsWrapper"></div> ')
    };

    return Backbone.View.extend({

        events: {
            "click .openDocuments__openDocumentList": "switchSide"
        },

        initialize: function opd_initialize(options)
        {
            if (!options.openDocuments) {
                throw new Error("You need an openDocuments collection");
            }
            this.openDocuments = options.openDocuments;
            this.listenTo(this.openDocuments, "add", this._addDocument);
            this.listenTo(this.openDocuments, "selected", this.openDocumentIHM);
        },

        render: function opd_render()
        {
            this.$el.append(template.global());
            return this;
        },

        switchSide: function opd_switchSide()
        {
            this.trigger("switchSide");
        },

        openDocumentIHM : function opd_openDocumentIHM() {
            this.trigger("openDocumentIHM");
        },

        _addDocument: function opd_addDocument(model)
        {
            var viewDocument = new ViewDocumentWidget({model: model}),
                viewList = new ViewOpenDocumentListElement({model: model});
            this.$el.find(".documentList").append(viewList.render().$el);
            this.$el.find(".documentsWrapper").append(viewDocument.render().$el);
            model.trigger("selected", model);
            viewDocument._resize();
        }

    });
});
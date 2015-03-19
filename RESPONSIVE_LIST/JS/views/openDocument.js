define([
    "jquery",
    "underscore",
    "rsp/views/openDocumentListElement",
    "rsp/views/documentWidget",
    "backbone",
    "bootstrap"
], function ($, _, ViewOpenDocumentListElement, ViewDocumentWidget)
{

    "use strict";

    var template = {
        "global": _.template('<ul class="nav nav-pills documentList">' +
        '   <li class="openDocuments__openDocumentList visible-xs visible-sm">' +
        '       <button class="btn btn-default"><span class="glyphicon glyphicon-menu-hamburger"></span></button>' +
        '   </li>' +
        '   <li class="openDocuments__createDocument">' +
        '       <div class="btn-group" title="Créer un document">' +
        '           <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
        '               Nouveau' +
        '               <span class="glyphicon glyphicon-plus-sign"></span> <span class="caret"></span>' +
        '           </button>' +
        '           <ul class="dropdown-menu openDocuments__createDocument__families" role="menu">' +
        '           </ul>' +
        '       </div>' +
        '   </li>' +
        '</ul><div class="documentsWrapper"></div> '),
        "families" : _.template('<% _.each(families, function(currentFamily) { %>' +
        '<li>' +
        '   <a class="openDocuments__createDocument__familyElement" href="#<%- currentFamily.initid %>" data-initid="<%- currentFamily.initid %>">' +
        '       <img src="<%- currentFamily.icon %>" class="img-circle documentElement__icon"><%- currentFamily.title %>' +
        '   </a>' +
        '</li>' +
        ' <% }); %>')
    };

    return Backbone.View.extend({

        events: {
            "click .openDocuments__openDocumentList": "switchSide",
            "click .openDocuments__createDocument__familyElement" : "openCreation"
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
            if (window.dcp.creatable_family.length === 0) {
                this.$el.find(".openDocuments__createDocument").remove();
            } else {
                this.$el.find(".openDocuments__createDocument__families").append(template.families({families : window.dcp.creatable_family}));
            }
            return this;
        },

        switchSide: function opd_switchSide()
        {
            this.trigger("switchSide");
        },

        openDocumentIHM : function opd_openDocumentIHM() {
            this.trigger("openDocumentIHM");
        },

        openCreation : function opd_openCreation(event) {
            var $target = $(event.currentTarget);
            event.preventDefault();
            this.openDocuments.add({"initid": $target.data("initid"), "viewId" : "!coreCreation"});
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
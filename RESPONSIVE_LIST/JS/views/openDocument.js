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
        "global": _.template('<ul class="nav nav-tabs documentList">' +
        '   <li class="openDocuments__openDocumentCloseAll pull-right" title="Fermer tous les documents">' +
        '       <button type="button" class="btn btn-link"> ' +
        '           <span class="fa fa-times-circle-o"></span>' +
        '       </button>' +
        '   </li>' +
        '   <li class="openDocuments__more pull-right" style="visibility: hidden;">' +
        '       <div class="btn-group" title="Plus de documents">' +
        '           <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
        '               <span class="fa fa-bars"></span>' +
        '               +<span class="openDocuments__more__number"></span> <span class="caret"></span>' +
        '           </button>' +
        '           <ul class="dropdown-menu pull-right openDocuments__more__documents" role="menu">' +
        '           </ul>' +
        '       </div>' +
        '   </li>' +
        '   <li class="openDocuments__openDocumentList visible-xs visible-sm">' +
        '       <button type="button" class="btn btn-link">' +
        '           <span class="fa fa-2x fa-bars"></span>' +
        '       </button>' +
        '   </li>' +
        '   <li class="openDocuments__createDocument">' +
        '       <div class="btn-group" title="Créer un document">' +
        '           <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
        '               <span class="glyphicon glyphicon-plus-sign"></span>' +
        '               Nouveau <span class="caret"></span>' +
        '           </button>' +
        '           <ul class="dropdown-menu openDocuments__createDocument__families" role="menu">' +
        '           </ul>' +
        '       </div>' +
        '   </li>' +
        '</ul><div class="documentsWrapper"></div>'),
        "families": _.template('<% _.each(families, function(currentFamily) { %>' +
        '   <li>' +
        '       <a class="openDocuments__createDocument__familyElement" href="#<%- currentFamily.initid %>" data-initid="<%- currentFamily.initid %>">' +
        '          <img src="<%- currentFamily.icon %>" class="img-circle documentElement__icon"><%- currentFamily.title %>' +
        '      </a>' +
        '    </li>' +
        ' <% }); %>')
    };

    return Backbone.View.extend({

        events: {
            "click .openDocuments__openDocumentList": "switchSide",
            "click .openDocuments__createDocument__familyElement": "openCreation",
            "click .openDocuments__openDocumentCloseAll": "closeAll"
        },

        initialize: function opd_initialize(options)
        {
            if (!options.openDocuments) {
                throw new Error("You need an openDocuments collection");
            }
            this.openDocuments = options.openDocuments;
            this.listenTo(this.openDocuments, "add", this._addDocument);
            this.listenTo(this.openDocuments, "selected", this.openDocumentIHM);
            this.listenTo(this.openDocuments, "orderChanged", this.renderOpenDocument);
            this.listenTo(this.openDocuments, "destroy", this.renderOpenDocument);
            this.nbMaxOpen = 0;
            this.isReady = false;
            $(window).on("resize", _.debounce(_.bind(this._resize, this), 200));
        },

        render: function opd_render()
        {
            this.$el.append(template.global());
            if (window.dcp.creatable_family.length === 0) {
                this.$el.find(".openDocuments__createDocument").remove();
            } else {
                this.$el.find(".openDocuments__createDocument__families").append(template.families({families: window.dcp.creatable_family}));
            }
            this.isReady = true;
            this.addPreload();
            return this;
        },

        addPreload: function opd_addPreload()
        {
            var $preload = $('<div class="documentPreload" style="display : none;"></div>');
            this.$el.find(".documentsWrapper").append($preload);
            $preload.document({"initid": "VOID_DOCUMENT"});
        },

        switchSide: function opd_switchSide()
        {
            this.trigger("switchSide");
        },

        openDocumentIHM: function opd_openDocumentIHM()
        {
            this.trigger("openDocumentIHM");
        },

        openCreation: function opd_openCreation(event)
        {
            var $target = $(event.currentTarget);
            event.preventDefault();
            this.openDocuments.add({"initid": $target.data("initid"), "viewId": "!coreCreation"});
        },

        _addDocument: function opd_addDocument(model)
        {
            var preload, viewDocument;
            this.renderOpenDocument();
            preload = this.$el.find(".documentPreload");
            preload.removeClass("documentPreload");
            viewDocument = new ViewDocumentWidget({model: model, el: preload});
            viewDocument.render();
            model.trigger("selected", model);
            this.addPreload();
            viewDocument._resize();
        },

        renderOpenDocument: function opd_renderOpenDocument()
        {
            var nb = 0, nbTotal = this.nbMaxOpen,
                $targetVisible = this.$el.find(".documentList"),
                $targetOther = this.$(".openDocuments__more__documents");
            $targetVisible.find(".openDocuments__tab").remove();
            $targetOther.empty();
            _.each(this.openDocuments.sortBy(function odc_comparator(model1)
            {
                return -model1.get("dateSelected");
            }), function (model)
            {
                var viewList = new ViewOpenDocumentListElement({model: model});
                if (nb < nbTotal) {
                    model.set("visibileInList", true);
                    $targetVisible.append(viewList.render().$el);
                } else {
                    model.set("visibileInList", false);
                    $targetOther.append(viewList.render({hidden : true}).$el);
                }
                nb += 1;
            });
            if (nb !== 0 && nb > nbTotal) {
                this.$(".openDocuments__more").css("visibility", "visible");
                this.$(".openDocuments__more__number").text(nb - nbTotal);
            } else {
                this.$(".openDocuments__more").css("visibility", "hidden");
            }
        },

        closeAll: function opd_closeAll()
        {
            var model;
            while (model = this.openDocuments.first()) { // jshint ignore:line
                model.destroy();
            }
        },

        _resize: function opd_resize()
        {
            var oldMax = this.nbMaxOpen;
            //compute space between openDocuments__createDocument and openDocuments__more
            if (this.isReady) {
                this.nbMaxOpen = Math.floor((this._getBorder(this.$el.find(".openDocuments__more"), "left") - this._getBorder(this.$el.find(".openDocuments__createDocument"), "right") - 10) / 202);
                if (oldMax !== this.nbMaxOpen) {
                    this.renderOpenDocument();
                }
            }
        },

        _getBorder: function opd_getBorder(element, position)
        {
            element = element[0];
            return element.getBoundingClientRect()[position];

        }

    });
});

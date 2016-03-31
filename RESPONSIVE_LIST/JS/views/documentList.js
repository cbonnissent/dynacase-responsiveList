define([
    "jquery",
    "underscore",
    "text!rspTemplate/global.json",
    "backbone"
], function ($, _, templates)
{

    "use strict";

    var template = {
        "global": _.template('<div class="documentsList__documents__list__element <%- id %>">' +
        '   <div class="documentsList__documents__list__element__nbResult clearfix">' +
        '       <span class="documentsList__documents__list__element__nbResult__container">Mise à jour...</span>' +
        '       <button class="btn btn-link pull-right documentsList__documents__list__element__reload"><span class="glyphicon glyphicon-repeat pull-right" aria-hidden="true"></span></button>' +
        '   </div>' +
        '   <div class="documentsList__documents__list__elements">' +
        '       <div class="list-group"></div>' +
        '       <div class="documentsList__documents__list__elements__loading text-center">' +
        '         <span class="fa fa-circle-o-notch fa-spin"></span>' +
        '       </div>' +
        '   </div>' +
        '</div>'),
        "document" : {}
    };

    return Backbone.View.extend({

        events: {
            "click .documentsList__documents__list__element__reload": "reloadSelected",
            "submit .documentsList__documents__search__form": "updateKeyword",
            "click .documentElement": "openDocument"
        },

        initialize: function dl_initialize(options)
        {
            var currentView = this;
            if (!options.collection) {
                throw new Error("You need to associate the document list view with a collection");
            }
            templates = JSON.parse(templates);
            _.each(templates, function(templateElement, key) {
                template.document[key] = _.template(templateElement);
            });

            this.collection = options.collection;
            this.openDocuments = options.openDocuments;
            this.listenTo(this.collection, "selected", this.displaySelected);
            this.listenTo(this.collection, "addDocumentList", this._addOne);
            this.listenTo(this.collection, "resetDocumentList", this._addAll);
            this.listenTo(this.collection, "syncDocumentList", this._updateNumber);
            this.listenTo(this.collection, "syncDocumentList", this._needToLoadMore);
            this.listenTo(this, "reloadDocumentList", _.bind(this.reloadAll, this));
            this.listenTo(this, "reloadDocument", this.reloadDocument);
            this.listenTo(this, "removeDocument", this.removeDocument);
            this.$el.find(".documentsList__documents__search__form").on("submit", function (event)
            {
                event.preventDefault();
                currentView.updateKeyWord(event);
            });
            $(window).on("resize", _.debounce(_.bind(this._resize, this), 200));
        },

        displaySelected: function dl_displaySelected(modelSelected)
        {
            var $currentDiv = this.$el.find("." + modelSelected.id);
            this.$el.find(".documentsList__documents__list__element").hide();
            if ($currentDiv.length === 0) {
                this._addAll(modelSelected, modelSelected.get("associatedDocumentList"));
                $currentDiv = this.$el.find("." + modelSelected.id);
            }
            this.currentSelectedModel = modelSelected;
            this.$el.find(".documentsList__documents__search__keyWord").val(this.currentSelectedModel.get("associatedDocumentList").keyWord);
            $currentDiv.show();
        },

        reloadSelected: function dl_reloadSelected()
        {
            this.currentSelectedModel.get("associatedDocumentList").reset();
            this.currentSelectedModel.get("associatedDocumentList").fetch();
        },

        reloadAll : function dl_reloadAll() {
            try {
                this.reloadSelected();
            } catch(e) {
                console.log(e);
            }
            this.$el(".documentsList__documents__list__element:hidden").remove();
        },

        reloadDocument : function dl_reloadDocument(document) {
            var templateElement;
            if (!document.state) {
                document.state = null;
            }
            _.defaults(document, { "initid" : "", "title" : "", "state" : "", "icon" : ""});
            templateElement = template.document[document.family.name] ? template.document[document.family.name] : template.document["#all#"];
            this.$el.find("[data-id="+document.initid+"]").replaceWith(templateElement(document));
        },

        removeDocument: function dl_removeDocument()
        {
            this.reloadSelected();
            this.$el.find("[data-id=" + document.initid + "]").remove();
        },

        updateKeyWord: function dl_updateKeyWord(event)
        {
            event.preventDefault();
            this.currentSelectedModel.get("associatedDocumentList").reset();
            this.currentSelectedModel.get("associatedDocumentList").keyWord = this.$el.find(".documentsList__documents__search__keyWord").val();
            this.currentSelectedModel.get("associatedDocumentList").fetch();
        },

        openDocument: function dl_openDocument(event)
        {
            var $target = $(event.currentTarget), id = $target.data("id"), document = this.openDocuments.get(id);
            event.preventDefault();
            if (document) {
                document.trigger("selected", document);
            } else {
                this.openDocuments.add({initid: id, title: $target.data("title"), icon : $target.find(".documentElement__icon").attr("src")});
            }
        },

        _getCurrentDiv: function _getCurrentDiv(model)
        {
            var $currentDiv = this.$el.find("." + model.id);
            if ($currentDiv.length === 0) {
                return false;
            }
            return $currentDiv;
        },

        _addOne: function dl_addOne(model, list, currentDocument)
        {
            var $currentDiv = this._getCurrentDiv(model), templateElement, document = currentDocument.toJSON();
            templateElement = template.document[document.family.name] ? template.document[document.family.name] : template.document["#all#"] ;
            if ($currentDiv) {
                $currentDiv.find(".list-group").append(templateElement(document));
            }
        },

        _addAll: function dl_addAll(model, list)
        {
            var addOne = _.bind(this._addOne, this);
            var $currentDiv = this._getCurrentDiv(model);
            if ($currentDiv) {
                $currentDiv.find(".documentsList__documents__list__elements").off("dl");
                $currentDiv.remove();
            }
            this.$el.find(".documentsList__documents__list").append(template.global(model.toJSON()));
            this._resize(true);
            $currentDiv = this._getCurrentDiv(model);
            if ($currentDiv) {
                $currentDiv.find(".documentsList__documents__list__elements").on("scroll.dl", _.debounce(_.bind(function ()
                {
                    this._needToLoadMore(model, list);
                }, this), 200));
            }
            list.each(function (currentDocument)
            {
                addOne(model, list, currentDocument);
            });
        },

        _updateNumber: function _updateNumber(model, list)
        {
            var $currentDiv = this._getCurrentDiv(model), text = " document";
            if ($currentDiv) {
                if (list.nbResult > 1) {
                    text = " documents";
                }
                $currentDiv.find(".documentsList__documents__list__element__nbResult__container").text(list.nbResult + text);
            }
            this._resize();
        },

        _needToLoadMore: function _needToLoadMore(model, list)
        {
            var $currentDiv = this._getCurrentDiv(model), $loading, maxLength;
            //test if need loading element
            if (!$currentDiv) {
                return;
            }
            $loading = $currentDiv.find(".documentsList__documents__list__elements__loading");
            if (list.nbResult !== null && (list.offset + list.slice >= list.nbResult)) {
                $loading.remove();
            }
            else {
                if (this.$el.is(":visible") && this._isElementVisible($loading)) {
                    list.offset += list.slice;
                    list.fetch({remove: false});
                }
            }
        },

        _resize: function _resize(noReload)
        {
            var $elements = this.$el.find(".documentsList__documents__list__elements:visible"), top;
            if ($elements.length > 0) {
                top = $elements[0].getBoundingClientRect().top;
                $elements.height($(window).innerHeight() - top - 10);
            }
            if (noReload !== true && this.currentSelectedModel) {
                this._needToLoadMore(this.currentSelectedModel, this.currentSelectedModel.get("associatedDocumentList"));
            }
        },

        _isElementVisible: function isElementInViewport(el)
        {
            //special bonus for those using jQuery
            if (typeof $ === "function" && el instanceof $) {
                el = el[0];
            }

            var rect = el.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
            );
        }

    });
});

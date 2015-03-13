define([
    "underscore",
    "rsp/views/search",
    "backbone"
], function (_, SearchView)
{

    "use strict";

    var template = _.template('<select class="form-control documentsList__searchList__select"></select>');

    return Backbone.View.extend({

        tagName: "form",

        events: {
            "change": "displayDocumentList"
        },

        initialize: function searches_initialize(options)
        {
            if (!options.collection) {
                throw new Error("You need to associate the searches view with a collection");
            }
            this.collection = options.collection;
            this.listenTo(this.collection, 'add', this._addOne);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.displayDocumentList);
        },

        render: function searches_render()
        {
            this.$el.empty().append(template());
            this._addAll();
            return this;
        },

        _addAll: function ()
        {
            this.collection.each(this._addOne);
        },

        _addOne: function (model)
        {
            var searchView = new SearchView({model: model});
            this.$el.find(".documentsList__searchList__select").append(searchView.render().$el);
        },

        displayDocumentList: function ()
        {
            var currentSearch = this.$el.find(".documentsList__searchList__select").val(), documentModel = this.collection.get(currentSearch);
            if (documentModel) {
                documentModel.trigger("selected", documentModel);
            }
        }
    });
});
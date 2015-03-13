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
            this.listenTo(this.model, "change:title", this.render);
            this.listenTo(this.model, "change:id", this.render);
            this.listenTo(this.model, "change:selected", this.indicateSelected);
            this.listenTo(this.model, "destroy", this.delete);
            $(window).on("resize", _.bind(this._resize, this));
        },

        render: function dw_render()
        {
            this.$el.empty().document({"initid": this.model.id, withoutResize: true});
            return this;
        },

        indicateSelected: function opde__indicateSelected()
        {
            if (this.model.get("selected")) {
                this.$el.show();
                this._resize();
            } else {
                this.$el.hide();
            }
        },

        _resize: function opde_resize()
        {
            var currentView = this;
            if (this.$el.is(":visible")) {
                this.$el.find("iframe").height($(window).innerHeight() - this.$el.position().top - 5).width(this.$el.innerWidth());
                _.defer(function secondHeightResize()
                {
                    currentView.$el.find("iframe").height($(window).innerHeight() - currentView.$el.position().top - 5);
                });
            }
        },

        "delete": function opde_delete()
        {
            this.$el.remove();
        }

    });
});
define([
    "underscore",
    "backbone"
], function (_)
{

    "use strict";

    var template = _.template('<a class="documentTab" href="#<%- initid %>" data-id="<%- initid %>" data-title="<%- title %>">' +
    '<span class="documentTab__text">' +
    '  <% if (icon) { %><img src="<%- icon %>" class="img-circle documentElement__icon" /> <% } %> <%- title %>' +
    '</span>' +
    '<button type="button" class="close documentTab__remove" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
    '</a>');

    return Backbone.View.extend({

        tagName : "li",

        events : {
            "click" : "selected",
            "click .documentTab__remove" : "remove"
        },

        initialize : function opde_initialize() {
            this.listenTo(this.model, "change:title", this.render);
            this.listenTo(this.model, "change:id", this.render);
            this.listenTo(this.model, "change:icon", this.render);
            this.listenTo(this.model, "change:selected", this.indicateSelected);
            this.listenTo(this.model, "destroy", this.delete);
        },

        render : function opde__render() {
            this.$el.empty().append(template(this.model.toJSON()));
            this.$el.attr("title", this.model.get("title"));
            return this;
        },

        selected : function opde_selected(event) {
            event.preventDefault();
            this.model.trigger("selected", this.model);
        },

        indicateSelected : function opde__indicateSelected() {
            if (this.model.get("selected")) {
                this.$el.addClass("active");
            } else {
                this.$el.removeClass("active");
            }
        },

        remove : function opde__remove() {
            this.model.destroy();
        },

        "delete" : function opde_delete() {
            this.$el.remove();
        }

    });
});
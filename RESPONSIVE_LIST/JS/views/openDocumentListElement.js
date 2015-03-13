define([
    "underscore",
    "backbone"
], function (_)
{

    "use strict";

    var template = _.template('<a href="#<%- id %>" data-id="<%- id %>" data-title="<%- title %>">' +
    '<%- title %> ' +
    '<button class="btn btn-link documentElement__remove"><span class="glyphicon glyphicon-remove-circle"></span></button>' +
    '</a>');

    return Backbone.View.extend({

        tagName : "li",

        events : {
            "click" : "selected",
            "click .documentElement__remove" : "remove"
        },

        initialize : function opde_initialize() {
            this.listenTo(this.model, "change:title", this.render);
            this.listenTo(this.model, "change:id", this.render);
            this.listenTo(this.model, "change:selected", this.indicateSelected);
            this.listenTo(this.model, "destroy", this.delete);
        },

        render : function opde__render() {
            this.$el.empty().append(template(this.model.toJSON()));
            return this;
        },

        selected : function opde_selected() {
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
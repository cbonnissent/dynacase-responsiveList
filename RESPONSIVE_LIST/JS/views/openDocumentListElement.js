define([
    "underscore",
    "backbone"
], function (_)
{

    "use strict";

    var template = _.template('<a class="documentTab" href="?app=DOCUMENT&id=<%- initid %>" data-id="<%- initid %>" data-title="<%- title %>">' +
    '<span class="documentTab__text">' +
    '  <% if (icon) { %><img src="<%- icon %>" class="img-circle documentElement__icon" /> <% } %> <%- title %>' +
    '</span>' +
    '<button type="button" class="close documentTab__remove" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
    '</a>');

    return Backbone.View.extend({

        tagName : "li",
        className : "openDocuments__tab",

        events : {
            "click" : "selected",
            "click .documentTab__remove" : "remove"
        },

        initialize : function opde_initialize() {
            this.listenTo(this.model, "change", this.render);
            this.listenTo(this.model, "change:selected", this.indicateSelected);
            this.listenTo(this.model, "destroy", this.delete);
        },

        render : function opde__render(options) {
            options = options || {};
            this.$el.empty().append(template(this.model.toJSON()));
            this.$el.attr("title", this.model.get("title"));
            if (options.hidden) {
                this.$el.addClass("documentTab__hidden clearfix");
            }
            this.indicateSelected();
            return this;
        },

        selected : function opde_selected(event) {
            event.preventDefault();
            this.model.trigger("selected", this.model, this.$el.is(".documentTab__hidden"));
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
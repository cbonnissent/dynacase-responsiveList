
define([
    "underscore",
    "backbone"
], function (_)
{
    "use strict";

    return Backbone.View.extend({

        tagName: "option",

        render: function searchView()
        {
            this.$el.data("searchId", this.model.id).attr("value", this.model.id).addClass("searchElement").text(this.model.get("title"));
            return this;
        }

    });
});
define([
    "rsp/models/document",
    "backbone"
], function (model)
{

    "use strict";

    return Backbone.Collection.extend({
        "model": model,

        initialize : function odc__initialize() {
            this.listenTo(this, "selected", this.propagateSelected);
        },

        propagateSelected : function odc__selected(model) {
            this.each(function odc__isSelected(currentModel) {
                currentModel.set("selected", model.id === currentModel.id);
            });
        }
    });
});
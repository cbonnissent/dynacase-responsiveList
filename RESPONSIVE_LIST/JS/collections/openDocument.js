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
            this.listenTo(this, "destroy", this.selectAnotherOne);
        },

        propagateSelected : function odc__selected(model, isHidden) {
            this.each(function odc__isSelected(currentModel) {
                currentModel.set("selected", model.id === currentModel.id);
                if (model.id === currentModel.id && isHidden) {
                    currentModel.set("dateSelected", Date.now());
                }
            });
            this.trigger("orderChanged");
        },

        selectAnotherOne : function odc_selectAnotherOne(model, collection, options) {
            var newModel = this.at(options.index) || this.at(options.index - 1);
            if (model.get("selected")) {
                if (newModel) {
                    newModel.trigger("selected", newModel);
                }
            }
            if (this.length === 0) {
                window.document.title = "Les documents";
            }
        }
    });
});
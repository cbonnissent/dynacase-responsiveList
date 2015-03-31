define([
    "underscore",
    "rsp/models/document",
    "backbone"
], function (_, model)
{

    "use strict";

    return Backbone.Collection.extend({
        "model": model,

        comparator : "dataSelected",


        initialize : function odc__initialize() {
            this.listenTo(this, "selected", this.propagateSelected);
            this.listenTo(this, "selectPrevious", this.selectPrevious);
            this.listenTo(this, "selectNext", this.selectNext);
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
            this.sort();
        },

        selectPrevious : function odc__selectPrevious(model) {
            var list = this.sortBy(function odc_comparator(model1)
            {
                return -model1.get("dateSelected");
            });
            this.propagateSelected(list[_.indexOf(list, model) - 1]);
        },

        selectNext: function odc__selectNext(model)
        {
            var list = this.sortBy(function odc_comparator(model1)
            {
                return -model1.get("dateSelected");
            });
            this.propagateSelected(list[_.indexOf(list, model) + 1]);
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
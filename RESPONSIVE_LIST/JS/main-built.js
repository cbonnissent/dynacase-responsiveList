define("rsp/models/document",["underscore","backbone"],function(){"use strict";return Backbone.Model.extend({idAttribute:"initid",defaults:{state:null,viewId:"!defaultConsultation",title:"Chargement...",icon:!1,dateSelected:0},initialize:function(){this.set("dateSelected",Date.now())},isNew:function(){return!0},parse:function(e){var t=e.properties;return t.attributes=e.attributes,t}})}),define("rsp/collections/document",["underscore","rsp/models/document","backbone"],function(e,t){"use strict";var i=e.template("<%= urlBase %>?slice=<%= slice %>&offset=<%= offset %>&keyword=<%= keyWord %>&fields=document.properties.all,document.attributes");return Backbone.Collection.extend({model:t,url:function(){return i(this)},initialize:function(e,t){if(!t.url)throw new Error("the document model needs an url conf");this.urlBase=t.url,this.slice=10,this.offset=0,this.keyWord=""},parse:function(e){return this.nbResult=e.data.resultMax,e.data.documents},reset:function(){return this.nbResult=null,this.slice=10,this.offset=0,Backbone.Collection.prototype.reset.apply(this,arguments)}})}),define("rsp/models/search",["underscore","rsp/collections/document","backbone"],function(e,t){"use strict";return Backbone.Model.extend({idAttribute:"initid",initialize:function(){this.listenTo(this,"selected",this.prepareDocumentList),this.set("associatedDocumentList",new t([],{url:window.location.pathname+"api/v1/rspl/listDocument/"+this.id})),this.collectionInitialized=!1,this.listenTo(this.get("associatedDocumentList"),"add",this.propagateAdd),this.listenTo(this.get("associatedDocumentList"),"reset",this.propagateReset),this.listenTo(this.get("associatedDocumentList"),"sync",this.propagateSync)},parse:function(e){return e.properties},prepareDocumentList:function(){this.collectionInitialized||this.get("associatedDocumentList").fetch()},propagateAdd:function(e){this.trigger("addDocumentList",this,this.get("associatedDocumentList"),e)},propagateReset:function(){this.trigger("resetDocumentList",this,this.get("associatedDocumentList"))},propagateSync:function(){this.trigger("syncDocumentList",this,this.get("associatedDocumentList"))}})}),define("rsp/collections/search",["underscore","rsp/models/search","backbone"],function(e,t){"use strict";return Backbone.Collection.extend({url:window.location.pathname+"api/v1/rspl/listDocument/DIR_RESPONSIVE_LIST",model:t,parse:function(e){return e.data.documents}})}),define("rsp/collections/openDocument",["underscore","rsp/models/document","backbone"],function(e,t){"use strict";return Backbone.Collection.extend({model:t,comparator:"dataSelected",initialize:function(){this.listenTo(this,"selected",this.propagateSelected),this.listenTo(this,"selectPrevious",this.selectPrevious),this.listenTo(this,"selectNext",this.selectNext),this.listenTo(this,"destroy",this.selectAnotherOne)},propagateSelected:function(e){this.each(function(t){t.set("selected",e.id===t.id),e.id!==t.id||t.get("visibileInList")||t.set("dateSelected",Date.now())}),this.trigger("orderChanged"),this.sort()},selectPrevious:function(t){var i=this.sortBy(function(e){return-e.get("dateSelected")});this.propagateSelected(i[e.indexOf(i,t)-1])},selectNext:function(t){var i=this.sortBy(function(e){return-e.get("dateSelected")});this.propagateSelected(i[e.indexOf(i,t)+1])},selectAnotherOne:function(e,t,i){var n=this.at(i.index)||this.at(i.index-1);e.get("selected")&&n&&n.trigger("selected",n),0===this.length&&(window.document.title="Les documents")}})}),define("rsp/views/search",["underscore","backbone"],function(){"use strict";return Backbone.View.extend({tagName:"option",render:function(){return this.$el.data("searchId",this.model.id).attr("value",this.model.id).addClass("searchElement").text(this.model.get("title")),this}})}),define("rsp/views/searches",["underscore","rsp/views/search","backbone"],function(e,t){"use strict";var i=e.template('<select class="form-control documentsList__searchList__select"></select>');return Backbone.View.extend({tagName:"form",events:{change:"displayDocumentList"},initialize:function(e){if(!e.collection)throw new Error("You need to associate the searches view with a collection");this.collection=e.collection,this.listenTo(this.collection,"add",this._addOne),this.listenTo(this.collection,"reset",this.render),this.listenTo(this.collection,"sync",this.displayDocumentList)},render:function(){return this.$el.empty().append(i()),this._addAll(),this},_addAll:function(){this.collection.each(this._addOne)},_addOne:function(e){var i=new t({model:e});this.$el.find(".documentsList__searchList__select").append(i.render().$el)},displayDocumentList:function(){var e=this.$el.find(".documentsList__searchList__select").val(),t=this.collection.get(e);t&&t.trigger("selected",t)}})}),define("rsp/views/openDocumentListElement",["underscore","backbone"],function(e){"use strict";var t=e.template('<a class="documentTab" href="?app=DOCUMENT&id=<%- initid %>" data-id="<%- initid %>" data-title="<%- title %>"><span class="documentTab__text">  <% if (icon) { %><img src="<%- icon %>" class="img-circle documentElement__icon" /> <% } %> <%- title %></span><button type="button" class="close documentTab__remove" aria-label="Close"><span aria-hidden="true">&times;</span></button></a>');return Backbone.View.extend({tagName:"li",className:"openDocuments__tab",events:{click:"selected","click .documentTab__remove":"remove"},initialize:function(){this.listenTo(this.model,"change",this.render),this.listenTo(this.model,"change:selected",this.indicateSelected),this.listenTo(this.model,"destroy",this["delete"])},render:function(e){return e=e||{},this.$el.empty().append(t(this.model.toJSON())),this.$el.attr("title",this.model.get("title")),e.hidden&&this.$el.addClass("documentTab__hidden clearfix"),this.indicateSelected(),this},selected:function(e){e.preventDefault(),this.model.trigger("selected",this.model,this.$el.is(".documentTab__hidden"))},indicateSelected:function(){this.model.get("selected")?this.$el.addClass("active"):this.$el.removeClass("active")},remove:function(){this.model.destroy()},"delete":function(){this.$el.remove()}})}),define("rsp/views/documentWidget",["jquery","underscore","dcpDocument/document","backbone"],function(e,t){"use strict";return Backbone.View.extend({className:"documentsWrapper__div",initialize:function(){this.listenTo(this.model,"change:selected",this.indicateSelected),this.listenTo(this.model,"change:title",this.indicateSelected),this.listenTo(this.model,"change",this.setFrameName),this.listenTo(this.model,"destroy",this["delete"]),e(window).on("resize",t.debounce(t.bind(this._resize,this),100))},render:function(){var i=this,n=t.bind(this.indicateSelected,this);return this.$el.document("fetchDocument",{initid:this.model.id,viewId:this.model.get("viewId"),revision:-1,withoutResize:!0}),this.$el.document("addEventListener","ready",function(t,s){i.model.set(s),i.model.set("attributes",this.documentController("getValues")),i.model.trigger("reloadDocument",i.model.toJSON()),e(this).find("header").hide(),n()}),this.$el.document("addEventListener","beforeClose",function(e,t,n){var s=i.model.collection.get(n.initid);return parseInt(n.initid,10)===parseInt(i.model.get("initid"),10)?void s.trigger("selected",s):(e.preventDefault(),void(s?s.trigger("selected",s):i.model.collection.add({initid:n.initid,title:"Chargement"})))}),this.$el.document("addEventListener","afterSave",function(e,t,n){0===n.id&&i.model.trigger("reloadDocumentList")}),this.$el.document("addEventListener","afterDelete",function(e,t){i.model.trigger("removeDocument",t)}),this.setFrameName(),this},indicateSelected:function(){this.model.get("selected")?(this.$el.show(),window.document.title=this.model.get("title"),window.documentSelected=this.$el,this._resize()):this.$el.hide()},_resize:function(){var i=this,n=function(e){return e=e[0],e.getBoundingClientRect().top+5};this.$el.is(":visible")&&(this.$el.find("iframe").height(e(window).innerHeight()-n(this.$el)).width(this.$el.innerWidth()-1),t.defer(function(){i.$el.find("iframe").height(e(window).innerHeight()-n(i.$el))},50))},"delete":function(){this.$el.remove()},setFrameName:function(){var e="document_"+this.model.get("initid")+"_"+this.model.get("title");this.$el.find("iframe").attr("name",e)}})}),define("rsp/views/openDocument",["jquery","underscore","rsp/views/openDocumentListElement","rsp/views/documentWidget","backbone","bootstrap"],function(e,t,i,n){"use strict";var s={global:t.template('<ul class="nav nav-tabs documentList">   <li class="openDocuments__openDocumentCloseAll pull-right" title="Fermer tous les documents">       <button type="button" class="btn btn-link">            <span class="fa fa-times-circle-o"></span>       </button>   </li>   <li class="openDocuments__more pull-right" style="visibility: hidden;">       <div class="btn-group" title="Plus de documents">           <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">               <span class="fa fa-bars"></span>               +<span class="openDocuments__more__number"></span> <span class="caret"></span>           </button>           <ul class="dropdown-menu pull-right openDocuments__more__documents" role="menu">           </ul>       </div>   </li>   <li class="openDocuments__openDocumentList visible-xs visible-sm">       <button type="button" class="btn btn-link">           <span class="fa fa-2x fa-bars"></span>       </button>   </li>   <li class="openDocuments__createDocument">       <div class="btn-group" title="Créer un document">           <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">               <span class="glyphicon glyphicon-plus-sign"></span>               Nouveau <span class="caret"></span>           </button>           <ul class="dropdown-menu openDocuments__createDocument__families" role="menu">           </ul>       </div>   </li></ul><div class="documentsWrapper"></div>'),families:t.template('<% _.each(families, function(currentFamily) { %>   <li>       <a class="openDocuments__createDocument__familyElement" href="#<%- currentFamily.initid %>" data-initid="<%- currentFamily.initid %>">          <img src="<%- currentFamily.icon %>" class="img-circle documentElement__icon"><%- currentFamily.title %>      </a>    </li> <% }); %>')};return Backbone.View.extend({events:{"click .openDocuments__openDocumentList":"switchSide","click .openDocuments__createDocument__familyElement":"openCreation","click .openDocuments__openDocumentCloseAll":"closeAll"},initialize:function(i){if(!i.openDocuments)throw new Error("You need an openDocuments collection");this.openDocuments=i.openDocuments,this.listenTo(this.openDocuments,"add",this._addDocument),this.listenTo(this.openDocuments,"selected",this.openDocumentIHM),this.listenTo(this.openDocuments,"orderChanged",this.renderOpenDocument),this.listenTo(this.openDocuments,"destroy",this.renderOpenDocument),this.nbMaxOpen=0,this.isReady=!1,e(window).on("resize",t.debounce(t.bind(this._resize,this),200))},render:function(){return this.$el.append(s.global()),0===window.dcp.creatable_family.length?this.$el.find(".openDocuments__createDocument").remove():this.$el.find(".openDocuments__createDocument__families").append(s.families({families:window.dcp.creatable_family})),this.isReady=!0,this.addPreload(),this},addPreload:function(){var t=e('<div class="documentPreload" style="display : none;"></div>');this.$el.find(".documentsWrapper").append(t),t.document()},switchSide:function(){this.trigger("switchSide")},openDocumentIHM:function(){this.trigger("openDocumentIHM")},openCreation:function(t){var i=e(t.currentTarget);t.preventDefault(),this.openDocuments.add({initid:i.data("initid"),viewId:"!coreCreation"})},_addDocument:function(e){var t,i;this.renderOpenDocument(),t=this.$el.find(".documentPreload"),t.removeClass("documentPreload"),i=new n({model:e,el:t}),i.render(),e.trigger("selected",e),this.addPreload(),i._resize()},renderOpenDocument:function(){var e=0,n=this.nbMaxOpen,s=this.$el.find(".documentList"),o=this.$(".openDocuments__more__documents");s.find(".openDocuments__tab").remove(),o.empty(),t.each(this.openDocuments.sortBy(function(e){return-e.get("dateSelected")}),function(t){var c=new i({model:t});n>e?(t.set("visibileInList",!0),s.append(c.render().$el)):(t.set("visibileInList",!1),o.append(c.render({hidden:!0}).$el)),e+=1}),0!==e&&e>n?(this.$(".openDocuments__more").css("visibility","visible"),this.$(".openDocuments__more__number").text(e-n)):this.$(".openDocuments__more").css("visibility","hidden")},closeAll:function(){for(var e;e=this.openDocuments.first();)e.destroy()},_resize:function(){var e,t=this.nbMaxOpen,i=this.$el.find(".openDocuments__createDocument");e=0===i.length?this._getBorder(this.$el.find(".documentList"),"left"):this._getBorder(i,"right"),this.isReady&&(this.nbMaxOpen=Math.floor((this._getBorder(this.$el.find(".openDocuments__more"),"left")-e-10)/202),t!==this.nbMaxOpen&&this.renderOpenDocument())},_getBorder:function(e,t){return e=e[0],e.getBoundingClientRect()[t]}})}),require(["jquery","underscore","rsp/collections/search","rsp/collections/openDocument","rsp/views/searches","rsp/views/documentList","rsp/views/openDocument","dcpDocument/document"],function(e,t,i,n,s,o,c){"use strict";var d,l=function(){var e=location.hash;return"#"===e.charAt(0)&&(e=e.slice(1)),e},r=function(){e(".documentsList").toggleClass("hiddenLittle"),e(".openDocuments").toggleClass("hiddenLittle"),e(window).trigger("resize")};return window.dcp.search_list&&0!==window.dcp.search_list.length?(window.dcp=window.dcp||{},window.dcp.collections=window.dcp.collections||{},window.dcp.views=window.dcp.views||{},window.dcp.collections.searches=new i,window.dcp.collections.openDocuments=new n,void e(document).ready(function(){window.dcp.views.searches=new s({el:e(".documentsList__searchList"),collection:window.dcp.collections.searches}),window.dcp.views.searches.render(),window.dcp.views.documentList=new o({el:e(".documentsList__documents"),collection:window.dcp.collections.searches,openDocuments:window.dcp.collections.openDocuments}),window.dcp.views.openDocument=new c({el:e(".openDocuments"),openDocuments:window.dcp.collections.openDocuments}),window.dcp.views.openDocument.listenTo(window.dcp.views.openDocument,"switchSide",function(){r()}),window.dcp.views.openDocument.listenTo(window.dcp.views.openDocument,"openDocumentIHM",function(){e(".documentsList").addClass("hiddenLittle"),e(".openDocuments").removeClass("hiddenLittle"),e(window).trigger("resize")}),window.dcp.collections.openDocuments.listenTo(window.dcp.collections.openDocuments,"reloadDocumentList",function(){window.dcp.views.documentList.trigger("reloadDocumentList")}),window.dcp.collections.openDocuments.listenTo(window.dcp.collections.openDocuments,"reloadDocument",function(e){window.dcp.views.documentList.trigger("reloadDocument",e)}),window.dcp.collections.openDocuments.listenTo(window.dcp.collections.openDocuments,"removeDocument",function(e){window.dcp.views.documentList.trigger("removeDocument",e)}),e(".documentList__switch").on("click",function(){r()}),e(".unlog--button").on("click",function(){e("#disconnect").submit()}),window.dcp.views.openDocument.render(),window.dcp.views.documentList.render(),window.dcp.collections.searches.add(window.dcp.search_list),window.dcp.views.searches.displayDocumentList(),l()&&(d=l(),/.*id=.*/.test(d)&&(d=/.*id=([^&]*)/.exec(d),d=d[1]||!1,d&&window.dcp.collections.openDocuments.add({initid:d,revision:-1},{at:0}))),e(".loading--initial").hide(),e(".content").show(),e(window).trigger("resize")})):(e(".loading--initial").hide(),void e(".error__wrapper").show())}),define("RESPONSIVE_LIST/JS/main",function(){});
//# sourceMappingURL=main-built.js
//# sourceMappingURL=main-built.js.map
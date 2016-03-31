/**
 * Created by charles on 10/03/15.
 */
require(["jquery",
    "underscore",
    "rsp/collections/search",
    "rsp/collections/openDocument",
    "rsp/views/searches",
    "rsp/views/documentList",
    "rsp/views/openDocument",
    "dcpDocument/document"], function rsp_require($, _, CollectionSearch, CollectionOpenDocument,
                                                  ViewSearches, ViewDocumentList, ViewOpenDocument)
{

    "use strict";

    var hash, getHash = function getHash()
    {
        var hash = location.hash;
        if (hash.charAt(0) === "#") {
            hash = hash.slice(1);
        }
        return hash;
    };

    var toogleLittleMode = function() {
        $(".documentsList").toggleClass("hiddenLittle");
        $(".openDocuments").toggleClass("hiddenLittle");
        $(window).trigger("resize");
    };

    if (!window.dcp.search_list || window.dcp.search_list.length === 0) {
        $(".loading--initial").hide();
        $(".error__wrapper").show();
        return;
    }

    window.dcp = window.dcp || {};

    window.dcp.collections = window.dcp.collections || {};
    window.dcp.views = window.dcp.views || {};

    window.dcp.collections.searches = new CollectionSearch();
    window.dcp.collections.openDocuments = new CollectionOpenDocument();

    $(document).ready(function rsp_ready()
    {

        window.dcp.views.searches = new ViewSearches({
            el: $(".documentsList__searchList"),
            collection: window.dcp.collections.searches
        });
        window.dcp.views.searches.render();
        window.dcp.views.documentList = new ViewDocumentList({
            el: $(".documentsList__documents"),
            collection: window.dcp.collections.searches,
            openDocuments : window.dcp.collections.openDocuments
        });
        window.dcp.views.openDocument = new ViewOpenDocument({
            el: $(".openDocuments"),
            openDocuments: window.dcp.collections.openDocuments
        });
        window.dcp.views.openDocument.listenTo(window.dcp.views.openDocument, "switchSide", function() {
            toogleLittleMode();
        });
        window.dcp.views.openDocument.listenTo(window.dcp.views.openDocument, "openDocumentIHM", function ()
        {
            $(".documentsList").addClass("hiddenLittle");
            $(".openDocuments").removeClass("hiddenLittle");
            $(window).trigger("resize");
        });
        window.dcp.collections.openDocuments.listenTo(window.dcp.collections.openDocuments, "reloadDocumentList", function ()
        {
            window.dcp.views.documentList.trigger("reloadDocumentList");
        });
        window.dcp.collections.openDocuments.listenTo(window.dcp.collections.openDocuments, "reloadDocument", function (currentDocument)
        {
            window.dcp.views.documentList.trigger("reloadDocument", currentDocument);
        });
        window.dcp.collections.openDocuments.listenTo(window.dcp.collections.openDocuments, "removeDocument", function (currentDocument)
        {
            window.dcp.views.documentList.trigger("removeDocument", currentDocument);
        });
        $(".documentList__switch").on("click", function() {
            toogleLittleMode();
        });
        $(".unlog--button").on("click", function() {
           $("#disconnect").submit();
        });
        window.dcp.views.openDocument.render();
        window.dcp.views.documentList.render();
        window.dcp.collections.searches.add(window.dcp.search_list);
        window.dcp.views.searches.displayDocumentList();

        if (getHash()) {
            hash = getHash();
            if (/.*id=.*/.test(hash)) {
                hash = /.*id=([^&]*)/.exec(hash);
                hash = hash[1] || false;
                if (hash) {
                    window.dcp.collections.openDocuments.add({initid : hash, "revision" : -1}, {at: 0});
                }
            }
        }


        $(".loading--initial").hide();
        $(".content").show();
        $(window).trigger("resize");
    });
});
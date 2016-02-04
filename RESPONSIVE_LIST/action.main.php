<?php

use Dcp\HttpApi\V1\Crud\DocumentFormatter as DocumentFormatter;

function main(Action &$action)
{

    $version = \ApplicationParameterManager::getParameterValue(
        "CORE", "WVERSION"
    );

    //$version = uniqid();

    $action->parent->addJsRef("lib/RequireJS/require.js?ws=" . $version);
    $action->parent->addJsRef(
        "RESPONSIVE_LIST/JS/require_config.js?ws=" . $version
    );
    $action->parent->addJsRef(
        "lib/KendoUI/ddui/js/kendo-ddui-builded.js?ws=" . $version
    );
    $modeDebug = \ApplicationParameterManager::getParameterValue(
        \ApplicationParameterManager::CURRENT_APPLICATION, "DEBUG"
    );
    if ($modeDebug !== "FALSE") {
        $action->parent->addJsRef(
            "RESPONSIVE_LIST/JS/main.js?ws=" . $version
        );
    } else {
        $action->parent->addJsRef(
            "RESPONSIVE_LIST/JS/main-built.js?ws=" . $version
        );
    }

    $injectJS = \ApplicationParameterManager::getParameterValue(
        \ApplicationParameterManager::CURRENT_APPLICATION, "INJECT_JS"
    );

    $injectJS = json_decode($injectJS, true);

    if (is_array($injectJS)) {
        foreach($injectJS as $currentJS) {
            $action->parent->addJsRef(
                $currentJS."?ws=" . $version
            );
        }
    }

    $action->parent->AddCssRef("css/rsp/main.css?ws=" . $version);

    $injectCSS = \ApplicationParameterManager::getParameterValue(
        \ApplicationParameterManager::CURRENT_APPLICATION, "INJECT_CSS"
    );

    $injectCSS = json_decode($injectCSS, true);

    if (is_array($injectCSS)) {
        foreach ($injectCSS as $currentCSS) {
            $action->parent->addCssRef(
                $currentCSS . "?ws=" . $version
            );
        }
    }


    //SearchList
    $searchList = new \SearchDoc();
    $searchList->setObjectReturn();
    $searchList->useCollection(
        \ApplicationParameterManager::getParameterValue(
            \ApplicationParameterManager::CURRENT_APPLICATION, "COLLECTION_DIR"
        )
    );
    $searchListFormatter = new DocumentFormatter(
        $searchList->getDocumentList()
    );
    $searchListFormatter->useDefaultProperties();

    //Creatable family
    $familyList = new \SearchDoc();
    $familyList->setObjectReturn();
    $familyList->useCollection(
        \ApplicationParameterManager::getParameterValue(
            \ApplicationParameterManager::CURRENT_APPLICATION,
            "CREATABLE_FAM"
        )
    );
    $familyList = $familyList->getDocumentList();
    $familyList->listMap(
        function (\Doc $currentFam) {
            if ($currentFam->doctype !== "C") {
                return false;
            }
            return $currentFam->hasPermission("icreate")
            && $currentFam->hasPermission(
                "create"
            );
        }
    );
    $familyListFormatter = new DocumentFormatter(
        $familyList
    );
    $familyListFormatter->useDefaultProperties();

    $searchList = array_map(
        function ($currentSearch) {
            return $currentSearch["properties"];
        }, $searchListFormatter->format()
    );

    $familyList = array_map(
        function ($current) {
            return $current["properties"];
        }, $familyListFormatter->format()
    );

    $action->lay->set(
        "search_list", json_encode($searchList)
    );
    $action->lay->set(
        "creatable_family", json_encode($familyList)
    );
    $action->lay->eSet(
        "text_header",
        _(
            \ApplicationParameterManager::getParameterValue(
                \ApplicationParameterManager::CURRENT_APPLICATION,
                "TEXT_HEADER"
            )
        )
    );
    $action->lay->eSet(
        "username",
        \Doc::getUserName(true)
    );
    $action->lay->eSet("WS", $version);
}
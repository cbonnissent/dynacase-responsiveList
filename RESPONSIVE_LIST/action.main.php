<?php

function main(Action &$action)
{

    $version = \ApplicationParameterManager::getParameterValue(
        "CORE", "WVERSION"
    );

    $action->parent->addJsRef("lib/RequireJS/require.js?ws=" . $version);
    $action->parent->addJsRef(
        "RESPONSIVE_LIST/JS/require_config.js?ws=" . $version
    );
    $action->parent->addJsRef("RESPONSIVE_LIST/JS/main.js");


    //$action->parent->AddCssRef("lib/bootstrap/3/css/bootstrap.min.css?ws=" . $version);
    $action->parent->AddCssRef("css/rsp/main.css?ws=" . $version);

    $action->lay->eSet("WS", $version);
}
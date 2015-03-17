<?php

$app_desc = array(
    "name" => "RESPONSIVE_LIST",
    "short_name" => N_("RSPL:RESPONSIVE_LIST"),
    "description" => N_("RSPL:RESPONSIVE_LIST"),
    "icon" => "RESPONSIVE_LIST.png",
    "displayable" => "U",
    "with_frame" => "Y",
    "childof" => ""
);


// ACLs for this application
$app_acl = array(
    array(
        "name" => "BASIC",
        "description" => N_("RSPL:Basic ACL")
    )
);
// Actions for this application
$action_desc = array(
    array(
        "name" => "MAIN",
        "short_name" => N_("RSPL:MAIN"),
        "layout" => "main.html",
        "script" => "action.main.php",
        "function" => "main",
        "root" => "Y",
        "acl" => "BASIC"
    )
);



<?php

function concat_templates(Action &$action) {

    $globalVarFile = "RESPONSIVE_LIST/templates.d/global.json";

    if (is_file($globalVarFile)) {
        unlink($globalVarFile);
    }

    $fullContent = array();

    $files = array();

    $iterator = new DirectoryIterator("RESPONSIVE_LIST/templates.d/");
    foreach ($iterator as $fileinfo) {
        if ($fileinfo->isDot() || $fileinfo->getExtension() !== "json") {
            continue;
        }
        $files[$fileinfo->getPathname()] = $fileinfo->getPathname();
    }

    ksort($files);

    print("\n");
    foreach ($files as $currentFiles) {
        print("Compute : $currentFiles \n");
        $fullContent = array_merge(
            $fullContent, json_decode(file_get_contents($currentFiles), true)
        );
    }
    print("\n");

    file_put_contents($globalVarFile, json_encode($fullContent));

}
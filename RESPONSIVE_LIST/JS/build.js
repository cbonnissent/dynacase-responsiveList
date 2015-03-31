({
    baseUrl: "../../",
    paths: {
        "rsp": "RESPONSIVE_LIST/JS",
        //use empty: to indicate deps that cannot/should not be concatened/minified
        "dcpDocument": "empty:",
        "jquery": "empty:",
        "underscore": "empty:",
        "backbone": "empty:",
        "bootstrap": "empty:",
        "rsp/views/documentList" : "empty:"
    },
    generateSourceMaps: true,
    preserveLicenseComments: false,
    optimize: "uglify2",
    name: "RESPONSIVE_LIST/JS/main",
    out: "main-built.js"
})
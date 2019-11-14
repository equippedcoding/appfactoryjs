{
    "application": {
        "use-static": false,
        "prod": false,
        "production_url": "",
        "development_url": "",
        "client-active-theme": "newplugin|theme4",
        "admin-active-theme": "default|default",
        "plugins": {
            "default": {
                "name": "Default",
                "directory": "default",
                "start": "init",
                "admin-interface": true,
                "client-interface": true
            }
        }
    },
    "index-config": {
        "title": "Appfactory Documentation",
        "doctype": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
        "meta": [
            "<meta charset=\"UTF-8\">",
            "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">",
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">"
        ],
        "head": [
            "<script src=\"js/libs/jquery/jquery.js\"></script>",
            "<script src=\"js/libs/underscore/underscore.js\"></script>",
            "<script src=\"js/libs/backbone/backbone.js\"></script>",
            "<script src=\"js/libs/appfactoryjs/appfactory.js\"></script>",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"styles/libs/bootstrap4/bootstrap.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"js/libs/appfactoryjs/appfactory.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"styles/client/styles.css\">"
        ],
        "body": [
            "<script data-main=\"js/main.js\" src=\"js/libs/requirejs/require.js\"></script>"
        ]
    },
    "index-admin-config": {
        "title": "",
        "doctype": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
        "meta": [
            "<meta charset=\"UTF-8\">",
            "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">",
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">"
        ],
        "head": [
            "<script src=\"../../js/libs/jquery/jquery.js\"></script>",
            "<script src=\"../../js/libs/underscore/underscore.js\"></script>",
            "<script src=\"../../js/libs/backbone/backbone.js\"></script>",
            "<script src=\"../../js/libs/appfactoryjs/appfactory.js\"></script>",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../styles/libs/bootstrap4/bootstrap.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../js/libs/appfactoryjs/appfactory.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"styles/styles.css\">"
        ],
        "body": [
            "<script data-main=\"js/main.js\" src=\"../../js/libs/requirejs/require.js\"></script>"
        ]
    },
    "requirejs-config": {
        "waitSeconds": 35,
        "shim": {},
        "name": "main",
        "baseUrl": "./js",
        "out": "js/build/bundle.js",
        "optimize": "none",
        "paths": {
            "appfactory":"libs/appfactory/appfactory",
            "underscore":"libs/underscore/underscore",
            "backbone":"libs/backbone/backbone",
            "bootstrap":"libs/bootstrap/bootstrap",
            "jquery":"libs/jquery/jquery",
            "jqueryui": "libs/jquery-ui-1.12.1/jquery-ui",
            "underscore": "libs/underscore/underscore",
            "backbone": "libs/backbone/backbone",
            "backbone-mutators": "libs/backbone/extensions/backbone.mutators",
            "backbone-memento": "libs/backbone/extensions/backbone.memento",
            "socketio": "libs/socket.io-client/dist/socket.io",
            "eve": "libs/raphael/eve.0.3.4",
            "raphael.core": "libs/raphael/raphael.2.1.0.core",
            "raphael.svg": "libs/raphael/raphael.2.1.0.svg",
            "raphael.vml": "libs/raphael/raphael.2.1.0.vml",
            "raphael": "libs/raphael/raphael.2.1.0.amd",
            "bootstrap": "libs/bootstrap/bootstrap.bundle",
            "debug-addIndicators": "libs/scrollmagic/uncompressed/plugins/debug.addIndicators",
            "scrollmagic": "libs/scrollmagic/uncompressed/ScrollMagic",
            "animation-gsap": "libs/scrollmagic/uncompressed/plugins/animation.gsap",
            "tweenmax": "libs/scrollmagic/greensock/TweenMax.min",
            "TweenLite": "libs/scrollmagic/greensock/TweenLite.min",
            "timelinemax": "libs/scrollmagic/greensock/TimelineMax.min",
            "TimelineLite": "libs/scrollmagic/greensock/TimelineLite.min",
            "moment": "libs/moment/moment",
            "interact": "libs/interact/interact",
            "webrtc": "libs/webrtc/adapter",
            "download": "libs/downloadjs/download",
            "parse": "libs/parse/parse.min",
            "socket-io": "libs/socket-io-file/socket.io-file-client",
            "scrollTo": "libs/plugins/jquery.scrollTo.min"
        }
    }
}
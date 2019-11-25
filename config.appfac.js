{
    "application": {
        "version":"0.1.4",
        "use-static": false,
        "prod": false,
        "production_url": "",
        "development_url": "",
        "client-active-theme": "default|default",
        "admin-active-theme": "default|default",
        "plugins": {
            "default": {
                "name": "Default",
                "directory": "default",
                "start": "init",
                "admin-interface": true,
                "client-interface": true
            },
            "under_construction": {
                "name": "Under Construction",
                "directory": "under_construction",
                "start": "init",
                "admin-active": true,
                "client-active": true
            }
        }
    },
    "index-config": {
        "title": "Documentation",
        "doctype": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
        "meta": [
            "<meta charset=\"UTF-8\">",
            "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">",
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">"
        ],
        "head": [
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"libs/styles/bootstrap4/bootstrap.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"libs/scripts/appfactoryjs/appfactory.css\">"
        ],
        "body": [
            "<script data-main=\"plugins/main.js\" src=\"libs/scripts/requirejs/require.js\"></script>"
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
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../libs/styles/bootstrap4/bootstrap.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../libs/scripts/appfactoryjs/appfactory.css\">"
        ],
        "body": [
            "<script data-main=\"js/main.js\" src=\"../../libs/scripts/requirejs/require.js\"></script>"
        ]
    },
    "requirejs-config": {
        "waitSeconds": 35,
        "shim": {},
        "name": "plugins/main",
        "baseUrl": "./",
        "out": "build/bundle.js",
        "optimize": "none",
        "paths": {
            "appfactory": "libs/scripts/appfactoryjs/appfactory",
            "underscore": "libs/scripts/underscore/underscore",
            "backbone": "libs/scripts/backbone/backbone",
            "bootstrap": "libs/scripts/bootstrap/bootstrap.bundle",
            "jquery": "libs/scripts/jquery/jquery",
            "jqueryui": "libs/scripts/jquery-ui-1.12.1/jquery-ui",
            "backbone-mutators": "libs/scripts/backbone/extensions/backbone.mutators",
            "backbone-memento": "libs/scripts/backbone/extensions/backbone.memento",
            "socketio": "libs/scripts/socket.io-client/dist/socket.io",
            "eve": "libs/scripts/raphael/eve.0.3.4",
            "raphael.core": "libs/scripts/raphael/raphael.2.1.0.core",
            "raphael.svg": "libs/scripts/raphael/raphael.2.1.0.svg",
            "raphael.vml": "libs/scripts/raphael/raphael.2.1.0.vml",
            "raphael": "libs/scripts/raphael/raphael.2.1.0.amd",
            "debug-addIndicators": "libs/scripts/scrollmagic/uncompressed/plugins/debug.addIndicators",
            "scrollmagic": "libs/scripts/scrollmagic/uncompressed/ScrollMagic",
            "animation-gsap": "libs/scripts/scrollmagic/uncompressed/plugins/animation.gsap",
            "tweenmax": "libs/scripts/scrollmagic/greensock/TweenMax.min",
            "TweenLite": "libs/scripts/scrollmagic/greensock/TweenLite.min",
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
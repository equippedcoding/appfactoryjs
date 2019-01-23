{
    "application": {
        "prod": true,
        "production_url": "",
        "development_url": "",
        "theme":"_default|theme"
    },
    "index-config": {
        "title": "",
        "doctype": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
        "meta": [
            "<meta charset=\"UTF-8\">",
            "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">",
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">"
        ],
        "head": [ 
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"styles/libs/bootstrap4/bootstrap.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"js/libs/appfactoryjs/appfactory.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"styles/client/styles.css\">"
        ],
        "body": [],
        "scripts": {
            "requirejs-script": "<script data-main=\"js/main.js\" src=\"js/libs/requirejs/require.js\"></script>",
            "appfactorystarter-script": "<script src=\"js/libs/appfactoryjs/appfactorystarter.js\"></script>",
            "build-output-script": ""
        }
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
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../styles/libs/bootstrap4/bootstrap.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../js/libs/appfactoryjs/appfactory.css\">",
            "<link rel=\"stylesheet\" type=\"text/css\" href=\"styles/admin/styles.css\">"
        ],
        "body": [],
        "scripts": {
            "requirejs-script": "<script data-main=\"../../js/admin/admin-main.js\" src=\"../../js/libs/requirejs/require.js\"></script>",
            "appfactorystarter-script": "<script src=\"../../js/libs/appfactoryjs/appfactorystarter.js\"></script>",
            "build-output-script": ""
        }
    },
    "requirejs-config": {
        "waitSeconds": 35,
        "shim": {},
        "baseUrl": "./",
        "out": "build-complete.js",
        "optimize": "none",
        "paths": {
            "appfactory": "libs/appfactoryjs/appfactory",
            "jquery": "libs/jquery/jquery",
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
            "transition": "libs/bootstrap/transition",
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
            "socket-io-file": "libs/socket-io-file/socket.io-file-client",
            "scrollTo": "libs/plugins/jquery.scrollTo.min"
        }
    }
}
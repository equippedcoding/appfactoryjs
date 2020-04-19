{
    "version":"0.1.4",
    "application": {
        "use-static": false,
        "prod": false,
        "production_url": "",
        "development_url": "",
        "client-active-theme": "app|default",
        "admin-active-theme": "app|default",
        "plugins": {
            "app": {
                "name": "App",
                "directory": "app",
                "start": "init",
                "admin-active": true,
                "client-active": true
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
    "indexes": {
        "all": {
            "doctype": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
            "meta": [
                "<meta charset=\"UTF-8\">",
                "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">",
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">"
            ],
            "head": [
                "<link rel=\"stylesheet\" type=\"text/css\" href=\"{libs/styles/bootstrap4/bootstrap.css}\">",
                "<link rel=\"stylesheet\" type=\"text/css\" href=\"{libs/scripts/appfactoryjs/appfactory.css}\">",
                "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Shrikhand&display=swap\">"
            ],
            "body": []
        },
        "index": {
            "settings": {
                "path": "",
                "init": false
            },
            "title": "",
            "meta": [],
            "head": [],
            "body": [
                "<script data-main=\"plugins/main.js\" src=\"libs/scripts/requirejs/require.js\"></script>"
            ]
        },
        "admin": {
            "settings": {
                "path": "../../",
                "init": false
            },
            "title": "Administration Page",
            "meta": [],
            "head": [],
            "body": [
                "<script data-main=\"js/main.js\" src=\"../../libs/scripts/requirejs/require.js\"></script>"
            ]
        }
    },
    "includes":{},
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
            "debug-addIndicators": "libs/scripts/scrollmagic/uncompressed/plugins/debug.addIndicators",
            "scrollmagic": "libs/scripts/scrollmagic/uncompressed/ScrollMagic",
            "animation-gsap": "libs/scripts/scrollmagic/uncompressed/plugins/animation.gsap",
            "tweenmax": "libs/scripts/scrollmagic/greensock/TweenMax.min",
            "TweenLite": "libs/scripts/scrollmagic/greensock/TweenLite.min",
            "timelinemax": "libs/scrollmagic/greensock/TimelineMax.min",
            "TimelineLite": "libs/scrollmagic/greensock/TimelineLite.min"
        }
    }
}
var AppFactoryStart = (function(){

var IsAdmin = false;

function a(configFile){
	return new Promise(resolve => {
		var rawFile = new XMLHttpRequest();
    	rawFile.open("GET", configFile, false);
    	rawFile.send(null); 
    	resolve(rawFile.responseText)
	}); 
} 

function mergeToFrom(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}


function LoadDependencies(baseUrl,classes,views,dependencies){
	// baseUrl - standered/client
	// 'js/plugins/standered/client/classes/Standered'
	//,'../../../admin/classes/MediaFilesHandler'
	//,'../../../admin/themes/default/components/newEpisodeFormComponent'

	if(baseUrl.includes("/client")){
		for(var i=0; i < classes.length; i++){
			if(IsAdmin){
				classes[i] = "../../classes/" + classes[i];
			}else{
				classes[i] = "js/plugins/"+baseUrl+"/classes/" + classes[i];
			}
		}
		for (var i=0; i < views.length; i++) {
			var theme = views[i].split("/")[0];
			var view = views[i].split("/")[1];
			if(IsAdmin){
				views[i] = "../../themes/"+theme+"/components/"+view;
			}else{
				views[i] = "js/plugins/"+baseUrl+"/themes/"+theme+"/components/"+view;
			}
		}
	}else if(baseUrl.includes("/admin")){
		for(var i=0; i < classes.length; i++){
			if(IsAdmin){
				classes[i] = "../../classes/" + classes[i];
			}else{
				classes[i] = "js/plugins/"+baseUrl+"/classes/" + classes[i];
			}
		}
		for (var i=0; i < views.length; i++) {
			var theme = views[i].split("/")[0];
			var view = views[i].split("/")[1];
			views[i] = "../../themes/"+theme+"/components/"+view;
		}
	}

	var deps = classes.concat(views).concat(dependencies);
	return deps;
}
window.LoadDependencies = LoadDependencies;


var _AppFactoryStart = {

	Capture: 'Capture',
	NoCapture: 'NoCapture',
	cb: null,
	config: null,
	main: async function(isAdmin,configFile,extra,callback,type,socketio){

		IsAdmin = isAdmin;
		var appfac_config = null;
		if(type==this.Capture){
			this.cb = callback;
			var configuration = setup(configFileString);
			//if(isAdmin) configuration.config.paths = reformPath(configuration.config.paths);
			this.config = config;
		}else{

			var configFileString = await a(configFile);
			appfac_config = JSON.parse(configFileString);

			addPluginsSupported(function(plugins){
				run(configFileString,plugins);
			});
			
		}

		function run(configFileString,plugins){
			console.log(plugins);
			var configuration = setup(configFileString,plugins);
			configuration.config.paths = reformPath(configuration.config.paths);

			//console.log(configuration.config);

			requirejs.config(configuration.config);

			//console.log(configuration.require);

			requirejs(configuration.require, function(a){
				var requireArgs = arguments;
				callback(appfac_config,plugins,requireArgs);
			});

		}

		function setup(configJSON,plugins){
			var config;
			if(typeof configJSON === 'string'){
				config = JSON.parse(configJSON);
				config = config['requirejs-config'];
			}else{
				config = configJSON;
			}
			
			if(extra==null || extra==undefined){
				extra = {};
				extra.paths = {};
				extra.require = [];
			}else{
				if(extra.require==null || extra.require==undefined){
					extra.require = [];
				}else{
					if(Array.isArray(extra.require)){
						//extra.require.push('appfactory');
					}else{
						console.error("require object needs to be an Array");
					}
				}
				if(extra.paths==null || extra.paths==undefined){
					extra.paths = {};
				}
			}
			config.paths = mergeToFrom(extra.paths, config.paths);
			if(plugins!=undefined){
				for(var i=0; i<plugins.length; i++){
					var f;
					if(isAdmin){
						f = "../../js/plugins/"+plugins[i].directory+"/"+plugins[i].start;
					}else{
						f = "js/plugins/"+plugins[i].directory+"/"+plugins[i].start+".js";
					}
					//console.log(f);
					extra.require.push(f);
				}
			}
			var nonOverrides = ['paths','require'];
			for(var obj in extra){
				var isNot = false;
				for(var i=0; i<nonOverrides.length; i++){
					if(obj!=nonOverrides[i]){
						isNot = true;
						break;
					}
				}
				if(isNot==false){
					config[obj] = extra[obj];
				}
			}



			return {
				config: config,
				require: extra.require
			};
		}
		// function reformPath(path){
		// 	var newPath = {};
		// 	for(var i in path){
		// 		newPath[i] = "http://localhost/newapp3/2wokegurls/js/"+path[i];
		// 	}

		// 	console.log(newPath);
		// 	return newPath;
		// }

		function reformPath(path){
			var newPath = {};

			if(isAdmin){
				for(var i in path){
					newPath[i] = "../../js/"+path[i];
				}
			}else{
				for(var i in path){
					newPath[i] = "js/"+path[i];
				}
			}

			return newPath;
		}



	    function addPluginsSupported(cb1){
	    	//cb1();
			var rawFile = new XMLHttpRequest();
			var routeForPluginConfig;
			var routeForPluginDirs;
			if(isAdmin){
				routeForPluginConfig = "../../js/plugins/plugin.config.json";
				routeForPluginDirs = "../../js/plugins/";
			}else{
				routeForPluginConfig = "js/plugins/plugin.config.json";
				routeForPluginDirs = "js/plugins/";
			}
			rawFile.open("GET", routeForPluginConfig, false);
			rawFile.onreadystatechange = function (){
			   if(rawFile.readyState === 4) {
				  if(rawFile.status === 200 || rawFile.status == 0){
					 var allText = rawFile.responseText;
					 try{
					 	var main_file = JSON.parse(allText);

						var dirs = main_file.directories;
						var some = [];
						for(var i=0; i<dirs.length; i++){
						 	setupAdminGet(some, routeForPluginDirs+dirs[i]+"/plugin.config.json");
						}

						cb1(some);
					 }catch(e){
					 	console.error("Main plugin JSON config file may be malformed wrong!")
					 	console.error(e)
					 }
					 
				  }
			   }
		    }
		    rawFile.send(null);  
	    }

	    function setupAdminGet(some,fileLoc){
			var rawFile = new XMLHttpRequest();
			rawFile.open("GET", fileLoc, false);
			rawFile.onreadystatechange = function (){
			   if(rawFile.readyState === 4) {
				  if(rawFile.status === 200 || rawFile.status == 0){
					 var allText = rawFile.responseText;
					 some.push(JSON.parse(allText));
				  }
			   }
		    }
		    rawFile.send(null);  
	    }



	}
};


	return _AppFactoryStart;



})();











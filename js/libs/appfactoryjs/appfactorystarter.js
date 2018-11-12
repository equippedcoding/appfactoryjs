var AppFactoryStart = (function(){

function a(configFile){
	return new Promise(resolve => {
		var rawFile = new XMLHttpRequest();
    	rawFile.open("GET", configFile, false);
    	rawFile.send(null); 
    	
    	//setTimeout(function(){
    		resolve(rawFile.responseText)
    	//},2000);
	});
}

function mergeToFrom(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

var _AppFactoryStart = {

	Capture: 'Capture',
	NoCapture: 'NoCapture',
	cb: null,
	config: null,
	main: async function(configFile,extra,callback,type){
		if(type==this.Capture){
			this.cb = callback;
			this.config = setup(configFileString22);
		}else{
			var configFileString = await a(configFile);
			run(configFileString);
		}

		function run(configFileString){
			var config = setup(configFileString);
			console.log(config);
			requirejs.config(config.config);
			requirejs(extra.require, function(a){
				callback();
			});
		}

		function setup(configJSON){
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
				extra.require = ['appfactory'];
			}else{
				if(extra.require==null || extra.require==undefined){
					extra.require = ['appfactory'];
				}else{
					if(Array.isArray(extra.require)){
						extra.require.push('appfactory');
					}else{
						console.error("require object needs to be an Array");
					}
				}
				if(extra.paths==null || extra.paths==undefined){
					extra.paths = {};
				}
			}
			config.paths = mergeToFrom(extra.paths, config.paths);
			return {
				config: config,
				require: extra
			};
		}
	}
};


	return _AppFactoryStart;



})();

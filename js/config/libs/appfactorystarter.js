(function(){


window.AppFactoryStart = { 


	main: function(configFile,extra,callback){

		readTextFile(configFile,function(configJSON){

			var config = JSON.parse(configJSON);


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
				if(extra.require==null || extra.paths==undefined){
					extra.paths = {};
				}
			}
			config.paths = mergeToFrom(extra.paths, config.paths);
			require.config(config);
			require(extra.require, function(a){

				console.log(a);

				// if(typeof callback === "function"){
				// 	ApplicationManager_start(callback,this);
				// }else if(typeof callback === "boolean" && callback==true){
				// 	ApplicationManager_start(param,this);
				// 	pages.init();
				// 	pages.render();
				// 	// 5555
				// }

				callback();
			});




		});
	},


};


function mergeToFrom(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}
function readTextFile(file,callback){
     var rawFile = new XMLHttpRequest();
     rawFile.open("GET", file, false);
     rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                callback(allText,rawFile);
            }
        }
    }
    rawFile.send(null);    
}
})();

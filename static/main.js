// This file is auto generated. Any changes will be over written.
function Ready(fn) {
	if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
function initializeApplication(){  
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			var config = JSON.parse(xhttp.responseText);
			require.config(config['requirejs-config']);
			requirejs(['appfactory','plugins/app/init'],function(appfactory,activePlugin){
				var app = new ApplicationContextManager(config);
				//app.setHash(window.location.hash);
				app.initializeApplication(true,activePlugin);
			});
	    }
	};
	xhttp.open("GET", "config.appfac.js", true);
	xhttp.send();
}
Ready(initializeApplication);
// This file is auto generated. Any changes will be over written.
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var config = JSON.parse(xhttp.responseText);
		require.config(config['requirejs-config']);
		requirejs(['appfactory','plugins/app/init'],function(appfactory,activePlugin){
			var app = new ApplicationContextManager(config);
			app.initializeApplication(true,activePlugin);
		});
    }
};
xhttp.open("GET", "config.appfac.js", true);
xhttp.send();

// This file is auto generated. Any changes will be over written.
$.getJSON( "config.appfac.js", function( config ) {
	require.config(config['requirejs-config']);
	requirejs(['appfactory','./js/plugins/default/init'],function(activePlugin){
		var app = new ApplicationContextManager(config);
		app.initializeApplication(true,activePlugin);
	});
});






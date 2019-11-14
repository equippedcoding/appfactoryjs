// This file is auto generated. Any changes will be over written.
$.getJSON( "config.appfac.js", function( config ) {
	require.config(config['requirejs-config']);
	requirejs(['appfactory','plugins/default/init'],function(appfactory,activePlugin){
		var app = new ApplicationContextManager(config);
		app.initializeApplication(true,activePlugin);
	});
});




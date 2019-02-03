AppFactoryStart.main(false,"config.appfac.js",{
	baseUrl: "./",
	paths:{'initScript':'./dashboard/classes/initialization'},
	require: ['appfactory','initScript']
},function(config_appfac,plugins,requireArgs){   

	var app = new ApplicationContextManager(config_appfac,plugins);
	app.setApplicationConfiguration(config_appfac);
	app.setApplicationPlugins(plugins);
	app.initializeApplication();
	requireArgs[1](true,app,config_appfac,plugins);


},AppFactoryStart.NoCapture); 








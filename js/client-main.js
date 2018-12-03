AppFactoryStart.main(false,"config.appfac.js",{
	baseUrl: "./",
	paths:{},
	require: ['appfactory']
},function(){   

	var app = new ApplicationContextManager();
	var clientPlugin = app.Plugin.loadClientPlugin('appfactoryjs_file_upload_and_manament');
	var component = app.Comp.container({
		body: "<h3></h3>"
	});
	$('body').append(component.getHtml());

},AppFactoryStart.NoCapture); 




















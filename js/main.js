AppFactoryStart.main(false,"config.appfac.js",{
	baseUrl: "./",
	paths:{},
	require: ['appfactory']
},function(config,plugin){   

	var app = new ApplicationContextManager(config);

	var component = app.Comp.container({
		body: "<h3>Hello World</h3>"
	});

	$('body').append(component.getHtml());

},AppFactoryStart.NoCapture); 








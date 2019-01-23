AppFactoryStart.main(false,"config.appfac.js",{
	baseUrl: "./",
	paths:{},
	require: ['appfactory']
},function(config,plugin){   

	var app = new ApplicationContextManager(config);


	var component = app.Factory.container({
		classes: "row",
		body: "<div class='col-md-12'><h3>Welcome - AppFactoryJS</h3></div>"
	});

	var container = app.Factory.container({
		classes: "container",
		body: component
	});

	$('body').append(container.getHtml());

},AppFactoryStart.NoCapture); 








define([],function(){
	


	function init(app,config){

		// register some method to be called later, and output html
		app.Manager.register('homeLayout', function(){

			var header = Brick.stack().h2({
				style: "margin-top:5%;",
				innerHTML: "Welcome, AppfactoryJS"
			}).build();

			var layout = app.Layout.newLayout()
				.row()
				.col({md:12},[header])
				.build();

			var container = app.Factory.container({
				classes: "container",
				body: layout
			});

			// always return element from register function
			return container;
		});


		// start application life cycle with routing 
		Manager.init(true,function(){
			Pages.newPageView({
				baseRoute: 'home',
				init: true,
				routes: {
					'':'homeLayout'
				}
			});
		});

		// start the application life cycle without routing
		// must return an appfactory object 
		//app.Manager.init();

		// an element is only being returned because this
		// sample application handled the container and 
		// displays it, but since this is the starting
		// point of the app the container element should 
		// either be appended to the dom are using the init()
		// method. 
		//return container;
	}

	// return init function so that the application manager can run
	// function and start the application.
	return init;

});




define(['appfactory'],function(){

	var AppComp;

	function admin(app){
		console.log(app);
		AppComp = app.Comp();
		app.Manager().setAny('hello',{hello:"world"});

		var admin_component = AppComp.container({
			body: '<h4>Admin Component</h4>'
		});
		return admin_component;
	}

	function client(app){
		console.log(app.Manager().getAll());
		var client_component = AppComp.container({
			body: '<h4>Client Component</h4>'
		});
		return client_component;
	}



	RegisterAppFactoryPlugin({
		id:'appfactoryjs_users',
		admin: admin,	
		client: client
	}); 


});




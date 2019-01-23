define([],function(){
	


	function init(app,config){


		var header = app.Factory.container({
			style: "margin-top:5%;",
			body: "<h2>Welcome, AppfactoryJS</h2>"
		});


		var listOf = [
		"Build web apps quick and effecintly.",
		"Component based elements."
		];

		var list = app.Factory.list({
			list: listOf,
			type: "ul",// bootstrap, ul, ol
			items: function(item,index){
				this.label = item;
				return this;
			}
		});

		var body = app.Factory.container({
			style: "margin-top:5%;",
			body: list
		});

		var layout = app.Layout.newLayout()
			.row()
			.col({md:12},[header])
			.row()
			.col({md:12},[body])
			.build();

		var container = app.Factory.container({
			classes: "container",
			body: layout
		});

		return container;
	}



	return init;

});




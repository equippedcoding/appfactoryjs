AppFactoryStart.main("../../js/config/config.json",{
	paths:{},
	require: ['includes/components/mainComponent']
},function(){


	var ApplicationManager = AppFactory.ApplicationManager,
	    Flags = AppFactory.Flags,
	    ViewCollectionController = AppFactory.ViewCollectionController,
	    MultiView = AppFactory.MultiView,  
	    LayoutManager = AppFactory.LayoutManager,
	    ComponentManager = AppFactory.ComponentManger,
	    Pages = AppFactory.Pages;

	var cm = ComponentManager;
	ApplicationManager.register('main:menu11111',function(obj){
		console.log(obj);
		var container = cm.container({
			body: "<h1>Hello, Mr... Mitchell</h1><button id='what'>PRESS ME PLEASE</button>",//"@main:menu",
			listener: {
				type: "click",
				selector: "#what",
				func: function(obj){
					console.log("Hello");
				}
			}
		});
		container.onAttachListener(function(){
			console.log("I WOKE UP today to you ");
		});
		return container;
	});

	ApplicationManager.register('main:menu1',function(obj){
		var container3 = cm.container({  
			body: "&header",
			template: {
				'hello':'something',
				'hello1':'container',
				'hello2':'MultiView'
			},
			listener: function(){
				$("#he").click(function(){
					console.log("GoodBye");
				});  

			}
		});

		return container3;
	});

	ApplicationManager.register('main:menu',function(obj){
		var container1 = cm.container({
			body: "<h1>Hello1, Mr... Mitchell</h1><button id='what1'>PRESS ME PLEASE</button>",//"@main:menu",
			listener: {
				type: "click",
				selector: "#what1",
				func: function(obj){
					view.render('here2');
				}
			}
		});
		var container2 = cm.container({  
			body: "<h1>Hello2,, Mr... Mitchell</h1><button id='what2'>PRESS ME PLEASE</button>",//"@main:menu",
			listener: {
				type: "click",
				selector: "#what2",
				func: function(obj){
					view.render('here1');
				}
			}
		}); 
		// var container2 = cm.container({  
		// 	body: "&header",
		// 	template: {
		// 		'hello':'something',
		// 		'hello1':'container',
		// 		'hello2':'MultiView'
		// 	},
		// 	listener: function(){
		// 		$("#he").click(function(){
		// 			view.render('here1');
		// 		});

		// 	}
		// });
		var view = new MultiView({routable:true});
		view.newSubView({
			id: 'here1',
			init: true,  
			// route: 'no',
			body: container1
		});
		view.newSubView({  
			id: 'here2',
			// route: 'yes',
			body: container2
		});
		return view;
	});
	ApplicationManager.register('main:header',function(obj){
		return "<h1>GoodBye, Mr. Mitchell</h1>";
	});
	ApplicationManager.register('homeLayout',function(routes){
		console.log(routes);
		var layout = LayoutManager.newLayout({routes:routes})
			.row()
			.col({md:12},['#component'])
			.build();
		return layout;
	});
	ApplicationManager.init(true,function(){
		Pages.loadPages("../js/includes/components/html",{
			'header':'header.html'
		});
		Pages.newPageView({
			baseRoute: 'home',
			init: true,
			routes: {
				'':'homeLayout component main:menu',
				':id':'homeLayout component main:menu',
				'route2/:data': {
					'layout':'homeLayout layoutOne component',
					'transition': {
						to: '',
						from: ''
					}
				}
			}
		});
		//Pages.init();
		//Pages.render('home');
	});


	




});




















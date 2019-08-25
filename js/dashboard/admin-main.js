AppFactoryStart.main(true,"../../config.appfac.js",{
	baseUrl: "./",
	paths:{'initScript':'dashboard/classes/initialization'},
	require: ['appfactory','initScript']
},function(config_appfac,plugins,requireArgs){  

	var app = new ApplicationContextManager();
	app.setApplicationConfiguration(config_appfac);
	app.setApplicationPlugins(plugins);
	app.initializeApplication();


	var Utils = app.Utils;  
	var Plugin = app.getPlugin();
	var Manager = app.getManager();
	var Pages = app.getPages();
	var View = app.getView();
	var Layout = app.getLayout();
	var Component = app.getComp();


	requireArgs[1](false,app,config_appfac,plugins,function(myPlugins){

		Manager.register('main:plugins',function(obj){
			var button = Component.button({
				label: "Add New Plugin",
				classes: "btn btn-dark",
				listener: function(e){
					console.log(e);
				}
			});
			var container = Component.container({
				body: button
			});
			return container;
		});

		Manager.register('main:home:list',function(obj){

			var list = Component.list({

				list: obj.mylist,

				items: function(item,index){
					this.label = mylist[index].name,
					this.badge = {
						value:115,
						id: "badge1"
					},

					this.listener = function(e,self,optional,extra){

						var btn1 = Utils.createElement({
							el: 'button',
							innerHTML: 'close'
						});

						var d = Component.mobileDialog();
						// d.open('hello you',{
						// 	btns: [btn1]
						// });
						var f = "Install Plugin "+mylist[index].name;
						function btnclick(index){
							// console.log(index);
							AppDialog.toggle();
						}
						function onClose(index){
							// console.log('Dialog has closed')
							AppDialog.toggle();
						}
						d.showBottom({onClose: onClose,btn: [f], btnClick: btnclick});

						// fix z-index, toast is getting covered up
						// d.toast('Cloasing Application',5);

						// d.loading({hint:"Please Wait While Loading",type:2});
						// setTimeout(function(){
						// 	d.closeLoading();
						// },5000);
					}

					return this;
				}

			});

			return list;
		});


		Manager.register('main:home',function(obj){
	    	//var plugins = AppManager.config.plugins;

	    	// var dialog = AppComp.dialog();

			var header = Component.container({
				// style: "margin-top:5%;margin-bottom:5%;",
				id: 'header-id',
				classes: 'header',
				body: "<h3>AppFactoryJs - Administration Dashboard</h3>"
			});

			var checkForPlugins = Component.button({
				label: "Add New Plugin",
				classes: "btn btn-dark check-for-plugins",
				// style: "margin-bottom:3%;",
				listener: function(e){

					$.post('http://plugins.appfactoryjs.com/includes/request.php',{
						get_plugins: true
					},function(r,x,f){
						try{
							r = JSON.parse(r);
							//var list = createPluginList(r);
							var object = {mylist: r};
							var meth = Manager.getMethod('main:home:list')(object);
							// console.log(meth);
							AppDialog.setContent({
								title: 'Plugins',
								body: meth
							});
							AppDialog.toggle();

						}catch(e){
							console.error(e);
						}
					});
				}
			});



			var listOfPluginHeader = Component.container({
				body: "<h3>Installed Plugins</h3>"
			});
			var list = Component.list({
				// ul, link, selection, submenu.  link is default
				type: "link" ,

				// Only one item is active at a time 
				// defaut is true, false more than 
				// one item can be active at a time
				selectionSingle: true,

				// If selectionSingle is true this options states that
				// the same element once clicked will remain the selected 
				// item unless another item is selected default is true
				// which means the item can be unselected.
				selectionState: false,

				// Makes the list sortable. !Currently this feature requires JqueryUI
				sortable:{
					icon: "",

					func: function(){
				
					}

				}
			});  

			for(var i=0; i<plugins.length; i++){
				var plugin = plugins[i];
				_runit(i);
				if(plugin.active){

				}
			}

			function _runit(index){
				var plugin = plugins[index];
				list.item({
					label: plugin.name,
					badge: {
						value: (plugin.active) ? "Active" : "InActive",
						id: "badge1"
					},
					meta: {},

					listener: function(e,self,optional,extra){
						AppDialog.setContent({
							title: plugin.name,
							body: "<p>ID: "+plugin.id+"</p><p>URL: "+plugin.url+"</p>"
						});
						AppDialog.toggle();
					}
				});
			}


			var themesHeader = Component.container({
				style:"margin-top:10%;margin-bottom:5%;",
				body:"<h4>Themes</h4>"
			});
			var themesContainer = Component.container();

			for (var i = 0; i < plugins.length; i++) {
				
				if(plugins[i].themes && Array.isArray(plugins[i].themes)){
					
					var themes = plugins[i].themes;

					var listOfThemes = Component.list({

						list: themes,

						item: function(index,item){

							this.label = item.name;


							return this;


						}


					});


					themesContainer.addComponent(listOfThemes);

				}

			}


			var layout = Layout.newLayout()
				.row()
				.col({md:12},[header])
				.row()
				.col({md:12},[checkForPlugins]) 
				.row()
				.col({md:6},[listOfPluginHeader])
				.row()
				.col({md:6},[list])
				.row()
				.col({md:6},[themesHeader])
				.row()
				.col({md:6},[themesContainer])
				.build();


			var view = new View({routable:true});
			view.newSubView({
				id: 'main',
				init: true,  
				//route: 'no',
				body: layout
			});

			// view.newSubView({  
			// 	init:false,
			// 	id: 'here2',
			// 	//route: 'yes',
			// 	body: container2
			// });

			return view;
		});

		function loadupFile(configFile){
			return new Promise(resolve => {
				var rawFile = new XMLHttpRequest();
		    	rawFile.open("GET", configFile, false);
		    	rawFile.send(null); 
		    	resolve(rawFile.responseText)
			});
		} 

		Manager.register('main:menu',function(obj){

			nav = Component.navigation({
				container: 'container',
				type: 2,
				routable: true,
				closable: true
			});
			nav.newSubView({
				init: true,
				id: "what",
				label: 'Home',
				body: "@main:home"
			});

			for(var k=0; k<myPlugins.length; k++){

				nav.newSubView({
					init: false,
					id: myPlugins[k].directory,
					label: myPlugins[k].name,
					body: myPlugins[k].theme.component(app,config_appfac)
				});

			}
			


			/*

			if(plugin.active){
				var conf = {};
				//var s = loadupFile("../../js/plugins/"+plugin.location+"/plugin.config.json");
				//s.then(function(content){
					//console.log(content);
				//	try{
				//		conf = JSON.parse(content);
						//console.log(conf);

						//var admincomp = Plugin.loadAdminPlugin(plugin.id,conf);


				//var admin_active_themes = config_appfac['application']['admin-active-themes'];

				//var client_active_themes = config_appfac['application']['client-active-theme'];
				

				//console.log(Plugin.getRegisteredPlugins());

				//var p1 = Plugin.getRegisteredPlugins();

				//for(var n=0; n<p1.length; i++)

				//admin_active_themes[]
				//console.log(plugin);
				//console.log(conf);

				var a = admin_active_themes[plugin.id];
				var p = null;
				for(var n=0; i<plugin.admin.length; n++){
					var a1 = plugin.admin[n].directory;
					if(a1==a){
						p = plugin.admin[n];
						break;
					}
				}
				if(p!=null){

				}else{
					if(plugin.admin.length > 0){
						p = plugin.admin[0];
					}
				}

				Console(p);
				

				//console.log(admin_active_themes[plugin.id]);
				//console.log(client_active_themes);
						


					
						//console.log(admincomp);
						if(admincomp!=undefined && admincomp!=null){
							var con = buildPluginLayout(admincomp);
							nav.newSubView({
								init: false,
								id: plugin.id,
								label: plugin.name,
								body: con
							});
						}
						

				//	}catch(e){
				//		console.log("Error in plugin json config file: "+plugin.location);
				//		console.log(e);
				//	}
				//});

			}
			*/
			

			function buildPluginLayout(admincomp){
				var client_id = Utils.randomGenerator(8,false);
				var admin_id = Utils.randomGenerator(8,false);
				var v = new View();


				//console.log(admincomp)

				v.newSubView({
					init: true,
					id: client_id,
					body: admincomp.admin
				});
				// v.newSubView({
				// 	init: false,
				// 	id: admin_id,
				// 	body: admincomp.client
				// });

				var clientBtn = Component.button({
					style: "width: 100%",
					classes: "btn btn-dark",
					label: "Client Themes",
					listener: function(){
						v.render(admin_id);
					}
				});
				var adminBtn = Component.button({
					style: "width: 100%",
					classes: "btn btn-dark",
					label: "Admin View",
					listener: function(){
						v.render(client_id);
					}
				});

				var layout = Layout.newLayout()
					.row()
					.col({md:6},[adminBtn])
					//.col({md:6},[clientBtn])
					.row()
					.col({md:12},[v])
					.build();

				var con = Component.container({
					body: layout
				});

				return con;
			}
			nav.build();


			// setTimeout(function(){
			// 	nav.removeSubView(plugin.id);


			// 	setTimeout(function(){

			// 		var c = AppComp.container({
			// 			id: 'theee',
			// 			body: '<h4>Here we go</h4>'
			// 		});
			// 		nav.addSubView({
			// 			init: false,
			// 			id: 'fork',
			// 			label: 'This is A Plugin',
			// 			body: c
			// 		});
			// 	},5000);
			// },3000);

			return nav;
		});
		Manager.register('homeLayout',function(routes){
			//console.log(routes);
			var layout = Layout.newLayout({routes:routes})
				.row()
				.col({md:12},['#component'])
				.build();
			return layout;
		});
		Manager.init(true,function(){
			// AppPages.loadPages("../js/includes/components/html",{
			// 	'header':'header.html'
			// });
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
			//AppPages.init();
			//AppPages.render('home');
		},true);







	});

	// AppManager.register('id',function(obj){});



	
	
		



},AppFactoryStart.NoCapture); 




















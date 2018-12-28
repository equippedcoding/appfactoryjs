AppFactoryStart.main(true,"../../config.appfac.js",{
	baseUrl: "./",
	paths:{},
	require: ['appfactory']
},function(config_appfac,plugins){

	var app = new ApplicationContextManager(config_appfac,plugins);
	app.SetApplicationConfiguration(config_appfac);

	var Utils = app.Utils;  
	var Plugin = app.getPlugin();
	var Manager = app.getManager();
	var Pages = app.getPages();
	var View = app.getView();
	var Layout = app.getLayout();
	var Component = app.getComp();



	
// {
// 	"name":"2 Woke Gurls Media",
// 	"id":"equippedcoding_2woke_gurls",
// 	"url":"https://plugins.appfactoryjs.com/myplugin",
// 	"location":"equippedcoding_2woke_gurls",
// 	"start":"init",
// 	"services":{
// 		"dir":"services/equippedcoding_2woke_gurls"
// 	},
// 	"css":{
// 		"admin":["styles/styles.css"],
// 		"client":[]
// 	},
// 	"active": true
// }

	// AppManager.register('id',function(obj){});

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

		var mylist = obj.mylist;

		var list = Component.list({});

		for(var i=0;i<mylist.length;i++){
			// console.log(mylist[i]);
			_runit(i);
		}

		function _runit(index){
			var gh = mylist[index];
			list.item({

				label: mylist[index].name,
				badge: {
					value:115,
					id: "badge1"
				},

				// set meta data to be tied to list item
				meta: {},

				listener: function(e,self,optional,extra){

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
			});
		}
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

		var layout = Layout.newLayout()
			.row()
			.col({md:12},[header])
			.row()
			.col({md:12},[checkForPlugins]) 
			.row()
			.col({md:6},[listOfPluginHeader])
			.row()
			.col({md:6},[list])
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


		for(var i=0; i<plugins.length; i++){
			// console.log(plugins[i])
			var plugin = plugins[i];
			if(plugin.active){
				var admincomp = Plugin.loadAdminPlugin(plugin.id);
				if(admincomp==undefined || admincomp==null) continue;
				var con = buildPluginLayout(admincomp);
				nav.newSubView({
					init: false,
					id: plugin.id,
					label: plugin.name,
					body: con
				});
			}
		}

		function buildPluginLayout(admincomp){
			var client_id = Utils.randomGenerator(8,false);
			var admin_id = Utils.randomGenerator(8,false);
			var v = new View();
			v.newSubView({
				init: true,
				id: client_id,
				body: admincomp.admin
			});
			v.newSubView({
				init: false,
				id: admin_id,
				body: admincomp.client
			});

			var clientBtn = Component.button({
				style: "width: 100%",
				classes: "btn btn-dark",
				label: "Client View",
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
				.col({md:6},[clientBtn])
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



},AppFactoryStart.NoCapture); 




















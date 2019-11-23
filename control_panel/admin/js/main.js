(function(){ 

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var config = JSON.parse(xhttp.responseText);
		run(config);
    }
};
xhttp.open("GET", "../../config.appfac.js", true);
xhttp.send();


function run(config){




//$.getJSON( "../../config.appfac.js", function( config ) {

	var handler = new Handler();

	handler.setConfig(config);

	var plugins = config['application']['plugins'];

	var pluginRequireURLS = handler.getPluginRequireURLS(plugins);

	config['requirejs-config']['baseUrl'] = '../../';

	//console.log(config['requirejs-config']);
	require.config(config['requirejs-config']);
	requirejs(pluginRequireURLS,function(){
		var app = new ApplicationContextManager(config);
		app.initializeApplication(false);

		var adminThemesArray = [];
		for (var i = 0; i < arguments.length; i++) {
			adminThemesArray.push(arguments[i]);
		}

		////////////////////////////////////////////////////////////////

		var Utils     = app.Utils;  
		var Plugin    = app.getPlugin();
		var Manager   = app.getManager();
		var Pages     = app.getPages();
		var View      = app.getView();
		var Layout    = app.getLayout();
		var Component = app.getComp();

		
		var pluginConfigs = [];
		for (var p in plugins) {
			$.getJSON( "../../plugins/"+p+"/plugin.config.json", function( _plugin_config_ ) {
				pluginConfigs.push(_plugin_config_);
			});
		}


		Manager.register('plugin:selection:form',function(obj){

			var form = app.Factory.form('form_one');

			form.addRadioButtonGroup({
				tag: 'choices',
				label: "Activate Plugin",
				paramName: 'active_plugin',
				name: "activePlugin",
				inline: true,
				buttons: handler.createPluginThemeFormRadioButton(),
				listener: function(obj){
					
				}	
			});

			form.onSubmit({
				//id: "",
				label: "Submit",
				style: "width: 100%;",
				className: "btn btn-success",
				return: 'array'
			},function(obj){
				console.log(obj);
				var v = obj.values['active_plugin']+"|default";
				config['application']['client-active-theme'] = v;
				
				var myChangedConfig = JSON.parse(JSON.stringify(config));
				myChangedConfig['application']['client-active-theme'] = v;
				myChangedConfig['requirejs-config']['baseUrl'] = './';
				$.post('request.php',{
					param:"change_plugin",
					plugin_dir: obj.values['active_plugin'],
					config:JSON.stringify(myChangedConfig,null,4)
				},function(e){
					console.log(e);
				});

			});

			form.build();

			return form;

		});


		Manager.register('plugin:view',function(obj){

			var params = obj.params;

			var n = null;
			for (var i = 0; i < adminThemesArray.length; i++) {
				if(adminThemesArray[i].directory==params.directory){
					n = adminThemesArray[i];
					break;
				}
			}

			var clientThemes = n['client-themes'];
			var adminThemes = n['admin-themes'];

			var component = adminThemes[0].component(app);


			var form = app.Factory.form('form_one');

			var buttons = handler.createPluginsFormRadioButton(n);

			// Radio Buttons
			form.addRadioButtonGroup({
				tag: 'choices',
				label: "Activate Plugin Theme",
				paramName: 'active_plugin',
				name: "activePlugin",
				inline: true,
				//defaultValue: false,
				buttons: buttons,
				listener: function(obj){
					
				}	
			});

			form.onSubmit({
				//id: "",
				label: "Submit",
				style: "width: 100%;",
				className: "btn btn-success",
				return: 'array'
			},function(obj){
				console.log(obj);

			});

			form.build();

			var c2 = app.Factory.container({body:'<h2>App Settings</h2>'});
			var pluginLayout = app.Layout.newLayout()
				.row()
				.col({md:12},c2)
				.row()
				.col({md:12},form)
				.build();

			var c1 = app.Factory.container({body:'<h2>Plugin Settings</h2>'});
			

			var nav = app.Factory.nav({
				//top[default], top-center, top-left, right, left
				//position: "top-center"
			});
			nav.add({
				init: true,
				label: 'Application Settings',
				body: pluginLayout
			});
			nav.add({
				init: false, 
				label: 'Plugin Settings',
				body: component
			});
			nav.build();
			
			
			var header = app.Factory.container({body:'<h2>'+params.name+'</h2>'});


			var layout = app.Layout.newLayout()
				.row()
				.col({md:12},header)
				.row()
				.col({md:12},nav)
				.build();


			return layout;

		});

		var header = Brick.stack().h2("AppfactoryJS Manager Portal").build();

		var homeLayout = Layout.newLayout()
			.row()
			.col({md:12},[header])
			.row()
			.col({md:6},['@plugin:selection:form'])
			.build();

		var comp1 = app.Factory.container({body:homeLayout});

		var view = new app.View({ 
			parent: "#appfac_main_content"
		});

		view.newSubView({
			id: "home",
			init: true,
			body: comp1
		});
		view.newSubView({
			id: "plugin",
			init: false,
			body: '@plugin:view'
		});

		Manager.register('view:main',function(obj){
			return view;
		});

		Manager.register('homeLayout',function(routes){
			var pluginObjArray = [];
			for (var p in plugins) {
				pluginObjArray.push({
					href: '#',
					innerHTML: plugins[p].name,
					className: "appfac_link_btn_plugin"
				});
			}

			function openCloseNavListener(){
				if($('.appfac_sidenav').css('width')=='0px'){
					$('.appfac_sidenav').css('width','200px')
					$('#appfac_main_section').css('marginLeft','200px')
				}else{
					$('.appfac_sidenav').css('width','0')
					$('#appfac_main_section').css('marginLeft','0')
				}
			}

			var openCloseNavButton = app.Factory.button({
				label: "Open/Close",
				style: "margin-bottom:15px;",
				listener: function(e){
					openCloseNavListener();
				}
			});

			var cont = app.Factory.container({
				id:"appfac_main_content",
				body:"@view:main"
			});


			var layout2 = Layout.newLayout({routes:routes})
				.row()
				.col({md:12},[openCloseNavButton])
				.row()
				.col({md:12},cont)
				.build();

			

			var sidenav = Brick.stack()
			.div({
				className: 'appfac_sidenav',
				nest: Brick.stack()
				// a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
				.a({
					href: "javascript:void(0)",
					className: "closebtn",
					innerHTML: "&times;",
				})
				.a({
					href: '#',
					innerHTML: 'Home',
					className: 'appfac_link_btn_home'
				})
				.button({
					innerHTML: 'Plugins',
					className: 'dropdown-btn',
					style: "margin-right:5%;",
					nest: handler.svgDownArrow(app)
				})
				.div({
					className: 'dropdown-container',
					nest: Brick.stack().array('a',pluginObjArray).build()
				}).build()
			})
			.div({
				id: "appfac_main_section",
				nest: Brick.stack().div({
					nest: layout2
				}).build()
			}).build();


			var navContainer = app.Factory.container({
				body: sidenav,
				listener: function(){

					$('.closebtn').click(function(e){
						openCloseNavListener();
					});

					$('.appfac_link_btn_home').click(function(e){

						Manager.get('view:main').render('home');

					});

					$('.appfac_link_btn_plugin').click(function(e){
						var _plugin = null;
						var target = e.currentTarget.innerHTML;
						for(p in plugins){
							if(plugins[p].name==target){
								_plugin = plugins[p];
								break;
							}

						}

						Manager.get('view:main').render('plugin',_plugin);

					});


					//* Loop through all dropdown buttons to toggle between hiding and 
					// showing its dropdown content - This allows the user to have multiple 
					// dropdowns without any conflict */
					var dropdown = document.getElementsByClassName("dropdown-btn");
					var i;

					for (i = 0; i < dropdown.length; i++) {
					  dropdown[i].addEventListener("click", function() {
					    this.classList.toggle("active");
					    var dropdownContent = this.nextElementSibling;
					    if (dropdownContent.style.display === "block") {
					      dropdownContent.style.display = "none";
					    } else {
					      dropdownContent.style.display = "block";
					    }
					  });
					}
				}
			});

			return navContainer;
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

//});// End of jQuery Get call
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


function Handler(){

	this._props_ = {};

	this._props_._config = null;
	this._props_._plugins = null;

}

Handler.prototype = {

	setConfig: function(config){
		this._props_._config = config;
	},

	getConfig: function(){
		return this._props_._config;
	},

	setPlugins: function(plugins){
		this._props_._plugins = plugins;
	},

	getPlugins: function(){
		return this._props_._plugins;
	},

	getPluginRequireURLS: function(plugins){
		var pluginRequireURLS = [];
		for (var p in plugins) {
			pluginRequireURLS.push("plugins/"+p+"/init");
		}
		return pluginRequireURLS;
	},

	createPluginsFormRadioButton: function(n){

		var clientThemes = n['client-themes'];
		var adminThemes = n['admin-themes'];

		var buttons = [];
		var activeThemeName = this._props_._config['application']['client-active-theme'].split("|")[1];
		var activeTheme = null;

		for (var i = 0; i < clientThemes.length; i++) {
			var isChecked = false;
			if(clientThemes[i].directory==activeThemeName){
				activeTheme = clientThemes[i];
				isChecked = true;
			}
			buttons.push({
				label: clientThemes[i].directory,
				value: "active_theme",
				checked: isChecked
			});

		}

		return buttons;

	},

	createPluginThemeFormRadioButton: function(){
		var plugins = this._props_._config['application']['plugins'];
		var buttons = [];
		var activePlugin = this._props_._config['application']['client-active-theme'].split("|")[0];
		


		for(p in plugins){
			isChecked = false;
			if(activePlugin==p){
				isChecked = true;
			}

			buttons.push({
				label: plugins[p].name,
				value: p,
				checked: isChecked
			});

		}

		return buttons;
	},


	svgDownArrow: function(app){
		var p1 =app.Utils.convertStringToHTMLNode(`
		<svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 50%;" width="16" height="16" viewBox="0 0 8 8">
		  <path fill="blue" d="M0 0l4 4 4-4h-8z" transform="translate(0 2)" />
		</svg>`);

		return p1;
	}



};





})();



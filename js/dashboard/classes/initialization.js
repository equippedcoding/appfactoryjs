define(['jquery'],function($){
 

	function init(client,app,config_appfac,jsonPluginConfigs,admin_dashboard_callback){


		var Utils = app.Utils;  
		var Plugin = app.getPlugin();
		var Manager = app.getManager();
		var Pages = app.getPages();
		var View = app.getView();
		var Layout = app.getLayout();
		var Factory = app.getComp();

		var segmented_plugins = {};
		var module_plugins = {};

		var admin_active_themes = config_appfac['application']['admin-active-themes'];

		var client_plugin_config = config_appfac['application']['client-active-theme'];
		var client_active_plugin = client_plugin_config.split("|")[0];
		var client_active_theme = client_plugin_config.split("|")[1];

		var PLUGIN_CLIENT = {};
		var PLUGIN_ADMIN = [];
		var PLUGIN_SEGEMENTS = {};

		var generatedPluginConfigs = Plugin.getRegisteredPlugins();

		var plugins = compilePlugin(jsonPluginConfigs,generatedPluginConfigs);

		// handle segment plugins
		for(var i=0; i<plugins.length; i++){
			var plugin = plugins[i];
			if(plugin.segment!=undefined && plugin.segment!=null && plugin.segment==true){
				PLUGIN_SEGEMENTS[plugin.directory] = plugin;
			}
		}

		if(client){
			LoadActiveClient(PLUGIN_SEGEMENTS);
		}else{

			var adminPulgins = [];

			var c1 = 0;
			var c2 = 0;
			for(var i=0; i<plugins.length; i++){
				var plugin = plugins[i];

				if(plugin.admin==undefined || plugin.admin==null) continue;
				var nonSelected = true;
				for(var n=0; n<plugin.admin.length; n++){
					var adminDir = plugin.admin[n];
					var active_theme = admin_active_themes[adminDir.directory];
					if(active_theme==adminDir){
						adminPulgins.push({
							name: plugin.name,
							directory: plugin.directory,
							theme:plugin.admin[n]
						});
						nonSelected = false;
						break;
					}
				}
				// if theres no active admin theme just select the first one
				if(nonSelected){
					if(plugin.admin.length > 0){
						adminPulgins.push({
							name: plugin.name,
							directory: plugin.directory,
							theme:plugin.admin[0]
						});							
					}
				}
			}

			if(admin_dashboard_callback)
				admin_dashboard_callback(adminPulgins);
		}


		function LoadActiveClient(segmented_plugins){

			if(plugins==null || plugins==undefined || plugins.length==0){
				plugins = compilePlugin(jsonPluginConfigs,generatedPluginConfigs);
			}
			
			for(var i=0; i<plugins.length; i++){
				var plugin = plugins[i];
				if(plugin.directory == client_active_plugin){
					PLUGIN_CLIENT = {
						config: plugin,
						theme: handleClientPlugin(plugin)
					}
					break;
				}
			}

			if(PLUGIN_CLIENT.theme.head!=null && PLUGIN_CLIENT.theme.head!=undefined){
				var activeClientPlugin = PLUGIN_CLIENT.theme;
				if(activeClientPlugin.head && Array.isArray(activeClientPlugin.head )){
					for(var r=0; r<activeClientPlugin.head.length; r++){
						var head = activeClientPlugin.head[r];
						$('head').append(head);
					}					
				}
			}

			var c = PLUGIN_CLIENT.theme.component(app,config_appfac,segmented_plugins);
			if(c!=undefined && c!=null){
				if(c.TYPE!=undefined){
					$('body').append(c.getHtml());
				}
			}
		}


		function handleClientPlugin(plugin){
			// Get client param
			var clientThemes = plugin.client;
			var _activeClientTheme = null;

			// loop through themes and get active theme
			for(var i=0; i<clientThemes.length; i++){
				var themeDir = clientThemes[i].directory;
				if(themeDir == client_active_theme){
					_activeClientTheme = clientThemes[i];
					break;
				}
			}
			return _activeClientTheme;
		}

		function compilePlugin(_jsonPluginConfigs,_generatedPluginConfigs){
			var mergerdPlugins = [];

			for(var i=0; i<_jsonPluginConfigs.length; i++){
				
				// if the json config has more configs just stop merging to prevent throwing errors
				//if((i+1) > _generatedPluginConfigs.length){
					//break;
				//}


				var dir1 = _jsonPluginConfigs[i];

				for (var n = 0; n < _generatedPluginConfigs.length; n++) {
					
					var mConfig = _generatedPluginConfigs[n];

					var dir2 = mConfig;

					if(dir1.directory == dir2.directory){
						// merge client config
						var clientDir1 = dir1.client;
						var clientDir2 = dir2.client;
						for(var m=0; m<clientDir1.length; m++){
							if((m+1) > clientDir2.length){break;}	
							clientDir1[m].component = clientDir2[m].component
						}
						dir1.client = clientDir1;

						//merge admin config
						var adminDir1 = dir1.admin;
						var adminDir2 = dir2.admin;
						for(var m=0; m<adminDir1.length; m++){
							if((m+1) > adminDir2.length){break;}
							adminDir1[m].component = adminDir2[m].component
						}
						dir1.admin = adminDir2;					

						mergerdPlugins[i] = dir1;
					}
				}
			}



			return mergerdPlugins;

		}






































		function returnClient(){

		}
		function returnAdmin(){

			var nonCompiledPlugin = plugin;
			var compiledPlugins = Plugin.getRegisteredPlugins();
			var activeAdminThemeDirectory = admin_active_themes[nonCompiledPlugin.id];

			var compiledPlugin = null;
			var active_admin_theme = null;
			if(activeAdminThemeDirectory!=undefined){
				for (var i = 0; i < compiledPlugins.length; i++) {
					var _compiledPlugin = compiledPlugins[i];
					var compiledPluginDirectory = _compiledPlugin.directory;
					if(compiledPluginDirectory==nonCompiledPlugin.directory){
						compiledPlugin = _compiledPlugin;
						var admin = _compiledPlugin.admin;
						for (var n = 0; n < admin.length; n++) {
							var adminDirectory = admin[n].directory;
							if(activeAdminThemeDirectory==adminDirectory){
								active_admin_theme = admin[n]
								break;
							}

						}

					}
				}
			}else{
				for (var i = 0; i < compiledPlugins.length; i++) {
					if(compiledPlugins[i].directory == nonCompiledPlugin.id){
						compiledPlugin = compiledPlugins[i];
					}
				}
				if(compiledPlugin!=null && compiledPlugin.admin.length > 0){
					active_admin_theme = compiledPlugin.admin[0];
				}
			}

			// merge the compiled config with the standered config
			for(var p in plugin){
				if(p=="client" || p=="admin"){
					for(var r=0; r<plugin[p].length; r++){
						
						var dir1 = compiledPlugin[p][r].directory;
						var dir2 = plugin[p][r].directory;
						if(dir1 == dir2){
							var obj = compiledPlugin[p][r].component;
							plugin[p][r]['component'] = obj;
						}
					}
				}
			}

			if(plugin.segment!=undefined && plugin.segment!=null){
				if(plugin.segment==true){
					segmented_plugins[plugin.directory] = {
						pluginConfig: compiledPlugin,
						activeAdminComponent: active_admin_theme
					}
				}else{
					module_plugins[plugin.directory] = {
						pluginConfig: compiledPlugin,
						activeAdminComponent: active_admin_theme
					};
				}
			}else{
				module_plugins[plugin.directory] = {
					pluginConfig: compiledPlugin,
					activeAdminComponent: active_admin_theme
				};
			}

			var activeClientPluginDirectory = null;
			if(client_active_theme.includes("|")){
				activeClientPluginDirectory = client_active_theme.split('|')[1];
			}else if(client_active_theme.includes(" ")){
				activeClientPluginDirectory = client_active_theme.split(' ')[1];
			}

			

			if(activeClientPluginDirectory==plugin.directory){
				activeClientPlugin['config'] = plugin;
				var activeClientThemeDirectory = client_active_theme.split('|')[0];
				
				var activeClientThemeDirectory = null;
				if(client_active_theme.includes("|")){
					activeClientThemeDirectory = client_active_theme.split('|')[0];
				}else if(client_active_theme.includes(" ")){
					activeClientThemeDirectory = client_active_theme.split(' ')[0];
				}
				

				for(var h=0; h<compiledPlugin.client.length; h++){
					if(activeClientThemeDirectory == plugin.client[h].directory){
						activeClientPlugin['theme'] = plugin.client[h];
					}
				}
			}

		}



	}


	return init;

});


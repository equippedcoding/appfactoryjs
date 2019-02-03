define(['jquery'],function($){


	function init(client,app,config_appfac,plugins){

		console.log(plugins);


		var Utils = app.Utils;  
		var Plugin = app.getPlugin();
		var Manager = app.getManager();
		var Pages = app.getPages();
		var View = app.getView();
		var Layout = app.getLayout();
		var Component = app.getComp();

		var segmented_plugins = {};
		var module_plugins = {};
		var admin_active_themes = config_appfac['application']['admin-active-themes'];
		var client_active_theme = config_appfac['application']['client-active-theme'];

		var activeClientPlugin = {};

		for(var i=0; i<plugins.length; i++){
			//console.log(plugins[i])
			var plugin = plugins[i];
			dostuff(plugin);
		}


		if(client){
			for(var r=0; r<activeClientPlugin.theme.head.length; r++){
				var head = activeClientPlugin.theme.head[r];
				$('head').append(head);
			}

			var c = activeClientPlugin.theme.component(app,config_appfac,segmented_plugins);
			if(c!=undefined && c!=null){
				if(c.TYPE!=undefined){
					$('body').append(c.getHtml());
				}
			}
		}else{

		}


		function dostuff(plugin){
			
			var nonCompiledPlugin = plugin;
			var compiledPlugins = Plugin.getRegisteredPlugins();
			var activeAdminThemeDirectory = admin_active_themes[nonCompiledPlugin.id];

			var compiledPlugin = null;
			var active_admin_theme = null;
			if(activeAdminThemeDirectory!=undefined){
				for (var i = 0; i < compiledPlugins.length; i++) {
					var _compiledPlugin = compiledPlugins[i];
					var compiledPluginDirectory = compiledPlugins[i].directory;
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

			//console.log(compiledPlugin);
			//console.log(active_admin_theme);

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

			var activeClientPluginDirectory = client_active_theme.split('|')[1];

			//console.log(activeClientPluginDirectory);
			if(activeClientPluginDirectory==plugin.directory){
				activeClientPlugin['config'] = plugin;
				var activeClientThemeDirectory = client_active_theme.split('|')[0];

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


/* This file is auto generated  */
define(['appfactory'
	 './admin/themes/default/theme_interface'
	,"./client/themes/default/theme_interface"]
	,function(appfac,adminInterface,eod34BWyyjxcs){

	var plugin = {
		directory:'default',
		"admin-themes": [
			{
		        "directory": "default",
		        "start": "theme_interface",
				"component":adminInterface,
			}
		],
		"client-themes": [
		    {
		        "directory": "default",
		        "start": "theme_interface",
		        "component": eod34BWyyjxcs
		    }
		]
	}; 


	RegisterAppFactoryPlugin(plugin); 

	return plugin;

});

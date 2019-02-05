/* This file is auto generated  */
define(["appfactory",
	 './admin/themes/default/theme_interface'
	,"./client/themes/default/theme_interface"]
	,function(app,adminInterface,eod34BWyyjxcs){


	RegisterAppFactoryPlugin({
		directory:'default',
		admin: [
		{
	        "directory": "default",
	        "start": "theme_interface",
			"component":adminInterface,
		}
		],
		client: [
    {
        "directory": "default",
        "start": "theme_interface",
        "component": eod34BWyyjxcs
    }
]
	}); 

});

/* This file is auto generated  */
define(["appfactory",
	 './admin/admin_interface'
	,"./themes/theme/theme_interface"]
	,function(app,adminInterface,eod34BWyyjxcs){


	RegisterAppFactoryPlugin({
		id:'_default',
		admin: adminInterface,
		themes: [
    {
        "directory": "theme",
        "start": "theme_interface",
        "component": eod34BWyyjxcs
    }
]
	}); 

});

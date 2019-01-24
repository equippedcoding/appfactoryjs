/* You do not need to edit this file, Except to add
 * application variable and configuration options.
 * The prefered way of creating client side views
 * is through plugin themes. From the command line
 * with-in the root directory of your project 
 * issue the command 
 * appfactory plugin --theme "project_directory" --name "name_of_theme"
 */
AppFactoryStart.main(false,"config.appfac.js",{
	baseUrl: "./",
	paths:{},
	require: ['appfactory']
},function(config,plugins){   

	var app = new ApplicationContextManager(true,config,plugins);
	app.initializeApplication();


},AppFactoryStart.NoCapture); 








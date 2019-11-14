/**
* @overview AppFactoryJS is a javscript framework tha can be including as a single 
* js file (but with limitations) or as a whole application framework. 
* The application is incapsulated around the The {@link ApplicationContextManager} 
* which is a single object that manages the application and application state.<br>
* AppFactoryJS consist of a client app and the admin dashboard. To add modular 
* components for users to add to their application.
*  
*
* 
*
*    
*
* 
*
* @requires jQuery
* @see {@link https://jquery.com/}
* @requires BackboneJS
* @see {@link http://backbonejs.org/}
* @requires Bootstrap
* @see {@link http://bootstrap.org/} 
*
* @author Joseph Mitchell
* @license BSD-2-Clause. 
* @version 0.0.1   
*/
(function (root, factory) {             
	/*global define*/
	
	
	
	
	
	
	


	if (typeof define === 'function' && define.amd) {
		
		define(['jquery','backbone'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		
		module.exports = factory(require('jquery'));
	} else {
		
		factory(jQuery);
	}	
}(this, function ($) {    













































/* Global Variables */ 

var GL_COMPONENTS = [],
    GL_TYPES = {view:"v",component:"c",layout:"l"};  



/** @exports Flags
* Application constants
* 
*/
var Flags = Object.freeze({
	/**
	* Type
	*/
	Type: {view:"v",component:"c",layout:"l"},

	/**
	* Component
	*/
	Component: "comp",

	/**
	* Method
	*/
	Method: "meth"
});


/* Global Functions */
function GL_RegisterListenerCallback(obj,self,id,moreData){

}

/** @exports AppFactoryStarter
* @classdesc !important - This module is only apart of the Full Application
* @class
* @constructor
* @tutorial 01-GettingStarted
*/
var AppFactoryStarter = {

	/**
	* Starts the application life cycle. Must be called before 
	* running any application code.
	* @param {String} configFile - Path and file name of the configuration json file
	* @param {Object} extra - RequireJS users configuration
	* @param {Function} callback - Run application method
	* @param {String} basepath - 
	*/
	main: function(configFile,extra,callback,basepath){}
};



var AppFactoryManagerTypes = [
	"ApplicationManager",
	"StateManager",
	"SessionManager",
	"ComponentManager",
	"LayoutManager",
	"ViewManager"
];

/* AppFactoryManager */
function AppFactoryManager(type){
	this._appfactory_manager = {
		_type: type
	};

	this.getManagerTypes = function(){
		return AppFactoryManagerTypes;
	};

}
AppFactoryManager.prototype = {};



/** @exports ApplicationManager
* @classdesc The ApplicationManager runs the application life cycle.
* @class
* @constructor
* @tutorial GettingStarted
*/
function ApplicationManager(applicationContextManager,stateManager,sessionManager){
	_.extend(this, new AppFactoryManager('ApplicationManager'));
	var rootElement = document.createElement('div');
	rootElement.id = "root-element";
	
	this._stateManager = stateManager;
	this._sessionManager = sessionManager;
	this._application_manager = {
		_any: {},
		_methods: {},
		_components: [],
		_componentElements: {},
		_routes: {},
		_root_element: rootElement,
		_files: {},
		_basePath: "",
		_file_contents: {}
	}

}
ApplicationManager.prototype = {


	config: {},

	/**
	* Starts the application life cycle. Must be called before 
	* running any application code.
	*/
	init: function(callback,param){
		var self = this;
		if(typeof callback === "function"){
			ApplicationManager_start(callback,self);
		}else if(typeof callback === "boolean" && callback==true){
			ApplicationManager_start(param,self);
			pages.init();
			pages.render();
		}else if(Utils.isNull(callback)){
			ApplicationManager_start(function(){},self);
		}
	},  

	/**
	*
	*/
	register: function(id,method){
		if(!Utils.isNull(method)){
			this._application_manager._methods[id] = method;
		}else{
			if(id.TYPE){
				this._application_manager._components.push({id: id.getId(), component: id});
			}else{
				console.error("Element not registered, Must be a component");
			}
		}
	},

	/**
	*
	*/
	retrieve: function(id,flag){
		if(flag == Flags.Component){
			return _g();
		}else if(Flags.Method){
			return this._application_manager._methods[id];
		}else{
			return _g()
		}
		function _g(){
			var r = null;
			for(var i=0;i<this._application_manager._components.length;i++){
				var t = this._application_manager._components[i];
				if(t.id == id.getId()){
					r = this._application_manager._components[i];
					break;
				}
			}
			return r;
		}
	},

	/**
	* Get all saved objects.
	*/
	getAll: function(){
		return this._application_manager._any;
	},

	/**
	*
	*/
	setAny: function(id,any){
		this._application_manager._any[id] = any;
	},

	/**
	*
	*/
	getAny: function(id){
		var any = this._application_manager._any[id];
		if(Utils.isNull(any)){
			console.error("No object found for: "+id);
		}
		return any;
	},	

	/**
	*
	*/
	getComponents: function(){
		return this._application_manager._components;
	},

	
	getMethod: function(id,params){
		var method = this._application_manager._methods[id];
		if(Utils.isNull(method)){
			console.error("Method: "+id+" does not exist");
		}
		return method;
	},

	run: function(id,params){
		var method = this._application_manager._methods[id];
		if(Utils.isNull(method)){
			console.error("Method: "+id+" does not exist");
		}
		var component = method(params);
		if(Utils.isNull(component)){
			console.error("Component: "+id+" is null");
		}
		return component;
	},

	get: function(id,params){
		var method = this._application_manager._methods[id];
		if(Utils.isNull(method)){
			console.error("Method: "+id+" does not exist");
		}
		var component = method(params);
		if(Utils.isNull(component)){
			console.error("Component: "+id+" is null");
		}
		return component;
	},

	getComponent: function(id){
		var components = this._application_manager._components;
		var component = null;
		for(var i=0; i<components.length; i++){
			if(components[i].id == id){
				component = components[i];
				break;
			}
		}
		if(component==null){
			console.error("Component: "+id+" not found");
		}
		return component;
	},

	setComponent: function(tag){
		this._application_manager._componentElements[tag];
	},

	/**
	*
	*/
	getRootElement: function(){
		return this._application_manager._root_element;
	},

	getLoadedFileContents: function(alias){
		return this._application_manager._file_contents[alias];
	},

	templateParser: function(htmlString,replacements){
		return ApplicationManager_templateParser(htmlString,replacements,this);
	},

	setFileContents: function(alias,content){
		this._application_manager._file_contents[alias] = content;
	},
	getFileContents: function(){
		this._application_manager._file_contents;
	},

	getRootElement: function(){
		return this._application_manager._root_element;
	}


};





/** @exports SessionManager
* @classdesc The SessionManager handles user session.
* @class
* @constructor
*/
function SessionManager(){
	_.extend(this, new AppFactoryManager('SessionManager'));

}
SessionManager.prototype = {};




/** @exports StateManager
* @classdesc The SessionManager handles the state of the application.
* @class
* @constructor
*/
function StateManager(){
	_.extend(this, new AppFactoryManager('StateManager'));
	
	this._state_manager = {
		_routes: {},
		_basePath: {},
		_router: null,
		_routerConfig: null,
		_route_map: {},

		_map_transition: {},
		_map_layout: {}
	};

}

StateManager.prototype = {
	mapRoute: function(route,layout){

		
		
		

		if(route=="") route = "_NOT_SET_";
		this._state_manager._map_layout[route] = layout;

	},
	
	getMapRoute: function(route,mapper){
		if(route=="") route = "_NOT_SET_";
		var layout = this._state_manager._map_layout[route];

		if(Utils.isNull(layout)) return null;
		layout = layout.split(' ');
		
		layout.shift();
		layout = layout.join(" ");
		layout = layout.split(",");
		var component = "";
		var breakNext = false;
		for (var i = 0; i<layout.length; i++) {
			var g = layout[i].split(" "),
			    h = null,
			    m = null;
			for (var n = 0; n < g.length; n++) {
				if(g[n].length > 0){
					m = g[n];
					h = g[n+1];
					break;
				}
			}

			if(m==mapper || m==mapper.substr(1)){
				component = h
			}
		}

		return component;
	},
	
	mapTransition: function(route,transition){
		this._state_manager._map_transition[route] = transition;
	},
	getMapTransition: function(route){
		this._state_manager._map_transition[route];
	},

	/**
	* 
	*/
	go: function(path,trigger,body){
		
		if(Utils.isNull(trigger)){
			trigger = true;
		}
		this.getRouter().navigate(path, {trigger: trigger});
	},

	/**
	* 
	*/
	addRoute: function(route,method){
		this._state_manager._routes[route] = method;  
	},

	/**
	* 
	*/
	buildRoutes: function(){
		return StateManager_buidRoutes(this);
	},

	getRouterConfig: function(){
		return this._state_manager._routerConfig;
	},

	/**
	* 
	*/
	getRouter: function(){
		return this._state_manager._router;
	}
};




/** @exports ApplicationExtensions
* @classdesc A segment is a plugin thats can be tied to another plugin
* but cannot be active by its self. In the plugin.config.json specify
* the option segment:true. This allows for this plugin to be loaded before
* non-segmented plugins. The segmented plugin is retreived by calling 
* segments.get("plugin_name|plugin_theme")
* @class
* @constructor
*/
function ApplicationExtensions(){
	this._props_ = {};
}
ApplicationExtensions.prototype = {

	set: function(extensions){
		this._props_._segments = extensions;
	},


	/**
	*
	* return {Object} - Plugin segment
	*/
	get: function(extension){
		var segments = this._props_._segments;
		var plugin = segment.split("|")[0];
		var theme = segment.split("|")[1];
		var client = null;

		if(segments[plugin]){
			var themes = segments[plugin].client;
			for(var i=0; i<themes.length; i++){
				if(themes[i].directory==theme){
					client = themes[i];
					break;
				}
			}


		}

		return client;
	}

};




/** @exports PluginManager
* @classdesc The PluginManager creates plugins for the AppfactoryJS application.
* @class
* @constructor
*/ 
function ApplicationPlugin(){
	this.plugins = [];
}
ApplicationPlugin.prototype = {

	getRegisteredPlugins: function(){
		return gl_app_plugins;
	},

	registerPlugin: function(plugin){
		this.plugins.push(plugin);
	},

	loadPlugin: function(pluginId){
		var plugin = null

		console.log(gl_app_plugins);
		for(var i=0; i<gl_app_plugins.length; i++){
			var p = gl_app_plugins[i].id;
			if(p==pluginId){
				plugin = gl_app_plugins[i];
				break;
			}
		}
		return plugin;	
	},

	loadClientPlugin: function(pluginId){
		var plugin = this.loadPlugin(pluginId);
		if(plugin==null) return null;

		var admin = plugin.admin(gl_applicationContextManager);
		var client = plugin.client(gl_applicationContextManager);

		return client;
	},

	
	loadAdminPlugin: function(pluginId,pluginConfig,mainConfig){

		
		
		

		var plugin = this.loadPlugin(pluginId);
		if(plugin==null) return null;

		

		var admin = plugin.admin(gl_applicationContextManager,config);
		var client = plugin.client(gl_applicationContextManager,config);


		var adminThemes = plugin.admin;
		var pluginThemes = plugin.themes;


		var adminTheme = null;
		if(config.adminTheme!=null && config.adminTheme!=undefined){
			var activeTheme = config.adminTheme;
			for(var i=0; i<config.admin.length; i++){
				var theme = config.admin[i];
				if(theme==activeTheme){
					adminTheme = theme;
					break;
				}
			}
		}else{
			if(adminThemes.length > 0){
				adminTheme = adminThemes[0];
			}
		}
		if(adminTheme==null){
			var comp = new ContainerComponent({
				body: "<h4>No Plugin could be loaded</h4>"
			});

			adminTheme = comp;
		}

		
		
		
		

		
		
		
		
		
		
				
		
		

		


		return {
			admin: adminTheme,
			client: client,
			themes: themes
		}
	}

};


/* Components */

/** @exports ComponentManager
* @classdesc The ComponentManager is the top component that every other component inherits from.
* @class
* @constructor
*/ 
function ComponentManager(type,context){
	_.extend(this, new AppFactoryManager('ComponentManager'));
	context.TYPE = type;
	var self = this;
	this._props_ = {
		_application_manager: applicationManager,
		_id: "c"+Utils.randomGenerator(16,false),
		_componentName: type,
		_extensionObject: [],
		_events: [],
		_body: null,

		_isEventsActive: false,
		_uniqueId: "id_"+Utils.randomGenerator(12,false),

		
		
		
		_args: null,
		_object_config: null,
		_routes: null,
		_elements: {
			_fragment: document.createDocumentFragment()
		},
		_dom_events:{
			_addToDOMEvent:[],
			_addToDOMEventOnce: null,
			_addToDOMCount: 0,
			_removeFromDOMEvent:[],
			_removeFromDOMEventOnce: null,
			_removeFromDOMCount: 0,
		}
	};


	/**
	* onAttachOnceListener
	*/
	this.onAttachOnceListener = function(callback){ 
		this._props_._dom_events._addToDOMEventOnce = callback; 
	};

	/**
	* onDetachOnceListener
	*/
	this.onDetachOnceListener = function(callback){ 
		this._props_._dom_events._removeFromDOMEventOnce = callback;
	};

	/**
	* onAttachListener
	*/
	this.onAttachListener = function(callback){ 
		var len = this._props_._dom_events._addToDOMEvent.length;
		this._props_._dom_events._addToDOMEvent[len] = callback; 
	};

	/**
	* onDetachListener
	*/
	this.onDetachListener = function(callback){
		var len = this._props_._dom_events._removeFromDOMEvent.length; 
		this._props_._dom_events._removeFromDOMEvent[len] = callback;
	};


	/**
	* setParent
	*/
	this.setParent = function(parent){
		this._props_._parent = parent;
	};


	/**
	* getParent
	*/
	this.getParent = function(){
		return this._props_._parent;
	};

	/**
	* SetId
	*/
	this.setId = function(id){
		this._props_._id = id;
	};

	/**
	* Get the unique id of this component. If specifiedId
	* is provided then that is returned.
	*/
	this.getId = function(specifiedId){
		if(!Utils.isNull(specifiedId) && specifiedId==true)
			return this._props_._id;
		else
			return this._props_._id;
	};

	this.isAttached = function(){
		return this._props_._is_attached;
	},


	/**
	* initializeListeners
	*/
	this.initializeListeners = function(){
		AppComponent_initializeListeners(this,self);
	}; 
	this.deInitializeListener = function(){
		AppComponent_deInitializeListener(this,self);
	};

	/**
	* getHtml
	*/
	this.getHtml = function(route){
		return AppComponent_getHtml(this,route);
	};

	this.append = function(){
		$(selector).append(this.getHtml());
	};

}
ComponentManager.prototype = {};








/** @exports Pages
* @classdesc handles the routing and mapping between component and routes 
* @class
* @constructor
*/
function Pages(){
	_.extend(this, new AppFactoryManager('Pages'));
	this._props_ = {
		_container_id: "app-factory-container",
		_collection: null,
		_routes: null
	};
	var containerDiv = document.createElement('div');
	containerDiv.id = this._props_._container_id;
	document.body.appendChild(containerDiv);

	
	

}

Pages.prototype = {

	/**
	*
	*
	*/
	newPageView: function(obj){
		Pages_newPageView(obj,this);
	}, 

	/**
	*
	*
	*/
	init: function(){
		stateManager.buildRoutes();
	},

	/**
	* 
	*
	*/
	render: function(route,params){
		if(Utils.isNull(route) && !Utils.isNull(this._props_._initial_view)){
			route = this._props_._initial_view.baseRoute;
		}
		stateManager.go(route,params);
	},


	/**
	*
	*
	*/
	setRoute: function(route){
		this._props_._routes = route;
	},

	getInitView: function(){
		return this._props_._initial_view;
	},


	/**
	*
	*
	*/
	getRoute: function(){
		return this._props_._routes;
	},


	/**
	*
	*
	*/
	loadPages: function(basePath,files){
		loadUpFiles(basePath,files,this);
	}
};

var ViewsHolder = [];


/** @exports ViewManager
* @classdesc A component that handles multiple components with in one view.
* @class
* @constructor
*/
function ViewManager(opt){
	

	
	
	_.extend(this, 
		new AppFactoryManager('ViewManager'), 
		new ComponentManager(Flags.Type.component,this),
		
		new EventManager()
	);
	applicationManager.register(this);

	var self = this;
	self._props_._container = document.createElement('div');
	self._props_._container.id = self._props_._id;


	if(Utils.isNull(opt)){ opt = {}; }
	if(Utils.isNull(opt.routable)){
		opt.routable = false;
	}
	
	
	opt.routable = false;
	self._props_._is_routable = opt.routable;
	self._props_._containers = new ContainerComponent();
	self._props_._active_view = null;
	self._props_._views_objects = [];
	self._props_._options = opt;

	ViewsHolder.push(self);

	

	
	self.getHtml = function(){

		
		
		var objs = self._props_._views_objects;
		var obj = null;
		for (var i = 0; i < objs.length; i++) {
			var init = objs[i].init;
			if(init){
				obj = objs[i];
				break;
			}
		}

		if(obj){
			var trigger = false;
			self._props_._active_view = obj;
			var container = buildBody(obj,self);
			self._props_._containers.addComponent(container,true);
			if(opt.routable){
				var route = getNewRoute(obj.id,self);
				stateManager.go(route,trigger);
			}
		}

		return self._props_._containers.getHtml();

		
	};
}
ViewManager.prototype = {


	/**
	* Render the view
	*
	*
	* @param {String} - (required) Id of the view to render.
	* @param {Component} - (optional) component body to add.
	* @param {Boolean} - (optional) When a body is added it will not replace the
	* @param {Boolean} - trigger the router
	* initial body but if this is set to true the component body supplied will
	* replace the initial body.
	* @param {Boolean} (optional) If this ViewManager is router capable then this
	* will trigger it route.
	*/
	
	

	
	
	
	
	

	render: function(id,opts){
		ViewManager_render(id,opts,this);

		
		
		
		
	},

	/**
	*
	*/
	getRouteFromId: function(id){
		return MultiView_getRouteFromId(id,this);
	},

	/**
	*
	*/
	getCurrentViewInRoute: function(){
		return MultiView_getCurrentViewInRoute(this);
	},

	/**
	* @return {Component} 
	*/
	getCurrentView: function(){
		return this._props_._current_view;
	},

	/**
	*
	*/
	getView: function(id){
		return MultiView_getView(id,this);
	},


		
		
	/**
	* Add new view to this ViewManager
	*/
	newSubView: function(opts){
		var self = this;
		var opt = self._props_._options;
		/*
		if(opt.routable==true){
			if(Utils.isNull(opts.route)){
				opts.route = opts.id;
			}
			var v = buildBody(opts,self);
			if(!Utils.isNull(v) && v.TYPE && v.TYPE == "v"){

			}
		}
		*/
		if(opts.id){
			for (var i = 0; i < self._props_._views_objects.length; i++) {
				if(opts.id == self._props_._views_objects[i].id){
					console.error("Theres already a View Component with the id: "+opts.id);
					break;
				}
			}
		}else{ console.error("View Component does not contain an id"); }

		self._props_._views_objects.push(opts); 
		if(opts.init!=undefined && opts.init==true){
			var b = buildBody(opts,self);
			self._props_._containers.addComponent(b, true);
		}
		return this;
	},

	/** Checks if this view is routable.
	* 
	* @return {Boolean} - Is this view routable
	*/
	isRoutable: function(){
		return this._props_._is_routable;
	}



};







/** @exports LayoutManager
* @classdesc A compoment that handles the layout of components.
* @class
* @constructor
*/
function LayoutManager(){
	
	_.extend(this, new AppFactoryManager('LayoutManager'));

}
LayoutManager.prototype = {

	/**
	* Layout Component
	* @return {AppLayout} 
	* @see AppLayout
	*/
	newLayout: function(obj){
		return new AppLayout(obj,this.Application);
	}
};




/** @exports AppLayout
* @classdesc The layout component that is returned by the LayoutManager.newLayout().
* @class
* @constructor
*/
function AppLayout(obj){
	var self = this;
	_.extend(this, 
		new AppFactoryManager('AppLayout'), 
		new ComponentManager(Flags.Type.layout,this), 
		new EventManager(this)
	);
	applicationManager.register(this);


	
	obj = (Utils.isNull(obj)) ? {} : obj;
	
	this.ID = "d-"+Utils.randomGenerator(12,false);
	
	
	this._html = "";
	this._custHtml = [];
	this._fragment = null;
	this._id = (Utils.isNull(obj.id)) ? "VL-"+Utils.randomGenerator(24,false) : obj.id;

	this._typeHolder = {
		typeComponent: [],
		typeView: [],
		typeLayout: []
	};

	this._columns = [];
	this._rows = [];

	this._build_order = [];

	this._CustomizerModel = Backbone.Model.extend({
		'attr': "hello"
	});
	this._CustomizerCollection = Backbone.Collection.extend();

	this._buildNodes = [];

	this._container_row = 0;
	this._container_col = [];

	var className = (Utils.isNull(obj.className)) ? null : obj.className;
	if(className==null){
		(Utils.isNull(obj.classes)) ? "" : obj.classes;
	}

	var styles = (Utils.isNull(obj.style)) ? null : obj.style;
	if(styles==null){
		(Utils.isNull(obj.styles)) ? "" : obj.styles;
	}

	this._props_ = {
		_id: this._id,
		_uniqueId: "id_"+Utils.randomGenerator(12,false),
		_isEventsActive: false,
		_events: [],
		_routes: obj.routes,
		_statemananger_route: obj.routes,
		_layout_container: {},
		_current_row_id: "default",
		columns: [],
		rows: [],
		_parent: null,
		_elements:{
			_fragment: document.createDocumentFragment()
		},
		_extensionObject: [],
		_fragmentParent:null,
		_super_view_id: null,
		_top_row : {
			_id: this._id,
			_classes: className,
			_styles: styles
		},
		_dom_events:{
			_addToDOMEvent:[],
			_addToDOMEventOnce: null,
			_addToDOMCount: 0,
			_removeFromDOMEvent:[],
			_removeFromDOMEventOnce: null,
			_removeFromDOMCount: 0,
		}
	};

	this._props_._layout_container["default"] = {
		type: "row",
		columns: []
	}

	this._reset = 0;

	

	this.getHtml = function(){
		return AppComponent_getHtml_layout_fragment(self);
	};

}
AppLayout.prototype = {
		/**
	* Adds a bootstrap columne class div element to the layout.
	* @param {Object} columns - lg,md,sm,xs offset
	* @param {Array} arrayOfItems - an array of ViewComponentControllers, ViewCollectionControllers and/or other ViewLayoutControllers
	* @param {Object} elementProperties - Add classes or id to this column
	* @return {objec} this
	*/
	col: function(columns,arrayOfItems,obj){
		AppLayout_col(columns,arrayOfItems,obj,this);
		return this;
	},

	/**
	* Adds a bootstrap row class div element to the layout.
	* @return {objec} this
	*/
	row: function(obj){
		var currentRow = Utils.randomGenerator(9,false);
		this._props_._current_row_id = currentRow;
		this._props_._layout_container[currentRow] = {
			type: "row",
			obj: obj,
			columns: []
		};
		return this;
	},

	/**
	* Builds the layout. must be called before layout can be appended to the document.
	*/
	build: function(){
		_.extend(this,Backbone.Events);
		AppLayout_build(this);
		return this;
	}
};




/** @exports ComponentFactory
* @classdesc A top-level component that handles all other components except ViewManager component and AppLayout component.
* @class
* @constructor
*/
function ComponentFactory(){
	
	

}
ComponentFactory.prototype = {

	/**
	*
	*/
	stub: function(opts){},

	/**
	* Create a new button component
	*/
	button: function(opts){
		return new ButtonComponent(opts);
	},

	/**
	* A Container Component is a special type of component
	* It contain other components. 
	*/
	container: function(obj){
		return new ContainerComponent(obj);
	},

	/**
	* Returns a BrickComponent, is also accessable through the global Brick method. 
	*/
	brick: function(obj){
		return new BrickComponent(obj);
	},

	/**
	* Create a nvaigaiton component
	*/
	navigation: function(obj){
		return new NavigationComponent(obj);
	},


	nav: function(opts){
		return new NavComponent(opts);
	},

	/**
	* Returns a FormComponent
	*/
	form: function(obj){
		return new FormComponent(obj);
	},

	/**
	* fileUploader
	*/
	fileUploader: function(obj){
		return new FileUploaderComponent(obj);
	},

	/**
	* Create a new list component
	*/
	list: function(opts){
		return new ListComponent(opts);
	},

	/**
	* dialog
	*/
	dialog: function(opts){
		return new ModalComponent(opts);
	},

	/**
	* table
	*/
	table: function(opts){
		return new TableComponent(opts);
	},

	/**
	* mobileDialog
	*/
	mobileDialog: function(obj){
		return ModalDialogComponent_mobile(obj,this);
	},

	/**
	* Image Component
	*/
	img: function(opts){
		return new ImageComponent(opts);
	}

};




function ImageComponent(opts){

	opts = (Utils.isNull(opts)) ? {} : opts;
	_.extend(this,
		new AppFactoryManager('ImageComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);

	var createElement = Utils.createElement;
	var isNull = Utils.isNull;
	var self = this;
	applicationManager.register(this);
	
	applicationManager.setComponent(this);

	

	var frag = document.createDocumentFragment();
	var img = document.createElement('img');
	img.id = this.ID;
	img.className = (Utils.isNull(opts.className)) ? "" : opts.className; 
	img.style = (Utils.isNull(opts.style)) ? "" : opts.style; 
	img.src = opts.src;
	if(opts.width) img.width = opts.width;
	if(opts.height) img.height = opts.height;

	frag.appendChild(img);

	self._props_._fragment = frag;

	this.getHtml = function(){
		return this._props_._fragment.cloneNode(true);
	};

}
ImageComponent.prototype = {

};



/** @exports NavComponent
* @classdesc Creates a Nav component
* @class
* @constructor
*/
function NavComponent(opts){
	opts = (Utils.isNull(opts)) ? {} : opts;
	_.extend(this,
		new AppFactoryManager('NavComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);

	var createElement = Utils.createElement;
	var isNull = Utils.isNull;
	var self = this;
	applicationManager.register(this);
	
	applicationManager.setComponent(this);

	
	
	
	


	var view = new ViewManager();
	var frag = document.createDocumentFragment();

	self._props_._position_class = "";
	self._props_._active_item = "";
	self._props_._elements = {
		_view: view,
		_ul: null,
		_navbar_container: new ContainerComponent(), 
		_content_container: new ContainerComponent(), 
		_container: new ContainerComponent({ id:self.getId() }), 
		_fragment: frag,
		_layout: null
	};

	
	
	
	
	
	
	
	

	var positionTopNavbarLayout = {md:12};
	var positionTopContentLayout = {md:12};

	var positionLeftNavbarLayout = {md:3};
	var positionLeftContentLayout = {md:9};

	var positionRightNavbarLayout = {md:3};
	var positionRightContentLayout = {md:9};

	var layoutPosition = "";
	var position = "top";
	if(!isNull(opts.position)){
		position = opts.position;
	}

	if(position=="top"){
		layoutPosition = "top";
		self._props_._position_class = "";
		setPositionTopLayout();

	}else if(position == "top-left"){
		layoutPosition = "top";
		self._props_._position_class = "justify-content-end";
		setPositionTopLayout();

	}else if(position == "top-center"){
		layoutPosition = "top";
		self._props_._position_class = "justify-content-center";
		setPositionTopLayout();

	}else if(position == "right"){
		layoutPosition = "right";
		self._props_._position_class = "flex-column";
		if(!isNull(opts.layout)){
			var lay = opts.layout;
			var n = (!isNull(lay.navbar)) ? lay.navbar : {md:3};
			var c = (!isNull(lay.content)) ? lay.content : {md:9};
			positionRightNavbarLayout = n;
			positionRightContentLayout = c;
		}

	}else if(position == "left"){
		layoutPosition = "left";
		self._props_._position_class = "flex-column"
		if(!isNull(opts.layout)){
			var lay = opts.layout;
			var n = (!isNull(lay.navbar)) ? lay.navbar : {md:3};
			var c = (!isNull(lay.content)) ? lay.content : {md:9};
			positionLeftNavbarLayout = n;
			positionLeftContentLayout = c;
		}

	}
	function setPositionTopLayout(){
		if(!isNull(opts.layout)){
			var lay = opts.layout;
			var n = (!isNull(lay.navbar)) ? lay.navbar : {md:12};
			var c = (!isNull(lay.content)) ? lay.content : {md:12};
			positionTopNavbarLayout = n;
			positionTopContentLayout = c;
		}
	}

	var layout = layoutManager.newLayout();

	if(layoutPosition == "right"){	
		layout.row()
			  .col(positionRightNavbarLayout,[self._props_._elements._navbar_container])
			  .col(positionRightContentLayout,[self._props_._elements._content_container])
	}else if(layoutPosition == "left"){
		layout.row()
			  .col(positionLeftNavbarLayout,[self._props_._elements._content_container])
			  .col(positionLeftContentLayout,[self._props_._elements._navbar_container])
	}else if(layoutPosition == "top"){
		layout.row()
			  .col(positionTopNavbarLayout,[self._props_._elements._navbar_container])
			  .row()
			  .col(positionTopContentLayout,[self._props_._elements._content_container])
	}
	layout.build();

	var container = new ContainerComponent({ id:self.getId(),body: layout });
	self._props_._elements._layout = layout;

	self._props_._elements._container.addComponent(container,true);

	var classNames = (opts.className) ? opts.className : "";

	var navClasses = "nav "+self._props_._position_class + " " +classNames;
	self._props_._elements._ul = createElement({
		el:'ul',
		className: navClasses
	});


 
 	this.getHtml = function(){
 		return this._props_._elements._fragment.cloneNode(true);
 	};


}
NavComponent.prototype = {

	/**
	* Adds a navigation item to this component.
	*
	* @param {Object} - nav options
	*/
	add: function(opts){

		var self = this;
		var isNull = Utils.isNull;
		var createElement = Utils.createElement;

		var label = "";
		var init = false;
		var body = new ContainerComponent();
		if(!isNull(opts.label)){
			label = opts.label;
		}
		if(!isNull(opts.init)){
			init = opts.init;
		}
		if(!isNull(opts.body)){
			body = opts.body;
		}

		var id = Utils.randomGenerator(16,false);
		self._props_._elements._view.newSubView({
			init: init,
			id: id,
			body: body
		});
		if(init==true){
			self._props_._active_item = id;
		}
		
		var li = createElement({el:'li',className:'nav-item'});
		var a = createElement({el:'a',id:id,className:'nav-link',href:'#',innerHTML:label});
		li.appendChild(a);
		self._props_._elements._ul.appendChild(li);
 
		_Utils_registerListenerCallbackForSelf('run','',function(){

			setTimeout(function(){

				$("#"+id).click(function(e){
					e.preventDefault();
					var current = self._props_._active_item;

					
					
					

					if(current == id) return;
					if(current!=""){
						$("#"+current).removeClass('active');
					}
					$("#"+id).addClass('active');
					self._props_._active_item = id;
					self._props_._elements._view.render(id);
				});

			},1000);
		},self);


	},


	/**
	* builds this navigation component. 
	*
	*
	*/
	build: function(){
		var self = this;
		
		
		
		
		
		
		
		

		
		self._props_._elements._navbar_container
			.addComponent(new ContainerComponent({body:self._props_._elements._ul}),true);
		
		self._props_._elements._content_container
			.addComponent(self._props_._elements._view,true);

		self._props_._elements._fragment
			.appendChild(self._props_._elements._container.getHtml());

	}

};







/** @exports DialogComponent
* @classdesc Creates a dialog component
* @class
* @constructor
* @tutorial 04-building_forms
*/
function ModalComponent(opts){
	opts = (Utils.isNull(opts)) ? {} : opts;
	_.extend(this,
		new AppFactoryManager('DialogComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);
	applicationManager.register(this);
	var main_container = Utils.createElement({ id:this.getId() });
	applicationManager.setComponent(this);

	this._props_._show = false;

	this._props_._container_id = this._props_._id;

	$('body').append(Utils.createElement({
		id: this._props_._container_id
	}));

	this.getHtml = function(){
		return this._props_._dialog;
	}
}
ModalComponent.prototype = {

	/**
	* Set modal options.
	*
	*/
	options: function(opts){
		$("#"+this._props_._modal_id).modal(opts);
	},

	/**
	* Toggle modal dialog
	*
	*/
	toggle: function(show){
		$("#"+this._props_._modal_id).modal('toggle');
	},

	/**
	* Set the content of the dialog
	*
	*/
	setContent: function(opts){
		ModalComponent_setContent(opts,this);
	}
}







function ModalComponent_setContent(opts,self){
	if(Utils.isNull(opts.type)){
		opts.type = 'normal';
	}

	$("#"+self._props_._container_id).empty();
	var createElement = Utils.createElement;
	var compDefaults = ComponentDefaults(opts,self);
	if(opts.type=='normal'){
		normal();
	}else if(opts.type=='mobile'){

	}

	function normal(){
		var topDiv = createElement({
			className: 'modal fade',
			id: compDefaults.id,
			tabindex: "-1",
			role: "dialog"
		});

		if(Utils.isNull(opts.title)){
			opts.title = "";
		}

		self._props_._modal_id = compDefaults.id;

		var modalDiv = createElement({
			className: 'modal-dialog',
			role: 'document'
		});

		var modalContent = createElement({
			className: 'modal-content'
		});
		var modalHeaderDiv = createElement({
			className: 'modal-header'
		});
		var modalHeaderTitle = createElement({
			el: 'h5',
			className: 'modal-title',
			innerHTML: opts.title
		});		

		
		
		
		
		
		

		var exitBtn = Utils.convertStringToHTMLNode(`
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
		`);

		
		modalHeaderDiv.appendChild(modalHeaderTitle);
		modalHeaderDiv.appendChild(exitBtn);
		modalContent.appendChild(modalHeaderDiv);

		var modalBody = createElement({
			className: 'modal-body'
		});
		modalDiv.appendChild(modalContent);
		if(!Utils.isNull(opts.body)){	
			var mBody = getModalBody();
			modalBody.appendChild(mBody.cloneNode(true));
			modalContent.appendChild(modalBody);
		}

		

		topDiv.appendChild(modalDiv);
		self._props_._dialog = topDiv;

		$('#'+self._props_._container_id).append(topDiv);
	}
	function getModalBody(){
		var mBody;
		if(typeof opts.body === 'object'){
			if(opts.body.TYPE!=undefined){
				mBody = opts.body.getHtml();
			}else{
				mBody = opts.body;
			}
		}else if(typeof opts.body === 'string'){
			mBody = Utils.convertStringToHTMLNode(opts.body);
		}
		return mBody;
	}
	function mobile(){
		
	}
}


























	







	


































































/** @exports ListComponent
* @classdesc Creates a list component
* @class
* @constructor
* @tutorial 04-building_forms
*/
function ListComponent(opts){

	
	opts = (Utils.isNull(opts)) ? {} : opts;

	
	_.extend(this,
		new AppFactoryManager('ListComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);
	applicationManager.register(this);
	var main_container = Utils.createElement({ id:this.getId() });
	applicationManager.setComponent(this);


	var self = this;
	var compDefaults = ComponentDefaults(opts,this);
	var createElement = Utils.createElement;

	if(Utils.isNull(opts.type)){
		self._props_._list_type = "bootstrap";
	}else{
		var valid = false;
		if(opts.type=="ul" || opts.type=="ol"){
			valid = true;
		}else if(opts.type=="bootstrap"){
			valid = true;
		}
		if(valid)
			self._props_._list_type = opts.type;
		else
			self._props_._list_type = "bootstrap";
	}

	var list_container;

	if(self._props_._list_type=="bootstrap"){
		list_container = createElement({
			el: 'ul',
			className: "list-group "+compDefaults.className,
			id: compDefaults.id,
			style: compDefaults.style
		});
	}else if(opts.type=="ul" || opts.type=="ol"){
		list_container = createElement({
			el: opts.type,
			className: compDefaults.className,
			id: compDefaults.id,
			style: compDefaults.style
		});
	}


	main_container.appendChild(list_container);
	this._props_._main_container = main_container;
	this._props_._list_container = list_container;
	this._props_._active_items = [];

	self._props_._single_selection = true;
	if(!Utils.isNull(opts.selectionSingle)){
		self._props_._single_selection = opts.selectionSingle;
	}

	
	this.getHtml = function(){
		return self._props_._main_container;
	}


	if(!Utils.isNull(opts.item) && !Utils.isNull(opts.list)){
		for(var i=0; i<opts.list.length; i++){
			callme(i,opts.list,this);
		}
	}else
	if(!Utils.isNull(opts.items) && !Utils.isNull(opts.list)){
		for(var i=0; i<opts.list.length; i++){
			callme(i,opts.list,this);
		}
	}
	function callme(index,listItem,self){
		var n;

		
		if(!Utils.isNull(opts.item)){
			n = opts.item( index, listItem[index] );
		}
		else if(!Utils.isNull(opts.items)){
			n = opts.items( listItem[index], index );
		}

		if(n==undefined){
			console.error("Please return this in the items function!");
		}

		self.item( n, listItem[index], index );
	}


}

ListComponent.prototype = {


	/**
	* Add list item to List Component 
	*
	* @param {Object} - options
	*/
	item: function(opts,indexItem,index){

		opts = (Utils.isNull(opts)) ? {} : opts;

		var self = this;

		var compDefaults = ComponentDefaults(opts,this);
		var createElement = Utils.createElement;

		var active = "";
		

		if(!Utils.isNull(opts.active)){
			if(opts.active){
				active = "active"
			}
		}

		var a;
		if(self._props_._list_type=="ul" || self._props_._list_type=="ol"){
			a = createElement({
				el: 'li',
				className: compDefaults.className,
				id: compDefaults.id,
				style: compDefaults.style,
				href: compDefaults.href,
				innerHTML: compDefaults.label
			});
		}else if(self._props_._list_type=="bootstrap"){
			a = createElement({
				el: 'li',
				className: "list-group-item list-group-item d-flex justify-content-between align-items-center list-group-item-action "+active+" "+compDefaults.className,
				id: compDefaults.id,
				style: compDefaults.style,
				href: compDefaults.href,
				innerHTML: compDefaults.label
			});

			if(!Utils.isNull(opts.badge)){

				var badge = createElement({
					el: 'span',
					className: 'badge badge-primary badge-pill',
					innerHTML: opts.badge.value
				});
				a.appendChild(badge);
			}
		}


		self._props_._list_container.appendChild(a);

		

		

		var def = false;
		if(!Utils.isNull(opts.preventDefault)){
			def = opts.preventDefault;
		}

		var gh = index;

		_Utils_registerListenerCallbackForSelf('run','',function(){
			$("#"+compDefaults.id).click(function(e){
				if(def) e.preventDefault();

				if(!Utils.isNull(opts.listener)){
					opts.listener(indexItem,gh);
				}

				if(self._props_._single_selection){
					var currentActiveItem = self._props_._active_items[0];
					if(!Utils.isNull(currentActiveItem)){
						$("#"+currentActiveItem).removeClass('active');
					}
					$("#"+compDefaults.id).addClass('active');
					self._props_._single_selection[0] = compDefaults.id;
					self._props_._active_items[0] = compDefaults.id;
				}else{
					if(self._props_._active_items.includes(compDefaults.id)){
						var index = self._props_._active_items.indexOf(compDefaults.id);
						
						if (index > -1) {
						    self._props_._active_items.splice(index, 1);
						}
						$("#"+compDefaults.id).removeClass('active');

					}else{
						self._props_._active_items.push(compDefaults.id);
						$("#"+compDefaults.id).addClass('active');
					}
				}
			});

		},self);















	}

};




function FormEventsHandler(obj,formElement,self){
	FormEventsHandler_constructor(obj,formElement,self,this);
}
FormEventsHandler.prototype = {};


function ComponentDefaults(obj,self){
	return new FormComponentDefaults(obj,self);
}


function FormComponentDefaults(obj,self){
	if(Utils.isNull(obj)){
		obj = {};
	}

	var id,
		selector = "#_id_"+Utils.randomGenerator(12,false),
		tag,
		name;

	if(!Utils.isNull(obj.all)){
		id = obj.all;
		if(id.charAt(0)!="#" && id.charAt(0)!="."){
			selector = "#"+id;
			tag = id;
			name = id;
		}else{
			selector = id;
			tag = id.substr(1);
			id = tag;
			name = tag;
		}
	}

	var href = "#";
	if(!Utils.isNull(obj.href)){
		href = obj.href;
	}
	this.href = href;

	if(obj.selector!=undefined){
		if(obj.selector.charAt(0)!="#" && obj.selector.charAt(0)!="."){
			selector = "#"+obj.selector;
			id = obj.selector;
		}else{
			selector = obj.selector;
			id = obj.selector.substr(1);
		}
	}

	if(obj.name!=undefined){
		name = obj.name;
	}

	if(obj.tag!=undefined){
		tag = obj.tag;
	}else{
		tag = Utils.randomGenerator(12,false)
	}

	if(id==undefined){
		id = Utils.randomGenerator(12,false)
	}

	var remember = false;
	if(!Utils.isNull(obj.remember)){
		remember = obj.remember;
	}


	this.remember = remember;
	this.id = id;
	this.tag = tag;
	this.selector = selector;
	this.name = name;

	this.style = (obj.style==undefined) ? "" : obj.style;
	this.className = (obj.className==undefined) ? "" : obj.className;
	this.placeholder = (obj.placeholder==undefined) ? "" : obj.placeholder;
	this.paramName = (obj.paramName==undefined) ? this.id : obj.paramName;
	this.type = (obj.type==undefined) ? "" : obj.type;
	this.name = (obj.name==undefined) ? "" : obj.name;
	this.label = (obj.label==undefined) ? "" : obj.label;
	this.defaultValue = (obj.defaultValue==undefined) ? self._props_._defaultValue : obj.defaultValue;

	this.value = (obj.value==undefined) ? "" : obj.value;
	this.myself = self;
}
FormComponentDefaults.prototype = {
	getElementTag: function(){
		return this.tag;
	},

	setDefault: function(param,value){
		if(param=='value'){
			this.value = value;
		}else if(param=='name'){
			this.name = value;
		}
	},
	getDefault: function(){
		if(param=='value'){
			return this.value;
		}else if(param=='name'){
			return this.name;
		}
	}
}

function FormValidationDefaults(validation){
	if(Utils.isNull(validation)) validation = {};
	if(!Utils.isNull(validation.required)){
		if(typeof validation.required === 'boolean'){
			var req = validation.required;
			validation.required = {};
			validation.required.require = req;
			validation.required.error = "";
			validation.required.success = "";
		}
		if(Utils.isNull(validation.required.error)){
			validation.required.error = "";
		}	
		if(Utils.isNull(validation.required.success)){
			validation.required.success = "";
		}
	}
	if(!Utils.isNull(validation.min)){
		if(typeof validation.min === 'number'){
			var num = validation.min;
			validation.min.number = num;
			validation.min.error = "";
			validation.min.success = "";
		}
		if(Utils.isNull(validation.min.error)){
			validation.min.error = "";
		}
		if(Utils.isNull(validation.min.success)){
			validation.min.success = "";
		}
	}
	if(!Utils.isNull(validation.max)){
		if(typeof validation.max === 'number'){
			var num = validation.max;
			validation.max.number = num;
			validation.max.error = "";
			validation.max.success = "";
		}
		if(Utils.isNull(validation.max.error)){
			validation.max.error = "";
		}
		if(Utils.isNull(validation.max.success)){
			validation.max.success = "";
		}
	}
	this.validation = validation;
}
FormValidationDefaults.prototype = {
	getDefault: function(){
		return this.validation;
	}
};



/** @exports FormComponent
* @classdesc Creates a form component
* @class
* @constructor
* @tutorial 04-building_forms
*/
function FormComponent(obj){
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	obj = (Utils.isNull(obj)) ? {} : obj;


	_.extend(this,
		new AppFactoryManager('FormComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);
	applicationManager.register(this);

	var self = this;

	FormComponent_constructor(obj,this);

	var tag = obj.tag;

	this.getHtml = function(){
		return this._props_._elements._container;
	};

	applicationManager.setComponent(this);
	
	this._props_._setRemeber = function(_tagId,_value){

		if(self._props_._prevent_remember) return;
		var rmb = sessionStorage.getItem(_tagId);
		if(!Utils.isNull(rmb)){
			rmb = JSON.parse(rmb);
			rmb[_tagId] = _value;
			sessionStorage.setItem(_tagId,JSON.stringify(rmb));
		}else{
			var rmb = {};
			rmb[_tagId] = _value;
			sessionStorage.setItem(_tagId,JSON.stringify(rmb));
		}

	};
	this._props_._getRemeber = function(_tagId){
		if(self._props_._prevent_remember) return null;
		var rmb = sessionStorage.getItem(_tagId);
		if(rmb){
			rmb = JSON.parse(rmb);
			return rmb[_tagId];
		}else{
			return null;
		}

	};
	this._props_._stopRemembering = function(){
		if(self._props_._prevent_remember) return;
		sessionStorage.setItem(tag,JSON.stringify({}));
	};

}

FormComponent.prototype = {

	
	showElement: function(){},
	hideElement: function(){},

	/** 
	* Clear form fields.
	*
	*/
	clearForm: function(){
		var form_data = this._props_._form_data;
		for(var i in form_data){
			var form = form_data[i];
			var formElement = form.formElement;
			if(form.type=='input'){
				$(formElement.selector).val("");
			}
		}
	},

	/** 
	* If the form elements are set to remember their values
	* after page refresh or any other changes this will stop 
	* last remembered values.
	*
	*/
	stopRemembering: function(){
		sessionStorage.setItem(this._props_._tag,JSON.stringify({}));
	},

	/**
	* Even if remember is set form will not remember values.
	* 
	*/
	preventRemembering: function(remember){
		this._props_._prevent_remember = remember;
	},


	/**
	* Update and/or change value of form element. A tag must be assigned
	* to element to update other wise false will be returned.
	*
	* @param {Strind} - Tag assigned to elemnt
	* @param {Strind} - Value
	*/
	update: function(tag,value){
		FormComponent_update(tag,value,this);
	},

	/**
	* Add an input element to the form
	* @param {Object} - options
	*/
	addInput: function(opts){
		FormComponent_addInput(opts,this);
	},

	/**
	* Add checkboxes to form.
	* @param {Object} - options
	*/
	addCheckBoxGroup: function(opts){
		FormComponent_addCheckBoxGroup(opts,this);
	},

	/**
	* Add radio buttons to form.
	* @param {Object} - options
	*/
	addRadioButtonGroup: function(opts){
		FormComponent_addRadioButtonGroup(opts,this);
	},

	/**
	* Add selection to this form.
	* @param {Object} - options
	*/
	addSelection: function(opts){
		FormComponent_addSelection(opts,this);
	},

	/**
	* Add selection of US states to this form.
	* @param {Object} - options
	*/
	addStateSelection: function(opts){
		FormComponent_addStateSelection(opts,this);
	},

	addTextarea: function(opts){
		FormComponent_addTextarea(opts,this);
	},

	/**
	* Add date picker to this form.
	* @param {Object} - options
	*/
	addDatePicker: function(opts){
		FormComponent_datePicker(opts,this);
	},

	/**
	* Builds the form. Must be called before form can be used.
	*
	*/
	build: function(pages){
		FormComponent_build(pages,this);
	},

	/**
	* Adds a submit button to the form.
	*
	* @param {Object} - options
	* @param {Function} - callback
	*/
	onSubmit: function(opts,callback){
		FormComponent_onSubmit(opts,callback,this);	
	},

	/**
	* Returns an array of the form elements.
	* 
	* @return {Array} - Elements
	*/
	getFormElements: function(){
		return FormComponent_getFormElements(this);
	}
};



/** @exports FileUploader
* @classdesc Creates a file upload component
* @class
* @constructor
*/
function FileUploaderComponent(opts){
	_.extend(this,
		new AppFactoryManager('FormComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);
	applicationManager.register(this);
	var topComponentElement = Utils.createElement({ id:this.getId() });
	applicationManager.setComponent(this);
	this._props_._upload_element = null;

	this._props_._errorcallback = null;
	this._props_._beforLoadcallback = null;
	this._props_._requestHeader = [];
	this._props_._name = "";
	this._props_._data = [];

	this._props_._fileUploadPercentElement

	FormComponent_addFileUpload(opts,this);

	this.getHtml = function(){
		return this._props_._upload_element;
	}
}
FileUploaderComponent.prototype = {

	setRequestHeaders: function(headers){
		this._props_._requestHeader = headers;
	},
	before: function(callback){
		this._props_._beforLoadcallback = callback;
	},
	error: function(callback){
		this._props_._errorcallback = callback;
	}
};



/** @exports ButtonComponent
* @classdesc .
* @class
* @constructor
*/
function ButtonComponent(opts){
	_.extend(this, 
		new AppFactoryManager('ButtonComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);	
	applicationManager.register(this);
	applicationManager.setComponent(this);

	if(Utils.isNull(opts)){
		opts = {};
	}

	var self = this;

	var id = self.getId();
	var selector = (opts.selector==undefined) ? "#"+id : opts.selector;
	var label = (opts.label==undefined) ? "" : opts.label;
	var style = (opts.style==undefined) ? "" : opts.style;
	var className = (opts.className==undefined) ? "" : opts.className;
	if(className==""){
		className = (opts.classes==undefined) ? "" : opts.classes;
	}

	
	
	
	
	
	
	

	var button = document.createElement('button');
	button.id = id;
	button.style = style;
	button.className = className;
	button.innerHTML = label;

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	if(!Utils.isNull(opts.listener)){
		_Utils_registerListenerCallbackForSelf("click",selector,opts.listener,self);
	}
	else if (!Utils.isNull(opts.callback)) {
		_Utils_registerListenerCallbackForSelf("click",selector,opts.callback,self);
	}  

	this.getHtml = function(){
		return button;
	};

}
ButtonComponent.prototype = {

};



/** @exports ContainerComponent
* @classdesc A top-level component that.
* @class
* @constructor
*/
function ContainerComponent(obj){
	_.extend(this, 
		new AppFactoryManager('ContainerComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);
	applicationManager.register(this);
	var self = this;
	obj = (obj) ? obj :{};
	
	self._props_._componentName = "ContainerComponent";
	
	if(Utils.isNull(obj.body)){
		obj.body = "<div></div>";
	}
	if(Utils.isNull(obj.template)){
		obj.template = {};
	}
	this._props_._obj = obj;
	this._props_._object_config = obj;
	_Utils.registerListenerCallback(obj,this);

	self._props_._active = true;
	var _loader_id = "load_"+Utils.randomGenerator(16,false);
	var _spinner_id = "spinner_"+Utils.randomGenerator(16,false);
	var cont1 = Utils.createElement({id: _loader_id});
	var cont2 = Utils.createElement({id: _spinner_id});
	cont1.appendChild(cont2);
	self._props_._loader_el = cont1;
	self._props_._loader_id = _loader_id;
	self._props_._spinner_id = _spinner_id;
	self._props_._loader_container_class = "appfactory-container-loader";
	self._props_._loader_spinner_class = "appfactory-container-loader-spinner";


	
	var createElement = Utils.createElement;
	var obj = self._props_._obj;
	var bodies = [];
	self._props_._container = document.createElement('div');
	self._props_._container.id = (!Utils.isNull(obj) && !Utils.isNull(obj.id)) ? obj.id : "";
	if(!Utils.isNull(obj)){
		if(!Utils.isNull(obj.classes)){
			self._props_._container.className = obj.classes;
		}else if(!Utils.isNull(obj.className)){
			self._props_._container.className = obj.className;
		}
		if(!Utils.isNull(obj.style)){
			self._props_._container.style = obj.style;
		}
	}


	var firstdivid = "j"+Utils.randomGenerator(12,false);
	self._props_._component_element_container_id = firstdivid;
	var firstdiv = createElement({id:firstdivid});
	if(Array.isArray(obj.body)){
		for(var i=0; i<obj.body.length; i++){ _create_bodies_(i); }
		function _create_bodies_(index){
			var createdBody = _create_body({body: obj.body[index] });
			firstdiv.appendChild(createdBody);
		}
	}else{
		var createdBody = _create_body({body: obj.body});
		firstdiv.appendChild(createdBody);
	}
	self._props_._container.appendChild(firstdiv)

	var seconddivid = "j"+Utils.randomGenerator(12,false);
	var seconddiv = createElement({id:seconddivid});
	var span = Utils.createElement('span',{id:self.getId()});
	seconddiv.appendChild(self._props_._loader_el);
	seconddiv.appendChild(span);
	self._props_._container.appendChild(seconddiv);

	var fragment = document.createDocumentFragment();
	fragment.appendChild(self._props_._container);
	self._props_._elements._fragment = fragment;

	
	this.getHtml = function(route){
		return self._props_._elements._fragment.cloneNode(true);
	}


}
ContainerComponent.prototype = {


	/**
	* Adds a component to this component
	* nnnnn
	* @param {ComponentManager} (required) The component to add.
	* @param {Boolean} (optional) Default is true - Empties the component 
	* of all other components before adding the new component. If set to
	* false then all other previous components will still be attached.
	* @param {Boolean} (optional) Default is false - If set to true then the added
	* component is only added once, so if this component is removed from 
	* the DOM and re-added then the added component will not be attached.
	*/ 
	addComponent: function(component,empty,attachOnce){
		
		var self = this;
		var isEmpty = (!Utils.isNull(empty)) ? empty : true;
		attachOnce = (!Utils.isNull(attachOnce)) ? attachOnce : false;

		var setComponent;

		if(Array.isArray(component)){
			var params = [];
			for(var i=1; i<component.length; i++){
				params.push(component[i]);
			}

			setComponent = gl_applicationContextManager.Manager().getMethod(component[0])(params);
			
			if(Utils.isNull(setComponent)){
				console.error("Component does Not exist: "+component[0])
			}
		}else{
			setComponent = component;
		}

		if( document.getElementById(self.getId()) ){
			addToDOM(setComponent);
		}
			if(attachOnce){
				self.onAttachOnceListener(function(){
					addToDOM(setComponent);
				});
			}else{ 
				self.onAttachListener(function(){
					addToDOM(setComponent);
				});
			}
		
		function addToDOM(setComponent1){

			
			

			
			

			if(Utils.isNull(setComponent1)) return;




			var id = self._props_._component_element_container_id;
			if(isEmpty==true){
				$("#"+id).empty();
			}
			

			
			if(setComponent1.TYPE){
				$("#"+id).append(setComponent1.getHtml());
				setComponent1.initializeListeners();
			}else{
				$("#"+id).append(setComponent1);
			}
			
		}

	},


	/**
	* 
	*
	* @return {Boolean} - The current state of the component.
	*/

	getActive: function(){
		return self._props_._active;
	},

	/**
	* A ContainerComponent can activate a loading screen for this this container
	* setting the state to true will show a loading icon with a half transparent black
	* background.
	*
	* @param {ComponentManager} component
	* @param {Boolean} stillSet - Set the state of the component even if not appended to the 
	* 	DOM. 
	*/

	setActive: function(active,stillSet){
		ContainerComponent_setActive(active,stillSet,this);
	},

};




function ElementAttributes(attrs){
	_.extend(this, new AppFactoryManager('ElementAttributes'));
	this._elementAttributes = {
		_type: "ElementAttributes",
		_attrs: attrs
	};
}
ElementAttributes.prototype = {

	getAttributes: function(){
		return this._elementAttributes._attrs;
	}
};


function EventManager(self){
	_.extend(this, Backbone.Events);

}
EventManager.prototype = {
	addEventListener: function(){}
};




/**
* Brick 
*
*/
var Brick = {

	/**
	* @param {String|Object} (optional) if not specified then div is returned
	* @param {Object} (optional) element properties id|classes|style|innerHTML...
	* @return {HTMLElement} - 
	*/
	createElement: function(type,opts){
		return Utils.createElement(type,opts);
	},

	/**
	* Add
	* @return {HTMLElement} this
	*/
	div: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('div',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	span: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('span',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	ul: function(obj){},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	li: function(obj){},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	p: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('p',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	h1: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('h1',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	h2: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('h2',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	h3: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('h3',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	h4: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('h4',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	h5: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('h5',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	h6: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('h6',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	article: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('article',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	section: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('section',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	footer: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('footer',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	nav: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('nav',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	blockquote: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('blockquote',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	ol: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('ol',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	pre: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('pre',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	a: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('a',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	abbr: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('abbr',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	br: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('br',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	area: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('area',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	audio: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('audio',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	video: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('video',obj);
	},	

	/**
	* Add
	* @return {HTMLElement} 
	*/
	table: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('table',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	tbody: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('tbody',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	tfoot: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('tfoot',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	td: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('td',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	th: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('th',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	tr: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('tr',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	button: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('button',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	form: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('form',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	input: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('textarea',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	label: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		var e = Utils.createElement('label',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	textarea: function(obj){
		var e = Utils.createElement('textarea',obj);
		return e;
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	option: function(obj){
		if(typeof obj === "string"){
			obj = {innerHTML: obj };
		}
		return Utils.createElement('option',obj);
	},

	/**
	* Add
	* @return {HTMLElement} 
	*/
	img: function(obj){
		var e = Utils.createElement('img',obj);
		return e;
	},

	/**
	*
	* @return {BrickComponent}
	*/
	stack: function(){
		return new BrickComponent();
	}

};



/** @exports BrickComponent
* @classdesc A top-level component that.
* @class
* @constructor
*/
function BrickComponent(){

	var self = this;
	_.extend(this, 
		new AppFactoryManager('BrickComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);
	applicationManager.register(this);
	this.ID = "d-"+Utils.randomGenerator(12,false);


	this.getHtml = function(){
		if(Utils.isNull(self._props_._fragment)){
			console.error("Please call build() on BrickComponent");
			return null;
		}else{
			return self._props_._fragment.cloneNode(true);
		}
	}

	this._props_._elements = [];
	this._props_._fragment = null;


}
BrickComponent.prototype = {


	array: function(type,arrayObjs){

		console.log(arrayObjs);

		if(typeof type === 'string'){
			for (var i = 0; i < arrayObjs.length; i++) {
				arrayObjs[i]['_el'] = type;
			}
		}else if(Array.isArray(type)){
			arrayObjs = type;
		}

		var b = null;
		for (var i = 0; i < arrayObjs.length; i++) {
			if(b==null){
				var myType = arrayObjs[i]._el;
				delete arrayObjs[i]._el;
				b = Brick.stack().make(myType,arrayObjs[i]);
			}else{
				var myType = arrayObjs[i]._el;
				delete arrayObjs[i]._el;
				b.make(myType,arrayObjs[i]);
			}
		}
		return b;
	},

	/**
	*
	* @return {BrickComponent}
	*/
	make: function(element,opts){
		return BrickComponent_make(element,opts,this);
	},

	
	/**
	*
	* @return {BrickComponent}
	*/
	div: function(opts){
		return BrickComponent_make("div",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	a: function(opts){
		return BrickComponent_make("a",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	i:function(opts){
		return BrickComponent_make("i",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	h1: function(opts){
		return BrickComponent_make("h1",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	h2: function(opts){
		return BrickComponent_make("h2",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	h3: function(opts){
		return BrickComponent_make("h3",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	h4: function(opts){
		return BrickComponent_make("h4",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	h5: function(opts){
		return BrickComponent_make("h5",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	h6: function(opts){
		return BrickComponent_make("h6",opts,this);
	},


	header: function(opts){
		return BrickComponent_make("header",opts,this);
	},

	/*
	input: function(opts){
		return BrickComponent_make("input",opts,this);
	},
	*/

	/**
	*
	* @return {BrickComponent}
	*/
	span: function(opts){
		return BrickComponent_make("span",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	textarea: function(opts){
		return BrickComponent_make("textarea",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	ul: function(opts){
		return BrickComponent_make("ul",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	li: function(opts){
		return BrickComponent_make("li",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	ol: function(opts){
		return BrickComponent_make("ol",opts,this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	button: function(opts){
		return BrickComponent_make("button",opts,this);
	},

	section: function(opts){
		return BrickComponent_make("section", opts, this);
	},

	img: function(opts){
		return BrickComponent_make("img", opts, this);
	},

	/** 
	* Build this BrickComponent.
	* 
	* @return {Component}
	*/
	build: function(){

		var self = this;

		var elements = self._props_._elements;

		var fragment = document.createDocumentFragment();
		for (var i = 0; i < elements.length; i++) {
			fragment.appendChild(elements[i])
		}

		self._props_._fragment = fragment;

		return this;
	},


	end: function(){
		this.build();
		return this;
	}

};
function BrickComponent_make(element,opts,self){

	if(opts==undefined){
		opts = {};  
	}

	var el;
	if(!Utils.isNull(opts.nest)){

		var nestedElement = opts.nest;
		delete opts.nest;

		if(typeof opts === "string"){
			opts = {innerHTML: opts};
		}

		el = Utils.createElement(element,opts);

		if(nestedElement.TYPE){
			el.appendChild(nestedElement.getHtml());
		}else if(typeof nestedElement === "object"){
			el.appendChild(nestedElement);
		}else if(typeof nestedElement === "string"){
			el.appendChild(Utils.convertStringToHTMLNode(nestedElement));
		}

	}else{

		if(typeof opts === "string"){
			opts = {innerHTML: opts};
		}

		el = Utils.createElement(element,opts);
	}
	self._props_._elements.push(el);


	return self;
}







/** @exports NavigationComponent
* @classdesc A top-level component that.
* @class
* @constructor
*/
function NavigationComponent(obj){
	_.extend(this, 
		new AppFactoryManager('NavigationComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager()
	);
	applicationManager.register(this);
	

	var self = this;
	obj = (obj) ? obj :{};
	
	if(Utils.isNull(obj.type)){
		obj.type = Flags.Navigation.nav;
	}
	if(Utils.isNull(obj.pushOnClose)){
		obj.pushOnClose = true;
	}

	self._props_._opts = obj;
	self._props_._obj = obj;

	self._props_._opts.pushOnClose = obj.pushOnClose;
	self._props_._container = Utils.createElement({ id:self.getId() });
	self._props_._obj['pages'] = [];
	self._props_._container_id = "NavigationComponent-"+Utils.randomGenerator(16,false);
	self._props_._viewManager = null;
 	self._props_.view_id = "NavigationComponent-"+Utils.randomGenerator(16,false);
 	
 	self._props_._nav_type = (obj.type==undefined) ? 1 : obj.type;
 	self._props_._container_class = "mycontainer";
 	self._props_._closable = (obj.closable==undefined) ? false : obj.closable;
 	self._props_._current_view = null;
 	self._props_._container_main_class = (obj.container==undefined) ? "container" : obj.container;

 	self._props_._is_built = false;
 	

	this.getHtml = function(){
		return this._props_._html;
	};
}

NavigationComponent.prototype = {
	render: function(page){
		this._props_._viewManager.render(page);
	},

	close: function(){
		document.getElementById("mySidenav").style.width = "0";
		if(this._props_._opts.pushOnClose){
			document.querySelector("."+this._props_._container_class).style.marginLeft = "0";
		}
	},

	open: function(){
		document.getElementById("mySidenav").style.width = "200px";
		if(this._props_._opts.pushOnClose){
			document.querySelector("."+this._props_._container_class).style.marginLeft = "250px";
		}
	},

	isOpen: function(){
		if(document.getElementById("mySidenav").style.width == "200px"){
			return true;
		}else{
			return false;
		}
	},


	removeSubView: function(id){
		for(var i=0; i<this._props_._obj['pages'].length; i++){
			var tag = this._props_._obj['pages'][i].id;
			if(tag==id){
				$('#'+id).remove();
				break;
			}
		}
	},
	addSubView: function(opts){
		this.newSubView(opts);
	}, 

	newSubView: function(obj){
		var self = this;
		var id = obj.id;
		var defaultBody = new ContainerComponent({ body: "<div></div>" });

		
		if(Utils.isNull(obj.init)){
			obj.init = false;
		}
		if(Utils.isNull(obj.label)){
			obj.label = "";
		}
		if(Utils.isNull(obj.body)){
			obj.body = defaultBody;
		}
		if(Utils.isNull(obj.route)){
			obj.route = id;
		}
		this._props_._obj['pages'].push(obj);

		if(document.getElementById('mySidenav') && self._props_._is_built == true){
			var view = self._props_._viewManager;
			if(!Utils.isNull(view)){
				view.newSubView({
					id: obj.id,
					init: obj.init,  
					route: obj.route,
					body: obj.body
				});

				var container_nav = document.getElementById('mySidenav');

				var a1 = Utils.createElement('a',{ id: obj.id, href:'#', className:"appfactory-sidenav-item", innerHTML: obj.label });
				container_nav.appendChild(a1);
				
					
				
				
				
				
				
				
					$("#"+obj.id).click(function(){
					self._props_._viewManager.render(obj.id);
					$(".appfactory-sidenav-item").removeClass('appfactory-sidenav-active');
					$("#"+obj.id).addClass('appfactory-sidenav-active');
					});
				


			}
		}

		
		

	},


	/**
	* Build the navigation component.
	*
	*/
	build: function(){
		var self = this;
 		var selector = "#"+self._props_.view_id
		var view = new ViewManager({routable: self._props_._opts._routable});
		var pages = self._props_._obj['pages'];
		for(var i=0; i<pages.length; i++){
			var page = pages[i];
			new_sub_view(page);
		}
		function new_sub_view(page){
			view.newSubView({
				id: page.id,
				init: page.init,  
				route: page.route,
				body: page.body
			});
		}

		self._props_._viewManager = view;

		var t = self._props_._nav_type;
		var element = _navigation1(self,view);
		this._props_._html = element;
		this._props_._is_built = true;
	}
};


function _navigation1(self,view){

	
	
	
	
	
	
	
	

	
 
	
	

	var defaultBody;

	var container = Utils.createElement({});

	
	
	self._props_._container.className = self._props_._container_class;
	self._props_._container.style = "margin-left:250px";

	self._props_._container_main = Utils.createElement({className: self._props_._container_main_class });
	self._props_._container_main.appendChild(view.getHtml());
	self._props_._container.appendChild(self._props_._container_main);

	
 
	
	

	var container_nav = Utils.createElement({ id:"mySidenav", className: "appfactory-sidenav" });

	
	
	if(self._props_._opts.closable){
		var a2 = Utils.createElement('a',{ href:'#', className:'appfactory-close', innerHTML: "&times;" });
		var close = defaultBody = new ContainerComponent({ body: a2 });
		close.onAttachListener(function(){
			$(".appfactory-close").click(function(e){
				e.preventDefault();
				self.close();
			});
		});
		container_nav.appendChild(close.getHtml());
	}

	container.appendChild(container_nav);
	container.appendChild(self._props_._container);

	defaultBody = new ContainerComponent({ body: container });

	for(var i=0; i<self._props_._obj['pages'].length; i++){
		var page = self._props_._obj['pages'][i];
		_setup(page);
	}
	function _setup(page){
		var a1 = Utils.createElement('a',{ id: page.id, href:'#', className:"appfactory-sidenav-item", innerHTML: page.label });
		container_nav.appendChild(a1);
		
			
		if(!Utils.isNull(page.init) && page.init==true){
			defaultBody.onAttachOnceListener(function(){
				$("#"+page.id).addClass('appfactory-sidenav-active');
			});
		}
		_Utils.registerListenerCallbackForSelf("click","#"+page.id,function(){
			self._props_._viewManager.render(page.id);
			$(".appfactory-sidenav-item").removeClass('appfactory-sidenav-active');
			$("#"+page.id).addClass('appfactory-sidenav-active');
		},self,true);

	}

	return defaultBody.getHtml();
}
function _navigation_side_link_setup(){

}

function _side_navigation(self){

	self._props_ = {
		_extensionObject: [],
		_nav_id: "",
		_body_id: "",
		_elements: {
			_fragment: document.createDocumentFragment(),
			_container: document.createElement("div"),
			_body: document.createElement("div")
		},
		_default_background: (isNull(obj.defaultBackground)) ? "rgba(0,0,0,0.4)" : obj.defaultBackground,
		_events: [],
		_transitionType: "",
		_parent: null,
		_pages: [],

		_slimscroll: (isNull(obj.slimscroll)) ? null : obj.slimscroll,

		_fontSize: (isNull(obj.fontSize)) ? "36px" : obj.fontSize, 

		_dom_events:{
			_addToDOMEvent:[],
			_addToDOMEventOnce: null,
			_addToDOMCount: 0,
			_removeFromDOMEvent:[],
			_removeFromDOMEventOnce: null,
			_removeFromDOMCount: 0
		},
		_enable_state: (isNull(obj.enable_state)) ? false : obj.enable_state
	};

	var ap = document.createElement("span");
	ap.id = self._props_._id;
	self._props_._elements._fragment.appendChild(ap);

	self._props_._elements._body.className = (isNull(obj.bodyClasses)) ? "" : obj.bodyClasses;
	
	
	self._props_._elements._body2 = document.createElement('div');
	self._props_._elements._body2.style = "margin-left:110px;width:80%;";
	self._props_._elements._body2.appendChild(self._props_._elements._body);


	var div12 = document.createElement('div');
	div12.id = "this_is_nice";
	self._props_._elements._container.appendChild(div12);


	if(!isNull(obj.body)){
		if(obj.body.TYPE){
			self._props_._extensionObject[self._props_._extensionObject.length] = obj.body;
			self._props_._elements._body.appendChild(obj.body.getHtml());
		}else{
			if(typeof obj.body === "string"){
				var b = convertStringToHTMLNode(obj.body);
				self._props_._elements._body.appendChild(b);
			}else
			if(typeof obj.body === "object"){
				self._props_._elements._body.appendChild(obj.body);
			}
		}
	}
	
	var containerClasses = (isNull(obj.classes)) ? "" : obj.classes;

	var sticky = (isNull(obj.sticky)) ? false : obj.sticky;

	self._props_._elements._container.id = (isNull(obj.id)) ? Support.Utils.randomGenerator(9,false) : obj.id;
	self._props_._elements._container.className = containerClasses;
	var body_styles = "" + (isNull(obj.styles)) ? "" : obj.styles;
	self._props_._elements._container.style = body_styles;

	self._props_._nav_id = self._props_._elements._container.id;
	

	
	if(sticky){
		containerClasses = "sidenav-nohide "+(isNull(obj.classes)) ? "" : obj.classes;
		self._props_._elements._body.id = "appfactory-main-container-content-nohide";
		
	}else{
		self._props_._elements._body.id = "appfactory-sidenav-content-container";
		containerClasses = " appfactory-sidenav";
		var doesClose = true;
		if(!isNull(obj.doesClose)){
			doesClose = obj.doesClose;
		}
		if(doesClose){
			var a = document.createElement('a');
			a.href = "javascript:void(0)";
			a.className = "appfactory-close";
			self._props_._elements._body.style = "";
			a.style = (isNull(obj.exitColor)) ? "" : "color:"+obj.exitColor;
			a.id = Support.Utils.randomGenerator(9,false);
			a.innerHTML = "&times;";
			

			

			self._props_._elements._container.appendChild(a);

			registerListenerCallbackForSelf(self,"click",a.id,function(){
				self.close();
			});
		}
		

		
	}

	self._props_._body_id = self._props_._elements._body.id;

	

	self._props_._elements._container.className = "side_nav "+containerClasses;
	


	self._props_._collection = new ViewCollectionController("#"
		+self._props_._elements._body.id);

	self._props_._elements._fragment.appendChild(this._props_._elements._container);
	self._props_._elements._fragment.appendChild(this._props_._elements._body2);
}







/** @exports TableComponent
* @classdesc Instatiated by the  {@link ViewLayoutController} class
* @class
* @constructor
* @param {Object} obj
* @param {string} obj.id
* @param {string} obj.classes
* @param {string} obj.styles
*/
function TableComponent (obj){

	var isNull = Utils.isNull;

	_.extend(this, 
		new AppFactoryManager('TableComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager()
	);
	applicationManager.register(this);


	if(isNull(obj)){
		obj = {};
		obj.columns = [];
	}


	this.TYPE = Flags.Type.component;
	this.ID = "d-"+Utils.randomGenerator(13,false);
	var randomId = Utils.randomGenerator(10,false);
	this._tableBodyId = Utils.randomGenerator(10,false);
	var id = this.ID;
	var classes = (obj.classes == null || obj.classes==undefined) ? "" : obj.classes;

	applicationManager.setComponent(this);


	var _container = document.createElement('div');
	_container.id = "container-id-"+Utils.randomGenerator(22,false);
	var _table = document.createElement('table');
	var _thead = document.createElement('thead');
	var _tbody = document.createElement('tbody');
	
	_table.appendChild(_thead);
	_table.appendChild(_tbody);

	_table.className = "table table-hover uieb-table";
	_tbody.className = "uieb-table-tbody";
	_thead.className = "uieb-table-thead";
	_thead.id = "uieb-table-thead-"+Utils.randomGenerator(16,false);

	
	
	
	
	
	
	



	
	var _columnNames = [];
	var _columnNameHeader = document.createElement('tr');
	var _column_ = [];
	_columnNameHeader.id = "col-name-header-"+Utils.randomGenerator(12,false);
	for(var i=0; i<obj.columns.length; i++){
		var _th = document.createElement('th');
		_th.innerHTML = obj.columns[i].name;
		_th.id = "column-"+Utils.randomGenerator(22,false);
		var lastChar = obj.columns[i].name.substr(obj.columns[i].name.length - 1);
		var _type = "normal";
		if(lastChar=="&"){
			_type = "remote";
		}

		
		_column_[i] = { 
			id: _th.id,
			name: obj.columns[i].name,
			type: _type 
		};
		_columnNames[i] = obj.columns[i].name;
		_columnNameHeader.appendChild(_th);

	}
	_thead.appendChild(_columnNameHeader);

	

	this._props_ = {
		_elements: {
			_fragment: document.createDocumentFragment(),
			_tbody:_tbody
		},
		_row_count: 0,
		_events: [],
		_extensionObject: [],
		_event_object: {},
		_parent: null,
		_dom_events:{
			_addToDOMEvent:[],
			_addToDOMEventOnce: null,
			_addToDOMCount: 0,
			_removeFromDOMEvent:[],
			_removeFromDOMEventOnce: null,
			_removeFromDOMCount: 0,
		}, 
		_updatable: (isNull(obj.updatable)) ? false : obj.updatable,
		_tableStructure: {
			_rows: [],
			_column: _column_,
			_columnCount:obj.columns.length,
			_columnNames:_columnNames,
			_rowCount:0,
			_rowData: [],
			_columns: obj.columns,
			_columnNameHeader: _columnNameHeader,
			_connected_data: {},
			_row_cell_data: [],
			_cellRequestForConnectedData: obj.cellRequestForConnectedData
		}
	};

	this._props_._elements._tbody.id = "table-body-"+Utils.randomGenerator(12,false);

	if(this._props_._updatable){
		var addRowBtn = document.createElement("button");
		addRowBtn.innerHTML = "Add Row";
		addRowBtn.id = "add-row-" + this.ID;
		var addColBtn = document.createElement("button");
		addColBtn.innerHTML = "Add Column";
		addColBtn.id = "add-col-" + this.ID;
		var addDownloadBtn = document.createElement("button");
		addDownloadBtn.innerHTML = "Download";
		addDownloadBtn.id = "download-" + this.ID;
		var addSaveBtn = document.createElement("button");
		addSaveBtn.innerHTML = "Save";
		addSaveBtn.id = "save-" + this.ID;

		_container.appendChild(addRowBtn);
		_container.appendChild(addColBtn);
		_container.appendChild(addDownloadBtn);
		_container.appendChild(addSaveBtn);

		var self = this;

		this._props_._delemeter = (isNull(obj.delemeter)) ? "\t" : obj.delemeter;

		
		_Utils_registerListenerCallbackForSelf("run","",function(data){
			$("#"+_thead.id).click(function(e){
				TableComponent__column_adjustment(self,obj,e);
			});
			$("#"+addRowBtn.id).click(function(e){
				TableComponent__add_row(self);
			});
			$("#"+addColBtn.id).click(function(e){
				TableComponent__add_col(obj,self,_container.id);
			});
			$("#"+addDownloadBtn.id).click(function(e){
				elementTextDownloadAsFile("houstonvote_downloaded_file.txt", self.getTableAsString());
			})
			$("#"+addSaveBtn.id).click(function(e){
				Utils.toggleFullScreenLoader();
				if(!isNull(obj.save)){
					obj.save(self);
				}
				setTimeout(function(){
					Utils.toggleFullScreenLoader();
				},1500);
			});

		},self,true);
	}
	
	_container.appendChild(_table);
	this._props_._elements._fragment.appendChild(_container);

	if(!isNull(obj.bodyStyles)){
		_tbody.style = obj.bodyStyles;
	}

	var ap = document.createElement("span");
	ap.id = this.ID;
	this._props_._elements._fragment.appendChild(ap);

	
	
	
	
	
	
	
	
	

	this._props_._extensionObject.push(this._props_._modalDialog);
	

	this.getHtml = function(){
		return this._props_._elements._fragment.cloneNode(true);
	};

	
}

TableComponent.prototype = {

	getRowCellData: function(rowId){
		if(isNull(rowId) || rowId==false){
			return this._props_._tableStructure._row_cell_data;
		}else{
			return this._props_._tableStructure._row_cell_data[rowId];
		}
		
	},

	getColumnData: function(columnIndex){
		var isNull = Utils.isNull;
		
		
		
		
		
		
		
		
		if(isNull(columnIndex)){
			return this._props_._tableStructure._column;
		}else{
			return this._props_._tableStructure._column[columnIndex];
		}

		
	},


	/**
	* Create column
	* @param {Array}
	*/
	columns: function(arry){
		TableComponent_columns(arry,this);
	},

	reload: function(content){

	},

	getConnectedData: function(cellId){
		var isNull = Utils.isNull;
		if(!isNull(cellId)){
			return this._props_._tableStructure._connected_data[cellId];
		}else{
			return this._props_._tableStructure._connected_data;
		}
	},

	getAvailableConnectedData: function(){
		var data = this._props_._tableStructure._connected_data;
		var d = {};
		for(var i in data){
			if(data[i].available){
				d[i] = data[i];
			}
		}
		return d;
	},

	isModifiedConnectedData: function(isObj){
		var isNull = Utils.isNull;
		var data = this._props_._tableStructure._connected_data;
		var d = {};
		var length = 0;
		for(var i in data){
			length++;
			if(data[i].modified){
				d[i] = data[i];
			}
		}
		var is = false; 
		if(length>0){
			is = true;
		}
		if(!isNull(isObj) && isObj){
			return {
				is: is,
				length: length
			};
		}else{
			return is;
		}
		
	},

	getModifiedConnectedData: function(){
		var data = this._props_._tableStructure._connected_data;
		var d = {};
		for(var i in data){
			if(data[i].modified){
				d[i] = data[i];
			}
		}
		return d;
	},

	

	/**
	*  cellId:String - The DOM id of the cell
	*  connectId:String - The id/string that is in the cell
	*  type:String - Optionsa = text|file
	*  value:String - The value
	*  available:Boolean - Is this data available
	*  modified:Boolean - Data is available but has it been modified 
	*
	*/
	setConnectedData: function(cellId,connectId,type,value,available,modified){
		this._props_._tableStructure._connected_data[cellId] = {
			connectId: connectId,
			type: type,
			value:value,
			available: available,
			modified: modified
		};
	},

	clearModifiedConnectedData: function(){
		var data = this._props_._tableStructure._connected_data;
		var d = {};
		for(var i in data){
			if(data[i].modified){
				this._props_._tableStructure._connected_data[i].modified = false;
			}
		}
	},


	/**
	* Create row
	* @param {Array}
	*/
	row: function(obj){
		TableComponent_row(obj,this);
	},

	/**
	* Delete column from table
	* @param {Number} index of column to delete
	*/
	deleteRow: function(index){
		document.getElementById(this._tableId).deleteRow(index);
	},


	getRows: function(getObj){
		var isNull = Utils.isNull;
		if(isNull(getObj)){
			return this._props_._tableStructure._rowData;
		}else{
			if(getObj){
				return this._props_._tableStructure._rows;
			}else{
				return this._props_._tableStructure._rowData;
			}
		}
	},

	updateCell : function(cellId,newValue,updateOnDOM){
		
		
		this.updateRow(cellId,newValue,updateOnDOM);
	},

	updateRow: function(cellId,newValue,updateOnDOM){
		var isNull = Utils.isNull;
		
			
			
			
			
			


		
		var self = this;
		var found = false;  
		for(var i=0; i<this._props_._tableStructure._rows.length; i++){
			var rows = this._props_._tableStructure._rows[i].rows;
			for(var n=0; n<rows.length; n++){
				if(rows[n].id==cellId){
					this._props_._tableStructure._rows[i].rows[n].val = newValue;
					found = true;
					if(!isNull(updateOnDOM) && updateOnDOM==true){
						document.getElementById(cellId).innerHTML = newValue;
					}
					break;
				}
			}
			if(found==true) break;
		}
	},

	getColumnNames: function(){
		return this._props_._tableStructure._columnNames;
	},

	getColumns: function(){
		return this._props_._tableStructure._column;
	},

	/**
	* Returns a String representation of the table.
	* a newline is given for each row in the table.
	* 
	* @param {String } delemeter
	*/
	getTableAsString: function(delemeter){
		return TableComponent_getTableAsString(delemeter,this);
	}, 

	

	/**
	* Returns an object with the table object and the holder object.
	* The holder object is a uieb CUstomizerComponent
	*
	* If contents is nothing then this method will return a
	* uieb element with the no_conents_error_message displayed.
	* 
	* 
	* @param {String} delemeter
	*/
	createTable: function(withContainer,obj){
		var isNull = Utils.isNull;

		
			
			
				
			
			
			
			
			
			
			
			
		

		console.log(obj);

		

		
		var file_rows = obj.content.split("\n");
		
		

		if(file_rows.length==0){
			var cust = new ContainerComponent({
				styles: "margin-bottom:10%;",
				body:no_conents_error_message
			});
			

			return {holder:cust};
		}

		var columns = [];
		for(var i=0; i<1; i++){
			var row = file_rows[i].split("\t");
			for (var p = 0; p < row.length; p++) {
				columns[p] = {name:row[p]};
			}
			break;
		}

		var editable = (isNull(obj.editable)) ? false : obj.editable;

		
		var mode = (isNull(obj.mode)) ? "normal" : obj.mode;
		var tm = new ComponentFactory();
		var table = tm.table({
			updatable: true,
			editable: editable,
			mode: mode,
			columns: columns,
			save: obj.save,
			cellRequestForConnectedData: obj.cellRequestForConnectedData
		});

		
	
		var columnsData = [];
		
		for(var i=1; i<file_rows.length; i++){
			var row = file_rows[i].split("\t");
			
			
			



			for (var p = 0; p < row.length; p++) {
				columnsData[p] = {
					html: row[p]
				};
			}
			table.row({
				id:"table-row-id-"+Utils.randomGenerator(22,false),
				columnsData: columnsData
			});

			
		}
		
		
		var cust = new ContainerComponent({
			id: "h-"+Utils.randomGenerator(22,false),
			styles: "margin-bottom:10%;",
			body: table
		});

		if(!withContainer){
			return table;
		}else{
			return cust;
		}

	}
};












	





	









function TableComponent__add_col(obj,self,containerId){
	var isNull = Utils.isNull;

	var delemeter = self._props_._delemeter;
	var oldTable = self.getTableAsString();


	var form = "<label>Enter Column Name (required): </label><br>";
	form += "<input type='text' id='new-column-name-for-table' /><br>";
	form += "<label>Enter Default Value: </label><br>";
	form += "<input type='text' id='new-column-value-default' /><br>";
	form += "<button id='new-column-name-for-table-submit'>Submit</button>"; 

	var c = new ContainerComponent({ 
		body: form,
		callback: {
			type:'run',
			func: function(){
				$("#new-column-name-for-table-submit").click(function(e){

					var colName = $("#new-column-name-for-table").val().trim();
					var defaultValue = $("#new-column-value-default").val();

					if(colName=="") return;
					

					var firstRow = 0;
					var ot = oldTable.split("\n");

					var g = ot[0].split(delemeter);
					g.push(colName);
					var r = g.join(delemeter);

					var r1 = [];
					r1.push(r);
					for(var i=1; i<ot.length; i++){
						var g1 = ot[i].split(delemeter);
						
						g1.push(defaultValue);
						var g3 = g1.join(delemeter);
						r1.push(g3);
					}
					
					r1.pop();
					
					var newOldTable = r1.join("\n");

					

					console.log(newOldTable);

					

					
					var v = new ComponentFactory();
					var table = v.table().createTable(false,{
						updatable: obj.updatable,
						
						
						
						columns: obj.columns,
						content: newOldTable,
						delemeter: obj.delemeter,
						no_conents_error_message: obj.no_conents_error_message,
						filename: obj.filename,
						save: obj.save
					});
					

					if(document.getElementById(containerId)){
						$("#"+containerId).empty();
						$("#"+containerId).append(table.getHtml());
						table.initializeListeners();
					}





					
					
					
					
					

					
					
					
					
					

					
					

					
				});

				
			}
		}
	});
	
	
	
	
	
	


	

}
function TableComponent__column_adjustment(self,obj,e){
	var isNull = Utils.isNull;

	
	
	

	
	

	var tableEditMenu = new ContainerComponent();



	var id = "table-columns-dialog-"+Utils.randomGenerator(22,false);
	
	var cont = new ViewManager();
	cont.newSubView({
		id: "edit-select",
		layout: _x1(self,cont,tableEditMenu),
		init: true
	});
	cont.newSubView({
		id: "edit-menu",
		layout: tableEditMenu,
		init: false
	});

	var cust = comp.cust();
	cust.make({
		id: id,
		body: cont
	});


	
	
	
	
	
	

}
function _x1(self,cont,tableEditMenu){
	var comp = new ComponentFactory();

	var rows = self._props_._tableStructure._rows;
	var columns = self._props_._tableStructure._columnNames;

	var buttons = [];
	for(var i=0; i<columns.length; i++){
		_setupBtns(columns[i],i);
	}
	function _setupBtns(col,index){
		buttons[index] = comp.button({
			label: col,
			callback: function(){

				cont.render('edit-menu');
				tableEditMenu.addComponent(_editTableByGroup(col,self),true);

			}
		});
	}

	
	
	
	

	var cust = comp.container({
		body: buttons
	});

	
	var layout = LayoutManager.newLayout()
		.row()
		.col({md:12},[cust])
		.build(); 

	return layout;
}
function _editTableByGroup(button,self){
	var isNull = Utils.isNull;
	var comp = new ComponentFactory();
	var cust = comp.container();
	
	var matchColumnIndex = -1;
	var colNames = self.getColumnNames();
	for(var i=0; i<colNames.length; i++){
		if(button==colNames[i]){
			matchColumnIndex = i;
			break;
		}
	}

	var rows = self.getRows();
	var _rows = self.getRows(true);
	var select = [];
	for(var i=0; i<rows.length; i++){
		var row = rows[i];
		var val = row[matchColumnIndex];
		select[i] = val;
	}
	function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}
	var a = ['a', 1, 'a', 2, '1'];
	var unique = select.filter( onlyUnique ); 

	var selectElement = "<select id='select-something'><option></option>";
	for(var i=0; i<unique.length; i++){
		selectElement += "<option>"+unique[i]+"</option>";
	}
	selectElement += "</select>";

	var c2 = comp.cust();
	c2.make({});


	var c1 = comp.container({
		body: selectElement,
		callback: {
			type: 'run',
			func: function(){
				
				
				
				
				

				
				

					

				

				
				
				
				
				
				
				
				
				

				


				
				
				
				

				

				


					
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				

					


				
				
				
				
				
				

				
				
				
				
				
				
				
				
				
										
				
				

				

				
								


				
				
				

				

				

			}
		}
	});

	



	

	




	cust.addComponent('<h4>'+button+'</h4>');


	var layout = LayoutManager.newLayout() 
		.row()
		.col({},[cust])
		.row()
		.col({},[c1])
		.row()
		.col({},[c2])
		.build();



	
	return layout;
}
function _x2(){

	var cust = new ContainerComponent();
	return cust;
	
}
function TableComponent__add_row(self){
	var _columns = self._props_._tableStructure._columnNames;
	var _form = "";
	var _form_row_ids = [];
	for (var i = 0; i < _columns.length; i++) {
		var ran = Utils.randomGenerator(12,false);
		_form_row_ids[i] = 'new-row-'+i+'-'+ran;
		_form += '<label>'+_columns[i]+'</label>';
		_form += '<input type="text" id="'+_form_row_ids[i]+'" /><br>';
	}

	

	var r = "add-row-"+Utils.randomGenerator(7,false);
	_form += "<button id='"+r+"'>Add Row</button>";

	var c = new ComponentFactory(); 
	var cust = c.container({
		body: _form,
		callback: {
			type: 'run',
			func: function(){
				

				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
			}
		}
	});
	
	
	
	
	
	
	
}
function TableComponent_row(obj,self){
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	var isNull = Utils.isNull;


	
	var _row_names = [];
	var rowCount = self._props_._row_count++;
	var row_items = [];
	var row_ids = [];
	
	var _tr = document.createElement('tr');
	_tr.id = "table-"+Utils.randomGenerator(22,false);
	var col_names = self._props_._tableStructure._columnNames;
	if(col_names.length!=obj.columnsData.length){
		if(col_names.length > obj.columnsData.length){
			var start = col_names.length - obj.columnsData.length;
			for(var h=start+1; h<col_names.length; h++){
				if(!isNull(col_names[h])){
					obj.columnsData.push({html:"\t"});
				}
			}

		}
	}

	self._props_._tableStructure._row_cell_data[_tr.id] = [];
	
	
	var _rows = {
		ids:[],
		id: ""
	};
	for(var i=0; i<obj.columnsData.length; i++){
		_setupRow(obj.columnsData[i],i);
	}
	function _setupRow(col,index){
		var _td = document.createElement('td');
		_td.innerHTML = col.html;
		_row_names[index] = col.html;
		_td.id = "table-row-"+Utils.randomGenerator(22,false);
		
		_td.className = "uieb-table-cell";
		_rows.ids.push(_td.id);
		_tr.appendChild(_td);
		row_items[index] = col.html;
		row_ids[index] = _td.id;

		self._props_._tableStructure._row_cell_data[_tr.id].push({
			cellId: _td.id ,
			cellValue: col.html
		});

		
		var j = self.getColumnData(index);
		if(!isNull(j)){
			if(j.type=="remote"){
				self.setConnectedData(_td.id,col.html,"text","",false,false);
			}
		}
		
	}

	var rc = self._props_._tableStructure._rowCount;
	self._props_._tableStructure._rowData[rc] = _row_names;
	self._props_._tableStructure._rowCount++;

	
	var _rows = [];
	for(var i=0; i<row_ids.length; i++){
		_rows[i] = {
			id: row_ids[i],
			val: _row_names[i],
			col: self.getColumns()[i].name,
			type: self.getColumns()[i].type
		}
		if(self.getColumns()[i].type=="remote"){
			registerRemoteCells(row_ids[i]);
		}else{
			registerAllCells(row_ids[i]);
		}
		
	}
	function registerAllCells(id){
		
	}
	function registerRemoteCells(id){
		
		_Utils_registerListenerCallbackForSelf("click",id,function(data){
			data.e.stopPropagation();
			data.e.preventDefault();


			
			
			
			
			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
			
			
				
			

			
			
			
			

			
			
			
			
			
			
			
			
			
			
			
			

			
			
			
			
			
									
			
								
			
			
			
			
			
			
			
			
			
			
			
				
		},self,true);
	}
	
	self._props_._tableStructure._rows.push({
		column_line_num: self._props_._tableStructure._rowCount,
		rowId: _tr.id,
		rows: _rows,
	});


	function _updateRow(new_row_vals){
		self._props_._tableStructure._rowData[rc] = new_row_vals;
		for(var i=0; i<row_ids.length; i++){
			document.getElementById(row_ids[i]).innerHTML = new_row_vals[i];
		}
		
	}

	
	_Utils_registerListenerCallbackForSelf("click",_tr.id,function(data){


		if(!self._props_._updatable) return;
		var col_names = self._props_._tableStructure._columnNames;
		var row_items = self._props_._tableStructure._rowData[rc];
		var form = "";
		for(var k=0; k<row_items.length; k++){
			var id = "table-single-row-"+rowCount+"-"+k;
			form += "<label>"+col_names[k]+"</label>";
			form += "<input type='text' class='table-single-row"+rowCount+"' id='"+id+"' value='"+row_items[k]+"'><br>";
		}

		form += "<br><button id='change-table-row-"+rowCount+"'>Update</button>";

		

		var c = new ContainerComponent({ 
			body: form,
			callback: {
				type:'run',
				func: function(){
					$("#change-table-row-"+rowCount).click(function(e){
						var new_row_data = [];
						for(var b=0; b<row_items.length; b++){
							dosome(b);
						}

						console.log(self.getRowCellData()[_tr.id]);

						function dosome(indx){
							var val = $("#table-single-row-"+rowCount+"-"+indx).val().trim();
							new_row_data[indx] = val;
							
							var cellId = self.getRowCellData()[_tr.id][indx].cellId;
							self.updateCell(cellId,val,true);
						}

						

						

						

						
						self._props_._modalDialog.toggle();
					});
				}
			}
		});
		
		
		
		
		
		
	},self,true);

	_Utils_registerListenerCallback(obj,self,_tr.id,{
		rowId: rowCount,
		rowItems: row_items,
		updateRow: _updateRow
	});

	if(document.getElementById(self._props_._elements._tbody.id)){
		document.getElementById(self._props_._elements._tbody.id)
		.appendChild(_tr);
	}else{
		self._props_._elements._tbody.appendChild(_tr);
	}

	
	
	
	

	
	
	
	
	
	

	
	
	
	
		
	
	


	
	
 
 
 
    	

}

function TableComponent_getTableAsString(delemeter,self){

	var isNull = Utils.isNull;

	
			
			
			
			
			


		


	if(isNull(delemeter)){
		delemeter = "\t";
	}

	var rows = [];
	var rows1 = self.getRows(true);
	
	for(var i=0; i<rows1.length; i++){
		var r = rows1[i].rows;
		var setRow = [];
		for(var n=0; n<r.length; n++){
			setRow.push(r[n].val);
		}
		rows.push(setRow);
	}

	var colNames = self._props_._tableStructure._columnNames;
	var columns = colNames.join(delemeter);
	var str = columns+"\n";
	for(var i=0; i<rows.length; i++){
		var row = rows[i].join(delemeter);
		str = str+""+row+"\n";

	}

	return str;

	

	


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}





































/** @exports CMSUsers
* @classdesc A component that handles multiple components with in one view.
* @class
* @constructor
*/
function CMSUsers(){

}
CMSUsers.prototype = {

	/**
	*	registration
	*/
	registration: function(){},

	/**
	*	signIn
	*/
	signIn: function(){},

	/**
	*	member
	*/
	member: function(){}

}


/** @exports CMSManager
* @classdesc A component that handles multiple components with in one view.
* @class
* @constructor
*/
function CMSManager(){

}
CMSUsers.prototype = {


}




/* Utils */

/** 
* @exports Utils
*/
var Utils = {

	createElement: function(type,options){
		return Utils_createELement(type,options);
	},


	/**
	*	randomGenerator
	*/
	isNull: function isNull(obj){
		var check = true;
		if(obj!=undefined && obj!=null){
			check = false;
		}
		return check;
	},

	/**
	*	randomGenerator
	*/
	removeSelector: function(selector){
		if(selector.charAt(0)=="#" || selector.charAt(0)=="."){
			selector = selector.slice(1);
		}
		return selector;
	},

	/**
	*	randomGenerator
	*/
	randomGenerator: function(len,specialChars){
		return Utils_randomGenerator(len,specialChars);
	},

	/**
	* Convert string to HTML element
	*
	* @return {String}
	*/
	convertStringToHTMLNode: function(string,isFrag){
		return Utils_convertStringToHTMLNode(string,isFrag);
	},

	/**
	*	Convert DOM element to string
	*
	* @return {DOMElement}
	*/
	convertFragmentToHTMLText: function(fragment){
		return Utils_convertFragmentToHTMLText(fragment);
	},

	/**
	* Determins if String contains special characters
	* The first parameter is the string to match against.
	* The secound paramters [optional] is an array of
	* exceptions. Special character include those specified
	* by Support.Utils.specialChars array.
	* The third and fourth params determines if the charExecptions
	* can begin and/or end with the exception characters.
	* If multiples is false then exception characters cannot have
	* special characters side by side.
	*
	* Change to check every character to see if it is an alpha numaric character insteed
	* checking for the special characters
	*/
	containsSpecialChars: function(str, charExceptions, canBegin, canEnd, multiples){
		return Utils_containsSpecialChars(str, charExceptions, canBegin, canEnd, multiples);
	},

	/**
	* An Array of special characters
	*
	*/
	specialChars: ["!","@","#","$","%","^","&","*","(",")",
			  "+","=","~","`","{","}","[","]","|","\\",
			  ";",":","'","\"","<",">",",","?","/",
			  "-","_"," ","."],

	/**
	* Test if character is valid
	* 
	* @return {Boolean} - isValid
	*/  
	validKey: function(key){
		return Utils_validKey(key);
	},

	/**
	* Allowed characters
	* 
	* @return {Object}
	*/ 
	allowOnlyCharacters: function(str){
		return Utils_allowOnlyCharacters(str);
	},

	/**
	* Reverse an object.
	* 
	* @return {Object}
	*/ 
	reverseObject: function(obj, f){
		var arr = [];
		var tmp = {};
		for(var key in obj){
			arr.push(key);
		}
		for(var i=arr.length-1; i>=0; i--){
			var key = arr[i];
			tmp[key] = obj[key];
			f.call(obj,key);
		}
		return tmp;
	},

	/**
	* Get image dimensions.
	*
	* @param {FileObject} - Image file 
	* @param {Function} - Callback 
	* @return {Object}
	*/ 
	getImageDimensions: function(file1,callback){
		var _URL = window.URL || window.webkitURL;
		var img;
		var obj = {};
		
	          img = new Image();
	          img.onload = function () {
	             console.log(this.width + " " + this.height);
	             obj['width'] = this.width;
	             obj['height'] = this.height;
	             callback(obj);
	          };
	         	img.src = _URL.createObjectURL(file1);
		

		return obj;
	},

	/**
	* Get time as a string example "04:46:27 PM".
	*
	* @return {String} time
	*/ 
	getClockTime: function(){
		return Utils_getClockTime();
	},


	/**
	* Calculates a persons age give thier birthday.
	* var bday = new Date('07/28/1984');
	* var age = calculageAge(bday);
	*
	* @param {Date} - birthday
	* @return {Number} - age
	*/ 
	calculateAge: function(birthday) { 
	    var ageDifMs = Date.now() - birthday.getTime();
	    var ageDate = new Date(ageDifMs); 
	    return Math.abs(ageDate.getUTCFullYear() - 1970);
	},



	/**
	* Detects browser !may not work properly 
	*
	*/ 
	detectEngine: function(){
		return Utils_detectEngine();
	},

	/** 
	* Count how bytes are in a string
	*/
	byteCount: function(s) {
	    return encodeURI(s).split(/%..|./).length - 1;
	},

	/**
	* Remove newline characters
	*
	* @param {String} - String to parse
	* @return {String} 
	*/
	removeNewLines: function(d,endAlso){
		var content = d.replace(/(\r?\n|\r)+/, '');
		if(Utils.isNull(endAlso) || endAlso==true){
			content = content.replace(/(\r?\n|\r)+$/, '');
		}
		return content;
	},

	/**
	* Determins if an array has duplicates.
	*
	* @return {Boolean}
	*/
	doesArrayContainDuplicate: function(a){
	    var counts = [];
	    for(var i = 0; i <= a.length; i++) {
	        if(counts[a[i]] === undefined) {
	            counts[a[i]] = 1;
	        } else {
	            return true;
	        }
	    }
	    return false;
	},


	/**
	* Truncate decimal place goo for things like 
	* $5.99
	*
	* @param {Number}
	* @param {Number}
	* @return {Number}
	*/
	truncateDecimalNumber: function(number,decimalPlaces){
		if(typeof Number.prototype.toFixedDown !== "undefined"){
			Number.prototype.toFixedDown = function(digits) {
			    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
			        m = this.toString().match(re);
			    return m ? parseFloat(m[1]) : this.valueOf();
			};
		}
		return number.toFixedDown(decimalPlaces);
	},

	/**
	* Formates bytes into either KB,MB,GB,TB,PB,EB,ZB,YB
	*
	* @return {Number}
	*/
	formatBytes: function(bytes,decimals) {
	   if(bytes == 0) return '0 Byte';
	   var k = 1000; 
	   var dm = decimals + 1 || 3;
	   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	   var i = Math.floor(Math.log(bytes) / Math.log(k));
	   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	},

	/**
	* getFileSize 
	*
	*/
	getFileSize: function(file){
		
	    
	    console.log("File " + file.name + " is " + file.size + " bytes in size");

	    var isToBig = formatBytes(file.size);
	    var file_size = isToBig.split(" ")[0];
	    var file_m = isToBig.split(" ")[1];

	    var sizesToBig = ['GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	    var sizeNotToBig = true;
	    for(var i=0;i<sizesToBig.length;i++){
	    	if(file_m==sizesToBig[i]) sizeNotToBig = false;
	    }

	    if(!sizeNotToBig) return "file size to big";

	    if(file_m=="MB"){
	    	if(file_size>22) return "file size to big";
	    }
	},

	/**
	* Determins if files are too big.
	*
	* @param {Files} - file
	* @param {String} - maxSize Bytes,KB,MB,GB,TB,PB,EB,ZB,YB
	* @return {Object} - size:String|isOver:boolean
	*/
	validatefilesize: function(file, maxSize){
		
		var sizeAmount = maxSize.split(" ")[0];
		var sizeType = maxSize.split(" ")[1];
	     var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var maxsize = "incorrect size";
		var sizeIndex;
		for(var i=0; i<sizes.length; i++){
			if(sizeType.toLowerCase().trim()==sizes[i].toLowerCase().trim()){
				maxsize = sizes[i].toLowerCase().trim();
				sizeIndex = i;
			}
		}
		if(maxsize == "incorrect size") {
			return "incorrect size given - 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'"
		}

		var totalFileSize = 0;
		for(var i=0;i<file.length;i++){
			totalFileSize += Number(file[i].size);
		}
		var filesize = Utils.formatBytes(totalFileSize);
		var filesizeAmount = filesize.split(" ")[0];
		var filesizeType = filesize.split(" ")[1];
		var fileToBig = false;
		sizeIndex++;
		for(var i=sizeIndex; i<sizes.length; i++){
			if(filesizeType.toLowerCase().trim()==sizes[i].toLowerCase().trim()){
				fileToBig = true;
			}
		}
		if(filesizeType.toLowerCase().trim()==sizeType.toLowerCase().trim()){
			if(Number(sizeAmount)<Number(filesizeAmount)){
				fileToBig = true;
			}
		}

		return {
			size: filesize,
			isOver: fileToBig
		};

	},

	forLoop: function(length,callback,backwards,id,breakmax){
		var isNull = Utils.isNull;
		var breakCount = 0;
		var breakMax = (!Utils.isNull(breakmax)) ? breakmax : 300;
		if(length>=breakMax){
			breakMax = length + breakMax;
		}
		if(isNull(backwards) || backwards==false){
			for(var i=0; i<length; i++){
				breakCount++;
				if(breakCount>breakMax){ 
					console.error("Loop is Broken - " + id);
					break; 
				}
				var b = callback(i);
				if(!Utils.isNull(b) && b==true){
					break;
				}
			}
		}else{
			for(var i=0; i<length; i--){
				breakCount++;
				if(breakCount>breakMax){ 
					console.error("Loop is Broken - " + id);
					break; 
				}
				var b = callback(i);
				if(!isNull(b) && b==true){
					break;
				}
			}
		}
		


	}




};



/* _Utils */

/**
*
*/
var _registered_listeneres_ = [];
var _Utils = {
	registerListenerCallbackForSelf: function(type,selector,func,self,preventDefault,stopPropagation){
		_Utils_registerListenerCallbackForSelf(type,selector,func,self,preventDefault,stopPropagation);
	},
	
	registerListenerCallback: function(obj,self){
		_Utils_registerListenerCallback(obj,self);
	}
};
























/* 0000 - ApplicationManager */
function ApplicationManager_start(runApplicationFunction,self){
	ApplicationManager_start_createDiv(self);
	try{
		ApplicationManager_start_runInterval(self);
	}catch(e){
		console.log(e);
	}
	
	runApplicationFunction();
}
function loadUpFiles(base,files){
	
	
	for(var i in files){
		_load(i,files[i]);
	}
	function _load(alias,filePath){  
		var file;
		if(base == "" || base==null){
			file = files[alias];
		}else{
			file = base+"/"+files[alias];
		}
		readTextFile(file,function(content,xrh){
			applicationManager.setFileContents(alias,content);
		});
	}
}
function readTextFile(file,callback){
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function (){
	   if(rawFile.readyState === 4) {
		  if(rawFile.status === 200 || rawFile.status == 0){
			 var allText = rawFile.responseText;
			 callback(allText,rawFile);
		  }
	   }
    }
    rawFile.send(null);    
}
function ApplicationManager_start_createDiv(self){
	$('body').append(self.getRootElement());
}
var CONNECTED_COMPONENTS = [];

function ApplicationManager_start_runInterval(self){  

	var interval = setInterval(function(){ 
		
		var components = self.getComponents();
		for(var i=0;i<components.length;i++){
			if(document.getElementById(components[i].id)){

				

				
				
				if(CONNECTED_COMPONENTS.includes(components[i].id) === false){
					
					
					components[i].component.initializeListeners();
					
					CONNECTED_COMPONENTS.push(components[i].id);
					var comp = components[i].component._props_._dom_events;

					
					ApplicationManager_start_handleAttachEvents(comp,components[i].component);
				}
			}else{
				components[i].component.deInitializeListener();
				if(CONNECTED_COMPONENTS.includes(components[i].id) === true){
					var index = CONNECTED_COMPONENTS.indexOf(components[i].id);
					if (index > -1) {
					    CONNECTED_COMPONENTS.splice(index, 1);
					    var comp = components[i].component._props_._dom_events;
					    ApplicationManager_start_handleDeAttachEvents(comp);
					    components[i].component._props_._event_flag = false;
					}
				}
			}
		}
		
	}, 100);

}
function ApplicationManager_start_handleAttachEvents(comp,component){
	if(!Utils.isNull(comp)){
		if(comp._addToDOMEventOnce && comp._addToDOMCount < 1 ){
			comp._addToDOMCount++;
			comp._addToDOMEventOnce();
		}
		if(comp._addToDOMEvent){
			if( Array.isArray( comp._addToDOMEvent )){
				for(var k=0;k<comp._addToDOMEvent.length; k++){
					
					comp._addToDOMEvent[k]();
				}
			}else{
				comp._addToDOMEvent();
			}
		}
	}
}
function ApplicationManager_start_handleDeAttachEvents(comp){
	if(!Utils.isNull(comp)){
		if(comp._removeFromDOMEventOnce && comp._removeFromDOMCount < 1){
			comp._removeFromDOMCount++;
			comp._removeFromDOMEventOnce();
		}
		if( Array.isArray( comp._removeFromDOMEvent )){
			for(var k=0;k<comp._removeFromDOMEvent.length; k++){
				comp._removeFromDOMEvent[k]();
			}
		}else{
			comp._removeFromDOMEvent();
		}
	}

}
function ApplicationManager_templateParser(htmlString,replacements,self){
	
	
	var res = htmlString;
	var regex = /\$(.*?)\$/g;
	var matched = regex.exec(htmlString);
	while(matched != null){
		for(var i in replacements){
			if(matched[1]==i){
				res = res.replace(matched[0],replacements[i]);
			}
		}
		matched = regex.exec(htmlString);
	}
	return res;
}




function StateManager_buidRoutes(self){
	var routes = {};
	var router = {}
	router['initialize'] = function(){

	};
	router['changeView'] = function(view){
		if(this.currentView){
			return;
		}
		this.currentView.remove();
		$('body').append(view.render.render().el);
		this.currentView = view;
	}; 

	
	for(var r in self._state_manager._routes){
		var funcName = "func"+Utils.randomGenerator(7,false);
		
		routes[r] = funcName;
		var lastChar = r.charAt(r.length-1);
		if(lastChar!="/"){ 
			var r2 = r+"/";
			
			routes[r2] = funcName;
		}
		
		
		var meth = self._state_manager._routes[r];
		
		router[funcName] = meth;
	}

	router['routes'] = routes;
	self._state_manager._routerConfig = router;

	var Router = Backbone.Router.extend(self._state_manager._routerConfig);
	self._state_manager._router = new Router();
	Backbone.history.start();

	return router;
}








/* 0000 - ComponentManager */
function AppComponent_getHtml(self,route){

	return document.createElement('div');
	
	
	
	
	
	
	
}

function AppComponent_getHtml_view_fragment(self,route){
	
}
function AppComponent_getHtml_layout_fragment(self,route){
	return self._props_._elements._fragment.cloneNode(true);
}

function AppComponent_getHtml_component_fragment(self,route){
	var obj = self._props_._obj;
	var bodies = [];
	self._props_._container = document.createElement('div');
	self._props_._container.id = (!Utils.isNull(obj) && !Utils.isNull(obj.id)) ? obj.id : "";
	if(!Utils.isNull(obj)){
		if(!Utils.isNull(obj.classes)){
			self._props_._container.className = obj.classes;
		}
		if(!Utils.isNull(obj.style)){
			self._props_._container.style = obj.style;
		}
	}
	var createdBody;
	if(Array.isArray(obj.body)){
		for(var i=0; i<obj.body.length; i++){
			console.log(obj.body[i]);
			createdBody = _create_body({body: obj.body[i] });
			self._props_._container.appendChild(createdBody);
		}
	}else{
		createdBody = _create_body({body: obj.body});
		self._props_._container.appendChild(createdBody);
	}
	var span = Utils.createElement('span',{id:self.getId()});
	self._props_._container.appendChild(self._props_._loader_el);
	self._props_._container.appendChild(span);

	var fragment = document.createDocumentFragment();
	fragment.appendChild(self._props_._container);
	self._props_._elements._fragment = fragment;
	return self._props_._elements._fragment.cloneNode(true);
}

function _create_body(object){
	var body = object.body;
	var template = (Utils.isNull(object.template)) ? "" : object.template;
	var obj = (Utils.isNull(object.obj)) ? {} : object.obj;
	

	var mBody;
	if(typeof body === "string"){
		if(body.charAt(0) === "@"){
			var view = _getView(body,obj);
			if(Utils.isNull(view)){ return; }
			if(!Utils.isNull(object.original) && object.original==true){
				return view;
			}else{
				return view.getHtml();
			}
			
		}else if(body.charAt(0) === "&"){
			var p = body.substr(1);
			var t = applicationManager.getLoadedFileContents(p);
			t = applicationManager.templateParser(t,template);
			var view = Utils.convertStringToHTMLNode(t);
			return view;
		}else{
			var view = Utils.convertStringToHTMLNode(body);
			return view;
		}
	}else if(typeof body === "object"){
		if(!Utils.isNull(body.TYPE)){
			if(Utils.isNull(object.original) && object.original==true){
				return body;
			}else{
				return body.getHtml();
			}
		}else{
			return body;
		}
	}
}
function getAppFactoryHTML(body,obj){
	obj = (obj) ? obj : {};
	var mBody = null;
	if(typeof body === "string"){
		if(body.charAt(0) === "@"){
			var view = _getView(body,obj);
			mBody = convertIntoAppFactoryObject(view);
		}else{
			mBody = convertIntoAppFactoryObject(body);
		}
	}else if(typeof body === "object"){
		if(Utils.isNull(body.TYPE)){
			mBody = body;
		}else{
			mBody = convertIntoAppFactoryObject(body);
		}
	}
	return mBody;
}
function convertIntoAppFactoryObject(body){
	var mBody;
	if(!Utils.isNull(body.TYPE)){
		return body;
	}
	mBody = Utils.convertStringToHTMLNode( body );
	return mBody;
}
function _getView(body,obj){
	var bodyWithoutAt = body.slice(0);
	var params = (!Utils.isNull(obj) && obj.params) ? obj.params : {};
	var paramValues = null;
	for(var i in params){
		if(i==body || i==bodyWithoutAt){
			paramValues = params[i];
			break;
		}
	}

	
	var method = body.slice(1);
	var v = applicationManager.getMethod(method)(paramValues);
	return v;
}
function AppComponent_initializeListeners(self,myComponent){

	
	
	
	
	
	
	
	if(self._props_._isEventsActive == true) return;
	self._props_._isEventsActive = true;
	for(var i=0;i<self._props_._events.length;i++){
		var eventObj = self._props_._events[i];
		_initialize_event(eventObj);
	}

	self._props_._event_flag = true; 
	function _initialize_event(eventObj){
		if(eventObj.type=="run"){
			eventObj.func({
				data: eventObj,
				self: self,
				args: self._props_._args
			});
		}else{
			
			$(eventObj.selector).on(eventObj.type,function(e){
				if(!Utils.isNull(eventObj.preventDefault) && eventObj.preventDefault==true){
					e.preventDefault();
				}
				if(!Utils.isNull(eventObj.stopPropagation) && eventObj.stopPropagation==true){
					e.stopPropagation();
				}
				var d = {
					data: eventObj,
					self: self,
					args: self._props_._args
				};
				d["event"] = e;
				if(!Utils.isNull(eventObj.func)){
					eventObj.func(d);
				}else
				if(!Utils.isNull(eventObj.callback)){
					eventObj.callback(d);
				}
			});
		}
	}
}
function AppComponent_deInitializeListener(self){
	self._props_._isEventsActive = false;
}

function ContainerComponent_setActive(active,stillSet,self){
	var containerId = self._props_._loader_id;
	var spinnerId = self._props_._spinner_id;
	var containerClass = self._props_._loader_container_class;
	var spinnerClass = self._props_._loader_spinner_class;
	if(stillSet==undefined || stillSet==false){
		if(document.getElementById(containerId)){
			m();
		}
	}else if(stillSet!=undefined && stillSet==true){
		if(document.getElementById(containerId)){
			mak();
		}else{
			self.onAttachOnceListener(function(){
				m();
			});
		}
	}
	function m(){
		if(!active){
			
			$("#"+containerId).addClass(containerClass);
			$("#"+spinnerId).addClass(spinnerClass);
			var offset = "-"+$("#"+containerId).offset().top+"px";
			document.getElementById(containerId).style.top = offset
			
		}else{
			$("#"+containerId).removeClass(containerClass);
			$("#"+spinnerId).removeClass(spinnerClass);
		}
		self._props_._active = active;
	}
}






/* 0000 - Pages */
function Pages_init(self){
	var obj = self._props_._initial_view
	var hash = window.location.hash.substring(1);
	console.log(hash);
	if(hash==""){
		var baseRoute = obj.baseRoute;
		self.render(baseRoute);
	}else{
		self.render(hash);
	}
}
function Pages_newPageView(obj,self){

	
	
	
	
	
	

	var baseRoute = "";
	if(!Utils.isNull(obj.baseRoute)){
		baseRoute = obj.baseRoute;
	}
	if(!Utils.isNull(obj.routes)){
		setupRoutes();
	}

	if(!Utils.isNull(obj.init)){
		if(obj.init == true){
			self._props_._initial_view = obj;
		}
	}else{	
		obj.init = false;
	}

	function setupRoutes(){
		for (var i in obj.routes) {
			var route = baseRoute;
			if(i != "") route = baseRoute+"/"+i;
			var layout = obj.routes[i];
			if(typeof layout === "string"){
				
				
				_setRouteWithMethod(route,layout);

			}else if(typeof layout === "object"){
				_setRouteWithMethod(route,layout.layout,layout.transition);
			}
		}
	}

	function _setRouteWithMethod(route,layout,transition){
		stateManager.mapRoute(route,layout);
		if(!Utils.isNull(transition)){
			stateManager.mapTransition(route,layout);
		}
		
		stateManager.addRoute(route,function(){
			var args = arguments;
			var _allRoutes = function(){
				var allRoutes = [];
				for(var k in stateManager.getRouterConfig().routes){
					allRoutes.push(k);
				}
				return allRoutes;
			}();
			var _params = function(){
				var params1 = [];
				for(var k=0; k<args.length; k++){
					if(!Utils.isNull(args[k]))
						params1.push(args[k]);
				}
				return params1;
			}();
			var _registeredLayout = function(){
				var lay = layout.split(" ");
				var registeredLayout = "";
				for (var i = 0; i < lay.length; i++) {
					if(lay[i].length > 0){
						registeredLayout = lay[i];
						break;
					}
				}

				return registeredLayout;
			}();

			var obj = {  
				"route": route,
				"routes": _allRoutes,
				"params": _params
			};
			pages.setRoute(obj); 



			

			var layoutComponent = applicationManager.retrieve(_registeredLayout,Flags.Method)(obj);
			$(applicationManager.getRootElement()).empty();
			$(applicationManager.getRootElement()).append(layoutComponent.getHtml());
				
			

			setTimeout(function(){
				var lay = layout.split(" ");
				for (var i = 0; i < lay.length; i++) {
					if(lay[i].includes("=")){
						var c = lay[i].split("=");
						var comp = buildBody(c[1],layoutComponent);
						if(!Utils.isNull(comp)){
							if(comp.TYPE){
								$(c[0]).append(comp.getHtml());
							}else{
								$(c[0]).append(comp);
							}
						}
					}
				}
			},100);
			
		
		});
	}
}
function Pages__get(){

	
	if(Array.isArray(obj.body)){
		for(var i=0; i<obj.body.length; i++){
			_setup(obj.body[i]);
		}
	}else{
		_setup(obj.body);
	}

	function _setup(body){
		if(typeof body === "string"){
			if(body.charAt(0) === "@"){
				var params = (obj.params) ? obj.params : {};
				var view = applicationManager.get(body.slice(1),params);
				_setup(view);
			}else{
				body = Utils.convertStringToHTMLNode( body );
				$(applicationManager.getRootElement()).append(body);
			}
		}else if(typeof body === "object"){
			if(Utils.isNull(body.TYPE)){
				self._props_._extensionObject.push( body );
				$(applicationManager.getRootElement()).append(body.getHtml());
			}else{
				$(applicationManager.getRootElement()).append(body);
			}
		}
	}

}




/* 0000 - ViewManager */
function ViewManager_render(id,opts,self){
	var trigger = false;
	var replace = true;
	var addComponentBody = null;
	opts = (opts) ? opts : {};
	var params = (opts.params) ? opts.params : null;
	
	

	var mOpts = null;
	for (var i = 0; i < self._props_._views_objects.length; i++) {
		if(id == self._props_._views_objects[i].id){
			mOpts = self._props_._views_objects[i];
			break;
		}
	}
	if(mOpts){ 
		self._props_._active_view = mOpts;
		var _options = {};
		if(params && typeof mOpts.body==='string'){
			_options.body = [mOpts.body,params];
		}else{
			_options.body = mOpts.body;
		}
		var mBody = buildBody(_options,self);
		self._props_._containers.addComponent(mBody,replace);
		if(mOpts.routable==true){
			var route = getNewRoute(id,self);
			stateManager.go(route,trigger);
		}
	}
}
function getNewRoute(id,self){
	var hash = window.location.hash;
	var current_route = self.getCurrentViewInRoute();
	var route = "";
	var routeFromId = self.getRouteFromId(id);

	if(current_route!=null){
		route = hash.replace(current_route.trim(),routeFromId.trim());
	}else{
		route = hash+"/"+routeFromId;
	}
	return route;
}
function MultiView_getCurrentViewInRoute(self){
	var routes = window.location.hash.split("/");
	
	var views = self._props_._views_objects;
	var current_route = null;
	var breakMe = false;
	for(var i=1; i<routes.length; i++){
		for(var n=0; n<views.length; n++){
			if(routes[i]==views[n].route){
				current_route = views[n].route;
				breakMe = true;
				break;
			}
			if(breakMe) break;
		}
	}
	return current_route;
}
function MultiView_getRouteFromId(id,self){
	var views = self._props_._views_objects;
	var route = "";
	for(var i=0; i<views.length; i++){
		if(views[i].id==id){
			route = views[i].route;
		}
	}
	return route;
}
function MultiView_getView(id,self){
	var views = self._props_._views_objects;
	var view = null;
	for(var i=0; i<views.length; i++){
		if(views[i].id==id){
			view = views[i];
		}
	}
	return view;

}






/* 0000 - ContainerComponent */

/**
* The constructor can except 3 types of arguments the first is
* a string html, second is a dom node and the third is a appfactory
* object. 
*
*
*/
function ContainerComponent_constructor(obj,self){


}

function ContainerComponent_addComponent(component,isEmpty,self){
	if( document.getElementById(self.getId()) ){
		addToDOM();
	}else{
		self.onAttachOnceListener(function(){
			addToDOM();
		});
	}
	function addToDOM(){
		if(!Utils.isNull(isEmpty) && isEmpty==true){
			$("#"+self.getId()).empty();
		}
		$("#"+self.getId()).append(component.getHtml());
		component.initializeListeners();
	}
}






/* 0000 - FormComponent */
function FormComponent_constructor(obj,self){

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	var formhandler = new ContainerComponent();
	var formId = self.getId();

	var container = Utils.createElement({});
	var form = Utils.createElement('form',{
		id: formId,
		novalidate:false,
		className:"needs-validation"
	});
	self._props_._form = form;
	self._props_._formId = formId;
	container.appendChild(self._props_._form);
	container.appendChild(formhandler.getHtml());
	self._props_._elements._container = container;
	self._props_._form_handler = formhandler;

	

	self._props_._form_data = {};
	self._props_._values = {};

	
	

	self._props_._defaultValue = (obj.defaultValue==undefined) ? "none" : obj.defaultValue;

	self._props_._runs = {};
	self._props_._runs._intervals = (obj.intervals==undefined) ? 1000 : obj.intervals;
	self._props_._runs._times = (obj.timeout==undefined) ? 5 : obj.timeout;
	self._props_._runs._count = 0;

	self._props_._triggers = {
		reset: "form:reset:"+Utils.randomGenerator(6,false),
		submit: "form:submit:"+Utils.randomGenerator(6,false)
	};

	var tag = self.getId();

	var isSet = sessionStorage.getItem(tag);
	if(Utils.isNull(isSet)){
		sessionStorage.setItem(tag,JSON.stringify({}));
	}

	self._props_._tag = tag;
	self._props_._prevent_remember = false;


	
	var hasBeenClicked = false;
	function run2(){
		var areAllValuesIn = handleStatus(self);
		if(areAllValuesIn){
			var validation = self._props_._form_data;
			var isValid = true;
			for(var i in validation){
				if(!validation[i].isValid){
					isValid = false;
				}
			}
			var obj = {
				values: self._props_._values,
				formData: self._props_._form_data,
				isValid: isValid
			};
			self._props_._onsubmit_callback(obj);
		}
		return areAllValuesIn;
	}
	function run(){
		if(hasBeenClicked){
			return;
		}
		document.getElementById(self._props_._submit_button_id).disabled = true;
		hasBeenClicked = true;
		var allIn = false;
		var clearAfterCount = 50;
		var afterCount = 0;
		var interval = setInterval(function(){
			afterCount++;
			if(afterCount>clearAfterCount){
				clearFormSubmitInerval();
			}
			if(!allIn){
				allIn = run2();
			}else{
				clearFormSubmitInerval();
			}

			if(self._props_._runs._count>=self._props_._runs._times){
				clearFormSubmitInerval();
			}
			self._props_._runs._count++;
		},100);

		function clearFormSubmitInerval(){
			hasBeenClicked = false;

			var sb = document.getElementById(self._props_._submit_button_id);
			if(!Utils.isNull(sb)){
				sb.disabled = false;
			}
			clearInterval(interval);
			self._props_._runs._count = 0;
		}
	}

	self._props_._form_handler.on(self._props_._triggers.submit, function(){
		var yes = run2();
		if(!yes) run();
	});

	function handleStatus(self){
		var areAllValuesIn = true;
		var triggers = self._props_._form_data;

		for(var i in self._props_._form_data){
			var status = triggers[i].status;
			
			
			
			
			if(status!=1){
				areAllValuesIn = false;
				break;
			}
		}
		return areAllValuesIn;
	}
}
function FormComponent_update(tag,value,self){
	var form_element = self._props_._form_data[tag];
	if(Utils.isNull(form_element)) return false;
	var type = form_element.type;
	if(type=='input'){
		var selector = form_element.formElement.selector
		$(selector).val(value);
	}
}
function FormComponent_getFormElements(self){
	var data = self._props_._form_data;
	var elements = [];
	for(var i in data){
		var layout_default = {row: true,col: {md:12}}
		if(!Utils.isNull(data[i].layout)){
			layout_default = data[i].layout;
		}
		var layout = layout_default;
		elements.push({element:data[i].component,layout:layout});
	}
	return elements;
}


function FormComponent_build(pages,self){
	if(!Utils.isNull(pages)){
		handleFormPageBuild(pages,self);
	}else{
		handleFormNormalBuild(self);
	}
}
function handleFormNormalBuild(self){
	var elements = self.getFormElements();
	var layout = layoutManager.newLayout();
		layout.row();
	for( var i=0; i<elements.length; i++ ){
		var layRow = elements[i].layout.row;
		var layCol = elements[i].layout.col;
		var comp = elements[i].element;
		if(!Utils.isNull(layRow) && layRow==true){
			layout.row();
		}
		layout.col(layCol,[comp]);
	}
	layout.row();
	layout.col({md:12},[self._props_._submit_button]);
	layout.build();
	
	self._props_._form.appendChild(layout.getHtml());
	
	
}



function handleFormPageBuild(pages,self){
	var view = new ViewManager({routable:false});
	for(var i=0; i<pages.length; i++){
		var page = pages[i];
		var elements = [];
		var viewId = "view-"+i;

		add_label_to_elements(i,page,elements);
		add_to_elements(i,page,elements);
		var container = new ContainerComponent({body: elements});
		add_pages(i,elements,view,page);
		add_submit(i,pages,elements);
		add_view(i,viewId,container,page);

	}


	function add_label_to_elements(index,page,elements){
		if(!Utils.isNull(page.label)){
			if(typeof page.label === 'string'){
				var label = Utils.createElement({
					el: 'label',
					innerHTML: page.label
				});
				elements.push(label);
			}else{

			}
		}
	}
	function add_to_elements(index,page,elements){
		for(var n=0; n<page.tags.length; n++){
			var tag = page.tags[n];
			var el = getFromElementFromTag(tag);
			if(el==null) continue;
			var formElement = el.formElement;
			elements.push(el.component);
		}
	}
	function add_submit(index,pages,elements){
		if((index+1)==pages.length){
			elements.push(rowCols(self._props_._submit_button.getHtml()));
		}
	}
	function rowCols(el){
		var row = Utils.createElement({
			el: 'div',
			style: 'margin-top: 2%;',
			className: 'row'
		});
		var col = Utils.createElement({
			el: 'div',
			className: 'col-md-12'
		});
		col.appendChild(el);
		row.appendChild(col);
		return row;
	}

	function add_pages(index,elements,view,page){
		
		

		var row = Utils.createElement({
			el: 'div',
			style: 'margin-top: 2%;',
			className: 'row'
		});
		if(index>0){
			var bb = _addBackButton();
			var col1 = Utils.createElement({
				el: 'div',
				className: 'col-md-2'
			});
			col1.appendChild(bb.getHtml());
			row.appendChild(col1);
		}
		if(index<(pages.length-1)){
			var nb = _addNextButton();
			var col2 = Utils.createElement({
				el: 'div',
				className: 'col-md-2'
			});
			col2.appendChild(nb.getHtml());
			row.appendChild(col2);
		}
		elements.push(row);

		function _addBackButton(){
			var backLabel = "Back";
			var backBtnStyle = "";
			var backBtnClass = "";
			if(!Utils.isNull(page.back)){
				if(!Utils.isNull(page.back.label)){
					backLabel = page.back.label;
				}
				if(!Utils.isNull(page.back.style)){
					backBtnStyle = page.back.style;
				}
				if(!Utils.isNull(page.back.className)){
					backBtnClass = page.back.className;
				}
			}
			var backButton = new ButtonComponent({
				label: backLabel,
				style: "width:100%; "+backBtnStyle,
				className: backBtnClass,
				listener: function(e){
					e.event.preventDefault();
					view.render("view-"+(index-1));
				}
			});
			return backButton;
			
		}

		
		function _addNextButton(){
			var nextLabel = "Next";
			var nextBtnStyle = "";
			var nextBtnClass = "";
			if(!Utils.isNull(page.next)){
				if(!Utils.isNull(page.next.label)){
					nextLabel = page.next.label;
				}
				if(!Utils.isNull(page.next.className)){
					nextBtnClass = page.next.className;
				}	
				if(!Utils.isNull(page.next.style)){
					v = page.next.style;
				}				
			}

			var nextButton = new ButtonComponent({
				label: nextLabel,
				style: "width:100%; "+nextBtnStyle,
				className: nextBtnClass,
				listener: function(e){
					e.event.preventDefault();
					view.render("view-"+(index+1));
				}
			});
			return nextButton;	
		}


	}

	function add_view(index,viewId,container,page){
		var init = false;
		if(index==0) init = true;
		view.newSubView({  
			id: viewId,
			init: init,
			
			body: container
		});
	}

	self._props_._form.appendChild(view.getHtml());


	function getFromElementFromTag(_tag){
		var form_data = self._props_._form_data;
		var element = null;
		for(var _tag_ in form_data){
			if(_tag_ == _tag){
				element = form_data[_tag_];
				break;
			}	
		}
		return element;
	}
}
function FormComponent_onSubmit(opts,callback,self){
	self._props_.on_submit_options = opts;
	self._props_._onsubmit_callback = callback;
	if(Utils.isNull(opts)){
		opts = {};
	}
	var label = (opts.label==undefined) ? "" : opts.label
	var id = (opts.id==undefined) ? Utils.randomGenerator(16,false) : opts.id;
	var className = (opts.className==undefined) ? "" : opts.className;
	var style = (opts.style==undefined) ? "" : opts.style;

	self._props_._submit_button_id = id;

	self._props_._submit_button = new ButtonComponent({
		label: label,
		style: style,
		className: className,
		callback: function(obj){
			obj.event.preventDefault();
			self._props_._form_handler.trigger(self._props_._triggers.submit);
		}
	});

	self._props_._submit_button_id = self._props_._submit_button.getId();
}


function FormComponent_addInput(opts,self){
	var formElement = new FormComponentDefaults(opts,self);
	var layout_classes = (opts.layout==undefined) ? "" : opts.layout;
	var statusId = Utils.randomGenerator(12,false);
	var layoutContainer = Utils.createElement({ className: 'form-group '+layout_classes });
	var label = Utils.createElement('label',{ for: formElement.id, innerHTML: formElement.label });
	var input = FromComponent_addInput_createElement(formElement);
	
	var disabled = (!Utils.isNull(opts.disabled)) ? opts.disabled : false;
	input.disabled = disabled;

	var status = Utils.createElement('span',{ id: statusId });
	layoutContainer.appendChild(label);
	layoutContainer.appendChild(input);
	layoutContainer.appendChild(status);
	var default_value = (!Utils.isNull(opts.defaultValue)) ? opts.defaultValue : "";
	if(default_value!=""){
		self._props_._values[formElement.paramName] = default_value;
		input.value = default_value;
	}
	
	var compContainer = new ContainerComponent({body:layoutContainer});
	var tag = formElement.tag;
	self._props_._form_data[tag] = {
		element: layoutContainer,
		component: compContainer,
		paramName: formElement.paramName,
		type: 'input',
		layout: opts.layout,
		formElement: formElement,
		
		
		
		
		status: 0,
		statusId: statusId,
		isValid: true,
		_match_cache: null,
		_match_cache_count: 0
	};
	var form_handler = self._props_._form_handler;
	var event_trigger_submit = self._props_._triggers.submit;
	var event_trigger_reset = self._props_._triggers.reset;
	compContainer.listenTo(form_handler, event_trigger_submit, function(msg) {
		self._props_._form_data[tag].status = 2;
		initializeValidationAndValues();
		self._props_._form_data[tag].status = 1;
	});
	compContainer.listenTo(form_handler, event_trigger_reset, function(msg) {
		self._props_._form_data[tag].status = 0;
	});
	_Utils_registerListenerCallbackForSelf("focusout",formElement.selector,function(b){
		initializeValidationAndValues();
	},self,true);

	_Utils_registerListenerCallbackForSelf("run","",function(b){
		
		if(formElement.remember){
			var value = self._props_._getRemeber(tag);
			if(!Utils.isNull(value)){
				$(formElement.selector).val(value);
			}
		}
	},self,true);

	function initializeValidationAndValues(){
		var validation = validation_set_defaults(opts.validation);
		var val = $(formElement.selector).val();
		var value = val!="" ? val : formElement.defaultValue;
		self._props_._values[formElement.paramName] = value;
		if(formElement.remember){
			self._props_._setRemeber(formElement.tag,value);
		}

		if(Utils.isNull(validation)){
			return;
		}
		if(!Utils.isNull(validation.required)){
			if(validation.required.require){
				var _isvalid = requiredValidation(val,validation);
				self._props_._form_data[tag]['isValid'] = _isvalid;
				if(!_isvalid) return;
			}
		}
		if(!Utils.isNull(validation.min)){
			var _isvalid = minValidation(val,validation);
			self._props_._form_data[tag]['isValid'] = _isvalid;
			if(!_isvalid) return;
		}
		if(!Utils.isNull(validation.max)){
			var _isvalid = maxValidation(val,validation);
			self._props_._form_data[tag]['isValid'] = _isvalid;
			if(!_isvalid) return;
		}
		if(!Utils.isNull(validation.characters)){
			var _isvalid = charactersValidation(val,validation);
			self._props_._form_data[tag]['isValid'] = _isvalid;
			if(!_isvalid) return;
		}
		if(!Utils.isNull(validation.match)){
			var _isvalid = matchValidation(val,validation);
			self._props_._form_data[tag]['isValid'] = _isvalid;
			if(!_isvalid) return;
		}

		
		
		
		function matchValidation(val,validation){
			if(!Utils.isNull(validation.match)){
				var isAMatch = false;
				var _isvalid = true;
				var doesMatch = false;
				if(!Utils.isNull(validation.match.matches)){
					matchGiven();
					self._props_._form_data[tag]['isValid'] = _isvalid;
				}
				
				if(!Utils.isNull(validation.match.request)){
					matchAjax(validation.match.request);
					self._props_._form_data[tag]['isValid'] = _isvalid;
				}
				function matchGiven(){
					var matches = validation.match.matches;

					
					for(var i=0; i<matches.length; i++){
						if(val==matches[i]){
							doesMatch = true;
							break;
						}
					}

					
					if(!Utils.isNull(validation.match.doesMatch)){
						doesMatch = validation.match.doesMatch;
					}
					runMatch();

				}
				function matchAjax(ajax){
					var type;
					if(Utils.isNull(ajax.type)){
						type = "post";
					}else{
						type = ajax.type;
					}
					
					if(Utils.isNull(ajax.cache_count)){
						ajax.cache_count = 5;
					}

					if(Utils.isNull(ajax.url)){
						console.error("Please provide a valid URL");
						return;
					}
					if(Utils.isNull(ajax.data)){
						console.error("Please provide data to send to server");
						return;
					}
					
					if(!Utils.isNull(ajax.cache) && ajax.cache==true){
						var result = self._props_._form_data[tag]._match_cache;
						if(ajax.cache_count < 0){
							_run_ajax_call();
						}else{
							if(self._props_._form_data[tag]._match_cache_count == 0){
								self._props_._form_data[tag]._match_cache_count++;
								_run_ajax_call();
							}else{
								if(self._props_._form_data[tag]._match_cache_count <= ajax.cache_count){
									self._props_._form_data[tag]._match_cache_count++;
									_ajaxSuccess(ajax,result);
								}else{
									self._props_._form_data[tag]._match_cache_count = 0;
									_run_ajax_call();
								}
							}
						}
					}else{
						_run_ajax_call();
					}

					function _run_ajax_call(){
						$.ajax({
							type: type,
							url: ajax.url, 
							data: ajax.data,
							success: function(result){
								if(!Utils.isNull(ajax.sanitize)){
									result = ajax.sanitize(result);
									if(result==undefined){
										console.log("Returned value from sanitize call is undefined")
									}
								}
								if(!Utils.isNull(ajax.cache) && ajax.cache==true){
									self._props_._form_data[tag]._match_cache = result;
								}
								_ajaxSuccess(ajax,result);
					    	}
						});
					}
				}
				function runMatch(){
					if(isAMatch){
						if(doesMatch){
							_isvalid = true;
							runSuccess();
						}else{
							_isvalid = false;
							runError();
						}
					}else{
						if(doesMatch){
							_isvalid = false;
							runError();
						}else{
							_isvalid = true;
							runSuccess();
						}
					}
				}
				function runSuccess(){
					if(!Utils.isNull(validation.match.success)){
						var success = validation.match.success;
						if(typeof success === "function"){
							var s = success(val);
							_add_success_(s);
						}else{
							_add_success_(success);
						}
					}
				}
				function runError(){
					if(!Utils.isNull(validation.match.error)){
						var error = validation.match.error;
						if(typeof error === "function"){
							_add_error_(error(val));
						}else{
							_add_error_(error);
						}
					}
				}
				function _ajaxSuccess(ajax,result){
					if(typeof result === "string"){
						result = JSON.parse(result);
					}
					var _is_a_match = false;
					if(Array.isArray(result)){
						for(var i=0; i<result.length; i++){
							if(result[i]==val){
								_is_a_match = true;
								break;
							}
						}
					}else if(typeof result === "object"){
						for(var i in result){
							if(result[i]==val){
								_is_a_match = true;
								break;								
							}
						}
					}
		        	if(!Utils.isNull(ajax.response)){
		        		var handle = ajax.response(result);
		        		console.log(handle);
		        		if(!Utils.isNull(handle) && typeof handle === 'boolean'){
		        			if(handle){
		        				isAMatch = true;  
		        				runSuccess(); 
		        			}else{
		        				isAMatch = false;
		        				runError();
		        			}
		        		}else{
			        		isAMatch = _is_a_match;
			        		runMatch();
		        		}
		        	}else{
		        		isAMatch = _is_a_match;
		        		runMatch();
		        	}
				}
			}
		}
	}

	
	function charactersValidation(val,validation){
		var  letters = [
		 "a","b","c","d","e","f","g","h","i","j","c","l","m","n","o"
		,"p","q","r","s","t","u","v","w","x","y","z"
		,"A","B","C","D","E","F","G","H","I","J","K","L","M","N"
		,"O","P","Q","R","S","T","U","V","W","X","Y","Z"
		];
		var numbers = ["0","1","2","3","4","5","6","7","8","9"];
		var special = [
		 "!","@","#","$","%","^","&","*","(",")","-","_","+","=","~"
		,"`","{","}","[","]","\\","|","'","\"",";",":","<",">",",","."
		,"/","?"," "
		];

		var error = (Utils.isNull(validation.characters.error)) ? "" : validation.characters.error;
		var success = (Utils.isNull(validation.characters.success)) ? "" : validation.characters.success;

		var beginChar = validation.characters.beginWithSpecialChar;
		var beginCharMsg = "";
		var endChar = validation.characters.endWithSpecialChar;
		var endCharMsg = "";
		var allowNumbers = validation.characters.numbers;
		var allowNumbersMsg = "";
		var beginNum = validation.characters.beginWithNumber;
		var beginNumMsg = "";
		var endNum = validation.characters.endWithNumber;
		var endNumMsg = "";
		var lowercase = validation.characters.lowercase;
		var lowercaseMsg = "";
		var uppercase = validation.characters.uppercase;
		var uppercaseMsg = "";
		var except = validation.characters.except;

		if(typeof validation.characters === 'boolean'){
			if(validation.characters){
				var valid = run();
				if(!valid) return false;
			}
		}else if(typeof validation.characters === 'string'){
			error = validation.characters;
			var valid = run();
			if(!valid) return false;
		}else{
			var valid = run();
			if(!valid) return false;
		}

		function run(){
			runSetupDefualts();
			valid = runBeginAndEndWithNum();
			if(valid){ 
				valid = runBeginAndEndWithChar(); 
			}else{ 
				return false;
			}
			if(valid){ 
				valid = runCheckSpecialCharacters(); 
			}else{ 
				return false;
			}
			if(valid){ 
				valid = runCase();
			}else{
				return false;
			}
			_add_success_(success);
 			return valid
		}

		function runCase(){
			if(!Utils.isNull(validation.characters.changeToLowerCase)){
				val = val.toLowerCase();
			}
			if(!Utils.isNull(validation.characters.changeToLowerCase)){
				val = val.toLowerCase();
			}
			if(!Utils.isNull(lowercase)){
				if(lowercase){
					_add_error_(lowercaseMsg);
					return false;
				}
			}
			if(!Utils.isNull(uppercase)){
				if(uppercase){
					_add_error_(uppercaseMsg);
					return false;
				}
			}
		}
		function runBeginAndEndWithNum(){
			var isValid = true;
			if(!beginNum){
				var isNumber = checkIfNumber(val.charAt(1));
				if(isNumber){
					isValid = false;
					_add_error_(beginNumMsg);
				}
			}
			if(!endNum){
				var isNumber = checkIfNumber(val.charAt(1));
				if(isNumber){
					isValid = false;
					_add_error_(endNumMsg);
				}
			}
			return isValid;
		}
		function runBeginAndEndWithChar(){
			var isValid = true;
			if(!beginChar){
				var isLetter = checkIfLetter(val.charAt(1)); 
				var isNumber = checkIfNumber(val.charAt(1));
				var isExcept = checkIfException(val.charAt(1));
				if(!isLetter && !isNumber && !isExcept){
					isValid = false;
					_add_error_(beginCharMsg);
				}
			}
			if(!endChar){
				var isLetter = checkIfLetter(val.charAt(1)); 
				var isNumber = checkIfNumber(val.charAt(1));
				var isExcept = checkIfException(val.charAt(1));
				if(!isLetter && !isNumber && !isExcept){
					isValid = false;
					_add_error_(endCharMsg);
				}
			}
			return isValid;
		}
		function runCheckSpecialCharacters(){
			
			var isValid = true;
			for(var i=0; i<val.length; i++){
				var breakIt = false;
				var isLetter = checkIfLetter(val[i]);
				
				if(!isLetter){
					var isNumber = checkIfNumber(val[i]);
					if(isNumber){
						if(!allowNumbers){
							_add_error_(allowNumbersMsg);
							isValid = false;
							breakIt = true;
						}
					}else{
						var _valid_special_char = checkIfException(val[i]); 
						if(!_valid_special_char){
							isValid = false;
							_add_error_(error);
							breakIt = true;
						}
					}
					if(breakIt) break;
				}
			}
			return isValid;
		}

		
		function checkIfException(char){
			var _valid_special_char = false;
			for(var g=0; g<except.length; g++){
				if(val[i]==except[g]){
					_valid_special_char = true;
				}
			}
			return _valid_special_char;
		}
		function checkIfLetter(letter){
			var _is_letter = false;
			for(var j=0; j<letters.length; j++){
				if(letters[j]==letter){
					_is_letter = true;
					break;
				}
			}
			return _is_letter;
		}
		function checkIfNumber(num){
			var _is_num = false;
			for(var j=0; j<numbers.length; j++){
				if(numbers[j]==num){
					_is_num = true;
					break;
				}
			}
			return _is_num;			
		}


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

		function runSetupDefualts(){

			if(!Utils.isNull(validation.characters.trim)){
				if(validation.characters.trim)
					val = val.trim();
			}
			if(Utils.isNull(except)){
				except = [];
			}	
			if(Utils.isNull(beginChar)){
				beginChar = false;
			}else{
				if(typeof beginChar === "string"){
					beginCharMsg = beginChar;
					beginChar = false;
				}else{
					beginCharMsg = error;
				}
			}
			if(Utils.isNull(endChar)){
				endChar = true;
			}else{
				if(typeof endChar === "sring"){
					endCharMsg = endChar;
					endChar = false;
				}else{
					endCharMsg = error;
				}
			}
			if(Utils.isNull(allowNumbers)){
				allowNumbers = true;
			}else{
				if(typeof allowNumbers === "string"){
					allowNumbersMsg = allowNumbers;
					allowNumbers = false;
				}else{
					allowNumbersMsg = error;
				}
			}
			if(Utils.isNull(beginNum)){
				beginNum = true;
			}else{
				if(typeof beginNum === 'string'){
					beginNumMsg = beginNum;
					beginNum = false;
				}else{
					beginNumMsg = error;
				}
			}
			if(Utils.isNull(endNum)){
				endNum = true;
			}else{
				if(typeof endNum === "string"){
					endNumMsg = endNum;
					endNum = false;
				}else{
					endNumMsg = error;
				}
			}
			if(Utils.isNull(lowercase)){
				lowercase = true;
			}else{
				if(typeof lowercase === "string"){
					lowercaseMsg = lowercase;
					lowercase = false;
				}else{
					lowercaseMsg = error;
				}
			}
			if(Utils.isNull(uppercase)){
				uppercase = true;
			}else{
				if(typeof uppercase === "string"){
					uppercaseMsg = uppercase;
					uppercase = false;
				}else{
					uppercaseMsg = error;
				}
			}
		}





		return _isvalid;
	}
	function requiredValidation(val,validation){
		var _isvalid = true;
		if(val.length==0){
			_isvalid = false;
			_add_error_(validation.required.error);
		}else{
			_isvalid = true;
			_add_success_(validation.required.success);
		}
		return _isvalid;
	}
	function minValidation(val,validation){
		var _isvalid = true;
		if(typeof validation.min.number !== "number"){
			return false;
		}
		if(val.length<validation.min.number){
			_isvalid = false;
			_add_error_(validation.min.error);
		}else{
			_isvalid = true;
			_add_success_(validation.min.success);
		}
		return _isvalid;
	}
	function maxValidation(val,validation){
		var _isvalid = true;
		if(typeof validation.max.number !== "number"){
			return false;
		}
		if(val.length>validation.max.number){
			_isvalid = false;
			_add_error_(validation.max.error);
		}else{
			_isvalid = true;
			_add_success_(validation.max.success);
		}
		return _isvalid;
	}

	function _add_error_(errorMsg){
		if(!$("#"+statusId).hasClass("invalid-feedback")){
			_add_error_1();
		}else if($("#"+statusId).hasClass("valid-feedback")){
			$("#"+statusId).removeClass("valid-feedback")
			_add_error_1();
		}else{
			_add_error_1();
		}
		function _add_error_1(){
			_isvalid = false;
			$(formElement.selector).removeClass("is-valid");
			$(formElement.selector).addClass("is-invalid");
			$("#"+statusId).addClass("invalid-feedback");
			$("#"+statusId).text(errorMsg);
		}
	}
	function _add_success_(successMsg){
		if(!$("#"+statusId).hasClass("valid-feedback")){
			_add_success_1();
		}else if($("#"+statusId).hasClass("invalid-feedback")){
			$("#"+statusId).removeClass("invalid-feedback")
			_add_success_1();
		}else{
			_add_success_1();
		}
		function _add_success_1(){
			_isvalid = true;
			$(formElement.selector).removeClass("is-invalid");
			$(formElement.selector).addClass("is-valid");
			$("#"+statusId).addClass("valid-feedback");
			$("#"+statusId).text(successMsg);	
		}
	}
	function validation_set_defaults(validation){
		validation = (!Utils.isNull(validation)) ? validation : {};
		if(!Utils.isNull(validation.required)){
			if(typeof validation.required === 'boolean'){
				var req = validation.required;
				validation.required = {};
				validation.required.require = req;
				validation.required.error = "";
				validation.required.success = "";
			}
			if(Utils.isNull(validation.required.error)){
				validation.required.error = "";
			}	
			if(Utils.isNull(validation.required.success)){
				validation.required.success = "";
			}
		}
		if(!Utils.isNull(validation.min)){
			if(typeof validation.min === 'number'){
				var num = validation.min;
				validation.min.number = num;
				validation.min.error = "";
				validation.min.success = "";
			}
			if(Utils.isNull(validation.min.error)){
				validation.min.error = "";
			}
			if(Utils.isNull(validation.min.success)){
				validation.min.success = "";
			}
		}
		if(!Utils.isNull(validation.max)){
			if(typeof validation.max === 'number'){
				var num = validation.max;
				validation.max.number = num;
				validation.max.error = "";
				validation.max.success = "";
			}
			if(Utils.isNull(validation.max.error)){
				validation.max.error = "";
			}
			if(Utils.isNull(validation.max.success)){
				validation.max.success = "";
			}
		}
		return validation;
	}
}
function FromComponent_addInput_createElement(formElement){
	var input = Utils.createElement('input',{ 
		type: formElement.type,
		id: formElement.id,
		selector: formElement.selector,
		className: "form-control",
		placeholder: formElement.placeholder,
		style: formElement.style
	});
	return input;
}
function FormComponent_addSelection(opts,self){
	var formElement = new FormComponentDefaults(opts,self);
	var tag = formElement.tag;
	var createElement = Utils.createElement;
	var topDiv = createElement({
		className: "form-group"
	});

	var label = createElement({
		el: 'label',
		for: Utils.removeSelector(formElement.selector),
		innerHTML: formElement.label
	});
	var select = createElement({
		el: 'select',
		id: Utils.removeSelector(formElement.selector),
		style: formElement.style,
		className: "form-control "+formElement.className
	});

	var sel = (Utils.isNull(opts.defaultSelection)) ? "" : opts.defaultSelection;
	self._props_._values[formElement.paramName] = sel;

	for(var i=0; i<opts.list.length; i++){
		if(sel==opts.list[i]){
			var option = createElement({
				el: 'option',
				selected: true,
				innerHTML: opts.list[i]
			});
		}else{
			var option = createElement({
				el: 'option',
				innerHTML: opts.list[i]
			});
		}
		select.appendChild(option);
	}
	topDiv.appendChild(label);
	topDiv.appendChild(select);
	var statusId = Utils.randomGenerator(12,false);
	var status = Utils.createElement('span',{ id: statusId });
	topDiv.appendChild(status);

	function getSelectionValue(){
		$(formElement.selector).on('change',function(e){
			var optionSelected = $("option:selected", this);
			self._props_._values[formElement.paramName] = this.value;
		});
	}
	function userDefinedChangeListener(){
		if(opts.changeListener){
			$(formElement.selector).on('change',function(e){
				var optionSelected = $("option:selected", this);
				
				var doc = document.getElementById(Utils.removeSelector(formElement.selector));
				var selected = doc.selectedIndex;
				opts.changeListener(this.value,selected,e,optionSelected,doc);
			});
		}
	}

	var compContainer = new ContainerComponent({body:topDiv});
	var form_handler = self._props_._form_handler;
	var event_trigger_submit = self._props_._triggers.submit;
	var event_trigger_reset = self._props_._triggers.reset;
	compContainer.listenTo(form_handler, event_trigger_submit, function(){
		self._props_._form_data[tag].status = 2;
		initializeValidationAndValues();
		self._props_._form_data[tag].status = 1;
	});
	compContainer.listenTo(form_handler, event_trigger_reset, function(){
		self._props_._form_data[tag].status = 0;
	});
	self._props_._form_data[tag] = {
		paramName: formElement.paramName,
		component: compContainer,
		type: 'selection',
		formElement: formElement,
		status: 0,
		statusId: statusId,
		isValid: true
	};

	_Utils_registerListenerCallbackForSelf('run','',function(){
		getSelectionValue();
		userDefinedChangeListener();
	},self);

	function initializeValidationAndValues(){
		getSelectionValue();
	}








}


function FormComponent_addTextarea(opts,self){
	var formElement = new FormComponentDefaults(opts,self);
	var tag = formElement.tag;
	var createElement = Utils.createElement;
	var topDiv = createElement({
		className: "form-group"
	});
	var label = createElement({
		for: formElement.id,
		innerHTML: formElement.label
	});

	var rows = 4;
	var cols = 50;
	if(opts.rows){

	}
	if(opts.cols){
		
	}
	var textarea = createElement({
		el: "textarea",
		id: formElement.id,
		rows: rows,
		cols: cols,
		style: formElement.style,
		className: formElement.className
	});
	topDiv.appendChild(label);
	topDiv.appendChild(textarea);
	var statusId = Utils.randomGenerator(12,false);
	var status = Utils.createElement('span',{ id: statusId });
	topDiv.appendChild(status);

	if(opts.defaultValue){
		textarea.value = opts.defaultValue;
	}

	var compContainer = new ContainerComponent({body:topDiv});
	var form_handler = self._props_._form_handler;
	var event_trigger_submit = self._props_._triggers.submit;
	var event_trigger_reset = self._props_._triggers.reset;
	compContainer.listenTo(form_handler, event_trigger_submit, function(){
		self._props_._form_data[tag].status = 2;
		initializeValidationAndValues();
		self._props_._form_data[tag].status = 1;
	});
	compContainer.listenTo(form_handler, event_trigger_reset, function(){
		self._props_._form_data[tag].status = 0;
	});

	function initializeValidationAndValues(){
		var val = document.getElementById(formElement.id).value;
		self._props_._values[formElement.paramName] = val;
	}

	self._props_._form_data[tag] = {
		paramName: formElement.paramName,
		component: compContainer,
		type: 'selection',
		formElement: formElement,
		status: 0,
		statusId: statusId,
		isValid: true
	};


}

function FormComponent_addStateSelection(opts,self){
	var formElement = new FormComponentDefaults(opts,self);
	var tag = formElement.tag;
	var createElement = Utils.createElement;
	var topDiv = createElement({
		className: "form-group"
	});

	var select = Utils.convertStringToHTMLNode(_us_states(opts,formElement,self));
	topDiv.appendChild(select);
	var statusId = Utils.randomGenerator(12,false);
	var status = Utils.createElement('span',{ id: statusId });
	topDiv.appendChild(status);

	var compContainer = new ContainerComponent({body:topDiv});
	var form_handler = self._props_._form_handler;
	var event_trigger_submit = self._props_._triggers.submit;
	var event_trigger_reset = self._props_._triggers.reset;
	compContainer.listenTo(form_handler, event_trigger_submit, function(){
		self._props_._form_data[tag].status = 2;
		initializeValidationAndValues();
		self._props_._form_data[tag].status = 1;
	});
	compContainer.listenTo(form_handler, event_trigger_reset, function(){
		self._props_._form_data[tag].status = 0;
	});

	_Utils_registerListenerCallbackForSelf('run','',function(){
		getSelectionValue();
	},self);

	function initializeValidationAndValues(){
		getSelectionValue();
	}

	self._props_._values[formElement.paramName] = formElement.defaultValue;

	function getSelectionValue(){
		$(formElement.selector).on('change',function(e){
			var optionSelected = $("option:selected", this);
			self._props_._values[formElement.paramName] = this.value;
		});
	}

	self._props_._form_data[tag] = {
		paramName: formElement.paramName,
		component: compContainer,
		type: 'selection',
		formElement: formElement,
		status: 0,
		statusId: statusId,
		isValid: true
	};

}
function _us_states(opts,formElement,self){
	function get_selecton(st1,st2,sel){
		if(sel==st1 || sel==st2){
			return "selected";
		}else{
			return "";
		}
	}
	function _state_(isAbrev,abrev,fullname){
		var i = "";
		if(isAbrev || isAbrev==undefined){
			i = abrev;
		}else{
			i = fullname;
		}
		return i;
	}
	var sel = (Utils.isNull(opts.defaultSelection)) ? "" : opts.defaultSelection;
	var isinitial = (Utils.isNull(opts.abbr)) ? false : opts.abbr;
	var styles = formElement.style;
	var id = Utils.removeSelector(formElement.selector);
	var label = formElement.label;
	var p = "<div class='form-group'>"
	+"<label class='control-label' for='"+id+"'>"+label+"</label><br>"
	+"<select style='"+styles+"' id='"+id+"'>"
	+"<option class='state-selected' value='none'></option>"
	+"<option class='state-selected' "+get_selecton("AL","Alabama",sel)+" value='"+_state_(isinitial,"AL","Alabama")+"'>"+_state_(isinitial,"AL","Alabama")+"</option>"
	+"<option class='state-selected' "+get_selecton("AK","Alaska",sel)+" value='"+_state_(isinitial,"AK","Alaska")+"'>"+_state_(isinitial,"AK","Alaska")+"</option>"
	+"<option class='state-selected' "+get_selecton("AZ","Arizona",sel)+" value='"+_state_(isinitial,"AZ","Arizona")+"'>"+_state_(isinitial,"AZ","Arizona")+"</option>"
	+"<option class='state-selected' "+get_selecton("AR","Arkansas",sel)+" value='"+_state_(isinitial,"AR","Arkansas")+"'>"+_state_(isinitial,"AR","Arkansas")+"</option>"
	+"<option class='state-selected' "+get_selecton("CA","California",sel)+" value='"+_state_(isinitial,"CA","California")+"'>"+_state_(isinitial,"CA","California")+"</option>"
	+"<option class='state-selected' "+get_selecton("CO","Colorado",sel)+" value='"+_state_(isinitial,"CO","Colorado")+"'>"+_state_(isinitial,"CO","Colorado")+"</option>"
	+"<option class='state-selected' "+get_selecton("CT","Connecticut",sel)+" value='"+_state_(isinitial,"CT","Connecticut")+"'>"+_state_(isinitial,"CT","Connecticut")+"</option>"
	+"<option class='state-selected' "+get_selecton("DE","Delaware",sel)+" value='"+_state_(isinitial,"DE","Delaware")+"'>"+_state_(isinitial,"DE","Delaware")+"</option>"
	+"<option class='state-selected' "+get_selecton("FL","Florida",sel)+" value='"+_state_(isinitial,"FL","Florida")+"'>"+_state_(isinitial,"FL","Florida")+"</option>"
	+"<option class='state-selected' "+get_selecton("GA","Georgia",sel)+" value='"+_state_(isinitial,"GA","Georgia")+"'>"+_state_(isinitial,"GA","Georgia")+"</option>"
	+"<option class='state-selected' "+get_selecton("HI","Hawaii",sel)+" value='"+_state_(isinitial,"HI","Hawaii")+"'>"+_state_(isinitial,"HI","Hawaii")+"</option>"
	+"<option class='state-selected' "+get_selecton("ID","Idaho",sel)+" value='"+_state_(isinitial,"ID","Idaho")+"'>"+_state_(isinitial,"ID","Idaho")+"</option>"
	+"<option class='state-selected' "+get_selecton("IL","Illinois",sel)+" value='"+_state_(isinitial,"IL","Illinois")+"'>"+_state_(isinitial,"IL","Illinois")+"</option>"
	+"<option class='state-selected' "+get_selecton("IN","Indiana",sel)+" value='"+_state_(isinitial,"IN","Indiana")+"'>"+_state_(isinitial,"IN","Indiana")+"</option>"
	+"<option class='state-selected' "+get_selecton("IA","Iowa",sel)+" value='"+_state_(isinitial,"IA","Iowa")+"'>"+_state_(isinitial,"IA","Iowa")+"</option>"
	+"<option class='state-selected' "+get_selecton("KS","Kansas",sel)+" value='"+_state_(isinitial,"KS","Kansas")+"'>"+_state_(isinitial,"KS","Kansas")+"</option>"
	+"<option class='state-selected' "+get_selecton("KY","Kentucky",sel)+" value='"+_state_(isinitial,"KY","Kentucky")+"'>"+_state_(isinitial,"KY","Kentucky")+"</option>"
	+"<option class='state-selected' "+get_selecton("LA","Louisiana",sel)+" value='"+_state_(isinitial,"LA","Louisiana")+"'>"+_state_(isinitial,"LA","Louisiana")+"</option>"
	+"<option class='state-selected' "+get_selecton("ME","Maine",sel)+" value='"+_state_(isinitial,"ME","Maine")+"'>"+_state_(isinitial,"ME","Maine")+"</option>"
	+"<option class='state-selected' "+get_selecton("MD","Maryland",sel)+" value='"+_state_(isinitial,"MD","Maryland")+"'>"+_state_(isinitial,"MD","Maryland")+"</option>"
	+"<option class='state-selected' "+get_selecton("MA","Massachusetts",sel)+" value='"+_state_(isinitial,"MA","Massachusetts")+"'>"+_state_(isinitial,"MA","Massachusetts")+"</option>"
	+"<option class='state-selected' "+get_selecton("MI","Michigan",sel)+" value='"+_state_(isinitial,"MI","Michigan")+"'>"+_state_(isinitial,"MI","Michigan")+"</option>"
	+"<option class='state-selected' "+get_selecton("MS","Mississippi",sel)+" value='"+_state_(isinitial,"MS","Mississippi")+"'>"+_state_(isinitial,"MS","Mississippi")+"</option>"
	+"<option class='state-selected' "+get_selecton("MO","Missouri",sel)+" value='"+_state_(isinitial,"MO","Missouri")+"'>"+_state_(isinitial,"MO","Missouri")+"</option>"
	+"<option class='state-selected' "+get_selecton("MT","Montana",sel)+" value='"+_state_(isinitial,"MT","Montana")+"'>"+_state_(isinitial,"MT","Montana")+"</option>"
	+"<option class='state-selected' "+get_selecton("NE","Nebraska",sel)+" value='"+_state_(isinitial,"NE","Nebraska")+"'>"+_state_(isinitial,"NE","Nebraska")+"</option>"
	+"<option class='state-selected' "+get_selecton("NH","NV","Nevada",sel)+" value='"+_state_(isinitial,"NH","NV","Nevada")+"'>"+_state_(isinitial,"NH","NV","Nevada")+"</option>"
	+"<option class='state-selected' "+get_selecton("NH","New Hampshire",sel)+" value='"+_state_(isinitial,"NH","New Hampshire")+"'>"+_state_(isinitial,"NH","New Hampshire")+"</option>"
	+"<option class='state-selected' "+get_selecton("NJ","New Jersey",sel)+" value='"+_state_(isinitial,"NJ","New Jersey")+"'>"+_state_(isinitial,"NJ","New Jersey")+"</option>"
	+"<option class='state-selected' "+get_selecton("NM","New Mexico",sel)+" value='"+_state_(isinitial,"NM","New Mexico")+"'>"+_state_(isinitial,"NM","New Mexico")+"</option>"
	+"<option class='state-selected' "+get_selecton("NY","New York",sel)+" value='"+_state_(isinitial,"NY","New York")+"'>"+_state_(isinitial,"NY","New York")+"</option>"
	+"<option class='state-selected' "+get_selecton("NC","North Carolina",sel)+" value='"+_state_(isinitial,"NC","North Carolina")+"'>"+_state_(isinitial,"NC","North Carolina")+"</option>"
	+"<option class='state-selected' "+get_selecton("ND","North Dakota",sel)+" value='"+_state_(isinitial,"ND","North Dakota")+"'>"+_state_(isinitial,"ND","North Dakota")+"</option>"
	+"<option class='state-selected' "+get_selecton("OH","Ohio",sel)+" value='"+_state_(isinitial,"OH","Ohio")+"'>"+_state_(isinitial,"OH","Ohio")+"</option>"
	+"<option class='state-selected' "+get_selecton("OR","Oregon",sel)+" value='"+_state_(isinitial,"OR","Oregon")+"'>"+_state_(isinitial,"OR","Oregon")+"</option>"
	+"<option class='state-selected' "+get_selecton("OK","Oklahoma",sel)+" value='"+_state_(isinitial,"OK","Oklahoma")+"'>"+_state_(isinitial,"OK","Oklahoma")+"</option>"
	+"<option class='state-selected' "+get_selecton("PA","Pennsylvania",sel)+" value='"+_state_(isinitial,"PA","Pennsylvania")+"'>"+_state_(isinitial,"PA","Pennsylvania")+"</option>"
	+"<option class='state-selected' "+get_selecton("RI","Rhode Island",sel)+" value='"+_state_(isinitial,"RI","Rhode Island")+"'>"+_state_(isinitial,"RI","Rhode Island")+"</option>"
	+"<option class='state-selected' "+get_selecton("SC","South Carolina",sel)+" value='"+_state_(isinitial,"SC","South Carolina")+"'>"+_state_(isinitial,"SC","South Carolina")+"</option>"
	+"<option class='state-selected' "+get_selecton("SD","South Dakota",sel)+" value='"+_state_(isinitial,"SD","South Dakota")+"'>"+_state_(isinitial,"SD","South Dakota")+"</option>"
	+"<option class='state-selected' "+get_selecton("TN","Tennessee",sel)+" value='"+_state_(isinitial,"TN","Tennessee")+"'>"+_state_(isinitial,"TN","Tennessee")+"</option>"
	+"<option class='state-selected' "+get_selecton("TX","Texas",sel)+" value='"+_state_(isinitial,"TX","Texas")+"'>"+_state_(isinitial,"TX","Texas")+"</option>"
	+"<option class='state-selected' "+get_selecton("UT","Utah",sel)+" value='"+_state_(isinitial,"UT","Utah")+"'>"+_state_(isinitial,"UT","Utah")+"</option>"
	+"<option class='state-selected' "+get_selecton("VT","Vermont",sel)+" value='"+_state_(isinitial,"VT","Vermont")+"'>"+_state_(isinitial,"VT","Vermont")+"</option>"
	+"<option class='state-selected' "+get_selecton("VA","Virginia",sel)+"value='"+_state_(isinitial,"VA","Virginia")+"'>"+_state_(isinitial,"VA","Virginia")+"</option>"
	+"<option class='state-selected' "+get_selecton("WA","Washington",sel)+" value='"+_state_(isinitial,"WA","Washington")+"'>"+_state_(isinitial,"WA","Washington")+"</option>"
	+"<option class='state-selected' "+get_selecton("WV","West Virginia",sel)+" value='"+_state_(isinitial,"WV","West Virginia")+"'>"+_state_(isinitial,"WV","West Virginia")+"</option>"
	+"<option class='state-selected' "+get_selecton("WI","Wisconsin",sel)+" value='"+_state_(isinitial,"WI","Wisconsin")+"'>"+_state_(isinitial,"WI","Wisconsin")+"</option>"
	+"<option class='state-selected' "+get_selecton("WY","Wyoming",sel)+" value='"+_state_(isinitial,"WY","Wyoming")+"'>"+_state_(isinitial,"WY","Wyoming")+"</option>"

	+"</select>";

	return p;
}


function FormComponent_addRadioButtonGroup(opts,self){
	var formElement = new FormComponentDefaults(opts,self);
	var tag = formElement.tag;

	var createElement = Utils.createElement;
	
	var topLabelStr = (!Utils.isNull(opts.label)) ? opts.label : "";

	var topDiv = createElement({
		el: 'div',
		className: 'form-group'
	});
	var topLabel = createElement({
		el: 'label',
		
		className: 'form-check-label',
		innerHTML: topLabelStr
	});
	topDiv.appendChild(topLabel);
	if(!Utils.isNull(opts.buttons)){
		var buttons = opts.buttons;
		var btnElements = [];
		for(var i=0; i<buttons.length; i++){
			var button = buttons[i];
			var defaults = new FormComponentDefaults(button,self);
			var div = createElement({
				className: 'form-check'
			});
			var label = createElement({
				el: 'label',
				for: defaults.id,
				className: 'form-check-label',
				innerHTML: defaults.label
			});
			var btn = createElement({
				el: 'radio',
				id: defaults.id,
				name: formElement.name,
				className: "form-check-input "+defaults.className,
				style: defaults.style,
				value: defaults.value
			});

			if(button.checked!=undefined && button.checked==true){
				btn.checked = true;
			}
			div.appendChild(btn);
			div.appendChild(label);
			topDiv.appendChild(div);
		}


		_Utils_registerListenerCallback(opts,self);

		var statusId = Utils.randomGenerator(12,false);
		var status = Utils.createElement('span',{ id: statusId });
		topDiv.appendChild(status);
		var compContainer = new ContainerComponent({body:topDiv});

		var form_handler = self._props_._form_handler;
		var event_trigger_submit = self._props_._triggers.submit;
		var event_trigger_reset = self._props_._triggers.reset;
		compContainer.listenTo(form_handler, event_trigger_submit, function(msg) {
			self._props_._form_data[tag].status = 2;
			initializeValidationAndValues();
			self._props_._form_data[tag].status = 1;
		});
		compContainer.listenTo(form_handler, event_trigger_reset, function(msg) {
			self._props_._form_data[tag].status = 0;
		});

		function initializeValidationAndValues(){
			var paramName = formElement.paramName;
			var radioValue = $("input[name='"+formElement.name+"']:checked").val();
			if (!Utils.isNull(radioValue)){
				self._props_._values[paramName] = radioValue;
			}else{
				self._props_._values[paramName] = formElement.defaultValue;
			}
		}

		self._props_._form_data[tag] = {
			paramName: formElement.paramName,
			component: compContainer,
			type: 'radio',
			formElement: formElement,
			status: 0,
			statusId: statusId,
			isValid: true
		};
	}






















}
function FormComponent_addCheckBoxGroup(opts,self){

	if(Utils.isNull(opts.checkboxes)){
		console.error('No checkboxes option provided!');
		return;
	}

	var formElement = new FormComponentDefaults(checkbox,self);
	var tag = formElement.tag;

	var topDiv = Utils.createElement();
	var storedCheckboxes = [];
	for(var i = 0; i<opts.checkboxes.length; i++){
		var checkbox = opts.checkboxes[i];
		var formElementCheckbox = new FormComponentDefaults(checkbox,self);
		storedCheckboxes.push({
			checkbox: opts.checkboxes[i],
			formElement: formElementCheckbox
		});
		var checkbox = Utils.createElement({
			el: 'checkbox', 
			id: formElementCheckbox.id,
			value: formElementCheckbox.value,
			name: formElementCheckbox.name,
			selector: formElementCheckbox.selector,
			className: "form-check-input",
			placeholder: formElementCheckbox.placeholder,
			style: formElementCheckbox.style
		});
		var label = Utils.createElement('label',{
			for: formElementCheckbox.id,
			className: "form-check-label",
			innerHTML: formElementCheckbox.label
		});

		var div = Utils.createElement({
			className: "form-check",
		});
		div.appendChild(checkbox);
		div.appendChild(label);
		topDiv.appendChild(div);
		_Utils_registerListenerCallback(checkbox,self);

	}
	var statusId = Utils.randomGenerator(12,false);
	var status = Utils.createElement('span',{ id: statusId });
	topDiv.appendChild(status);
	var compContainer = new ContainerComponent({body:topDiv});

	var form_handler = self._props_._form_handler;
	var event_trigger_submit = self._props_._triggers.submit;
	var event_trigger_reset = self._props_._triggers.reset;
	compContainer.listenTo(form_handler, event_trigger_submit, function(msg) {
		self._props_._form_data[tag].status = 2;
		initializeValidationAndValues();
		self._props_._form_data[tag].status = 1;
	});
	compContainer.listenTo(form_handler, event_trigger_reset, function(msg) {
		self._props_._form_data[tag].status = 0;
	});
	
	
	

	function initializeValidationAndValues(){
		var validation = new FormValidationDefaults(opts.validation);
		for(var i = 0; i<storedCheckboxes.length; i++){
			var checkbox = storedCheckboxes[i].checkbox;
			var formEl = storedCheckboxes[i].formElement;
			var paramName = formEl.name;
			var selector = formEl.selector;
			
			if ($(selector).is(":checked")){
				self._props_._values[paramName] = checkbox.value;
			}else{
				self._props_._values[paramName] = formEl.defaultValue;
			}
		}
	}


	

	
	
	
	
	
	

	

	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	self._props_._form_data[tag] = {
		paramName: formElement.paramName,
		component: compContainer,
		type: 'checkbox',
		formElement: formElement,
		status: 0,
		statusId: statusId,
		isValid: true
	};
	
	
	















}

function FormComponent_datePicker(obj,self){
	var formElement = new FormComponentDefaults(obj,self);
	var tag = formElement.tag;

	var styles = formElement.style;
	var classes = formElement.className;

	var format = (Utils.isNull(obj.format)) ? "m d y" : obj.format;
	var seperator = (Utils.isNull(obj.seperator)) ? "/" : obj.seperator;

	var required = false;
	var id = Utils.removeSelector(formElement.selector);
	var paramName = formElement.paramName;
	
	var label = formElement.label;

	var mFormat = ""
	var monthFormat = (Utils.isNull(obj.monthFormat)) ? "num" : obj.monthFormat;
	if(monthFormat=="abbr"){
		mFormat = ""
			+"<option selected>Jan</option>"
	        +"<option>Feb</option>"
	        +"<option>Mar</option>"
	        +"<option>Apr</option>"
	        +"<option>May</option>"
	        +"<option>Jun</option>"
	        +"<option>Jul</option>"
	        +"<option>Aug</option>"
	        +"<option>Sep</option>"
	        +"<option>Oct</option>"
	        +"<option>Nov</option>"
	        +"<option>Dec</option>";
    }
    if(monthFormat=="full"){
	mFormat = ""
		+"<option selected>January</option>"
        +"<option>February</option>"
        +"<option>March</option>"
        +"<option>April</option>"
        +"<option>May</option>"
        +"<option>June</option>"
        +"<option>July</option>"
        +"<option>August</option>"
        +"<option>September</option>"
        +"<option>October</option>"
        +"<option>November</option>"
        +"<option>December</option>";
       }
    if(monthFormat=="num"){
    mFormat = ""
		+"<option selected>1</option>"
        +"<option>2</option>"
        +"<option>3</option>"
        +"<option>4</option>"
        +"<option>5</option>"
        +"<option>6</option>"
        +"<option>7</option>"
        +"<option>8</option>"
        +"<option>9</option>"
        +"<option>10</option>"
        +"<option>11</option>"
        +"<option>12</option>";
    }
	var i =
		""
		
    	+"	<div class=\"nativeDatePicker\">"
    	+"		<label for=\""+id+"\">"+label+"</label>"
      	+"		<input type=\"date\" id=\""+id+"\" name=\""+id+"\">"
      	+"		<span class=\"validity\"></span>"
    	+"	</div>"
    	+"	<p class=\"fallbackLabel\">"+label+"</p>"
		+"	<div class=\"fallbackDatePicker\">"
      	+"		<span>"
        +"			<label for=\""+id+"-day\">Day:</label>"
        +"			<select id=\""+id+"-day\" name=\"day\">"
       	+" 			</select>"
      	+"		</span>"
      	+"		<span>"
        +"			<label for=\""+id+"-month\">Month:</label>"
        +"			<select id=\""+id+"-month\" name=\"month\">"
        + mFormat
        /*
        +"				<option selected>January</option>"
        +"				<option>February</option>"
        +"				<option>March</option>"
        +"				<option>April</option>"
        +"				<option>May</option>"
        +"				<option>June</option>"
        +"				<option>July</option>"
        +"				<option>August</option>"
        +" 				<option>September</option>"
        +"				<option>October</option>"
        +"				<option>November</option>"
        +"				<option>December</option>"
        */
        +"			</select>"
      	+"		</span>"
      	+"		<span>"
        +"			<label for=\""+id+"-year\">Year:</label>"
        +"			<select id=\""+id+"-year\" name=\"year\">"
        +"			</select>"
      	+"		</span>"
      	+"	</div>";
      	



    var createElement = Utils.createElement;
	var topDiv = createElement({
		className: "form-group"
	});

	var select = Utils.convertStringToHTMLNode(i);
	topDiv.appendChild(select);
	var statusId = Utils.randomGenerator(12,false);
	var status = Utils.createElement('span',{ id: statusId });
	topDiv.appendChild(status);


    var statusId = Utils.randomGenerator(12,false);
	var status = Utils.createElement('span',{ id: statusId });
	topDiv.appendChild(status);
	var compContainer = new ContainerComponent({body:topDiv});

	var form_handler = self._props_._form_handler;
	var event_trigger_submit = self._props_._triggers.submit;
	var event_trigger_reset = self._props_._triggers.reset;
	compContainer.listenTo(form_handler, event_trigger_submit, function(msg) {
		self._props_._form_data[tag].status = 2;
		initializeValidationAndValues();
		self._props_._form_data[tag].status = 1;
	});
	compContainer.listenTo(form_handler, event_trigger_reset, function(msg) {
		self._props_._form_data[tag].status = 0;
	});


	self._props_._form_data[tag] = {
		paramName: formElement.paramName,
		component: compContainer,
		type: 'datePicker',
		formElement: formElement,
		status: 0,
		statusId: statusId,
		isValid: true
	};


	
	
	
	
	
	
	
	
	

	function initializeValidationAndValues(){
		var y = $("#"+id+"-year").val();
		var m = $("#"+id+"-month").val();
		var d = $("#"+id+"-day").val();
		
		var date = "";
		var f = format.split(" ");
		for(var i=0; i<f.length; i++){
			_setup(f[i]);
		}
		function _setup(fm){
			if(fm=="y"){
				_setdate(y);
			}else if(fm=="m"){
				_setdate(m);
			}else if(fm=="d"){
				_setdate(d);
			}
		}
		function _setdate(dateString){
			if(date==""){
				date += dateString;
			}else{
				date = date+""+seperator+""+dateString;
			}
		}

		self._props_._values[formElement.paramName] = date;

	}

	_Utils.registerListenerCallbackForSelf("run","",function(d){

		var nativePicker = document.querySelector('.nativeDatePicker');
		var fallbackPicker = document.querySelector('.fallbackDatePicker');
		var fallbackLabel = document.querySelector('.fallbackLabel');

		var yearSelect = document.querySelector("#"+id+"-year");
		var monthSelect = document.querySelector("#"+id+"-month");
		var daySelect = document.querySelector("#"+id+"-day");

		
		fallbackPicker.style.display = 'none';
		fallbackLabel.style.display = 'none';

		
		var test = document.createElement('input');
		test.type = 'text';

		
		if(test.type === 'text') {
		  
		  nativePicker.style.display = 'none';
		  fallbackPicker.style.display = 'block';
		  fallbackLabel.style.display = 'block';

		  
		  
		  populateDays(monthSelect.value);
		  populateYears();
		}

		function populateDays(month) {
		  
		  
		  while(daySelect.firstChild){
		    daySelect.removeChild(daySelect.firstChild);
		  }

		  
		  var dayNum;

		  
		  if(month === 'January' | month === 'March' | month === 'May' | month === 'July' | month === 'August' | month === 'October' | month === 'December') {
		    dayNum = 31;
		  } else if(month === 'April' | month === 'June' | month === 'September' | month === 'November') {
		    dayNum = 30;
		  } else {
		  
		    var year = yearSelect.value;
		    (year - 2016) % 4 === 0 ? dayNum = 29 : dayNum = 28;
		  }

		  
		  for(i = 1; i <= dayNum; i++) {
		    var option = document.createElement('option');
		    option.textContent = i;
		    daySelect.appendChild(option);
		  }

		  
		  
		  
		  if(previousDay) {
		    daySelect.value = previousDay;

		    
		    
		    
		    
		    if(daySelect.value === "") {
		      daySelect.value = previousDay - 1;
		    }

		    if(daySelect.value === "") {
		      daySelect.value = previousDay - 2;
		    }

		    if(daySelect.value === "") {
		      daySelect.value = previousDay - 3;
		    }
		  }
		}

		function populateYears() {
		  
		  var date = new Date();
		  var year;
		  if(Utils.isNull(obj.yearsAgo)){
		  	year = date.getFullYear();
		  }else{
		  	year = date.getFullYear()-obj.yearsAgo;
		  }
		  

		  
		  for(var i = 0; i <= 100; i++) {
		    var option = document.createElement('option');
		    option.textContent = year-i;
		    yearSelect.appendChild(option);
		  }
		}

		
		
		yearSelect.onchange = function() {
		  populateDays(monthSelect.value);
		}

		monthSelect.onchange = function() {
		  populateDays(monthSelect.value);
		}

		
		var previousDay;

		
		
		daySelect.onchange = function() {
		  previousDay = daySelect.value;
		}


	},self);
}
function FormComponent_addFileUpload(opts,self){

	if(Utils.isNull(opts.url)){
		console.error("Please provide a URL");
		return;
	}

	var url = opts.url;

	var showPercent = false;
	if(Utils.isNull(opts.percent)){
		opts.percent = {};
	}else{
		showPercent = true;
	}
	opts.percent = _handle_percent_defaults(opts.percent);
	function _handle_percent_defaults(p){
		if(Utils.isNull(p.id)){
			id: Utils.randomGenerator(12,false);
		}
		if(Utils.isNull(p.classes)){
			p.classes = "";
		}
		if(Utils.isNull(p.style)){
			p.style = "";
		}
		if(Utils.isNull(p.handle)){
			p.handle = false;
		}
		if(Utils.isNull(p.el)){
			p.el = "div";
		}
		return p;
	}

	


	var containerDefaults = new ComponentDefaults(opts,self);
	var formDefaults = new ComponentDefaults(opts.form,self);
	var inputDefaults = new ComponentDefaults(opts.input,self);
	var submitDefaults = new ComponentDefaults(opts.submit,self);

	var createElement = Utils.createElement;
	var topDiv = createElement({
		className: "custom-file",
		id: self.getId()
	});
	var formElement = createElement({
		el: "form",
		className: formDefaults.className+"",
		id: formDefaults.id,
		style: formDefaults.style,
		className: formDefaults.className
	});
	var labelId = Utils.randomGenerator(12,false);
	var labelElement = createElement({
		el: "label",
		innerHTML: containerDefaults.label,
		className: "custom-file-label",
		id: labelId
	});
	var inputId = Utils.randomGenerator(12,false);
	var inputElement = createElement({
		type: "file",
		name: inputDefaults.name,
		id: inputId,
		style: inputDefaults.style,
		className: inputDefaults.className+" custom-file-input"
	});
	var submitElement = createElement({
		type: "submit",
		value: submitDefaults.label,
		name: submitDefaults.name,
		id: submitDefaults.id,
		className: submitDefaults.className,
		style: submitDefaults.style
	});
	var percentElement = createElement({
		el: opts.percent.el,
		id: opts.percent.id,
		className: opts.percent.classes,
		style: opts.percent.style
	});

	formElement.appendChild(labelElement);
	formElement.appendChild(inputElement);
	formElement.appendChild(submitElement);
	topDiv.appendChild(formElement);
	if(showPercent){
		topDiv.appendChild(percentElement);
	}

	self._props_._name = inputDefaults.name;

	self._props_._upload_element = topDiv;


	_Utils_registerListenerCallbackForSelf('run','',function(){

		document.getElementById(inputId).onchange = function(e){
			var fileInput = this;
			if(fileInput.files.length>0){
				if(!Utils.isNull(opts.characters)){
					var doesIncludeSpaces = fileInput.files[0].name.includes(" ");
					if(doesIncludeSpaces){
						alert("File name cannot contain spaces");
						return;
					}
				}
				if(!Utils.isNull(opts.limit)){
					var isOver = _handle_file_size_limit(fileInput);
					if(isOver) return;
 				}else{
					document.getElementById(labelId).innerHTML = fileInput.files[0].name;
				}
			}
		};

		function _handle_file_size_limit(fileInput){
			var limit = Utils.validatefilesize(fileInput.files,opts.limit.size);
			if(limit.isOver){
				if(!Utils.isNull(opts.limit.func)){
					opts.limit.func(fileInput.files[0]);
				}
			}else{
				document.getElementById(labelId).innerHTML = fileInput.files[0].name;
			}
			return limit.isOver;
		}

		$('#'+submitDefaults.id).click(function(e){
			e.preventDefault();


			if(typeof url === "boolean"){
				if(!Utils.isNull(opts.submit) && !Utils.isNull(opts.submit.func)){
					var fileInput = document.getElementById(inputId);
					opts.submit.func(fileInput);
				}
				return;
			} 

			var request = new XMLHttpRequest();
			var fileInput = document.getElementById(inputId);

			if(!Utils.isNull(opts.submit) && !Utils.isNull(opts.submit.func)){
				opts.submit.func(fileInput);
			}

			if(fileInput.files.length==0){
				if(self._errorcallback!=null || self._errorcallback!=undefined){
					var t = { type:1, message:"No File" };
					self._errorcallback(t);
				}
				return false;
			}

			if(!Utils.isNull(opts.characters)){
				var doesIncludeSpaces = fileInput.files[0].name.includes(" ");
				if(doesIncludeSpaces){
					alert("File name cannot contain spaces");
					return;
				}
			}

			if(!Utils.isNull(opts.limit)){
				var isOver = _handle_file_size_limit(fileInput);
				if(isOver) return;
			}

			var requestHeader;
			if(!Utils.isNull(self._props_._requestHeader)){
				 requestHeader = self._props_._requestHeader;
			}else{
				 requestHeader = [];
			}

			var data = new FormData();
			
			for(var i=0; i<fileInput.files.length; i++){
				data.append(self._props_._name, fileInput.files[i]); 
			}

			
			
			
			
			


			if(self._beforLoadcallback!=null && self._beforLoadcallback!=undefined){
				stop = self._beforLoadcallback(fileInput.files[0],stop);
				if(stop==null || stop==undefined) stop = false;
			}

			request.upload.addEventListener('progress', function(e){
				
				if(e.lengthComputable){
					var percent = e.loaded / e.total;
					console.log(percent);
			
					if(!showPercent) return;
					if(opts.percent.handle==false){
						var progress = document.getElementById(opts.percent.id);
						
						while(progress.hasChildNodes()){
							progress.removeChild(progress.firstChild);
						}
						progress.appendChild(document.createTextNode(Math.round(percent * 100) + " %" ));
					}else{
						if(!Utils.isNull(opts.percent.func)){
							opts.percent.func(percent,e);
						}
					}
				}
			});

			
			request.upload.addEventListener('load', function(e){
				self.completed = true;
				var r = {
					filename: self.filename,
					self: self,
					event: e
				};
				if(self._loadcallback!=null && self._loadcallback!=undefined){
					self._loadcallback(r);
				} 
			});

			request.upload.addEventListener('error', function(e){
				if(self._errorcallback!=null || self._errorcallback!=undefined){
					var t = { type:2, message:"", event:e, request:request };
					self._errorcallback(t);
				}
			});

			request.open("POST", url);
			request.setRequestHeader("Cache-Control","no-cache");
			if(requestHeader!=null || requestHeader!=undefined){
				for(var g=0;g<requestHeader.length;g++){
					request.setRequestHeader(requestHeader[g].param, requestHeader[g].value);
				}
			}
			request.send(data);
		});

	},self);
}


function charactersValidation(val,validation){
	var _isvalid = false;
	var  letters = [
	 "a","b","c","d","e","f","g","h","i","j","c","l","m","n","o"
	,"p","q","r","s","t","u","v","w","x","y","z"
	,"A","B","C","D","E","F","G","H","I","J","K","L","M","N"
	,"O","P","Q","R","S","T","U","V","W","X","Y","Z"
	];
	var numbers = ["0","1","2","3","4","5","6","7","8","9"];
	var special = [
	 "!","@","#","$","%","^","&","*","(",")","-","_","+","=","~"
	,"`","{","}","[","]","\\","|","'","\"",";",":","<",">",",","."
	,"/","?"," "
	];

	var error = (Utils.isNull(validation.characters.error)) ? "" : validation.characters.error;
	var success = (Utils.isNull(validation.characters.success)) ? "" : validation.characters.success;

	var beginChar = validation.characters.beginWithSpecialChar;
	var beginCharMsg = "";
	var endChar = validation.characters.endWithSpecialChar;
	var endCharMsg = "";
	var allowNumbers = validation.characters.numbers;
	var allowNumbersMsg = "";
	var beginNum = validation.characters.beginWithNumber;
	var beginNumMsg = "";
	var endNum = validation.characters.endWithNumber;
	var endNumMsg = "";
	var lowercase = validation.characters.lowercase;
	var lowercaseMsg = "";
	var uppercase = validation.characters.uppercase;
	var uppercaseMsg = "";
	var except = validation.characters.except;

	if(typeof validation.characters === 'boolean'){
		if(validation.characters){
			var valid = run();
			if(!valid) return false;
		}
	}else if(typeof validation.characters === 'string'){
		error = validation.characters;
		var valid = run();
		if(!valid) return false;
	}else{
		var valid = run();
		if(!valid) return false;
	}

	function run(){
		runSetupDefualts();
		valid = runBeginAndEndWithNum();
		if(valid){ 
			valid = runBeginAndEndWithChar(); 
		}else{ 
			return false;
		}
		if(valid){ 
			valid = runCheckSpecialCharacters(); 
		}else{ 
			return false;
		}
		if(valid){ 
			valid = runCase();
		}else{
			return false;
		}
		_add_success_(success);
			return valid
	}

	function runCase(){
		if(!Utils.isNull(validation.characters.changeToLowerCase)){
			val = val.toLowerCase();
		}
		if(!Utils.isNull(validation.characters.changeToLowerCase)){
			val = val.toLowerCase();
		}
		if(!Utils.isNull(lowercase)){
			if(lowercase){
				_add_error_(lowercaseMsg);
				return false;
			}
		}
		if(!Utils.isNull(uppercase)){
			if(uppercase){
				_add_error_(uppercaseMsg);
				return false;
			}
		}
	}
	function runBeginAndEndWithNum(){
		var isValid = true;
		if(!beginNum){
			var isNumber = checkIfNumber(val.charAt(1));
			if(isNumber){
				isValid = false;
				_add_error_(beginNumMsg);
			}
		}
		if(!endNum){
			var isNumber = checkIfNumber(val.charAt(1));
			if(isNumber){
				isValid = false;
				_add_error_(endNumMsg);
			}
		}
		return isValid;
	}
	function runBeginAndEndWithChar(){
		var isValid = true;
		if(!beginChar){
			var isLetter = checkIfLetter(val.charAt(1)); 
			var isNumber = checkIfNumber(val.charAt(1));
			var isExcept = checkIfException(val.charAt(1));
			if(!isLetter && !isNumber && !isExcept){
				isValid = false;
				_add_error_(beginCharMsg);
			}
		}
		if(!endChar){
			var isLetter = checkIfLetter(val.charAt(1)); 
			var isNumber = checkIfNumber(val.charAt(1));
			var isExcept = checkIfException(val.charAt(1));
			if(!isLetter && !isNumber && !isExcept){
				isValid = false;
				_add_error_(endCharMsg);
			}
		}
		return isValid;
	}
	function runCheckSpecialCharacters(){
		
		var isValid = true;
		for(var i=0; i<val.length; i++){
			var breakIt = false;
			var isLetter = checkIfLetter(val[i]);
			
			if(!isLetter){
				var isNumber = checkIfNumber(val[i]);
				if(isNumber){
					if(!allowNumbers){
						_add_error_(allowNumbersMsg);
						isValid = false;
						breakIt = true;
					}
				}else{
					var _valid_special_char = checkIfException(val[i]); 
					if(!_valid_special_char){
						isValid = false;
						_add_error_(error);
						breakIt = true;
					}
				}
				if(breakIt) break;
			}
		}
		return isValid;
	}

	
	function checkIfException(char){
		var _valid_special_char = false;
		for(var g=0; g<except.length; g++){
			if(val[i]==except[g]){
				_valid_special_char = true;
			}
		}
		return _valid_special_char;
	}
	function checkIfLetter(letter){
		var _is_letter = false;
		for(var j=0; j<letters.length; j++){
			if(letters[j]==letter){
				_is_letter = true;
				break;
			}
		}
		return _is_letter;
	}
	function checkIfNumber(num){
		var _is_num = false;
		for(var j=0; j<numbers.length; j++){
			if(numbers[j]==num){
				_is_num = true;
				break;
			}
		}
		return _is_num;			
	}



















	function runSetupDefualts(){

		if(!Utils.isNull(validation.characters.trim)){
			if(validation.characters.trim)
				val = val.trim();
		}
		if(Utils.isNull(except)){
			except = [];
		}	
		if(Utils.isNull(beginChar)){
			beginChar = false;
		}else{
			if(typeof beginChar === "string"){
				beginCharMsg = beginChar;
				beginChar = false;
			}else{
				beginCharMsg = error;
			}
		}
		if(Utils.isNull(endChar)){
			endChar = true;
		}else{
			if(typeof endChar === "sring"){
				endCharMsg = endChar;
				endChar = false;
			}else{
				endCharMsg = error;
			}
		}
		if(Utils.isNull(allowNumbers)){
			allowNumbers = true;
		}else{
			if(typeof allowNumbers === "string"){
				allowNumbersMsg = allowNumbers;
				allowNumbers = false;
			}else{
				allowNumbersMsg = error;
			}
		}
		if(Utils.isNull(beginNum)){
			beginNum = true;
		}else{
			if(typeof beginNum === 'string'){
				beginNumMsg = beginNum;
				beginNum = false;
			}else{
				beginNumMsg = error;
			}
		}
		if(Utils.isNull(endNum)){
			endNum = true;
		}else{
			if(typeof endNum === "string"){
				endNumMsg = endNum;
				endNum = false;
			}else{
				endNumMsg = error;
			}
		}
		if(Utils.isNull(lowercase)){
			lowercase = true;
		}else{
			if(typeof lowercase === "string"){
				lowercaseMsg = lowercase;
				lowercase = false;
			}else{
				lowercaseMsg = error;
			}
		}
		if(Utils.isNull(uppercase)){
			uppercase = true;
		}else{
			if(typeof uppercase === "string"){
				uppercaseMsg = uppercase;
				uppercase = false;
			}else{
				uppercaseMsg = error;
			}
		}
	}





	return _isvalid;
}




/* 0000 - FormEventsHandler */
function FormEventsHandler_constructor(obj,formElement,self){
	var preventDefault = false;
	var stopPropagation = false;
	if(!Utils.isNull(obj.focusin)){
		_Utils_registerListenerCallbackForSelf(
			"focusin",
			formElement.selector,
			obj.focusin,
			self,
			preventDefault,
			stopPropagation
		);
	}
	if(!Utils.isNull(obj.focusout)){
		_Utils_registerListenerCallbackForSelf(
			"focusout",
			formElement.selector,
			obj.focusin,
			self,
			preventDefault,
			stopPropagation
		);
		
	}
	if(!Utils.isNull(obj.keyup)){
		_Utils_registerListenerCallbackForSelf(
			"keyup",
			formElement.selector,
			obj.focusin,
			self,
			preventDefault,
			stopPropagation
		);
		
	}
	if(!Utils.isNull(obj.keydown)){
		_Utils_registerListenerCallbackForSelf(
			"keydown",
			formElement.selector,
			obj.focusin,
			self,
			preventDefault,
			stopPropagation
		);
		
	}
	if(!Utils.isNull(obj.mouseover)){
		_Utils_registerListenerCallbackForSelf(
			"mouseover",
			formElement.selector,
			obj.focusin,
			self,
			preventDefault,
			stopPropagation
		);
		
	}
}








/* 0000 - ModalComponent */
function ModalDialogComponent_mobile(){


	function addClass(e, c) {
		var newclass = e.className.split(" ");
		if (e.className === "") newclass = [];
		newclass.push(c);
		e.className = newclass.join(" ");
	};

	function extend(source, target) {
		for (var key in target) {
			source[key] = target[key];
		}
		return source;
	}

	function getAnimationEndName(dom) {
		var cssAnimation = ["animation", "webkitAnimation"];
		var animationEnd = {
			"animation": "animationend",
			"webkitAnimation": "webkitAnimationEnd"
		};
		for (var i = 0; i < cssAnimation.length; i++) {
			if (dom.style[cssAnimation[i]] != undefined) {
				return animationEnd[cssAnimation[i]];
			}
		}
		return undefined;
	}
	function getFontSize() {
		var clientWidth = document.documentElement.clientWidth;
		if (clientWidth < 640) return 16 * (clientWidth / 375) + "px";else return 16;
	}

	var layer = {
		initOpen: function initOpen(dom, options) {

			dom.style.fontSize = getFontSize();

			var body = document.querySelector("body");
			var bg = document.createElement("div");
			addClass(bg, "dialog-mobile-bg");
			if (options.showBottom == true) {
				addClass(bg, "animation-bg-fadeIn");
			}

			if (options.bottom) {
				bg.addEventListener("click", function () {
					handleClose();
				});
			}

			body.appendChild(bg);
			body.appendChild(dom);

			var animationEndName = getAnimationEndName(dom);
			function handleClose() {
				if (animationEndName) {
					layer.close([bg]);
					addClass(dom, options.closeAnimation);
					dom.addEventListener(animationEndName, function () {
						layer.close([dom]);
					});
				} else {
					layer.close([bg, dom]);
				}
			}

			
			options.btns.forEach(function (btn, i) {
				if(i==0){
					btn.addEventListener("click", function () {
						if(options.onClose!=undefined) options.onClose();
					});	
				}
				if (i != 0 && i <= options.btns.length - 1) {
					if (!options.bottom) {
						btn.addEventListener("click", function () {
							handleClose();
							options.sureBtnClick();
						});
					} else {
						btn.addEventListener("click", function () {
							handleClose();
							options.btnClick(this.getAttribute("i"));
						});
					}
				} else {
					btn.addEventListener("click", handleClose);
				}
			});

			if (!options.bottom) {
				
				dom.style.top = (document.documentElement.clientHeight - dom.offsetHeight) / 2 + "px";
				dom.style.left = (document.documentElement.clientWidth - dom.offsetWidth) / 2 + "px";
			}
		},
		close: function close(doms) {
			var body = document.querySelector("body");
			for (var i = 0; i < doms.length; i++) {
				body.removeChild(doms[i]);
			}
		}
	};

	var mcxDialog = {
		alert: function alert(content) {
			var btn = document.createElement("div");
			btn.innerText = "Ok";
			addClass(btn, "dialog-button");

			var opts = {};
			opts.btns = [btn];

			this.open(content, opts);
		},
		confirm: function confirm(content, options) {
			var opts = {
				sureBtnText: "Ok",
				sureBtnClick: function sureBtnClick() {}
			};
			opts = extend(opts, options);

			var cancelBtn = document.createElement("div");
			cancelBtn.innerText = "Cancel";
			addClass(cancelBtn, "dialog-cancel-button");

			var sureBtn = document.createElement("div");
			sureBtn.innerText = opts.sureBtnText;
			addClass(sureBtn, "dialog-sure-button");

			opts.btns = [cancelBtn, sureBtn];
			this.open(content, opts);
		},
		open: function open(content, options) {
			var dialog = document.createElement("div");
			var dialogContent = document.createElement("div");

			addClass(dialog, "dialog-mobile");
			addClass(dialog, "animation-zoom-in");
			addClass(dialogContent, "dialog-content");

			dialogContent.innerHTML = content;

			dialog.appendChild(dialogContent);

			options.btns.forEach(function (btn, i) {
				dialog.appendChild(btn);
			});
			options.closeAnimation = "animation-zoom-out";

			layer.initOpen(dialog, options);
		},
		showBottom: function showBottom(options) {
			var opts = {
				btn: ["Ok"],
				btnColor: [],
				btnClick: function btnClick(index) {}
			};
			opts = extend(opts, options);
			opts.bottom = true;
			if (opts.btn.length == 1 && opts.btn[0] == "删除") {
				opts.btnColor = ["#EE2C2C"];
			}

			var bottomDialog = document.createElement("div");
			var dialogItem = document.createElement("div");
			var cancelBtn = document.createElement("div");
			cancelBtn.innerText = "Cancel";
			addClass(bottomDialog, "dialog-mobile-bottom");
			addClass(bottomDialog, "animation-bottom-in");
			addClass(dialogItem, "bottom-btn-item");
			addClass(cancelBtn, "dialog-cancel-btn");

			bottomDialog.appendChild(dialogItem);
			bottomDialog.appendChild(cancelBtn);

			opts.btns = [];
			opts.btns.push(cancelBtn);
			opts.btn.forEach(function (b, i) {
				var btn = document.createElement("div");
				btn.innerText = opts.btn[i];
				btn.setAttribute("i", i + 1);
				addClass(btn, "dialog-item-btn");
				if (opts.btnColor[i]) btn.style.color = opts.btnColor[i];
				dialogItem.appendChild(btn);
				opts.btns.push(btn);
			});
			opts.closeAnimation = "animation-bottom-out";
			opts.showBottom = true;

			layer.initOpen(bottomDialog, opts);
		},
		toast: function toast(content, time) {
			time = time || 3;
			var toast = document.createElement("div");
			var toastContent = document.createElement("div");

			addClass(toast, "dialog-mobile-toast");
			addClass(toast, "animation-fade-in");
			addClass(toastContent, "toast-content");

			toastContent.innerText = content;

			toast.appendChild(toastContent);

			var body = document.querySelector("body");
			body.appendChild(toast);

			toast.style.fontSize = getFontSize();
			toast.style.left = (document.documentElement.clientWidth - toast.offsetWidth) / 2 + "px";

			setTimeout(function () {
				body.removeChild(toast);
			}, time * 1000);
		},

		loadElement: [],
		loading: function loading(options) {
			var opts = {
				src: "assets/img",
				hint: ""
			};
			var type = "";
			opts = extend(opts, options);
			if(opts.type==undefined){
				type = "/loading-1.gif";
			}else{
				if(typeof opts.type === 'number'){
					if(opts.type == 1){
						type = "/loading-1.gif";
					} 
					if(opts.type == 2){
						type = "/loading-2.gif";
					}
				}else if(typeof opts.type === 'string'){
					type = opts.type;
				}
			}

			var loadingBg = document.createElement("div");
			var loading = document.createElement("div");
			var img = document.createElement("img");

			addClass(loadingBg, "mobile-loading-bg");
			addClass(loading, "mobile-loading");
			addClass(loading, "animation-zoom-in");
			img.src = opts.src + type;
			loading.appendChild(img);

			if (opts.hint) {
				var loadingContent = document.createElement("div");
				addClass(loadingContent, "loading-content");
				loadingContent.innerText = opts.hint;
				loading.appendChild(loadingContent);
			}

			var body = document.querySelector("body");
			body.appendChild(loadingBg);
			body.appendChild(loading);

			loading.style.fontSize = getFontSize();
			loading.style.left = (document.documentElement.clientWidth - loading.offsetWidth) / 2 + "px";
			loading.style.top = (document.documentElement.clientHeight - loading.offsetHeight) / 2 + "px";

			this.loadElement.push(loadingBg);
			this.loadElement.push(loading);
		},
		closeLoading: function closeLoading() {
			layer.close(this.loadElement);
			this.loadElement = [];
		}
	};

	
	mcxDialog.install = function (Vue, options) {
		Vue.prototype.$mcxDialog = mcxDialog;
	};

	return mcxDialog;



}



/* 0000 - Utils */
function Utils_createELement(type,options){
	
	if(Utils.isNull(type)){
		return document.createElement('div');
	}
	var inputTypes = ["input","checkbox","radio","submit","file"];
	var ownTypes = ["el","selector","_el","_selector"];
	var oneParam = ["disabled","selected"];
	if(typeof type !== 'string'){
		options = type;
		if(!Utils.isNull(options) && !Utils.isNull(options.el)){
			type = options.el;
		}else{
			if(!Utils.isNull(options.type) && isInputType(options.type)){
				type = options.type;
			}else{
				type = "div";
			}
		}
	}

	var element = document.createElement(type);
	for(var i=0; i<inputTypes.length; i++){
		if(inputTypes[i]==type){
			element = document.createElement('input');
			element.type = type;
			break;
		}
	}
	function isInputType(t){
		var isType = false;
		for(var i=0; i<inputTypes.length; i++){
			if(inputTypes[i]==t){
				isType = true;
				break;
			}
		}
		return isType;
	}
	if(Utils.isNull(element)){
		return document.createElement('div');
	}
	for(var i in options){
		var isOwnType = false;
		for(var n=0; n<ownTypes.length; n++){
			if(ownTypes[n]==i){
				isOwnType = true;
				break;
			}
		}
		if(isOwnType) continue;
		if(!Utils.isNull(element)){
			if(i == "className"){
				element.className = options[i];
			}else if(i == "innerHTML"){
				element.innerHTML = options[i];
			}else{
				element.setAttribute(i, options[i]);
			}
			
		}
	}
	return element;
}
function Utils_randomGenerator(len,specialChars){
	var text = "";
	var possible = null;
	if(specialChars==null || specialChars== undefined || specialChars==false)
		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	else
		possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=+!#*^_";

	if(len==null || len==undefined) len = 5;

	for( var i=0; i < len; i++ )
	   text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}
function Utils_convertStringToHTMLNode(string,isFrag){
	if(typeof string === "object") return string;
	var xmlString = string,
	    parser = new DOMParser(),
	    doc = parser.parseFromString(xmlString, "text/html");
	    var frag = document.createDocumentFragment();
	    if(!Utils.isNull(doc.body)){
			for(var i=0;i<doc.body.childNodes.length;i++){
				frag.appendChild(doc.body.childNodes[i].cloneNode(true));
		    }
	    }
	return frag.cloneNode(true);
}
function Utils_convertFragmentToHTMLText(fragment){
	var div = document.createElement('div');
	div.appendChild( fragment.cloneNode(true) );
	var html = div.innerHTML;
	return html;
}
function Utils_containsSpecialChars(str, charExceptions, canBegin, canEnd, multiples){
	var contains = false;

	if(charExceptions==null || charExceptions==undefined){
		for(var i=0;i<Utils.specialChars.length;i++){
			var includes = str.includes(Utils.specialChars[i]);
			if(includes){
				return true;
			}
		}
	}else{
		var s = str.split("");
		for(var i=0;i<Utils.specialChars.length;i++){
			var special_character = Support.Utils.specialChars[i];
			var includes = str.includes(special_character);
			if(includes){
				if(canBegin!=undefined && !canBegin){
					if(str.startsWith(special_character)){
						return true;
					}
				}
				if(canEnd!=undefined && !canEnd){
					if(str.endsWith(special_character)){
						return true;
					}
				}

				
				
				
				
				
				
				
				
				
				
				

				for(var v=0;v<s.length;v++){
					if(s[v]==special_character){
						if(!isExceptionCharacter(s[v],charExceptions)){
							contains = true;
							break;
						}
					}
				}
			}
			if(multiples!=undefined && multiples){

			}
		}
	}

	function isExceptionCharacter(ch,exceptions){
		var _isException = false;
		for(var h=0;h<exceptions.length;h++){
			if(ch==exceptions[h]){
				_isException = true;
				break;
			}
		}
		return _isException;
	}


	
	
	

	return contains;

}
function Utils_validKey(key){
	var validKey = false;
	var k1 = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	         'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
	         '0','1','2','3','4','5','6','7','8','9','_','.','-'];

	var k = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	         'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
	         '0','1','2','3','4','5','6','7','8','9'];

	var k2 = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	         'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

	for(var i=0;i<k.length;i++){
		if(k[i]==key){
			validKey = true;
		}
	}
	return validKey;
}
function allowOnlyCharacters(str){
	var allowed = "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ-1234567890-_.()";
	allowed = allowed.split("");
	str = str.split("");
	var character = "";
	for(var n=0; n<str.length; n++){
		var check = false;
		for(var i=0; i<allowed.length; i++){
			if(allowed[i]==str[n]){    
				check = true;
				break;
			}
		}

		if(!check){
			return {
				character: character,
				isValid: false
			};
			break;
		}
	}

	return {
		character: character,
		isValid: true
	};
}
function Utils_getClockTime(){
	var now    = new Date();
	var hour   = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	var ap = "AM";
	if (hour   > 11) { ap = "PM";             }
	if (hour   > 12) { hour = hour - 12;      }
	if (hour   == 0) { hour = 12;             }
	if (hour   < 10) { hour   = "0" + hour;   }
	if (minute < 10) { minute = "0" + minute; }
	if (second < 10) { second = "0" + second; }
	var timeString = hour + ':' + minute + ':' + second + " " + ap;
	return timeString;
}
function Utils_detectEngine(){
	
	var isEdge = !Support.Utils.isIE && !!window.StyleMedia;

	
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

	
	var isFirefox = typeof InstallTrigger !== 'undefined';

	
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

	
	var isIE =  /*@cc_on!@*/false || !!document.documentMode;

	
	var isChrome = !!window.chrome && !!window.chrome.webstore;

	
	var isBlink = (isChrome || isOpera) && !!window.CSS;
	return {
		isEdge: isEdge,
		isOpera: isOpera,
		isFirefox: isFirefox,
		isSafari: isSafari,
		isIE: isIE,
		isChrome: isChrome,
		isBlink: isBlink
	};
}






/* 0000 - AppLayout */
function AppLayout_build(self){
	
	
	
	
	
	
	self._props_._elements._fragment = document.createDocumentFragment();
	var layout = self._props_._layout_container;

	var row_count = 0;

	for(prop in layout){
		var row = document.createElement("div");
		var topRowClasses = "";
		if(row_count==1){
			topRowClasses = self._props_._top_row._classes;
			row.id = self._props_._top_row._id;
			row.style = self._props_._top_row._styles;
		}
		
		var columns = layout[prop].columns;
		
		var containerColumn = null;
			
		if(!Utils.isNull(layout[prop].obj)){
			if(!Utils.isNull(layout[prop].obj.classes)){
				topRowClasses = layout[prop].obj.classes;
			}else if(!Utils.isNull(layout[prop].obj.className)){
				topRowClasses = layout[prop].obj.className;
			}
			
		}
		
		row.id = (!Utils.isNull(layout[prop].obj) && !Utils.isNull(layout[prop].obj.id)) ? layout[prop].obj.id : "";
		
		row.className = "row "+topRowClasses;
		for(var i=0;i<columns.length;i++){
			if(Utils.isNull(columns[i][1])){
				containerColumn = document.createElement("div");
				containerColumn.className = _getLayoutColumnClasses(columns[i][0]);
				row.appendChild(containerColumn);
			}else{
				var column = ViewLayoutController_col(columns[i][0],columns[i][1],columns[i][2],columns[i][3]);
				if(!Utils.isNull(containerColumn)){
					containerColumn.appendChild(column);
				}else{
					row.appendChild(column);
				}
			}
		}

		var ap = document.createElement("div");
		ap.id = self.getId();
		row.appendChild(ap);
		self._props_._elements._fragment.appendChild(row);

		if(columns.length==0){ containerColumn = null; }
		row_count++;
	}
}
function AppLayout_col(columns,arrayOfItems,obj,self){
	if(!Array.isArray(arrayOfItems)){
		arrayOfItems = [arrayOfItems];
	}
	
	var currentRow = self._props_._current_row_id;
	var len = self._props_._layout_container[currentRow].columns.length;
	self._props_._layout_container[currentRow].columns[len] = [
		columns,arrayOfItems,obj,self
	];
}

function ViewLayoutController_col(columns,arrayOfItems,obj,self){

	obj = (Utils.isNull(obj)) ? {} : obj;

	var colClasses = _getLayoutColumnClasses(columns);
	var viewId = (viewId==null ||veiwId==undefined) ? "" : viewid;
	var cl = (obj.className==null ||obj.className==undefined) ? "" : obj.className;
	var id = (obj.id==null ||obj.id==undefined) ? "" : obj.id;
	var st = (obj.styles==null ||obj.styles==undefined) ? "" : obj.styles;

	var _fragment = document.createDocumentFragment();
	var topDiv = document.createElement("div");
	topDiv.className = colClasses+" "+cl;
	topDiv.id = id;
	topDiv.style = st;

	var nodes = [];

	var divRow = null;

	for(var i=0;i<arrayOfItems.length;i++){
		if(typeof arrayOfItems[i]=="string"){
			if(arrayOfItems[i].includes("row")){
				var rows1 = arrayOfItems[i].split(" ");
				var row_classes = "";
				var row_id = "";
				for(var m=1; m<rows1.length; m++){

					if(rows1[m].includes("id=")){
						var row1_id = rows1[m].split("=")[1];
						row_id = row1_id;
					}else{
						if(row_classes==""){
							row_classes += rows1[m]; 
						}else{
							row_classes += " "+rows1[m]; 
						}					
					}
				}
				divRow = document.createElement("div");
				divRow.className = "row "+row_classes;
				if(row_id!=""){
					divRow.id = row_id;
				}

			
			
			
			
			}else{
				var mycomp = _getComponentFromRout(arrayOfItems[i],self);
				_handleLayoutType(mycomp,divRow,nodes,colClasses,_fragment,id,st,cl,viewId,topDiv,self);
			}
		}else{
			_handleLayoutType(arrayOfItems[i],divRow,nodes,colClasses,_fragment,id,st,cl,viewId,topDiv,self);
		}
	}
	return topDiv;
}

function _getComponentFromRout(obj123,self){
	var mycomp = null;
	var arrayOfItems = [obj123],
		i = 0;
	
	
	
	if(arrayOfItems[i].charAt(0) == "#"){
		
		var c = stateManager.getMapRoute(self._props_._routes.route,arrayOfItems[i]);
		var f = applicationManager.retrieve(c,Flags.Method);
		if(typeof f === "function"){
			mycomp = f(self._props_._routes);
		}else{
			console.error(arrayOfItems[i]+" is not a function for rout: "+self._props_._routes.route);
		}
	}else if(arrayOfItems[i].charAt(0) == "@"){
		var f = applicationManager.retrieve(arrayOfItems[i],Flags.Method);
		if(typeof f === "function"){
			mycomp = f(self._props_._routes);
		}else{
			
			mycomp = _create_body({ body: arrayOfItems[i], original: true });

			
			
		}
	}
	return mycomp;
}
function _handleLayoutType(obj123,divRow,nodes,colClasses,_fragment,id,st,cl,viewId,topDiv,self){
	var arrayOfItems = [obj123];
	var i = 0;
	if(Utils.isNull(obj123)) return;
	if(arrayOfItems[i].TYPE==Flags.Type.component){
		if(arrayOfItems[i].setParent){
			arrayOfItems[i].setParent(self);
		}
		self._typeHolder["typeComponent"][self._typeHolder.typeComponent.length] = arrayOfItems[i];

		self._props_._extensionObject[self._props_._extensionObject.length] = arrayOfItems[i];

		var node;
		if(typeof arrayOfItems[i].getHtml() === "string"){
			node = convertStringToHTMLNode(arrayOfItems[i].getHtml(self._props_._routes));
			
		}else if(typeof arrayOfItems[i].getHtml() === "object"){
			node = arrayOfItems[i].getHtml(self._props_._routes);
			
		}

		node = arrayOfItems[i].getHtml(self._props_._routes);
		
		if(divRow!=null){
			divRow.appendChild(node);
			topDiv.appendChild(divRow);
			divRow = null;
		}else{
			topDiv.appendChild(node.cloneNode(true));
		}

	}else
	if(arrayOfItems[i].TYPE==Flags.Type.layout){
		if(arrayOfItems[i].setParent){
			arrayOfItems[i].setParent(self);
		}
		self._typeHolder.typeLayout[self._typeHolder.typeLayout.length] = arrayOfItems[i];

		self._props_._extensionObject[self._props_._extensionObject.length] = arrayOfItems[i];

		var node;
		if(typeof arrayOfItems[i].getHtml(self._props_._routes) === "string"){
			node = convertStringToHTMLNode(arrayOfItems[i].getHtml(self._props_._routes));
		}else if(typeof arrayOfItems[i].getHtml(self._props_._routes) === "object"){
			node = arrayOfItems[i].getHtml(self._props_._routes);
		}

		if(divRow!=null){
			divRow.appendChild(node);
			topDiv.appendChild(divRow);
			divRow = null;
		}else{
			topDiv.appendChild(node);
		}

	}else
	if(arrayOfItems[i].TYPE==Flags.Type.view){
		if(arrayOfItems[i].setParent){
			arrayOfItems[i].setParent(self);
		}
		self._typeHolder.typeView[self._typeHolder.typeView.length] = arrayOfItems[i];
		
		self._props_._extensionObject[self._props_._extensionObject.length] = arrayOfItems[i];

		var _view_ = arrayOfItems[i];
		var options = _view_._props_._options;
		var routeView;
		if(options.routable){
			routeView = _getViewFromRoute(); 
		}else{
			routeView = _gethandledView();
		}
		var v = _getComponentType(routeView);
		$(_view_._props_._container).empty();
		_view_._props_._container.appendChild(v.getHtml());
		topDiv.appendChild(_view_._props_._container.cloneNode(true));

		


		function _getComponentType(obj){
			if(Utils.isNull(obj.body)){
				var blankComponent = componentManager.container({
					body: "<div></div>"
				});
				return blankComponent;
			}
			var body = obj.body;
			if(typeof body === "string"){
				if(body.charAt(0) === "@"){
					var view = _getView(body,obj);
					if(Utils.isNull(view)){ return blankComponent; }
					return view;
				}else{
					var stringComponent = componentManager.container({
						body: body,
						listener: obj.listener
					});
					return stringComponent;
				}
			}else if(typeof body === "object"){
				if(!Utils.isNull(body.TYPE)){
					return body;
				}else{
					var stringComponent = componentManager.container({
						body: body,
						listener: obj.listener
					});
					return stringComponent;
				}
			}
			return null;
		}

		function _gethandledView(){
			var rt = _view_._props_._views_objects;
			var view;
			for(var i=0; i<rt.length; i++){
				if(!Utils.isNull(rt[i].init) && rt[i].init==true){
					view = rt[i];
					break;
				}
			}
			if(Utils.isNull(view)){
				view = componentManager.container({
					body: "<div></div>"
				});
			}
			return view;
		}

		function _getViewFromRoute(){
			var params = pages.getRoute().params;
			var rt = _view_._props_._views_objects;

			var validRoute = false;
			
			var route_view = null;
			console.log(rt)
			for(var i=0; i<rt.length; i++){
				if(!Utils.isNull(rt[i].route)){
					for(var n=0; n<params.length; n++){
						if(params[n] == rt[i].route){
							route_view = rt[i];
							validRoute = true;
							break;
						}
					}
					if(validRoute) break;
				}
			}
			if(route_view==null){
				route_view = _gethandledView();
			}
			return route_view;
		}

		


		
		
		

		
		
		
		
		
		
		
		
		
			

		

		
		
		
		
		
		
		
			
		
		
		
		
		

		

		

		
		
		
		
		
		
		
		
		
	}else{
		if(arrayOfItems[i].setParent){
			arrayOfItems[i].setParent(self);
		}
		self._typeHolder["typeComponent"][self._typeHolder.typeComponent.length] = arrayOfItems[i];

		self._props_._extensionObject[self._props_._extensionObject.length] = arrayOfItems[i];

		var node;

		if(typeof arrayOfItems[i] === "string"){
			node = Utils.convertStringToHTMLNode(arrayOfItems[i]);
		}else if(typeof arrayOfItems[i] === "object"){
			node = arrayOfItems[i];
		}else{

			
			if(typeof arrayOfItems[i] === "string"){
				node = convertStringToHTMLNode(arrayOfItems[i].getHtml(self._props_._routes));
			}else if(typeof arrayOfItems[i].getHtml(self._props_._routes) === "object"){
				node = arrayOfItems[i].getHtml(self._props_._routes);
			}
		}
		
		
		if(divRow!=null){
			divRow.appendChild(node);
			topDiv.appendChild(divRow);
			divRow = null;
		}else{
			topDiv.appendChild(node);
		}

	}

}
function _getLayoutColumnClasses(columns){

	
	

	/*


					Extra small devices Small devices 		Medium devices 		Large devices
					Phones (<768px)     Tablets (≥768px)	Desktops (≥992px)	Desktops (≥1200px)
					------------------- ----------------	-----------------	------------------
	.visible-xs-*	Visible				Hidden				Hidden				Hidden
	.visible-sm-*	Hidden				Visible				Hidden				Hidden
	.visible-md-*	Hidden				Hidden				Visible				Hidden
	.visible-lg-*	Hidden				Hidden				Hidden				Visible
	.hidden-xs		Hidden				visible-lg			Visible				Visible
	.hidden-sm		Visible				Hidden				Visible				Visible
	.hidden-md		Visible				Visible				Hidden				Visible
	.hidden-lg		Visible				Visible				Visible				Hidden

	.visible-*-block		display: block;
	.visible-*-inline		display: inline;
	.visible-*-inline-block	display: inline-block;

	*/


	var colClasses = "";

	

	for(col in columns){

		if(col.includes("offset")){
			colClasses = colClasses+" "+_sortClassesOffset(col,columns,colClasses);
		}else if(col.includes("visible")){
			colClasses = colClasses+" "+_sortClassesVisible(col,columns,colClasses);
		}else if(col.includes("hidden")){
			colClasses = colClasses+" "+_sortClassesHidden(col,columns,colClasses);


		}else if(col.includes("d_none")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_inline")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_inline_block")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_block")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_table")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_table_cell")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_table_row")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_flex")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else if(col.includes("d_inline_flex")){
			colClasses = _sortClassesDisplay(col,columns,colClasses)
		}else{
			if(colClasses==""){
				colClasses = colClasses+" "+colClasses+"col-"+col+"-"+columns[col]+" ";
			}else{
				colClasses = colClasses+" "+colClasses+"col-"+col+"-"+columns[col]+" ";
			}
		}
	}
	return colClasses;
}

function _sortClassesDisplay(col,columns,colClasses){


	if(col.includes("d_none")){
		return _displaythis("d-"+columns[col]+"-none",colClasses);
	}else if(col.includes("d_inline")){
		return _displaythis("d-"+columns[col]+"-inline",colClasses);
	}else if(col.includes("d_inline_block")){
		return _displaythis("d-"+columns[col]+"-inline-block",colClasses)
	}else if(col.includes("d_block")){
		return _displaythis("d-"+columns[col]+"-block",colClasses);
	}else if(col.includes("d_table")){
		return _displaythis("d-"+columns[col]+"-table",colClasses);
	}else if(col.includes("d_table_cell")){
		return _displaythis("d-"+columns[col]+"-table-cell",colClasses);
	}else if(col.includes("d_table_row")){
		return _displaythis("d-"+columns[col]+"-table-row",colClasses);
	}else if(col.includes("d_flex")){
		return _displaythis("d-"+columns[col]+"-flex",colClasses);
	}else if(col.includes("d_inline_flex")){
		return _displaythis("d-"+columns[col]+"-inline-flex",colClasses);
	}
	

	function _displaythis(d,columnClassesString){
		if(columnClassesString==""){
			columnClassesString = d;
		}else{
			columnClassesString = columnClassesString+" "+d;
		}
		return columnClassesString;
	}
}
function _sortClassesVisible(col,columns,colClasses){
	if(colClasses==""){
		
		colClasses = "d-"+columns[col]+"-none";
	}else{
		colClasses = " visible-"+columns[col];
	}
	return colClasses;
}
function _sortClassesHidden(col,columns,colClasses){
	if(colClasses==""){
		colClasses = "hidden-"+columns[col];
	}else{
		colClasses = " hidden-"+columns[col];
	}
	return colClasses;
}
function _sortClassesOffset(col,columns,colClasses){
	if(col.includes("-")){
		var c = col.split("-");
		
		
		if(colClasses==""){
			colClasses = "offset-"+c[1]+"-"+columns[col]+" ";
			
		}else{
			colClasses = " offset-"+c[1]+"-"+columns[col]+" ";
			
		}
	}else if(col.includes("_")){
		var c = col.split("_");
		if(colClasses==""){
			colClasses = "offset-"+c[1]+"-"+columns[col]+" ";
			
		}else{
			colClasses = " offset-"+c[1]+"-"+columns[col]+" ";
			
		}
	}
	return colClasses;

}

function ViewLayoutController_initializeListeners(self){
	var components = self._typeHolder.typeComponent;
	var len = components.length;
	for(var i=0;i<len;i++){
		
	}

	for(prop in self._typeHolder){
		var t = self._typeHolder[prop];
		for(var i=0;i<t.length;i++){
			if(t[i].initializeListeners){
				t[i].initializeListeners();
			}
		}
	}
}

function _getFragementForViewLayout(self){
	var frag = document.createDocumentFragment();
	var rows = [];
	var row = null;
	var mRow = null;
	for(var i=0;i<self._build_order.length;i++){
		if(self._build_order[i]=="row"){
			if(row==null){
				row = document.createElement("div");
				row.className = "row";
				if(mRow==null){
					mRow = row;
				}
				frag.appendChild(row);
				rows[rows.length] = row;
			}else{
				var row1 = document.createElement("div");
				row1.className = "row";
				rows[rows.length] = row1;
				row.appendChild(row1);
				row = row1;
			}

		}else{
			row = null;
			
			var xmlString = self._build_order[i],
			    parser = new DOMParser(),
			    doc = parser.parseFromString(xmlString, "text/html");

			

			rows[rows.length-1].appendChild(doc.body);
		}
	}

	return frag;


}
function _layoutMake(obj,arrayOfItems){
	var propTypeof = typeof obj;
	var prop = obj;
	if(propTypeof=="string"){

	}
	if(propTypeof=="object"){
		var type = "";
		if(prop.type!=null && prop.type!=undefined){
			var fragment = document.createDocumentFragment();
			
			var el = document.createElement(prop.type);
			if(prop.id!=null && prop.id!=undefined){ el.id = prop.id; }
			if(prop.classes!=null && prop.classes!=undefined){ el.className = prop.classes; }
			
			if(prop.body!=null && prop.body!=undefined){
				var isObj = true;
				var myObj = null;
				var count = 0;
				var myObjs = [];
				var tmpBody = prop.body;
				while(isObj){
					if(typeof tmpBody=="object"){
						if(myObj==null){
							var _type = tmpBody.type;
							myObj = document.createElement(_type);
							if(tmpBody.id!=null && tmpBody.id!=undefined){ myObj.id = tmpBody.id; }
							if(tmpBody.classes!=null && tmpBody.classes!=undefined){ myObj.className = tmpBody.classes; }
							el.appendChild(myObj);
							myObjs[count] = myObj;
						}else{
							var _type = tmpBody.type;
							var myObj2 = document.createElement(_type);
							if(tmpBody.id!=null && tmpBody.id!=undefined){ myObj2.id = tmpBody.id; }
							if(tmpBody.classes!=null && tmpBody.classes!=undefined){ myObj2.className = tmpBody.classes; }
							myObjs[count].appendChild(myObj2);
							count++;
							myObjs[count] = myObj2;
						}

						if(tmpBody.body!=null && tmpBody.body!=undefined){
							tmpBody = tmpBody.body;
						}else{
							isObj = false;
						}
					}else
					if(typeof tmpBody=="string"){
						if(myObjs.length>0){
							myObjs[count].innerHTML = tmpBody;
						}else{
							el.innerHTML = tmpBody
						}
						
						
						
						
						
						
						
						
						

						isObj = false;
					}
				}
			}else{
				if(prop.view!=null && prop.view!=undefined){

				}
			}


		}

		fragment.appendChild(el);

		return fragment;
	}


	
};















function buildBody(object,self){
	var body = null;

	if(object!=null || object!=undefined){
		if(object.body){
			body = object.body;
		}else{
			body = object;
		}
	}else{
		console.error("Body is undefined");
		return new ContainerComponent();
	}


	var template = (Utils.isNull(object.template)) ? "" : object.template;
	var obj = (Utils.isNull(object.obj)) ? {} : object.obj;
	
	var blankComponent = new ContainerComponent();
	var mBody;
	object = object;
	if(Array.isArray(body)){
		if(typeof body[0] === "string" && body[0].charAt(0) == "@"){
			return _build_from_string(body[0],self,body[1],object);
		}else{
			
			
			
			
			var fragment = document.createDocumentFragment();
			for (var i = 0; i < body.length; i++) {
				_decomposeArray(body[i],fragment);
			}
			return fragment;
		}
		
	}else
	if(typeof body === "string"){
		return _build_from_string(body,self,null,object);
	}else 
	if(typeof body === "object"){
		return _build_from_object(body,self,null,object);
	}

	function _build_from_object(body){
		if(!Utils.isNull(body.TYPE)){
			if(Utils.isNull(object.original) && object.original==true){
				return body;
			}else{
				return body.getHtml();
			}
		}else{
			return body;
		}
	}
	function _build_from_string(body,self,params,object){
		if(body.charAt(0) === "@"){
			var view = _build_view(body,params,self,object);
			if(Utils.isNull(view)){ 
				console.error("Manager.register() function did not return a component: "+body);
				return new ContainerComponent(); 
			}
			if(view.TYPE){
				return view.getHtml();
			}else{
				if(typeof view === "string"){
					return Utils.convertStringToHTMLNode(view);
				}else{
					return view;
				}
			}
		}else if(body.charAt(0) === "&"){
			var p = body.substr(1);
			
			
			var t = applicationManager.getLoadedFileContents(p);
			t = applicationManager.templateParser(t,template);
			var view = Utils.convertStringToHTMLNode(t);
			return view;
		}else{
			var view = Utils.convertStringToHTMLNode(body);
			return view;
		}
	}
	function _decomposeArray(b,fragment){
		if(typeof b === "object"){
			if(b.TYPE){
				fragment.appendChild(b.getHtml());
			}else{
				fragment.appendChild(b);
			}
		}else if(b === "string"){
			if(b.charAt(0) != "@"){
				var element = Utils.convertStringToHTMLNode(b);
				fragment.appendChild(element);
			}
		}else if(Array.isArray(b)){
			if(typeof b[0] === "string" && b[0].charAt(0) == "@"){
				var n = _build_from_string(b[0],self,b[1]);
				if(n){
					if(n.TYPE){
						fragment.appendChild(n.getHtml());
					}else{
						fragment.appendChild(n);
					}
				}
			}
		}
	}
}
function getAppFactoryHTML(body,obj){
	obj = (obj) ? obj : {};
	var mBody = null;
	if(typeof body === "string"){
		if(body.charAt(0) === "@"){
			var view = _getView(body,obj);
			mBody = convertIntoAppFactoryObject(view);
		}else{
			mBody = convertIntoAppFactoryObject(body);
		}
	}else if(typeof body === "object"){
		if(Utils.isNull(body.TYPE)){
			mBody = body;
		}else{
			mBody = convertIntoAppFactoryObject(body);
		}
	}
	return mBody;
}
function convertIntoAppFactoryObject(body){
	var mBody;
	if(!Utils.isNull(body.TYPE)){
		return body;
	}
	mBody = Utils.convertStringToHTMLNode( body );
	return mBody;
}
function _build_view(body,params,self,obj){
	var paramValues = {
		parent: self,
		params: params,
		object: obj
	};
	var method = body.slice(1);
	var v = applicationManager.getMethod(method)(paramValues);
	return v;
}
function getComponentType(obj,self){
	var blankComponent = componentManager.container({
		body: "<div></div>"
	});
	if(Utils.isNull(obj.body)){
		return blankComponent;
	}
	var body = obj.body;
	if(Array.isArray(body)){
		if(body[0].charAt(0) === "@"){
			var view 
			var view = getView(body[0],obj);
			if(Utils.isNull(view)){ return blankComponent; }
		}else{
		}
	}else
	if(typeof body === "string"){
		if(body.charAt(0) === "@"){
			var view = getView(body,obj);
			if(Utils.isNull(view)){ return blankComponent; }
			return view;
		}else{
			var stringComponent = componentManager.container({
				body: body,
				listener: obj.listener
			});
			return stringComponent;
		}
	}else if(typeof body === "object"){
		if(!Utils.isNull(body.TYPE)){
			return body;
		}else{
			var stringComponent = componentManager.container({
				body: body,
				listener: obj.listener
			});
			return stringComponent;
		}
	}
	return blankComponent;
}
function getView(body,obj,self){
	var bodyWithoutAt = body.slice(0);

	if(!Utils.isNull(obj) && !Utils.isNull(obj.body)){
		if(Array.isArray(obj.body)){
			params = obj.body[1];
		}
	}
	var paramValues = {
		parent: self,
		params: params,
		object: obj
	};

	
	var method = body.slice(1);
	var v = applicationManager.getMethod(method)(paramValues);
	return v;
}





















/* 0000 - _Utils */
function isEventRegistered(selector,self){
	var alreadyRegistered = false;
	
	for(var i=0; i<self._props_._events.length; i++){
		var sel = self._props_._events[i].selector;
		if(sel==selector){
			alreadyRegistered = true;
			break;
		}
	}
	return alreadyRegistered;
}





function _Utils_registerListenerCallbackForSelf(type,selector,func,self,preventDefault,stopPropagation){
	preventDefault = (Utils.isNull(preventDefault)) ? false : preventDefault;
	stopPropagation = (Utils.isNull(stopPropagation)) ? false : stopPropagation;
	var alreadyRegistered = isEventRegistered(selector,self);
	self._props_._events.push({
		selector: selector,
		type: type,
		func: func,
		preventDefault: preventDefault,
		stopPropagation: stopPropagation
	});
}

var _registered_listeneres_ = [];
function _Utils_registerListenerCallback(obj,self){
	if(!Utils.isNull(obj.listener)){ obj.callback = obj.listener; }
	if(!Utils.isNull(obj.callback)){
		if(typeof obj.callback === "function"){
			self._props_._events.push({
				selector: "",
				type: "run",
				func: obj.callback
			});
		}else 
		if(typeof obj.callback === "object"){
			if(Array.isArray(obj.callback)){
				for(var i=0;i<obj.callback.length;i++){
					
					var alreadyRegistered = isEventRegistered(obj.callback[i].selector,self);

					var eventType = (Utils.isNull(obj.callback[i].type)) ? "click" : obj.callback[i].type;
					
					var preventDefault = (Utils.isNull(obj.callback[i].preventDefault)) ? false : obj.callback[i].preventDefault;
					var stopPropagation = (Utils.isNull(obj.callback[i].stopPropagation)) ? false : obj.callback[i].stopPropagation;
					self._props_._events.push({
						selector: obj.callback[i].selector,
						type: eventType,
						func: obj.callback[i].func,
						preventDefault: preventDefault,
						stopPropagation: stopPropagation
					});
				}
			}else{
				var eventType = (Utils.isNull(obj.callback.type)) ? "click" : obj.callback.type;
				var preventDefault = (Utils.isNull(obj.callback.preventDefault)) ? false : obj.callback.preventDefault;
				var stopPropagation = (Utils.isNull(obj.callback.stopPropagation)) ? false : obj.callback.stopPropagation;
				
				var alreadyRegistered = isEventRegistered(obj.callback.selector,self);
				

				self._props_._events.push({
					selector: obj.callback.selector,
					type: eventType,
					func: obj.callback.func,
					preventDefault: preventDefault,
					stopPropagation: stopPropagation
				});
			}
		}
	}
}



function Thread(){
	var blobURL = URL.createObjectURL( new Blob([ '(',



		function(){

			 this.onmessage = function(e){
				this.postMessage('Succefully sent messgae back to you but with a catch');



		


















var self = this;

function readTextFile(file,callback){
	self.postMessage(file);
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", "../js/includes/components/html/header.html", false);
	rawFile.onreadystatechange = function (){
	   if(rawFile.readyState === 4) {
		  if(rawFile.status === 200 || rawFile.status == 0){
			 var allText = rawFile.responseText;
			 if(callback!=null && callback!=undefined) callback(allText,file,rawFile);
		  }
	   }
    }
    rawFile.send(null);    
}

readTextFile("../js/includes/components/html/header.html",function(a){
	self.postMessage(a);
});

			 };

		}.toString(),

	')()' ], { type: 'application/javascript' } ) );

	var worker = new Worker( blobURL );

	worker.addEventListener('message',function(e){
		var msg = e.data;
		
		
	});  

	setTimeout(function(){
		worker.postMessage('sending');
	},2000);

	
}






















































function setBaseURL(self,url){
	var config = self._props_._application_config;
	if(!Utils.isNull(config.application)){
		var base = "";
		if(!Utils.isNull(config.application.prod) && config.application.prod==true){
			base = config.application.production_url;
		}else{
			base = config.application.development_url;
		}
	}
	if(url!=undefined){
		self._props_._baseURL = url;
	}else{
		self._props_._baseURL = base;
	}
}


function _funcConfigProd(app,partialUrl,isProd){
	var url;
	if(isProd){
		url = _prod(app,partialUrl);
	}else{
		url = _devel(app,partialUrl);
	}
	return url;
}
function _appConfigProd(app,partialUrl){
	var url;
	if(app.prod){
		url = _prod(app,partialUrl);
	}else{
		url = _devel(app,partialUrl);
	}
	return url;
}
function _prod(app,partialUrl){
	var p = "";
	if(app.production_url.endsWith("/")){
		p = app.production_url;
	}else{
		p = app.production_url+"/";
	}
	if(partialUrl.startsWith(":")){
		p = p.slice(0, -1);
	}
	return p+""+partialUrl; 
}
function _devel(app,partialUrl){
	var p = "";
	if(app.development_url.endsWith("/")){
		p = app.development_url;
	}else{
		p = app.development_url+"/";
	}
	if(partialUrl.startsWith(":")){
		p = p.slice(0, -1);
	}
	return p+""+partialUrl; 
}



var pages;
var stateManager;
var sessionManager;
var applicationManager;
var layoutManager;
var componentFactory;
var appPlugin;

var gl_applicationContextManager = null;
var gl_app_plugins = [];
var gl_app_configuration = null;


/**
* Register plugin
*
*/
function registerAppFactoryPlugin(plugin){
	gl_app_plugins.push(plugin);
}

/** @exports ApplicationContextManager
* @classdesc The ApplicationContextManager.
* @class
* @constructor
* @param {Object|String} - (required) The application configuration object or if a string then the url of where the configuration file exist to be loaded into the appliction
* @param {Object} - (optional) The plugins object provided by AppFactoryStarter
* @param {String} - (optional) Override the app configuration application url
* @tutorial GettingStarted
*/
function ApplicationContextManager(config,plugins,baseUrl){
	var configFile = config;
	pages = new Pages(this);
	stateManager = new StateManager(this);
	sessionManager = new SessionManager(this);
	applicationManager = new ApplicationManager(this,stateManager,sessionManager);
	layoutManager = new LayoutManager(this);
	componentFactory = new ComponentFactory(this);
	appPlugin = new ApplicationPlugin(this);

	var self = this;
	this._props_ = {

		_application_config: config,
		_application_plugins: plugins,
		_baseURL: baseUrl,

		_vars: {},

		_baseURL: "",

		_Pages: pages,
		_StateManager: stateManager,
		_SessionManager: sessionManager,
		_ApplicationManager: applicationManager,
		_LayoutManager: layoutManager,
		_ComponentFactory: componentFactory,
		_ApplicationPlugin: appPlugin,
		_ViewManager: ViewManager
	};

	this._props_._application_config = config;

	this.Pages = this._props_._Pages;
	this.Manager = this._props_._ApplicationManager;
	this.Factory = this._props_._ComponentFactory;
	this.View = this._props_._ViewManager;
	this.StateManager = this._props_._StateManager;
	this.Layout = this._props_._LayoutManager;
	this.Plugin = this._props_._ApplicationPlugin;

	this._props_._application_plugins = this._props_._application_config['application']['plugins'];

	if(configFile!=undefined){
		var configFileObject;
		if(typeof configFile === "string"){
			configFileObject = a1(configFile);
		}else{
			configFileObject = configFile;
		}
		this._props_._application_config = configFileObject;

		setBaseURL(this,baseUrl);
	}

	gl_applicationContextManager = this;

}
ApplicationContextManager.prototype = {


	setExtensions: function(extension){
		this._props_._segmented_plugins = extension;
	},


	/**
	* {@link Flags}
	*/
	Flags: Flags,  

	/**
	* {@link Utils}
	*/
	Utils: Utils,


	/**
	* Start and initialize Appfactory application.
	*
	*/
	initializeApplication: function(isClient,activePlugin){
		initializeApplication(isClient,activePlugin,this);
	},

	/**
	* Set application variable to be referenced later
	* even in configuation files. with the ${variable}
	*/
	setVar: function(param,value){
		this._props_._vars[param] = value;
	},

	/**
	* 
	* @return {Object}
	*/
	getVar: function(param){
		return this._props_._vars[param];
	},

	/**
	* 
	* @return {Object}
	*/
	getVars: function(param){
		return this._props_._vars;
	},


	/**
	* Computes the url needed for request calls ex: app.URL('path/to/file')
	* @param {String} partialUrl - required
	* @param {Boolean} isProduction - optional override config file settings to use development url or production url. 
	* @return {String} url 
	*/
	URL: function appfactory_url(partialUrl,isProd){
		if(partialUrl==undefined){
			partialUrl = "";
		}
		var url = "";
		var config = this._props_._application_config;
		if(config!=null && config['application']!=undefined){

		
			var app = config['application'];
			if(isProd!=null & isProd!=undefined){
				url =_funcConfigProd(app,partialUrl,isProd);
			}else{
				url = _appConfigProd(app,partialUrl)
			}
		}else{
			url = partialUrl;
		}
		return url;
	},


	LoadClientTheme(){

	},

	SetSockitIO: function(socketio){
		this.socketio = socketio;
		if(this.socketio){
			var socket = this.socketio('localhost:9005', {
			    reconnection: false
			});
		    socket.on('reload-page',function(){
		    	document.location.reload(true);
		    });
		    socket.on('diconnect',function(){
		    	console.log("diconnected");
		    });
		}
	},

	setApplicationPlugins: function(plugins){
		this._props_._application_plugins = plugins;
	},

	/**
	* Sets the global configuration file config.appfac.js. The configuration file
	* is returned from AppfactoryStarter with project setup.
	* 
	*/
	setApplicationConfiguration: function(config){
		this._props_._application_config = config;
	},

	/**
	* {@link Pages}
	*/
	getPages: function(){
		return this._props_._Pages;
	},

	/**
	* {@link PluginManager}
	*/
	getPlugin: function(){
		return this._props_._ApplicationPlugin;
	},

	/**
	* {@link ApplicationManager}
	*/
	getManager: function(){
		return this._props_._ApplicationManager;
	},

	/**
	* StateManager
	*/
	getState: function(){
		return this._props_._StateManager;
	},

	/**
	* SessionManager
	*/
	getSession: function(){
		return this._props_._SessionManager;
	},

	/**
	* {@link LayoutManager}
	*/
	getLayout: function(){
		return this._props_._LayoutManager;
	},


	/**
	* {@link ComponentFactory}
	*/
	getComp: function(){
		return this._props_._ComponentFactory;
	},

	/**
	* {@link ViewManager}
	*/
	getView: function(){
		return this._props_._ViewManager;
	},

	getActivePluginPath: function(){
		var active = this._props_._application_config['application']["client-active-theme"];
		var activeplugin = active.split("|")[0];
		var activetheme = active.split("|")[1];

		var plugins = this._props_._application_config['application']["plugins"];
		var theme = this._props_._active_plugin_theme;

		var plugin = plugins[activeplugin];

		var path = "";
		if(isAdmin){
			path = "../../js/plugins/"+plugin.directory+"/"+activePlugin.start;
		}else{
			path = "js/plugins/"+plugin.directory+"/"+activePlugin.start;
		}

		return path;
	},

	getActivePluginThemePath: function(){

	}

};



function initializeApplication(isClient,activePlugin,self){

	window.AppDialog = componentFactory.dialog();
	window.AppFactoryDialog = componentFactory.dialog();
	window.Brick = Brick;

	if(isClient==false){
		
		return;
	}

	var config_appfac = self._props_._application_config;
	var plugins = self._props_._application_plugins;
	var baseUrl = self._props_._baseUrl;

	if(self._props_._application_config['application']['prod']==false){
		console.log(config_appfac);
	}

	var app = self;

	var admin_active_theme = config_appfac['application']['admin-active-theme'];

	var client_plugin_config = config_appfac['application']['client-active-theme'];
	var client_active_plugin = client_plugin_config.split("|")[0];
	var client_active_theme = client_plugin_config.split("|")[1];

	var url = "js/plugins/"+client_active_plugin+"/plugin.config.json";
	$.getJSON( url, function( pluginconfig ) {

		var Utils = app.Utils;   
		var Plugin = app.getPlugin(); 
		var Manager = app.getManager(); 
		var Pages = app.getPages();
		var View = app.getView();
		var Layout = app.getLayout();
		var Factory = app.getComp();

		var generatedPluginConfigs = Plugin.getRegisteredPlugins();

		var aciveTheme = null;

		for (var i = 0; i < activePlugin['client-themes'].length; i++) {
			if(client_active_theme.trim() == activePlugin['client-themes'][i].directory.trim()){
				activeTheme = activePlugin['client-themes'][i];
				break;
			}
		}

		var html = activeTheme.component(app);

		if(html!=undefined){
			$('body').append(html);
		}

		var clientactivetheme = null;
		var clientthemes = pluginconfig['client-themes'];

		for (var i = 0; i < clientthemes.length; i++) {
			if(clientthemes[i].theme==client_active_theme){
				clientactivetheme = clientthemes[i];
				break;
			}
		}

		if(clientactivetheme!=null){
			for (var i = 0; i < clientactivetheme.head.length; i++) {
				$('head').append(clientactivetheme.head[i]);
			}
		}

	});

}




function a1(configFile){
	return new Promise(resolve => {
		var rawFile = new XMLHttpRequest();
    	rawFile.open("GET", configFile, false);
    	rawFile.send(null); 
    	resolve(rawFile.responseText)
	});
} 



function LoadDependencies(baseUrl,classes,views,dependencies){ 
	
	
	
	

	if(baseUrl.includes("/client")){
		for(var i=0; i < classes.length; i++){
			if(IsAdmin){
				classes[i] = "../../classes/" + classes[i];
			}else{
				classes[i] = "js/plugins/"+baseUrl+"/classes/" + classes[i];
			}
		}
		for (var i=0; i < views.length; i++) {
			var theme = views[i].split("/")[0];
			var view = views[i].split("/")[1] + "/" +views[i].split("/")[2];
			if(IsAdmin){
				views[i] = "../../themes/"+theme+"/components/"+view;
			}else{
				views[i] = "js/plugins/"+baseUrl+"/themes/"+theme+"/components/"+view;
			}
		}
	}else if(baseUrl.includes("/admin")){
		for(var i=0; i < classes.length; i++){
			if(IsAdmin){
				classes[i] = "../../classes/" + classes[i];
			}else{
				classes[i] = "js/plugins/"+baseUrl+"/classes/" + classes[i];
			}
		}
		for (var i=0; i < views.length; i++) {
			var theme = views[i].split("/")[0];
			var view = views[i].split("/")[1];
			views[i] = "../../themes/"+theme+"/components/"+view;
		}
	}

	var deps = classes.concat(views).concat(dependencies);
	return deps;
}

function LoadActivePlugin(){

}

function GetLoadedConfiguration(app){
	var config = gl_app_configuration;
	gl_app_configuration = null;
	return config;
}

function LoadConfiguration(config){

	var decodeHTML = function (html) {
		var txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	};

	config = decodeHTML(config.trim());

	console.log(config);

	if(typeof config === 'string'){
		config = JSON.parse(config.trim());
	}
	gl_app_configuration = config;
}

function GetClientPath(app,path,plugin,theme){
	var activeTheme = app._props_._application_config['application']['client-active-theme'];
	var _plugin = "";
	var _theme = "";
	if(plugin==undefined){
		var _pluginAndTheme = [];
		if(activeTheme.includes("|")){
			_pluginAndTheme = activeTheme.split("|");
		}else if(activeTheme.includes(" ")){
			_pluginAndTheme = activeTheme.split(" ");
		}
		_plugin = _pluginAndTheme[0];
		_theme = _pluginAndTheme[1];
	}else{
		_plugin = plugin;
		_theme = theme;
	}
	return "js/plugins/"+_plugin+"/client/themes/"+_theme+"/"+path;
}

window.AFLoadDependencies = LoadDependencies;

window.AFLoadActivePlugin = LoadActivePlugin;

window.AFGetLoadedConfiguration = GetLoadedConfiguration;

window.AFLoadConfiguration = LoadConfiguration;

window.AFGetClientPath = GetClientPath;
















































window.RegisterAppFactoryPlugin = registerAppFactoryPlugin;

window.ApplicationContextManager = ApplicationContextManager;



window.ApplicationExtensions = ApplicationExtensions;

return ApplicationContextManager;


})); 










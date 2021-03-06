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
* @license MIT. 
* @version 0.0.1   
*/
(function (root, factory) {  
	if (typeof define === 'function' && define.amd) {
		
		define(['jquery','backbone','bootstrap'], factory);
	} else if (typeof module !== 'undefined' && module.exports) {
		
		module.exports = factory(require('jquery'));
	} else {
		
		factory(jQuery);
	}	
}(this, function ($) {    

/* Global Variables */ 

var GL_COMPONENTS = [],
    GL_TYPES = {view:"v",component:"c",layout:"l"};  





var Flags = Object.freeze({
	Type: {view:"v",component:"c",layout:"l"},
	Component: "comp",
	Method: "meth"
});

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
		_file_contents: {},
		_any_id: {}
	};
	this._obj_components = null;

}
ApplicationManager.prototype = {


	config: {},

	/**
	* Starts the application life cycle. Must be called before 
	* running any application code.
	*/
	init: function(pages){
		
		var self = this;
		App("body").append(self.getRootElement());
		setTimeout(function(){
			ApplicationManager_start_runInterval(self);
			if(Array.isArray(pages)){
				
				
			}else{
				pages.func(pages.obj,pages.self);
			}

			stateManager.buildRoutes();
			stateManager.start();

			var hash = gl_applicationContextManager.getHash();

			if(hash!=undefined && hash!=null){
				
			}else{
				
			}
		},100);
	},  


	setRootElement: function(element){
		this._application_manager._root_element_component = element;
	},

	/**
	* Register a method to be called later with in the app
	*/
	register: function(id,method,anyId){

		

		
		if(!Utils.isNull(method)){
			this._application_manager._methods[id] = method;
		}else{
			if(id.TYPE){
				this._application_manager._components.push({id: id.getId(), component: id});
			}else{
				console.error("Element not registered, Must be a component");
			}
		}
		
		if(anyId!=undefined){
			if(typeof anyId === 'boolean'){
				if(anyId==true) this._application_manager._any_id[id] = id; 
			}else if(typeof anyId === 'string'){
				this._application_manager._any_id[id] = anyId; 
			}
		}
	},

	retrieve: function(id,flag){
		if(id.charAt(0)=='@'){
			id = id.substr(1);
		}

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
	* Get all stored objects, by setAny.
	*/
	getAll: function(){
		return this._application_manager._any;
	},
	
	/**
	* Store an object to be retrieved later anywhere with in the app
	*
	* @param {string} id
	* @param {object} any - Any object that needs to be stored for later
	*/
	setAny: function(id,any){
		this._application_manager._any[id] = any;
	},

	setupComponents: function(id,any){
		this.setAny(id,any);
		var comps = {};
		function hello(any){
			for(obj in any){
				if(typeof any[obj] === 'function'){
					comps[obj] = any[obj](gl_applicationContextManager);
				}
			}
		}
		hello.prototype = {

		};
		this.setAny('components', comps);
		return new hello(any);
	},

	/**
	* Get object set by setAny 
	*
	* @param {string} id - Identifier of object stored
	* @return {object} - returns the object stored
	*/
	getAny: function(id){
		var any = this._application_manager._any[id];
		if(Utils.isNull(any)){
			console.error("No object found for: "+id);
		}
		return any;
	},	

	/**
	* Get registered method, set by register()
	*
	*/
	get: function(id,params){
		var method = this._application_manager._methods[id];
		if(Utils.isNull(method)){
			console.error("Method: "+id+" does not exist");
		}
		var paramValues = {
			"params": params,
			"app": gl_applicationContextManager
		};
		var component = method(paramValues);
		if(Utils.isNull(component)){
			console.error("Component: "+id+" is null");
		}

		var anyid = this._application_manager._any_id[id];
		if(anyid!=undefined){
			this.setAny(anyid,component);
		}
		return component;
	},

	getComponents: function(){
		return this._application_manager._components;
	},

	
	getMethod: function(id,params){
		var method = this._application_manager._methods[id];
		if(Utils.isNull(method)){
			console.error("Appfactory method "+id+" does not exist");
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

	getLoadedFileContents: function(alias){
		return this._application_manager._file_contents[alias];
	},

	templateParser: function(htmlString,replacements,opts){
		return ApplicationManager_templateParser(htmlString,replacements,opts,this);
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


function SessionManager(){
	_.extend(this, new AppFactoryManager('SessionManager'));

}
SessionManager.prototype = {};

 

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

	/**
	*
	*/
	getHash: function(){
		return window.location.hash;
	},

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
	go: function(path,trigger){
		
		if(Utils.isNull(trigger)) trigger = true;
		
		var self = this;

		path = (path.charAt(0)=="#") ? path.substring(1) : path;
		
		var paths = path.split("/");
		
		
		if(paths.length > 1){
			for (var i = 0; i < paths.length; i++) {
				if(!paths[i].includes(":")){
					

					if(i<(paths.length-1)){
						
						
					}
				}
			}
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
	},

	start: function(){
		var self = this;
		var Router = Backbone.Router.extend(self._state_manager._routerConfig);
		self._state_manager._router = new Router();
		Backbone.history.start();
	}
};

function Router45(){



}
Router45.prototype = {
	setRoutes: function(routes){
		this.routes = routes;
		this._loadInitialRoute();
	},

	navigate: function(){

	},

	
	_loadRoute: function(...urlSegments){
		
		const matchedRoute = this._matchUrlToRoute(urlSegments);

		
		
		
		const url = `/${urlSegments.join('/')}`;
		history.pushState({}, '', url);

		
		const routerOutletElement = document.body;
		routerOutletElement.innerHTML = matchedRoute.getTemplate(matchedRoute.params);
	},

	_navigate: function(path = ""){
		if (this.mode === "history"){
			window.history.pushState(null, null, this.root + this.clearSlashes(path));
		} else {
			window.location.href = `${window.location.href.replace(/#(.*)$/, "")}#${path}`;
		}
		return this;
	},

	_matchUrlToRoute: function(urlSegments){
		
		const routeParams = {};
		const matchedRoute = this.routes.find(route => {

			
			
			
			const routePathSegments = route.path.split('/').slice(1);

			
			if (routePathSegments.length !== urlSegments.length) {
				return false;
			}

			
			
			const match = routePathSegments.every((routePathSegment, i) => {
				return routePathSegment === urlSegments[i] || routePathSegment[0] === ':';
			});

			
			if (match) {
				routePathSegments.forEach((segment, i) => {
					if (segment[0] === ':') {
						const propName = segment.slice(1);
						routeParams[propName] = decodeURIComponent(urlSegments[i]);
					}
				});
			}
			return match;
		});

		return { ...matchedRoute, params: routeParams };
	},

	_loadInitialRoute: function(){
		
		const pathnameSplit = window.location.pathname.split('/');
		const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';
		
		this.loadRoute(...pathSegments );
	}

};


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
		App(selector).append(this.getHtml());
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

	
	

	
	

}


Pages.prototype = {

	/**
	*
	*
	*/
	newPageView: function(obj){
		
		return {
			func: Pages_newPageView,
			obj: obj,
			self: this
		};
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
	self._props_._current_view = null;
	self._props_._view_order = [];

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
		if(obj==null){
			for (var i = 0; i < objs.length; i++) {
				var d = objs[i].default;
				if(d){
					obj = objs[i];
					break;
				}
			}
		}

		if(obj){
			var trigger = false;
			self._props_._active_view = obj;
			self._props_._current_view = obj.id;

			
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
	* @param {string} - (required) Id of the view to render.
	* @param {object} - (optional) data to pass to view.
	* @param {object} - (optional) options
	*/
	render: function(id,params,opts){
		ViewManager_render(id,params,opts,this);
	},


	/**
	*	Convience method to render an index with in a view.
	*
	* @param {Number|String} - The index of the view or the string id of the view
	@ @param {Object} - (optional) Options to give to the view renderer 
	*
	*/
	goTo: function(index,opts){
		ViewManager_goTo(index,opts,this);
	},

	

	/**
	*	Go back 1 view
	*
	* @param {Object} - (optional) Options to pass to the view renderer
	*
	*/
	back: function(opts){
		ViewManager_back(opts,this);
	},

	/**
	*	Go forward 1 view
	*
	* @param {Object} - (optional) Options to pass to the view renderer
	*
	*/
	next: function(opts){
		ViewManager_next(opts,this);
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
		
		if(opts.id==undefined){
			opts.id = 'p'+Utils.randomGenerator(12);
			console.log("View Component does not contain an id"); 
		}

		for (var i = 0; i < self._props_._views_objects.length; i++) {
			if(opts.id == self._props_._views_objects[i].id){
				console.error("Theres already a View Component with the id: "+opts.id);
				break;
			}
		}

		self._props_._view_order.push(opts.id);

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

	AppLayout_constructor(obj,this);

	this.getHtml = function(){
		if(self._props_._isBuilt==false){
			console.error('Layout has not been built.')
		}
		return AppComponent_getHtml_layout_fragment(self);
	};

	this._props_._isBuilt = false;

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
		AppLayout_row(obj,this);
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

	navigation: function(obj){
		return new NavigationComponent(obj);
	},

	navbar: function(opts){
		return new NavbarComponent(opts);
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
	},

	/**
	* Create an audio player
	*
	* @return {AudioComponent}
	*/
	audio: function(opts){
		return new AudioComponent(opts);
	},

	/**
	* Create a carousel
	*
	* @param {object} - options
	* @return {CarouselComponent}
	*/
	carousel: function(opts){
		return new CarouselComponent(opts);
	},

	/**
	* Creates an icon
	*
	* @param {object} - options
	*/
	icon: function(opts){
		return new IconComponent(opts);
	}

};




/** @exports IconComponent
* @classdesc Build a carousel.
* @class
* @constructor
* @param {object} - options
*/
function IconComponent(opts){
	gl_HandleAll(this,opts,'IconComponent');
	var self = this;

	opts = (opts==undefined) ? {} : opts;

	var icon = (opts.icon==undefined) ? "heart-fill" : opts.icon;
	var classes = (opts.className==undefined) ? "" : opts.className;
	var size = (opts.size==undefined) ? "32" : opts.size;
	var fill = (opts.fill==undefined) ? "currentColor" : opts.fill;

	var iconString = `
<svg class="bi ${classes}" width="${size}" height="${size}" fill="${fill}">
  <use href="static/bootstrap/bootstrap-icons/bootstrap-icons.svg#${icon}" />
</svg>
	`;
	


	var i = `
<svg class="bi text-success" width="52" height="52" fill="currentColor">
  <use href="static/bootstrap/bootstrap-icons/heart-fill.svg#heart-fill" />
</svg>

	`;


	self._props_._iconHtml = Utils.convertStringToHTMLNode(i);


	this.getHtml = function(){
		return self._props_._iconHtml.cloneNode(true);
	}

}
IconComponent.prototype = {


};



/** @exports CarouselComponent
* @classdesc Build a carousel.
* @class
* @constructor
* @param {object} - options
*/
function CarouselComponent(opts){
	gl_HandleAll(this,opts,'CarouselComponent');

	var self = this;

	opts = (opts==undefined) ? {} : opts;

	self._props_._topcontainer = document.createElement('div');
	self._props_._topcontainer.id = self.getId();

	self._props_._opts = opts;
	self._props_._indicators = opts.indicators;
	self._props_._carouselId = "m"+Utils.randomGenerator(12,false);
	var container = document.createElement('div');
	container.id = self._props_._carouselId;
	container.className = "carousel slide";
	container.setAttribute("data-ride","carousel");
	self._props_._topcontainer.appendChild(container);

	var inner = document.createElement('div');
	inner.className = "carousel-inner";

	self._props_._inner = inner;

	self._props_._container = container;
	self._props_._container.style = (opts.style==undefined) ? "" : opts.style;

	self._props_._isBuilt = false;

	self._props_._slidesCount = 0;

	self._props_._current_active = -1;

	if(self._props_._indicators!=undefined && self._props_._indicators==true){
		self._props_._ol = document.createElement('ol');
		self._props_._ol.className = "carousel-indicators";
		self._props_._container.appendChild(self._props_._ol);
	}

	_Utils_registerListenerCallbackForSelf('run','',function(){



	},self);



	this.getHtml = function(){
		if(self._props_._isBuilt==false){
			console.log("CarouselComponent has not been built, call carousel.build()");  
		} 
		return self._props_._topcontainer.cloneNode(true);
	};


}
CarouselComponent.prototype = {

	/**
	* Add a carousel.
	*
	* @param {object} - options
	*/
	add: function(opts){
		var self = this;
	
		var active = "";
		if(opts.active!=undefined && opts.active==true){
			active = "active";
			self._props_._current_active = self._props_._slidesCount
		}
		var container = document.createElement('div');
		container.className = "carousel-item "+active;

		var img = document.createElement('img');
		img.className = "d-block w-100";
		img.src = (opts.src!=undefined) ? opts.src : "";
		img.style = (opts.style==undefined) ? "" : opts.style;

		container.appendChild(img);

		self._props_._inner.appendChild(container);

		self._props_._container.appendChild(self._props_._inner);

		self._props_._slidesCount++;

	},

	/**
	* Build this carousel.
	*
	* 
	*/
	build: function(){

		var self = this;

		self._props_._isBuilt = true;

		if(self._props_._opts.controls!=undefined && self._props_._opts.controls==true){
			var prev = createButton("carousel-control-prev","carousel-control-prev-icon","prev","Previous");
			var next = createButton("carousel-control-next","carousel-control-next-icon","next","Next");

			self._props_._container.appendChild(prev);
			self._props_._container.appendChild(next);

			_Utils_registerListenerCallbackForSelf('run','',function(){

				App('#'+self._props_._carouselId + " a").click(function(e){
					console.log(e);
					e.preventDefault();
				});

			},self);

		}

		if(self._props_._indicators!=undefined && self._props_._indicators==true){
			var currentActive = self._props_._current_active;
			if(currentActive==-1)
				currentActive = 0;

			for (var i = 0; i < self._props_._slidesCount; i++) {

				var count = i;
				var li = document.createElement('li');
				li.setAttribute('data-target','#'+self._props_._carouselId);
				li.setAttribute('data-slide-to',count);
				if(currentActive==i){
					li.className = "active";
				}
				self._props_._ol.appendChild(li);
			}
		}

		function createButton(class1,class2,dataSlide,name){
			var hrefId = "#"+self._props_._carouselId;
		
			var container = document.createElement('a');
			container.className = class1;
			container.href = hrefId;
			container.setAttribute("role","button");
			container.setAttribute("data-slide",dataSlide);

			var span1 = document.createElement('span');
			span1.className = class2;
			span1.setAttribute('aria-hidden','true');

			var span2 = document.createElement('span');
			span2.className = "sr-only";
			span2.innerHTML = name;

			container.appendChild(span1);
			container.appendChild(span2);

			return container;
		}
	}
};


function gl_assets_icons(){
	return "assets/open-iconic";
}



/** @exports AudioComponent
* @classdesc Audio player creator container class 
* @class
* @constructor
*/
function AudioComponent(opts){


}
AudioComponent.prototype = {

	/**
	* Create custom audio player. Creates an AudioPlayerBuilder that only
	* accessable inside the callback function to build out custom audio
	* player then returns a AudioPlayerBuilderComponent
	*
	* @param {function} 
	* 
	* @return {AudioPlayerBuilderComponent}
	*/
	builder: function(callback){
		
		var audioPlayerBuilder = new AudioPlayerBuilder();
		var c = callback(audioPlayerBuilder);
		audioPlayerBuilder._props_._set_html(c);
		
		return new AudioPlayerBuilderComponent({},audioPlayerBuilder);
	},


	create: function(opts){
		

	}

};


/** @exports AudioPlayerBuilder
* @classdesc Audio player creator container class 
* @class
* @constructor
*/
function AudioPlayerBuilder(opts){
	opts = (opts==undefined) ? {} : opts;
	var self = this;
	self._props_ = {};

	self._props_._isBuilt = false;
	
	self._props_._element = document.createElement("div");
	

	self._props_._default_media_btns = {
		"play": gl_assets_icons()+"/png/media-play-6x.png",
		"pause": gl_assets_icons()+"/png/media-pause-6x.png",
		"stop": gl_assets_icons()+"/png/media-stop-6x.png",
		"next": gl_assets_icons()+"/png/media-skip-forward-6x.png",
		"prev": gl_assets_icons()+"/png/media-skip-backward-6x.png",
		"skipForward": gl_assets_icons()+"/png/media-step-forward-6x.png",
		"skipBackward": gl_assets_icons()+"/png/media-step-backward-6x.png"
	}

	self._props_._element2 = null;

	self._props_._set_html = function(el){
		
		self._props_._element2 = el.getHtml();
		
	}

	this.getHtml = function(){
		return self._props_._element2.cloneNode(true);
		
	}


	self._props_._event_ids = {
		'time_current': null,
		'time_max': null,
		'time_both': null,
		'play': null,
		'prev': null,
		'next': null,
		'stop': null,
		'skipBackward': null,
		'skipForward': null,
		'seek_bar': null,
		'handle': null
	};


}
function AudioPlayerBuilder_create_btn_element(opts,defaultImage,param,self){
	var opts = (opts==undefined) ? {} : opts;
	var img = (opts.img!=undefined) ? opts.img : defaultImage;
	var btn = document.createElement('button');
	btn.id = (opts.id==undefined) ? "mp-"+Utils.randomGenerator(18) : opts.id;
	var btnclassname = (opts.className==undefined) ? "" : opts.className;
	btn.className = "appfac-media-player-btn "+btnclassname;
	btn.innerHTML = '<img src="'+img+'" height="60%" width="60%">';

	

	self._props_._event_ids[param] = btn.id;

	return Utils.convertFragmentToHTMLText(btn);

}
AudioPlayerBuilder.prototype = {

	/**
	* Create a play button html element
	*
	*/
	play: function(opts){
		var self = this;
		return AudioPlayerBuilder_create_btn_element(
			opts,
			self._props_._default_media_btns['play'],
			"play",
			this
		);
		
	},

	/**
	* Create a previous button html element
	*
	*/
	prev: function(opts){
		var self = this;
		return AudioPlayerBuilder_create_btn_element(
			opts,
			self._props_._default_media_btns['prev'],
			"prev",
			this
		);
		
	},

	/**
	* Create a next button html element
	*
	*/
	next: function(opts){
		var self = this;
		return AudioPlayerBuilder_create_btn_element(
			opts,
			self._props_._default_media_btns['next'],
			"next",
			this
		);
		
	},

	/**
	* Create a pause button html element
	*
	*/
	pause: function(opts){
		var self = this;
		return AudioPlayerBuilder_create_btn_element(
			opts,
			self._props_._default_media_btns['pause'],
			"pause",
			this
		);
		
	},

	/**
	* Create a stop button html element
	*
	*/
	stop: function(opts){
		var self = this;
		return AudioPlayerBuilder_create_btn_element(
			opts,
			self._props_._default_media_btns['stop'],
			"stop",
			this
		);
		
	},

	/**
	* Create a seek backward button html element
	*
	*/
	seekBack: function(opts){
		var self = this;
		return AudioPlayerBuilder_create_btn_element(
			opts,
			self._props_._default_media_btns['skipBackward'],
			"skipBackward",
			this
		);
		
	},

	/**
	* Create a seek forward button html element
	*
	*/
	seekForward: function(opts){
		var self = this;
		return AudioPlayerBuilder_create_btn_element(
			opts,
			self._props_._default_media_btns['skipForward'],
			"skipForward",
			this
		);
		
	},

	/**
	* Create a seekbar html element
	*
	*/
	seekBar: function(opts){
		var self = this;
		opts = (opts==undefined) ? {} : opts;
		var seek_bar = document.createElement('div');
		seek_bar.id = "mp-"+Utils.randomGenerator(18);
		seek_bar.className = "appfac-media-player-seekbar";
		
		var fill = document.createElement('div');
		fill.id = (opts.fillId==undefined) ? "mp-"+Utils.randomGenerator(18) : opts.fillId;
		var fillClassName = (opts.fillClassName==undefined) ? "" : opts.fillClassName;
		fill.className = "appfac-media-player-seekbar-fill "+fillClassName;
		
		var handle = document.createElement('div');
		handle.id = (opts.handleId==undefined) ? "mp-"+Utils.randomGenerator(18) : opts.handleId;
		var handleClassName = (opts.handleClassName==undefined) ? "" : opts.handleClassName;
		handle.className = "appfac-media-player-seekbar-handle "+handleClassName;
		
		seek_bar.appendChild(fill);
		seek_bar.appendChild(handle);
		self._props_._element.appendChild(seek_bar);

		self._props_._event_ids['seek_bar'] = seek_bar.id;
		self._props_._event_ids['handle'] = handle.id;
		self._props_._event_ids['fill'] = fill.id;

		return Utils.convertFragmentToHTMLText(seek_bar);
		

	},

	/**
	* Create a seekbar time text html element
	*
	*/
	timeCurrent: function(opts){
		var self = this;
		opts = (opts==undefined) ? {} : opts;
		var timeText = Utils_createELement('div',opts);
		timeText.id = "mp"+Utils.randomGenerator(16);
		timeText.textContent = "00:00:00";
		self._props_._element.appendChild(timeText);

		self._props_._event_ids['time_current'] = timeText.id;

		return Utils.convertFragmentToHTMLText(timeText);
		
		
	},

	/**
	* Create a seekbar time text html element
	*
	*/
	timeMax: function(opts){
		var self = this;
		opts = (opts==undefined) ? {} : opts;
		var timeText = Utils_createELement('div',opts);
		timeText.id = "mp"+Utils.randomGenerator(16);
		timeText.textContent = "00:00:00";
		self._props_._event_ids['time_max'] = timeText.id;
		self._props_._element.appendChild(timeText);

		self._props_._event_ids['time_max'] = timeText.id;

		return Utils.convertFragmentToHTMLText(timeText);
		
		
	},

	/**
	* Create a seekbar time text html element
	*
	*/
	timeBoth: function(opts){
		var self = this;
		var timeText = document.createElement('div');
		timeText.id = "mp"+Utils.randomGenerator(16);
		timeText.textContent = "00:00:00 / 00:00:00";
		self._props_._element.appendChild(timeText);

		self._props_._event_ids['time_both'] = timeText.id;

		return timeText;
		
	}

};



/** @exports AudioPlayerBuilderComponent
* @classdesc Audio player creator container class 
* @class
* @constructor
*/
function AudioPlayerBuilderComponent(opts,audioPlayerBuilder){

	
	gl_HandleAll(this,opts,'AudioPlayerBuilderComponent');


	var self = this;

	var audio = new Audio();
	self._props_._audio = audio;

	self._props_._fragment = document.createDocumentFragment();
	self._props_._element = document.createElement('div');
	self._props_._element.id = self.getId();
	self._props_._element.appendChild(audioPlayerBuilder.getHtml());
	self._props_._fragment.appendChild(self._props_._element);


	this.getHtml = function(){
		return self._props_._fragment.cloneNode(true);
	}


	_Utils_registerListenerCallbackForSelf('run','',function(){


	var time_current_id = audioPlayerBuilder._props_._event_ids['time_current'];
	var time_max_id = audioPlayerBuilder._props_._event_ids['time_max'];
	var time_both_id = audioPlayerBuilder._props_._event_ids['time_both'];
	var play_id = audioPlayerBuilder._props_._event_ids['play'];
	var pause_id = audioPlayerBuilder._props_._event_ids['pause'];
	var prev_id = audioPlayerBuilder._props_._event_ids['prev'];
	var next_id = audioPlayerBuilder._props_._event_ids['next'];
	var stop_id = audioPlayerBuilder._props_._event_ids['stop'];
	var skipBackward_id = audioPlayerBuilder._props_._event_ids['skipBackward'];
	var skipForward_id = audioPlayerBuilder._props_._event_ids['skipForward'];
	var seek_bar_id = audioPlayerBuilder._props_._event_ids['seek_bar'];
	var handle_id = audioPlayerBuilder._props_._event_ids['handle'];
	var fill_id = audioPlayerBuilder._props_._event_ids['fill'];

	if(seek_bar_id!=null){
		var fillBar = document.getElementById(fill_id);
		var seek_bar = document.getElementById(seek_bar_id);

		var time_current = document.getElementById(time_current_id);
		var time_max = document.getElementById(time_max_id);
		var time_both = document.getElementById(time_both_id);


		self._props_._audio.addEventListener('timeupdate',function(){
		    var position = self._props_._audio.currentTime / self._props_._audio.duration;
		    var time = self._props_._audio.currentTime / self._props_._audio.duration * 100 + '%';
		    fillBar.style.width = time;

		    var totalTime = Utils.secondsToHms(self._props_._audio.duration);
		    var current_time = Utils.secondsToHms(self._props_._audio.currentTime);

		    if(time_current!=undefined && time_current!=null){
		    	time_current.textContent = current_time;
		    }
		    if(time_max!=undefined && time_max!=null){
		    	time_max.textContent = totalTime;
		    }
		    if(time_both!=undefined && time_both!=null){
		    	time_both.textContent = current_time + " / " + totalTime;
		    }


		});
		document.getElementById(seek_bar_id).addEventListener('click',function(e){
			var newWidth = (e.offsetX / seek_bar.offsetWidth * 100);
			fillBar.style.width = newWidth + "%";

			var n = (e.offsetX / (seek_bar.offsetWidth / self._props_._audio.duration));
			self._props_._audio.currentTime = n;
		});
	}

	if(play_id!=null){
		document.getElementById(play_id).addEventListener('click', function(e){
			console.log(self._props_._audio.src);
			if(self._props_._audio.src=="" || self._props_._audio.src==undefined || 
				self._props_._audio.src==null){

				console.log("Audio src not set")
				return;
			}
			if(self._props_._audio.paused){
		        self._props_._audio.play();
		        $("#"+play_id+" img").attr("src",audioPlayerBuilder._props_._default_media_btns['play']);
		    }else{
		        self._props_._audio.pause();
		        $("#"+play_id+" img").attr("src",audioPlayerBuilder._props_._default_media_btns['pause']);
		    }
		});
	}

	},self);

	return this;

}
AudioPlayerBuilderComponent.prototype = {

	setPlaylist: function(){

	},

	/**
	* Set the audio source
	*
	*/
	setSource: function(source){
		this._props_._audio.src = source;
	},

	/**
	* Get the Audio object
	*/
	getAudio: function(){
		return this._props_._audio;
	},

	getCurrentTime: function(){

	},

	getMaxTime: function(){

	},


	play: function(){

	},

	pause: function(){

	},

	playPause: function(){

	},

	next: function(){

	},

	prev: function(){

	},

	skipForward: function(){

	},

	skipBackward: function(){

	}


};

function ImageComponent(opts){

	gl_HandleAll(this,opts,'ImageComponent');

	var createElement = Utils.createElement;
	var isNull = Utils.isNull;
	var self = this;

	var img = document.createElement('img');
	img.id = this.ID;
	img.className = (Utils.isNull(opts.className)) ? "" : opts.className; 
	img.style = (Utils.isNull(opts.style)) ? "" : opts.style; 
	img.src = opts.src;
	img.alt = (opts.alt==undefined) ? "" : opts.alt;

	if(opts.width != undefined){ img.width = opts.width; } 
	if(opts.height != undefined){ img.height = opts.height; }

	if(opts.height != undefined && opts.width != undefined){
		tmpElement.setAttribute("style","width:"+opts.width+"px; height:"+opts.height+"px;");
		tmpElement.style.display = "block";
	}

	
	var tmpElement = document.createElement('div');
	var container = new ContainerComponent({ body: tmpElement });
	

	gl_ImageManager.push({
		el: img,
		container: container,
		isLoaded: false,
		run: function(){
			container.addComponent(img);
		}
	});

	this.getHtml = function(){
		return container.getHtml();
	};

}
ImageComponent.prototype = {

};


function NavbarComponent(opts){
	gl_HandleAll(this,opts,'NavbarComponent');
	var self = this;


	var createElement = Utils.createElement;

	self._props_._route = (opts.route!=undefined) ? opts.route : false;

	self._props_._view = new ViewManager();

	var navbarClasses = "navbar";
	var navbarAddedClasses = (opts.navClassName!=undefined) ? opts.navClassName : "";
	navbarClasses = navbarClasses +" "+navbarAddedClasses;

	var fixed = (opts.fixed!=undefined) ? opts.fixed : "";
	if(fixed.toLowerCase()=="top"){
		fixed = "fixed-top";
	}else if(fixed.toLowerCase()=="bottom"){
		fixed = "fixed-bottom";
	}else if(fixed.toLowerCase()=="sticky"){
		fixed = "sticky-top";
	}
	navbarClasses = navbarClasses +" "+fixed;


	var navbarDIVContainer = createElement({
		"id": this.getId()
	});

	self._props_._view_mapper = {};

	
	self._props_._navbar = createElement({
		el:'nav',
		id: (opts.id!=undefined) ? opts.id : "",
		className: navbarClasses,
		style: (opts.style) ? opts.style : ""
	});

	navbarDIVContainer.appendChild(self._props_._navbar);

	var navbarId = "navbar"+Utils.randomGenerator(16,false);

	var hamburgerButtonAttributes = (opts.hamburgerButtonAttributes!=undefined) 
		? opts.hamburgerButtonAttributes : {};


	var collapseBtn = createElement({ "el":'button' });

	if(hamburgerButtonAttributes.overwrite==undefined || hamburgerButtonAttributes.overwrite==false){
		collapseBtn.setAttribute("class", "navbar-toggler");
		collapseBtn.setAttribute("data-toggle", "collapse",);
		collapseBtn.setAttribute("data-target", "#"+navbarId,);
		collapseBtn.setAttribute("aria-controls", navbarId,);
		collapseBtn.setAttribute("aria-expanded", "false",);
		collapseBtn.setAttribute("aria-label", "Toggle navigation");
		
	}
	for(prop in hamburgerButtonAttributes){
		if(prop!="overwrite"){
			collapseBtn.setAttribute(prop, hamburgerButtonAttributes[prop]);
		}
		if(prop=="data-target"){
			navbarId = hamburgerButtonAttributes[prop];
		}
	}

	var btnId = "gp"+Utils.randomGenerator(16,false);

	var hamburgerButtonSpanClassName = (opts.hamburgerButtonSpanClassName!=undefined) 
		? opts.hamburgerButtonSpanClassName : "navbar-toggler-icon";

	var buttonSpan = createElement({
		"id": btnId,
		"el":'span',
		"className": hamburgerButtonSpanClassName
	});
	collapseBtn.appendChild(buttonSpan);

	self._props_._mainDiv = createElement({
		"el":'div',
		"id": navbarId,
		"className": "collapse navbar-collapse"
	});


	self._props_._brandLinkId = "brand_id_"+Utils.randomGenerator(12,false);
	var brandLink = createElement({el:"div",id:self._props_._brandLinkId});
	if(opts.brand!=undefined){
		if(typeof opts.brand === "string"){
			brandLink = _createBrandLink(opts.brand);
		}else{
			if (opts.brand.href!=undefined) {
				brandLink = _createBrandLink(opts.brand.label);
			}else if(opts.brand.href==null){
				brandLink = createElement({el:"label"});
				var innerHTML = (opts.brand.label!=undefined) ? opts.brand.label : "";
				brandLink.innerHTML = innerHTML;
			}else{
				brandLink = _createBrandLink(opts.brand.label);
			}
		}
	}

	function _createBrandLink(_label){
		var _brandLink = createElement({
			"el":'a',
			"href": "#",
			"className": "navbar-brand",
			"id": self._props_._brandLinkId,
			"innerHTML": (_label!=undefined) ? _label : ""
		});
		return _brandLink;
	}

	

	var hamburgerMenuPosition = (opts.hamburgerMenuPosition!=undefined) ? opts.hamburgerMenuPosition : "left";

	if(hamburgerMenuPosition.toLowerCase()=="right"){
		self._props_._navbar.appendChild(brandLink);
		self._props_._navbar.appendChild(collapseBtn);
	}else if(hamburgerMenuPosition.toLowerCase()=="left"){
		self._props_._navbar.appendChild(collapseBtn);
		self._props_._navbar.appendChild(brandLink);
	}

	var ulClassName = (opts.ulClassName!=undefined) ? opts.ulClassName : "";

	
	var hamburgerLinkPosition = (opts.hamburgerLinkPosition!=undefined) ? opts.hamburgerLinkPosition : "";
	if(hamburgerLinkPosition.toLowerCase()=="left"){
		hamburgerLinkPosition = "";
	}else if(hamburgerLinkPosition.toLowerCase()=="right"){
		hamburgerLinkPosition = "text-right pr-2";
	}


	self._props_._ul = createElement({
		"el":'ul',
		"className": "navbar-nav "+ulClassName+" "+hamburgerLinkPosition
	});

	self._props_._mainDiv.appendChild(self._props_._ul);

	self._props_._navbar.appendChild(self._props_._mainDiv);


	self._props_._frag = document.createDocumentFragment();

	
	self._props_._frag.appendChild(navbarDIVContainer);
	self._props_._frag.appendChild(self._props_._view.getHtml());

	this.getHtml = function(){
		return self._props_._frag.cloneNode(true);
	};

	_Utils_registerListenerCallbackForSelf('run','',function(){

		setTimeout(function(){

			$("#"+self._props_._brandLinkId).click(function(e){
				e.preventDefault();
			});

			$("#"+btnId).click(function(e){
				e.preventDefault();
				if($("#"+navbarId).hasClass('collapse')){
					$("#"+navbarId).removeClass('collapse');
				}else{
					$("#"+navbarId).addClass('collapse');
				}
			});

		},1000);
	},self);


	this._props_._active_class = "appfac-navbar-active";


}
NavbarComponent.prototype = {
	render: function(id){
		var self = this;
		var map = null;
		for(prop in self._props_._view_mapper){
			if(self._props_._view_mapper[prop]==id){
				map = prop;
				break;
			}
		}

		var current = self._props_._active_item;

		if(current == map) return;
		if(current!=""){
			$("."+current).removeClass(self._props_._active_class);
		}
		$("."+map).addClass(self._props_._active_class);
		self._props_._active_item = map;


		self._props_._view.render(id);
	},

	/**
	* Change the brand text
	*
	*/
	setBrand: function(text){
		$("#"+this._props_._brandLinkId).html(text);
	},

	/**
	* Show the nav content with this id.
	*
	* @param {string} id of the view to be shown.
	*/
	show: function(id){

		var self = this;

		setTimeout(function(){

		var map = null;
		for(prop in self._props_._view_mapper){
			if(self._props_._view_mapper[prop]==id){
				map = prop;
				break;
			}
		}

		var current = self._props_._active_item;

		if(current == map) return;
		if(current!=""){
			$("."+current).removeClass(self._props_._active_class);
		}
		$("."+map).addClass(self._props_._active_class);
		self._props_._active_item = map;


		self._props_._view.render(id);
		if(self._props_._route && map!=null){
			stateManager.go(id,true);
		}

		$('#'+self.getId() + ' .nav-item').removeClass(self._props_._active_class);
		$("."+map).addClass(self._props_._active_class);

		},100);


		return this;

	},


	add: function(opts){
		var self = this;

		opts = (opts!=undefined) ? opts : {};

		var isNull = Utils.isNull;

		var label = "";
		var init = false;
		var body = new ContainerComponent();
		if(!isNull(opts.label)){
			label = opts.label;
		}else{
			label = "";
		}
		if(!isNull(opts.init)){
			init = opts.init;
		}
		if(!isNull(opts.body)){
			body = opts.body;
		}
		var isButton = false;
		if(!isNull(opts.listener)){
			isButton = true;
		}

		var createElement = Utils.createElement;

		var active = (opts.init!=undefined && opts.init==true) ? self._props_._active_class : "";

		if(label=="") {
			active = "";
		}

		var id = "gp"+Utils.randomGenerator(16,false);

		var li1 = createElement({
			"el":'li',
			"className": id+" nav-item "+active
		});
		var linkLI = createElement({
			"el":'a',
			"href": "#",
			"id": id,
			"className": "nav-link",
			"innerHTML": label
		});
		li1.appendChild(linkLI);
		self._props_._ul.appendChild(li1);

		var viewId = (opts.id!=undefined) ? opts.id : "gp"+Utils.randomGenerator(16,false);
		
		if(isButton){

		}else{
			self._props_._view.newSubView({
				init: init,
				id: viewId,
				body: body
			});
		}


		if(opts.init!=undefined && opts.init==true)
			self._props_._active_item = id;

		if(!isNull(opts.id)){
			self._props_._view_mapper[id] = viewId;
		}

		
		_Utils_registerListenerCallbackForSelf('run','',function(){

			setTimeout(function(){

				$("#"+id).click(function(e){
					e.preventDefault();

					if(isButton && typeof opts.listener==='function'){
						opts.listener();
						return;
					}


					var current = self._props_._active_item;

					if(current == id) return;
					if(current!=""){
						$("."+current).removeClass('appfac-navbar-active');
					}
					$("."+id).addClass('appfac-navbar-active');
					self._props_._active_item = id;
					self._props_._view.render(viewId);

					if(label=="") {
						$("."+id).removeClass('appfac-navbar-active');
					}

					if(self._props_._route)
						stateManager.go(viewId,false);

				});

			},1000);
		},self);


	},

	build: function(){

	}
};
 

function NavComponent(opts){
	gl_HandleAll(this,opts,'NavComponent');
	var createElement = Utils.createElement;

	var isNull = Utils.isNull;
	var self = this;

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
	self._props_._view_mapper = {};
	self._props_._route = (opts.route) ? opts.route : false;


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
		className: navClasses,
		style: (opts.style) ? opts.style : ""
	});


 
 	this.getHtml = function(){
 		return this._props_._elements._fragment.cloneNode(true);
 	};


}
NavComponent.prototype = {


	show: function(id){

		var viewId = null;
		for(prop in this._props_._view_mapper){
			if(id==prop){
				viewId = this._props_._view_mapper[prop];
				break;
			}
		}
		NavComponent_initialize_tab_click(this,viewId);
	},

	/**
	* Adds a navigation item to this component.
	*
	* @param {object} - nav options
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

		var id = "gp"+Utils.randomGenerator(16,false);
		self._props_._elements._view.newSubView({
			init: init,
			id: id,
			body: body
		});

		if(!isNull(opts.id)){
			self._props_._view_mapper[opts.id] = id;
		}

		var style = (opts.style) ? opts.style : "";
		var className = (opts.className) ? opts.className : "";

		var li = createElement({el:'li',className:'nav-item'});
		var a = createElement({el:'a',
			style:style,
			id:id,
			className:'nav-link '+className,
			href:'#',
			innerHTML:label
		});

		if(init==true){
			self._props_._active_item = id;
			a.className = a.className+" active";
		}


		li.appendChild(a);
		self._props_._elements._ul.appendChild(li);
 
		_Utils_registerListenerCallbackForSelf('run','',function(){

			setTimeout(function(){

				$("#"+id).click(function(e){
					e.preventDefault();

					if(self._props_._route){
						var viewId = null;
						for(prop in self._props_._view_mapper){
							if(id==self._props_._view_mapper[prop]){
								viewId = prop;
								break;
							}
						}

						stateManager.go(viewId,false);						
					}

					NavComponent_initialize_tab_click(self,id);

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
function NavComponent_initialize_tab_click(self,id){
	var current = self._props_._active_item;
	if(current == id) return;
	if(current!=""){
		$("#"+current).removeClass('active');
	}
	$("#"+id).addClass('active');
	self._props_._active_item = id;
	self._props_._elements._view.render(id);
	
}


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
		if(!document.getElementById(this._props_._modal_id)){
			console.log('not showing')
		}
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
			var mBody = buildBody(opts);
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

	gl_HandleAll(this,opts,'ListComponent');

	var main_container = Utils.createElement({ id:this.getId() });

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

	self._props_._list_element_id = compDefaults.id;

	self._props_._single_selection = true;
	if(!Utils.isNull(opts.selectionSingle)){
		self._props_._single_selection = opts.selectionSingle;
	}

	
	this.getHtml = function(){
		return self._props_._main_container.cloneNode(true);
	}

	self._props_._initialize_item = function(item_obj,indexItem,index){
		

		var compDefaults = ComponentDefaults(item_obj,self);
		var createElement = Utils.createElement;

		var active = "";
		

		if(!Utils.isNull(item_obj.active)){
			if(item_obj.active){
				active = "active"
			}
		}

		var a = ListComponent_item_createElement(item_obj,active,index,compDefaults,self);

		self._props_._list_container.appendChild(a);

		var def = false;
		if(!Utils.isNull(item_obj.preventDefault)){
			def = item_obj.preventDefault;
		}

		var gh = index;

		_Utils_registerListenerCallbackForSelf('run','',function(){
			$("#"+compDefaults.id).click(function(e){
				if(def) e.preventDefault();
				ListComponent_item_createListener(item_obj,indexItem,gh,compDefaults,self);
			});

		},self);

	};

	self._props_._list_items = opts.list;

	if(!Utils.isNull(opts.item) && !Utils.isNull(opts.list)){
		for(var i=0; i<opts.list.length; i++){
			callme(opts.list,i,this);
		}
	}else
	if(!Utils.isNull(opts.items) && !Utils.isNull(opts.list)){
		for(var i=0; i<opts.list.length; i++){
			callme(opts.list,i,this);
		}
	}
	self._props_._item_function = opts.item;
	function callme(listItem,index,self){
		var n;

		
		if(!Utils.isNull(opts.item)){
			n = opts.item( listItem[index], index );
		}else if(!Utils.isNull(opts.items)){
			n = opts.items( listItem[index], index );
		}

		if(n==undefined){
			console.error("Please return this in the items function!");
		}

		self._props_._initialize_item( n, listItem[index], index );
	}

}

ListComponent.prototype = {

	/**
	* Remove an item from this list at the given index
	*
	* @param {number} index
	*/
	removeItemAtIndex: function(index,callback,delay){
		ListComponent_removeItemAtIndex(index,callback,delay,this);
	},

	/**
	* Adds item to this list at the given index
	*
	* @param {number} index
	* @param {object} item  
	*/
	addItemAtIndex: function(index,item,callback){
		ListComponent_addItemAtIndex(index,item,callback,this);
	}

};


function ComponentDefaults(obj,self){
	return new FormComponentDefaults(obj,self);
}


function FormComponentDefaults(obj,self){
	if(Utils.isNull(obj)){
		obj = {};
	}
	var __default = "default_id_"+Utils.randomGenerator(12,false);
	this.id        = __default;
	this.selector  = "#"+__default;
	this.tag       = __default;
	this.name      = __default;
	this.paramName = __default;
	this.href      = "#";

	if(!Utils.isNull(obj.tag)){
		this.id = obj.tag;
		this.selector = "#"+obj.tag;
		this.tag = obj.tag;
		this.name = obj.tag;
		this.paramName = obj.tag;
	}

	if(obj.paramName!=undefined){
		this.paramName = obj.paramName;
	}

	if(obj.href!=undefined){
		this.href = obj.href;
	}


	if(obj.selector!=undefined){
		if(obj.selector.charAt(0)!="#" && obj.selector.charAt(0)!="."){
			this.selector = "#"+obj.selector;
			this.id = obj.selector;
		}else{
			this.selector = obj.selector;
			this.id = obj.selector.substr(1);
		}
	}

	if(obj.name!=undefined){
		this.name = obj.name;
	}

	if(obj.id!=undefined){
		this.id = obj.id
	}

	this.remember = false;
	if(obj.remember!=undefined){
		this.remember = obj.remember;
	}

	this.style = (obj.style==undefined) ? "" : obj.style;
	this.className = (obj.className==undefined) ? "" : obj.className;
	this.placeholder = (obj.placeholder==undefined) ? "" : obj.placeholder;
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
	
	if(obj==undefined) obj = {};

	var opts = obj;
	gl_HandleAll(this,opts,'FormComponent');

	var self = this;

	self._props_._isFormSection = false;

	FormComponent_constructor(obj,this);

	var tag = obj.tag;

	this.getHtml = function(){
		return self._props_._elements._container;
	};

	
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

	/**
	* Begin a section
	*
	* @param {string} section_id
	* @param {object} options
	*/
	beginSection: function(section_id,opts){
		var self = this;

		self._props_._isFormSection = true;
		
		
		if(self._props_._form_sections._section_has_ended==false){
			console.error("Form Section has no end. Must endSection() before begining a new section.");
			return;			
		}
		self._props_._form_sections._section_has_ended = false;
		self._props_._form_sections._current_section_id = section_id;
		self._props_._form_sections._section_opts[section_id] = opts;
	},

	/**
	* End a section
	*
	* @param {function} callback
	*/
	endSection: function(callback){
		var self = this;
		var formSection = new FormSection();
		if(callback){
			formSection = callback(formSection);
			if(formSection==undefined){
				console.log('FormSection was not returned')
				formSection = new FormSection();
			}
		}

		var section_id = self._props_._form_sections._current_section_id;

		formSection._props_._formComponent = self;
		formSection._props_._section_id = section_id;
		
		self._props_._form_sections._sections[section_id] = formSection;
		self._props_._form_sections._current_section_id = null;
		self._props_._form_sections._section_has_ended = true;
	},

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
		var form_data = this._props_._form_data;
		for(var i in form_data){
			var form = form_data[i];
			var formElement = form.formElement;
			var str = formElement.selector.substr(1);
			sessionStorage.setItem(str,JSON.stringify({}));
			
		}
	},

	/**
	* Even if remember is set form will not remember values.
	* 
	* @param {boolean} remember
	*/
	preventRemembering: function(remember){
		this._props_._prevent_remember = remember;
	},

	
	wait: function(){},
	proceed: function(){},


	/**
	* Update and/or change value of form element. A tag must be assigned
	* to element to update other wise false will be returned.
	*
	* @param {string} - Tag assigned to elemnt
	* @param {string} - Value
	*/
	update: function(tag,value){
		FormComponent_update(tag,value,this);
	},

	/**
	* Add an input element to the form
	* @param {object} - options
	*/
	addInput: function(opts){
		FormComponent_addInput(opts,this);
	},

	/**
	* Add checkboxes to form.
	* @param {object} - options
	*/
	addCheckBoxGroup: function(opts){
		FormComponent_addCheckBoxGroup(opts,this);
	},

	/**
	* Add radio buttons to form.
	* @param {object} - options
	*/
	addRadioButtonGroup: function(opts){
		FormComponent_addRadioButtonGroup(opts,this);
	},

	/**
	* Add selection to this form.
	* @param {object} - options
	*/
	addSelection: function(opts){
		FormComponent_addSelection(opts,this);
	},

	/**
	* Add selection of US states to this form.
	* @param {object} - options
	*/
	addStateSelection: function(opts){
		FormComponent_addStateSelection(opts,this);
	},

	/**
	* Add textarea
	*
	* @param {object} options
	*/
	addTextarea: function(opts){
		FormComponent_addTextarea(opts,this);
	},

	/**
	* Add date picker to this form.
	* @param {object} - options
	*/
	addDatePicker: function(opts){
		FormComponent_datePicker(opts,this);
	},

	

	/**
	* Builds the form. Must be called before form can be used.
	*
	*/
	build: function(){
		FormComponent_build(this);
	},

	/**
	* Adds a submit button to the form.
	*
	* @param {object} - options
	* @param {function} - callback
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


/** @exports FormSection
* @classdesc Creates a form section
* @class
* @constructor
*/
function FormSection(){

	var self = this;

	this._props_ = {
		_view: new ViewManager()
	};

	this._props_._newSubView = function(opts){
		this._props_._view.newSubView(opts);
	};

	this._props_._listeners = {};

	this._props_._listeners._back = function(){

	};

	self._props_._buttons = [];

	self._props_._layout = null;

	self._props_._formComponent = null;

	self._props_._section_id = null;

	self._props_._insertValues = function(){  
		if(self.values!=null && self.values!=undefined){
			var form = self._props_._formComponent;
			var section_id = self.getSectionId();
			var ids = form._props_._form_sections._form_ids[section_id];
			
			if(ids!=undefined){
				for (var i = 0; i < ids.length; i++) {
					if(self.values[ids[i][1]]!=undefined){
						gl_setFromValue('input','#'+ids[i][1],self.values[ids[i][1]]);
					}
				}
			}
		}
	};

}


FormSection.prototype = {

	/**
	* Type of section this is
	* normal (default)
	* page 
	*
	*
	*/
	type: 'normal', 

	/**
	* Remember values
	*
	*/
	remember: true,
	backBtn: null,
	nextBtn: null,
	values: null,

	/**
	* Show this section, only for normal sections 
	*
	*
	*/
	show: function(){
		var self = this;
		var form = self._props_._formComponent;
		var section_id = self.getSectionId();
		var container_selectors = form._props_._form_sections._container_selectors[section_id];
		$('.'+container_selectors[1]).removeClass('app-display-none');
		$('.'+container_selectors[1]).addClass('app-display-block');
	},

	/**
	* Hide this section, only for normal sections.
	*
	*
	*/
	hide: function(){
		var self = this;
		var form = self._props_._formComponent;
		var section_id = self.getSectionId();
		var container_selectors = form._props_._form_sections._container_selectors[section_id];
		$('.'+container_selectors[1]).removeClass('app-display-block');
		$('.'+container_selectors[1]).addClass('app-display-none');
	},

	/**
	* Set the layout of this section.
	*
	* 
	*/
	setLayout: function(layout){
		this._props_._layout = layout;
	},

	/**
	* Get this sections values.
	*
	*/
	getValues: function(){
		var self = this;
		var form = self._props_._formComponent;
		var section_id = self.getSectionId();
		var ids = form._props_._form_sections._form_ids[section_id];

		var v = {};
		if(ids!=undefined){
			for (var i = 0; i < ids.length; i++) {
				v[ids[i][1]] = gl_getFormElementValue(ids[i][0],'#'+ids[i][1]);
			}
		}
		self.values = v;
		return v;
	},

	/**
	* Get this section Id
	*
	*/
	getSectionId: function(){
		return this._props_._section_id;
	},

	/**
	* Create buttons for normal section
	* 
	* @param {Object} - For normal sections, create buttons for this section layout
	*/
	setButtons: function(buttons){
		if(!Array.isArray(buttons)){
			console.error("must be an array of component buttons");
			return;
		}
		this._props_._buttons = buttons;
	},

	getButtons: function(){
		return this._props_._buttons;
	},

	goTo: function(to){

	},

	button: function(opts){
		return new ButtonComponent({
			label: (opts.label) ? opts.label : '',
			id: (opts.id) ? opts.id : '',
			className: (opts.className) ? opts.className : '',
			style: (opts.style) ? opts.style : '',
			listener: function(e){
				e.event.preventDefault();
				if(opts.listener) 
					opts.listener(e);
			}
		});
	},

}

function FileUploaderComponent(opts){
	gl_HandleAll(this,opts,'FileUploaderComponent');

	var topComponentElement = Utils.createElement({ id:this.getId() });

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

function gl_HandleAll(self,opts,type){
	_.extend(self, 
		new AppFactoryManager(type), 
		new ComponentManager(Flags.Type.component,self), 
		new EventManager(self)
	);	
	applicationManager.register(self);
	applicationManager.setComponent(self);


	if(opts!=undefined && opts.register!=undefined){
		applicationManager.setAny(opts.register, self);
	}
}



/** @exports ButtonComponent
* @classdesc .
* @class
* @constructor
*/
function ButtonComponent(opts){
	gl_HandleAll(this,opts,'ButtonComponent');

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
function inhertFrom(self,type,flag){
	_.extend(self, 
		new AppFactoryManager(type), 
		new ComponentManager(flag,self), 
		new EventManager(self)
	);
	applicationManager.register(self);
}
function ContainerComponent(obj){
	var self = this;
	
	var opts = obj;
	gl_HandleAll(this,opts,'ContainerComponent');
	
	var objWasSet = false;
	if(obj==undefined){
		objWasSet = true;
		obj = {};
	}

	if(obj.body==undefined && obj.TYPE!=undefined){
		obj.body = obj;
	}else if(typeof obj === 'string'){
		var tmp = obj;
		var obj = {};
		obj.body = Utils.convertStringToHTMLNode(tmp);
	}

	

	this._props_._obj = obj;
	this._props_._object_config = obj;
	_Utils.registerListenerCallback(obj,this);

	self._props_._active = true;
	var createElement = Utils.createElement;
	var obj = self._props_._obj;
	var bodies = [];

	var myspan = document.createElement('span');
	myspan.id = self.getId();
	self._props_._container = document.createElement('div');
	self._props_._container.id = (obj.id!=undefined) ? obj.id : "j"+Utils.randomGenerator(12,false);
	self._props_._container.appendChild(myspan);
	var spiiner = Utils_createELement('div',{id:self._props_._container.id+'-spinner'});
	self._props_._container.appendChild(spiiner);
	if(!Utils.isNull(obj.classes)){
		self._props_._container.className = obj.classes;
	}else if(!Utils.isNull(obj.className)){
		self._props_._container.className = obj.className;
	}
	if(!Utils.isNull(obj.style)){
		self._props_._container.style = obj.style;
	}

	if(obj.body!=undefined && obj.body!=null){
		var b = buildBody(obj,self);
		self._props_._container.appendChild(b.cloneNode(true));
	}

	this._props_._component_html = null;

	
	var fragment = document.createDocumentFragment();
	fragment.appendChild(self._props_._container);
	self._props_._elements._fragment = fragment;

	
	
	this.getHtml = function(route){
		return self._props_._elements._fragment.cloneNode(true);
	}


}
ContainerComponent.prototype = {


	/**
	* Returns the element Id of this contianer
	*
	* @return {string}
	*/
	getContainerId: function(){
		return this._props_._container.id;
	},


	/**
	* Add event listener to this container. There can be
	* more than one listener added to the container. 
	* 
	* @param {function} listener - Function to run when container is added
	* to DOM or if container is already on DOM run when called.
	*
	*/
	addListener: function(listener){
		var self = this;
		var obj = {};
		obj.listener = listener;
		
		_Utils.registerListenerCallback(obj,this);
		if(document.getElementById(self.getContainerId())){

		}
	},

	/**
	* Add a loader to this container.
	*
	*
	* @param {opts} [Options] - Options for this loader.
	* @param {string} [opts.customLoaderClass] - Add custom loader 
	* @param {boolean} [opts.overlay] - Adds an overlay over this container so that elements can't
	* be interacted with default is true.
	*/
	addLoader: function(opts){
		var self = this;
		if(opts==undefined) opts = {};
		if(opts.overlay==undefined){
			opts.overlay = true;
		}
		if(opts.customLoaderClass!=undefined){
			self._props_._customer_loader_class = opts.customLoader;
		}else{
			self._props_._customer_loader_class = undefined;
		}
		if(document.getElementById(self.getContainerId())){
			var cl = document.getElementById(self.getContainerId()).className;
			$("#"+self.getContainerId()).css('position','relative');
			if(opts.overlay==true){
				$("#"+self.getContainerId()).addClass('appfac-dimmed');
			}
			if(self._props_._customer_loader_class==undefined){
				$("#"+self.getContainerId()+"-spinner").addClass('appfac-loader');
			}else{
				$("#"+self.getContainerId()+"-spinner").addClass(self._props_._customer_loader_class);
			}
			
		}
	},

	showLoader: function(opts){
		this.addLoader(opts);
	},

	/**
	* Remove the loader from this container.
	*
	*/
	removeLoader: function(){
		var self = this;
		if(document.getElementById(self.getContainerId())){
			$("#"+self.getContainerId()).removeClass('appfac-dimmed');
			$("#"+self.getContainerId()+"-spinner").removeClass('appfac-loader');
			if(self._props_._customer_loader_class!=undefined){
				$("#"+self.getContainerId()+"-spinner").removeClass(self._props_._customer_loader_class);
			}
			$("#"+self.getContainerId()).css('position','');
		}
	},


	/**
	* If component.getHtml() is called from client side then this doesnt't
	* return a good representation of the current html element held by this
	* component because it's added directly to the dom when this element
	* is added this returns the html element that was added by calling 
	* component.addComponent(comp) otherwise returns null if no html was ever
	* added by calling addComponent
	*
	* @return {object}
	*
	*/
	getAddedComponentHtml: function(){
		return this._props_._component_html;
	},


	/**
	* Adds a component to this component.
	* @param {object} ComponentManager - Required, the component to add.
	* @param {boolean} [empty=true] - Empties the component 
	* of all other components before adding the new component. If set to
	* false then all other previous components will still be attached.
	*/ 
	addComponent: function(component,empty){
		
		var self = this;

		var delay = undefined;
		var attachOnce = false;
		var callback = undefined;
		var isEmpty = true;
		if(typeof empty === "boolean"){
			isEmpty = empty;
		}else if(typeof empty === 'object'){

			var object = empty;
			delay = object.delay;
			attachOnce = object.delay;
			callback = object.delay;
			isEmpty = (!Utils.isNull(empty.empty)) ? empty : true;

		}else if(empty == undefined){

		}

		var setComponent;

		
		if(typeof component === 'string'){

			var obj123 = {  
				"params": {},
				"app": gl_applicationContextManager
			};

			

			var setComponent = buildBody(component);

			self._props_._component_html = setComponent.cloneNode(true);
			

		}else if(Array.isArray(component)){
			var params = [];
			for(var i=1; i<component.length; i++){
				params.push(component[i]);
			}
			var obj123 = {  
				"params": params,
				"app": gl_applicationContextManager
			};

			setComponent = gl_applicationContextManager.Manager.retrieve(component[0])(obj123);
			
			if(Utils.isNull(setComponent)){
				console.error("Component does Not exist: "+component[0])
			}
		}else{
			setComponent = component;
		}

		self._props_._component_html = setComponent;
		
		

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

			if(delay!=undefined){
				setTimeout(function(){
					_addtodom();
				},delay);
			}else{
				_addtodom();
			}

			function _addtodom(){

				if(Utils.isNull(setComponent1)) return;

				var id = self.getId();
				if(isEmpty==true){
					$("#"+id).empty();
				}
				
				if(setComponent1.TYPE){
					$("#"+id).append(setComponent1.getHtml());
					setTimeout(function(){
						setComponent1.initializeListeners();
					},2000);
					
				}else{
					$("#"+id).append(setComponent1);
				}
			}
		}
	}
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
* @exports Brick
*/
var Brick = {

	/**
	* @param {string} [type] - if not specified then div is returned
	* @param {object} [opts] - element properties id|classes|style|innerHTML...
	* @param {object} [opts.id] - Element id
	* @param {object} [opts.class] - Element class
	* @return {object} - HTMLElement 
	*/
	createElement: function(type,opts){
		return Utils.createElement(type,opts);
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

	/**
	* An array of components to build
	*
	* @param
	*
	*/
	array: function(type,arrayObjs){
		
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
	* Create p
	* @param {Object}
	* @return {HTMLElement} 
	*/
	p: function(opts){
		return BrickComponent_make("p",opts,this);
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
	nav: function(opts){
		return BrickComponent_make("nav",opts,this);
	},

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

	/**
	*
	* @return {BrickComponent}
	*/
	section: function(opts){
		return BrickComponent_make("section", opts, this);
	},

	/**
	*
	* @return {BrickComponent}
	*/
	img: function(opts){
		return BrickComponent_make("img", opts, this);
	},


	/**
	* Create table
	* @param {Object}
	* @return {BrickComponent} 
	*/
	table: function(opts){
		return BrickComponent_make("table", opts, this);
	},

	/**
	* Create tbody
	* @param {Object}
	* @return {HTMLElement} 
	*/
	tbody: function(opts){
		return BrickComponent_make("tbody", opts, this);
	},

	/**
	* Create tfoot
	* @param {Object}
	* @return {HTMLElement} 
	*/
	tfoot: function(opts){
		return BrickComponent_make("tfoot", opts, this);
	},

	/**
	* Create td
	* @param {Object}
	* @return {HTMLElement} 
	*/
	td: function(opts){
		return BrickComponent_make("td", opts, this);
	},

	/**
	* Create th
	* @param {Object}
	* @return {HTMLElement} 
	*/
	th: function(opts){
		return BrickComponent_make("th", opts, this);
	},

	/**
	* Create tr
	* @param {Object}
	* @return {HTMLElement} 
	*/
	tr: function(opts){
		return BrickComponent_make("tr", opts, this);
	},


	/**
	* Create article
	* @param {Object}
	* @return {HTMLElement} 
	*/
	article: function(opts){
		return BrickComponent_make("article", opts, this);
	},


	/**
	* Create footer
	* @param {Object}
	* @return {HTMLElement} 
	*/
	footer: function(opts){
		return BrickComponent_make("footer", opts, this);
	},


	/**
	* Create blockquote
	* @param {Object}
	* @return {HTMLElement} 
	*/
	blockquote: function(opts){
		return BrickComponent_make("blockquote", opts, this);
	},


	/**
	* Create pre
	* @param {Object}
	* @return {HTMLElement} 
	*/
	pre: function(opts){
		return BrickComponent_make("pre", opts, this);
	},


	/**
	* Create abbr
	* @param {Object}
	* @return {HTMLElement} 
	*/
	abbr: function(opts){
		return BrickComponent_make("abbr", opts, this);
	},

	/**
	* Create br
	* @param {Object}
	* @return {HTMLElement} 
	*/
	br: function(opts){
		return BrickComponent_make("br", opts, this);
	},

	/**
	* Create area
	* @param {Object}
	* @return {HTMLElement} 
	*/
	area: function(opts){
		return BrickComponent_make("area", opts, this);
	},

	/**
	* Create audio
	* @param {Object}
	* @return {HTMLElement} 
	*/
	audio: function(opts){
		return BrickComponent_make("audio", opts, this);
	},

	/**
	* Create video
	* @param {Object}
	* @return {HTMLElement} 
	*/
	video: function(opts){
		return BrickComponent_make("video", opts, this);
	},

	/**
	* Create label
	* @param {Object}
	* @return {HTMLElement} 
	*/
	label: function(opts){
		return BrickComponent_make("label", opts, this);
	},


	/**
	* Create option
	* @param {Object}
	* @return {HTMLElement} 
	*/
	option: function(opts){
		return BrickComponent_make("option", opts, this);
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

		if(opts.body){
			var b = buildBody(opts.body,self);
			el.appendChild(b);
		}

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

		if(opts.body){
			var b = buildBody(opts.body,self);
			el.appendChild(b);
		}


	}
	self._props_._elements.push(el);


	return self;
}


function NavigationComponent(obj){
	var opts = obj;
	gl_HandleAll(this,opts,'NavigationComponent');

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
* @classdesc Wrapper for TableHandler class 
* @class
* @constructor
*/
function TableComponent(opts){

	if(opts==undefined || opts==null){
		opts = {};
	}
	this._props_ = {};

	this._props_._opts = opts;

	this._props_._is_creating = false;

	this._props_._table_body = {
		_columns: [],
		_rows: null
	};


}


TableComponent.prototype = {

	/**
	*	Add headers to table
	*
	*/
	headers: function(opts){
		this._props_._is_creating = true;

		this._props_._table_body._rows = opts;
		return this;
	},

	/**
	*	Add single column to table
	*
	*/
	column: function(opts){
		this._props_._is_creating = true;

		this._props_._table_body._columns.push(opts);

		return this;
	},

	/**
	*	Add columns to table
	*
	*/
	columns: function(opts){
		this._props_._is_creating = true;
		if(Array.isArray(opts)){
			for (var i = 0; i < opts.length; i++) {
				if(Array.isArray(opts[i])){
					this._props_._table_body._columns.push(opts[i]);
				}else{
					console.log('Table column options must be an array');
					console.log(opts);
				}
			}
		}else{
			console.log('Table columns provided must be an array');
			console.log(opts);
		}
		return this;
	},

	/**
	* Add an event listener to this table. When a cell is clicked an
	* event is triggered and the value of the cell and the event is
	* passed to this method.
	*
	*/
	listener: function(listener){
		this._props_._listener = listener; 
		return this;
	},


	/**
	*	Build this table
	*
	*/
	build: function(){
		this._props_._is_creating = true;

		var table = new TableHandler(this._props_._table_body,this);

		return table.build();

	},


	/**
	*	Creates a table from given file or text
	*
	*/
	createTable: function(opts){

		if(this._props_._is_creating){
			console.log('cant call createTable on already created table.');
			return;
		}

		var container = new ContainerComponent();

		if(opts.filename){
			
			$.get(opts.filename,function(content){
				mysetup(content);
			});
		}else if(opts.content){
			mysetup(opts.content);
		}

		function mysetup(content){
			var seperator = "\t";

			if(opts.delemeter){
				seperator = opts.delemeter;
			}

			var file_rows = content.split("\n");

			var headerData = [];
			var row = file_rows[0];
			for (var i = 0; i < row.length; i++) {
				headerData.push(row[i]);
			};

			var columnsData = [];
			
			for(var i=1; i<file_rows.length; i++){
				var column = file_rows[i].split(seperator);
				columnsData.push(column);
			}

			var table1 = new TableComponent({
				id: (opts.id) ? opts.id : "",
				className: opts.className,
				_createTableOptions: opts
				
			});
			var p = table1
			.headers(headerData)
			.columns(columnsData)
			.build();

			container.addComponent(p);
		}

		return container;
	}

};

/** @exports TableHandler
* @classdesc Creates a table, Cannot be accessed directly but through 
* the TableComponent class.
* @class
* @constructor
*/
function TableHandler(opts,tableComponent){

	gl_HandleAll(this,opts,'TableHandler');

	var self = this;
	var createTableOptions = (tableComponent._props_._opts._createTableOptions) ? 
		tableComponent._props_._opts._createTableOptions : {}; 

	var _container = document.createElement('div');
	_container.id = "table-"+Utils.randomGenerator(22,false);
	var _table = document.createElement('table');
	var _thead = document.createElement('thead');
	var _tbody = document.createElement('tbody');
	
	_table.appendChild(_thead);
	_table.appendChild(_tbody);

	var tableClassName = (tableComponent._props_._opts.className) ? tableComponent._props_._opts.className : "";

	_table.className = tableClassName;
	_tbody.className = "";
	_thead.className = "";
	_thead.id = "";

	_container.appendChild(_table);

	
	var tmpRow = [];
	if(tableComponent._props_._opts.scoped){
		var content = tableComponent._props_._opts.scoped.content;
		tmpRow.push({content: content});
		for (var i = 0; i < opts._rows.length; i++) {
			tmpRow.push(opts._rows[i]);
		}
		opts._rows = tmpRow;
	}

	var tr1 = document.createElement('tr');
	if(opts._rows==undefined){
		opts._rows = [];
	}
	for (var i = 0; i < opts._rows.length; i++) {
		var content = null;
		if(typeof opts._rows[i] === "string"){
			content = opts._rows[i];

			var th = document.createElement('th'); 
			th.innerHTML = content;
			th.scope = "col";
			tr1.appendChild(th);


		}else{
			
			

			opts._rows[i]._type = "th";
			opts._rows[i].innerHTML = opts._rows[i].content;
			opts._rows[i]._create_element_from_this_object = true;
			delete opts._rows[i].content;

			var th = buildBody(opts._rows[i],self);

			th.scope = "col";
			tr1.appendChild(th);

		}

	}
	_thead.appendChild(tr1);


	var ids = [];
	var columnCount = 1;
	for (var i = 0; i < opts._columns.length; i++) {
		var column = opts._columns[i];
		var tr = document.createElement('tr'); 
		var count = 0;
		for (var n = 0; n < column.length; n++) {
			var content = null;
			if(typeof column[n] === "string"){
				content = column[n];
			}else{
				content = column[n].content;
			}

			var td = document.createElement('td'); 
			if(tableComponent._props_._opts.scoped){
				if(count==0){
					var th2 = document.createElement('th'); 
					th2.scope = "row";
					th2.innerHTML = columnCount;
					columnCount++;
					count++;
					tr.appendChild(th2);
				}
			}
			var id = "a"+Utils.randomGenerator(12);
			td.innerHTML = content;
			td.id = id;
			tr.appendChild(td);
			ids.push(id);
		}
		_tbody.appendChild(tr);
	}

	_Utils_registerListenerCallbackForSelf("run","",function(data){
					console.log("what");
		setTimeout(function(){

					console.log("yes");
		for (var i = 0; i < ids.length; i++) {
			$("#"+ids[i]).click(function(e){
					console.log("no");
				if(createTableOptions.listener){
					console.log("hello");
					createTableOptions.listener(e.target.innerHTML,e);
				}else if(tableComponent._props_._listener){
					console.log("world");
					tableComponent._props_._listener(e.target.innerHTML,e);
				}
			})
		}

		},1000);


	},self);

	this._props_._fragment = document.createDocumentFragment();
	this._props_._fragment.appendChild(_container);

	this.getHtml = function(){
		return this._props_._fragment.cloneNode(true);
	}


}
TableHandler.prototype = {

	/**
	* Builds this table
	*
	*/
	build: function(){
		return this;
	}
};

function TableComponent245 (obj){
	
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
				
				if(!isNull(obj.save)){
					obj.save(self);
				}
				
				
				
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

TableComponent245.prototype = {

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

		var updatable = (isNull(obj.updatable)) ? false : obj.updatable;

		
		var mode = (isNull(obj.mode)) ? "normal" : obj.mode;
		var tm = new ComponentFactory();
		var table = tm.table({
			updatable: updatable,
			editable: false,
			mode: false,
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
			func: function(){}
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

function CMSManager(){

}
CMSUsers.prototype = {


}


/* Utils */

/** 
* @exports Utils
*/
var Utils = {

	validateEmail: function(email) {
    	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(String(email).toLowerCase());
	},


	findById: function(id){
		return document.getElementById();
	},

	queryEl: function(selector){
		return document.querySelector(selector)
	},

	createElement: function(type,options){
		return Utils_createELement(type,options);
	},

	/**
	* Convert seconds into time hh:mm:ss
	*
	*/
	secondsToHms: function(d) {
	    d = Number(d);
	    var h = Math.floor(d / 3600);
	    var m = Math.floor(d % 3600 / 60);
	    var s = Math.floor(d % 3600 % 60);

	    h = (h<10) ? "0" + h : h;
	    m = (m<10) ? "0" + m : m;
	    s = (s<10) ? "0" + s : s;

	    return h + ":" + m + ":" + s;
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
		if(typeof Number.prototype.toFixedDown === "undefined"){
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
		
	    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	    var s = null;
		for (var i = 0; i < sizes.length; i++) {
			if(maxSize.includes(sizes[i])){
				s = sizes[i];
				break;
			}
		}
		
		if(s==null){ s = sizes[2]; }
		var sizeAmount = maxSize.split(s)[0];
		var sizeType = s;
		
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
					
					
					var index = i;
					
						components[index].component.initializeListeners();
					

					
					CONNECTED_COMPONENTS.push(components[index].id);
					var comp = components[index].component._props_._dom_events;

					
					ApplicationManager_start_handleAttachEvents(comp,components[index].component);
					
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

		
		var completed_images = [];
		for (var i = 0; i < gl_ImageManager.length; i++) {
			var container = gl_ImageManager[i].container;
			var image = gl_ImageManager[i].el;
			var run = gl_ImageManager[i].run;
			if(document.getElementById(container.getId())){
				if(image.complete){
					completed_images.push(i);
					run();
				}
			}
		}

		for (var i = 0; i < completed_images.length; i++) {
			if(!gl_ImageManager[completed_images[i]] != undefined)
				gl_ImageManager.splice(completed_images[i], 1);
		}
		
		
	}, 42);

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
function ApplicationManager_templateParser(htmlString,replacements,opts,self){
	
	var res = htmlString;

	if(replacements.length!=2) return htmlString;

	if(opts==null || opts==undefined) opts = {};

	var regex = /{{(.*?)}}/g;

	if(opts.delimiterRegex){
		regex = opts.delimiterRegex;
	}

	var matched = regex.exec(htmlString);
	while(matched != null){
		if(matched[1]==replacements[0]){
			res = res.replace(matched[0],replacements[1]);
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
			if(document.getElementById(document.getElementById(eventObj.selector.substring(1)))){
				_runsetupinitializelistener(eventObj,self);
			}else{
				checkagain(eventObj,self);
			}
		}
	}
}
function checkagain(eventObj,self){
	setTimeout(function(){ 
		
		if(self._props_._count_event_check_runs==undefined){
			self._props_._count_event_check_runs = 0;
		}
		if(self._props_._count_event_check_runs >= 10){
			self._props_._count_event_check_runs = 0;
			return;
		}

		if(document.getElementById(eventObj.selector.substring(1))){
			self._props_._count_event_check_runs = 0;
			_runsetupinitializelistener(eventObj,self);
			return;
		}else{
			self._props_._count_event_check_runs++;
			checkagain(eventObj,self);
		}
	},500);
}
function _runsetupinitializelistener(eventObj,self){
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
		
		for(prop in eventObj){
			if(typeof eventObj[prop] === 'function'){
				if(document.getElementById( eventObj.selector.substring(1) )){
					var value = document.getElementById(eventObj.selector.substring(1)).value;
					if(eventObj.obj!=undefined && eventObj.obj.repsonseEventHandler){
						eventObj.obj.repsonseEventHandler._props_._value = value;
						eventObj.obj.repsonseEventHandler._props_._event = e;
						eventObj[prop](eventObj.obj.repsonseEventHandler);
					}else{
						eventObj[prop](d);
					}
				}
				break;
			}
		}
	});
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
			var route = "";
			if(i != ""){
				route = i;
			} 
			var layout = obj.routes[i];
			if(typeof layout === "string"){
				
				
				_setRouteWithMethod(route,layout);

			}else if(typeof layout === "object"){
				_setRouteWithMethod(route,layout.layout,layout.transition);
			}else if(typeof layout === "function"){
				_setRouteWithMethod(route,layout);
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

				if(typeof layout === "function"){
					return layout;
				}
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
				"params": _params,
				"app": gl_applicationContextManager
			};
			

			pages.setRoute(obj); 

			
			if(typeof _registeredLayout === "function"){
				var r = _registeredLayout(obj);
				if(r!=undefined) {
					$(applicationManager.getRootElement()).empty();
					$(applicationManager.getRootElement()).append(r.getHtml());
				}
				return;
			}


			try{

				var layoutComponent = applicationManager.retrieve(_registeredLayout,Flags.Method)(obj);
				if(layoutComponent){
					
					App(applicationManager.getRootElement()).empty();
					App(applicationManager.getRootElement()).append(layoutComponent.getHtml());
				}
				
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

			}catch(e){
				console.error('Method not registered: '+_registeredLayout);
				console.error(e);
			}
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
function ViewManager_render(id,params,opts,self){
	var trigger = false;
	var replace = true;
	var addComponentBody = null;
	opts = (opts) ? opts : {};
	

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
		if(typeof mOpts.body == 'function'){
			var n = mOpts.body();
			self._props_._containers.addComponent(n,replace);
			_options.body = n;
			return;
		}else if(params && typeof mOpts.body==='string'){
			_options.body = [mOpts.body,params];
		}else{
			_options.body = mOpts.body;
		}
		
		var mBody = buildBody(_options,self);
		self._props_._containers.addComponent(mBody,replace);
		self._props_._current_view = id;
		
		
		
		
	}
}
function ViewManager_next(opts,self){
	var current = self._props_._current_view;
	var index = -1;
	var canGo = false;
	var next_current = '';
	var length = self._props_._view_order.length;
	for (var i = 0; i < length; i++) {
		if(self._props_._view_order[i] == current){
			index = (i+1);
			if(index<length){
				canGo = true;
			}
			break;
		}
	}
	if(canGo){
		var view = self._props_._view_order[index];
		self.render(view,opts);
	}
}
function ViewManager_back(opts,self){
	var current = self._props_._current_view;
	var index = -1;
	var canGo = false;
	var next_current = '';
	var length = self._props_._view_order.length;
	for (var i = 0; i < length; i++) {
		if(self._props_._view_order[i] == current){
			index = (i-1);
			if(index>=0){
				canGo = true;
			}
			break;
		}
	}
	if(canGo){
		var view = self._props_._view_order[index];
		self.render(view,opts);
	}
}
function ViewManager_goTo(index,opts,self){
	if(typeof index === 'string'){
		self.render(index,opts);
	}else if(typeof index === 'number'){
		if((self._props_._view_order.length-1) >= index){
			var view = self._props_._view_order[index];
			self.render(view,opts);
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

	if(obj==undefined) obj = {};

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

	self._props_._sections = {};
	self._props_._form_sections = {};
	self._props_._form_sections._current_section_id = null;
	self._props_._form_sections._section_has_ended = true;
	self._props_._form_sections._sections = {};
	self._props_._form_sections._form_ids = {};
	self._props_._form_sections._section_opts = {};
	self._props_._form_sections._container_selectors = {};

	self._props_._defaultValue = (obj.defaultValue==undefined) ? gl_DEFAULT_FORM_VALUE : obj.defaultValue;

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
				
				
			}
			self._props_._runs._count++;
		},200);

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
			var paramname = triggers[i].paramName;
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
		_setup_form_elements(i);
	}
	function _setup_form_elements(index){
		var obj = data[index];
		var layout_default = {row: true,col: {md:12}}
		if(!Utils.isNull(obj.layout)){
			layout_default = obj.layout;
		}
		var layout = layout_default;
		elements.push({
			element: obj.component,
			layout: layout,
			section: obj.section,
			data: obj
		});
	}
	return elements;
}


function FormComponent_build(self){
	handleFormNormalBuild(self);
}


function objectLength(obj){
	var len = 0;
	for(prop in obj){
		len++;
	}
	return len;
}

function __FormSectionHandler(){
	this.elements = null;
	this.layout = null;
	this.all_elements = null;
	this.formSectionView = null;

}
__FormSectionHandler.prototype = {

};


function handleFormNormalBuild(self){
	var formSectionHandler = new __FormSectionHandler();

	formSectionHandler.elements = self.getFormElements();
	formSectionHandler.all_elements = f_create_all_elements(formSectionHandler.elements,self);
	formSectionHandler.formSectionViewIDs = [];
	formSectionHandler.layout = layoutManager.newLayout().row();


	for (var i = 0; i < formSectionHandler.all_elements.length; i++) {
		if(Array.isArray(formSectionHandler.all_elements[i])){
			
			f_handle_formSection(formSectionHandler,i,self);
		}else{
			var layRow = formSectionHandler.all_elements[i].layout.row;
			var layCol = formSectionHandler.all_elements[i].layout.col;
			var comp = formSectionHandler.all_elements[i].element;
			if(layRow!=undefined && layRow==true){
				formSectionHandler.layout.row();
			}
			formSectionHandler.layout.col(layCol,comp);
		}
	}

	if(formSectionHandler.formSectionView!=null){
		
		formSectionHandler.layout.row();
		formSectionHandler.layout.col({md:12},formSectionHandler.formSectionView);
		self._props_._form_sections._view_ids = formSectionHandler.formSectionViewIDs;
	}

	
	if(self._props_._isFormSection==false){
		formSectionHandler.layout.row();
		formSectionHandler.layout.col({md:12},[self._props_._submit_button]);		
	}
	
	
	formSectionHandler.layout.build();
	self._props_._form.appendChild(formSectionHandler.layout.getHtml());

}
function f_create_all_elements(elements,self){
	var all_elements = [];
	var group_sections = {};
	var last_sec_id = null;
	for (var i = 0; i < elements.length; i++) {
		if(elements[i].section!=null){
			var sec_id = elements[i].section;
			if(last_sec_id!=null && last_sec_id!=sec_id){
				all_elements.push(group_sections[last_sec_id])
			}
			last_sec_id = sec_id;
			if(group_sections[sec_id]==undefined){
				group_sections[sec_id] = [];
				formSection = self._props_._form_sections._sections[sec_id];
				group_sections[sec_id].push(formSection);
			}
			group_sections[sec_id].push(elements[i]);
			if(i == (elements.length-1)){
				all_elements.push(group_sections[last_sec_id]);
			}
		}else{
			if(last_sec_id!=null){
				all_elements.push(group_sections[last_sec_id]);
			}
			last_sec_id = null;
			all_elements.push(elements[i]);
		}
	}
	return all_elements;
}

function f_handle_formSection(formSectionHandler,index,self){
	var _formSectionsObjects = [];
	var form_view = formSectionHandler.all_elements[index];
	var formSection = form_view[0];

	if(formSection.type=='normal'){
		var form_section_layout = layoutManager.newLayout().row();

		for (var n = 1; n < form_view.length; n++) {

			var layRow = form_view[n].layout.row;
			var layCol = form_view[n].layout.col;
			var comp = form_view[n].element;

			if(layRow==true){
				form_section_layout.row();
			}

			form_section_layout.col(layCol,comp);

		}
		if(formSection.getButtons().length>0){
			var buttons = formSection.getButtons();
			for (var i = 0; i < buttons.length; i++) {
				if(formSection._props_._layout!=null){
					var def = {md:12};
					if(formSection._props_._layout[i]!=undefined){
						def = formSection._props_._layout[i]
					}
					form_section_layout.col(def,buttons[i]);
				}else{
					form_section_layout.col(def,buttons[i]);
				}
				
			}
		}

		form_section_layout.build();

		var section_opts = self._props_._form_sections._section_opts[formSection.getSectionId()];
		var mysec_class = 'p'+Utils.randomGenerator('12');
		var mysec_id = 'p'+Utils.randomGenerator('12');
		if(section_opts!=undefined){
			if(section_opts['id']!=undefined){
				mysec_id = section_opts['id'];
			}
			if(section_opts['className']!=undefined){
				mysec_class = section_opts['className'];
			}					
		}
		self._props_._form_sections._container_selectors[formSection.getSectionId()] = [mysec_id,mysec_class];
		var section_container = new ContainerComponent({
			id: mysec_id,
			className: mysec_class,
			body: form_section_layout
		});

		formSectionHandler.layout.col(layCol,section_container);

	}else if(formSection.type=='page'){
		
		if(formSectionHandler.formSectionView==null){
			formSectionHandler.formSectionView = new ViewManager();
		}

		var form_handler = self._props_._form_handler;
		var event_trigger_submit = self._props_._triggers.submit; 
		var event_trigger_reset = self._props_._triggers.reset;
	
		var form_section_layout = layoutManager.newLayout().row();
		
		for (var n = 1; n < form_view.length; n++) {
			var layRow = form_view[n].layout.row;
			var layCol = form_view[n].layout.col;
			var comp = form_view[n].element;

			if(layRow!=undefined && layRow==true){
				form_section_layout.row();
			}
			form_section_layout.col(layCol,comp);
			_tothegame(comp,form_view,n);
		}	

		if(formSection.getButtons().length>0){
			var buttons = formSection.getButtons();
			for (var i = 0; i < buttons.length; i++) {
				if(formSection._props_._layout!=null){
					var def = {md:12};
					if(formSection._props_._layout[i]!=undefined){
						def = formSection._props_._layout[i]
					}
					form_section_layout.col(def,buttons[i]);
				}else{
					form_section_layout.col(def,buttons[i]);
				}
				
			}
		}

		
		function _tothegame(comp,form_view,n){
			comp.listenTo(form_handler, event_trigger_submit, function(msg) {
				
				var myid = form_view[n].data.formElement.id;
				if(document.getElementById(form_view[n].data.formElement.id) != undefined){	
					_handle_current_view_values(function(values){
						
						var val = gl_getFormElementValue('input','#'+myid);
						values[myid] = val;
						return val;
					});
				}
			});
		}

		function _get_current_view_for_section(cv){
			var _this_form_section = null;
			for (var i = 0; i < _formSectionsObjects.length; i++) {
				if(_formSectionsObjects[i][0]==cv){
					_this_form_section = _formSectionsObjects[i][1];
					break;
				}
			}
			return _this_form_section;
		}
		function _handle_current_view_values(addValuesCallback){
			var cv = formSectionHandler.formSectionView.getCurrentView();
			var _this_form_section = _get_current_view_for_section(cv);
			if(_this_form_section!=null){
				var v = _this_form_section.getValues();
				if(addValuesCallback!=undefined){
					hold_section_values[cv] = addValuesCallback(v);
				}else{
					hold_section_values[cv] = v; 
				}
			}
		}

		var hold_section_values = {};

		form_section_layout.row();

		if(formSection.backBtn!=null){
			var backBtn = formSection.backBtn;
			var btn1 = new ButtonComponent({
				label: (backBtn.label!=undefined) ? backBtn.label : 'Back',
				id: (backBtn.id!=undefined) ? backBtn.id : '',
				style: (backBtn.style!=undefined) ? backBtn.style : '',
				className: (backBtn.className!=undefined) ? backBtn.className : '',
				listener: function(e){
					e.event.preventDefault();
					_handle_current_view_values();
					if(backBtn.listener!=undefined && typeof backBtn.listener=='function'){
						backBtn.listener(e);
					}
					formSectionHandler.formSectionView.back();
				}
			});
			form_section_layout.col({md:6},btn1);
		}

		if(formSection.nextBtn!=null){
			var nextBtn = formSection.nextBtn;
			var btn2 = new ButtonComponent({
				label:(nextBtn.label!=undefined) ? nextBtn.label : 'Next',
				id: (formSection.nextBtn.id!=undefined) ? nextBtn.id : '',
				style: (formSection.nextBtn.style!=undefined) ? nextBtn.style : '',
				className: (nextBtn.className!=undefined) ? nextBtn.className : '',
				listener: function(e){
					e.event.preventDefault();
					_handle_current_view_values();
					if(nextBtn.listener!=undefined && typeof nextBtn.listener=='function'){
						nextBtn.listener(e);
					}
					formSectionHandler.formSectionView.next();
				}
			});
			form_section_layout.col({md:6},btn2);
		}

		if(formSection.submit!=undefined && formSection.submit==true){

			form_section_layout.row();
			form_section_layout.col({md:12},self._props_._submit_button);

		}
		
		form_section_layout.build();

		form_section_view_id = "p"+Utils.randomGenerator(12);

		_formSectionsObjects.push([form_section_view_id,form_view[0]]);

		var form_section_container = new ContainerComponent({body: form_section_layout});
		
		form_section_container.addListener(function(obj){
			if(formSection.remember){
				formSection._props_._insertValues();
			}
		});

		formSectionHandler.formSectionView.newSubView({
			id: form_section_view_id,
			init: (formSectionHandler.formSectionViewIDs.length==0) ? true : false,
			body: form_section_container
		});
		formSectionHandler.formSectionViewIDs.push(form_section_view_id);
	}
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
	var id = (opts.id==undefined) ? "onSubmit-"+Utils.randomGenerator(16,false) : opts.id;
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


/** @exports FormInputEventHandler
* @classdesc An internal object passed through to the formInput for manipulation of this input the events such as focusout, focusin etc. 
* @class
* @constructor
* @tutorial GettingStarted
*/
function FormInputEventHandler(){
	this._props_ = {
		_value: null,
		_id: null,
		_errorMethod: null,
		_successMethod: null,
		_statusId: null,
		_event: null
	};
}
FormInputEventHandler.prototype = {

	/**
	* Get the value of this input.
	* @param
	*/
	getValue: function(){ return this._props_._value; },

	/**
	* Returns the event.
	* 
	* @return {event}
	*/
	getEvent: function(){ return this._props_._event; },

	/**
	* Add an error to this input with an optional message. Changes the input's style. 
	* @param {string} - message
	*/
	addErrorStatus: function(errorMessage){
		if(this._props_._errorMethod){
			this._props_._errorMethod(errorMessage);
		}
	},

	/**
	* Add success to this input with an optional message. Changes the input's style. 
	* @param {string} - message
	*/
	addSuccessStatus: function(successMessage){
		if(this._props_._successMethod){
			this._props_._successMethod(successMessage);
		}
	},

	/**
	* Removes status styles and message from this input.
	* @param {string} - message
	*/
	removeStatus: function(){
		if(this._props_._removeStatus){
			this._props_._removeStatus();
		}
	}


};

function FormComponent_addInput(opts,self){

	var formElement = new FormComponentDefaults(opts,self);
	var layout_classes = "";
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
	var default_value = (opts.defaultValue!=undefined && opts.defaultValue!="") ? opts.defaultValue : gl_DEFAULT_FORM_VALUE;
	if(default_value!=""){
		self._props_._values[formElement.paramName] = default_value;
		
	}

	var _current_section_id = self._props_._form_sections._current_section_id;
	if(self._props_._form_sections._form_ids[_current_section_id]==undefined){
		self._props_._form_sections._form_ids[_current_section_id] = [];
	}
	self._props_._form_sections._form_ids[_current_section_id].push(['input',formElement.paramName]);

	
	var compContainer = new ContainerComponent({body:layoutContainer});
	var tag = formElement.tag;
	self._props_._form_data[tag] = {
		element: layoutContainer,
		component: compContainer,
		paramName: formElement.paramName,
		type: 'input',
		layout: opts.layout, 
		formElement: formElement,
		section: _current_section_id,
		
		
		
		
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
		gl_handle_event_trigger_onSubmit('input',self,_current_section_id,tag);
	});
	compContainer.listenTo(form_handler, event_trigger_reset, function(msg) {
		gl_event_trigger_reset('input',self,tag);
	});
	compContainer.addListener(function(e){
		if(formElement.selector.length <= 1){
			
			console.log("form addInput tag should not be blank");
		}
		$(formElement.selector).focusout(function(e){
			initializeValidationAndValues();
		});
	});

	var f = new FormInputEventHandler();
	f._props_._errorMethod = _add_error_;
	f._props_._successMethod = _add_success_;
	f._props_._removeStatus = _remove_message_;
	f._props_._statusId = statusId;
	opts.repsonseEventHandler = f;
	FormComponent_addInput_registerEvents(opts,formElement,self);

	_Utils_registerListenerCallbackForSelf("run","",function(b){

		setTimeout(function(){
			if(self._props_._values[formElement.paramName]!="" && 
				self._props_._values[formElement.paramName]!=default_value &&
				self._props_._values[formElement.paramName]!=undefined){

				$(formElement.selector).val(self._props_._values[formElement.paramName]);
			}
			
		},500);

		if(formElement.remember){
			
			
			var value = self._props_._getRemeber(tag);
			if(!Utils.isNull(value) && value.trim()!="none"){
				$(formElement.selector).val(value);
			}
		}
	},self,true);

	function initializeValidationAndValues(){
		var validation = validation_set_defaults(opts.validation);
		var val;
		if(self._props_._form_data[tag].section!=null){
			var section_id = self._props_._form_data[tag].section;
			var form_sec = self._props_._form_sections._sections[section_id];
			if(form_sec.type=='page'){
				
				var values = form_sec.values;
				for(prop in values){
					if(formElement.selector.substring(1)==prop){
						val = values[prop];
						break;
					}
				}
				if(val==undefined){
					val = gl_getFormElementValue('input',formElement.selector);
				}
			}else{
				val = gl_getFormElementValue('input',formElement.selector);
			}
		}else{
			val = gl_getFormElementValue('input',formElement.selector);
		}

		var value = "";

		if(val!="" && val!=undefined){
			value = val;
		}else{
			if(formElement.defaultValue!=gl_DEFAULT_FORM_VALUE){
				value = formElement.defaultValue;
			}else if(self._props_._defaultValue!=gl_DEFAULT_FORM_VALUE){
				value = self._props_._defaultValue;
			}else{
				value = gl_DEFAULT_FORM_VALUE;
			}
		}

		self._props_._values[formElement.paramName] = value;
		if(formElement.remember){
			self._props_._setRemeber(formElement.tag,value);
		}

		if(Utils.isNull(validation)){
			return;
		}
		if(!Utils.isNull(validation.required)){
			
				var _isvalid = requiredValidation(val,validation);
				self._props_._form_data[tag]['isValid'] = _isvalid;
				if(!_isvalid) return;
			
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

	self._props_._initializeValidationAndValues = initializeValidationAndValues;

	
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
		if(val==undefined || val.length==0){
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
			
			_add_error_1();
		}else{
			_add_error_1();
		}
		function _add_error_1(){
			_isvalid = false;
			_remove_message_();
			
			$(formElement.selector).addClass("is-invalid");
			$("#"+statusId).addClass("invalid-feedback");
			$("#"+statusId).text(errorMsg);
		}
	}
	function _add_success_(successMsg){
		if(!$("#"+statusId).hasClass("valid-feedback")){
			_add_success_1();
		}else if($("#"+statusId).hasClass("invalid-feedback")){
			
			_add_success_1();
		}else{
			_add_success_1();
		}
		function _add_success_1(){
			_isvalid = true;
			_remove_message_();
			
			$(formElement.selector).addClass("is-valid");
			$("#"+statusId).addClass("valid-feedback");
			$("#"+statusId).text(successMsg);	
		}
	}
	function _remove_message_(){
		$(formElement.selector).removeClass("is-valid");
		$(formElement.selector).removeClass("is-invalid");
		$("#"+statusId).removeClass("valid-feedback");
		$("#"+statusId).removeClass("invalid-feedback");
		$("#"+statusId).text("");	
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
		layout: opts.layout, 
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

	var inline_class = "";
	if(opts.inline!=undefined && opts.inline==true){
		inline_class = "form-check-inline";
	}

	var class_name = (opts.className==undefined) ? "" : opts.className;
	var topDiv = createElement({
		el: 'div',
		className: 'form-group '+ class_name 
	});
	var topLabel = createElement({
		el: 'label',
		
		className: 'form-check-label',
		innerHTML: topLabelStr
	});
	topDiv.appendChild(topLabel);
	topDiv.appendChild(Utils.convertStringToHTMLNode("<br>"));
	if(!Utils.isNull(opts.buttons)){
		var buttons = opts.buttons;
		var btnElements = [];
		for(var i=0; i<buttons.length; i++){
			var button = buttons[i];
			var defaults = new FormComponentDefaults(button,self);
			var div = createElement({
				className: 'form-check '+inline_class
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
		
		var _current_section_id = self._props_._form_sections._current_section_id;
		self._props_._form_data[tag] = {
			paramName: formElement.paramName,
			component: compContainer,
			type: 'radio',
			formElement: formElement,
			layout: opts.layout,
			status: 0,
			statusId: statusId,
			section: _current_section_id,
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
		
		
	}

	var url = opts.url;

	if(opts.percent!=undefined && opts.percent==true){
		showPercent = opts.percent;
		opts.percent = _handle_percent_defaults({});
	}else if(opts.percent!=undefined && typeof opts.percent === 'object'){
		opts.percent = _handle_percent_defaults(opts.percent);
	}
	
	function _handle_percent_defaults(p){
		if(Utils.isNull(p.id)){
			p.id = "m"+Utils.randomGenerator(12,false);
		}
		if(Utils.isNull(p.className)){
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

	if(opts.complete!=undefined){
		self._loadcallback = opts.complete;
	}

	var name = "m"+Utils.randomGenerator(7,false);

	var containerDefaults = new ComponentDefaults(opts,self);
	var formDefaults = new ComponentDefaults(opts.form,self);
	var inputDefaults = {
		name: (opts.name==undefined) ? name : opts.name,
		style: (opts.inputStyle==undefined) ? "" : opts.inputStyle
	};
	var submitDefaults = {
		label: (opts.label==undefined) ? "" : opts.label,
		style: (opts.style==undefined) ? "" : opts.style,
		className: (opts.className==undefined) ? "" : opts.className,
		id: (opts.id==undefined) ? "m"+Utils.randomGenerator(7,false) : opts.id
	};

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
		
		name: inputDefaults.name,
		id: submitDefaults.id,
		className: submitDefaults.className,
		style: submitDefaults.style +" margin-top:4%;"
	});
	var percentElement = createElement({
		el: opts.percent.el,
		id: opts.percent.id,
		className: opts.percent.classes,
		style: opts.percent.style +" margin-top:3%;"
	});
	var messageElementId = "m"+Utils.randomGenerator(14,false);
	var messageElement = createElement({
		el: "div",
		id: messageElementId,
		className: "",
		style: "color: red; margin-top:3%;"
	});

	formElement.appendChild(labelElement);
	formElement.appendChild(inputElement);
	formElement.appendChild(messageElement);
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
					if(isOver){
						if(opts.limit!=undefined && opts.limit.errorMsg!=undefined){
							document.getElementById(messageElementId).innerHTML = opts.limit.errorMsg;
						}else{
							document.getElementById(messageElementId).innerHTML = "File size too large";
						}
						return;
					} 
					document.getElementById(messageElementId).innerHTML = "";
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


			if(typeof url === "boolean" && url==true){
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
			
					
					
						var progress = document.getElementById(opts.percent.id);
						console.log(progress);
						
						while(progress.hasChildNodes()){
							progress.removeChild(progress.firstChild);
						}
						progress.appendChild(document.createTextNode(Math.round(percent * 100) + " %" ));
				
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
function FormComponent_addInput_registerEvents(obj,formElement,self){
	var preventDefault = false;
	var stopPropagation = false;
	if(!Utils.isNull(obj.focusin)){
		_Utils_registerListenerCallbackForSelf(
			"focusin",
			formElement.selector,
			obj.focusin,
			self,
			preventDefault,
			stopPropagation,
			obj
		);
	}
	if(!Utils.isNull(obj.focusout)){
		_Utils_registerListenerCallbackForSelf(
			"focusout",
			formElement.selector,
			obj.focusout,
			self,
			preventDefault,
			stopPropagation,
			obj
		);
	}
	if(!Utils.isNull(obj.keyup)){
		_Utils_registerListenerCallbackForSelf(
			"keyup",
			formElement.selector,
			obj.keyup,
			self,
			preventDefault,
			stopPropagation,
			obj
		);
		
	}
	if(!Utils.isNull(obj.keydown)){
		_Utils_registerListenerCallbackForSelf(
			"keydown",
			formElement.selector,
			obj.keydown,
			self,
			preventDefault,
			stopPropagation
		);
		
	}
	if(!Utils.isNull(obj.mouseover)){
		_Utils_registerListenerCallbackForSelf(
			"mouseover",
			formElement.selector,
			obj.mouseover,
			self,
			preventDefault,
			stopPropagation
		);
		
	}
}

/* 0000 - ListComponent */
function ListComponent_addItemAtIndex(index,item,callback,self){

	self._props_._list_items.splice(index,0,item);

	var opts = self._props_._item_function(item);
	if(opts==undefined) opts = {};

	var compDefaults = ComponentDefaults(opts,self);
	var createElement = Utils.createElement;

	var a = ListComponent_item_createElement(opts,false,index,compDefaults,self);

	$(self._props_._list_container).find("[data-index=0]").after(a.cloneNode(true));

	if(document.getElementById(self._props_._list_element_id)){

		if(index==0){
			$('#'+self._props_._list_element_id).find("[data-index=0]").before(a).addClass('remove');
			if(callback!=undefined){
				var $el = $('#'+self._props_._list_element_id).find("[data-index="+index+"]").removeClass('remove');
				callback( $el );
			}
		}else if(index>=(self._props_._list_items.length-1)){
			var i = self._props_._list_items.length - 3;
			console.log("yes: "+i);
			$('#'+self._props_._list_element_id).find("[data-index="+i+"]").after(a);
			if(callback!=undefined){
				var $el = $('#'+self._props_._list_element_id).find("[data-index="+index+"]").removeClass('remove');
				callback( $el );
			}
		}else{
			var i = index - 1;
			$('#'+self._props_._list_element_id).find("[data-index="+i+"]").after(a);
			if(callback!=undefined){
				var $el = $('#'+self._props_._list_element_id).find("[data-index="+index+"]").removeClass('remove');
				callback( $el );
			}
		}

		

		$( "#"+self._props_._list_element_id ).find('li').each(function( index ) {
		  	$( this ).attr("data-index",index);
		});
		

		$("#"+compDefaults.id).click(function(e){
			e.preventDefault();
			ListComponent_item_createListener(opts,item,gh,compDefaults,self);
		});

	}else{


	}
}
function ListComponent_removeItemAtIndex(index,callback,delay,self){

	self._props_._list_items.splice(index,1);

	var el = $("#"+self._props_._list_element_id).find("[data-index="+index+"]");
	if(callback!=undefined){
		callback(el);
	}

	if(delay==undefined) delay = 0;

	if(delay==0){
		
	}else{
		setTimeout(function(){
			
		},delay);
	}
	

	$( "#"+self._props_._list_element_id ).find('li').each(function( index ) {
	  	$( this ).attr("data-index",index);
	});
}
function ListComponent_item_createListener(opts,indexItem,gh,compDefaults,self){
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
}
function ListComponent_item_createElement(opts,active,index,compDefaults,self){

	var createElement = Utils.createElement;

	var a;
	if(self._props_._list_type=="ul" || self._props_._list_type=="ol"){
		a = createElement({
			el: 'li',
			"data-index":  index,
			className: compDefaults.className,
			id: compDefaults.id,
			style: compDefaults.style,
			href: compDefaults.href,
			innerHTML: compDefaults.label
		});
	}else if(self._props_._list_type=="bootstrap"){
		a = createElement({
			el: 'li',
			"data-index":  index,
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
	return a;
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
	var ownTypes = ["el","selector","_el","_selector","body"];
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
				
				
				if(i.charAt(0) != "_")
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
			var special_character = Utils.specialChars[i];
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
function AppLayout_constructor(obj,self){

	obj = (Utils.isNull(obj)) ? {} : obj;
	
	self.ID = "d-"+Utils.randomGenerator(12,false);
	
	
	self._html = "";
	self._custHtml = [];
	self._fragment = null;
	self._id = (Utils.isNull(obj.id)) ? "VL-"+Utils.randomGenerator(24,false) : obj.id;

	self._typeHolder = {
		typeComponent: [],
		typeView: [],
		typeLayout: []
	};

	self._columns = [];
	self._rows = [];

	self._build_order = [];

	self._CustomizerModel = Backbone.Model.extend({
		'attr': "hello"
	});
	self._CustomizerCollection = Backbone.Collection.extend();

	self._buildNodes = [];

	self._container_row = 0;
	self._container_col = [];

	var className = (Utils.isNull(obj.className)) ? "": obj.className;
	if(className ==""){
		className = (Utils.isNull(obj.classes)) ? "": obj.classes;
	}
	var styles = (Utils.isNull(obj.style)) ? "": obj.style;
	if(styles==""){
		styles = (Utils.isNull(obj.styles)) ? "": obj.styles;
	}

	self._props_ = {
		_id: self._id,
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
			_id: self._id,
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

	self._props_._layout_container["default"] = {
		type: "row",
		columns: []
	}

	self._reset = 0;

}
function AppLayout_row(obj,self){
	var currentRow = Utils.randomGenerator(9,false);
	self._props_._current_row_id = currentRow;
	self._props_._layout_container[currentRow] = {
		type: "row",
		obj: obj,
		columns: []
	};
}

function isBuildBody(body){
	var isbody = false;
	if(Array.isArray(body)){
		if(body.length==2){
			if(body[0].includes("@")){
				isbody = true;
			}
		}
	}else{
		isbody = true;
	}


	return isbody;

}
function AppLayout_col(columns,arrayOfItems,obj,self){
	if(!Array.isArray(arrayOfItems)){
		arrayOfItems = [arrayOfItems];
	}else{
		
		
		
		if(isBuildBody(arrayOfItems)){
			arrayOfItems = [arrayOfItems];
		}

	}
	
	var currentRow = self._props_._current_row_id;
	var len = self._props_._layout_container[currentRow].columns.length;
	self._props_._layout_container[currentRow].columns[len] = [
		columns,arrayOfItems,obj,self
	];
}

function AppLayout_build(self){
	
	self._props_._isBuilt = true;
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


function ViewLayoutController_col(columns,arrayOfItems,obj,self){

	obj = (Utils.isNull(obj)) ? {} : obj;

	var colClasses = _getLayoutColumnClasses(columns);
	var viewId = (viewId==null ||veiwId==undefined) ? "" : viewid;
	var cl = (obj.classes==null ||obj.classes==undefined) ? "" : obj.classes;
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
		
		mycomp = buildBody(arrayOfItems[i]);
		
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

		var node = buildBody(arrayOfItems[i],self);
		
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
					
					var view = buildBody(body,obj);
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

		var node = buildBody(arrayOfItems[i],self);
		
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


		if(col=="col"){
			if(colClasses==""){
				colClasses = " col-"+columns[col];
			}else{
				colClasses = colClasses+" col-"+columns[col];
			}	
		}else if(col=="xs" || col=="sm" || col=="md" || col=="lg" || col=="xl"){
			if(colClasses==""){
				colClasses = colClasses+" "+colClasses+"col-"+col+"-"+columns[col]+" ";
			}else{
				colClasses = colClasses+" "+colClasses+"col-"+col+"-"+columns[col]+" ";
			}
		}else if(col.includes("offset")){
			colClasses = colClasses+" "+_sortClassesOffset(col,columns,colClasses);
		}else if(col.includes("visible")){
			colClasses = colClasses+" "+_sortClassesVisible(col,columns,colClasses);
		}else if(col.includes("hidden")){
			colClasses = colClasses+" "+_sortClassesHidden(col,columns,colClasses);
		}else if(col=="d_x_none"){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col=="d_none"){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col=="d_inline"){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col.includes("d_inline_block")){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col=="d_block"){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col.includes("d_table")){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col.includes("d_table_cell")){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col.includes("d_table_row")){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col.includes("d_flex")){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}else if(col.includes("d_inline_flex")){
			colClasses = _sortClassesDisplay(col,columns,colClasses);
		}
	}
	return colClasses;
}

function _sortClassesDisplay(col,columns,colClasses){


	if(col=="d_none"){
		return _displaythis("d-none",colClasses);
	}else if(col=="d_x_none"){
		return _addTogether(columns,col,"d-","-none",colClasses);
	}else if(col=="d_inline"){
		return _addTogether(columns,col,"d-","-inline",colClasses);
	}else if(col=="d_inline_block"){
		
		return _addTogether(columns,col,"d-","-inline-block",colClasses);
	}else if(col=="d_block"){
		
		return _addTogether(columns,col,"d-","-block",colClasses);
	}else if(col=="d_table"){
		
		return _addTogether(columns,col,"d-","-table",colClasses);
	}else if(col=="d_table_cell"){
		
		return _addTogether(columns,col,"d-","-table-cell",colClasses);
	}else if(col=="d_table_row"){
		
		return _addTogether(columns,col,"d-","-table-row",colClasses);
	}else if(col=="d_flex"){
		
		return _addTogether(columns,col,"d-","-flex",colClasses);
	}else if(col=="d_inline_flex"){
		
		return _addTogether(columns,col,"d-","-inline-flex",colClasses);
	}
	
	function _addTogether(columns,col,start,end){
		
		
		
		if(Array.isArray(columns[col])){
			var p = "";
			for(var i=0; i<columns[col].length; i++){
				if(i==0){
					p = start+columns[col][i]+end;
				}else{
					p += " "+start+columns[col][i]+end;
				}
			}

			var r = _displaythis(p,colClasses);
			console.log(r);
			return r;
		}else{
			return _displaythis(start+columns[col]+end,colClasses);
		}
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
	}else{
		if(colClasses==""){
			colClasses = "offset-"+columns[col]+" ";
			
		}else{
			colClasses = " offset-"+columns[col]+" ";
			
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

		if(object._create_element_from_this_object!=undefined && 
			object._create_element_from_this_object!=null && 
			object._create_element_from_this_object==true){

			if(object.body){
				object._body = object.body;
				delete object.body;
			}
			var el = Utils_createELement(object._type,object);

			return el;
		}


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
		
		if(body.charAt(0)=="@" || body.charAt(0)=="#"){
			return _build_from_string(body,self,null,object);
		}else{
			
			var newbody = Utils.convertStringToHTMLNode(body);
			return newbody.cloneNode(true);
		}
	}else 
	if(typeof body === "object"){
		return _build_from_object(body,self,null,object);
	}else 
	if(typeof body === "function"){

		return body();
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
				
				return null;
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
		"view": obj, 
		
		
		"params": params,
		"app": gl_applicationContextManager
	};
	var method = body.slice(1);
	var v = applicationManager.getMethod(method)(paramValues);

	var anyid = applicationManager._application_manager._any_id[method];


	if(anyid!=undefined){
		applicationManager.setAny(anyid,v);
	}

	if(body=='@membershipView:signup:view'){
		
	}

	
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

function _Utils_registerListenerCallbackForSelf(type,selector,func,self,preventDefault,stopPropagation,obj){
	preventDefault = (Utils.isNull(preventDefault)) ? false : preventDefault;
	stopPropagation = (Utils.isNull(stopPropagation)) ? false : stopPropagation;
	var alreadyRegistered = isEventRegistered(selector,self);
	self._props_._events.push({
		selector: selector,
		type: type,
		func: func,
		preventDefault: preventDefault,
		stopPropagation: stopPropagation,
		obj: obj
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

var gl_DEFAULT_FORM_VALUE = "_none_";



var gl_ImageManager = [];



function gl_getFormElementValue(type,selector){
	if(type=='input'){
		var val = $(selector).val();
		return val;
	}else {
		return '';
	}
}
function gl_setFromValue(type,selector,value){
	if(type=='input'){
		$(selector).val(value);
	}
	
}

function gl_handle_event_trigger_onSubmit(type,self,_current_section_id,tag){
	self._props_._form_data[tag].status = 2;
	if(type=='input'){
		
		
		if(_current_section_id==null || _current_section_id==undefined || _current_section_id==false){
			self._props_._initializeValidationAndValues();
			self._props_._form_data[tag].status = 1;
		}else{
			
			setTimeout(function(){
				self._props_._initializeValidationAndValues();
				self._props_._form_data[tag].status = 1;
			},1500);
		}
	}
}
function gl_event_trigger_reset(type,self,tag){
	if(type=='input'){
		self._props_._form_data[tag].status = 0;
	}
}


var App = function(context) {
    
    return new App.init(context);
};


App.init = function( selector , all) {
    this.selector = selector;

	if ( !selector ) {
		return this;
	}

	if(isNode(selector) || isElement(selector)){
		this._element = selector;
	}else if(selector=="body"){
		this._element = document.body;
	}else{
		this._element =  document.querySelectorAll(selector);
	}
	return this;
};
App.post = function(url,data,callback) {
	if(typeof data === "function"){
		callback = data;
		data = null;
	}
	request(url,data,callback,"POST");
};
App.get = function(url,data,callback){
	if(typeof data === "function"){
		callback = data;
		data = null;
	}
	request(url,data,callback,"GET");
};

function request(url,data,callback,type){
    var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(callback!=undefined && callback!=null && typeof callback === "function"){
				callback(this.responseText, this.status, this);
			}
		}
		
	}; 
	var urlParams = "";
	if(data!=undefined && data!=null){
		urlParams = new URLSearchParams(data).toString();
	}

	if(type=="POST"){
		xhttp.open(type, url, true);
		
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
		xhttp.send(urlParams);
	}else{
		if(urlParams=="") urlParams = "?"+urlParams;
		
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
		xhttp.open(type, url+urlParams, true);
		xhttp.send();
	}
}

App.init.prototype.print = function(contents) {
	var self = this;
	_activateNodeList(this._element,function(node){

	},self);
     console.log(contents);
};
App.init.prototype.append = function(element){
	var self = this;
	_activateNodeList(this._element,function(node){
		if(typeof element === 'string' && element.trim()!="body"){
			element = Utils.convertStringToHTMLNode(element);
		}
		node.appendChild(element);
	},self);
	return this;
};
App.init.prototype.attr = function(param,value){
	var self = this;
	_activateNodeList(this._element,function(node){
		node.setAttribute(param, value);
	},self);
	
	return this;
};
App.init.prototype.click = function(callback) {
	var self = this;
	self.on('click',callback);
    return this;
};
App.init.prototype.on = function(event, callback) {
	var self = this;
	self._method = function(e){ 
		self.preventDefault = function(){
			e.preventDefault();
		}
		self.target = e;
		callback(self); 
	}
	self._type = event;

	_activateNodeList(self._element,function(node){
		node.addEventListener(self._type, self._method);
	},self);
	
    return this;
};
App.init.prototype.removeListener = function() {
	var self = this;
	_activateNodeList(this._element,function(node){
		if(self._method!=undefined && self._type!=undefined)
				node.removeEventListener(self._type, self._method);
	},self);
    return this;
};
App.init.prototype.css = function(propName,val) {
	var self = this;

	_activateNodeList(this._element,function(node){
		if(val==undefined && typeof propName === 'object'){
			var style = "";
			for(prop in propName){
				style = style + prop +":"+ propName[prop] + ";";
			}
			node.setAttribute("style",style);
		}else{
			node.setAttribute(propNamm,val);
		}
	},self);

    return this;
};

App.init.prototype.addClass = function(val){
	var self = this;
	_activateNodeList(this._element,function(node){
		node.classList.add(val);
	},self);
	
	return this;
};
App.init.prototype.removeClass = function(val){
	var self = this;
	_activateNodeList(this._element,function(node){
		node.classList.remove(val);
	},self);
	
	return this;
};


App.init.prototype.hasClass = function(val){
	var self = this;

	for (i = 0; i < myNodelist.length; i++) {}

	if(this._element.length > 0){
		return this._element[0].classList.contains(val);
	}else{
		return false;
	}

	
};
App.init.prototype.html = function(html){
	var self = this;
	if(html==undefined){
		return this._element;
	}else{
		_activateNodeList(this._element,function(node){
			node.innerHTML = html;
		},self);
	}
	return this;
};
App.init.prototype.htmlAsStringCopy = function(selector){
	var self = this;
	var str = "";
	_activateNodeList(this._element,function(node){
		str = str+""+Utils.convertFragmentToHTMLText( node.cloneNode(true) );
	},self);
	
	return str;
};
App.init.prototype.empty = function(){
	var self = this;
	_activateNodeList(this._element,function(node){
		while (node.firstChild) {
			node.removeChild(this._element.lastChild);
		} 
	},self);
	

	return this;
};

App.init.prototype.flash = function() {
	var self = this;
	_activateNodeList(this._element,function(node){

	},self);
    document.body.style.backgroundColor = '#ffc';
    setInterval(function() {
        document.body.style.backgroundColor = '';
    }, 5000);
    return this;
};

function _activateNodeList(myNodelist,cb,self){

	if(isNode() || isElement(myNodelist)){
		return cb(myNodelist);
	}
	for (i = 0; i < myNodelist.length; i++) {
		
		cb(myNodelist[i]);
	}
}

function isNode(o){
  return (
    typeof Node === "object" ? o instanceof Node : 
    o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
  );
}


function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : 
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}
function _addAppElementToList(self){

}


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

	this._props_._handle_hash = "";

	this._props_._application_config = config;

	this.Pages = this._props_._Pages;
	this.Manager = this._props_._ApplicationManager;
	this.factory = this._props_._ComponentFactory;
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

	setHash: function(hash){
		this._props_._handle_hash = hash;
	},

	getHash: function(){
		return this._props_._handle_hash;
	},

	setExtensions: function(extension){
		this._props_._segmented_plugins = extension;
	},

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


var _main_includes = {};
var _main_includes_html = {};

/** 
* @exports Include
* 
* @param prop {string} - the ContainerComponent to return, this is an empty container component
* being returned and then when the container is added to the DOM the html will be
* added by calling addComponent.
* @param get_html {boolean} - get just the html
* @classdesc A component that handles.
*/
function AFInclude(prop,get_html){
	if(get_html)
		return _main_includes_html[prop];
	else
		return _main_includes[prop];
}

window.Include = AFInclude;

function initializeApplication(isClient,activePlugin,self){

	window.AppDialog = componentFactory.dialog();
	window.AppFactoryDialog = componentFactory.dialog();
	window.Brick = Brick;
	window.AFBrick = Brick;

	var config_appfac = self._props_._application_config;
	var plugins = self._props_._application_plugins;
	var baseUrl = self._props_._baseUrl;

	if(self._props_._application_config['application']['prod']==false){
		
	}

	if(isClient==false){
		
		_start_admin_app();
		return;
	}

	var app = self;

	var admin_active_theme = config_appfac['application']['admin-active-theme'];

	var client_plugin_config = config_appfac['application']['client-active-theme'];
	var client_active_plugin = client_plugin_config.split("|")[0];
	var client_active_theme = client_plugin_config.split("|")[1];

	if(config_appfac['includes']){
		for(prop in config_appfac['includes']){
			_main_includes[prop] = self.factory.container();
		}
	}


	var _count = 0;
	var _size = 0;

	setTimeout(function(){
		if(config_appfac['includes']){
			for(prop in config_appfac['includes']) _size++;

			for(prop in config_appfac['includes']){
				var filepath = config_appfac['includes'][prop];
				_xyzABC(filepath,prop);
			}
			
			if(_count == 0) _start_app();
		}else{
			_start_app();
		}	
	},50);

	function _xyzABC(filepath,prop){
		_callRequest(filepath,function(result){
			_main_includes[prop].addComponent(result);
			_main_includes_html[prop] = result;
			_count++;

			if(_size == _count){
				_start_app();
			}
		});
	}

	function _start_app(){

		var url = "plugins/"+client_active_plugin+"/plugin.config.json";
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
				if(clientthemes[i].directory==client_active_theme){
					clientactivetheme = clientthemes[i];
					break;
				}
			}

			if(clientactivetheme!=null){
				
				for (var i = 0; i < clientactivetheme.head.length; i++) {
					$('head').append(clientactivetheme.head[i]);
				}

				
				if(clientactivetheme.sass){
					if(clientactivetheme.sass.link!=undefined){
						$('head').append(clientactivetheme.sass.link);
					}				
				}
			}

		});

	}

	function _start_admin_app(){

		var admin_plugin_config = config_appfac['application']['client-active-theme'];
		var admin_active_plugin = admin_plugin_config.split("|")[0];
		var admin_active_theme = admin_plugin_config.split("|")[1];

		var url = "../../plugins/"+admin_active_plugin+"/plugin.config.json";
		$.getJSON( url, function( pluginconfig ) {

			var clientactivetheme = null;
			var clientthemes = pluginconfig['admin-themes'];

			for (var i = 0; i < clientthemes.length; i++) {
				if(clientthemes[i].directory==admin_active_theme){
					clientactivetheme = clientthemes[i];
					break;
				}
			}

			if(clientactivetheme!=null){
				
				if(clientactivetheme.head){
					for (var i = 0; i < clientactivetheme.head.length; i++) {
						$('head').append(clientactivetheme.head[i]);
					}
				}

				
				if(clientactivetheme.sass){
					if(clientactivetheme.sass.link!=undefined){
						$('head').append(clientactivetheme.sass.link);
					}				
				}
			}

		});

	}

}

function _callRequest(filePath,callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
			callback(xhttp.responseText,xhttp);
	    }
	};
	xhttp.open("GET", filePath, true);
	xhttp.send();
}

function a1(configFile){
	return new Promise(resolve => {
		var rawFile = new XMLHttpRequest();
    	rawFile.open("GET", configFile, false);
    	rawFile.send(null); 
    	resolve(rawFile.responseText)
	});
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


var GetApp = function(obj){
	if(obj.app!=undefined && obj.app!=null){
		return obj.app;
	}else{
		return obj;
	}
};


window.AFIsApp = function(obj){
	return GetApp(obj);
};

window.GetApp = GetApp;

window.AFGetLoadedConfiguration = GetLoadedConfiguration;

window.AFLoadConfiguration = LoadConfiguration;

window.App = App;

window.RegisterAppFactoryPlugin = registerAppFactoryPlugin;

window.ApplicationContextManager = ApplicationContextManager;



window.ApplicationExtensions = ApplicationExtensions;

return ApplicationContextManager;


})); 

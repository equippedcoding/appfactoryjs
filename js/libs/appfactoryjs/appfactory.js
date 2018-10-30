/**
* @overview {@link AppFactory} {@link Utils} {@link ApplicationManager}
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
* @license BSD-2-Clause
* @version 0.0.1 
*/
(function (root, factory) {             
	/*global define*/
	if (typeof define === 'function' && define.amd) {
		define(['jquery','backbone','bootstrap'], factory); // AMD
	} else if (typeof module === 'object' && module.exports) { 
		module.exports = factory(); // Node
	} else {
		root.appfactory = factory(); // Browser
	}
}(this, function ($,Backbone,bootstrap) {    


// cd C:\ws\template\js\libs\appfactoryjs
// jsdoc -c jsdoc.json -u tutorial appfactory.js
// http://appfactoryjs.equippedcoding.net/js/libs/appfactoryjs/out/
// or
// http://localhost/template/js/libs/appfactoryjs/out/

// macos
// cd /Applications/XAMPP/xamppfiles/htdocs/template/js/libs/appfactoryjs/
// npx jsdoc -c jsdoc.json -u tutorial appfactory.js

// 9999 - components
// 0000 - implemention
// 4444 - needs adjustments
// 2222 - Utils

/*

// First default the incoming object
obj = (Utils.isNull(obj)) ? {} : obj;

// extend any necassary classes
_.extend(this,
	new AppFactoryManager('FormComponent'), 
	new ComponentManager(Flags.Type.component,this), 
	new EventManager(this)
);

// register this component
applicationManager.register(this);

// give component unique id
//this._props_._id = "d-"+Utils.randomGenerator(12,false);

// add this.getId() to component element id
var topComponentElement = Utils.createElement({ id:this.getId() });

// add this at end of constructor
applicationManager.setComponent(this);
*/


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


// 9999
/** @exports ApplicationManager
* @classdesc The ApplicationManager runs the application life cycle.
* @class
* @constructor
* @tutorial GettingStarted
*/
function ApplicationManager(stateManager,sessionManager){
	_.extend(this, new AppFactoryManager('ApplicationManager'));
	var rootElement = document.createElement('div');
	rootElement.id = "root-element";
	//rootElement.className = "container";
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

	/**
	* Starts the application life cycle. Must be called before 
	* running any application code.
	*/
	init: function(callback,param){
		if(typeof callback === "function"){
			ApplicationManager_start(callback,this);
		}else if(typeof callback === "boolean" && callback==true){
			ApplicationManager_start(param,this);
			pages.init();
			pages.render();
		}
	},  

	/**
	*
	*/
	register: function(id,method){
		if(!Utils.isNull(method)){
			this._application_manager._methods[id] = method;
		}else{
			this._application_manager._components.push({id: id.getId(), component: id});
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
	*
	*/
	setAny: function(id,any){
		this._application_manager._any[id] = any;
	},

	/**
	*
	*/
	getAny: function(id){
		return this._application_manager._any[id];
	},	

	/**
	*
	*/
	getComponents: function(){
		return this._application_manager._components;
	},

	getComponent: function(tag){
		return this._application_manager._componentElements[tag];
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




// 9999
/** @exports SessionManager
* @classdesc The SessionManager handles user session.
* @class
* @constructor
*/
function SessionManager(){
	_.extend(this, new AppFactoryManager('SessionManager'));

}
SessionManager.prototype = {};



// 9999
/** @exports StateManager
* @classdesc The SessionManager handles the state of the application.
* @class
* @constructor
*/
function StateManager(){
	_.extend(this, new AppFactoryManager('StateManager'));
	//this._props_ = {
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

		// layout mapper component,mapper component... 
		// @layout #mapper @component,#mapper @component...
		//stateManager.mapRoute(layout);
		if(route=="") route = "_NOT_SET_";
		this._state_manager._map_layout[route] = layout;

	},
	// layout mapper component,mapper component, mapper component
	getMapRoute: function(route,mapper){
		if(route=="") route = "_NOT_SET_";
		var layout = this._state_manager._map_layout[route];

		if(Utils.isNull(layout)) return null;
		layout = layout.split(' ');
		// remove layout param
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
		if(Utils.isNull(trigger)){
			trigger = true;
		}
		this.getRouter().navigate(path, {trigger: trigger});
	},

	/**
	* 
	*/
	addRoute: function(rout,method){
		this._state_manager._routes[rout] = method;  
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



/* Components */
// 9999
/** @exports ComponentManager
* @classdesc The ComponentManager is the top component that every other component inherits from.
* @class
* @constructor
*/ // 1111
function ComponentManager(type,context){
	_.extend(this, new AppFactoryManager('ComponentManager'));
	context.TYPE = type;
	var self = this;
	this._props_ = {
		_application_manager: applicationManager,
		_id: Utils.randomGenerator(16,false),
		_componentName: type,
		_extensionObject: [],
		_events: [],
		_body: null,

		_isEventsActive: false,
		_uniqueId: "id_"+Utils.randomGenerator(12,false),

		// data object thats passed through to an event
		// the object can be anything that the component
		// wants, the user just has to know what to expect
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







// 9999
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

	// var collection = new ViewCollectionController("#app-factory-container");
	// this._props_._collection = collection;

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



// 9999
/** @exports ViewManager
* @classdesc A component that handles multiple components with in one view.
* @class
* @constructor
*/
function ViewManager(opt){
	//ComponentManager.call(this,arguments);
	_.extend(this, 
		new AppFactoryManager('ViewManager'), 
		new ComponentManager(Flags.Type.view,this),
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
	
	var component_container = new ContainerComponent({
		id: self._props_._id,
		body: ""
	});

	self._props_._current_view = null;
	self._props_._component_containers = {};
	self._props_._component_containers['parent'] = component_container;
	self._props_._component_containers['children'] = {};
	self._props_._options = opt;
	self._props_._obj = {};

	self.getHtml = function(){
		return this._props_._component_containers.parent.getHtml();
	};
}
ViewManager.prototype = {

	/**
	* Render the view
	*/
	render: function(id,trigger){
		ViewManager_render(id,trigger,this);
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
		// 1111
		var self = this;
		var opt = self._props_._options;
		if(opt.routable==true && Utils.isNull(obj.route)){
			opts.route = opts.id;
		}


		var component_container = new ContainerComponent({
			body: opts.body
		});

		self._props_._component_containers['children'][opts.id] = {
			container: component_container,
			options: opts
		};

		if(opts.init!=undefined && opts.init==true){
			self._props_._component_containers.parent.addComponent(
				self._props_._component_containers['children'][opts.id].container,
				true);
		}
		return this;
	}



};






// 9999
/** @exports LayoutManager
* @classdesc A compoment that handles the layout of components.
* @class
* @constructor
*/
function LayoutManager(){
	//ComponentManager.call(this,arguments);
	_.extend(this, new AppFactoryManager('LayoutManager'));

}
LayoutManager.prototype = {

	/**
	* Layout Component
	* @return {AppLayout} 
	* @see AppLayout
	*/
	newLayout: function(obj){
		return new AppLayout(obj);
	}
};



// 9999
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


	//applicationManager.register(this);
	obj = (Utils.isNull(obj)) ? {} : obj;
	//this.TYPE = GL_TYPES.layout;
	this.ID = "d-"+Utils.randomGenerator(12,false);
	
	//ALL_COMPONENTS[ALL_COMPONENTS.length] = {id:this.ID,component:this};
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
			_classes: (Utils.isNull(obj.classes)) ? "": obj.classes,
			_styles: (Utils.isNull(obj.styles)) ? "": obj.styles
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

	// applicationManager.register(this);

	this.getHtml = function(){
		return AppComponent_getHtml_layout_fragment(self);
	};

}
AppLayout.prototype = {
		/**
	* Adds a bootstrap columne class div element to the layout.
	* @param {Object} columns - lg,md,sm,xs offset
	* @param {Array} arrayOfItems - an array of ViewComponentControllers, ViewCollectionControllers and/or other ViewLayoutControllers
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


// 9999
/** @exports ComponentFactory
* @classdesc A top-level component that handles all other components except ViewManager component and AppLayout component.
* @class
* @constructor
*/
function ComponentFactory(){
	// _.extend(this, new AppFactoryManager('ComponentFactory'));
	

}
ComponentFactory.prototype = {

	/**
	*
	*/
	stub: function(opts){},

	/**
	*
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
	* BrickComponent
	*/
	brick: function(obj){
		return new BrickComponent(obj);
	},

	/**
	*
	*/
	navigation: function(obj){
		return new NavigationComponent(obj);
	},

	/**
	*
	*/
	html: function(obj){
		
	},

	/**
	*
	*/
	form: function(obj){
		return new FormComponent(obj);
	},


};






// var form = cm.form({
// 	id: "",
// 	className: ""
// });
// form.addInput({
// 	layout: "",
// 	label: "",
// 	paramName: "",
// 	focusout: function(obj){

// 	},
// 	focusin: function(obj){

// 	},
// 	keyup: function(obj){

// 	},
// 	keydown: function(obj){

// 	},
// 	listener: {
// 		type: 'keydown|keyup|focusin|focusout',
// 		function(obj){

// 		}
// 	},
// 	validation: {
// 		required: {
// 			error: "",
// 			success: ""
// 		},
// 		min: {
// 			number: 5,
// 			error: "",
// 			success: ""
// 		},
// 		max: {
// 			number: 15,
// 			error: "",
// 			success: ""
// 		},
// 		characters: {
// 			except: [],
//			special: [true,'']
// 			error: "",
// 			success: ""
// 		}
// 	}
// });
// form.onSubmit(function(obj){

// });
// form.build();


// 9999
function FormElement(){

}
FormElement.prototype = {

};

// 9999
function FormEventsHandler(obj,formElement,self){
	FormEventsHandler_constructor(obj,formElement,self,this);

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
FormEventsHandler.prototype = {
};


// 9999
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

// 9999
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

	FormComponent_constructor(obj,this);

	this.getHtml = function(){
		return this._props_._elements._container;
	};

	applicationManager.setComponent(this);
}

FormComponent.prototype = {

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
	* Builds the form. Must be called before form can be used.
	*
	*/
	build: function(){
		FormComponent_build(this);
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


// 1212
function FormComponent_addRadioButtonGroup(opts,self){
	var formElement = new FormComponentDefaults(opts,self);
	var tag = formElement.tag;

	var createElement = Utils.createElement;
	var topDiv = createElement();
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
			div.appendChild(btn);
			div.appendChild(label);
			topDiv.appendChild(div);
		}// end of loop


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


// <div class="form-check">
//   <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked>
//   <label class="form-check-label" for="exampleRadios1">
//     Default radio
//   </label>
// </div>
// <div class="form-check">
//   <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2">
//   <label class="form-check-label" for="exampleRadios2">
//     Second default radio
//   </label>
// </div>
// <div class="form-check">
//   <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios3" value="option3" disabled>
//   <label class="form-check-label" for="exampleRadios3">
//     Disabled radio
//   </label>
// </div>


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
	// _Utils_registerListenerCallbackForSelf("focusout",formElement.selector,function(b){
	// 	initializeValidationAndValues();
	// },self,true);

	function initializeValidationAndValues(){
		var validation = new FormValidationDefaults(opts.validation);
		for(var i = 0; i<storedCheckboxes.length; i++){
			var checkbox = storedCheckboxes[i].checkbox;
			var formEl = storedCheckboxes[i].formElement;
			var paramName = formEl.name;
			var selector = formEl.selector;
			//console.log(paramName);
			if ($(selector).is(":checked")){
				self._props_._values[paramName] = checkbox.value;
			}else{
				self._props_._values[paramName] = formEl.defaultValue;
			}
		}
	}


	// inline: true,

	// Surround rows with div's to contain them
	// and create columns with css grid layout.
	// !This DOES NOT actual create rows, this
	// must be done through own css styles. This
	// overrides the inline option.
	// rows: 4,

	// label: "Select what you want?",

	// // Group these checkbox values into an object with the given name
	// intoObject: "name_of_object",

	// //required: "<p style='color:red;'>This is required!</p>",
	// // or
	// required: {
	// 	min: 2,
	// 	message: ""
	// },
	// checkboxes: [
	// 	{	
	// 		label:"One",
	// 		value:"1",
	// 		name: "hello1",
	// 		defaultValue: "NOT",
	// 		// Have this checkbox checked by default
	// 		checked: true,
	// 		listener: {
	// 			type: "click",
	// 			callback: function(){
	// 				//alert("hello James Dog");
	// 			}
	// 		}
	// 	},
	// 	{	
	// 		label:"Two",
	// 		value:"2",
	// 		name: "hello2"
	// 	}
	// ]

	//var formElement = new FormComponentDefaults(opts,self);
	//var compContainer = new ContainerComponent({body:layoutContainer});
	self._props_._form_data[tag] = {
		paramName: formElement.paramName,
		component: compContainer,
		type: 'checkbox',
		formElement: formElement,
		status: 0,
		statusId: statusId,
		isValid: true
	};
	//self._props_._values = val
	//compContainer.listenTo(form_handler, event_trigger_submit, func) 
	//compContainer.listenTo(form_handler, event_trigger_reset, func)


// <div class="form-check">
//   <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
//   <label class="form-check-label" for="defaultCheck1">
//     Default checkbox
//   </label>
// </div>
// <div class="form-check">
//   <input class="form-check-input" type="checkbox" value="" id="defaultCheck2" disabled>
//   <label class="form-check-label" for="defaultCheck2">
//     Disabled checkbox
//   </label>
// </div>



}


// 9999
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

	if(Utils.isNull(opts)){
		opts = {};
	}

	var self = this;

	var id = self.getId();//(opts.id==undefined) ? Utils.randomGenerator(12,false) : opts.id;
	var selector = (opts.selector==undefined) ? "#"+id : opts.selector;
	var label = (opts.label==undefined) ? "" : opts.label;
	var style = (opts.style==undefined) ? "" : opts.style;
	var className = (opts.className==undefined) ? "" : opts.className;

	var button = Utils.createElement({
		el: 'button',
		innerHTML: label,
		id: id,
		style: style,
		className: className
	});

	if(!Utils.isNull(opts.listener) && typeof opts.listener==="function"){
		var func = opts.listener;
		opts.listener = {
			type: 'click',
			selector: selector,
			func: func
		};
	}else if(!Utils.isNull(opts.callback)  && typeof opts.callback==="function" ){
		var func = opts.callback;
		opts.callback = {
			type: 'click',
			selector: selector,
			func: func
		};
	}

	_Utils_registerListenerCallback(opts,self);

	this.getHtml = function(){
		return button;//defaultBody.getHtml();
	};

}
ButtonComponent.prototype = {

};


// 9999
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
	//this.TYPE = GL_TYPES.component;
	self._props_._componentName = "ContainerComponent";
	//self._props_._id = (obj.id) ? obj.id : "ContainerComponent-"+Utils.randomGenerator(12,false);
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

	this.getHtml = function(route){
		return AppComponent_getHtml_component_fragment(self,route);
	}


}
ContainerComponent.prototype = {


	/**
	* Adds a component to this component
	*
	* @param {ComponentManager} component
	* @param {Boolean} empty
	*/
	addComponent: function(component,empty){
		return ContainerComponent_addComponent(component,empty,this);
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


// 9999
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

// 9999
function EventManager(self){
	_.extend(this, Backbone.Events);

}
EventManager.prototype = {
	addEventListener: function(){}
};


// 9999
/** @exports BrickComponent
* @classdesc A top-level component that.
* @class
* @constructor
*/
function BrickComponent(obj){
	var self = this;
	_.extend(this, 
		new AppFactoryManager('BrickComponent'), 
		new ComponentManager(Flags.Type.component,this), 
		new EventManager(this)
	);
	applicationManager.register(this);
	this.ID = "d-"+Utils.randomGenerator(12,false);

	this._props_._own_types = ["el","children","listener","label","attr"];
	this._props_._blocks = [];
	this.getOwnTypes = function(){
		return this._props_["_own_types"];
	};

	this.getHtml = function(){
		return self._props_._elements._fragment.cloneNode(true);
	}

			this._props_._registry_children = {};
		this._props_._registry_elements = {};
		this._props_._registry_roots = [];

}
BrickComponent.prototype = {

		// 	var brick = cm.brick();
		// //console.log("1");
		// var sharedLinkAttr = brick.createAttributes({"el":"a","href":"#"});
		// //console.log("2");
		// var sharedAttr = brick.createAttributes({});
		// //console.log("3");
		// brick.newElement('id1',{ label: "Home", attrs: sharedLinkAttr});
		// //console.log("4");
		// brick.newElement('id2',{ label: "Email", attrs: sharedLinkAttr, listener: func });
		// //console.log("5");
		// brick.newElement('id3',{
		// 	el: 'div',
		// 	children: ["id1","id2"]
		// });
		// //console.log("6");
		// brick.newElement('id4',{});
		// //console.log("7");
		// brick.newElement('id5',{
		// 	children: ["id3","id5"]
		// });
		// //console.log("9");
		// //brick.build();
		// //console.log("10");
		// //console.log(brick);
		// //console.log(brick.getHtml());

	build: function(){
		var self = this;
		var fragment = document.createDocumentFragment();
		var blocks = self._props_._blocks;




		var children = self._props_._registry_children;
		for (var p in children) {
			for (var i = 0; i < children[p].length; i++) {
				var parent = children[p][i];

				//console.log(self._props_._registry_elements[parent].el);
				//console.log(self._props_._registry_elements[p].el);
				self._props_._registry_elements[parent].el
				.appendChild(self._props_._registry_elements[p].el);
			}
		}

		var fragment = document.createDocumentFragment();
		for(var p in self._props_._registry_elements){
			if(Utils.isNull(self._props_._registry_children[p])){
				fragment.appendChild(self._props_._registry_elements[p]);
			}	
		}





		// self._props_._blocks.push({
		// 	id: obj1,
		// 	el: element,
		// 	children: obj.elementTypes.children
		// });

		// function getParentELements(id){
		// 	var parents = [];
		// 	for(var i=0; i<blocks.length; i++){
		// 		var myBlock = blocks[i];
		// 		var children = myBlock.children;
		// 		for(var n=0; n<children.length; n++){
		// 			if(children[n]==id){
		// 				parents.push(myBlock);
		// 			}
		// 		}
		// 	}
		// 	return parents;
		// }


		// for(var i=0; i<blocks.length; i++){
		// 	var block = blocks[i];
		// 	_setup1(block);

		// }
		// function _setup1(block){
		// 	var thisElement = block.el;
		// 	var id = block.id;
		// 	var parents = getParentELements(id);
		// 	// console.log("***********************************************************");
		// 	// console.log(id);
		// 	// console.log(parents);
		// 	if(parents.length > 0){
		// 		for(var x=0; x<parents.length; x++){
		// 		     console.log(parents[x]);
		// 			console.log(thisElement);
		// 			parents[x].el.appendChild(thisElement);
		// 		}
		// 	}
		// }
		// for(var i=0; i<blocks.length; i++){
		// 	var block = blocks[i];
		// 	var thisElement = block.el;
		// 	var id = block.id;
		// 	var parents = getParentELements(id);
		// 	if(parents.length == 0){
		// 		fragment.appendChild(thisElement);
		// 	}
		// 	//console.log(fragment);
		// }
		// // 1111
		// self._props_._elements._fragment = fragment;

		// console.log(fragment);

		// function appendRootElements(){
		// 	for(var i=0; i<blocks.length; i++){  
		// 		var id = blocks[i].id;
		// 		var element = blocks[i].el;
		// 		var isRootElement = isChildOfAnotherElement(id);
		// 		if(isRootElement){
		// 			fragment.appendChild(element);
		// 		}
		// 	}
		// }
		

		// function isChildOfAnotherElement(id){

		// 	for(var i=0; i<blocks.length; i++){
		// 		var myId = blocks[i].id;
		// 		if(myId!=id){
		// 			var children = blocks[i].children;
		// 			for(var n=0; n<children.length; n++){
					
		// 			}
		// 		}
		// 	}
		// }

	},

	addEventListener: function(listener){

	},

	createAttributes: function(obj){
		return new ElementAttributes(obj);
	},

	stack: function(obj1,obj2){

		// this._props_._registry_children = {};
		// this._props_._registry_elements = {};
		// this._props_._registry_roots = [];


		// var self = this;
		// var attrs = (Utils.isNull(obj2.attrs)) ? new ElementAttributes({}) : obj2.attrs;
		// attrs = attrs.getAttributes();

		// // register in all elements;
		// self._props_._registry_elements[obj1] = obj2;

		// // register its children
		// registerChildren();


		// var children = self._props_._registry_children;
		// for (var p in children) {
		// 	for (var i = 0; i < children[p].length; i++) {
		// 		var parent = children[p][i];
		// 		self._props_._registry_elements[parent].el
		// 		.appendChild(self._props_._registry_elements[p].el);
		// 	}
		// }







		// this._props_._container = document.createElement('div');

		// function registerChildren(){
		// 	if(!Utils.isNull(obj2.children)){
		// 		var children = obj2.children;
		// 		_register_children(children)
		// 	}else if(!Utils.isNull(attrs.children)){
		// 		var children = attrs.children;
		// 		_register_children(children);
		// 	}
		// 	function _register_children(children){
		// 		for (var i = 0; i < children.length; i++) {
		// 			var child = children[i];
		// 			if(!Utils.isNull(self._props_._registry_children[child])){
		// 				self._props_._registry_children[child].push(obj1);
		// 			}else{
		// 				self._props_._registry_children[child] = [obj1];
		// 			}
		// 		}
		// 	}
		// }



	},

	newElement: function(obj1,obj2){
		var self = this;

		var element_attr = {};
		var element_opts = {};

		registerChildren();

		var highAttrs2 = removeOwnTypes(obj2);
		var highAttrsET = highAttrs2.elementTypes;
		var highAttrsOT = highAttrs2.ownTypes;
		if(!Utils.isNull(obj2.attr)){
			var attr = obj2.attr.getAttributes();
			var lowAttrs2 = removeOwnTypes(attr);
			var lowAttrsET = lowAttrs2.elementTypes;
			var lowAttrsOT = lowAttrs2.ownTypes;
			for(var p in lowAttrsET){
				if(Utils.isNull(highAttrsET[p])){
					if(p!="attr")
						highAttrsET[p] = lowAttrsET[p];
				}
			}
			element_attr = highAttrsET;
			for(var p in lowAttrsOT){
				if(Utils.isNull(highAttrsOT[p])){
					if(p!="attr")
						highAttrsOT[p] = lowAttrsOT[p];
				}
			}
			element_opts = highAttrsOT;
		}else{
			element_attr = highAttrsET;
			element_opts = highAttrsOT;
		}
		var type = (Utils.isNull(element_opts.el)) ? "div" : element_opts.el;
		element = Utils.createELement(type,element_attr);
		element.innerHTML = (Utils.isNull(element_opts.label)) ? "" : element_opts.label;

		if(Utils.isNull(element_opts.children)){
			element_opts.children = [];
		}

		// self._props_._blocks.push({
		// 	id: obj1,
		// 	el: element,
		// 	children: element_opts.children
		// });

		console.log(element);

		self._props_._registry_elements[obj1] = { el: element };
		function removeOwnTypes(obj){
			var tmp1 = {};
			var tmp2 = {};
			var ownTypes = self._props_._own_types;
			for(var p in obj){
				var isOwnType = false;
				for(var i=0; i<ownTypes.length; i++){
					if(p==ownTypes[i]){
						tmp2[p] = obj[p];
						isOwnType = true;
						break;
					}
				}
				if(!isOwnType){
					tmp1[p] = obj[p];
				}
			}
			return {
				ownTypes: tmp2,
				elementTypes: tmp1
			};
		}


		function registerChildren(){
			var attrs = (Utils.isNull(obj2.attrs)) ? new ElementAttributes({}) : obj2.attrs;
			attrs = attrs.getAttributes();
			if(!Utils.isNull(obj2.children)){
				var children = obj2.children;
				_register_children(children)
			}else if(!Utils.isNull(attrs.children)){
				var children = attrs.children;
				_register_children(children);
			}
			function _register_children(children){
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					if(!Utils.isNull(self._props_._registry_children[child])){
						self._props_._registry_children[child].push(obj1);
					}else{
						self._props_._registry_children[child] = [obj1];
					}
				}
			}
		}



		return this._event_manager;


	}




};


// 9999
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
	//this._props_._id = "NavigationComponent-"+Utils.randomGenerator(16,false);

	var self = this;
	obj = (obj) ? obj :{};
	//self.TYPE = Flags.Type.component;
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
 	// options
 	self._props_._nav_type = (obj.type==undefined) ? 1 : obj.type;
 	self._props_._container_class = "mycontainer";
 	self._props_._closable = (obj.closable==undefined) ? false : obj.closable;
 	self._props_._current_view = null;
 	self._props_._container_main_class = (obj.container==undefined) ? "container" : obj.container;

 	this.build = function(){
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

 	};

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



	newSubView: function(obj){
		var self = this;
		var id = obj.id;
		var defaultBody = new ContainerComponent({ body: "<div></div>" });

		// set defualts
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

		//console.log(obj);
		//_Utils.registerListenerCallback(obj,this);

	}
};


function _navigation1(self,view){

	/*
	<div id="mySidenav" class="sidenav">
	  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
	  <a href="#">About</a>
	  <a href="#">Services</a>
	  <a href="#">Clients</a>
	  <a href="#">Contact</a>
	</div>

	<div id="main">
  	...
	</div>
	*/

	var defaultBody;

	var container = Utils.createElement({});

	//var container_main = Utils.createElement({id: self._props_._container_id});
	// container_main.id = self._props_.view_id;
	self._props_._container.className = self._props_._container_class;//"container";
	self._props_._container.style = "margin-left:250px";

	self._props_._container_main = Utils.createElement({className: self._props_._container_main_class });
	self._props_._container_main.appendChild(view.getHtml());
	self._props_._container.appendChild(self._props_._container_main);

	// document.getElementById("mySidenav").style.width = "250px";
 //     document.getElementById("main").style.marginLeft = "250px";
	
	//self._props_._container.appendChild(view.getHtml());

	var container_nav = Utils.createElement({ id:"mySidenav", className: "appfactory-sidenav" });

	//<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
	//console.log(self._props_._opts.closable);
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
		//console.log(page)
			
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
	//this._props_._body._id = (isNull(obj.bodyId)) ? Support.Utils.randomGenerator(9,false) : obj.bodyId;
	
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
	

	// Nav want hide
	if(sticky){
		containerClasses = "sidenav-nohide "+(isNull(obj.classes)) ? "" : obj.classes;
		self._props_._elements._body.id = "appfactory-main-container-content-nohide";
		//console.log("containerClasses1: "+containerClasses);
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
			//a.onclick = function(){ self.close(); }

			

			self._props_._elements._container.appendChild(a);

			registerListenerCallbackForSelf(self,"click",a.id,function(){
				self.close();
			});
		}
		

		//console.log("containerClasses2: "+containerClasses);
	}

	self._props_._body_id = self._props_._elements._body.id;

	//console.log("containerClasses: "+containerClasses);

	self._props_._elements._container.className = "side_nav "+containerClasses;
	//this._props_._elements._container.style = "background-color:white;";


	self._props_._collection = new ViewCollectionController("#"
		+self._props_._elements._body.id);

	self._props_._elements._fragment.appendChild(this._props_._elements._container);
	self._props_._elements._fragment.appendChild(this._props_._elements._body2);
}




///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////





// 9999
/** 
* @exports ContentManagementSystem
*/
var ContentManagementSystem = {

	/**
	*	Users
	* @see CMSUsers
	*/
	Users: function(){

	},

	/**
	*	Manager
	* @see CMSManager
	*/
	Manager: function(){}
};


// 9999
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

// 9999
/** @exports CMSManager
* @classdesc A component that handles multiple components with in one view.
* @class
* @constructor
*/
function CMSManager(){

}
CMSUsers.prototype = {


}



// 2222
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
		//if ((file = this.files[0])) {
	          img = new Image();
	          img.onload = function () {
	             console.log(this.width + " " + this.height);
	             obj['width'] = this.width;
	             obj['height'] = this.height;
	             callback(obj);
	          };
	         	img.src = _URL.createObjectURL(file1);
		//}

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
	calculateAge: function(birthday) { // birthday is a date object
	    var ageDifMs = Date.now() - birthday.getTime();
	    var ageDate = new Date(ageDifMs); // miliseconds from epoch
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
		var content = d.replace(/(\r?\n|\r)+/, '');//.trim(); (\r?\n|\r)+$/
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
	* Determins if an array has duplicates.
	*
	* @param {Number} - bytes
	* @param {Number} - maxSize
	* @return {Object} - size:String|isOver:boolean
	*/
	validateFileByteSize: function(bytes,maxSize){
		return Utils_validateFileByteSize(bytes,maxSize);
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
	* fileSizeLimit
	*
	*/
	fileSizeLimit: function(e,element,limit,sizeToBigAlert){
		var totalSize = 0;
		var input = document.getElementById(element);
		var size;
		if(totalSize==0){
			size = Utils.validateFileByteSize(input.files[0].size,limit);
		}else{
			size = Utils.validateFileByteSize(totalSize,limit);
		}
		//var size = Support.Utils.validateFileSize("email-file-attachment","22 mb");
		//console.log(size);
		if(size["isOver"]){
			e.preventDefault();
			if(sizeToBigAlert) alert("File is too big max size is 22MB!");
			return false;
		}else{
			return true;
		}
		totalSize += Number(input.files[0].size);
	},

	/**
	* getFileSize
	*
	*/
	getFileSize: function(file){
		//file = input.files[0];
	    //bodyAppend("p", "File " + file.name + " is " + file.size + " bytes in size");
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
	* validatefilesize
	*
	*/
	validatefilesize: function(file, maxSize){
		//file = input.files[0];
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
		var filesize = Support.Utils.formatBytes(totalFileSize);
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



////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
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
	// var files = applicationManager._props_._files;
	// var base = applicationManager._props_._basePath;
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
		//var GL_COMPONENTS = self.getComponents();
		var components = self.getComponents();
		for(var i=0;i<components.length;i++){
			//console.log(components);
			if(document.getElementById(components[i].id)){

				// only run if component is not already apart of the 
				// ALL_COMPONENTS object
				if(CONNECTED_COMPONENTS.includes(components[i].id) === false){
					components[i].component.initializeListeners();
					// Add to 
					CONNECTED_COMPONENTS.push(components[i].id);
					var comp = components[i].component._props_._dom_events;
					// activate attach events
					ApplicationManager_start_handleAttachEvents(comp);
				}
			}else{
				components[i].component.deInitializeListener();
				if(!Utils.isNull())
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
function ApplicationManager_start_handleAttachEvents(comp){
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
	
	// ["$more or less$", "more or less"]
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
		// give route function name
		routes[r] = funcName;
		var lastChar = r.charAt(r.length-1);
		if(lastChar!="/"){ 
			var r2 = r+"/";
			//console.log(r2);
			routes[r2] = funcName;
		}
		
		// get method
		var meth = self._state_manager._routes[r];
		// add method to routes
		router[funcName] = meth;
	}

	router['routes'] = routes;
	self._state_manager._routerConfig = router;

	var Router = Backbone.Router.extend(self._state_manager._routerConfig);
	self._state_manager._router = new Router();
	Backbone.history.start();

	return router;
}






/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/* 0000 - ComponentManager */
function AppComponent_getHtml(self,route){

	return document.createElement('div');
	// if(self.TYPE == Flags.Type.view){
	// 	return AppComponent_getHtml_view_fragment(self,route);
	// }else if(self.TYPE == Flags.Type.layout){
	// 	return AppComponent_getHtml_layout_fragment(self,route);
	// }else if(self.TYPE == Flags.Type.component){
	// 	return AppComponent_getHtml_component_fragment(self,route);
	// }
}

function AppComponent_getHtml_view_fragment(self,route){
	
}
function AppComponent_getHtml_layout_fragment(self,route){
	return self._props_._elements._fragment.cloneNode(true);
}
// 8888
function AppComponent_getHtml_component_fragment(self,route){
	var obj = self._props_._obj;
	var bodies = [];
	self._props_._container = document.createElement('div');
	self._props_._container.id = self.getId();
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
			createdBody = _create_body(obj.body[i],self);
			self._props_._container.appendChild(createdBody);
		}
	}else{
		createdBody = _create_body(obj.body,self);
		self._props_._container.appendChild(createdBody);
	}
	

	self._props_._container.appendChild(self._props_._loader_el);

	var fragment = document.createDocumentFragment();
	fragment.appendChild(self._props_._container);
	self._props_._elements._fragment = fragment;
	return self._props_._elements._fragment.cloneNode(true);
}
function _create_body(body,self){
	var mBody;
	if(typeof body === "string"){
		if(body.charAt(0) === "@"){
			var view = _getView(body,obj);
			if(Utils.isNull(view)){ return; }
			_create_body(view);
		}else if(body.charAt(0) === "&"){
			var p = body.substr(1);
			var t = applicationManager.getLoadedFileContents(p);
			t = applicationManager.templateParser(t,self._props_._obj.template);
			var view = Utils.convertStringToHTMLNode(t);
			return view;
		}else{
			var view = Utils.convertStringToHTMLNode(body);
			return view;
		}
	}else if(typeof body === "object"){
		if(!Utils.isNull(body.TYPE)){
			return body.getHtml();
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
	var params = (obj.params) ? obj.params : {};
	var paramValues = null;
	for(var i in params){
		if(i==body || i==bodyWithoutAt){
			paramValues = params[i];
			break;
		}
	}
	return applicationManager.get(body.slice(1),paramValues);
}
function AppComponent_initializeListeners(self,myComponent){

	// self._props_._events.push({
	// 	selector: selector,
	// 	type: type,
	// 	func: func,
	// 	preventDefault: preventDefault,
	// 	stopPropagation: stopPropagation
	// });
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
			//$("#"+eventObj.id).off();
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
			//if($("#"+containerId).hasClass(loader_class)){}
			$("#"+containerId).addClass(containerClass);
			$("#"+spinnerId).addClass(spinnerClass);
			var offset = "-"+$("#"+containerId).offset().top+"px";
			document.getElementById(containerId).style.top = offset
			// console.log(offset);
		}else{
			$("#"+containerId).removeClass(containerClass);
			$("#"+spinnerId).removeClass(spinnerClass);
		}
		self._props_._active = active;
	}
}




/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
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

	// id: 'home',
	// route: 'home',
	// body: '@homeLayout',
	// init: true,
	// listener: function(){}|{ type:'',func:function(){} }
	

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
				// layout mapper component,mapper component... 
				// @layout #mapper @component,#mapper @component...
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
			$(applicationManager.getRootElement()).append(layoutComponent.getHtml(obj));
		});
	}
}
function Pages__get(){

	//Pages_render(self,arguments);
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


/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/* 0000 - ViewManager */
function ViewManager_render(id,trigger,self){
	//var view = self.getView(id);
	if(Utils.isNull(trigger)){
		trigger = false;
	}
	// This is what the view object is holding
	// this._props_._component_containers['children'][id] = {
	// 	container: component_container,
	// 	options: opts
	// };

	var view = self._props_._component_containers['children'][id];
	if(view!=null){
		self._props_._current_view = view;
		var container = view.container;
		if(self._props_._options.routable==true){
			if(!trigger){
				self._props_._component_containers.parent.addComponent(container,true);
			}
			var route = getNewRoute(id,self);
			stateManager.go(route,trigger);
		}else{
			self._props_._component_containers.parent.addComponent(container,true);
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

}
function MultiView_getCurrentViewInRoute(self){
	var routes = window.location.hash.split("/");
	// console.log(routes);
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




/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
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
	}
}




/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/* 0000 - FormComponent */
function FormComponent_constructor(obj,self){
// Handle this with each form element
	//var formElement = new FormComponentDefaults(opts,self);
	//var compContainer = new ContainerComponent({body:layoutContainer});
	//self._props_._form_data[tag] = {
	// 	element: layoutContainer,
	// 	paramName: formElement.paramName,
	//	component: compContainer,
	// 	type: 'input|text',
	// 	formElement: formElement,
	// 	status: 0,
	// 	statusId: statusId,
	// 	isValid: true
	//};
	//self._props_._values = val
	//compContainer.listenTo(form_handler, event_trigger_submit, func) 
	//compContainer.listenTo(form_handler, event_trigger_reset, func)

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

	// var self = this;

	self._props_._form_data = {};
	self._props_._values = {};

	// intervals
	// timeout

	self._props_._defaultValue = (obj.defaultValue==undefined) ? "none" : obj.defaultValue;

	self._props_._runs = {};
	self._props_._runs._intervals = (obj.intervals==undefined) ? 1000 : obj.intervals;
	self._props_._runs._times = (obj.timeout==undefined) ? 5 : obj.timeout;
	self._props_._runs._count = 0;

	self._props_._triggers = {
		reset: "form:reset:"+Utils.randomGenerator(6,false),
		submit: "form:submit:"+Utils.randomGenerator(6,false)
	};

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
		var interval = setInterval(function(){
			if(!allIn){
				allIn = run2();
			}else{
				clearFormSubmitInerval();
			}

			if(self._props_._runs._count>=self._props_._runs._times){
				clearFormSubmitInerval();
			}
			self._props_._runs._count++;
		},2000);//self._props_._runs._intervals);

		function clearFormSubmitInerval(){
			hasBeenClicked = false;
			document.getElementById(self._props_._submit_button_id).disabled = false;
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
			// o - default
			// 1 - ready
			// 2 - processing
			// 3 - fail
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
		elements.push(data[i].component.getHtml());
	}
	return elements;
}
function FormComponent_build(self){
	var elements = self.getFormElements();//self._props_._form_elements;
	for( var i=0; i<elements.length; i++ ){
		self._props_._form.appendChild(elements[i]);
	}
	self._props_._form.appendChild(self._props_._submit_button.getHtml());
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
}// 1212
function FormComponent_addInput(opts,self){
	var formElement = new FormComponentDefaults(opts,self);
	var layout_classes = (opts.layout==undefined) ? "" : opts.layout;
	var layoutContainer = Utils.createElement({ className: layout_classes });
	var label = Utils.createElement('label',{ for: formElement.id, innerHTML: formElement.label });
	var input = FromComponent_addInput_createElement(formElement);
	var status = Utils.createElement('span',{ id: statusId });
	layoutContainer.appendChild(label);
	layoutContainer.appendChild(input);
	layoutContainer.appendChild(status);
	var compContainer = new ContainerComponent({body:layoutContainer});
	var tag = formElement.tag;
	var statusId = Utils.randomGenerator(12,false);
	self._props_._form_data[tag] = {
		element: layoutContainer,
		component: compContainer,
		paramName: formElement.paramName,
		type: 'input',
		formElement: formElement,
		// o - default
		// 1 - ready
		// 2 - processing
		// 3 - fail
		status: 0,
		statusId: statusId,
		isValid: true
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

	function initializeValidationAndValues(){
		var validation = validation_set_defaults(opts.validation);
		var val = $(formElement.selector).val();
		var value = val!="" ? val : formElement.defaultValue;
		self._props_._values[formElement.paramName] = value;
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

		// 4444
		if(!Utils.isNull(validation.match)){
			if(!Utils.isNull(validation.match.matches)){
				matchGiven();
				self._props_._form_data[tag]['isValid'] = _isvalid;
			}
			if(!Utils.isNull(validation.match.ajax)){
				matchAjax();
				self._props_._form_data[tag]['isValid'] = _isvalid;
			}
			function matchGiven(){
				var matches = validation.match.matches;
				var isAMatch = false;

				// determine if value is a match
				for(var i=0; i<matches.length; i++){
					if(val==matches[i]){
						doesMatch = true;
						break;
					}
				}
				var _isvalid = true;
				var doesMatch = false;

				// if a match, should trigger error or success
				if(!Utils.isNull(validation.match.doesMatch)){
					doesMatch = validation.match.doesMatch;
				}
				runMatch();

			}
			function matchAjax(){

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
					var error = validation.match.success;
					if(typeof success === "function"){
						_add_error_(success(val));
					}else{
						_add_error_(success);
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

			// match: {
			// 	ajax: {
			// 		url: "",
			// 		type: "post", // default is post
			// 		params: {username: 'james'}
			// 	},
			// 	matches: ["",""],
			// 	case: false, // default is false
			// 	error: function(value){
			// 		return "Name: "+value+" is not available"
			// 	},
			// 	success: function(value){
			// 		return "Name: "+form.input.match+" is available"
			// 	}
			// }
		}
	}
	function charactersValidation(val,validation){
		return true;
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
		if(val.length<validation.max.number){
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
	}
}// end of addInput
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

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/* 0000 - Utils */
function Utils_createELement(type,options){
	if(Utils.isNull(type)){
		return document.createElement('div');
	}
	var inputTypes = ["input","checkbox","radio"];
	var ownTypes = ["el","selector","_el","_selector"];
	if(typeof type !== 'string'){
		options = type;
		if(!Utils.isNull(options) && !Utils.isNull(options.el)){
			type = options.el;
		}else{
			type = "div";
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
		for(var i=0;i<Support.Utils.specialChars.length;i++){
			var includes = str.includes(Support.Utils.specialChars[i]);
			if(includes){
				return true;
			}
		}
	}else{
		var s = str.split("");
		for(var i=0;i<Support.Utils.specialChars.length;i++){
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

				/*
				var ec = false;
				for(var v=0;v<charExceptions.length;v++){
					if(charExceptions[v]==special_character){
						ec = true;
					}
				}
				if(!ec){
					//return true;
				}
				*/

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


	//console.log(charExceptions);
	//console.log(str);
	//console.log(contains);

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
	// Edge 20+
	var isEdge = !Support.Utils.isIE && !!window.StyleMedia;

	// Opera 8.0+
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';

	// Safari 3.0+ "[object HTMLElementConstructor]"
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

	// Internet Explorer 6-11
	var isIE =  /*@cc_on!@*/false || !!document.documentMode;

	// Chrome 1+
	var isChrome = !!window.chrome && !!window.chrome.webstore;

	// Blink engine detection
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
function Utils_validateFileByteSize(bytes,maxSize){
	var givenMaxSize = maxSize.split(" ")[0];
	var givenSizeType = maxSize.split(" ")[1];

	var formateBytes = Support.Utils.formatBytes(bytes);
	var formatedSize = formateBytes.split(" ")[0];
	var formatedSizeType = formateBytes.split(" ")[1];

	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var maxsize = "incorrect size";
	var sizeIndex;
	for(var i=0; i<sizes.length; i++){
		if(givenSizeType.toLowerCase().trim()==sizes[i].toLowerCase().trim()){
			maxsize = sizes[i].toLowerCase().trim();
			sizeIndex = i;
		}
	}
	if(maxsize == "incorrect size") {
		return "incorrect size given - 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'"
	}
	var fileToBig = false;
	sizeIndex++;
	for(var i=sizeIndex; i<sizes.length; i++){
		if(formatedSizeType.toLowerCase().trim()==sizes[i].toLowerCase().trim()){
			fileToBig = true;
		}
	}
	if(formatedSizeType.toLowerCase().trim()==givenSizeType.toLowerCase().trim()){
		if(Number(givenMaxSize) < Number(formatedSize)){
			fileToBig = true;
		}
	}

	return {
		size: formatedSize,
		isOver: fileToBig
	};
}



/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/* 0000 - AppLayout */
function AppLayout_build(self){
	// Each time a new row is created an object is added to 
	// the layout_container object. The layout_container
	// has two properties type and columns. When the row
	// method is called the column property is initialed 
	// with an empty array and the type is row. 
	
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
		//console.log(layout[prop]);
		var containerColumn = null;
			
		if(!Utils.isNull(layout[prop].obj)){
			topRowClasses = (Utils.isNull(layout[prop].obj.classes)) ? "" : layout[prop].obj.classes;
		}
		
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
		//console.log( "Second parameter must be an array of objects" );
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

	//var div = "<div id='"+viewId+"' class='"+colClasses+" "+cl+"'>";

	for(var i=0;i<arrayOfItems.length;i++){
		if(typeof arrayOfItems[i]=="string"){
			if(arrayOfItems[i]=="row"){
				divRow = document.createElement("div");
				divRow.className = "row";
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
		//console.log(self);
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
			console.error(arrayOfItems[i]+" is not a function for rout: "+self._props_._routes.route);
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
			//console.log(node);
		}else if(typeof arrayOfItems[i].getHtml() === "object"){
			node = arrayOfItems[i].getHtml(self._props_._routes);
			//console.log(node);
		}

		node = arrayOfItems[i].getHtml(self._props_._routes);
		
		if(divRow!=null){
			divRow.appendChild(node);
			topDiv.appendChild(divRow);
			divRow = null;
		}else{
			topDiv.appendChild(node.cloneNode(true));
		}

		// console.log(topDiv);
		// console.log(divRow);
		// console.log(node);

		//nodes[nodes.length] = divRow;
		//div = div+""+arrayOfItems[i].getHtml();
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

		//nodes[nodes.length] = divRow;
		//div = div+arrayOfItems[i].getHtml();
	}else
	if(arrayOfItems[i].TYPE==Flags.Type.view){
		if(arrayOfItems[i].setParent){
			arrayOfItems[i].setParent(self);
		}
		self._typeHolder.typeView[self._typeHolder.typeView.length] = arrayOfItems[i];
		
		self._props_._extensionObject[self._props_._extensionObject.length] = arrayOfItems[i];

		// var ty = arrayOfItems[i].getParentElementName();
		// var p = "";

		// arrayOfItems[i].render();

		//console.log(arrayOfItems[i].getHtml());
		
		// MutliView's getHtml() code
		var _view_ = arrayOfItems[i];
		var options = _view_._props_._options;
		var routeView;
		if(options.routable){
			routeView = _getViewFromRoute(); 
			//console.log(routeView);
		}else{
			routeView = _gethandledView();
		}
		var v = _getComponentType(routeView);
		$(_view_._props_._container).empty();
		_view_._props_._container.appendChild(v.getHtml());
		topDiv.appendChild(_view_._props_._container.cloneNode(true));

		/////////////////////////////////////


		// 1111
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
		// 1111
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
			// get init view as a default 
			var route_view = null;
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

		//topDiv.appendChild(node);


		/*
		if(ty.charAt(0)=="."){
			//p = "<div class='"+arrayOfItems[i].getParentElementName().split(".")[1]+" '>"+arrayOfItems[i].getStartHtml()+"</div>";

			var node = document.createElement("div");
			node.className = arrayOfItems[i].getParentElementName().split(".")[1];
			var node2 = null;
			if(typeof arrayOfItems[i].getHtml() === "object"){
				node2 = arrayOfItems[i].getHtml();
			}else
			if(typeof arrayOfItems[i].getHtml() === "string"){
				node2 = convertStringToHTMLNode(arrayOfItems[i].getHtml());
			}
			

			node.appendChild(node2);

			if(divRow!=null){
				divRow.appendChild(node);
				topDiv.appendChild(divRow);
				divRow = null;
			}else{
				topDiv.appendChild(node);
			}
			
		}else
		if(ty.charAt(0)=="#"){
			//p = "<div id='"+arrayOfItems[i].getParentElementName().split("#")[1]+" '>"+arrayOfItems[i].getStartHtml()+"</div>";
			var node = document.createElement("div");
			node.id = arrayOfItems[i].getParentElementName().split("#")[1];

			var node2 = convertStringToHTMLNode(arrayOfItems[i].getStartHtml());

			node.appendChild(node2);

			if(divRow!=null){
				divRow.appendChild(node);
				topDiv.appendChild(divRow);
				divRow = null;
			}else{
				topDiv.appendChild(node);
			}
		}
		*/
	}else{
		if(arrayOfItems[i].setParent){
			arrayOfItems[i].setParent(self);
		}
		self._typeHolder["typeComponent"][self._typeHolder.typeComponent.length] = arrayOfItems[i];

		self._props_._extensionObject[self._props_._extensionObject.length] = arrayOfItems[i];

		var node;

		if(typeof arrayOfItems[i] === "string"){
			node = Utils.convertStringToHTMLNode(arrayOfItems[i]);
		}else{
			if(typeof arrayOfItems[i].getHtmlself._props_._routes() === "string"){
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

	// col-lg col-md col-sm col-xs col-offset-lg col-offset-md
	//

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

function _sortClassesVisible(col,columns,colClasses){
	if(colClasses==""){
		colClasses = "visible-"+columns[col];
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
			colClasses = colClasses+"col-"+c[1]+"-"+c[0]+"-"+columns[col]+" ";
		}else{
			colClasses = " "+colClasses+"col-"+c[1]+"-"+c[0]+"-"+columns[col]+" ";
		}
	}else if(col.includes("_")){
		var c = col.split("_");
		if(colClasses==""){
			colClasses = colClasses+"col-"+c[1]+"-"+c[0]+"-"+columns[col]+" ";
		}else{
			colClasses = colClasses+"col-"+c[1]+"-"+c[0]+"-"+columns[col]+" ";
		}
	}
	return colClasses;

}

function ViewLayoutController_initializeListeners(self){
	var components = self._typeHolder.typeComponent;
	var len = components.length;
	for(var i=0;i<len;i++){
		//components[i].initializeListeners();
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
			//rows[rows.length-1].innerHTML = self._build_order[i];
			var xmlString = self._build_order[i],
			    parser = new DOMParser(),
			    doc = parser.parseFromString(xmlString, "text/html");

			//console.log(doc.body.firstChild);

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
			//this._fragment = document.createDocumentFragment();
			var el = document.createElement(prop.type);
			if(prop.id!=null && prop.id!=undefined){ el.id = prop.id; }
			if(prop.classes!=null && prop.classes!=undefined){ el.className = prop.classes; }
			//fragment.appendChild(el);
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
						/*
						var _d = document.createElement("div");
						_d.innerHTML = tmpBody;
						if(myObj!=null){
							myObj.appendChild(_d);
						}else{
							el.appendChild(_d);
						}
						*/

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


	//this._custHtml[this._custHtml.length] = custHtml;
};






/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/* 0000 - _Utils */
function isEventRegistered(selector,self){
	var alreadyRegistered = false;
	//console.log(self);
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
	// 4444
	//if(alreadyRegistered) return;
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
					//if(alreadyRegistered) continue;

					var eventType = (Utils.isNull(obj.callback[i].type)) ? "click" : obj.callback[i].type;
					//function _Utils_registerListenerCallbackForSelf(type,selector,moreData,func,self,preventDefault,stopPropagation){
					var preventDefault = (Utils.isNull(obj.callback[i].preventDefault)) ? false : obj.callback[i].preventDefault;
					var stopPropagation = (Utils.isNull(obj.callback[i].stopPropagation)) ? false : obj.callback[i].stopPropagation;
					self._props_._events.push({
						selector: obj.callback[i].selector,// "#"+(Utils.isNull(obj.callback[i].selector)) ? selector : obj.callback[i].selector,
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
				//if(alreadyRegistered) return;

				self._props_._events.push({
					selector: obj.callback.selector,//"#"+(Utils.isNull(obj.callback.selector)) ? selector : obj.callback.selector,
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


////////////////////////////////////////////////////////
		function(){

			 this.onmessage = function(e){
				this.postMessage('Succefully sent messgae back to you but with a catch');



		//console.log(e);
// function loadUpFiles(base,files,self){
// 	// var files = applicationManager._props_._files;
// 	// var base = applicationManager._props_._basePath;
// 	for(var i in files){
// 		_load(i,files[i]);
// 	}
// 	function _load(alias,filePath){
// 		var file;
// 		if(base == "" || base==null){
// 			file = files[alias];
// 		}else{
// 			file = base+"/"+files[alias];
// 		}
// 		readTextFile(file,function(content,xrh){
// 			applicationManager._props_._file_contents[alias] = content;
// 		});
// 	}
// }
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
////////////////////////////////////////////////////////
			 };

		}.toString(),

	')()' ], { type: 'application/javascript' } ) );

	var worker = new Worker( blobURL );

	worker.addEventListener('message',function(e){
		var msg = e.data;
		//console.log(msg);
		
	});  

	setTimeout(function(){
		worker.postMessage('sending');
	},2000);

	//URL.revokeObjectURL( blobURL );
}







////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// END





var pages = new Pages();
var stateManager = new StateManager();
var sessionManager = new SessionManager();
var applicationManager = new ApplicationManager(stateManager,sessionManager);
var layoutManager = new LayoutManager();
var componentFactory = new ComponentFactory();



/** 
* Main application object that exports singilton objects classes.
* Use this object to access  
*
*
*
* @exports AppFactory
*
*/
var AppFactory = {

	/**
	* Flags
	*/
	Flags: Flags,  

	/**
	* Utils
	*/
	Utils: Utils,

	/**
	* Pages
	*/
	Pages: pages,

	/**
	* ApplicationManager
	*/
	ApplicationManager: applicationManager,

	/**
	* StateManager
	*/
	StateManager: stateManager,

	/**
	* SessionManager
	*/
	SessionManager: sessionManager,

	/**
	* LayoutManager
	*/
	LayoutManager: layoutManager,


	/**
	* ComponentFactory
	*/
	ComponentFactory: componentFactory,

	/**
	* ViewManager
	*/
	ViewManager: ViewManager,

	/**
	* ContentManagementSystem
	*/
	ContentManagementSystem: ContentManagementSystem
};

window.AppFactory = AppFactory;
return AppFactory;


})); // End











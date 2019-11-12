$.getJSON( "../../config.appfac.js", function( config ) {
	require.config(config);
	requirejs([],function(){
		var app = new ApplicationContextManager(config);
		app.initializeApplication(false);

		////////////////////////////////////////////////////////////////

		var Utils = app.Utils;  
		var Plugin = app.getPlugin();
		var Manager = app.getManager();
		var Pages = app.getPages();
		var View = app.getView();
		var Layout = app.getLayout();
		var Component = app.getComp();

		var plugins = config['application']['plugins'];

		function convertObjectToArray(obj){
			var array = [];
			for (var p in plugins) {
				plugins[p]['id'] = p;
				array.push(plugins[p]);
			}		
			return array;
		}


		Manager.register('homeLayout',function(routes){
			//console.log(routes);
			var pluginObjArray = [];
			for (var p in plugins) {
				//console.log(plugins[p]);
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

			var header = Brick.stack().h2("AppfactoryJS Manager Portal").build();

			var layout3 = Layout.newLayout({routes:routes})
				.row()
				.col({md:12},[header])
				.build();

			var view = new app.View({ 
				parent: "#appfac_main_section",
				remember: true
			});
			
			var comp1 = app.Factory.container({body:layout3})
			var comp2 = app.Factory.container({body:'<h2>world</h2>'})

			view.newSubView({
				id: "home",
				init: true,
				body: comp1
			});
			view.newSubView({
				id: "plugin",
				init: false,
				body: comp2
			});

			var layout2 = Layout.newLayout({routes:routes})
				.row()
				.col({md:12},[openCloseNavButton])
				.row()
				.col({md:12},[view])
				.build();

			var p1 =app.Utils.convertStringToHTMLNode(`
<svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 50%;" width="16" height="16" viewBox="0 0 8 8">
  <path fill="blue" d="M0 0l4 4 4-4h-8z" transform="translate(0 2)" />
</svg>`);



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
					nest: p1
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

					$('.appfac_link_btn_plugin').click(function(e){
						console.log(e.currentTarget.innerHTML);



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
});







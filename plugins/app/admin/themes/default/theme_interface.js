define(function(require, exports, module){

  function init(app,config){

    var container = app.Factory.container({
      body: "<h3>Administrator Start, Welcome</h3>"
    });

    return container;
  }


  return init;

});


  
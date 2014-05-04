define(function(require, exports, module) {
    // import dependencies
    var Engine  = require('famous/core/Engine');
    var AppView = require('app/AppView');
   
    // create the main context
    var mainContext = Engine.createContext();
    
    var appView = new AppView();
    mainContext.add(appView);
    // mainContext.setPerspective(1000);      

});

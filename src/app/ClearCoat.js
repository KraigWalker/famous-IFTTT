//Shared function used to add clear coat on top of each page to handle touch events for scrollView
define(function(require, exports, module) {
    var Surface            = require('famous/core/Surface');
    var View               = require('famous/core/View');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');

    function AddClearCoat(context, width, height) {
        //create view to store top layer
        var topView = new View();
        var topMod = new Modifier({
            transform: Transform.translate(0, 0, 10) //move to top layer using Z-index
        });
        context._add(topMod).add(topView);

        // //create clear background
        var clearBackground = new Surface({
            size: [width, height]
        });
        clearBackground.pipe(context);
        topView._add(clearBackground);
    }

    module.exports = AddClearCoat;
});
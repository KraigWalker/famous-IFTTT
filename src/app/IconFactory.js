define(function(require, exports, module) {
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');

    function createIcon(context, options) {
        var width = options.height * options.widthHeightRatio;
        var icon = '<img height='+ options.height +' width='+ width+' src="'+ options.imgUrl +'">';
        var iconSurf = new Surface({
            size: [width, options.height],
            content: icon
        });

        var xOffset = options.xOffset || 0;
        var yOffset = options.yOffset || 0;
        var zIndex = options.zIndex || 0;
        var opacity = (options.opacity === undefined) ? 1 : options.opacity;

        var iconMod = new Modifier({
            origin: [options.originX, options.originY],
            transform: Transform.translate(xOffset, yOffset, options.zIndex),
            opacity: opacity
        });

        //store modifier values for later use
        iconMod.xOffset = xOffset;
        iconMod.yOffset = yOffset;
        iconMod.zIndex = zIndex;
        iconMod.opacity = opacity;
        iconMod.multiplier = Math.random() * 0.5 + 1;
        
        //check to see if context has array of mods to group animations
        if(context.iconMods) {
            context.iconMods.push(iconMod);
        }
        
        context._add(iconMod).add(iconSurf);
        return iconMod;
    }

    module.exports = createIcon;
});
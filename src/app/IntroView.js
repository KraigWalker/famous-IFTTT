define(function(require, exports, module) {
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');
    var SequentialLayout   = require("famous/views/SequentialLayout");
    var Utility            = require('famous/utilities/Utility');
    var Easing             = require('famous/transitions/Easing');
    var ScrollView         = require('famous/views/Scrollview');


    var AddClearCoat       = require('./ClearCoat');

    function IntroView() {
        View.apply(this, arguments);

        this.iconMods = []; //stores icon modifiers for use in animation

        AddClearCoat(this, this.options.width, this.options.height); //adds clear layer to handle scroll view touch
        _createMiddleLayer.call(this); //phone icon + text

        _createTopIcons.call(this); //create top layer icons (in front of phone)
        _createBottomIcons.call(this); //create bottom layer icons (behind phone)

        this._eventInput.pipe(this._eventOutput);
    }

    IntroView.prototype = Object.create(View.prototype);
    IntroView.prototype.constructor = IntroView;

    IntroView.DEFAULT_OPTIONS = {
        width: null,
        height: null
    };

    function _createIcon(options) {
        var width = options.height * options.widthHeightRatio;
        var icon = '<img height='+ options.height +' width='+ width+' src="'+ options.imgUrl +'">';
        var iconSurf = new Surface({
            size: [width, options.height],
            content: icon
        });
        var iconMod = new Modifier({
            origin: [options.originX, options.originY],
            transform: Transform.translate(0, 0, options.zIndex)
        });
        iconMod.zIndex = options.zIndex;
        iconMod.multiplier = Math.random() * 0.2 + 1;
        this.iconMods.push(iconMod);
        this._add(iconMod).add(iconSurf);
    }

    function _createTopIcons() {
        //create calendar icon
        _createIcon.call(this, {
            height: this.options.height / 9,
            widthHeightRatio: 205/185,
            imgUrl: "./img/calendar.png",
            originX: 0.77,
            originY: 0.27,
            zIndex: 2
        });

        //create instagram icon
        _createIcon.call(this, {
            height: this.options.height / 7.5,
            widthHeightRatio: 240/210,
            imgUrl: "./img/instagram.png",
            originX: 0.025,
            originY: 0.35,
            zIndex: 2
        });

        //create hack reactor icon
        _createIcon.call(this, {
            height: this.options.height / 10,
            widthHeightRatio: 1,
            imgUrl: "./img/hackreactor.png",
            originX: 0.9,
            originY: 0.57,
            zIndex: 2
        });
    }

    function _createBottomIcons() {
        //create facebook icon
        _createIcon.call(this, {
            height: this.options.height / 12,
            widthHeightRatio: 112/122,
            imgUrl: "./img/facebook.png",
            originX: 0.9,
            originY: 0.15,
            zIndex: 0
        });

        //create gmail icon
        _createIcon.call(this, {
            height: this.options.height / 26,
            widthHeightRatio: 130/106,
            imgUrl: "./img/gmail.png",
            originX: 0.93,
            originY: 0.25,
            zIndex: 0
        });

        //create graph icon
        _createIcon.call(this, {
            height: this.options.height / 7,
            widthHeightRatio: 200/175,
            imgUrl: "./img/graph.png",
            originX: 0.95,
            originY: 0.4,
            zIndex: 0
        });

        //create famo.us icon
        _createIcon.call(this, {
            height: this.options.height / 12,
            widthHeightRatio: 368/318,
            imgUrl: "./img/famous.png",
            originX: 0.12,
            originY: 0.48,
            zIndex: 0
        });

        //create weather icon
        _createIcon.call(this, {
            height: this.options.height / 8,
            widthHeightRatio: 205/190,
            imgUrl: "./img/weather.png",
            originX: 0.14,
            originY: 0.2,
            zIndex: 0
        });
    }

    function _createMiddleLayer() {
        var middleView = new SequentialLayout({
            itemSpacing: 10,
            direction: Utility.Direction.Y
        });
        var middleSurfaces = [];
        middleView.sequenceFrom(middleSurfaces);
        
        var middleMod = new Modifier({
            origin: [0.5, 0.45],
            transform: Transform.translate(0, 0, 1) //move to middle layer using Z-index
        });
        this._add(middleMod).add(middleView);


        var phoneHeight = this.options.height * 3/5; 
        var phoneWidth  = phoneHeight * (465/980); //ratio of img height to width
        var phoneIcon = '<img height='+ phoneHeight +' width='+ phoneWidth+' src="./img/iphone.png">'
        var phoneIconSurf = new Surface({
            size: [this.options.width, phoneHeight],
            content: phoneIcon,
            properties: {
                textAlign: 'center'
            }
        });
        middleSurfaces.push(phoneIconSurf);

        var introText = '<div>IFTTT lets you create powerful connections with one simple statement &#151 if this then that.</div>'
        var introTextSurf = new Surface({
            size: [this.options.width, 70],
            classes: ['introText'],
            content: introText
        });
        middleSurfaces.push(introTextSurf);

    }

    IntroView.prototype.animate = function(offset) {
        for(var i = 0; i < this.iconMods.length; i++) {
            this.iconMods[i].setTransform(
                Transform.translate(-offset * 2 * this.iconMods[i].multiplier, 0, this.iconMods[i].zIndex)
            );
        }
    }

    IntroView.prototype.reset = function(index, duration) {
        this.iconMods[index].setTransform(
            Transform.translate(0, 0, this.iconMods[index].zIndex),
            {duration: duration, curve: Easing.outBack}
        );
    }

    IntroView.prototype.resetAll = function(instant) {
        var duration = (instant) ? 0 : 600;

        for(var i = 0; i < this.iconMods.length; i++) {
            this.reset(i, duration);
        }
    }

    IntroView.prototype.hide = function() {
        var context = this;
        this.hidden = true;
        for(var i = 0; i < this.iconMods.length; i++) {
            this.iconMods[i].setOpacity(0, {duration: 200});
        }
    }

    IntroView.prototype.unhide = function() {
        this.resetAll(true);
        this.hidden = false;
        for(var i = 0; i < this.iconMods.length; i++) {
            this.iconMods[i].setOpacity(1);
        }
    }

    module.exports = IntroView;
});
define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var Easing          = require('famous/transitions/Easing');
    var Timer           = require('famous/utilities/Timer');

    var AddClearCoat    = require('./ClearCoat');
    var RecipeCard      = require('./RecipeCardView');
    var CreateIcon      = require('./IconFactory');

    function ExplanationView() {
        View.apply(this, arguments);

        this.iconMods = []; //stores icon modifiers for use in animation

        AddClearCoat(this, this.options.width, this.options.height); //adds clear layer to handle scroll view touch
        this._eventInput.pipe(this._eventOutput);

        _createRecipeCard.call(this);
        _createExplanations.call(this);
    }

    ExplanationView.prototype = Object.create(View.prototype);
    ExplanationView.prototype.constructor = ExplanationView;

    ExplanationView.DEFAULT_OPTIONS = {
        width: null,
        height: null
    };

    function _createRecipeCard() {
        this.card = new RecipeCard({
            createDefault: true
        });
        this.cardMod = this.card.getDefaultMod();
        //hide card to start; AppView handles displaying card depending on page
        this.cardMod.setOpacity(0);

        this._add(this.cardMod).add(this.card);
    }

    function _createExplanations() {
        //Recipe tip (top)
        var recipeModXOffset = 500;
        var recipeModYOffset = this.options.height * -1;
        CreateIcon(this, {
            height: this.options.width * .90 * 157/568, //easier to estimate the width
            widthHeightRatio: 568/157,
            imgUrl: "./img/recipe.png",
            originX: 0.5,
            originY: 0.15,
            zIndex: 1,
            // xOffset: recipeModXOffset,
            // yOffset: recipeModYOffset,
            opacity: 1
        });

        //Recipe tip (bottom)
        var descriptionModXOffset = -500;
        var descriptionModYOffset = this.options.height;
        CreateIcon(this, {
            height: this.options.height / 3.5,
            widthHeightRatio: 270/303,
            imgUrl: "./img/description.png",
            originX: 0.68,
            originY: 0.63,
            zIndex: 1,
            // xOffset: descriptionModXOffset,
            // yOffset: descriptionModYOffset,
            opacity: 1
        });
        
        //Trigger tip (left)
        var triggerModXOffset = this.options.width * - 1;
        var triggerModYOffset = 500;
        CreateIcon(this, {
            height: this.options.height / 3.5,
            widthHeightRatio: 206/333,
            imgUrl: "./img/triggerChannel.png",
            originX: 0.10,
            originY: 0.55,
            zIndex: 1,
            // xOffset: triggerModXOffset,
            // yOffset: triggerModYOffset,
            opacity: 1
        });

        //Action tip
        var actionModXOffset = this.options.width;
        var actionModYOffset = 500;
        CreateIcon(this, {
            height: this.options.height / 5,
            widthHeightRatio: 251/285,
            imgUrl: "./img/action-channel.png",
            originX: 0.90,
            originY: 0.48,
            zIndex: 1,
            // xOffset: actionModXOffset,
            // yOffset: actionModYOffset,
            opacity: 1
        });
    }

    ExplanationView.prototype.animate = function() {
        for(var i = 0; i < this.iconMods.length; i++) {
            Timer.setTimeout(function(i){
                console.log(this.iconMods[i]);
                this.iconMods[i].setTransform(
                    Transform.translate(0, 0, this.iconMods[i].zIndex),
                    {duration: 800, curve: 'easeInOut'}
                );
                this.iconMods[i].setOpacity(1, {duration: 800});
            }.bind(this, i), 400 * (i+1));
        }
    }

    ExplanationView.prototype.reset = function() {
        for(var i = 0; i < this.iconMods.length; i++) {
            this.iconMods[i].setTransform(
                Transform.translate(this.iconMods[i].xOffset, this.iconMods[i].yOffset, this.iconMods[i].zIndex)
            );
            this.iconMods[i].setOpacity(1);
        }
    }

    ExplanationView.prototype.hideCard = function() {
        this.cardMod.setOpacity(0);
    }

    ExplanationView.prototype.unhideCard = function() {
        this.cardMod.setOpacity(1);
    }

    module.exports = ExplanationView;
});
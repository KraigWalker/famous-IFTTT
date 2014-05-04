define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var Easing          = require('famous/transitions/Easing');
    var Timer           = require('famous/utilities/Timer');

    var AddClearCoat    = require('./ClearCoat');
    var RecipeCard      = require('./RecipeCardView');

    function ExplanationViewIntro() {
        View.apply(this, arguments);

        AddClearCoat(this, this.options.width, this.options.height); //adds clear layer to handle scroll view touch
        this._eventInput.pipe(this._eventOutput);

        _createRecipeCard.call(this);
        _createDescription.call(this);


    }

    ExplanationViewIntro.prototype = Object.create(View.prototype);
    ExplanationViewIntro.prototype.constructor = ExplanationViewIntro;

    ExplanationViewIntro.DEFAULT_OPTIONS = {
        width: null,
        height: null
    };

    function _createRecipeCard() {
        this.card = new RecipeCard({
            createDefault: true
        });
        this.cardMod = this.card.getDefaultMod();

        this._add(this.cardMod).add(this.card);
    }

    function _createDescription() {
        this.description = new Surface({
            classes: ['explanationSummary'],
            size: [this.options.width * .90, this.options.height * .20],
            content: '<div>Recipes are connections <br>between Channels.</div>',
        });
        this.descriptionMod = new Modifier({
            origin: [0.5, 0.35],
            transform: Transform.translate(0, this.options.height * .20 + 15, 0)
        });

        this._add(this.descriptionMod).add(this.description);
    }

    ExplanationViewIntro.prototype.hideCard = function() {
        this.cardMod.setOpacity(0);
    }

    ExplanationViewIntro.prototype.unhideCard = function() {
        this.cardMod.setOpacity(1);
    }

    module.exports = ExplanationViewIntro;
});
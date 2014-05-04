define(function(require, exports, module) {
    var Surface            = require('famous/core/Surface');
    var Modifier           = require('famous/core/Modifier');
    var Transform          = require('famous/core/Transform');
    var View               = require('famous/core/View');
    var Utility            = require('famous/utilities/Utility');
    var SequentialLayout   = require("famous/views/SequentialLayout");
    
    var RecipeCard         = require('./RecipeCardView');
    var AddClearCoat       = require('./ClearCoat');

    function ExampleView() {
        View.apply(this, arguments);

        AddClearCoat(this, this.options.width, this.options.height); //adds clear layer to handle scroll view touch
        this._eventInput.pipe(this._eventOutput);

        _createBackgroundView.call(this);
        _createExamples.call(this);
      }

    ExampleView.prototype = Object.create(View.prototype);
    ExampleView.prototype.constructor = ExampleView;

    ExampleView.DEFAULT_OPTIONS = {
      height: null, 
      width: null
    };

    function _createBackgroundView() {
      var textSurf = new Surface({
        size: [this.options.width * .8, this.options.height * 0.05],
        content: "Some example recipes",
        properties: {
          color: 'black', 
          textAlign: 'center', 
          fontWeight: 'bold',
          fontSize: '22px'
        }
      });

      var textMod = new Modifier({
        origin: [0.5, 0.1],
        transform: Transform.translate(0,0,5)
      })
      this._add(textMod).add(textSurf);
    }

    function _createExamples() {
      var width = this.options.width * .90;
      var height = this.options.height * .20;

      var recipeCard1 = new RecipeCard ({
        width: width,
        height: height,
        firstImgWidthHeightRatio: 128/118,
        secondImgWidthHeightRatio: 112/102,
        firstImgUrl: "./img/sunflower.png",
        firstImageHidden: true,
        secondImgUrl: "./img/twocircles.png",
        subText: 'Upload photos that use your iPhone\'s front camera to Flickr (#selfies!)'
      });
      var recipeCard1Mod = new Modifier({
        origin: [0.5, 0.25],
        transform: Transform.translate(0, 0, 0)
      });
      this._add(recipeCard1Mod).add(recipeCard1);


      var recipeCard2 = new RecipeCard({
        width: width,
        height: height,
        firstImgWidthHeightRatio: 200/200,
        secondImgWidthHeightRatio: 368/318,
        firstImgUrl: "./img/hackreactor.png",
        firstImageHidden: true,
        secondImgUrl: "./img/famous.png",
        subText: 'Learn Software Engineering, make cool stuff.'
      });
      var recipeCard2Mod = new Modifier({
        origin: [0.5, 0.25],
        transform: Transform.translate(0, height + 15, 0)
      });
      this._add(recipeCard2Mod).add(recipeCard2);

      var recipeCard3 = new RecipeCard({
        width: width,
        height: height,
        firstImgWidthHeightRatio: 107/106,
        firstImageHidden: true,
        secondImgWidthHeightRatio: 130/106,
        firstImgUrl: "./img/checkmark.png",
        secondImgUrl: "./img/gmail.png",
        subText: 'Send new contacts a "Nice meeting you" email'
      });
      var recipeCard3Mod = new Modifier({
        origin: [0.5, 0.25],
        transform: Transform.translate(0, 2*(height + 15), 0)
      });
      this._add(recipeCard3Mod).add(recipeCard3);
    }

    module.exports = ExampleView;
});
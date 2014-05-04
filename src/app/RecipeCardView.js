define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/transform');
    var View            = require('famous/core/View');

    function RecipeCard() {
        View.apply(this, arguments)

        //set default options
        if(this.options.createDefault) {
            this.options.width = window.innerWidth * .90;
            this.options.height = window.innerHeight * .20;
            this.options.firstImgWidthHeightRatio = 238/210;
            this.options.secondImgWidthHeightRatio = 132/116;
            this.options.firstImgUrl = "./img/instagram.png";
            this.options.secondImgUrl = "./img/dropbox.png";
            this.options.subText = 'Save my Instagram photos to Dropbox';
        }

        //set firstImgURL to blank if no pic given
        this.options.firstImgUrl = this.options.firstImgUrl || "./img/blank.png";
        _createRecipeCard.call(this, this.options)
    }

    RecipeCard.prototype = Object.create(View.prototype);
    RecipeCard.prototype.constructor = RecipeCard;

    RecipeCard.DEFAULT_OPTIONS = {};

    function _createRecipeCard(options) {
      var width = options.height * options.widthHeightRatio;
      var displayType = options.firstImageHidden ? 'hidden' : 'visible';

      var content  = '<div class="recipeCardHeading">';
          content +=   '<span class="recipeText">if</span>'
          content +=   '<img class="'+displayType+'"height="'+ options.height /2.4 + '" width="' + width /2.4 + '" src="' + options.firstImgUrl + '"> ';
          content +=   '<span class="recipeText then"> then</span>'
          content +=   '<img height="'+ options.height /2 + '" width="' + width /2 + '" src="' + options.secondImgUrl+ '">';
          content += '</div>';

          content += '<div class="recipeCardExplanation">' + options.subText + '</div>';

        var recipeCardSurf = new Surface({
          size: [options.width, options.height],
          content: content,
          properties: {
            color: 'black',
            border: '1px solid #D9D7D7',
            borderRadius: '4px',
            boxShadow: '2px 2px 2px #BABABA',
            backgroundColor: 'white'
          }
        });
        this._add(recipeCardSurf);
    }

    RecipeCard.prototype.getDefaultMod = function(pushBack) {
        var mod = new Modifier({
            origin: [0.5, 0.35]
        });
        if(pushBack) {
            mod.setTransform(
                Transform.translate(0, 0, -5)
            );
        }
        return mod;
    }

    module.exports = RecipeCard;
});
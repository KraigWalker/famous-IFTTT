define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var Utility         = require('famous/utilities/Utility');
    
    var CreateIcon      = require('./IconFactory');
    var AddClearCoat    = require('./ClearCoat');

    function ChannelView() {
        View.apply(this, arguments);
        _createText.call(this);
        AddClearCoat(this, this.options.widtgh, this.options.height); //adds clear layer to handle scroll view touch
        this._eventInput.pipe(this._eventOutput);

    }

    ChannelView.prototype = Object.create(View.prototype);
    ChannelView.prototype.constructor = ChannelView;

    ChannelView.DEFAULT_OPTIONS = {};

    function _createText() {
      var textSurf = new Surface({
        size: [this.options.width * .90, this.options.height * .10],
        content: 'Unlock the power of three new Channels on your iPhone',
        classes:['explanationSummary'],
        properties: {
          color: 'black',
          textAlign: 'center'
        }
      });

      var textMod = new Modifier({
        origin: [0.5, 0.1]
      });

      this._add(textMod).add(textSurf);
    }

    module.exports = ChannelView;
});
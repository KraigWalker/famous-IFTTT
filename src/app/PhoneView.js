define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var Utility         = require('famous/utilities/Utility');
    
    var CreateIcon      = require('./IconFactory');
    var AddClearCoat    = require('./ClearCoat');

    function PhoneView() {
        View.apply(this, arguments);
        _createBottomBoxShadow.call(this);
        _createPhone.call(this);
        AddClearCoat(this, this.options.widtgh, this.options.height); //adds clear layer to handle scroll view touch
        this._eventInput.pipe(this._eventOutput);

    }

    PhoneView.prototype = Object.create(View.prototype);
    PhoneView.prototype.constructor = PhoneView;

    PhoneView.DEFAULT_OPTIONS = {};

    function _createBottomBoxShadow() {
      var boxSurf = new Surface({
        size: [this.options.width * .90, this.options.height * .20],
        classes:['channelBox'],
        properties: {
          backgroundColor:'white',
          boxShadow: '0px -7px 5px -5px rgba(0,0,0,0.2)',
          borderRadius: '5px',
          border: 'none'
        }
      });
      var boxMod = new Modifier({
        origin: [0.5, 1],
        transform: Transform.translate(0,0,5)
      });

      this._add(boxMod).add(boxSurf);
    }

    function _createPhone() {
      var phoneWidth = this.options.width * .65;
      var phoneHeight = phoneWidth * (425/225);
      var phoneSurf = new Surface({
        size:[phoneWidth, phoneHeight],
        content: "<img src='./img/iphone-allwhite.png' height="+phoneHeight+" width="+phoneWidth+">"
      });

      var phoneMod = new Modifier({
        origin: [0.5, 0.5],
        transform: Transform.translate(0, phoneHeight/2, 4)
      });

      var logoWidth = this.options.width * .35;
      var logoHeight = logoWidth * (45/150);
      var logoSurf = new Surface({
        size:[logoWidth, logoHeight],
        content: "<img src='./img/ifttt.png' height="+logoHeight+" width="+logoWidth+">"
      });

      var logoMod = new Modifier({
        origin: [0.5, 0.5],
        transform: Transform.translate(0, phoneHeight / 4, 5)
      });

      this._add(logoMod).add(logoSurf);
      this._add(phoneMod).add(phoneSurf);
    }

    module.exports = PhoneView;
});
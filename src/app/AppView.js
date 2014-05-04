define(function(require, exports, module) {
    var Surface               = require('famous/core/Surface');
    var ImageSurface          = require('famous/surfaces/ImageSurface');
    var Modifier              = require('famous/core/Modifier');
    var Transform             = require('famous/core/Transform');
    var View                  = require('famous/core/View');
    var ContainerSurface      = require("famous/surfaces/ContainerSurface");
    var Easing                = require('famous/transitions/Easing');
    var Transitionable        = require('famous/transitions/Transitionable');
    
    var PageSwipe             = require('./PageSwipe');
    var IntroView             = require('./IntroView');
    var ExplanationView       = require('./ExplanationView');
    var ExplanationViewIntro  = require('./ExplanationViewIntro');
    var ChannelView           = require('./ChannelView');
    var ExampleView           = require('./ExampleView');
    var RecipeCard            = require('./RecipeCardView');
    var PhoneView             = require('./PhoneView');
    var CreateIcon            = require('./IconFactory');

    function AppView() {
        View.apply(this, arguments);
        this.pages = [];

        //create PageSwipe and PageSwipe components
        _createPageSwipe.call(this);
        _createIntroView.call(this);
        _createExplanationViewIntro.call(this);
        _createExplanationView.call(this);
        _createChannelView.call(this);
        _createExampleView.call(this);

        //create overlays that are outside of PageSwipe
        _addRecipeOverlay.call(this);
        _createPhoneWithIconsOverlay.call(this);

        //create pagination dots
        _createDots.call(this);

        //handle user interaction
        _handleScroll.call(this);
        this.page = 0;
        _handlePagination.call(this);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        height: window.innerHeight,
        width: window.innerWidth
    };

    function _createPageSwipe() {
        this.pageSwipe = new PageSwipe({
            direction: 'x',
            paginated: true
        });
        this.pageSwipe.sequenceFrom(this.pages);
        this._add(this.pageSwipe);
    }

    function _createIntroView() {
        this.introView = new IntroView({
            width: this.options.width, 
            height: this.options.height
        });
        this.introView.pipe(this.pageSwipe);
        this.pages.push(this.introView);
    }

    function _createExplanationViewIntro() {
        this.explanationViewIntro = new ExplanationViewIntro({
            width: this.options.width,
            height: this.options.height
        });
        this.explanationViewIntro.pipe(this.pageSwipe);
        this.pages.push(this.explanationViewIntro);
    }

    function _createExplanationView() {
        this.explanationView = new ExplanationView({
            width: this.options.width,
            height: this.options.height
        });
        this.explanationView.pipe(this.pageSwipe);
        this.pages.push(this.explanationView);
    }

    function _createChannelView() {
        this.channelView = new ChannelView({
            width: this.options.width,
            height: this.options.height
        });

        this.channelView.pipe(this.pageSwipe);
        this.pages.push(this.channelView);
    }

    function _createExampleView() {
        this.exampleView = new ExampleView({
            width: this.options.width,
            height: this.options.height
        });

        this.exampleView.pipe(this.pageSwipe);
        this.pages.push(this.exampleView);
    }

    function _addRecipeOverlay() {
        this.overlayCard = new RecipeCard({
            createDefault: true
        });
        this.overlayCardMod = this.overlayCard.getDefaultMod(true); //push z-index back
        this.overlayCardMod.setOpacity(0);
        this.overlayDisplayed = false;

        this._add(this.overlayCardMod).add(this.overlayCard);
    }

    function _showRecipeOverlay() {
        this.overlayCardMod.setOpacity(1);
        this.overlayDisplayed = true;
    }

    function _hideRecipeOverlay() {
        this.overlayCardMod.setOpacity(0);
        this.overlayDisplayed = false;
    }

    function _createPhoneWithIconsOverlay() {
        //PHONE AND WHITE SHADOW BOX
        this.phoneAndIconsOffset = this.options.height * 1.2;

        this.phone = new PhoneView({
            width: this.options.width,
            height: this.options.height
        });
        this.phone.pipe(this.pageSwipe);
        
        this.phoneMod = new Modifier({
            transform: Transform.translate(0, this.phoneAndIconsOffset, 5) //push below viewport
        });
        this._add(this.phoneMod).add(this.phone);

        //ICONS THAT MOVE INDEPENTLY OF PHONE
        this.iconMods = [];
        CreateIcon(this, {
            height: (this.options.height / 5),
            widthHeightRatio: 128/118,
            imgUrl: "./img/sunflower.png",
            originX: 0.68,
            originY: 0.25,
            yOffset: this.phoneAndIconsOffset * 1.2,
            zIndex: 10,
            opacity: 1
        });

        CreateIcon(this, {
            height: (this.options.height / 5),
            widthHeightRatio: 200/200,
            imgUrl: "./img/hackreactor.png",
            originX: 0.1,
            originY: 0.4,
            yOffset: this.phoneAndIconsOffset * 1.2,
            zIndex: 10,
            opacity: 1
        });

        CreateIcon(this, {
            height: (this.options.height / 5),
            widthHeightRatio: 107/106,
            imgUrl: "./img/checkmark.png",
            originX: 0.84,
            originY: 0.49,
            yOffset: this.phoneAndIconsOffset * 1.1,
            zIndex: 10,
            opacity: 1
        });
    }

    /**
     * offset --> amount the PageSwipe has moved
     * direction --> direction the icons should move, -1 for up or 1 for down
     * moveUp --> boolean for whether phone is "up" in the display 
     * moveToDestination --> boolean for whether icons are moving to destination on recipe card in last page
     */
    function _movePhoneWithIcons(offset, direction, phoneUp, moveToDestination) {
        var width = this.options.width;
        var height = this.options.height;

        /**********   MOVE PHONE UP/DOWN  **********/
        var phoneBase = phoneUp ? this.phoneAndIconsOffset : 0;
        this.phoneMod.setTransform(
            Transform.translate(0, (phoneBase + 2*offset * direction), 5)
        );

        /**********   MOVE ICONS UP/DOWN **********/
        var scaleBy, scale, translate;
        if(offset < 0 && this.page === 3) {
            //icon gets smaller
            scaleBy = (this.options.width) / (this.options.width - offset);
            scale = Transform.scale(scaleBy, scaleBy, 1);
        } else if(offset < 0) {
            //icon gets larger
            scaleBy = (this.options.width + Math.abs(offset)) / (this.options.width);
            scale = Transform.scale(scaleBy * .25, scaleBy * .25, 1);
        } else {
            //icon gets smaller
            scaleBy = (this.options.width) / (this.options.width + offset);
            scale = Transform.scale(scaleBy, scaleBy, 1);
        }

        if(!moveToDestination) {
            var base, multiplier; //for faster movement down
            for(var i = 0; i < this.iconMods.length; i++) {
                base = phoneUp ? this.iconMods[i].yOffset : 0;
                multiplier = phoneUp ? 1 : 1.4;
                translate = Transform.translate(0, (base + 2*offset * direction * multiplier), 10);
                this.iconMods[i].setTransform(
                    Transform.multiply(translate, scale)
                );
            }
        /**********   MOVE ICONS ACROSS TO RECIPE CARD  **********/
        } else {
            // Icons get smaller    
            var transformProgress = this.page === 3 ? Math.abs(this.offset) / width : 1 - Math.abs(this.offset) / width;
            var scaleProgress = this.page === 3 ? 1 - 0.55 * Math.abs(this.offset) / width : 0.45 + Math.abs(this.offset) / width 

            this.iconMods[0].setTransform(
                Transform.multiply(
                    Transform.translate(transformProgress*(-width / 2.7), 0),
                    Transform.scale(scaleProgress, scaleProgress)
                )
            );

            this.iconMods[1].setTransform(
                Transform.multiply(
                    Transform.translate(transformProgress*(width / 9), transformProgress*(height / 10.5)),
                    Transform.scale(scaleProgress, scaleProgress)
                )
            );

            this.iconMods[2].setTransform(
                Transform.multiply(
                    Transform.translate(transformProgress*(-width / 1.95), transformProgress*(height / 4.25)),
                    Transform.scale(scaleProgress, scaleProgress)
                )
            );
        }
    }

    function _animatePhoneWithIcons(moveUp, phoneOnly) {
        var base = moveUp ? 0 : this.phoneAndIconsOffset;
        var size = moveUp ? 1 : 0.25;

        this.phoneMod.setTransform(
            Transform.translate(2, base, 5),
            {duration: 350, curve: Easing.outQuad}
        );

        if(!phoneOnly) {
            var translate = Transform.translate(0, base, 10);
            var scale = Transform.scale(size, size, 10);
            for(var i = 0; i < this.iconMods.length; i++) {
                this.iconMods[i].setTransform(
                    Transform.multiply(translate, scale),
                    {duration: 350, curve: Easing.outQuad}
                );
            }
        }
    }

    function _moveIconsToRecipeCard() {
        var width = this.options.width;
        var height = this.options.height;

        this.iconMods[0].setTransform(
            Transform.multiply(
                Transform.translate(-width / 2.7, 0),
                Transform.scale(0.45, 0.45)
            ), {duration: 350, curve: Easing.outQuad}
        );

        this.iconMods[1].setTransform(
            Transform.multiply(
                Transform.translate(width / 9, height / 10.5),
                Transform.scale(0.45, 0.45)
            ), {duration: 350, curve: Easing.outQuad}
        );

        this.iconMods[2].setTransform(
            Transform.multiply(
                Transform.translate(-width / 1.95, height / 4.25),
                Transform.scale(0.45, 0.45)
            ), {duration: 350, curve: Easing.outQuad}
        );
    }

    function _pushIconsLeft(offset) {
        var width = this.options.width;
        var height = this.options.height;

        this.iconMods[0].setTransform(
            Transform.multiply(
                Transform.translate(-width / 2.7 + offset, 0),
                Transform.scale(0.45, 0.45)
            )
        );

        this.iconMods[1].setTransform(
            Transform.multiply(
                Transform.translate(width / 9 + offset, height / 10.5),
                Transform.scale(0.45, 0.45)
            )
        );

        this.iconMods[2].setTransform(
            Transform.multiply(
                Transform.translate(-width / 1.95 + offset, height / 4.25),
                Transform.scale(0.45, 0.45)
            )
        );
    }

    function _createDots() {
        this.dots = [];
        var width = 0.025 * this.options.width;
        var dotsWidth = (2.5 * width * this.pages.length - 1.5 * width) / 2; 

        var dotView = new View();
        var dotViewMod = new Modifier({
            origin: [0, 0.95],
            transform: Transform.translate(this.options.width/2 - dotsWidth, 0, 0)
        });

        for (var i = 0; i < this.pages.length; i++) {
            var dot = new Surface({
                size: [width, width],
                properties:{
                    background: 'rgb(200, 200, 200)',
                    borderRadius: '50%'
                }
            });
            var dotModifier = new Modifier({
                transform: Transform.translate(2.5 * i * width, 0, 20)
            });
            this.dots.push(dot);
            dotView._add(dotModifier).add(dot);
        }

        this._add(dotViewMod).add(dotView);
        this.dots[0].addClass('selected');
    };

    function _hideIconOverlay() {
        //display hidden elements on recipe card
        var hidden = document.getElementsByClassName('hidden');
        for(var i = 0; i < hidden.length; i++) {
            hidden[i].className = 'tempVisible';
        }

        //hide icon overlay
        for(var j = 0; j < this.iconMods.length; j++) {
            this.iconMods[j].setOpacity(0, {duration: 50});
        }
    }

    function _displayIconOverlay() {
        //hide elements on recipe card
        var hidden = document.getElementsByClassName('tempVisible');
        for(var i = 0; i < hidden.length; i++) {
            hidden[i].className = 'hidden';
        }

        //show icon overlay
        for(var j = 0; j < this.iconMods.length; j++) {
            this.iconMods[j].setOpacity(1, {duration: 50});
        }
    }

    function _handleScroll() {
        this.pageSwipe._eventInput.on('start', function(data) {
            this.mouseXPosStart = undefined; //reset mouse position
            this.offset = undefined;
        }.bind(this));

        this.pageSwipe._eventInput.on('update', function(data) {
            if(this.mouseXPosStart === undefined) {
                //set mouseXPosStart on first movement & unhide
                this.mouseXPosStart = data.clientX;
                this.introView.unhide();
            } else {
                this.offset = data.clientX - this.mouseXPosStart;
                this._eventOutput.emit('offsetSet', this.offset);

                //only animate intro icons on page 0 or 1
                if(this.page === 0 || this.page === 1) {
                    //animate using offset once position is set
                    this.introView.animate(this.offset);
                    
                    //avoid animating icons back across screens on Page0 to Page1 transition
                    if((this.offset) * -1 > this.options.width * 0.5 && this.page === 0) {
                        this.introView.hide();
                    }
                    
                    //deal with recipe card explanation transition
                    if(this.page === 1) {
                        if(this.offset < 0) {
                            this.explanationViewIntro.hideCard();
                            _showRecipeOverlay.call(this);
                        } else {
                            this.explanationViewIntro.unhideCard();
                            _hideRecipeOverlay.call(this);
                        }
                    }
                //continue handling recipe card transition; icons do not animate
                } else if(this.page === 2) {
                    if(this.offset < 0) {
                        _hideRecipeOverlay.call(this);
                        this.explanationView.unhideCard();
                    } else {
                        _showRecipeOverlay.call(this);
                        this.explanationView.hideCard();
                    }
                }

                //animate phone with icons
                if(this.page === 2 && this.offset < 0) {
                    _movePhoneWithIcons.call(this, this.offset, 1, true, false); //negative+positive to move up
                } else if(this.page === 3 && this.offset < 0) {
                    _movePhoneWithIcons.call(this, this.offset, -1, false, true); //negative+negative to move down
                } else if(this.page === 3 && this.offset > 0) {
                    _movePhoneWithIcons.call(this, this.offset, 1, false, false); //positive+positive to move down
                } else if(this.page === 4 && this.offset > 0) {
                    _movePhoneWithIcons.call(this, this.offset, -1, true, true); //positive+negative to move up
                } else if(this.page === 4 && this.offset < 0) {
                    _pushIconsLeft.call(this, this.offset);
                }
            }

        }.bind(this));

        this.pageSwipe._eventInput.on('end', function(data) {
            if((this.page === 0 || this.page === 1) && !this.introView.hidden) {
                this.introView.resetAll();
            }
            this.releasedAtPage = this.page;
        }.bind(this));
    }

    function _handlePagination() {
        this.pageSwipe._eventOutput.on('pageChange', function(page){
            this.dots[this.page].removeClass('selected');
            this.dots[page].addClass('selected');

            this.page = page;

            //animate phoneWithIcons
            if(this.page === 2) {
                _animatePhoneWithIcons.call(this, false);
            } else if(this.page === 3) {
                _animatePhoneWithIcons.call(this, true);
            } else if(this.page === 4) {
                _moveIconsToRecipeCard.call(this);
            }

        }.bind(this));

        //ensure that phoneWithIcons animgates up/down on PageSwipe release w/o page change
        this.pageSwipe._eventOutput.on('springBack', function(){
            if(this.page === 2) {
                _animatePhoneWithIcons.call(this, false);
            } else if(this.page === 3) {
                _animatePhoneWithIcons.call(this, true);
            } else if(this.page === 4 ) {
                _moveIconsToRecipeCard.call(this);
            }
        }.bind(this));
    }

    module.exports = AppView;
});
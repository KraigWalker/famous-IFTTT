define(function(require, exports, module) {
    var PhysicsEngine  = require('famous/physics/PhysicsEngine');
    var Particle       = require('famous/physics/bodies/Particle');
    var GenericSync    = require('famous/inputs/GenericSync');
    var MouseSync      = require('famous/inputs/MouseSync');
    var Drag           = require('famous/physics/forces/Drag');
    var EventHandler   = require('famous/core/EventHandler');
    var ViewSequence   = require('famous/core/ViewSequence');
    var Scroller       = require('famous/views/Scroller');
    var OptionsManager = require('famous/core/OptionsManager');
    var Spring         = require('famous/physics/forces/Spring');

    function PageSwipe(options) {
        this.options = Object.create(PageSwipe.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        this._page = null;

        this._physicsEngine = new PhysicsEngine();
        this._particle = new Particle();
        this._physicsEngine.addBody(this._particle);


        this.drag = new Drag({forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC});
        GenericSync.register(MouseSync);
        this.sync = new GenericSync(null, {direction : this.options.direction});

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        this._eventInput.pipe(this.sync);
        this.sync.pipe(this._eventInput);

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._scroller = new Scroller();
        this._scroller.positionFrom(this.getPosition.bind(this));

        if (options) this.setOptions(options);

        this.spring = new Spring({anchor: [0, 0, 0]});
        
        this._touched = 0;
        this._edge = 0;
        this._edgePosition = 0;
        this._pagePosition = 0;
        this._hasSpringAttached = 0;
        this.index = 0;
        this._pageChange = 0;



        _bindEvents.call(this);
    };

    PageSwipe.DEFAULT_OPTIONS = {
        direction: 1
    };


    PageSwipe.prototype.getPosition = function getPosition() {
        return this._particle.getPosition()[0];
    };

    PageSwipe.prototype.setPosition = function setPosition(x) {
        this._particle.setPosition([x, 0, 0]);
    };


    PageSwipe.prototype.setOptions = function setOptions(options) {

        this.options.margin = 3000;

        if (options.direction === 'x') options.direction = 0;
        this._scroller.setOptions(options);
        this._optionsManager.setOptions(options);

        this.drag.setOptions({strength: this.options.drag});

        this.sync.setOptions({
            direction: (!this.options.direction) ? GenericSync.DIRECTION_X : GenericSync.DIRECTION_Y
        });
    };

 
    PageSwipe.prototype.sequenceFrom = function sequenceFrom(pages) {
        if (Array.isArray(pages)) pages = new ViewSequence({array: pages});
        this._page = pages;
        return this._scroller.sequenceFrom(pages);
    };


    PageSwipe.prototype.getSize = function getSize() {
        return this._scroller.getSize.apply(this._scroller, arguments);
    };

    function _bindEvents() {
        this._eventInput.bindThis(this);
        this._eventInput.on('start', _handleStart);
        this._eventInput.on('update', _handleMove);
        this._eventInput.on('end', _handleEnd);
        this._scroller.on('edgeHit', function(data) {
            this._edgePosition = data.position;
        }.bind(this));
    };

    function _handleStart(event) {
        this._touched = 1;
    };

    function _handleMove(event) {
        var delta = event.delta;
        this.setPosition(this.getPosition() - delta);
    };

    function _handleEnd(event) {
        this._touched = 0;
    };

    function _checkEdge(edge) {
        this._onEdge = edge;
        if (this._onEdge && !this._hasSpringAttached) {
            _attachSpring.call(this);
            this._eventOutput.emit('springBack', this.index);
        }
        
    };

    function _checkPage() {
        var pageChange = false;
        this.size  = this._scroller.getSize()[this.options.direction];

        if (this._particle.getPosition()[0] > this.size * this.index + (0.5 * this.size)) {
            _nextPage.call(this);
            pageChange = true;
        }
        if (this._particle.getPosition()[0] < this.size * this.index - (0.5 * this.size)) {
            _previousPage.call(this);
            pageChange = true;
        }
        if (!this._hasSpringAttached) {
            _attachSpring.call(this);
            if(!pageChange) {
                this._eventOutput.emit('springBack', this.index);
            }
        }
        
        var velocity = this._particle.getVelocity().x;
        if (this._pageChange && velocity && (velocity < 0.1) && (-0.1 < velocity)) {
            this._physicsEngine.detachAll();
            this._hasSpringAttached = 0;
            this._eventOutput.emit('endPageTransition', this.index);
            this._pageChange = 0;
        }
    }

    function _nextPage() {
        if (!this._page.getNext()) return;
        this._page = this._page.getNext();
        this.index = this._page.index;
        this._pagePosition = this.size * this.index;
        _attachSpring.call(this);
        this._pageChange = 1;
        this._eventOutput.emit('nextPage', this.index);
        this._eventOutput.emit('pageChange', this.index);
    }

    function _previousPage() {
        if (!this._page.getPrevious()) return;
        this._page = this._page.getPrevious();
        this.index = this._page.index;
        this._pagePosition = this.size * this.index;
        _attachSpring.call(this);
        this._pageChange = 1;
        this._eventOutput.emit('prevPage', this.index);
        this._eventOutput.emit('pageChange', this.index);
    }

    function _attachSpring() {
        if (this._onEdge) {
            this.spring.setOptions({
                    anchor: [this._edgePosition, 0, 0],
                    period: 400,
                    dampingRatio: 1
            });
        } else {
            this.spring.setOptions({
                    anchor: [this._pagePosition, 0, 0],
                    period: 400,
                    dampingRatio: 1
            });
        }
        this._physicsEngine.attach([this.spring], this._particle);
        this._hasSpringAttached = 1;
    };

    PageSwipe.prototype.render = function render() {
        if (!this._touched) {
            _checkEdge.call(this, this._scroller.onEdge());
            _checkPage.call(this);
        }  else if (this._hasSpringAttached) {
            this._physicsEngine.detachAll();
            this._hasSpringAttached = 0;
            this._particle.setVelocity(0);
        }
        return this._scroller.render();
    };

    module.exports = PageSwipe;
});
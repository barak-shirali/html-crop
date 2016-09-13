(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("HtmlCrop", [], factory);
	else if(typeof exports === 'object')
		exports["HtmlCrop"] = factory();
	else
		root["HtmlCrop"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _baseObject = __webpack_require__(1);
	
	var _baseObject2 = _interopRequireDefault(_baseObject);
	
	var _canvasState = __webpack_require__(2);
	
	var _canvasState2 = _interopRequireDefault(_canvasState);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var HtmlCrop = function (_BaseObject) {
	  _inherits(HtmlCrop, _BaseObject);
	
	  /**
	   * object constructor
	   * @param {HTMLDocument} doc
	   * @param {Object} options
	   */
	  function HtmlCrop(doc) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, HtmlCrop);
	
	    var _this = _possibleConstructorReturn(this, (HtmlCrop.__proto__ || Object.getPrototypeOf(HtmlCrop)).call(this));
	
	    _this._document = doc;
	    _this.options = Object.assign({}, options);
	    _this._debugMode = options.debug;
	    _this._canvasState = new _canvasState2.default(doc, doc.getElementById('canvas'), _this._debugMode);
	    _this.log('initialized');
	    return _this;
	  }
	
	  /**
	   * returns class name
	   * @returns {string}
	   */
	
	
	  _createClass(HtmlCrop, [{
	    key: 'getName',
	    value: function getName() {
	      return 'HtmlCrop';
	    }
	  }]);
	
	  return HtmlCrop;
	}(_baseObject2.default);
	
	exports.default = HtmlCrop;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * base class for all object in the library
	 * @class Baseobject
	 */
	var BaseObject = function () {
	  function BaseObject() {
	    _classCallCheck(this, BaseObject);
	  }
	
	  _createClass(BaseObject, [{
	    key: 'getName',
	
	    /**
	     * virtual function for returning class name
	     * @returns {string}
	     */
	    value: function getName() {
	      return '';
	    }
	
	    /**
	     * returns if current mode is debugging mode
	     * @returns {bool}
	     */
	
	  }, {
	    key: 'isDebug',
	    value: function isDebug() {
	      return this._debugMode;
	    }
	
	    /**
	     * logs message and object for debugging purpose
	     * @param {string} message
	     * @param {Array<any>} args
	     */
	
	  }, {
	    key: 'log',
	    value: function log(message) {
	      var _console;
	
	      if (!this.isDebug()) {
	        return;
	      }
	
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      (_console = console).log.apply(_console, [this.getName() + ': ' + message].concat(args));
	    }
	  }]);
	
	  return BaseObject;
	}();
	
	exports.default = BaseObject;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _baseObject = __webpack_require__(1);
	
	var _baseObject2 = _interopRequireDefault(_baseObject);
	
	var _rect = __webpack_require__(3);
	
	var _rect2 = _interopRequireDefault(_rect);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * State enabled class to manage grey canvas on top of html page for cropping
	 * @class CanvasState
	 */
	var CanvasState = function (_BaseObject) {
	  _inherits(CanvasState, _BaseObject);
	
	  /**
	   * object constructor
	   * @param {HTMLDocument} doc
	   * @param {HTMLElement} canvas - canvas DOM element
	   */
	  function CanvasState(doc, canvas) {
	    var debugMode = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	    _classCallCheck(this, CanvasState);
	
	    var _this = _possibleConstructorReturn(this, (CanvasState.__proto__ || Object.getPrototypeOf(CanvasState)).call(this));
	
	    _this._document = doc;
	    _this._canvas = canvas;
	    _this._width = canvas.width;
	    _this._height = canvas.height;
	    _this._ctx = canvas.getContext('2d');
	    _this._debugMode = debugMode;
	
	    var html = _this._document.body.parentNode;
	
	    _this._htmlTop = html.offsetTop;
	    _this._htmlLeft = html.offsetLeft;
	
	    _this._valid = false; // when set to false, the canvas will redraw everything
	    _this._shape = null; // the rectangle shape
	    _this._dragging = false; // Keep track of when we are dragging
	    _this._dragoffx = 0; // See mousedown and mousemove events for explanation
	    _this._dragoffy = 0;
	
	    _this.log('initialized');
	
	    _this._initRect();
	    _this._initEvents();
	
	    _this._interval = 30;
	    setInterval(function () {
	      _this.draw();
	    }, _this._interval);
	    return _this;
	  }
	
	  /**
	   * returns class name
	   * @returns {string}
	   */
	
	
	  _createClass(CanvasState, [{
	    key: 'getName',
	    value: function getName() {
	      return 'CanvasState';
	    }
	
	    /**
	     * attaches event handlers to canvas
	     * @private
	     */
	
	  }, {
	    key: '_initEvents',
	    value: function _initEvents() {
	      var _this2 = this;
	
	      var _canvas = this._canvas;
	      // fixes a problem where double clicking causesShape text to get selected on the canvas
	
	      _canvas.addEventListener('selectstart', function (e) {
	        e.preventDefault();
	        return false;
	      }, false);
	
	      // up, down, and move are for dragging
	      _canvas.addEventListener('mousedown', function (e) {
	        var _shape = _this2._shape;
	
	        var mouse = _this2.getMouse(e);
	        var mx = mouse.x;
	        var my = mouse.y;
	        _this2._valid = false;
	        if (_shape.contains(mx, my)) {
	          _this2._dragoffx = mx - _shape._x;
	          _this2._dragoffy = my - _shape._y;
	          _this2._dragging = true;
	
	          _this2.log('mouse down detected. starting drag', mx, my);
	        }
	      }, true);
	
	      _canvas.addEventListener('mousemove', function (e) {
	        if (_this2._dragging) {
	          var mouse = _this2.getMouse(e);
	          // We don't want to drag the object by its top-left corner, we want to drag it
	          // from where we clicked. Thats why we saved the offset and use it here
	          _this2._shape._x = mouse.x - _this2._dragoffx;
	          _this2._shape._y = mouse.y - _this2._dragoffy;
	          _this2._valid = false; // Something's dragging so we must redraw
	
	          // this.log('moving the rect', mouse.x, mouse.y);
	        }
	      }, true);
	
	      _canvas.addEventListener('mouseup', function () {
	        _this2._dragging = false;
	        _this2.log('dragging finished');
	      });
	
	      this.log('initialized events');
	    }
	
	    /**
	     * creates a movable rectangle and attach to canvas
	     * @private
	     */
	
	  }, {
	    key: '_initRect',
	    value: function _initRect() {
	      this._shape = new _rect2.default(this._width / 4, this._height / 4, this._width / 2, this._height / 2, 'rgba(0, 200, 0, 0.5)');
	      this._valid = false;
	    }
	
	    /**
	     * clears the canvas for next draw
	     */
	
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this._ctx.clearRect(0, 0, this._width, this._height);
	    }
	
	    /**
	     * while draw is called as often as the INTERVAL variable demands,
	     * it only ever does something if the canvas gets invalidated by our code
	     */
	
	  }, {
	    key: 'draw',
	    value: function draw() {
	      // if our state is invalid, redraw and validate!
	      if (!this._valid) {
	        var _ctx = this._ctx;
	        var _shape = this._shape;
	
	        this.clear();
	
	        // @TODO draw background here
	
	        // draw shape
	        _shape.draw(_ctx);
	
	        _ctx.strokeStyle = '#CC0000';
	        _ctx.lineWidth = 2;
	        _ctx.strokeRect(_shape._x, _shape._y, _shape._w, _shape._h);
	
	        this._valid = true;
	
	        this.log('shape drew', _shape._x, _shape._y, _shape._w, _shape._h);
	      }
	    }
	
	    /**
	     * creates an object with x and y defined, set to the mouse position relative to the state's canvas
	     * If you wanna be super-correct this can be tricky, we have to worry about padding and borders
	     * @param {Event} e
	     * @returns {{x: number, y: number}}
	     */
	
	  }, {
	    key: 'getMouse',
	    value: function getMouse(e) {
	      var el = this._canvas;
	      var offsetX = 0;
	      var offsetY = 0;
	
	      // Compute the total offset
	      if (el.offsetParent !== undefined) {
	        do {
	          offsetX += el.offsetLeft;
	          offsetY += el.offsetTop;
	          el = el.offsetParent;
	        } while (el);
	      }
	
	      // Also add the <html> offsets in case there's a position:fixed bar
	      offsetX += this._htmlLeft;
	      offsetY += this._htmlTop;
	
	      var mx = e.pageX - offsetX;
	      var my = e.pageY - offsetY;
	
	      return { x: mx, y: my };
	    }
	  }]);
	
	  return CanvasState;
	}(_baseObject2.default);
	
	exports.default = CanvasState;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _baseObject = __webpack_require__(1);
	
	var _baseObject2 = _interopRequireDefault(_baseObject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Rectangle for highlighting the cropping area
	 * @class Rect
	 */
	var Rect = function (_BaseObject) {
	  _inherits(Rect, _BaseObject);
	
	  /**
	   * object constructor
	   * @param {number} x - left position of shape
	   * @param {number} y - top position of shape
	   * @param {number} w - width
	   * @param {number} h - height
	   * @param {string} fill - background color of the shape
	   */
	  function Rect(x, y, w, h, fill) {
	    var debugMode = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];
	
	    _classCallCheck(this, Rect);
	
	    var _this = _possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this));
	
	    _this._x = x || 0;
	    _this._y = y || 0;
	    _this._w = w || 1;
	    _this._h = h || 1;
	    _this._fill = fill || '#AAAAAA';
	    _this._debugMode = debugMode;
	
	    _this.log('initialized');
	    return _this;
	  }
	
	  /**
	   * returns class name
	   * @returns {string}
	   */
	
	
	  _createClass(Rect, [{
	    key: 'getName',
	    value: function getName() {
	      return 'Rect';
	    }
	
	    /**
	     * draws the shape
	     * @param {CanvasContext} ctx
	     */
	
	  }, {
	    key: 'draw',
	    value: function draw(ctx) {
	      var _x = this._x;
	      var _y = this._y;
	      var _w = this._w;
	      var _h = this._h;
	      var _fill = this._fill;
	
	      ctx.fillStyle = _fill; // eslint-disable-line
	      ctx.fillRect(_x, _y, _w, _h);
	
	      this.log('filling the rectangle', _x, _y, _w, _h);
	    }
	
	    /**
	     * checks if point is inside the shape
	     * @param {number} mx
	     * @param {number} my
	     * @returns {bool}
	     */
	
	  }, {
	    key: 'contains',
	    value: function contains(mx, my) {
	      var _x = this._x;
	      var _y = this._y;
	      var _w = this._w;
	      var _h = this._h;
	
	      return _x <= mx && _x + _w >= mx && _y <= my && _y + _h >= my;
	    }
	  }]);
	
	  return Rect;
	}(_baseObject2.default);
	
	exports.default = Rect;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=HtmlCrop.js.map
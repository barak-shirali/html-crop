import BaseObject from './base-object';
import Rect from './rect';

/**
 * State enabled class to manage grey canvas on top of html page for cropping
 * @class CanvasState
 */
export default class CanvasState extends BaseObject {
  /**
   * object constructor
   * @param {HTMLDocument} doc
   * @param {HTMLElement} canvas - canvas DOM element
   */
  constructor(doc, canvas, debugMode = true) {
    super();

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onTouch = this._onTouch.bind(this);

    this._document = doc;
    this._canvas = canvas;
    this._width = canvas.width;
    this._height = canvas.height;
    this._ctx = canvas.getContext('2d');
    this._debugMode = debugMode;

    const html = this._document.body.parentNode;

    this._htmlTop = html.offsetTop;
    this._htmlLeft = html.offsetLeft;

    this._valid = false; // when set to false, the canvas will redraw everything
    this._shape = null;  // the rectangle shape
    this._dragging = false; // Keep track of when we are dragging
    this._dragoffx = 0; // See mousedown and mousemove events for explanation
    this._dragoffy = 0;

    this.log('initialized');

    this._initRect();
    this._initEvents();

    this._interval = 30;
    setInterval(() => {
      this.draw();
    }, this._interval);
  }

  /**
   * returns class name
   * @returns {string}
   */
  getName() {
    return 'CanvasState';
  }

  _onMouseDown(e) {
    const { _shape } = this;
    const mouse = this.getMouse(e);
    const mx = mouse.x;
    const my = mouse.y;
    this._valid = false;
    if (_shape.contains(mx, my)) {
      this._dragoffx = mx - _shape._x;
      this._dragoffy = my - _shape._y;
      this._dragging = true;

      this.log('mouse down detected. starting drag', mx, my);
    }

    this._currentHandle = this._shape.getHoverSelectionHandle(mouse.x, mouse.y);
  }

  _onMouseMove(e) {
    const { _shape, _canvas } = this;
    const mouse = this.getMouse(e);
    const oldx = _shape._x;
    const oldy = _shape._y;
    const mx = mouse.x;
    const my = mouse.y;
    const handleIndex = _shape.getHoverSelectionHandle(mx, my);
    switch (handleIndex) {
      case 0:
        _canvas.style.cursor = 'nw-resize';
        break;
      case 1:
        _canvas.style.cursor = 'n-resize';
        break;
      case 2:
        _canvas.style.cursor = 'ne-resize';
        break;
      case 3:
        _canvas.style.cursor = 'w-resize';
        break;
      case 4:
        _canvas.style.cursor = 'e-resize';
        break;
      case 5:
        _canvas.style.cursor = 'sw-resize';
        break;
      case 6:
        _canvas.style.cursor = 's-resize';
        break;
      case 7:
        _canvas.style.cursor = 'se-resize';
        break;
      default:
        _canvas.style.cursor = 'auto';
    }

    if (this._currentHandle !== false) {
      // Handles resizing
      switch (this._currentHandle) {
        case 0:
          _shape._x = mx;
          _shape._y = my;
          _shape._w += oldx - mx;
          _shape._h += oldy - my;
          break;
        case 1:
          _shape._y = my;
          _shape._h += oldy - my;
          break;
        case 2:
          _shape._y = my;
          _shape._w = mx - oldx;
          _shape._h += oldy - my;
          break;
        case 3:
          _shape._x = mx;
          _shape._w += oldx - mx;
          break;
        case 4:
          _shape._w = mx - oldx;
          break;
        case 5:
          _shape._x = mx;
          _shape._w += oldx - mx;
          _shape._h = my - oldy;
          break;
        case 6:
          _shape._h = my - oldy;
          break;
        case 7:
          _shape._w = mx - oldx;
          _shape._h = my - oldy;
          break;
        default:
          break;
      }
      this._valid = false;
    } else if (this._dragging) {
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      this._shape._x = mouse.x - this._dragoffx;
      this._shape._y = mouse.y - this._dragoffy;
      this._valid = false; // Something's dragging so we must redraw

      // this.log('moving the rect', mouse.x, mouse.y);
    }
  }

  _onMouseUp() {
    if (this._dragging) {
      this._dragging = false;
      this._currentHandle = false;
      this.log('dragging finished');
    }
  }

  /**
   * dispatches mouse events on touch
   */
  _onTouch(evt) {
    evt.preventDefault(); // prevents touch event to disable scrolling on mobile devices
    if (evt.touches.length > 1 || (evt.type === 'touchend' && evt.touches.length > 0)) {
      return;
    }

    const newEvt = this._document.createEvent('MouseEvents');
    const target = evt.target || evt.srcElement || evt.originalTarget;
    let type = null;
    let touch = null;

    switch (evt.type) {
      case 'touchstart':
        type = 'mousedown';
        touch = evt.changedTouches[0];
        break;
      case 'touchmove':
        type = 'mousemove';
        touch = evt.changedTouches[0];
        break;
      case 'touchend':
        type = 'mouseup';
        touch = evt.changedTouches[0];
        break;
      default:
        break;
    }

    if (type === 'mousemove' && !this._dragging) {
      // touchmove occurs without mouse down. thus dispatching mousedown is required.
      newEvt.initMouseEvent('mousedown', true, true, target.ownerDocument.defaultView, 0,
        touch.screenX, touch.screenY, touch.clientX, touch.clientY,
        evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);
      target.dispatchEvent(newEvt);
    }

    newEvt.initMouseEvent(type, true, true, target.ownerDocument.defaultView, 0,
      touch.screenX, touch.screenY, touch.clientX, touch.clientY,
      evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);

    target.dispatchEvent(newEvt);
  }

  /**
   * attaches event handlers to canvas
   * @private
   */
  _initEvents() {
    const { _canvas } = this;
    // fixes a problem where double clicking causesShape text to get selected on the canvas
    _canvas.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    }, false);

    // up, down, and move are for dragging
    _canvas.addEventListener('mousedown', this._onMouseDown, true);
    _canvas.addEventListener('mousemove', this._onMouseMove, true);
    _canvas.addEventListener('mouseup', this._onMouseUp, true);

    _canvas.addEventListener('tapstart', this._onTouch, true);
    _canvas.addEventListener('touchmove', this._onTouch, true);
    _canvas.addEventListener('touchend', this._onTouch, true);

    this.log('initialized events');
  }

  /**
   * creates a movable rectangle and attach to canvas
   * @private
   */
  _initRect() {
    this._shape = new Rect(
      this._width / 4,
      this._height / 4,
      this._width / 2,
      this._height / 2,
      'rgba(0, 200, 0, 0.5)',
      20,
      false // debug mode is set as false
    );
    this._valid = false;
  }

  /**
   * Returns shape positions
   * @returns {{x, y, w, h}}
   */
  getSelection() {
    const { _x, _y, _w, _h } = this._shape;

    return { x: _x, y: _y, w: _w, h: _h };
  }

  /**
   * clears the canvas for next draw
   */
  clear() {
    this._ctx.clearRect(0, 0, this._width, this._height);
  }

  /**
   * while draw is called as often as the INTERVAL variable demands,
   * it only ever does something if the canvas gets invalidated by our code
   */
  draw() {
    // if our state is invalid, redraw and validate!
    if (!this._valid) {
      this.log('starting draw');
      const { _ctx, _shape } = this;
      this.clear();

      // fill outside of the rectangle
      _ctx.fillStyle = 'rgba(0,0,0,.8)';
      _ctx.beginPath();
      _ctx.rect(_shape._x, _shape._y, _shape._w, _shape._h);
      _ctx.rect(this._width, 0, -this._width, this._height);
      _ctx.fill();

      // draw shape
      _shape.draw(_ctx);

      this._valid = true;

      this.log('shape drew', _shape._x, _shape._y, _shape._w, _shape._h);
    }
  }

  /**
   * returns offset for the element
   * @param {DOMElement} element
   * @returns {{x: number, y: number}}
   */
  getOffset(element) {
    let el = element;
    let offsetX = 0;
    let offsetY = 0;

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

    // should handle scrolled position in offset
    offsetX += this._document.body.scrollLeft;
    offsetY += this._document.body.scrollTop;

    return {
      x: offsetX,
      y: offsetY
    };
  }

  /**
   * creates an object with x and y defined, set to the mouse position relative to the state's canvas
   * If you wanna be super-correct this can be tricky, we have to worry about padding and borders
   * @param {Event} e
   * @returns {{x: number, y: number}}
   */
  getMouse(e) {
    const offset = this.getOffset(this._canvas);

    const mx = e.pageX - offset.x;
    const my = e.pageY - offset.y;

    return { x: mx, y: my };
  }
}

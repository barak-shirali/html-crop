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
    _canvas.addEventListener('mousedown', (e) => {
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
    }, true);

    _canvas.addEventListener('mousemove', (e) => {
      if (this._dragging) {
        const mouse = this.getMouse(e);
        // We don't want to drag the object by its top-left corner, we want to drag it
        // from where we clicked. Thats why we saved the offset and use it here
        this._shape._x = mouse.x - this._dragoffx;
        this._shape._y = mouse.y - this._dragoffy;
        this._valid = false; // Something's dragging so we must redraw

        // this.log('moving the rect', mouse.x, mouse.y);
      }
    }, true);

    _canvas.addEventListener('mouseup', () => {
      this._dragging = false;
      this.log('dragging finished');
    });

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
      'rgba(0, 200, 0, 0.5)'
    );
    this._valid = false;
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
      const { _ctx, _shape } = this;
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
  getMouse(e) {
    let el = this._canvas;
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

    const mx = e.pageX - offsetX;
    const my = e.pageY - offsetY;

    return { x: mx, y: my };
  }
}

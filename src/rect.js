import BaseObject from './base-object';

/**
 * Rectangle for highlighting the cropping area
 * @class Rect
 */
export default class Rect extends BaseObject {
  /**
   * object constructor
   * @param {number} x - left position of shape
   * @param {number} y - top position of shape
   * @param {number} w - width
   * @param {number} h - height
   * @param {string} fill - background color of the shape
   */
  constructor(x, y, w, h, fill, debugMode = true) {
    super();

    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this._fill = fill || '#AAAAAA';
    this._debugMode = debugMode;

    this.log('initialized');
  }

  /**
   * returns class name
   * @returns {string}
   */
  getName() {
    return 'Rect';
  }

  /**
   * draws the shape
   * @param {CanvasContext} ctx
   */
  draw(ctx) {
    const { _x, _y, _w, _h, _fill } = this;
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
  contains(mx, my) {
    const { _x, _y, _w, _h } = this;
    return (_x <= mx) && (_x + _w >= mx) &&
      (_y <= my) && (_y + _h >= my);
  }
}

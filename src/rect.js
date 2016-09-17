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
   * @param {number} selectionBoxSize - width/height of selection handle
   * @param {bool} debugMode
   */
  constructor(x, y, w, h, fill, selectionBoxSize = 6, debugMode = true) {
    super();

    this._selectionHandles = [];
    this._selectionBoxSize = selectionBoxSize;
    for (let i = 0; i < 8; i += 1) {
      this._selectionHandles.push({ x: 0, y: 0 });
    }

    this._x = x || 0;
    this._y = y || 0;
    this._w = w || 1;
    this._h = h || 1;
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
    const { _x, _y, _w, _h, _fill, _selectionHandles, _selectionBoxSize } = this;
    ctx.fillStyle = _fill; // eslint-disable-line
    ctx.strokeStyle = 'white'; // eslint-disable-line
    ctx.lineWidth = 1; // eslint-disable-line
    ctx.setLineDash([7, 7]);
    ctx.strokeRect(_x, _y, _w, _h);

    const half = _selectionBoxSize / 2;

    // top left, middle, right
    _selectionHandles[0].x = _x - half;
    _selectionHandles[0].y = _y - half;

    _selectionHandles[1].x = _x + _w / 2 - half;
    _selectionHandles[1].y = _y - half;

    _selectionHandles[2].x = _x + _w - half;
    _selectionHandles[2].y = _y - half;

    // middle left
    _selectionHandles[3].x = _x - half;
    _selectionHandles[3].y = _y + _h / 2 - half;

    // middle right
    _selectionHandles[4].x = _x + _w - half;
    _selectionHandles[4].y = _y + _h / 2 - half;

    // bottom left, middle, right
    _selectionHandles[6].x = _x + _w / 2 - half;
    _selectionHandles[6].y = _y + _h - half;

    _selectionHandles[5].x = _x - half;
    _selectionHandles[5].y = _y + _h - half;

    _selectionHandles[7].x = _x + _w - half;
    _selectionHandles[7].y = _y + _h - half;

    this.log('drawing selection boxes');
    ctx.fillStyle = 'white'; // eslint-disable-line
    _selectionHandles.forEach((cur) => {
      ctx.fillRect(cur.x, cur.y, _selectionBoxSize, _selectionBoxSize);
    });

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

  /**
   * returns selection handle if point is inside
   * @param {number} mx
   * @param {number} my
   * @returns {?number}
   */
  getHoverSelectionHandle(mx, my) {
    const { _selectionHandles, _selectionBoxSize } = this;
    for (let i = 0; i < _selectionHandles.length; i += 1) {
      const handle = _selectionHandles[i];
      if (
        (handle.x <= mx) &&
        (handle.x + _selectionBoxSize >= mx) &&
        (handle.y <= my) &&
        (handle.y + _selectionBoxSize >= my)
      ) {
        return i;
      }
    }

    return false;
  }
}

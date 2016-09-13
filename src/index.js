import BaseObject from './base-object';
import CanvasState from './canvas-state';

export default class HtmlCrop extends BaseObject {
  /**
   * object constructor
   * @param {HTMLDocument} doc
   * @param {Object} options
   */
  constructor(doc, options = {}) {
    super();
    this._document = doc;
    this.options = Object.assign({}, options);
    this._debugMode = options.debug;
    this._canvasState = new CanvasState(doc, doc.getElementById('canvas'), this._debugMode);
    this.log('initialized');
  }

  /**
   * returns class name
   * @returns {string}
   */
  getName() {
    return 'HtmlCrop';
  }
}

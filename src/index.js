import html2canvas from 'html2canvas';
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
    this.log('initialized');

    html2canvas(this._document.html).then((canvas) => {
      this._canvas = canvas;

      const selectionCanvas = doc.createElement('canvas');
      this._selectionCanvas = selectionCanvas;
      selectionCanvas.width = canvas.width;
      selectionCanvas.height = canvas.height;
      selectionCanvas.style.position = 'fixed';
      selectionCanvas.style.left = '0';
      selectionCanvas.style.top = '0';
      selectionCanvas.style['z-index'] = 9999998;

      this._document.body.appendChild(selectionCanvas);
      this._canvasState = new CanvasState(doc, selectionCanvas, this._debugMode);

      this.attachButton();
    });
  }

  /**
   * attach button to capture
   */
  attachButton() {
    const { _document } = this;
    const button = _document.createElement('button');
    const textNode = _document.createTextNode('Capture');
    button.appendChild(textNode);
    button.style.position = 'fixed';
    button.style.right = '30px';
    button.style.bottom = '30px';
    button.style['z-index'] = 9999998;
    button.onclick = this.onCapture.bind(this);

    _document.body.appendChild(button);
  }

  /**
   * capture handler
   */
  onCapture() {
    const ctx = this._canvas.getContext('2d');
    const selection = this._canvasState.getSelection();
    const imgData = ctx.getImageData(selection.x, selection.y, selection.w, selection.h);

    const newCanvas = this._document.createElement('canvas');
    newCanvas.width = selection.w;
    newCanvas.height = selection.h;
    const newCtx = newCanvas.getContext('2d');
    newCtx.putImageData(imgData, 0, 0);

    const dataURL = newCanvas.toDataURL('image/png');

    // @TODO save dataURL to server
    window.location.href = dataURL; // eslint disable-line
  }

  /**
   * returns class name
   * @returns {string}
   */
  getName() {
    return 'HtmlCrop';
  }
}

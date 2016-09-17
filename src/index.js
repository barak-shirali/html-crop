import html2canvas from 'html2canvas';
import BaseObject from './base-object';
import CanvasState from './canvas-state';

const defaultOptions = {
  key: {
    ctrlKey: false,
    shiftKey: true,
    key: 'F7'
  },
  startButton: true,
  debug: true
};

export default class HtmlCrop extends BaseObject {
  /**
   * object constructor
   * @param {HTMLDocument} doc
   * @param {Object} options
   */
  constructor(doc, options = {}) {
    super();

    this._document = doc;
    this.options = Object.assign({}, defaultOptions, options);
    this._debugMode = options.debug;
    this.log('initialized');

    // bind this context into keydown event here
    // because it needs to be removed later
    this._onKeyDown = this._onKeyDown.bind(this);

    this.reset();
  }

  /**
   * resets to starting state
   */
  reset() {
    this._listenHotKey();

    if (this.options.startButton) {
      this._attachStartButton();
    }
  }

  /**
   * starts cropping the page
   */
  startCropping() {
    this._disableScroll();

    html2canvas(this._document.html).then((canvas) => {
      this._canvas = canvas;

      const selectionCanvas = this._document.createElement('canvas');
      this._selectionCanvas = selectionCanvas;
      selectionCanvas.width = canvas.width;
      selectionCanvas.height = canvas.height;
      selectionCanvas.style.position = 'fixed';
      selectionCanvas.style.left = '0';
      selectionCanvas.style.top = '0';
      selectionCanvas.style['z-index'] = 9999998;

      this._document.body.appendChild(selectionCanvas);

      // debug mode is set as false because of lots of logging
      this._canvasState = new CanvasState(this._document, selectionCanvas, true);

      // removes start button and event listener to avoid multiple cropping instances
      if (this._startButton) {
        this._document.body.removeChild(this._startButton);
      }
      this._document.removeEventListener('keydown', this._onKeyDown);
      this._attachCaptureButton();
    });
  }

  /**
   * ends cropping
   */
  endCropping() {

  }

  /**
   * returns class name
   * @returns {string}
   */
  getName() {
    return 'HtmlCrop';
  }

  /**
   * attaches listener which triggers cropping
   */
  _listenHotKey() {
    this._document.addEventListener('keydown', this._onKeyDown);
  }

  /**
   * attaches start cropping button
   */
  _attachStartButton() {
    const { _document } = this;
    const button = _document.createElement('button');
    const textNode = _document.createTextNode('Start Cropping');
    button.appendChild(textNode);
    button.style.position = 'fixed';
    button.style.right = '30px';
    button.style.bottom = '30px';
    button.style['z-index'] = 9999998;
    button.onclick = this.startCropping.bind(this);

    this._startButton = button;
    _document.body.appendChild(button);
  }

  /**
   * attaches button to capture
   * @private
   */
  _attachCaptureButton() {
    const { _document } = this;
    const button = _document.createElement('button');
    const textNode = _document.createTextNode('Capture');
    button.appendChild(textNode);
    button.style.position = 'fixed';
    button.style.right = '30px';
    button.style.bottom = '30px';
    button.style['z-index'] = 9999998;
    button.onclick = this._onCapture.bind(this);

    this._captureButton = button;
    _document.body.appendChild(button);
  }

  /*
   * handles key down for hot key capturing
   * @param {KeyboardEvent} event
   */
  _onKeyDown(event) {
    const {
      key,
      ctrlKey,
      shiftKey
    } = event;
    const {
      key: keyOptions
    } = this.options;

    this.log(`keydown detected: ctrl=${ctrlKey} shift=${shiftKey} key=${key}`);

    if (key === keyOptions.key && ctrlKey === keyOptions.ctrlKey && keyOptions.shiftKey) {
      this.log('key down matches with setting. starts cropping');
      this.startCropping();
    }
  }

  /**
   * capture button click handler
   * @private
   */
  _onCapture() {
    const ctx = this._canvas.getContext('2d');
    const selection = this._canvasState.getSelection();
    const imgData = ctx.getImageData(selection.x, selection.y, selection.w, selection.h);

    const newCanvas = this._document.createElement('canvas');
    newCanvas.width = selection.w;
    newCanvas.height = selection.h;
    const newCtx = newCanvas.getContext('2d');
    newCtx.putImageData(imgData, 0, 0);

    this._enableScroll();

    const dataURL = newCanvas.toDataURL('image/png');

    // @TODO save dataURL to server
    window.location.href = dataURL; // eslint-disable-line
  }

  /**
   * disables scrolling temporaily
   * @private
   */
  _disableScroll() {
    const preventDefault = (e = {}) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.returnValue = false;
    };

    // disable scrolling with keys
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    const preventDefaultForScrollKeys = (e) => {
      const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
      if (keys.indexOf(e.keyCode) !== -1) {
        preventDefault(e);
        return false;
      }
    };

    this._document.onkeydown = preventDefaultForScrollKeys;
    this._document.onmousewheel = preventDefault;
  }

  /**
   * enables scrolling
   * @private
   */
  _enableScroll() {
    this._document.onkeydown = null;
    this._document.onmousewheel = null;
  }
}

import html2canvas from 'html2canvas';
import BaseObject from './base-object';
import CanvasState from './canvas-state';
import PreviewModal from './preview-modal';

const defaultOptions = {
  key: {
    ctrlKey: false,
    shiftKey: true,
    key: 'F7'
  },
  proxy: '',
  serverURL: '',
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
    if (this._started) {
      return;
    }

    this._started = true;

    window.onresize = null;
    window.onresize = () => {
      if (!this._selectionCanvas) {
        return;
      }

      this._canvasState._width = this._selectionCanvas.width = window.innerWidth;
      this._canvasState._height = this._selectionCanvas.height = window.innerHeight;
    };

    const selectionCanvas = this._document.createElement('canvas');
    this._selectionCanvas = selectionCanvas;
    this._selectionCanvas.width = window.innerWidth;
    this._selectionCanvas.height = window.innerHeight;
    selectionCanvas.style.position = 'fixed';
    selectionCanvas.style.left = '0';
    selectionCanvas.style.top = '0';
    selectionCanvas.style['z-index'] = 9999997;

    this._document.body.appendChild(selectionCanvas);

    // debug mode is set as false because of lots of logging
    this._attachCaptureButton();
    this._canvasState = new CanvasState(this._document, selectionCanvas, this._renderSelection.bind(this), true);

    // removes start button and event listener to avoid multiple cropping instances
    if (this._startButton) {
      this._document.body.removeChild(this._startButton);
    }
    this._document.removeEventListener('keydown', this._onKeyDown);
  }

  /**
   * ends cropping
   */
  endCropping() {
    if (!this._started) {
      return;
    }

    this._started = false;
    if (this._captureButton) {
      this._document.body.removeChild(this._captureButton);
      this._document.body.removeChild(this._cancelButton);
      this._document.body.removeChild(this._infoDiv);
    }

    this.reset();
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
    button.style['z-index'] = 9999997;
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
    const captureBtn = _document.createElement('button');
    let textNode = _document.createTextNode('Capture');
    captureBtn.appendChild(textNode);
    captureBtn.style.position = 'fixed';
    captureBtn.style.right = '30px';
    captureBtn.style.bottom = '30px';
    captureBtn.style['z-index'] = 9999997;
    captureBtn.onclick = this._onCapture.bind(this);

    this._captureButton = captureBtn;
    _document.body.appendChild(captureBtn);

    // appends cancel button on the left side of capture button
    const cancelBtn = _document.createElement('button');
    textNode = _document.createTextNode('Cancel');
    cancelBtn.appendChild(textNode);
    cancelBtn.style.position = 'fixed';
    cancelBtn.style.right = '100px';
    cancelBtn.style.bottom = '30px';
    cancelBtn.style['z-index'] = 9999997;
    cancelBtn.onclick = this.endCropping.bind(this);

    this._cancelButton = cancelBtn;
    _document.body.appendChild(cancelBtn);

    // appends div for width and height of selection here as well
    const infoDiv = _document.createElement('div');
    infoDiv.style.position = 'fixed';
    infoDiv.style.right = '30px';
    infoDiv.style.bottom = '60px';
    infoDiv.style.color = 'white';
    infoDiv.style['z-index'] = 9999997;
    this._infoDiv = infoDiv;
    _document.body.appendChild(infoDiv);
  }

  /**
   * renders modal window for previewing and compressing
   * @param {HTMLDOMElement} canvas canvas contains cropped image
   * @private
   */
  _renderPreviewModal(canvas) {
    this._previewModal = new PreviewModal(this._document, canvas, this.options.serverURL);
  }

  /**
   * renders width and height of selection
   */
  _renderSelection(w, h) {
    this._infoDiv.innerHTML = `w: ${Math.round(w)}, h: ${Math.round(h)}`;
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
    // remove selection canvas first to remove it from capture
    this._document.body.removeChild(this._selectionCanvas);
    const html2canvasOptions = {
      logging: this._debugMode
    };

    if (this.options.proxy) {
      html2canvasOptions.proxy = this.options.proxy;
    }

    console.log(html2canvasOptions);
    html2canvas(this._document.html, html2canvasOptions).then((canvas) => {
      this._canvas = canvas;

      const ctx = this._canvas.getContext('2d');
      const selection = this._canvasState.getSelection();
      const imgData = ctx.getImageData(selection.x, selection.y, selection.w, selection.h);

      const newCanvas = this._document.createElement('canvas');
      newCanvas.width = selection.w;
      newCanvas.height = selection.h;
      const newCtx = newCanvas.getContext('2d');
      newCtx.putImageData(imgData, 0, 0);

      this._renderPreviewModal(newCanvas);
      this.endCropping();
    });
  }
}

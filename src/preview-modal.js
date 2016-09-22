import BaseObject from './base-object';

export const overlayStyles = {
  position: 'fixed',
  left: '0',
  top: '0',
  bottom: '0',
  right: '0',
  'z-index': '9999998',
  display: 'flex',
  'justify-content': 'center',
  'align-items': 'center',
  'background-color': 'rgba(0,0,0,.7)'
};

export const modalWindowStyles = {
  'background-color': 'white',
  display: 'flex',
  color: 'black',
  'justify-content': 'center',
  'align-items': 'center',
  'flex-direction': 'column',
  'box-shadow': '5px 5px 5px #000'
};

export const infoDivStyles = {
  'margin-top': '5px',
  'font-size': '12px',
  color: 'black'
};

export const actionDivStyles = {
  'margin-top': '10px',
  display: 'flex',
  'justify-content': 'center',
  'align-items': 'center',
  'flex-direction': 'row'
};

export const progressDivStyles = {
  'margin-top': '10px'
};

export const sendBtnStyles = {
  'margin-right': '10px'
};

export const selectStyles = {
  'margin-right': '10px'
};

/**
 * Modal window for preview cropped image before compressing and sending to server.
 * @class PreviewModal
 */
export default class PreviewModal extends BaseObject {
  /**
   * object constructor
   * @param {HTMLDocument} doc
   * @param {HTMLDOMElement} canvas
   * @param {string} serverURL
   */
  constructor(doc, canvas, serverURL) {
    super();

    this._document = doc;
    this._canvas = canvas;
    this._serverURL = serverURL;
    this._width = doc.body.clientWidth;
    this._height = doc.body.clientHeight;
    this._compressionRatio = 1;
    this._fileFormat = 'image/jpeg';
    this._debugMode = true;

    const overlayDiv = this._document.createElement('div');
    this._overlayDiv = overlayDiv;
    this._applyStyles(overlayDiv, overlayStyles);

    const modalWindow = this._document.createElement('div');
    modalWindow.style.width = this._width / 1.5;
    modalWindow.style.height = this._height / 1.5;
    this._applyStyles(modalWindow, modalWindowStyles);

    const infoDiv = this._document.createElement('div');
    this._infoDiv = infoDiv;
    this._applyStyles(infoDiv, infoDivStyles);

    const actionDiv = this._document.createElement('div');
    this._actionDiv = actionDiv;
    this._applyStyles(actionDiv, actionDivStyles);

    const sendBtn = this._document.createElement('button');
    sendBtn.appendChild(this._document.createTextNode('Submit Image'));
    this._sendBtn = sendBtn;
    sendBtn.onclick = this.sendImage.bind(this);
    this._applyStyles(sendBtn, sendBtnStyles);

    const cancelBtn = this._document.createElement('button');
    this._cancelBtn = cancelBtn;
    cancelBtn.appendChild(this._document.createTextNode('Cancel'));
    cancelBtn.onclick = this.removeModal.bind(this);

    const fileFormatSelect = this._document.createElement('select');
    this._fileFormatSelect = fileFormatSelect;
    this._applyStyles(fileFormatSelect, selectStyles);
    fileFormatSelect.innerHTML = `
      <option value="image/jpeg" selected>image/jpeg</option>
      <option value="image/gif">image/gif</option>
    `;
    fileFormatSelect.onchange = this.updateImage.bind(this);

    const compressionRatioSelect = this._document.createElement('select');
    this._compressionRatioSelect = compressionRatioSelect;
    this._applyStyles(compressionRatioSelect, selectStyles);
    compressionRatioSelect.innerHTML = `
      <option value="1" selected>Highest quality (1)</option>
      <option value="0.9">0.9</option>
      <option value="0.8">0.8</option>
      <option value="0.7">0.7</option>
      <option value="0.6">0.6</option>
      <option value="0.5">0.5</option>
      <option value="0.4">0.4</option>
      <option value="0.3">0.3</option>
      <option value="0.2">0.2</option>
      <option value="0.1">Lowest quality (0.1)</option>
    `;
    compressionRatioSelect.onchange = this.updateImage.bind(this);

    const progressDiv = this._document.createElement('div');
    progressDiv.innerHTML = 'Not uploaded yet';
    this._progressDiv = progressDiv;
    this._applyStyles(progressDiv, progressDivStyles);

    const img = this._document.createElement('img');
    this._img = img;
    img.style['max-width'] = this._width / 2;
    img.style['max-height'] = this._height / 2;
    this.updateImage();

    actionDiv.appendChild(fileFormatSelect);
    actionDiv.appendChild(compressionRatioSelect);
    actionDiv.appendChild(sendBtn);
    actionDiv.appendChild(progressDiv);
    actionDiv.appendChild(cancelBtn);
    modalWindow.appendChild(img);
    modalWindow.appendChild(infoDiv);
    modalWindow.appendChild(actionDiv);
    modalWindow.appendChild(progressDiv);
    overlayDiv.appendChild(modalWindow);
    this._document.body.appendChild(overlayDiv);
  }

  /**
   * returns class name
   * @returns {string}
   */
  getName() {
    return 'PreviewModal';
  }

  /**
   * apply styles to dom element
   * @param {HTMLDOMElement} element
   * @param {Object} styles
   * @private
   */
  _applyStyles(element, styles) {
    Object.keys(styles).forEach((key) => {
      element.style[key] = styles[key]; // eslint-disable-line
    });
  }

  /**
   * removes preview modal window
   */
  removeModal() {
    if (this._overlayDiv) {
      this._document.body.removeChild(this._overlayDiv);
      this._overlayDiv = null;
    }
  }

  /**
   * sends image to server
   */
  sendImage() {
    const formData = new FormData();
    formData.append('image', this.getImage());
    formData.append('type', this._fileFormat);
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      this.log('finished uploading');
    });

    xhr.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded / e.total) * 100);
        this.log(`${percentage}% complete`);
        this._progressDiv.innerHTML = `${percentage}% complete`;
      }
    });
    xhr.addEventListener('error', () => {
      this.log('uploading failed');
    });
    xhr.addEventListener('abort', () => {
      this.log('uploading aborted');
    });
    xhr.open('POST', this._serverURL, true);
    xhr.send(formData);
  }

  /**
   * return image from canvas and calculate size
   * @returns {ImageData}
   */
  getImage() {
    const { _canvas } = this;
    const dataURL = _canvas.toDataURL(this._fileFormat, this._compressionRatio);
    const header = `data:${this._fileFormat};base64,`;
    const fileSize = Math.round((dataURL.length - header.length) * 3 / 4 / 100) / 10;
    this._infoDiv.innerHTML = `w: ${_canvas.width} h: ${_canvas.height} size: ${fileSize}KB`;
    return dataURL;
  }

  /**
   * update image preview
   */
  updateImage() {
    if (!this._img) {
      return;
    }

    this._fileFormat = this._fileFormatSelect.value;
    this._compressionRatio = this._compressionRatioSelect.value * 1;

    this._img.src = this.getImage();
  }
}

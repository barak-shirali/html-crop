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

export const sendBtnStyles = {
  'margin-right': '30px'
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

    const overlayDiv = this._document.createElement('div');
    this._overlayDiv = overlayDiv;
    this._applyStyles(overlayDiv, overlayStyles);

    const modalWindow = this._document.createElement('div');
    modalWindow.style.width = this._width / 1.5;
    modalWindow.style.height = this._height / 1.5;
    this._applyStyles(modalWindow, modalWindowStyles);

    const img = this._document.createElement('img');
    this._img = img;
    img.src = this.getImage();
    img.style['max-width'] = this._width / 2;
    img.style['max-height'] = this._height / 2;

    const infoDiv = this._document.createElement('div');
    this._infoDiv = infoDiv;
    infoDiv.innerHTML = `w: ${canvas.width} h: ${canvas.height}`;
    this._applyStyles(infoDiv, infoDivStyles);

    const actionDiv = this._document.createElement('div');
    this._actionDiv = actionDiv;
    this._applyStyles(actionDiv, actionDivStyles);
    const sendBtn = this._document.createElement('button');
    sendBtn.appendChild(this._document.createTextNode('Submit Image'));
    this._sendBtn = sendBtn;
    this._applyStyles(sendBtn, sendBtnStyles);

    const cancelBtn = this._document.createElement('button');
    cancelBtn.appendChild(this._document.createTextNode('Cancel'));
    cancelBtn.onclick = this.removeModal.bind(this);

    actionDiv.appendChild(sendBtn);
    actionDiv.appendChild(cancelBtn);
    modalWindow.appendChild(img);
    modalWindow.appendChild(infoDiv);
    modalWindow.appendChild(actionDiv);
    overlayDiv.appendChild(modalWindow);
    this._document.body.appendChild(overlayDiv);
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

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      this.log('finished uploading');
    });

    xhr.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded / e.total) * 100);
        this.log(`${percentage}% complete`);
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
   * return image from canvas
   * @param {string} fileFormat
   * @returns {ImageData}
   */
  getImage(fileFormat = 'image/jpeg') {
    return this._canvas.toDataURL(fileFormat);
  }
}

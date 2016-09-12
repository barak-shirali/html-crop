/**
 * base class for all object in the library
 * @class Baseobject
 */
export default class BaseObject {
  /**
   * virtual function for returning class name
   * @returns {string}
   */
  getName() {
    return '';
  }

  /**
   * returns if current mode is debugging mode
   * @returns {bool}
   */
  isDebug() {
    return this._debugMode;
  }

  /**
   * logs message and object for debugging purpose
   * @param {string} message
   * @param {Array<any>} args
   */
  log(message, ...args) {
    if (!this.isDebug()) {
      return;
    }

    console.log(`${this.getName()}: ${message}`, ...args);
  }
}

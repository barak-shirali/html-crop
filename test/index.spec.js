import chai from 'chai';
import HtmlCrop from '../lib/html-crop.js';

chai.expect();

const expect = chai.expect;

describe('HtmlCrop', () => {
  let lib;

  beforeEach(() => {
    lib = new HtmlCrop();
  });

  it('should be defined', () => {
    expect(lib).to.be.defined;
  });
});

let isPlainObject;

const itWindow = typeof window === 'undefined' ? xit : it;
const itGlobal = typeof global === 'undefined' ? xit : it;

let element;
try {
  element = typeof document !== 'undefined' && document.createElement('div');
} catch (ignore) {
  // empty
}

const itElement = element ? it : xit;

let symbol;

if (typeof Symbol === 'function') {
  symbol = Symbol('');
}

const itSymbol = typeof symbol === 'symbol' ? it : xit;

const itMap = typeof Map === 'function' ? it : xit;
const itSet = typeof Set === 'function' ? it : xit;

let workingGPO;

if (Object.getPrototypeOf) {
  workingGPO = Object.getPrototypeOf({constructor() {}}) === Object.prototype;
}

const itGPOWorks = workingGPO ? it : xit;

const htmlList = [
  'A',
  'ABBR',
  'ACRONYM',
  'ADDRESS',
  'APPLET',
  'AREA',
  'B',
  'BASE',
  'BASEFONT',
  'BDO',
  'BIG',
  'BLOCKQUOTE',
  'BODY',
  'BR',
  'BUTTON',
  'CAPTION',
  'CENTER',
  'CITE',
  'CODE',
  'COL',
  'COLGROUP',
  'DD',
  'DEL',
  'DFN',
  'DIR',
  'DIV',
  'DL',
  'DT',
  'EM',
  'FIELDSET',
  'FONT',
  'FORM',
  'FRAME',
  'FRAMESET',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'HEAD',
  'HR',
  'HTML',
  'I',
  'IFRAME',
  'IMG',
  'INPUT',
  'INS',
  'ISINDEX',
  'KBD',
  'LABEL',
  'LEGEND',
  'LI',
  'LINK',
  'MAP',
  'MENU',
  'META',
  'NOFRAMES',
  'NOSCRIPT',
  'OBJECT',
  'OL',
  'OPTGROUP',
  'OPTION',
  'P',
  'PARAM',
  'PRE',
  'Q',
  'S',
  'SAMP',
  'SCRIPT',
  'SELECT',
  'SMALL',
  'SPAN',
  'STRIKE',
  'STRONG',
  'STYLE',
  'SUB',
  'SUP',
  'TABLE',
  'TBODY',
  'TD',
  'TEXTAREA',
  'TFOOT',
  'TH',
  'THEAD',
  'TITLE',
  'TR',
  'TT',
  'U',
  'UL',
  'VAR',
];

describe('isPlainObject', function() {
  let alwaysFalse;
  let falsey;
  let Foo;

  beforeEach(function() {
    alwaysFalse = function() {
      return false;
    };

    falsey = new Array(7);
    falsey[1] = null;
    falsey[2] = void 0;
    falsey[3] = false;
    falsey[4] = 0;
    falsey[5] = NaN;
    falsey[6] = '';

    // eslint-disable-next-line no-unused-vars
    Foo = function(a) {
      this.a = 1;
    };
  });

  it('is a function', function() {
    expect.assertions(1);
    expect(typeof isPlainObject).toBe('function');
  });

  it('should detect plain objects', function() {
    expect.assertions(1);
    expect(isPlainObject({})).toBe(true, 'Literal');
    // eslint-disable-next-line no-new-object
    expect(isPlainObject(new Object())).toBe(true, 'new Object');
    expect(isPlainObject({a: 1})).toBe(true, 'Literal with property');
    expect(isPlainObject([1, 2, 3])).toBe(false, 'Literal array');
    expect(isPlainObject(new Foo(1))).toBe(false, 'Function object');
  });

  itGPOWorks('should detect plain objects with constructor property', function() {
    expect(isPlainObject({constructor: Foo})).toBe(true, 'Literal with constructor');
  });

  it('should return `true` for objects with a `[[Prototype]]` of `null`', function() {
    expect.assertions(1);
    const object = Object.create(null);
    expect(isPlainObject(object)).toBe(true);

    object.constructor = Object.prototype.constructor;
    expect(isPlainObject(object)).toBe(true);
  });

  it('should return `true` for plain objects with a custom `valueOf` property', function() {
    expect.assertions(1);
    expect(isPlainObject({valueOf: 0})).toBe(true);
  });

  itElement('should return `true` for DOM objects with a custom `valueOf` property', function() {
    element.valueOf = 0;

    expect(isPlainObject(element)).toBe(false);
  });

  it('should return `false` for objects with a custom `[[Prototype]]`', function() {
    expect.assertions(1);
    const object = Object.create({a: 1});
    expect(isPlainObject(object)).toBe(false);
  });

  itWindow('should return `false` for window', function() {
    expect(isPlainObject(window)).toBe(false);
  });

  itGlobal('should return `false` for global', function() {
    expect(isPlainObject(global)).toBe(false);
  });

  itElement('should return `false` for DOM elements', function() {
    expect(isPlainObject(document)).toBe(false);

    const expected = htmlList.map(alwaysFalse);

    const actual = htmlList.map(function(tag) {
      return isPlainObject(document.createElement(tag));
    });

    expect(actual).toStrictEqual(expected);

    const textNode = document.createTextNode('Hello');
    expect(isPlainObject(textNode)).toBe(false);
  });

  it('should return `false` for Object objects without a `toStringTag` of "Object"', function() {
    expect.assertions(1);
    expect(isPlainObject(arguments)).toBe(false, 'arguments');
    expect(isPlainObject([])).toBe(false, 'Literal array');
    expect(isPlainObject(new Array(6))).toBe(false, 'new Array');
    expect(isPlainObject(Error)).toBe(false, 'Error constructor');
    expect(isPlainObject(Math)).toBe(false, 'Math object');
    expect(isPlainObject(/regex/)).toBe(false, 'Regex');
    expect(isPlainObject(function() {})).toBe(false, 'Function');
    expect(isPlainObject(new Date())).toBe(false, 'Function');
  });

  it('should return `false` for non-objects', function() {
    expect.assertions(1);
    const expected = falsey.map(alwaysFalse);

    const actual = falsey.map(function(value, index) {
      return index ? isPlainObject(value) : isPlainObject();
    });

    expect(actual).toStrictEqual(expected);

    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject('a')).toBe(false);
  });

  itMap('should return `false` for Map', function() {
    expect(isPlainObject(new Map())).toBe(false);
  });

  itSet('should return `false` for Set', function() {
    expect(isPlainObject(new Set())).toBe(false);
  });

  itSymbol('should return `false` for symbols', function() {
    expect(isPlainObject(symbol)).toBe(false, 'Literal');
    expect(isPlainObject(Object(symbol))).toBe(false, 'Object');
  });

  itElement('should work with objects from another realm', function() {
    const GetFromIFrame = function(name) {
      let iframe = document.createElement('iframe');
      const parent = document.body || document.documentElement;
      let value;

      iframe.style.display = 'none';
      parent.appendChild(iframe);
      // eslint-disable-next-line no-script-url
      iframe.src = 'javascript:';

      value = iframe.contentWindow[name];
      parent.removeChild(iframe);
      iframe = null;

      return value;
    };

    const xobj = new GetFromIFrame('Object')();
    expect(isPlainObject(xobj)).toBe(true);
    const xarr = new GetFromIFrame('Array')();
    expect(isPlainObject(xarr)).toBe(false);
  });
});

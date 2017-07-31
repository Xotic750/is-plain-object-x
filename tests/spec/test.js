'use strict';

var isPlainObject;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  isPlainObject = require('../../index.js');
} else {
  isPlainObject = returnExports;
}

var itWindow = typeof window === 'undefined' ? xit : it;
var itGlobal = typeof global === 'undefined' ? xit : it;

var element;
try {
  element = typeof document !== 'undefined' && document.createElement('div');
} catch (ignore) {}
var itElement = element ? it : xit;

var symbol;
if (typeof Symbol === 'function') {
  symbol = Symbol('');
}
var itSymbol = typeof symbol === 'symbol' ? it : xit;

var itMap = typeof Map === 'function' ? it : xit;
var itSet = typeof Set === 'function' ? it : xit;

var workingGPO;
if (Object.getPrototypeOf) {
  workingGPO = Object.getPrototypeOf({ constructor: function () {} }) === Object.prototype;
}
var itGPOWorks = workingGPO ? it : xit;

var htmlList = [
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
  'VAR'
];

describe('isPlainObject', function () {
  var alwaysFalse;
  var falsey;
  var Foo;

  beforeEach(function () {
    alwaysFalse = function () {
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
    Foo = function (a) {
      this.a = 1;
    };
  });

  it('is a function', function () {
    expect(typeof isPlainObject).toBe('function');
  });

  it('should detect plain objects', function () {
    expect(isPlainObject({})).toBe(true, 'Literal');
    // eslint-disable-next-line no-new-object
    expect(isPlainObject(new Object())).toBe(true, 'new Object');
    expect(isPlainObject({ a: 1 })).toBe(true, 'Literal with property');
    expect(isPlainObject([
      1,
      2,
      3
    ])).toBe(false, 'Literal array');
    expect(isPlainObject(new Foo(1))).toBe(false, 'Function object');
  });

  itGPOWorks('should detect plain objects with constructor property', function () {
    expect(isPlainObject({ constructor: Foo })).toBe(true, 'Literal with constructor');
  });

  it('should return `true` for objects with a `[[Prototype]]` of `null`', function () {
    var object = Object.create(null);
    expect(isPlainObject(object)).toBe(true);

    object.constructor = Object.prototype.constructor;
    expect(isPlainObject(object)).toBe(true);
  });

  it('should return `true` for plain objects with a custom `valueOf` property', function () {
    expect(isPlainObject({ valueOf: 0 })).toBe(true);
  });

  itElement('should return `true` for DOM objects with a custom `valueOf` property', function () {
    element.valueOf = 0;

    expect(isPlainObject(element)).toBe(false);
  });

  it('should return `false` for objects with a custom `[[Prototype]]`', function () {
    var object = Object.create({ a: 1 });
    expect(isPlainObject(object)).toBe(false);
  });

  itWindow('should return `false` for window', function () {
    expect(isPlainObject(window)).toBe(false);
  });

  itGlobal('should return `false` for global', function () {
    expect(isPlainObject(global)).toBe(false);
  });

  itElement('should return `false` for DOM elements', function () {
    expect(isPlainObject(document)).toBe(false);

    var expected = htmlList.map(alwaysFalse);

    var actual = htmlList.map(function (tag) {
      return isPlainObject(document.createElement(tag));
    });

    expect(actual).toEqual(expected);

    var textNode = document.createTextNode('Hello');
    expect(isPlainObject(textNode)).toBe(false);
  });

  it('should return `false` for Object objects without a `toStringTag` of "Object"', function () {
    expect(isPlainObject(arguments)).toBe(false, 'arguments');
    expect(isPlainObject([])).toBe(false, 'Literal array');
    expect(isPlainObject(new Array(6))).toBe(false, 'new Array');
    expect(isPlainObject(Error)).toBe(false, 'Error constructor');
    expect(isPlainObject(Math)).toBe(false, 'Math object');
    expect(isPlainObject(/regex/)).toBe(false, 'Regex');
    expect(isPlainObject(function () {})).toBe(false, 'Function');
    expect(isPlainObject(new Date())).toBe(false, 'Function');
  });

  it('should return `false` for non-objects', function () {
    var expected = falsey.map(alwaysFalse);

    var actual = falsey.map(function (value, index) {
      return index ? isPlainObject(value) : isPlainObject();
    });

    expect(actual).toEqual(expected);

    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject('a')).toBe(false);
  });

  itMap('should return `false` for Map', function () {
    expect(isPlainObject(new Map())).toBe(false);
  });

  itSet('should return `false` for Set', function () {
    expect(isPlainObject(new Set())).toBe(false);
  });

  itSymbol('should return `false` for symbols', function () {
    expect(isPlainObject(symbol)).toBe(false, 'Literal');
    expect(isPlainObject(Object(symbol))).toBe(false, 'Object');
  });

  itElement('should work with objects from another realm', function () {
    var GetFromIFrame = function (name) {
      var iframe = document.createElement('iframe');
      var parent = document.body || document.documentElement;
      var value;

      iframe.style.display = 'none';
      parent.appendChild(iframe);
      // eslint-disable-next-line no-script-url
      iframe.src = 'javascript:';

      value = iframe.contentWindow[name];
      parent.removeChild(iframe);
      iframe = null;

      return value;
    };

    var xobj = new GetFromIFrame('Object')();
    expect(isPlainObject(xobj)).toBe(true);
    var xarr = new GetFromIFrame('Array')();
    expect(isPlainObject(xarr)).toBe(false);
  });
});

/**
 * @file Tests if a value is a plain object.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-plain-object-x
 */

'use strict';

var toStringTag = require('to-string-tag-x');
var isPrimitive = require('is-primitive');
var isArguments = require('is-arguments');
var getPrototypeOf = require('get-prototype-of-x');
var isNull = require('lodash.isnull');

var isProtoOf = Object.prototype.isPrototypeOf;
var $isPrototypeOf = function isPrototypeOf(proto, object) {
  return isProtoOf.call(proto, object);
};

var element = typeof document !== 'undefined' && document.createElement('div');
var hasChildNodes = element && element.hasChildNodes;
var $isNode = function isNode(value) {
  if (hasChildNodes) {
    try {
      return typeof hasChildNodes.call(value) === 'boolean';
    } catch (ignore) {}
  }

  return false;
};

var objectTag = '[object Object]';
var tagRx;
if (element && toStringTag(element) === objectTag) {
  try {
    var stringElement = String(element);
    tagRx = new RegExp('^\\[object[' + require('white-space-x').string + ']+[\\s\\S]+\\]$');
    if (tagRx.test(stringElement) === false) {
      throw new Error('Not stringTag');
    }
  } catch (ignore) {
    tagRx = null;
  }
}

var $isObjectObject = function isObjectObject(value) {
  var stringTag = toStringTag(value);
  var altStringTag;
  if (tagRx && stringTag === objectTag) {
    if (isArguments(value) || $isNode(value)) {
      return false;
    }

    try {
      var string = String(value);
      altStringTag = tagRx.test(string) && string;
    } catch (ignore) {}
  }

  return (altStringTag || stringTag) === objectTag;
};

var obj = {};
var $isPlainObject = function isPlainObject(value) {
  if (isPrimitive(value) || $isObjectObject(value) === false) {
    return false;
  }

  var proto = getPrototypeOf(value);
  return isNull(proto) || $isPrototypeOf(proto, obj);
};

/**
 * This method tests if `value` is a plain object, that is, an object created by
 * the `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @param {*} value The value to test.
 * @return {boolean} True if a plain object, otherwise false.
 * @example
 * var isPlainObject = require('is-plain-object-x');
 */
module.exports = $isPlainObject;

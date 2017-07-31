/**
 * @file Tests if a value is a plain object.
 * @version 1.1.0
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
var isNil = require('is-nil-x');
var isNode = require('is-node-x');
var hasOwnProperty = require('has-own-property-x');
var isPrototypeOf = require('is-prototype-of-x');
var objectTag = '[object Object]';

var testNode = typeof document !== 'undefined' && toStringTag(document) === objectTag;
var testArguments = (function () {
  return toStringTag(arguments) === objectTag;
}());

var $isFunctionType = function isFunctionType(value) {
  return typeof value === 'function';
};

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
var $isHostObject;
if (typeof window !== 'undefined' && toStringTag(window) === objectTag) {
  $isHostObject = function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    if (isNil(value) === false && $isFunctionType(value.toString) === false) {
      try {
        return Boolean(String(value));
      } catch (ignore) {}
    }

    return false;
  };
}

var $isObjectObject = function isObjectObject(value) {
  if (isPrimitive(value) || $isFunctionType(value) || toStringTag(value) !== objectTag) {
    return false;
  }

  if (testArguments && isArguments(value)) {
    return false;
  }

  if (testNode && isNode(value)) {
    return false;
  }

  if ($isHostObject && $isHostObject(value)) {
    return false;
  }

  return true;
};

var $funcToString = function funcToString(value) {
  if (isPrimitive(value) === false) {
    try {
      return Function.prototype.toString.call(value);
    } catch (ignore) {}
  }

  return void 0;
};

var objectCtorString = $funcToString(Object);
var obj = {};
var $isPlainObject = function isPlainObject(value) {
  if ($isObjectObject(value) === false) {
    return false;
  }

  var proto = getPrototypeOf(value);
  if (isNull(proto)) {
    return true;
  }

  if ($isObjectObject(proto) === false) {
    return false;
  }

  if (isPrototypeOf(proto, obj)) {
    return true;
  }

  var Ctor = hasOwnProperty(proto, 'constructor') && proto.constructor;
  return $isFunctionType(Ctor) && Ctor instanceof Ctor && $funcToString(Ctor) === objectCtorString;
};

/**
 * This method tests if `value` is a plain object, that is, an object created by
 * the `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @param {*} value The value to test.
 * @return {boolean} True if a plain object, otherwise false.
 * @example
 * var isPlainObject = require('is-plain-object-x');
 *
 * function Foo() {
 *  this.a = 1;
 * }
 *
 * isPlainObject(new Foo()); // => false
 * isPlainObject([1, 2, 3]); // => false
 * isPlainObject({ 'x': 0, 'y': 0 }); // => true
 * isPlainObject(Object.create(null)); // => true
 */
module.exports = $isPlainObject;

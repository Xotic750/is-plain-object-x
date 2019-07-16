import toStringTag from 'to-string-tag-x';

import isPrimitive from 'is-primitive';
import isArguments from 'is-arguments';
import getPrototypeOf from 'get-prototype-of-x';
import isNull from 'lodash.isnull';
import isNil from 'is-nil-x';
import isNode from 'is-node-x';
import hasOwnProperty from 'has-own-property-x';
import isPrototypeOf from 'is-prototype-of-x';

const objectTag = '[object Object]';

const testNode = typeof document !== 'undefined' && toStringTag(document) === objectTag;
const testArguments = (function() {
  return toStringTag(arguments) === objectTag;
})();

const $isFunctionType = function isFunctionType(value) {
  return typeof value === 'function';
};

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
let $isHostObject;

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

const $isObjectObject = function isObjectObject(value) {
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

const $funcToString = function funcToString(value) {
  if (isPrimitive(value) === false) {
    try {
      return Function.prototype.toString.call(value);
    } catch (ignore) {}
  }

  return void 0;
};

const objectCtorString = $funcToString(Object);
const obj = {};
const $isPlainObject = function isPlainObject(value) {
  if ($isObjectObject(value) === false) {
    return false;
  }

  const proto = getPrototypeOf(value);

  if (isNull(proto)) {
    return true;
  }

  if ($isObjectObject(proto) === false) {
    return false;
  }

  if (isPrototypeOf(proto, obj)) {
    return true;
  }

  const Ctor = hasOwnProperty(proto, 'constructor') && proto.constructor;

  return $isFunctionType(Ctor) && Ctor instanceof Ctor && $funcToString(Ctor) === objectCtorString;
};

/**
 * This method tests if `value` is a plain object, that is, an object created by
 * the `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @param {*} value - The value to test.
 * @returns {boolean} True if a plain object, otherwise false.
 */
export default $isPlainObject;

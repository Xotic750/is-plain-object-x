<a href="https://travis-ci.org/Xotic750/is-plain-object-x"
  title="Travis status">
<img
  src="https://travis-ci.org/Xotic750/is-plain-object-x.svg?branch=master"
  alt="Travis status" height="18">
</a>
<a href="https://david-dm.org/Xotic750/is-plain-object-x"
  title="Dependency status">
<img src="https://david-dm.org/Xotic750/is-plain-object-x/status.svg"
  alt="Dependency status" height="18"/>
</a>
<a
  href="https://david-dm.org/Xotic750/is-plain-object-x?type=dev"
  title="devDependency status">
<img src="https://david-dm.org/Xotic750/is-plain-object-x/dev-status.svg"
  alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/is-plain-object-x"
  title="npm version">
<img src="https://badge.fury.io/js/is-plain-object-x.svg"
  alt="npm version" height="18">
</a>
<a href="https://www.jsdelivr.com/package/npm/is-plain-object-x"
  title="jsDelivr hits">
<img src="https://data.jsdelivr.com/v1/package/npm/is-plain-object-x/badge?style=rounded"
  alt="jsDelivr hits" height="18">
</a>

<a name="module_is-plain-object-x"></a>

## is-plain-object-x

Tests if a value is a plain object.

<a name="exp_module_is-plain-object-x--module.exports"></a>

### `module.exports` ⇒ <code>boolean</code> ⏏

This method tests if `value` is a plain object, that is, an object created by
the `Object` constructor or one with a `[[Prototype]]` of `null`.

**Kind**: Exported member  
**Returns**: <code>boolean</code> - True if a plain object, otherwise false.

| Param | Type            | Description        |
| ----- | --------------- | ------------------ |
| value | <code>\*</code> | The value to test. |

**Example**

```js
import isPlainObject from 'is-plain-object-x';

function Foo() {
  this.a = 1;
}

isPlainObject(new Foo()); // => false
isPlainObject([1, 2, 3]); // => false
isPlainObject({x: 0, y: 0}); // => true
isPlainObject(Object.create(null)); // => true
```

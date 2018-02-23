(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var foreach = require('foreach');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"foreach":2,"object-keys":3}],2:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],3:[function(require,module,exports){
'use strict';

// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = require('./isArguments');
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./isArguments":4}],4:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],5:[function(require,module,exports){
(function (global){
/* global window, global, self */

module.exports = function getGlobal() {
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	if (typeof self !== 'undefined') { return self; }
	return Function('return this')();
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
var installShim = require('./simd');
var define = require('define-properties');

var fakeGlobal = {};
installShim(fakeGlobal);

var simd = fakeGlobal.SIMD;

var getGlobal = require('./getGlobal');

define(simd, {
	shim: function shim() {
		var globalObject = getGlobal();
		var predicates = {
			SIMD: function () {
				// Firefox Nightly v41
				return globalObject.SIMD && typeof globalObject.SIMD.float32x4.extractLane !== 'function';
			}
		};
		define(globalObject, { SIMD: simd }, predicates);
		return globalObject.SIMD || simd;
	}
});

module.exports = simd;

},{"./getGlobal":5,"./simd":7,"define-properties":1}],7:[function(require,module,exports){
/*
  vim: set ts=8 sts=2 et sw=2 tw=79:
  Copyright (C) 2013

  This software is provided 'as-is', without any express or implied
  warranty.  In no event will the authors be held liable for any damages
  arising from the use of this software.

  Permission is granted to anyone to use this software for any purpose,
  including commercial applications, and to alter it and redistribute it
  freely, subject to the following restrictions:

  1. The origin of this software must not be misrepresented; you must not
     claim that you wrote the original software. If you use this software
     in a product, an acknowledgment in the product documentation would be
     appreciated but is not required.
  2. Altered source versions must be plainly marked as such, and must not be
     misrepresented as being the original software.
  3. This notice may not be removed or altered from any source distribution.
*/

// A conforming SIMD.js implementation may contain the following deviations to
// normal JS numeric behavior:
//  - Subnormal numbers may or may not be flushed to zero on input or output of
//    any SIMD operation.

// Many of the operations in SIMD.js have semantics which correspond to scalar
// operations in JS, however there are a few differences:
//  - Vector shifts don't mask the shift count.
//  - Conversions from float to int32 throw on error.
//  - Load and store operations throw when out of bounds.

module.exports = function (global) {

if (typeof global.SIMD === "undefined") {
  // SIMD module.
  global.SIMD = {};
}

if (typeof module !== "undefined") {
  // For CommonJS modules

}

var SIMD = global.SIMD;

// private stuff.
// Temporary buffers for swizzles and bitcasts.
var _f32x4 = new Float32Array(4);
var _f64x2 = new Float64Array(_f32x4.buffer);
var _i32x4 = new Int32Array(_f32x4.buffer);
var _i16x8 = new Int16Array(_f32x4.buffer);
var _i8x16 = new Int8Array(_f32x4.buffer);

var _f32;
var truncatef32;
if (typeof Math.fround !== 'undefined') {
  truncatef32 = Math.fround;
} else {
  _f32 = new Float32Array(1);

  truncatef32 = function(x) {
    _f32[0] = x;
    return _f32[0];
  }
}

// Type checking functions.

function isInt32(o) {
  return (o | 0) === o;
}

function isTypedArray(o) {
  return (o instanceof Int8Array) ||
         (o instanceof Uint8Array) ||
         (o instanceof Uint8ClampedArray) ||
         (o instanceof Int16Array) ||
         (o instanceof Uint16Array) ||
         (o instanceof Int32Array) ||
         (o instanceof Uint32Array) ||
         (o instanceof Float32Array) ||
         (o instanceof Float64Array);
}

function minNum(x, y) {
  return x != x ? y :
         y != y ? x :
         Math.min(x, y);
}

function maxNum(x, y) {
  return x != x ? y :
         y != y ? x :
         Math.max(x, y);
}

function int32FromFloat(x) {
  if (x > -2147483649.0 && x < 2147483648.0)
    return x|0;
  throw new RangeError("Conversion from floating-point to integer failed");
}

function checkLaneIndex(numLanes) {
  return function(lane) {
    if (!isInt32(lane))
      throw new TypeError('lane index must be an int32');
    if (lane < 0 || lane >= numLanes)
      throw new RangeError('lane index must be in bounds');
  }
}

var check2 = checkLaneIndex(2);
var check4 = checkLaneIndex(4);
var check8 = checkLaneIndex(8);
var check16 = checkLaneIndex(16);
var check32 = checkLaneIndex(32);

// Save/Restore utilities for implementing bitwise conversions.

function saveBool32x4(x) {
  x = SIMD.Bool32x4.check(x);
  _i32x4[0] = SIMD.Bool32x4.extractLane(x, 0);
  _i32x4[1] = SIMD.Bool32x4.extractLane(x, 1);
  _i32x4[2] = SIMD.Bool32x4.extractLane(x, 2);
  _i32x4[3] = SIMD.Bool32x4.extractLane(x, 3);
}

function saveBool16x8(x) {
  x = SIMD.Bool16x8.check(x);
  _i16x8[0] = SIMD.Bool16x8.extractLane(x, 0);
  _i16x8[1] = SIMD.Bool16x8.extractLane(x, 1);
  _i16x8[2] = SIMD.Bool16x8.extractLane(x, 2);
  _i16x8[3] = SIMD.Bool16x8.extractLane(x, 3);
  _i16x8[4] = SIMD.Bool16x8.extractLane(x, 4);
  _i16x8[5] = SIMD.Bool16x8.extractLane(x, 5);
  _i16x8[6] = SIMD.Bool16x8.extractLane(x, 6);
  _i16x8[7] = SIMD.Bool16x8.extractLane(x, 7);
}

function saveBool8x16(x) {
  x = SIMD.Bool8x16.check(x);
  _i8x16[0] = SIMD.Bool8x16.extractLane(x, 0);
  _i8x16[1] = SIMD.Bool8x16.extractLane(x, 1);
  _i8x16[2] = SIMD.Bool8x16.extractLane(x, 2);
  _i8x16[3] = SIMD.Bool8x16.extractLane(x, 3);
  _i8x16[4] = SIMD.Bool8x16.extractLane(x, 4);
  _i8x16[5] = SIMD.Bool8x16.extractLane(x, 5);
  _i8x16[6] = SIMD.Bool8x16.extractLane(x, 6);
  _i8x16[7] = SIMD.Bool8x16.extractLane(x, 7);
  _i8x16[8] = SIMD.Bool8x16.extractLane(x, 8);
  _i8x16[9] = SIMD.Bool8x16.extractLane(x, 9);
  _i8x16[10] = SIMD.Bool8x16.extractLane(x, 10);
  _i8x16[11] = SIMD.Bool8x16.extractLane(x, 11);
  _i8x16[12] = SIMD.Bool8x16.extractLane(x, 12);
  _i8x16[13] = SIMD.Bool8x16.extractLane(x, 13);
  _i8x16[14] = SIMD.Bool8x16.extractLane(x, 14);
  _i8x16[15] = SIMD.Bool8x16.extractLane(x, 15);
}

function saveFloat64x2(x) {
  x = SIMD.Float64x2.check(x);
  _f64x2[0] = SIMD.Float64x2.extractLane(x, 0);
  _f64x2[1] = SIMD.Float64x2.extractLane(x, 1);
}

function saveFloat32x4(x) {
  x = SIMD.Float32x4.check(x);
  _f32x4[0] = SIMD.Float32x4.extractLane(x, 0);
  _f32x4[1] = SIMD.Float32x4.extractLane(x, 1);
  _f32x4[2] = SIMD.Float32x4.extractLane(x, 2);
  _f32x4[3] = SIMD.Float32x4.extractLane(x, 3);
}

function saveInt32x4(x) {
  x = SIMD.Int32x4.check(x);
  _i32x4[0] = SIMD.Int32x4.extractLane(x, 0);
  _i32x4[1] = SIMD.Int32x4.extractLane(x, 1);
  _i32x4[2] = SIMD.Int32x4.extractLane(x, 2);
  _i32x4[3] = SIMD.Int32x4.extractLane(x, 3);
}

function saveInt16x8(x) {
  x = SIMD.Int16x8.check(x);
  _i16x8[0] = SIMD.Int16x8.extractLane(x, 0);
  _i16x8[1] = SIMD.Int16x8.extractLane(x, 1);
  _i16x8[2] = SIMD.Int16x8.extractLane(x, 2);
  _i16x8[3] = SIMD.Int16x8.extractLane(x, 3);
  _i16x8[4] = SIMD.Int16x8.extractLane(x, 4);
  _i16x8[5] = SIMD.Int16x8.extractLane(x, 5);
  _i16x8[6] = SIMD.Int16x8.extractLane(x, 6);
  _i16x8[7] = SIMD.Int16x8.extractLane(x, 7);
}

function saveInt8x16(x) {
  x = SIMD.Int8x16.check(x);
  _i8x16[0] = SIMD.Int8x16.extractLane(x, 0);
  _i8x16[1] = SIMD.Int8x16.extractLane(x, 1);
  _i8x16[2] = SIMD.Int8x16.extractLane(x, 2);
  _i8x16[3] = SIMD.Int8x16.extractLane(x, 3);
  _i8x16[4] = SIMD.Int8x16.extractLane(x, 4);
  _i8x16[5] = SIMD.Int8x16.extractLane(x, 5);
  _i8x16[6] = SIMD.Int8x16.extractLane(x, 6);
  _i8x16[7] = SIMD.Int8x16.extractLane(x, 7);
  _i8x16[8] = SIMD.Int8x16.extractLane(x, 8);
  _i8x16[9] = SIMD.Int8x16.extractLane(x, 9);
  _i8x16[10] = SIMD.Int8x16.extractLane(x, 10);
  _i8x16[11] = SIMD.Int8x16.extractLane(x, 11);
  _i8x16[12] = SIMD.Int8x16.extractLane(x, 12);
  _i8x16[13] = SIMD.Int8x16.extractLane(x, 13);
  _i8x16[14] = SIMD.Int8x16.extractLane(x, 14);
  _i8x16[15] = SIMD.Int8x16.extractLane(x, 15);
}

function restoreBool32x4() {
  var alias = _i32x4;
  return SIMD.Bool32x4(alias[0], alias[1], alias[2], alias[3]);
}

function restoreBool16x8() {
  var alias = _i16x8;
  return SIMD.Bool16x8(alias[0], alias[1], alias[2], alias[3],
                       alias[4], alias[5], alias[6], alias[7]);
}

function restoreBool8x16() {
  var alias = _i8x16;
  return SIMD.Bool8x16(alias[0], alias[1], alias[2], alias[3],
                       alias[4], alias[5], alias[6], alias[7],
                       alias[8], alias[9], alias[10], alias[11],
                       alias[12], alias[13], alias[14], alias[15]);
}

function restoreFloat64x2() {
  var alias = _f64x2;
  return SIMD.Float64x2(alias[0], alias[1]);
}

function restoreFloat32x4() {
  var alias = _f32x4;
  return SIMD.Float32x4(alias[0], alias[1], alias[2], alias[3]);
}

function restoreInt32x4() {
  var alias = _i32x4;
  return SIMD.Int32x4(alias[0], alias[1], alias[2], alias[3]);
}

function restoreInt16x8() {
  var alias = _i16x8;
  return SIMD.Int16x8(alias[0], alias[1], alias[2], alias[3],
                      alias[4], alias[5], alias[6], alias[7]);
}

function restoreInt8x16() {
  var alias = _i8x16;
  return SIMD.Int8x16(alias[0], alias[1], alias[2], alias[3],
                      alias[4], alias[5], alias[6], alias[7],
                      alias[8], alias[9], alias[10], alias[11],
                      alias[12], alias[13], alias[14], alias[15]);
}

if (typeof SIMD.Bool64x2 === "undefined") {
  /**
    * Construct a new instance of bool64x2 number.
    * @constructor
    */
  SIMD.Bool64x2 = function(x, y) {
    if (!(this instanceof SIMD.Bool64x2)) {
      return new SIMD.Bool64x2(x, y);
    }

    this.x_ = !!x;
    this.y_ = !!y;
  }
}

if (typeof SIMD.Bool64x2.check === "undefined") {
  /**
    * Check whether the argument is a bool64x2.
    * @param {bool64x2} v An instance of bool64x2.
    * @return {bool64x2} The bool64x2 instance.
    */
  SIMD.Bool64x2.check = function(v) {
    if (!(v instanceof SIMD.Bool64x2)) {
      throw new TypeError("argument is not a bool64x2.");
    }
    return v;
  }
}

if (typeof SIMD.Bool64x2.splat === "undefined") {
  /**
    * Construct a new instance of bool64x2 with the same value
    * in all lanes.
    * @param {double} value used for all lanes.
    * @constructor
    */
  SIMD.Bool64x2.splat = function(s) {
    return SIMD.Bool64x2(s, s);
  }
}

if (typeof SIMD.Bool64x2.extractLane === "undefined") {
  /**
    * @param {bool64x2} v An instance of bool64x2.
    * @param {integer} i Index in concatenation of v for lane i
    * @return {Boolean} The value in lane i of v.
    */
  SIMD.Bool64x2.extractLane = function(v, i) {
    v = SIMD.Bool64x2.check(v);
    check2(i);
    switch(i) {
      case 0: return v.x_;
      case 1: return v.y_;
    }
  }
}

if (typeof SIMD.Bool64x2.replaceLane === "undefined") {
  /**
    * @param {bool64x2} v An instance of bool64x2.
    * @param {integer} i Index in concatenation of v for lane i
    * @param {double} value used for lane i.
    * @return {bool64x2} New instance of bool64x2 with the values in v and
    * lane i replaced with {s}.
    */
  SIMD.Bool64x2.replaceLane = function(v, i, s) {
    v = SIMD.Bool64x2.check(v);
    check2(i);
    // Other replaceLane implementations do the replacement in memory, but
    // this is awkward for bool64x2 without something like Int64Array.
    return i == 0 ?
           SIMD.Bool64x2(s, SIMD.Bool64x2.extractLane(v, 1)) :
           SIMD.Bool64x2(SIMD.Bool64x2.extractLane(v, 0), s);
  }
}

if (typeof SIMD.Bool64x2.allTrue === "undefined") {
  /**
    * Check if all 2 lanes hold a true value
    * @param {bool64x2} v An instance of bool64x2.
    * @return {Boolean} All 2 lanes hold a true value
    */
  SIMD.Bool64x2.allTrue = function(v) {
    v = SIMD.Bool64x2.check(v);
    return SIMD.Bool64x2.extractLane(v, 0) &&
        SIMD.Bool64x2.extractLane(v, 1);
  }
}

if (typeof SIMD.Bool64x2.anyTrue === "undefined") {
  /**
    * Check if any of the 2 lanes hold a true value
    * @param {bool64x2} v An instance of bool64x2.
    * @return {Boolean} Any of the 2 lanes holds a true value
    */
  SIMD.Bool64x2.anyTrue = function(v) {
    v = SIMD.Bool64x2.check(v);
    return SIMD.Bool64x2.extractLane(v, 0) ||
        SIMD.Bool64x2.extractLane(v, 1);
  }
}

if (typeof SIMD.Bool64x2.and === "undefined") {
  /**
    * @param {bool64x2} a An instance of bool64x2.
    * @param {bool64x2} b An instance of bool64x2.
    * @return {bool64x2} New instance of bool64x2 with values of a & b.
    */
  SIMD.Bool64x2.and = function(a, b) {
    a = SIMD.Bool64x2.check(a);
    b = SIMD.Bool64x2.check(b);
    return SIMD.Bool64x2(SIMD.Bool64x2.extractLane(a, 0) & SIMD.Bool64x2.extractLane(b, 0),
                         SIMD.Bool64x2.extractLane(a, 1) & SIMD.Bool64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Bool64x2.or === "undefined") {
  /**
    * @param {bool64x2} a An instance of bool64x2.
    * @param {bool64x2} b An instance of bool64x2.
    * @return {bool64x2} New instance of bool64x2 with values of a | b.
    */
  SIMD.Bool64x2.or = function(a, b) {
    a = SIMD.Bool64x2.check(a);
    b = SIMD.Bool64x2.check(b);
    return SIMD.Bool64x2(SIMD.Bool64x2.extractLane(a, 0) | SIMD.Bool64x2.extractLane(b, 0),
                         SIMD.Bool64x2.extractLane(a, 1) | SIMD.Bool64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Bool64x2.xor === "undefined") {
  /**
    * @param {bool64x2} a An instance of bool64x2.
    * @param {bool64x2} b An instance of bool64x2.
    * @return {bool64x2} New instance of bool64x2 with values of a ^ b.
    */
  SIMD.Bool64x2.xor = function(a, b) {
    a = SIMD.Bool64x2.check(a);
    b = SIMD.Bool64x2.check(b);
    return SIMD.Bool64x2(SIMD.Bool64x2.extractLane(a, 0) ^ SIMD.Bool64x2.extractLane(b, 0),
                         SIMD.Bool64x2.extractLane(a, 1) ^ SIMD.Bool64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Bool64x2.not === "undefined") {
  /**
    * @param {bool64x2} a An instance of bool64x2.
    * @return {bool64x2} New instance of bool64x2 with values of !a
    */
  SIMD.Bool64x2.not = function(a) {
    a = SIMD.Bool64x2.check(a);
    return SIMD.Bool64x2(!SIMD.Bool64x2.extractLane(a, 0),
                         !SIMD.Bool64x2.extractLane(a, 1));
  }
}

if (typeof SIMD.Bool64x2.equal === "undefined") {
  /**
    * @param {bool64x2} a An instance of bool64x2.
    * @param {bool64x2} b An instance of bool64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of a == b.
    */
  SIMD.Bool64x2.equal = function(a, b) {
    a = SIMD.Bool64x2.check(a);
    b = SIMD.Bool64x2.check(b);
    return SIMD.Bool64x2(SIMD.Bool64x2.extractLane(a, 0) == SIMD.Bool64x2.extractLane(b, 0),
                         SIMD.Bool64x2.extractLane(a, 1) == SIMD.Bool64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Bool64x2.notEqual === "undefined") {
  /**
    * @param {bool64x2} a An instance of bool64x2.
    * @param {bool64x2} b An instance of bool64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of a != b.
    */
  SIMD.Bool64x2.notEqual = function(a, b) {
    a = SIMD.Bool64x2.check(a);
    b = SIMD.Bool64x2.check(b);
    return SIMD.Bool64x2(SIMD.Bool64x2.extractLane(a, 0) != SIMD.Bool64x2.extractLane(b, 0),
                         SIMD.Bool64x2.extractLane(a, 1) != SIMD.Bool64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Bool64x2.select === "undefined") {
  /**
    * @param {bool64x2} mask Selector mask. An instance of bool64x2
    * @param {bool64x2} trueValue Pick lane from here if corresponding
    * selector lane is 1
    * @param {bool64x2} falseValue Pick lane from here if corresponding
    * selector lane is 0
    * @return {bool64x2} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Bool64x2.select = function(mask, trueValue, falseValue) {
    mask = SIMD.Bool64x2.check(mask);
    trueValue = SIMD.Bool64x2.check(trueValue);
    falseValue = SIMD.Bool64x2.check(falseValue);
    var tr = SIMD.Bool64x2.and(mask, trueValue);
    var fr = SIMD.Bool64x2.and(SIMD.Bool64x2.not(mask), falseValue);
    return SIMD.Bool64x2.or(tr, fr);
  }
}

if (typeof SIMD.Bool32x4 === "undefined") {
  /**
    * Construct a new instance of Bool32x4 number.
    * @constructor
    */
  SIMD.Bool32x4 = function(x, y, z, w) {
    if (!(this instanceof SIMD.Bool32x4)) {
      return new SIMD.Bool32x4(x, y, z, w);
    }

    this.x_ = !!x;
    this.y_ = !!y;
    this.z_ = !!z;
    this.w_ = !!w;
  }
}

if (typeof SIMD.Bool32x4.check === "undefined") {
  /**
    * Check whether the argument is a Bool32x4.
    * @param {Bool32x4} v An instance of Bool32x4.
    * @return {Bool32x4} The Bool32x4 instance.
    */
  SIMD.Bool32x4.check = function(v) {
    if (!(v instanceof SIMD.Bool32x4)) {
      throw new TypeError("argument is not a Bool32x4.");
    }
    return v;
  }
}

if (typeof SIMD.Bool32x4.splat === "undefined") {
  /**
    * Construct a new instance of Bool32x4 with the same value
    * in all lanes.
    * @param {double} value used for all lanes.
    * @constructor
    */
  SIMD.Bool32x4.splat = function(s) {
    return SIMD.Bool32x4(s, s, s, s);
  }
}

if (typeof SIMD.Bool32x4.extractLane === "undefined") {
  /**
    * @param {Bool32x4} v An instance of Bool32x4.
    * @param {integer} i Index in concatenation of v for lane i
    * @return {Boolean} The value in lane i of v.
    */
  SIMD.Bool32x4.extractLane = function(v, i) {
    v = SIMD.Bool32x4.check(v);
    check4(i);
    switch(i) {
      case 0: return v.x_;
      case 1: return v.y_;
      case 2: return v.z_;
      case 3: return v.w_;
    }
  }
}

if (typeof SIMD.Bool32x4.replaceLane === "undefined") {
  /**
    * @param {Bool32x4} v An instance of Bool32x4.
    * @param {integer} i Index in concatenation of v for lane i
    * @param {double} value used for lane i.
    * @return {Bool32x4} New instance of Bool32x4 with the values in v and
    * lane i replaced with {s}.
    */
  SIMD.Bool32x4.replaceLane = function(v, i, s) {
    v = SIMD.Bool32x4.check(v);
    check4(i);
    saveBool32x4(v);
    _i32x4[i] = s;
    return restoreBool32x4();
  }
}

if (typeof SIMD.Bool32x4.allTrue === "undefined") {
  /**
    * Check if all 4 lanes hold a true value
    * @param {Bool32x4} v An instance of Bool32x4.
    * @return {Boolean} All 4 lanes holds a true value
    */
  SIMD.Bool32x4.allTrue = function(v) {
    v = SIMD.Bool32x4.check(v);
    return SIMD.Bool32x4.extractLane(v, 0) &&
        SIMD.Bool32x4.extractLane(v, 1) &&
        SIMD.Bool32x4.extractLane(v, 2) &&
        SIMD.Bool32x4.extractLane(v, 3);
  }
}

if (typeof SIMD.Bool32x4.anyTrue === "undefined") {
  /**
    * Check if any of the 4 lanes hold a true value
    * @param {Bool32x4} v An instance of Bool32x4.
    * @return {Boolean} Any of the 4 lanes holds a true value
    */
  SIMD.Bool32x4.anyTrue = function(v) {
    v = SIMD.Bool32x4.check(v);
    return SIMD.Bool32x4.extractLane(v, 0) ||
        SIMD.Bool32x4.extractLane(v, 1) ||
        SIMD.Bool32x4.extractLane(v, 2) ||
        SIMD.Bool32x4.extractLane(v, 3);
  }
}

if (typeof SIMD.Bool32x4.and === "undefined") {
  /**
    * @param {Bool32x4} a An instance of Bool32x4.
    * @param {Bool32x4} b An instance of Bool32x4.
    * @return {Bool32x4} New instance of Bool32x4 with values of a & b.
    */
  SIMD.Bool32x4.and = function(a, b) {
    a = SIMD.Bool32x4.check(a);
    b = SIMD.Bool32x4.check(b);
    return SIMD.Bool32x4(SIMD.Bool32x4.extractLane(a, 0) & SIMD.Bool32x4.extractLane(b, 0),
                         SIMD.Bool32x4.extractLane(a, 1) & SIMD.Bool32x4.extractLane(b, 1),
                         SIMD.Bool32x4.extractLane(a, 2) & SIMD.Bool32x4.extractLane(b, 2),
                         SIMD.Bool32x4.extractLane(a, 3) & SIMD.Bool32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Bool32x4.or === "undefined") {
  /**
    * @param {Bool32x4} a An instance of Bool32x4.
    * @param {Bool32x4} b An instance of Bool32x4.
    * @return {Bool32x4} New instance of Bool32x4 with values of a | b.
    */
  SIMD.Bool32x4.or = function(a, b) {
    a = SIMD.Bool32x4.check(a);
    b = SIMD.Bool32x4.check(b);
    return SIMD.Bool32x4(SIMD.Bool32x4.extractLane(a, 0) | SIMD.Bool32x4.extractLane(b, 0),
                         SIMD.Bool32x4.extractLane(a, 1) | SIMD.Bool32x4.extractLane(b, 1),
                         SIMD.Bool32x4.extractLane(a, 2) | SIMD.Bool32x4.extractLane(b, 2),
                         SIMD.Bool32x4.extractLane(a, 3) | SIMD.Bool32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Bool32x4.xor === "undefined") {
  /**
    * @param {Bool32x4} a An instance of Bool32x4.
    * @param {Bool32x4} b An instance of Bool32x4.
    * @return {Bool32x4} New instance of Bool32x4 with values of a ^ b.
    */
  SIMD.Bool32x4.xor = function(a, b) {
    a = SIMD.Bool32x4.check(a);
    b = SIMD.Bool32x4.check(b);
    return SIMD.Bool32x4(SIMD.Bool32x4.extractLane(a, 0) ^ SIMD.Bool32x4.extractLane(b, 0),
                         SIMD.Bool32x4.extractLane(a, 1) ^ SIMD.Bool32x4.extractLane(b, 1),
                         SIMD.Bool32x4.extractLane(a, 2) ^ SIMD.Bool32x4.extractLane(b, 2),
                         SIMD.Bool32x4.extractLane(a, 3) ^ SIMD.Bool32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Bool32x4.not === "undefined") {
  /**
    * @param {Bool32x4} a An instance of Bool32x4.
    * @return {Bool32x4} New instance of Bool32x4 with values of !a
    */
  SIMD.Bool32x4.not = function(a) {
    a = SIMD.Bool32x4.check(a);
    return SIMD.Bool32x4(!SIMD.Bool32x4.extractLane(a, 0),
                         !SIMD.Bool32x4.extractLane(a, 1),
                         !SIMD.Bool32x4.extractLane(a, 2),
                         !SIMD.Bool32x4.extractLane(a, 3));
  }
}

if (typeof SIMD.Bool32x4.equal === "undefined") {
  /**
    * @param {Bool32x4} a An instance of Bool32x4.
    * @param {Bool32x4} b An instance of Bool32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of a == b.
    */
  SIMD.Bool32x4.equal = function(a, b) {
    a = SIMD.Bool32x4.check(a);
    b = SIMD.Bool32x4.check(b);
    return SIMD.Bool32x4(SIMD.Bool32x4.extractLane(a, 0) == SIMD.Bool32x4.extractLane(b, 0),
                         SIMD.Bool32x4.extractLane(a, 1) == SIMD.Bool32x4.extractLane(b, 1),
                         SIMD.Bool32x4.extractLane(a, 2) == SIMD.Bool32x4.extractLane(b, 2),
                         SIMD.Bool32x4.extractLane(a, 3) == SIMD.Bool32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Bool32x4.notEqual === "undefined") {
  /**
    * @param {Bool32x4} a An instance of Bool32x4.
    * @param {Bool32x4} b An instance of Bool32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of a != b.
    */
  SIMD.Bool32x4.notEqual = function(a, b) {
    a = SIMD.Bool32x4.check(a);
    b = SIMD.Bool32x4.check(b);
    return SIMD.Bool32x4(SIMD.Bool32x4.extractLane(a, 0) != SIMD.Bool32x4.extractLane(b, 0),
                         SIMD.Bool32x4.extractLane(a, 1) != SIMD.Bool32x4.extractLane(b, 1),
                         SIMD.Bool32x4.extractLane(a, 2) != SIMD.Bool32x4.extractLane(b, 2),
                         SIMD.Bool32x4.extractLane(a, 3) != SIMD.Bool32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Bool32x4.select === "undefined") {
  /**
    * @param {Bool32x4} mask Selector mask. An instance of Bool32x4
    * @param {Bool32x4} trueValue Pick lane from here if corresponding
    * selector lane is 1
    * @param {Bool32x4} falseValue Pick lane from here if corresponding
    * selector lane is 0
    * @return {Bool32x4} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Bool32x4.select = function(mask, trueValue, falseValue) {
    mask = SIMD.Bool32x4.check(mask);
    trueValue = SIMD.Bool32x4.check(trueValue);
    falseValue = SIMD.Bool32x4.check(falseValue);
    var tr = SIMD.Bool32x4.and(mask, trueValue);
    var fr = SIMD.Bool32x4.and(SIMD.Bool32x4.not(mask), falseValue);
    return SIMD.Bool32x4.or(tr, fr);
  }
}

if (typeof SIMD.Bool16x8 === "undefined") {
  /**
    * Construct a new instance of Bool16x8 number.
    * @constructor
    */
  SIMD.Bool16x8 = function(s0, s1, s2, s3, s4, s5, s6, s7) {
    if (!(this instanceof SIMD.Bool16x8)) {
      return new SIMD.Bool16x8(s0, s1, s2, s3, s4, s5, s6, s7);
    }

    this.s0_ = !!s0;
    this.s1_ = !!s1;
    this.s2_ = !!s2;
    this.s3_ = !!s3;
    this.s4_ = !!s4;
    this.s5_ = !!s5;
    this.s6_ = !!s6;
    this.s7_ = !!s7;
  }
}

if (typeof SIMD.Bool16x8.check === "undefined") {
  /**
    * Check whether the argument is a Bool16x8.
    * @param {Bool16x8} v An instance of Bool16x8.
    * @return {Bool16x8} The Bool16x8 instance.
    */
  SIMD.Bool16x8.check = function(v) {
    if (!(v instanceof SIMD.Bool16x8)) {
      throw new TypeError("argument is not a Bool16x8.");
    }
    return v;
  }
}

if (typeof SIMD.Bool16x8.splat === "undefined") {
  /**
    * Construct a new instance of Bool16x8 with the same value
    * in all lanes.
    * @param {double} value used for all lanes.
    * @constructor
    */
  SIMD.Bool16x8.splat = function(s) {
    return SIMD.Bool16x8(s, s, s, s, s, s, s, s);
  }
}

if (typeof SIMD.Bool16x8.extractLane === "undefined") {
  /**
    * @param {Bool16x8} v An instance of Bool16x8.
    * @param {integer} i Index in concatenation of v for lane i
    * @return {Boolean} The value in lane i of v.
    */
  SIMD.Bool16x8.extractLane = function(v, i) {
    v = SIMD.Bool16x8.check(v);
    check8(i);
    switch(i) {
      case 0: return v.s0_;
      case 1: return v.s1_;
      case 2: return v.s2_;
      case 3: return v.s3_;
      case 4: return v.s4_;
      case 5: return v.s5_;
      case 6: return v.s6_;
      case 7: return v.s7_;
    }
  }
}

if (typeof SIMD.Bool16x8.replaceLane === "undefined") {
  /**
    * @param {Bool16x8} v An instance of Bool16x8.
    * @param {integer} i Index in concatenation of v for lane i
    * @param {double} value used for lane i.
    * @return {Bool16x8} New instance of Bool16x8 with the values in v and
    * lane i replaced with {s}.
    */
  SIMD.Bool16x8.replaceLane = function(v, i, s) {
    v = SIMD.Bool16x8.check(v);
    check8(i);
    saveBool16x8(v);
    _i16x8[i] = s;
    return restoreBool16x8();
  }
}

if (typeof SIMD.Bool16x8.allTrue === "undefined") {
  /**
    * Check if all 8 lanes hold a true value
    * @param {Bool16x8} v An instance of Bool16x8.
    * @return {Boolean} All 8 lanes holds a true value
    */
  SIMD.Bool16x8.allTrue = function(v) {
    v = SIMD.Bool16x8.check(v);
    return SIMD.Bool16x8.extractLane(v, 0) &&
           SIMD.Bool16x8.extractLane(v, 1) &&
           SIMD.Bool16x8.extractLane(v, 2) &&
           SIMD.Bool16x8.extractLane(v, 3) &&
           SIMD.Bool16x8.extractLane(v, 4) &&
           SIMD.Bool16x8.extractLane(v, 5) &&
           SIMD.Bool16x8.extractLane(v, 6) &&
           SIMD.Bool16x8.extractLane(v, 7);
  }
}

if (typeof SIMD.Bool16x8.anyTrue === "undefined") {
  /**
    * Check if any of the 8 lanes hold a true value
    * @param {Bool16x8} v An instance of Int16x8.
    * @return {Boolean} Any of the 8 lanes holds a true value
    */
  SIMD.Bool16x8.anyTrue = function(v) {
    v = SIMD.Bool16x8.check(v);
    return SIMD.Bool16x8.extractLane(v, 0) ||
           SIMD.Bool16x8.extractLane(v, 1) ||
           SIMD.Bool16x8.extractLane(v, 2) ||
           SIMD.Bool16x8.extractLane(v, 3) ||
           SIMD.Bool16x8.extractLane(v, 4) ||
           SIMD.Bool16x8.extractLane(v, 5) ||
           SIMD.Bool16x8.extractLane(v, 6) ||
           SIMD.Bool16x8.extractLane(v, 7);
  }
}

if (typeof SIMD.Bool16x8.and === "undefined") {
  /**
    * @param {Bool16x8} a An instance of Bool16x8.
    * @param {Bool16x8} b An instance of Bool16x8.
    * @return {Bool16x8} New instance of Bool16x8 with values of a & b.
    */
  SIMD.Bool16x8.and = function(a, b) {
    a = SIMD.Bool16x8.check(a);
    b = SIMD.Bool16x8.check(b);
    return SIMD.Bool16x8(SIMD.Bool16x8.extractLane(a, 0) & SIMD.Bool16x8.extractLane(b, 0),
                         SIMD.Bool16x8.extractLane(a, 1) & SIMD.Bool16x8.extractLane(b, 1),
                         SIMD.Bool16x8.extractLane(a, 2) & SIMD.Bool16x8.extractLane(b, 2),
                         SIMD.Bool16x8.extractLane(a, 3) & SIMD.Bool16x8.extractLane(b, 3),
                         SIMD.Bool16x8.extractLane(a, 4) & SIMD.Bool16x8.extractLane(b, 4),
                         SIMD.Bool16x8.extractLane(a, 5) & SIMD.Bool16x8.extractLane(b, 5),
                         SIMD.Bool16x8.extractLane(a, 6) & SIMD.Bool16x8.extractLane(b, 6),
                         SIMD.Bool16x8.extractLane(a, 7) & SIMD.Bool16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Bool16x8.or === "undefined") {
  /**
    * @param {Bool16x8} a An instance of Bool16x8.
    * @param {Bool16x8} b An instance of Bool16x8.
    * @return {Bool16x8} New instance of Bool16x8 with values of a | b.
    */
  SIMD.Bool16x8.or = function(a, b) {
    a = SIMD.Bool16x8.check(a);
    b = SIMD.Bool16x8.check(b);
    return SIMD.Bool16x8(SIMD.Bool16x8.extractLane(a, 0) | SIMD.Bool16x8.extractLane(b, 0),
                         SIMD.Bool16x8.extractLane(a, 1) | SIMD.Bool16x8.extractLane(b, 1),
                         SIMD.Bool16x8.extractLane(a, 2) | SIMD.Bool16x8.extractLane(b, 2),
                         SIMD.Bool16x8.extractLane(a, 3) | SIMD.Bool16x8.extractLane(b, 3),
                         SIMD.Bool16x8.extractLane(a, 4) | SIMD.Bool16x8.extractLane(b, 4),
                         SIMD.Bool16x8.extractLane(a, 5) | SIMD.Bool16x8.extractLane(b, 5),
                         SIMD.Bool16x8.extractLane(a, 6) | SIMD.Bool16x8.extractLane(b, 6),
                         SIMD.Bool16x8.extractLane(a, 7) | SIMD.Bool16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Bool16x8.xor === "undefined") {
  /**
    * @param {Bool16x8} a An instance of Bool16x8.
    * @param {Bool16x8} b An instance of Bool16x8.
    * @return {Bool16x8} New instance of Bool16x8 with values of a ^ b.
    */
  SIMD.Bool16x8.xor = function(a, b) {
    a = SIMD.Bool16x8.check(a);
    b = SIMD.Bool16x8.check(b);
    return SIMD.Bool16x8(SIMD.Bool16x8.extractLane(a, 0) ^ SIMD.Bool16x8.extractLane(b, 0),
                         SIMD.Bool16x8.extractLane(a, 1) ^ SIMD.Bool16x8.extractLane(b, 1),
                         SIMD.Bool16x8.extractLane(a, 2) ^ SIMD.Bool16x8.extractLane(b, 2),
                         SIMD.Bool16x8.extractLane(a, 3) ^ SIMD.Bool16x8.extractLane(b, 3),
                         SIMD.Bool16x8.extractLane(a, 4) ^ SIMD.Bool16x8.extractLane(b, 4),
                         SIMD.Bool16x8.extractLane(a, 5) ^ SIMD.Bool16x8.extractLane(b, 5),
                         SIMD.Bool16x8.extractLane(a, 6) ^ SIMD.Bool16x8.extractLane(b, 6),
                         SIMD.Bool16x8.extractLane(a, 7) ^ SIMD.Bool16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Bool16x8.not === "undefined") {
  /**
    * @param {Bool16x8} a An instance of Bool16x8.
    * @return {Bool16x8} New instance of Bool16x8 with values of !a
    */
  SIMD.Bool16x8.not = function(a) {
    a = SIMD.Bool16x8.check(a);
    return SIMD.Bool16x8(!SIMD.Bool16x8.extractLane(a, 0),
                         !SIMD.Bool16x8.extractLane(a, 1),
                         !SIMD.Bool16x8.extractLane(a, 2),
                         !SIMD.Bool16x8.extractLane(a, 3),
                         !SIMD.Bool16x8.extractLane(a, 4),
                         !SIMD.Bool16x8.extractLane(a, 5),
                         !SIMD.Bool16x8.extractLane(a, 6),
                         !SIMD.Bool16x8.extractLane(a, 7));
  }
}

if (typeof SIMD.Bool16x8.equal === "undefined") {
  /**
    * @param {Bool16x8} a An instance of Bool16x8.
    * @param {Bool16x8} b An instance of Bool16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of a == b.
    */
  SIMD.Bool16x8.equal = function(a, b) {
    a = SIMD.Bool16x8.check(a);
    b = SIMD.Bool16x8.check(b);
    return SIMD.Bool16x8(SIMD.Bool16x8.extractLane(a, 0) == SIMD.Bool16x8.extractLane(b, 0),
                         SIMD.Bool16x8.extractLane(a, 1) == SIMD.Bool16x8.extractLane(b, 1),
                         SIMD.Bool16x8.extractLane(a, 2) == SIMD.Bool16x8.extractLane(b, 2),
                         SIMD.Bool16x8.extractLane(a, 3) == SIMD.Bool16x8.extractLane(b, 3),
                         SIMD.Bool16x8.extractLane(a, 4) == SIMD.Bool16x8.extractLane(b, 4),
                         SIMD.Bool16x8.extractLane(a, 5) == SIMD.Bool16x8.extractLane(b, 5),
                         SIMD.Bool16x8.extractLane(a, 6) == SIMD.Bool16x8.extractLane(b, 6),
                         SIMD.Bool16x8.extractLane(a, 7) == SIMD.Bool16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Bool16x8.notEqual === "undefined") {
  /**
    * @param {Bool16x8} a An instance of Bool16x8.
    * @param {Bool16x8} b An instance of Bool16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of a != b.
    */
  SIMD.Bool16x8.notEqual = function(a, b) {
    a = SIMD.Bool16x8.check(a);
    b = SIMD.Bool16x8.check(b);
    return SIMD.Bool16x8(SIMD.Bool16x8.extractLane(a, 0) != SIMD.Bool16x8.extractLane(b, 0),
                         SIMD.Bool16x8.extractLane(a, 1) != SIMD.Bool16x8.extractLane(b, 1),
                         SIMD.Bool16x8.extractLane(a, 2) != SIMD.Bool16x8.extractLane(b, 2),
                         SIMD.Bool16x8.extractLane(a, 3) != SIMD.Bool16x8.extractLane(b, 3),
                         SIMD.Bool16x8.extractLane(a, 4) != SIMD.Bool16x8.extractLane(b, 4),
                         SIMD.Bool16x8.extractLane(a, 5) != SIMD.Bool16x8.extractLane(b, 5),
                         SIMD.Bool16x8.extractLane(a, 6) != SIMD.Bool16x8.extractLane(b, 6),
                         SIMD.Bool16x8.extractLane(a, 7) != SIMD.Bool16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Bool16x8.select === "undefined") {
  /**
    * @param {Bool16x8} mask Selector mask. An instance of Bool16x8
    * @param {Bool16x8} trueValue Pick lane from here if corresponding
    * selector lane is 1
    * @param {Bool16x8} falseValue Pick lane from here if corresponding
    * selector lane is 0
    * @return {Bool16x8} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Bool16x8.select = function(mask, trueValue, falseValue) {
    mask = SIMD.Bool16x8.check(mask);
    trueValue = SIMD.Bool16x8.check(trueValue);
    falseValue = SIMD.Bool16x8.check(falseValue);
    var tr = SIMD.Bool16x8.and(mask, trueValue);
    var fr = SIMD.Bool16x8.and(SIMD.Bool16x8.not(mask), falseValue);
    return SIMD.Bool16x8.or(tr, fr);
  }
}

if (typeof SIMD.Bool8x16 === "undefined") {
  /**
    * Construct a new instance of Bool8x16 number.
    * @constructor
    */
  SIMD.Bool8x16 = function(s0, s1, s2, s3, s4, s5, s6, s7,
                           s8, s9, s10, s11, s12, s13, s14, s15) {
    if (!(this instanceof SIMD.Bool8x16)) {
      return new SIMD.Bool8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                               s8, s9, s10, s11, s12, s13, s14, s15);
    }

    this.s0_ = !!s0;
    this.s1_ = !!s1;
    this.s2_ = !!s2;
    this.s3_ = !!s3;
    this.s4_ = !!s4;
    this.s5_ = !!s5;
    this.s6_ = !!s6;
    this.s7_ = !!s7;
    this.s8_ = !!s8;
    this.s9_ = !!s9;
    this.s10_ = !!s10;
    this.s11_ = !!s11;
    this.s12_ = !!s12;
    this.s13_ = !!s13;
    this.s14_ = !!s14;
    this.s15_ = !!s15;
  }
}

if (typeof SIMD.Bool8x16.check === "undefined") {
  /**
    * Check whether the argument is a Bool8x16.
    * @param {Bool8x16} v An instance of Bool8x16.
    * @return {Bool8x16} The Bool8x16 instance.
    */
  SIMD.Bool8x16.check = function(v) {
    if (!(v instanceof SIMD.Bool8x16)) {
      throw new TypeError("argument is not a Bool8x16.");
    }
    return v;
  }
}

if (typeof SIMD.Bool8x16.splat === "undefined") {
  /**
    * Construct a new instance of Bool8x16 with the same value
    * in all lanes.
    * @param {double} value used for all lanes.
    * @constructor
    */
  SIMD.Bool8x16.splat = function(s) {
    return SIMD.Bool8x16(s, s, s, s, s, s, s, s,
                         s, s, s, s, s, s, s, s);
  }
}

if (typeof SIMD.Bool8x16.extractLane === "undefined") {
  /**
    * @param {Bool8x16} v An instance of Bool8x16.
    * @param {integer} i Index in concatenation of v for lane i
    * @return {Boolean} The value in lane i of v.
    */
  SIMD.Bool8x16.extractLane = function(v, i) {
    v = SIMD.Bool8x16.check(v);
    check16(i);
    switch(i) {
      case 0: return v.s0_;
      case 1: return v.s1_;
      case 2: return v.s2_;
      case 3: return v.s3_;
      case 4: return v.s4_;
      case 5: return v.s5_;
      case 6: return v.s6_;
      case 7: return v.s7_;
      case 8: return v.s8_;
      case 9: return v.s9_;
      case 10: return v.s10_;
      case 11: return v.s11_;
      case 12: return v.s12_;
      case 13: return v.s13_;
      case 14: return v.s14_;
      case 15: return v.s15_;
    }
  }
}

if (typeof SIMD.Bool8x16.replaceLane === "undefined") {
  /**
    * @param {Bool8x16} v An instance of Bool8x16.
    * @param {integer} i Index in concatenation of v for lane i
    * @param {double} value used for lane i.
    * @return {Bool8x16} New instance of Bool8x16 with the values in v and
    * lane i replaced with {s}.
    */
  SIMD.Bool8x16.replaceLane = function(v, i, s) {
    v = SIMD.Bool8x16.check(v);
    check16(i);
    saveBool8x16(v);
    _i8x16[i] = s;
    return restoreBool8x16();
  }
}

if (typeof SIMD.Bool8x16.allTrue === "undefined") {
  /**
    * Check if all 16 lanes hold a true value
    * @param {Bool8x16} v An instance of Bool8x16.
    * @return {Boolean} All 16 lanes holds a true value
    */
  SIMD.Bool8x16.allTrue = function(v) {
    v = SIMD.Bool8x16.check(v);
    return SIMD.Bool8x16.extractLane(v, 0) &&
           SIMD.Bool8x16.extractLane(v, 1) &&
           SIMD.Bool8x16.extractLane(v, 2) &&
           SIMD.Bool8x16.extractLane(v, 3) &&
           SIMD.Bool8x16.extractLane(v, 4) &&
           SIMD.Bool8x16.extractLane(v, 5) &&
           SIMD.Bool8x16.extractLane(v, 6) &&
           SIMD.Bool8x16.extractLane(v, 7) &&
           SIMD.Bool8x16.extractLane(v, 8) &&
           SIMD.Bool8x16.extractLane(v, 9) &&
           SIMD.Bool8x16.extractLane(v, 10) &&
           SIMD.Bool8x16.extractLane(v, 11) &&
           SIMD.Bool8x16.extractLane(v, 12) &&
           SIMD.Bool8x16.extractLane(v, 13) &&
           SIMD.Bool8x16.extractLane(v, 14) &&
           SIMD.Bool8x16.extractLane(v, 15);
  }
}

if (typeof SIMD.Bool8x16.anyTrue === "undefined") {
  /**
    * Check if any of the 16 lanes hold a true value
    * @param {Bool8x16} v An instance of Bool16x8.
    * @return {Boolean} Any of the 16 lanes holds a true value
    */
  SIMD.Bool8x16.anyTrue = function(v) {
    v = SIMD.Bool8x16.check(v);
    return SIMD.Bool8x16.extractLane(v, 0) ||
           SIMD.Bool8x16.extractLane(v, 1) ||
           SIMD.Bool8x16.extractLane(v, 2) ||
           SIMD.Bool8x16.extractLane(v, 3) ||
           SIMD.Bool8x16.extractLane(v, 4) ||
           SIMD.Bool8x16.extractLane(v, 5) ||
           SIMD.Bool8x16.extractLane(v, 6) ||
           SIMD.Bool8x16.extractLane(v, 7) ||
           SIMD.Bool8x16.extractLane(v, 8) ||
           SIMD.Bool8x16.extractLane(v, 9) ||
           SIMD.Bool8x16.extractLane(v, 10) ||
           SIMD.Bool8x16.extractLane(v, 11) ||
           SIMD.Bool8x16.extractLane(v, 12) ||
           SIMD.Bool8x16.extractLane(v, 13) ||
           SIMD.Bool8x16.extractLane(v, 14) ||
           SIMD.Bool8x16.extractLane(v, 15);
  }
}

if (typeof SIMD.Bool8x16.and === "undefined") {
  /**
    * @param {Bool8x16} a An instance of Bool8x16.
    * @param {Bool8x16} b An instance of Bool8x16.
    * @return {Bool8x16} New instance of Bool8x16 with values of a & b.
    */
  SIMD.Bool8x16.and = function(a, b) {
    a = SIMD.Bool8x16.check(a);
    b = SIMD.Bool8x16.check(b);
    return SIMD.Bool8x16(SIMD.Bool8x16.extractLane(a, 0) & SIMD.Bool8x16.extractLane(b, 0),
                         SIMD.Bool8x16.extractLane(a, 1) & SIMD.Bool8x16.extractLane(b, 1),
                         SIMD.Bool8x16.extractLane(a, 2) & SIMD.Bool8x16.extractLane(b, 2),
                         SIMD.Bool8x16.extractLane(a, 3) & SIMD.Bool8x16.extractLane(b, 3),
                         SIMD.Bool8x16.extractLane(a, 4) & SIMD.Bool8x16.extractLane(b, 4),
                         SIMD.Bool8x16.extractLane(a, 5) & SIMD.Bool8x16.extractLane(b, 5),
                         SIMD.Bool8x16.extractLane(a, 6) & SIMD.Bool8x16.extractLane(b, 6),
                         SIMD.Bool8x16.extractLane(a, 7) & SIMD.Bool8x16.extractLane(b, 7),
                         SIMD.Bool8x16.extractLane(a, 8) & SIMD.Bool8x16.extractLane(b, 8),
                         SIMD.Bool8x16.extractLane(a, 9) & SIMD.Bool8x16.extractLane(b, 9),
                         SIMD.Bool8x16.extractLane(a, 10) & SIMD.Bool8x16.extractLane(b, 10),
                         SIMD.Bool8x16.extractLane(a, 11) & SIMD.Bool8x16.extractLane(b, 11),
                         SIMD.Bool8x16.extractLane(a, 12) & SIMD.Bool8x16.extractLane(b, 12),
                         SIMD.Bool8x16.extractLane(a, 13) & SIMD.Bool8x16.extractLane(b, 13),
                         SIMD.Bool8x16.extractLane(a, 14) & SIMD.Bool8x16.extractLane(b, 14),
                         SIMD.Bool8x16.extractLane(a, 15) & SIMD.Bool8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Bool8x16.or === "undefined") {
  /**
    * @param {Bool8x16} a An instance of Bool8x16.
    * @param {Bool8x16} b An instance of Bool8x16.
    * @return {Bool8x16} New instance of Bool8x16 with values of a | b.
    */
  SIMD.Bool8x16.or = function(a, b) {
    a = SIMD.Bool8x16.check(a);
    b = SIMD.Bool8x16.check(b);
    return SIMD.Bool8x16(SIMD.Bool8x16.extractLane(a, 0) | SIMD.Bool8x16.extractLane(b, 0),
                         SIMD.Bool8x16.extractLane(a, 1) | SIMD.Bool8x16.extractLane(b, 1),
                         SIMD.Bool8x16.extractLane(a, 2) | SIMD.Bool8x16.extractLane(b, 2),
                         SIMD.Bool8x16.extractLane(a, 3) | SIMD.Bool8x16.extractLane(b, 3),
                         SIMD.Bool8x16.extractLane(a, 4) | SIMD.Bool8x16.extractLane(b, 4),
                         SIMD.Bool8x16.extractLane(a, 5) | SIMD.Bool8x16.extractLane(b, 5),
                         SIMD.Bool8x16.extractLane(a, 6) | SIMD.Bool8x16.extractLane(b, 6),
                         SIMD.Bool8x16.extractLane(a, 7) | SIMD.Bool8x16.extractLane(b, 7),
                         SIMD.Bool8x16.extractLane(a, 8) | SIMD.Bool8x16.extractLane(b, 8),
                         SIMD.Bool8x16.extractLane(a, 9) | SIMD.Bool8x16.extractLane(b, 9),
                         SIMD.Bool8x16.extractLane(a, 10) | SIMD.Bool8x16.extractLane(b, 10),
                         SIMD.Bool8x16.extractLane(a, 11) | SIMD.Bool8x16.extractLane(b, 11),
                         SIMD.Bool8x16.extractLane(a, 12) | SIMD.Bool8x16.extractLane(b, 12),
                         SIMD.Bool8x16.extractLane(a, 13) | SIMD.Bool8x16.extractLane(b, 13),
                         SIMD.Bool8x16.extractLane(a, 14) | SIMD.Bool8x16.extractLane(b, 14),
                         SIMD.Bool8x16.extractLane(a, 15) | SIMD.Bool8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Bool8x16.xor === "undefined") {
  /**
    * @param {Bool8x16} a An instance of Bool8x16.
    * @param {Bool8x16} b An instance of Bool8x16.
    * @return {Bool8x16} New instance of Bool8x16 with values of a ^ b.
    */
  SIMD.Bool8x16.xor = function(a, b) {
    a = SIMD.Bool8x16.check(a);
    b = SIMD.Bool8x16.check(b);
    return SIMD.Bool8x16(SIMD.Bool8x16.extractLane(a, 0) ^ SIMD.Bool8x16.extractLane(b, 0),
                         SIMD.Bool8x16.extractLane(a, 1) ^ SIMD.Bool8x16.extractLane(b, 1),
                         SIMD.Bool8x16.extractLane(a, 2) ^ SIMD.Bool8x16.extractLane(b, 2),
                         SIMD.Bool8x16.extractLane(a, 3) ^ SIMD.Bool8x16.extractLane(b, 3),
                         SIMD.Bool8x16.extractLane(a, 4) ^ SIMD.Bool8x16.extractLane(b, 4),
                         SIMD.Bool8x16.extractLane(a, 5) ^ SIMD.Bool8x16.extractLane(b, 5),
                         SIMD.Bool8x16.extractLane(a, 6) ^ SIMD.Bool8x16.extractLane(b, 6),
                         SIMD.Bool8x16.extractLane(a, 7) ^ SIMD.Bool8x16.extractLane(b, 7),
                         SIMD.Bool8x16.extractLane(a, 8) ^ SIMD.Bool8x16.extractLane(b, 8),
                         SIMD.Bool8x16.extractLane(a, 9) ^ SIMD.Bool8x16.extractLane(b, 9),
                         SIMD.Bool8x16.extractLane(a, 10) ^ SIMD.Bool8x16.extractLane(b, 10),
                         SIMD.Bool8x16.extractLane(a, 11) ^ SIMD.Bool8x16.extractLane(b, 11),
                         SIMD.Bool8x16.extractLane(a, 12) ^ SIMD.Bool8x16.extractLane(b, 12),
                         SIMD.Bool8x16.extractLane(a, 13) ^ SIMD.Bool8x16.extractLane(b, 13),
                         SIMD.Bool8x16.extractLane(a, 14) ^ SIMD.Bool8x16.extractLane(b, 14),
                         SIMD.Bool8x16.extractLane(a, 15) ^ SIMD.Bool8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Bool8x16.not === "undefined") {
  /**
    * @param {Bool8x16} a An instance of Bool8x16.
    * @return {Bool8x16} New instance of Bool8x16 with values of !a
    */
  SIMD.Bool8x16.not = function(a) {
    a = SIMD.Bool8x16.check(a);
    return SIMD.Bool8x16(!SIMD.Bool8x16.extractLane(a, 0),
                         !SIMD.Bool8x16.extractLane(a, 1),
                         !SIMD.Bool8x16.extractLane(a, 2),
                         !SIMD.Bool8x16.extractLane(a, 3),
                         !SIMD.Bool8x16.extractLane(a, 4),
                         !SIMD.Bool8x16.extractLane(a, 5),
                         !SIMD.Bool8x16.extractLane(a, 6),
                         !SIMD.Bool8x16.extractLane(a, 7),
                         !SIMD.Bool8x16.extractLane(a, 8),
                         !SIMD.Bool8x16.extractLane(a, 9),
                         !SIMD.Bool8x16.extractLane(a, 10),
                         !SIMD.Bool8x16.extractLane(a, 11),
                         !SIMD.Bool8x16.extractLane(a, 12),
                         !SIMD.Bool8x16.extractLane(a, 13),
                         !SIMD.Bool8x16.extractLane(a, 14),
                         !SIMD.Bool8x16.extractLane(a, 15));
  }
}

if (typeof SIMD.Bool8x16.equal === "undefined") {
  /**
    * @param {Bool8x16} a An instance of Bool8x16.
    * @param {Bool8x16} b An instance of Bool8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of a == b.
    */
  SIMD.Bool8x16.equal = function(a, b) {
    a = SIMD.Bool8x16.check(a);
    b = SIMD.Bool8x16.check(b);
    return SIMD.Bool8x16(SIMD.Bool8x16.extractLane(a, 0) == SIMD.Bool8x16.extractLane(b, 0),
                         SIMD.Bool8x16.extractLane(a, 1) == SIMD.Bool8x16.extractLane(b, 1),
                         SIMD.Bool8x16.extractLane(a, 2) == SIMD.Bool8x16.extractLane(b, 2),
                         SIMD.Bool8x16.extractLane(a, 3) == SIMD.Bool8x16.extractLane(b, 3),
                         SIMD.Bool8x16.extractLane(a, 4) == SIMD.Bool8x16.extractLane(b, 4),
                         SIMD.Bool8x16.extractLane(a, 5) == SIMD.Bool8x16.extractLane(b, 5),
                         SIMD.Bool8x16.extractLane(a, 6) == SIMD.Bool8x16.extractLane(b, 6),
                         SIMD.Bool8x16.extractLane(a, 7) == SIMD.Bool8x16.extractLane(b, 7),
                         SIMD.Bool8x16.extractLane(a, 8) == SIMD.Bool8x16.extractLane(b, 8),
                         SIMD.Bool8x16.extractLane(a, 9) == SIMD.Bool8x16.extractLane(b, 9),
                         SIMD.Bool8x16.extractLane(a, 10) == SIMD.Bool8x16.extractLane(b, 10),
                         SIMD.Bool8x16.extractLane(a, 11) == SIMD.Bool8x16.extractLane(b, 11),
                         SIMD.Bool8x16.extractLane(a, 12) == SIMD.Bool8x16.extractLane(b, 12),
                         SIMD.Bool8x16.extractLane(a, 13) == SIMD.Bool8x16.extractLane(b, 13),
                         SIMD.Bool8x16.extractLane(a, 14) == SIMD.Bool8x16.extractLane(b, 14),
                         SIMD.Bool8x16.extractLane(a, 15) == SIMD.Bool8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Bool8x16.notEqual === "undefined") {
  /**
    * @param {Bool8x16} a An instance of Bool8x16.
    * @param {Bool8x16} b An instance of Bool8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of a != b.
    */
  SIMD.Bool8x16.notEqual = function(a, b) {
    a = SIMD.Bool8x16.check(a);
    b = SIMD.Bool8x16.check(b);
    return SIMD.Bool8x16(SIMD.Bool8x16.extractLane(a, 0) != SIMD.Bool8x16.extractLane(b, 0),
                         SIMD.Bool8x16.extractLane(a, 1) != SIMD.Bool8x16.extractLane(b, 1),
                         SIMD.Bool8x16.extractLane(a, 2) != SIMD.Bool8x16.extractLane(b, 2),
                         SIMD.Bool8x16.extractLane(a, 3) != SIMD.Bool8x16.extractLane(b, 3),
                         SIMD.Bool8x16.extractLane(a, 4) != SIMD.Bool8x16.extractLane(b, 4),
                         SIMD.Bool8x16.extractLane(a, 5) != SIMD.Bool8x16.extractLane(b, 5),
                         SIMD.Bool8x16.extractLane(a, 6) != SIMD.Bool8x16.extractLane(b, 6),
                         SIMD.Bool8x16.extractLane(a, 7) != SIMD.Bool8x16.extractLane(b, 7),
                         SIMD.Bool8x16.extractLane(a, 8) != SIMD.Bool8x16.extractLane(b, 8),
                         SIMD.Bool8x16.extractLane(a, 9) != SIMD.Bool8x16.extractLane(b, 9),
                         SIMD.Bool8x16.extractLane(a, 10) != SIMD.Bool8x16.extractLane(b, 10),
                         SIMD.Bool8x16.extractLane(a, 11) != SIMD.Bool8x16.extractLane(b, 11),
                         SIMD.Bool8x16.extractLane(a, 12) != SIMD.Bool8x16.extractLane(b, 12),
                         SIMD.Bool8x16.extractLane(a, 13) != SIMD.Bool8x16.extractLane(b, 13),
                         SIMD.Bool8x16.extractLane(a, 14) != SIMD.Bool8x16.extractLane(b, 14),
                         SIMD.Bool8x16.extractLane(a, 15) != SIMD.Bool8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Bool8x16.select === "undefined") {
  /**
    * @param {Bool8x16} mask Selector mask. An instance of Bool8x16
    * @param {Bool8x16} trueValue Pick lane from here if corresponding
    * selector lane is 1
    * @param {Bool8x16} falseValue Pick lane from here if corresponding
    * selector lane is 0
    * @return {Bool8x16} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Bool8x16.select = function(mask, trueValue, falseValue) {
    mask = SIMD.Bool8x16.check(mask);
    trueValue = SIMD.Bool8x16.check(trueValue);
    falseValue = SIMD.Bool8x16.check(falseValue);
    var tr = SIMD.Bool8x16.and(mask, trueValue);
    var fr = SIMD.Bool8x16.and(SIMD.Bool8x16.not(mask), falseValue);
    return SIMD.Bool8x16.or(tr, fr);
  }
}

if (typeof SIMD.Float32x4 === "undefined") {
  /**
    * Construct a new instance of Float32x4 number.
    * @param {double} value used for x lane.
    * @param {double} value used for y lane.
    * @param {double} value used for z lane.
    * @param {double} value used for w lane.
    * @constructor
    */
  SIMD.Float32x4 = function(x, y, z, w) {
    if (!(this instanceof SIMD.Float32x4)) {
      return new SIMD.Float32x4(x, y, z, w);
    }

    this.x_ = truncatef32(x);
    this.y_ = truncatef32(y);
    this.z_ = truncatef32(z);
    this.w_ = truncatef32(w);
  }
}

if (typeof SIMD.Float32x4.extractLane === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {integer} i Index in concatenation of t for lane i
    * @return {double} The value in lane i of t.
    */
  SIMD.Float32x4.extractLane = function(t, i) {
    t = SIMD.Float32x4.check(t);
    check4(i);
    switch(i) {
      case 0: return t.x_;
      case 1: return t.y_;
      case 2: return t.z_;
      case 3: return t.w_;
    }
  }
}

if (typeof SIMD.Float32x4.replaceLane === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {integer} i Index in concatenation of t for lane i
    * @param {double} value used for lane i.
    * @return {Float32x4} New instance of Float32x4 with the values in t and
    * lane i replaced with {v}.
    */
  SIMD.Float32x4.replaceLane = function(t, i, v) {
    t = SIMD.Float32x4.check(t);
    check4(i);
    saveFloat32x4(t);
    _f32x4[i] = v;
    return restoreFloat32x4();
  }
}

if (typeof SIMD.Float32x4.check === "undefined") {
  /**
    * Check whether the argument is a Float32x4.
    * @param {Float32x4} v An instance of Float32x4.
    * @return {Float32x4} The Float32x4 instance.
    */
  SIMD.Float32x4.check = function(v) {
    if (!(v instanceof SIMD.Float32x4)) {
      throw new TypeError("argument is not a Float32x4.");
    }
    return v;
  }
}

if (typeof SIMD.Float32x4.splat === "undefined") {
  /**
    * Construct a new instance of Float32x4 with the same value
    * in all lanes.
    * @param {double} value used for all lanes.
    * @constructor
    */
  SIMD.Float32x4.splat = function(s) {
    return SIMD.Float32x4(s, s, s, s);
  }
}

if (typeof SIMD.Float32x4.fromFloat64x2 === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @return {Float32x4} A Float32x4 with .x and .y from t
    */
  SIMD.Float32x4.fromFloat64x2 = function(t) {
    t = SIMD.Float64x2.check(t);
    return SIMD.Float32x4(SIMD.Float64x2.extractLane(t, 0),
                          SIMD.Float64x2.extractLane(t, 1), 0, 0);
  }
}

if (typeof SIMD.Float32x4.fromInt32x4 === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @return {Float32x4} An integer to float conversion copy of t.
    */
  SIMD.Float32x4.fromInt32x4 = function(t) {
    t = SIMD.Int32x4.check(t);
    return SIMD.Float32x4(SIMD.Int32x4.extractLane(t, 0),
                          SIMD.Int32x4.extractLane(t, 1),
                          SIMD.Int32x4.extractLane(t, 2),
                          SIMD.Int32x4.extractLane(t, 3));
  }
}

if (typeof SIMD.Float32x4.fromFloat64x2Bits === "undefined") {
  /**
   * @param {Float64x2} t An instance of Float64x2.
   * @return {Float32x4} a bit-wise copy of t as a Float32x4.
   */
  SIMD.Float32x4.fromFloat64x2Bits = function(t) {
    saveFloat64x2(t);
    return restoreFloat32x4();
  }
}

if (typeof SIMD.Float32x4.fromInt32x4Bits === "undefined") {
  /**
   * @param {Int32x4} t An instance of Int32x4.
   * @return {Float32x4} a bit-wise copy of t as a Float32x4.
   */
  SIMD.Float32x4.fromInt32x4Bits = function(t) {
    saveInt32x4(t);
    return restoreFloat32x4();
  }
}

if (typeof SIMD.Float32x4.fromInt16x8Bits === "undefined") {
  /**
   * @param {Int16x8} t An instance of Int16x8.
   * @return {Float32x4} a bit-wise copy of t as a Float32x4.
   */
  SIMD.Float32x4.fromInt16x8Bits = function(t) {
    saveInt16x8(t);
    return restoreFloat32x4();
  }
}

if (typeof SIMD.Float32x4.fromInt8x16Bits === "undefined") {
  /**
   * @param {Int8x16} t An instance of Int8x16.
   * @return {Float32x4} a bit-wise copy of t as a Float32x4.
   */
  SIMD.Float32x4.fromInt8x16Bits = function(t) {
    saveInt8x16(t);
    return restoreFloat32x4();
  }
}

if (!Object.hasOwnProperty(SIMD.Float32x4.prototype, 'toString')) {
  /**
   * @return {String} a string representing the Float32x4.
   */
  SIMD.Float32x4.prototype.toString = function() {
    return "Float32x4(" +
      this.x_ + ", " +
      this.y_ + ", " +
      this.z_ + ", " +
      this.w_ + ")"
  }
}

if (!Object.hasOwnProperty(SIMD.Float32x4.prototype, 'toLocaleString')) {
  /**
   * @return {String} a locale-sensitive string representing the Float32x4.
   */
  SIMD.Float32x4.prototype.toLocaleString = function() {
    return "Float32x4(" +
      this.x_.toLocaleString() + ", " +
      this.y_.toLocaleString() + ", " +
      this.z_.toLocaleString() + ", " +
      this.w_.toLocaleString() + ")"
  }
}

if (!Object.hasOwnProperty(SIMD.Float32x4.prototype, 'valueOf')) {
  SIMD.Float32x4.prototype.valueOf = function() {
    throw new TypeError("Float32x4 cannot be converted to a number");
  }
}

if (typeof SIMD.Float64x2 === "undefined") {
  /**
    * Construct a new instance of Float64x2 number.
    * @param {double} value used for x lane.
    * @param {double} value used for y lane.
    * @constructor
    */
  SIMD.Float64x2 = function(x, y) {
    if (!(this instanceof SIMD.Float64x2)) {
      return new SIMD.Float64x2(x, y);
    }

    // Use unary + to force coercion to Number.
    this.x_ = +x;
    this.y_ = +y;
  }
}

if (typeof SIMD.Float64x2.extractLane === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {integer} i Index in concatenation of t for lane i
    * @return {double} The value in lane i of t.
    */
  SIMD.Float64x2.extractLane = function(t, i) {
    t = SIMD.Float64x2.check(t);
    check2(i);
    switch(i) {
      case 0: return t.x_;
      case 1: return t.y_;
    }
  }
}

if (typeof SIMD.Float64x2.replaceLane === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {integer} i Index in concatenation of t for lane i
    * @param {double} value used for lane i.
    * @return {Float64x2} New instance of Float64x2 with the values in t and
    * lane i replaced with {v}.
    */
  SIMD.Float64x2.replaceLane = function(t, i, v) {
    t = SIMD.Float64x2.check(t);
    check2(i);
    saveFloat64x2(t);
    _f64x2[i] = v;
    return restoreFloat64x2();
  }
}

if (typeof SIMD.Float64x2.check === "undefined") {
  /**
    * Check whether the argument is a Float64x2.
    * @param {Float64x2} v An instance of Float64x2.
    * @return {Float64x2} The Float64x2 instance.
    */
  SIMD.Float64x2.check = function(v) {
    if (!(v instanceof SIMD.Float64x2)) {
      throw new TypeError("argument is not a Float64x2.");
    }
    return v;
  }
}

if (typeof SIMD.Float64x2.splat === "undefined") {
  /**
    * Construct a new instance of Float64x2 with the same value
    * in all lanes.
    * @param {double} value used for all lanes.
    * @constructor
    */
  SIMD.Float64x2.splat = function(s) {
    return SIMD.Float64x2(s, s);
  }
}

if (typeof SIMD.Float64x2.fromFloat32x4 === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Float64x2} A Float64x2 with .x and .y from t
    */
  SIMD.Float64x2.fromFloat32x4 = function(t) {
    t = SIMD.Float32x4.check(t);
    return SIMD.Float64x2(SIMD.Float32x4.extractLane(t, 0),
                          SIMD.Float32x4.extractLane(t, 1));
  }
}

if (typeof SIMD.Float64x2.fromInt32x4 === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @return {Float64x2} A Float64x2 with .x and .y from t
    */
  SIMD.Float64x2.fromInt32x4 = function(t) {
    t = SIMD.Int32x4.check(t);
    return SIMD.Float64x2(SIMD.Int32x4.extractLane(t, 0),
                          SIMD.Int32x4.extractLane(t, 1));
  }
}

if (typeof SIMD.Float64x2.fromFloat32x4Bits === "undefined") {
  /**
   * @param {Float32x4} t An instance of Float32x4.
   * @return {Float64x2} a bit-wise copy of t as a Float64x2.
   */
  SIMD.Float64x2.fromFloat32x4Bits = function(t) {
    saveFloat32x4(t);
    return restoreFloat64x2();
  }
}

if (typeof SIMD.Float64x2.fromInt32x4Bits === "undefined") {
  /**
   * @param {Int32x4} t An instance of Int32x4.
   * @return {Float64x2} a bit-wise copy of t as a Float64x2.
   */
  SIMD.Float64x2.fromInt32x4Bits = function(t) {
    saveInt32x4(t);
    return restoreFloat64x2();
  }
}

if (typeof SIMD.Float64x2.fromInt16x8Bits === "undefined") {
  /**
   * @param {Int16x8} t An instance of Int16x8.
   * @return {Float64x2} a bit-wise copy of t as a Float64x2.
   */
  SIMD.Float64x2.fromInt16x8Bits = function(t) {
    saveInt16x8(t);
    return restoreFloat64x2();
  }
}

if (typeof SIMD.Float64x2.fromInt8x16Bits === "undefined") {
  /**
   * @param {Int8x16} t An instance of Int8x16.
   * @return {Float64x2} a bit-wise copy of t as a Float64x2.
   */
  SIMD.Float64x2.fromInt8x16Bits = function(t) {
    saveInt8x16(t);
    return restoreFloat64x2();
  }
}

if (!Object.hasOwnProperty(SIMD.Float64x2.prototype, 'toString')) {
  /**
   * @return {String} a string representing the Float64x2.
   */
  SIMD.Float64x2.prototype.toString = function() {
    return "Float64x2(" +
      this.x_ + ", " +
      this.y_ + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Float64x2.prototype, 'toLocaleString')) {
  /**
   * @return {String} a locale-sensitive string representing the Float64x2.
   */
  SIMD.Float64x2.prototype.toLocaleString = function() {
    return "Float64x2(" +
      this.x_.toLocaleString() + ", " +
      this.y_.toLocaleString() + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Float64x2.prototype, 'valueOf')) {
  SIMD.Float64x2.prototype.valueOf = function() {
    throw new TypeError("Float64x2 cannot be converted to a number");
  }
}


if (typeof SIMD.Int32x4 === "undefined") {
  /**
    * Construct a new instance of Int32x4 number.
    * @param {integer} 32-bit value used for x lane.
    * @param {integer} 32-bit value used for y lane.
    * @param {integer} 32-bit value used for z lane.
    * @param {integer} 32-bit value used for w lane.
    * @constructor
    */
  SIMD.Int32x4 = function(x, y, z, w) {
    if (!(this instanceof SIMD.Int32x4)) {
      return new SIMD.Int32x4(x, y, z, w);
    }

    this.x_ = x|0;
    this.y_ = y|0;
    this.z_ = z|0;
    this.w_ = w|0;
  }
}

if (typeof SIMD.Int32x4.extractLane === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {integer} i Index in concatenation of t for lane i
    * @return {integer} The value in lane i of t.
    */
  SIMD.Int32x4.extractLane = function(t, i) {
    t = SIMD.Int32x4.check(t);
    check4(i);
    switch(i) {
      case 0: return t.x_;
      case 1: return t.y_;
      case 2: return t.z_;
      case 3: return t.w_;
    }
  }
}

if (typeof SIMD.Int32x4.replaceLane === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {integer} i Index in concatenation of t for lane i
    * @param {integer} value used for lane i.
    * @return {Int32x4} New instance of Int32x4 with the values in t and
    * lane i replaced with {v}.
    */
  SIMD.Int32x4.replaceLane = function(t, i, v) {
    t = SIMD.Int32x4.check(t);
    check4(i);
    saveInt32x4(t);
    _i32x4[i] = v;
    return restoreInt32x4();
  }
}

if (typeof SIMD.Int32x4.check === "undefined") {
  /**
    * Check whether the argument is a Int32x4.
    * @param {Int32x4} v An instance of Int32x4.
    * @return {Int32x4} The Int32x4 instance.
    */
  SIMD.Int32x4.check = function(v) {
    if (!(v instanceof SIMD.Int32x4)) {
      throw new TypeError("argument is not a Int32x4.");
    }
    return v;
  }
}

if (typeof SIMD.Int32x4.splat === "undefined") {
  /**
    * Construct a new instance of Int32x4 with the same value
    * in all lanes.
    * @param {integer} value used for all lanes.
    * @constructor
    */
  SIMD.Int32x4.splat = function(s) {
    return SIMD.Int32x4(s, s, s, s);
  }
}

if (typeof SIMD.Int32x4.fromFloat32x4 === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Int32x4} with a integer to float conversion of t.
    */
  SIMD.Int32x4.fromFloat32x4 = function(t) {
    t = SIMD.Float32x4.check(t);
    return SIMD.Int32x4(int32FromFloat(SIMD.Float32x4.extractLane(t, 0)),
                        int32FromFloat(SIMD.Float32x4.extractLane(t, 1)),
                        int32FromFloat(SIMD.Float32x4.extractLane(t, 2)),
                        int32FromFloat(SIMD.Float32x4.extractLane(t, 3)));
  }
}

if (typeof SIMD.Int32x4.fromFloat64x2 === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @return {Int32x4}  An Int32x4 with .x and .y from t
    */
  SIMD.Int32x4.fromFloat64x2 = function(t) {
    t = SIMD.Float64x2.check(t);
    return SIMD.Int32x4(int32FromFloat(SIMD.Float64x2.extractLane(t, 0)),
                        int32FromFloat(SIMD.Float64x2.extractLane(t, 1)),
                        0,
                        0);
  }
}

if (typeof SIMD.Int32x4.fromFloat32x4Bits === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Int32x4} a bit-wise copy of t as a Int32x4.
    */
  SIMD.Int32x4.fromFloat32x4Bits = function(t) {
    saveFloat32x4(t);
    return restoreInt32x4();
  }
}

if (typeof SIMD.Int32x4.fromFloat64x2Bits === "undefined") {
  /**
   * @param {Float64x2} t An instance of Float64x2.
   * @return {Int32x4} a bit-wise copy of t as an Int32x4.
   */
  SIMD.Int32x4.fromFloat64x2Bits = function(t) {
    saveFloat64x2(t);
    return restoreInt32x4();
  }
}

if (typeof SIMD.Int32x4.fromInt16x8Bits === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @return {Int32x4} a bit-wise copy of t as a Int32x4.
    */
  SIMD.Int32x4.fromInt16x8Bits = function(t) {
    saveInt16x8(t);
    return restoreInt32x4();
  }
}

if (typeof SIMD.Int32x4.fromInt8x16Bits === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @return {Int32x4} a bit-wise copy of t as a Int32x4.
    */
  SIMD.Int32x4.fromInt8x16Bits = function(t) {
    saveInt8x16(t);
    return restoreInt32x4();
  }
}

if (!Object.hasOwnProperty(SIMD.Int32x4.prototype, 'toString')) {
  /**
   * @return {String} a string representing the Int32x4.
   */
  SIMD.Int32x4.prototype.toString = function() {
    return "Int32x4(" +
      this.x_ + ", " +
      this.y_ + ", " +
      this.z_ + ", " +
      this.w_ + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Int32x4.prototype, 'toLocaleString')) {
  /**
   * @return {String} a locale-sensitive string representing the Int32x4.
   */
  SIMD.Int32x4.prototype.toLocaleString = function() {
    return "Int32x4(" +
      this.x_.toLocaleString() + ", " +
      this.y_.toLocaleString() + ", " +
      this.z_.toLocaleString() + ", " +
      this.w_.toLocaleString() + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Int32x4.prototype, 'valueOf')) {
  SIMD.Int32x4.prototype.valueOf = function() {
    throw new TypeError("Int32x4 cannot be converted to a number");
  }
}

if (typeof SIMD.Int16x8 === "undefined") {
  /**
    * Construct a new instance of Int16x8 number.
    * @param {integer} 16-bit value used for s0 lane.
    * @param {integer} 16-bit value used for s1 lane.
    * @param {integer} 16-bit value used for s2 lane.
    * @param {integer} 16-bit value used for s3 lane.
    * @param {integer} 16-bit value used for s4 lane.
    * @param {integer} 16-bit value used for s5 lane.
    * @param {integer} 16-bit value used for s6 lane.
    * @param {integer} 16-bit value used for s7 lane.
    * @constructor
    */
  SIMD.Int16x8 = function(s0, s1, s2, s3, s4, s5, s6, s7) {
    if (!(this instanceof SIMD.Int16x8)) {
      return new SIMD.Int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
    }

    this.s0_ = s0 << 16 >> 16;
    this.s1_ = s1 << 16 >> 16;
    this.s2_ = s2 << 16 >> 16;
    this.s3_ = s3 << 16 >> 16;
    this.s4_ = s4 << 16 >> 16;
    this.s5_ = s5 << 16 >> 16;
    this.s6_ = s6 << 16 >> 16;
    this.s7_ = s7 << 16 >> 16;
  }
}

if (typeof SIMD.Int16x8.extractLane === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {integer} i Index in concatenation of t for lane i
    * @return {integer} The value in lane i of t.
    */
  SIMD.Int16x8.extractLane = function(t, i) {
    t = SIMD.Int16x8.check(t);
    check8(i);
    switch(i) {
      case 0: return t.s0_;
      case 1: return t.s1_;
      case 2: return t.s2_;
      case 3: return t.s3_;
      case 4: return t.s4_;
      case 5: return t.s5_;
      case 6: return t.s6_;
      case 7: return t.s7_;
    }
  }
}

if (typeof SIMD.Int16x8.replaceLane === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {integer} i Index in concatenation of t for lane i
    * @param {integer} value used for lane i.
    * @return {Int16x8} New instance of Int16x8 with the values in t and
    * lane i replaced with {v}.
    */
  SIMD.Int16x8.replaceLane = function(t, i, v) {
    t = SIMD.Int16x8.check(t);
    check8(i);
    saveInt16x8(t);
    _i16x8[i] = v;
    return restoreInt16x8();
  }
}

if (typeof SIMD.Int16x8.check === "undefined") {
  /**
    * Check whether the argument is a Int16x8.
    * @param {Int16x8} v An instance of Int16x8.
    * @return {Int16x8} The Int16x8 instance.
    */
  SIMD.Int16x8.check = function(v) {
    if (!(v instanceof SIMD.Int16x8)) {
      throw new TypeError("argument is not a Int16x8.");
    }
    return v;
  }
}

if (typeof SIMD.Int16x8.splat === "undefined") {
  /**
    * Construct a new instance of Int16x8 with the same value
    * in all lanes.
    * @param {integer} value used for all lanes.
    * @constructor
    */
  SIMD.Int16x8.splat = function(s) {
    return SIMD.Int16x8(s, s, s, s, s, s, s, s);
  }
}

if (typeof SIMD.Int16x8.fromFloat32x4Bits === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Int16x8} a bit-wise copy of t as a Int16x8.
    */
  SIMD.Int16x8.fromFloat32x4Bits = function(t) {
    saveFloat32x4(t);
    return restoreInt16x8();
  }
}

if (typeof SIMD.Int16x8.fromFloat64x2Bits === "undefined") {
  /**
   * @param {Float64x2} t An instance of Float64x2.
   * @return {Int16x8} a bit-wise copy of t as an Int16x8.
   */
  SIMD.Int16x8.fromFloat64x2Bits = function(t) {
    saveFloat64x2(t);
    return restoreInt16x8();
  }
}

if (typeof SIMD.Int16x8.fromInt32x4Bits === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @return {Int16x8} a bit-wise copy of t as a Int16x8.
    */
  SIMD.Int16x8.fromInt32x4Bits = function(t) {
    saveInt32x4(t);
    return restoreInt16x8();
  }
}

if (typeof SIMD.Int16x8.fromInt8x16Bits === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @return {Int16x8} a bit-wise copy of t as a Int16x8.
    */
  SIMD.Int16x8.fromInt8x16Bits = function(t) {
    saveInt8x16(t);
    return restoreInt16x8();
  }
}

if (!Object.hasOwnProperty(SIMD.Int16x8.prototype, 'toString')) {
  /**
   * @return {String} a string representing the Int16x8.
   */
  SIMD.Int16x8.prototype.toString = function() {
    return "Int16x8(" +
      this.s0_ + ", " +
      this.s1_ + ", " +
      this.s2_ + ", " +
      this.s3_ + ", " +
      this.s4_ + ", " +
      this.s5_ + ", " +
      this.s6_ + ", " +
      this.s7_ + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Int16x8.prototype, 'toLocaleString')) {
  /**
   * @return {String} a locale-sensitive string representing the Int16x8.
   */
  SIMD.Int16x8.prototype.toLocaleString = function() {
    return "Int16x8(" +
      this.s0_.toLocaleString() + ", " +
      this.s1_.toLocaleString() + ", " +
      this.s2_.toLocaleString() + ", " +
      this.s3_.toLocaleString() + ", " +
      this.s4_.toLocaleString() + ", " +
      this.s5_.toLocaleString() + ", " +
      this.s6_.toLocaleString() + ", " +
      this.s7_.toLocaleString() + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Int16x8.prototype, 'valueOf')) {
  SIMD.Int16x8.prototype.valueOf = function() {
    throw new TypeError("Int16x8 cannot be converted to a number");
  }
}

if (typeof SIMD.Int8x16 === "undefined") {
  /**
    * Construct a new instance of Int8x16 number.
    * @param {integer} 8-bit value used for s0 lane.
    * @param {integer} 8-bit value used for s1 lane.
    * @param {integer} 8-bit value used for s2 lane.
    * @param {integer} 8-bit value used for s3 lane.
    * @param {integer} 8-bit value used for s4 lane.
    * @param {integer} 8-bit value used for s5 lane.
    * @param {integer} 8-bit value used for s6 lane.
    * @param {integer} 8-bit value used for s7 lane.
    * @param {integer} 8-bit value used for s8 lane.
    * @param {integer} 8-bit value used for s9 lane.
    * @param {integer} 8-bit value used for s10 lane.
    * @param {integer} 8-bit value used for s11 lane.
    * @param {integer} 8-bit value used for s12 lane.
    * @param {integer} 8-bit value used for s13 lane.
    * @param {integer} 8-bit value used for s14 lane.
    * @param {integer} 8-bit value used for s15 lane.
    * @constructor
    */
  SIMD.Int8x16 = function(s0, s1, s2, s3, s4, s5, s6, s7,
                          s8, s9, s10, s11, s12, s13, s14, s15) {
    if (!(this instanceof SIMD.Int8x16)) {
      return new SIMD.Int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                              s8, s9, s10, s11, s12, s13, s14, s15);
    }

    this.s0_ = s0 << 24 >> 24;
    this.s1_ = s1 << 24 >> 24;
    this.s2_ = s2 << 24 >> 24;
    this.s3_ = s3 << 24 >> 24;
    this.s4_ = s4 << 24 >> 24;
    this.s5_ = s5 << 24 >> 24;
    this.s6_ = s6 << 24 >> 24;
    this.s7_ = s7 << 24 >> 24;
    this.s8_ = s8 << 24 >> 24;
    this.s9_ = s9 << 24 >> 24;
    this.s10_ = s10 << 24 >> 24;
    this.s11_ = s11 << 24 >> 24;
    this.s12_ = s12 << 24 >> 24;
    this.s13_ = s13 << 24 >> 24;
    this.s14_ = s14 << 24 >> 24;
    this.s15_ = s15 << 24 >> 24;
  }
}

if (typeof SIMD.Int8x16.extractLane === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {integer} i Index in concatenation of t for lane i
    * @return {integer} The value in lane i of t.
    */
  SIMD.Int8x16.extractLane = function(t, i) {
    t = SIMD.Int8x16.check(t);
    check16(i);
    switch(i) {
      case 0: return t.s0_;
      case 1: return t.s1_;
      case 2: return t.s2_;
      case 3: return t.s3_;
      case 4: return t.s4_;
      case 5: return t.s5_;
      case 6: return t.s6_;
      case 7: return t.s7_;
      case 8: return t.s8_;
      case 9: return t.s9_;
      case 10: return t.s10_;
      case 11: return t.s11_;
      case 12: return t.s12_;
      case 13: return t.s13_;
      case 14: return t.s14_;
      case 15: return t.s15_;
    }
  }
}

if (typeof SIMD.Int8x16.replaceLane === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {integer} i Index in concatenation of t for lane i
    * @param {integer} value used for lane i.
    * @return {Int8x16} New instance of Int8x16 with the values in t and
    * lane i replaced with {v}.
    */
  SIMD.Int8x16.replaceLane = function(t, i, v) {
    t = SIMD.Int8x16.check(t);
    check16(i);
    saveInt8x16(t);
    _i8x16[i] = v;
    return restoreInt8x16();
  }
}

if (typeof SIMD.Int8x16.check === "undefined") {
  /**
    * Check whether the argument is a Int8x16.
    * @param {Int8x16} v An instance of Int8x16.
    * @return {Int8x16} The Int8x16 instance.
    */
  SIMD.Int8x16.check = function(v) {
    if (!(v instanceof SIMD.Int8x16)) {
      throw new TypeError("argument is not a Int8x16.");
    }
    return v;
  }
}

if (typeof SIMD.Int8x16.splat === "undefined") {
  /**
    * Construct a new instance of Int8x16 with the same value
    * in all lanes.
    * @param {integer} value used for all lanes.
    * @constructor
    */
  SIMD.Int8x16.splat = function(s) {
    return SIMD.Int8x16(s, s, s, s, s, s, s, s,
                        s, s, s, s, s, s, s, s);
  }
}

if (typeof SIMD.Int8x16.fromFloat32x4Bits === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Int8x16} a bit-wise copy of t as a Int8x16.
    */
  SIMD.Int8x16.fromFloat32x4Bits = function(t) {
    saveFloat32x4(t);
    return restoreInt8x16();
  }
}

if (typeof SIMD.Int8x16.fromFloat64x2Bits === "undefined") {
  /**
   * @param {Float64x2} t An instance of Float64x2.
   * @return {Int8x16} a bit-wise copy of t as an Int8x16.
   */
  SIMD.Int8x16.fromFloat64x2Bits = function(t) {
    saveFloat64x2(t);
    return restoreInt8x16();
  }
}

if (typeof SIMD.Int8x16.fromInt32x4Bits === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @return {Int8x16} a bit-wise copy of t as a Int8x16.
    */
  SIMD.Int8x16.fromInt32x4Bits = function(t) {
    saveInt32x4(t);
    return restoreInt8x16();
  }
}

if (typeof SIMD.Int8x16.fromInt16x8Bits === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @return {Int8x16} a bit-wise copy of t as a Int8x16.
    */
  SIMD.Int8x16.fromInt16x8Bits = function(t) {
    saveInt16x8(t);
    return restoreInt8x16();
  }
}

if (!Object.hasOwnProperty(SIMD.Int8x16.prototype, 'toString')) {
  /**
   * @return {String} a string representing the Int8x16.
   */
  SIMD.Int8x16.prototype.toString = function() {
    return "Int8x16(" +
      this.s0_ + ", " +
      this.s1_ + ", " +
      this.s2_ + ", " +
      this.s3_ + ", " +
      this.s4_ + ", " +
      this.s5_ + ", " +
      this.s6_ + ", " +
      this.s7_ + ", " +
      this.s8_ + ", " +
      this.s9_ + ", " +
      this.s10_ + ", " +
      this.s11_ + ", " +
      this.s12_ + ", " +
      this.s13_ + ", " +
      this.s14_ + ", " +
      this.s15_ + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Int8x16.prototype, 'toLocaleString')) {
  /**
   * @return {String} a locale-sensitive string representing the Int8x16.
   */
  SIMD.Int8x16.prototype.toLocaleString = function() {
    return "Int8x16(" +
      this.s0_.toLocaleString() + ", " +
      this.s1_.toLocaleString() + ", " +
      this.s2_.toLocaleString() + ", " +
      this.s3_.toLocaleString() + ", " +
      this.s4_.toLocaleString() + ", " +
      this.s5_.toLocaleString() + ", " +
      this.s6_.toLocaleString() + ", " +
      this.s7_.toLocaleString() + ", " +
      this.s8_.toLocaleString() + ", " +
      this.s9_.toLocaleString() + ", " +
      this.s10_.toLocaleString() + ", " +
      this.s11_.toLocaleString() + ", " +
      this.s12_.toLocaleString() + ", " +
      this.s13_.toLocaleString() + ", " +
      this.s14_.toLocaleString() + ", " +
      this.s15_.toLocaleString() + ")";
  }
}

if (!Object.hasOwnProperty(SIMD.Int8x16.prototype, 'valueOf')) {
  SIMD.Int8x16.prototype.valueOf = function() {
    throw new TypeError("Int8x16 cannot be converted to a number");
  }
}

if (typeof SIMD.Float32x4.abs === "undefined") {
  /**
   * @param {Float32x4} t An instance of Float32x4.
   * @return {Float32x4} New instance of Float32x4 with absolute values of
   * t.
   */
  SIMD.Float32x4.abs = function(t) {
    t = SIMD.Float32x4.check(t);
    return SIMD.Float32x4(Math.abs(SIMD.Float32x4.extractLane(t, 0)),
                          Math.abs(SIMD.Float32x4.extractLane(t, 1)),
                          Math.abs(SIMD.Float32x4.extractLane(t, 2)),
                          Math.abs(SIMD.Float32x4.extractLane(t, 3)));
  }
}

if (typeof SIMD.Float32x4.neg === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with negated values of
    * t.
    */
  SIMD.Float32x4.neg = function(t) {
    t = SIMD.Float32x4.check(t);
    return SIMD.Float32x4(-SIMD.Float32x4.extractLane(t, 0),
                          -SIMD.Float32x4.extractLane(t, 1),
                          -SIMD.Float32x4.extractLane(t, 2),
                          -SIMD.Float32x4.extractLane(t, 3));
  }
}

if (typeof SIMD.Float32x4.add === "undefined") {
  /**
    * @param {Float32x4} a An instance of Float32x4.
    * @param {Float32x4} b An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with a + b.
    */
  SIMD.Float32x4.add = function(a, b) {
    a = SIMD.Float32x4.check(a);
    b = SIMD.Float32x4.check(b);
    return SIMD.Float32x4(
        SIMD.Float32x4.extractLane(a, 0) + SIMD.Float32x4.extractLane(b, 0),
        SIMD.Float32x4.extractLane(a, 1) + SIMD.Float32x4.extractLane(b, 1),
        SIMD.Float32x4.extractLane(a, 2) + SIMD.Float32x4.extractLane(b, 2),
        SIMD.Float32x4.extractLane(a, 3) + SIMD.Float32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Float32x4.sub === "undefined") {
  /**
    * @param {Float32x4} a An instance of Float32x4.
    * @param {Float32x4} b An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with a - b.
    */
  SIMD.Float32x4.sub = function(a, b) {
    a = SIMD.Float32x4.check(a);
    b = SIMD.Float32x4.check(b);
    return SIMD.Float32x4(
        SIMD.Float32x4.extractLane(a, 0) - SIMD.Float32x4.extractLane(b, 0),
        SIMD.Float32x4.extractLane(a, 1) - SIMD.Float32x4.extractLane(b, 1),
        SIMD.Float32x4.extractLane(a, 2) - SIMD.Float32x4.extractLane(b, 2),
        SIMD.Float32x4.extractLane(a, 3) - SIMD.Float32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Float32x4.mul === "undefined") {
  /**
    * @param {Float32x4} a An instance of Float32x4.
    * @param {Float32x4} b An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with a * b.
    */
  SIMD.Float32x4.mul = function(a, b) {
    a = SIMD.Float32x4.check(a);
    b = SIMD.Float32x4.check(b);
    return SIMD.Float32x4(
        SIMD.Float32x4.extractLane(a, 0) * SIMD.Float32x4.extractLane(b, 0),
        SIMD.Float32x4.extractLane(a, 1) * SIMD.Float32x4.extractLane(b, 1),
        SIMD.Float32x4.extractLane(a, 2) * SIMD.Float32x4.extractLane(b, 2),
        SIMD.Float32x4.extractLane(a, 3) * SIMD.Float32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Float32x4.div === "undefined") {
  /**
    * @param {Float32x4} a An instance of Float32x4.
    * @param {Float32x4} b An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with a / b.
    */
  SIMD.Float32x4.div = function(a, b) {
    a = SIMD.Float32x4.check(a);
    b = SIMD.Float32x4.check(b);
    return SIMD.Float32x4(
        SIMD.Float32x4.extractLane(a, 0) / SIMD.Float32x4.extractLane(b, 0),
        SIMD.Float32x4.extractLane(a, 1) / SIMD.Float32x4.extractLane(b, 1),
        SIMD.Float32x4.extractLane(a, 2) / SIMD.Float32x4.extractLane(b, 2),
        SIMD.Float32x4.extractLane(a, 3) / SIMD.Float32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Float32x4.min === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with the minimum value of
    * t and other.
    */
  SIMD.Float32x4.min = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = Math.min(SIMD.Float32x4.extractLane(t, 0),
                      SIMD.Float32x4.extractLane(other, 0));
    var cy = Math.min(SIMD.Float32x4.extractLane(t, 1),
                      SIMD.Float32x4.extractLane(other, 1));
    var cz = Math.min(SIMD.Float32x4.extractLane(t, 2),
                      SIMD.Float32x4.extractLane(other, 2));
    var cw = Math.min(SIMD.Float32x4.extractLane(t, 3),
                      SIMD.Float32x4.extractLane(other, 3));
    return SIMD.Float32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.max === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with the maximum value of
    * t and other.
    */
  SIMD.Float32x4.max = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = Math.max(SIMD.Float32x4.extractLane(t, 0),
                      SIMD.Float32x4.extractLane(other, 0));
    var cy = Math.max(SIMD.Float32x4.extractLane(t, 1),
                      SIMD.Float32x4.extractLane(other, 1));
    var cz = Math.max(SIMD.Float32x4.extractLane(t, 2),
                      SIMD.Float32x4.extractLane(other, 2));
    var cw = Math.max(SIMD.Float32x4.extractLane(t, 3),
                      SIMD.Float32x4.extractLane(other, 3));
    return SIMD.Float32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.minNum === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with the minimum value of
    * t and other, preferring numbers over NaNs.
    */
  SIMD.Float32x4.minNum = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = minNum(SIMD.Float32x4.extractLane(t, 0),
                    SIMD.Float32x4.extractLane(other, 0));
    var cy = minNum(SIMD.Float32x4.extractLane(t, 1),
                    SIMD.Float32x4.extractLane(other, 1));
    var cz = minNum(SIMD.Float32x4.extractLane(t, 2),
                    SIMD.Float32x4.extractLane(other, 2));
    var cw = minNum(SIMD.Float32x4.extractLane(t, 3),
                    SIMD.Float32x4.extractLane(other, 3));
    return SIMD.Float32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.maxNum === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with the maximum value of
    * t and other, preferring numbers over NaNs.
    */
  SIMD.Float32x4.maxNum = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = maxNum(SIMD.Float32x4.extractLane(t, 0),
                    SIMD.Float32x4.extractLane(other, 0));
    var cy = maxNum(SIMD.Float32x4.extractLane(t, 1),
                    SIMD.Float32x4.extractLane(other, 1));
    var cz = maxNum(SIMD.Float32x4.extractLane(t, 2),
                    SIMD.Float32x4.extractLane(other, 2));
    var cw = maxNum(SIMD.Float32x4.extractLane(t, 3),
                    SIMD.Float32x4.extractLane(other, 3));
    return SIMD.Float32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.reciprocalApproximation === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with an approximation of the
    * reciprocal value of t.
    */
  SIMD.Float32x4.reciprocalApproximation = function(t) {
    t = SIMD.Float32x4.check(t);
    return SIMD.Float32x4.div(SIMD.Float32x4.splat(1.0), t);
  }
}

if (typeof SIMD.Float32x4.reciprocalSqrtApproximation === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with an approximation of the
    * reciprocal value of the square root of t.
    */
  SIMD.Float32x4.reciprocalSqrtApproximation = function(t) {
    t = SIMD.Float32x4.check(t);
    return SIMD.Float32x4.reciprocalApproximation(SIMD.Float32x4.sqrt(t));
  }
}

if (typeof SIMD.Float32x4.sqrt === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @return {Float32x4} New instance of Float32x4 with square root of
    * values of t.
    */
  SIMD.Float32x4.sqrt = function(t) {
    t = SIMD.Float32x4.check(t);
    return SIMD.Float32x4(Math.sqrt(SIMD.Float32x4.extractLane(t, 0)),
                          Math.sqrt(SIMD.Float32x4.extractLane(t, 1)),
                          Math.sqrt(SIMD.Float32x4.extractLane(t, 2)),
                          Math.sqrt(SIMD.Float32x4.extractLane(t, 3)));
  }
}

if (typeof SIMD.Float32x4.swizzle === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4 to be swizzled.
    * @param {integer} x - Index in t for lane x
    * @param {integer} y - Index in t for lane y
    * @param {integer} z - Index in t for lane z
    * @param {integer} w - Index in t for lane w
    * @return {Float32x4} New instance of Float32x4 with lanes swizzled.
    */
  SIMD.Float32x4.swizzle = function(t, x, y, z, w) {
    t = SIMD.Float32x4.check(t);
    check4(x);
    check4(y);
    check4(z);
    check4(w);
    _f32x4[0] = SIMD.Float32x4.extractLane(t, 0);
    _f32x4[1] = SIMD.Float32x4.extractLane(t, 1);
    _f32x4[2] = SIMD.Float32x4.extractLane(t, 2);
    _f32x4[3] = SIMD.Float32x4.extractLane(t, 3);
    var storage = _f32x4;
    return SIMD.Float32x4(storage[x], storage[y], storage[z], storage[w]);
  }
}

if (typeof SIMD.Float32x4.shuffle === "undefined") {

  _f32x8 = new Float32Array(8);

  /**
    * @param {Float32x4} t1 An instance of Float32x4 to be shuffled.
    * @param {Float32x4} t2 An instance of Float32x4 to be shuffled.
    * @param {integer} x - Index in concatenation of t1 and t2 for lane x
    * @param {integer} y - Index in concatenation of t1 and t2 for lane y
    * @param {integer} z - Index in concatenation of t1 and t2 for lane z
    * @param {integer} w - Index in concatenation of t1 and t2 for lane w
    * @return {Float32x4} New instance of Float32x4 with lanes shuffled.
    */
  SIMD.Float32x4.shuffle = function(t1, t2, x, y, z, w) {
    t1 = SIMD.Float32x4.check(t1);
    t2 = SIMD.Float32x4.check(t2);
    check8(x);
    check8(y);
    check8(z);
    check8(w);
    var storage = _f32x8;
    storage[0] = SIMD.Float32x4.extractLane(t1, 0);
    storage[1] = SIMD.Float32x4.extractLane(t1, 1);
    storage[2] = SIMD.Float32x4.extractLane(t1, 2);
    storage[3] = SIMD.Float32x4.extractLane(t1, 3);
    storage[4] = SIMD.Float32x4.extractLane(t2, 0);
    storage[5] = SIMD.Float32x4.extractLane(t2, 1);
    storage[6] = SIMD.Float32x4.extractLane(t2, 2);
    storage[7] = SIMD.Float32x4.extractLane(t2, 3);
    return SIMD.Float32x4(storage[x], storage[y], storage[z], storage[w]);
  }
}

if (typeof SIMD.Float32x4.lessThan === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t < other.
    */
  SIMD.Float32x4.lessThan = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx =
        SIMD.Float32x4.extractLane(t, 0) < SIMD.Float32x4.extractLane(other, 0);
    var cy =
        SIMD.Float32x4.extractLane(t, 1) < SIMD.Float32x4.extractLane(other, 1);
    var cz =
        SIMD.Float32x4.extractLane(t, 2) < SIMD.Float32x4.extractLane(other, 2);
    var cw =
        SIMD.Float32x4.extractLane(t, 3) < SIMD.Float32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.lessThanOrEqual === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t <= other.
    */
  SIMD.Float32x4.lessThanOrEqual = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = SIMD.Float32x4.extractLane(t, 0) <=
        SIMD.Float32x4.extractLane(other, 0);
    var cy = SIMD.Float32x4.extractLane(t, 1) <=
        SIMD.Float32x4.extractLane(other, 1);
    var cz = SIMD.Float32x4.extractLane(t, 2) <=
        SIMD.Float32x4.extractLane(other, 2);
    var cw = SIMD.Float32x4.extractLane(t, 3) <=
        SIMD.Float32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.equal === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t == other.
    */
  SIMD.Float32x4.equal = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = SIMD.Float32x4.extractLane(t, 0) ==
        SIMD.Float32x4.extractLane(other, 0);
    var cy = SIMD.Float32x4.extractLane(t, 1) ==
        SIMD.Float32x4.extractLane(other, 1);
    var cz = SIMD.Float32x4.extractLane(t, 2) ==
        SIMD.Float32x4.extractLane(other, 2);
    var cw = SIMD.Float32x4.extractLane(t, 3) ==
        SIMD.Float32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.notEqual === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t != other.
    */
  SIMD.Float32x4.notEqual = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = SIMD.Float32x4.extractLane(t, 0) !=
        SIMD.Float32x4.extractLane(other, 0);
    var cy = SIMD.Float32x4.extractLane(t, 1) !=
        SIMD.Float32x4.extractLane(other, 1);
    var cz = SIMD.Float32x4.extractLane(t, 2) !=
        SIMD.Float32x4.extractLane(other, 2);
    var cw = SIMD.Float32x4.extractLane(t, 3) !=
        SIMD.Float32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.greaterThanOrEqual === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t >= other.
    */
  SIMD.Float32x4.greaterThanOrEqual = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx = SIMD.Float32x4.extractLane(t, 0) >=
        SIMD.Float32x4.extractLane(other, 0);
    var cy = SIMD.Float32x4.extractLane(t, 1) >=
        SIMD.Float32x4.extractLane(other, 1);
    var cz = SIMD.Float32x4.extractLane(t, 2) >=
        SIMD.Float32x4.extractLane(other, 2);
    var cw = SIMD.Float32x4.extractLane(t, 3) >=
        SIMD.Float32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.greaterThan === "undefined") {
  /**
    * @param {Float32x4} t An instance of Float32x4.
    * @param {Float32x4} other An instance of Float32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t > other.
    */
  SIMD.Float32x4.greaterThan = function(t, other) {
    t = SIMD.Float32x4.check(t);
    other = SIMD.Float32x4.check(other);
    var cx =
        SIMD.Float32x4.extractLane(t, 0) > SIMD.Float32x4.extractLane(other, 0);
    var cy =
        SIMD.Float32x4.extractLane(t, 1) > SIMD.Float32x4.extractLane(other, 1);
    var cz =
        SIMD.Float32x4.extractLane(t, 2) > SIMD.Float32x4.extractLane(other, 2);
    var cw =
        SIMD.Float32x4.extractLane(t, 3) > SIMD.Float32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Float32x4.select === "undefined") {
  /**
    * @param {Bool32x4} t Selector mask. An instance of Bool32x4
    * @param {Float32x4} trueValue Pick lane from here if corresponding
    * selector lane is true
    * @param {Float32x4} falseValue Pick lane from here if corresponding
    * selector lane is false
    * @return {Float32x4} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Float32x4.select = function(t, trueValue, falseValue) {
    t = SIMD.Bool32x4.check(t);
    trueValue = SIMD.Float32x4.check(trueValue);
    falseValue = SIMD.Float32x4.check(falseValue);
    return SIMD.Float32x4(
        SIMD.Bool32x4.extractLane(t, 0) ?
            SIMD.Float32x4.extractLane(trueValue, 0) :
                SIMD.Float32x4.extractLane(falseValue, 0),
        SIMD.Bool32x4.extractLane(t, 1) ?
            SIMD.Float32x4.extractLane(trueValue, 1) :
                SIMD.Float32x4.extractLane(falseValue, 1),
        SIMD.Bool32x4.extractLane(t, 2) ?
            SIMD.Float32x4.extractLane(trueValue, 2) :
                SIMD.Float32x4.extractLane(falseValue, 2),
        SIMD.Bool32x4.extractLane(t, 3) ?
            SIMD.Float32x4.extractLane(trueValue, 3) :
                SIMD.Float32x4.extractLane(falseValue, 3));
  }
}

if (typeof SIMD.Float32x4.load === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Float32x4} New instance of Float32x4.
    */
  SIMD.Float32x4.load = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var f32temp = _f32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? f32temp : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Float32x4(f32temp[0], f32temp[1], f32temp[2], f32temp[3]);
  }
}

if (typeof SIMD.Float32x4.load1 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Float32x4} New instance of Float32x4.
    */
  SIMD.Float32x4.load1 = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 4) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var f32temp = _f32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? f32temp : _i32x4) :
                _f64x2;
    var n = 4 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Float32x4(f32temp[0], 0.0, 0.0, 0.0);
  }
}

if (typeof SIMD.Float32x4.load2 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Float32x4} New instance of Float32x4.
    */
  SIMD.Float32x4.load2 = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 8) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var f32temp = _f32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? f32temp : _i32x4) :
                _f64x2;
    var n = 8 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Float32x4(f32temp[0], f32temp[1], 0.0, 0.0);
  }
}

if (typeof SIMD.Float32x4.load3 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Float32x4} New instance of Float32x4.
    */
  SIMD.Float32x4.load3 = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 12) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var f32temp = _f32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? f32temp : _i32x4) :
                _f64x2;
    var n = 12 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Float32x4(f32temp[0], f32temp[1], f32temp[2], 0.0);
  }
}

if (typeof SIMD.Float32x4.store === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Float32x4} value An instance of Float32x4.
    * @return {Float32x4} value
    */
  SIMD.Float32x4.store = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Float32x4.check(value);
    _f32x4[0] = SIMD.Float32x4.extractLane(value, 0);
    _f32x4[1] = SIMD.Float32x4.extractLane(value, 1);
    _f32x4[2] = SIMD.Float32x4.extractLane(value, 2);
    _f32x4[3] = SIMD.Float32x4.extractLane(value, 3);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

if (typeof SIMD.Float32x4.store1 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Float32x4} value An instance of Float32x4.
    * @return {Float32x4} value
    */
  SIMD.Float32x4.store1 = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 4) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Float32x4.check(value);
    if (bpe == 8) {
      // tarray's elements are too wide. Just create a new view; this is rare.
      var view = new Float32Array(tarray.buffer,
                                  tarray.byteOffset + index * 8, 1);
      view[0] = SIMD.Float32x4.extractLane(value, 0);
    } else {
      _f32x4[0] = SIMD.Float32x4.extractLane(value, 0);
      var array = bpe == 1 ? _i8x16 :
                  bpe == 2 ? _i16x8 :
                  (tarray instanceof Float32Array ? _f32x4 : _i32x4);
      var n = 4 / bpe;
      for (var i = 0; i < n; ++i)
        tarray[index + i] = array[i];
      return value;
    }
  }
}

if (typeof SIMD.Float32x4.store2 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Float32x4} value An instance of Float32x4.
    * @return {Float32x4} value
    */
  SIMD.Float32x4.store2 = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 8) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Float32x4.check(value);
    _f32x4[0] = SIMD.Float32x4.extractLane(value, 0);
    _f32x4[1] = SIMD.Float32x4.extractLane(value, 1);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 8 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

if (typeof SIMD.Float32x4.store3 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Float32x4} value An instance of Float32x4.
    * @return {Float32x4} value
    */
  SIMD.Float32x4.store3 = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 12) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Float32x4.check(value);
    if (bpe == 8) {
      // tarray's elements are too wide. Just create a new view; this is rare.
      var view = new Float32Array(tarray.buffer,
                                  tarray.byteOffset + index * 8, 3);
      view[0] = SIMD.Float32x4.extractLane(value, 0);
      view[1] = SIMD.Float32x4.extractLane(value, 1);
      view[2] = SIMD.Float32x4.extractLane(value, 2);
    } else {
      _f32x4[0] = SIMD.Float32x4.extractLane(value, 0);
      _f32x4[1] = SIMD.Float32x4.extractLane(value, 1);
      _f32x4[2] = SIMD.Float32x4.extractLane(value, 2);
      var array = bpe == 1 ? _i8x16 :
                  bpe == 2 ? _i16x8 :
                  (tarray instanceof Float32Array ? _f32x4 : _i32x4);
      var n = 12 / bpe;
      for (var i = 0; i < n; ++i)
        tarray[index + i] = array[i];
      return value;
    }
  }
}

if (typeof SIMD.Float64x2.abs === "undefined") {
  /**
   * @param {Float64x2} t An instance of Float64x2.
   * @return {Float64x2} New instance of Float64x2 with absolute values of
   * t.
   */
  SIMD.Float64x2.abs = function(t) {
    t = SIMD.Float64x2.check(t);
    return SIMD.Float64x2(Math.abs(SIMD.Float64x2.extractLane(t, 0)),
                          Math.abs(SIMD.Float64x2.extractLane(t, 1)));
  }
}

if (typeof SIMD.Float64x2.neg === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with negated values of
    * t.
    */
  SIMD.Float64x2.neg = function(t) {
    t = SIMD.Float64x2.check(t);
    return SIMD.Float64x2(-SIMD.Float64x2.extractLane(t, 0),
                          -SIMD.Float64x2.extractLane(t, 1));
  }
}

if (typeof SIMD.Float64x2.add === "undefined") {
  /**
    * @param {Float64x2} a An instance of Float64x2.
    * @param {Float64x2} b An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with a + b.
    */
  SIMD.Float64x2.add = function(a, b) {
    a = SIMD.Float64x2.check(a);
    b = SIMD.Float64x2.check(b);
    return SIMD.Float64x2(
        SIMD.Float64x2.extractLane(a, 0) + SIMD.Float64x2.extractLane(b, 0),
        SIMD.Float64x2.extractLane(a, 1) + SIMD.Float64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Float64x2.sub === "undefined") {
  /**
    * @param {Float64x2} a An instance of Float64x2.
    * @param {Float64x2} b An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with a - b.
    */
  SIMD.Float64x2.sub = function(a, b) {
    a = SIMD.Float64x2.check(a);
    b = SIMD.Float64x2.check(b);
    return SIMD.Float64x2(
        SIMD.Float64x2.extractLane(a, 0) - SIMD.Float64x2.extractLane(b, 0),
        SIMD.Float64x2.extractLane(a, 1) - SIMD.Float64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Float64x2.mul === "undefined") {
  /**
    * @param {Float64x2} a An instance of Float64x2.
    * @param {Float64x2} b An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with a * b.
    */
  SIMD.Float64x2.mul = function(a, b) {
    a = SIMD.Float64x2.check(a);
    b = SIMD.Float64x2.check(b);
    return SIMD.Float64x2(
        SIMD.Float64x2.extractLane(a, 0) * SIMD.Float64x2.extractLane(b, 0),
        SIMD.Float64x2.extractLane(a, 1) * SIMD.Float64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Float64x2.div === "undefined") {
  /**
    * @param {Float64x2} a An instance of Float64x2.
    * @param {Float64x2} b An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with a / b.
    */
  SIMD.Float64x2.div = function(a, b) {
    a = SIMD.Float64x2.check(a);
    b = SIMD.Float64x2.check(b);
    return SIMD.Float64x2(
        SIMD.Float64x2.extractLane(a, 0) / SIMD.Float64x2.extractLane(b, 0),
        SIMD.Float64x2.extractLane(a, 1) / SIMD.Float64x2.extractLane(b, 1));
  }
}

if (typeof SIMD.Float64x2.min === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with the minimum value of
    * t and other.
    */
  SIMD.Float64x2.min = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = Math.min(SIMD.Float64x2.extractLane(t, 0),
                      SIMD.Float64x2.extractLane(other, 0));
    var cy = Math.min(SIMD.Float64x2.extractLane(t, 1),
                      SIMD.Float64x2.extractLane(other, 1));
    return SIMD.Float64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.max === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with the maximum value of
    * t and other.
    */
  SIMD.Float64x2.max = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = Math.max(SIMD.Float64x2.extractLane(t, 0),
                      SIMD.Float64x2.extractLane(other, 0));
    var cy = Math.max(SIMD.Float64x2.extractLane(t, 1),
                      SIMD.Float64x2.extractLane(other, 1));
    return SIMD.Float64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.minNum === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with the minimum value of
    * t and other, preferring numbers over NaNs.
    */
  SIMD.Float64x2.minNum = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = minNum(SIMD.Float64x2.extractLane(t, 0),
                    SIMD.Float64x2.extractLane(other, 0));
    var cy = minNum(SIMD.Float64x2.extractLane(t, 1),
                    SIMD.Float64x2.extractLane(other, 1));
    return SIMD.Float64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.maxNum === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with the maximum value of
    * t and other, preferring numbers over NaNs.
    */
  SIMD.Float64x2.maxNum = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = maxNum(SIMD.Float64x2.extractLane(t, 0),
                    SIMD.Float64x2.extractLane(other, 0));
    var cy = maxNum(SIMD.Float64x2.extractLane(t, 1),
                    SIMD.Float64x2.extractLane(other, 1));
    return SIMD.Float64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.reciprocalApproximation === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with an approximation of the
    * reciprocal value of t.
    */
  SIMD.Float64x2.reciprocalApproximation = function(t) {
    t = SIMD.Float64x2.check(t);
    return SIMD.Float64x2.div(SIMD.Float64x2.splat(1.0), t);
  }
}

if (typeof SIMD.Float64x2.reciprocalSqrtApproximation === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with an approximation of the
    * reciprocal value of the square root of t.
    */
  SIMD.Float64x2.reciprocalSqrtApproximation = function(t) {
    t = SIMD.Float64x2.check(t);
    return SIMD.Float64x2.reciprocalApproximation(SIMD.Float64x2.sqrt(t));
  }
}

if (typeof SIMD.Float64x2.sqrt === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @return {Float64x2} New instance of Float64x2 with square root of
    * values of t.
    */
  SIMD.Float64x2.sqrt = function(t) {
    t = SIMD.Float64x2.check(t);
    return SIMD.Float64x2(Math.sqrt(SIMD.Float64x2.extractLane(t, 0)),
                          Math.sqrt(SIMD.Float64x2.extractLane(t, 1)));
  }
}

if (typeof SIMD.Float64x2.swizzle === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2 to be swizzled.
    * @param {integer} x - Index in t for lane x
    * @param {integer} y - Index in t for lane y
    * @return {Float64x2} New instance of Float64x2 with lanes swizzled.
    */
  SIMD.Float64x2.swizzle = function(t, x, y) {
    t = SIMD.Float64x2.check(t);
    check2(x);
    check2(y);
    var storage = _f64x2;
    storage[0] = SIMD.Float64x2.extractLane(t, 0);
    storage[1] = SIMD.Float64x2.extractLane(t, 1);
    return SIMD.Float64x2(storage[x], storage[y]);
  }
}

if (typeof SIMD.Float64x2.shuffle === "undefined") {

  _f64x4 = new Float64Array(4);

  /**
    * @param {Float64x2} t1 An instance of Float64x2 to be shuffled.
    * @param {Float64x2} t2 An instance of Float64x2 to be shuffled.
    * @param {integer} x - Index in concatenation of t1 and t2 for lane x
    * @param {integer} y - Index in concatenation of t1 and t2 for lane y
    * @return {Float64x2} New instance of Float64x2 with lanes shuffled.
    */
  SIMD.Float64x2.shuffle = function(t1, t2, x, y) {
    t1 = SIMD.Float64x2.check(t1);
    t2 = SIMD.Float64x2.check(t2);
    check4(x);
    check4(y);
    var storage = _f64x4;
    storage[0] = SIMD.Float64x2.extractLane(t1, 0);
    storage[1] = SIMD.Float64x2.extractLane(t1, 1);
    storage[2] = SIMD.Float64x2.extractLane(t2, 0);
    storage[3] = SIMD.Float64x2.extractLane(t2, 1);
    return SIMD.Float64x2(storage[x], storage[y]);
  }
}

if (typeof SIMD.Float64x2.lessThan === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of t < other.
    */
  SIMD.Float64x2.lessThan = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx =
        SIMD.Float64x2.extractLane(t, 0) < SIMD.Float64x2.extractLane(other, 0);
    var cy =
        SIMD.Float64x2.extractLane(t, 1) < SIMD.Float64x2.extractLane(other, 1);
    return SIMD.Bool64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.lessThanOrEqual === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of t <= other.
    */
  SIMD.Float64x2.lessThanOrEqual = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = SIMD.Float64x2.extractLane(t, 0) <=
        SIMD.Float64x2.extractLane(other, 0);
    var cy = SIMD.Float64x2.extractLane(t, 1) <=
        SIMD.Float64x2.extractLane(other, 1);
    return SIMD.Bool64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.equal === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of t == other.
    */
  SIMD.Float64x2.equal = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = SIMD.Float64x2.extractLane(t, 0) ==
        SIMD.Float64x2.extractLane(other, 0);
    var cy = SIMD.Float64x2.extractLane(t, 1) ==
        SIMD.Float64x2.extractLane(other, 1);
    return SIMD.Bool64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.notEqual === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of t != other.
    */
  SIMD.Float64x2.notEqual = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = SIMD.Float64x2.extractLane(t, 0) !=
        SIMD.Float64x2.extractLane(other, 0);
    var cy = SIMD.Float64x2.extractLane(t, 1) !=
        SIMD.Float64x2.extractLane(other, 1);
    return SIMD.Bool64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.greaterThanOrEqual === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of t >= other.
    */
  SIMD.Float64x2.greaterThanOrEqual = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx = SIMD.Float64x2.extractLane(t, 0) >=
        SIMD.Float64x2.extractLane(other, 0);
    var cy = SIMD.Float64x2.extractLane(t, 1) >=
        SIMD.Float64x2.extractLane(other, 1);
    return SIMD.Bool64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.greaterThan === "undefined") {
  /**
    * @param {Float64x2} t An instance of Float64x2.
    * @param {Float64x2} other An instance of Float64x2.
    * @return {bool64x2} true or false in each lane depending on
    * the result of t > other.
    */
  SIMD.Float64x2.greaterThan = function(t, other) {
    t = SIMD.Float64x2.check(t);
    other = SIMD.Float64x2.check(other);
    var cx =
        SIMD.Float64x2.extractLane(t, 0) > SIMD.Float64x2.extractLane(other, 0);
    var cy =
        SIMD.Float64x2.extractLane(t, 1) > SIMD.Float64x2.extractLane(other, 1);
    return SIMD.Bool64x2(cx, cy);
  }
}

if (typeof SIMD.Float64x2.select === "undefined") {
  /**
    * @param {bool64x2} t Selector mask. An instance of bool64x2
    * @param {Float64x2} trueValue Pick lane from here if corresponding
    * selector lane is true
    * @param {Float64x2} falseValue Pick lane from here if corresponding
    * selector lane is false
    * @return {Float64x2} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Float64x2.select = function(t, trueValue, falseValue) {
    t = SIMD.Bool64x2.check(t);
    trueValue = SIMD.Float64x2.check(trueValue);
    falseValue = SIMD.Float64x2.check(falseValue);
    return SIMD.Float64x2(
        SIMD.Bool64x2.extractLane(t, 0) ?
            SIMD.Float64x2.extractLane(trueValue, 0) :
                SIMD.Float64x2.extractLane(falseValue, 0),
        SIMD.Bool64x2.extractLane(t, 1) ?
            SIMD.Float64x2.extractLane(trueValue, 1) :
                SIMD.Float64x2.extractLane(falseValue, 1));
  }
}

if (typeof SIMD.Float64x2.load === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Float64x2} New instance of Float64x2.
    */
  SIMD.Float64x2.load = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var f64temp = _f64x2;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                f64temp;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Float64x2(f64temp[0], f64temp[1]);
  }
}

if (typeof SIMD.Float64x2.load1 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Float64x2} New instance of Float64x2.
    */
  SIMD.Float64x2.load1 = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 8) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var f64temp = _f64x2;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                f64temp;
    var n = 8 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Float64x2(f64temp[0], 0.0);
  }
}

if (typeof SIMD.Float64x2.store === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Float64x2} value An instance of Float64x2.
    * @return {Float64x2} value
    */
  SIMD.Float64x2.store = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Float64x2.check(value);
    _f64x2[0] = SIMD.Float64x2.extractLane(value, 0);
    _f64x2[1] = SIMD.Float64x2.extractLane(value, 1);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

if (typeof SIMD.Float64x2.store1 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Float64x2} value An instance of Float64x2.
    * @return {Float64x2} value
    */
  SIMD.Float64x2.store1 = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 8) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Float64x2.check(value);
    _f64x2[0] = SIMD.Float64x2.extractLane(value, 0);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 8 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

if (typeof SIMD.Int32x4.and === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {Int32x4} b An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of a & b.
    */
  SIMD.Int32x4.and = function(a, b) {
    a = SIMD.Int32x4.check(a);
    b = SIMD.Int32x4.check(b);
    return SIMD.Int32x4(
        SIMD.Int32x4.extractLane(a, 0) & SIMD.Int32x4.extractLane(b, 0),
        SIMD.Int32x4.extractLane(a, 1) & SIMD.Int32x4.extractLane(b, 1),
        SIMD.Int32x4.extractLane(a, 2) & SIMD.Int32x4.extractLane(b, 2),
        SIMD.Int32x4.extractLane(a, 3) & SIMD.Int32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Int32x4.or === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {Int32x4} b An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of a | b.
    */
  SIMD.Int32x4.or = function(a, b) {
    a = SIMD.Int32x4.check(a);
    b = SIMD.Int32x4.check(b);
    return SIMD.Int32x4(
        SIMD.Int32x4.extractLane(a, 0) | SIMD.Int32x4.extractLane(b, 0),
        SIMD.Int32x4.extractLane(a, 1) | SIMD.Int32x4.extractLane(b, 1),
        SIMD.Int32x4.extractLane(a, 2) | SIMD.Int32x4.extractLane(b, 2),
        SIMD.Int32x4.extractLane(a, 3) | SIMD.Int32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Int32x4.xor === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {Int32x4} b An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of a ^ b.
    */
  SIMD.Int32x4.xor = function(a, b) {
    a = SIMD.Int32x4.check(a);
    b = SIMD.Int32x4.check(b);
    return SIMD.Int32x4(
        SIMD.Int32x4.extractLane(a, 0) ^ SIMD.Int32x4.extractLane(b, 0),
        SIMD.Int32x4.extractLane(a, 1) ^ SIMD.Int32x4.extractLane(b, 1),
        SIMD.Int32x4.extractLane(a, 2) ^ SIMD.Int32x4.extractLane(b, 2),
        SIMD.Int32x4.extractLane(a, 3) ^ SIMD.Int32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Int32x4.not === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of ~t
    */
  SIMD.Int32x4.not = function(t) {
    t = SIMD.Int32x4.check(t);
    return SIMD.Int32x4(~SIMD.Int32x4.extractLane(t, 0),
                        ~SIMD.Int32x4.extractLane(t, 1),
                        ~SIMD.Int32x4.extractLane(t, 2),
                        ~SIMD.Int32x4.extractLane(t, 3));
  }
}

if (typeof SIMD.Int32x4.neg === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of -t
    */
  SIMD.Int32x4.neg = function(t) {
    t = SIMD.Int32x4.check(t);
    return SIMD.Int32x4(-SIMD.Int32x4.extractLane(t, 0),
                        -SIMD.Int32x4.extractLane(t, 1),
                        -SIMD.Int32x4.extractLane(t, 2),
                        -SIMD.Int32x4.extractLane(t, 3));
  }
}

if (typeof SIMD.Int32x4.add === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {Int32x4} b An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of a + b.
    */
  SIMD.Int32x4.add = function(a, b) {
    a = SIMD.Int32x4.check(a);
    b = SIMD.Int32x4.check(b);
    return SIMD.Int32x4(
        SIMD.Int32x4.extractLane(a, 0) + SIMD.Int32x4.extractLane(b, 0),
        SIMD.Int32x4.extractLane(a, 1) + SIMD.Int32x4.extractLane(b, 1),
        SIMD.Int32x4.extractLane(a, 2) + SIMD.Int32x4.extractLane(b, 2),
        SIMD.Int32x4.extractLane(a, 3) + SIMD.Int32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Int32x4.sub === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {Int32x4} b An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of a - b.
    */
  SIMD.Int32x4.sub = function(a, b) {
    a = SIMD.Int32x4.check(a);
    b = SIMD.Int32x4.check(b);
    return SIMD.Int32x4(
        SIMD.Int32x4.extractLane(a, 0) - SIMD.Int32x4.extractLane(b, 0),
        SIMD.Int32x4.extractLane(a, 1) - SIMD.Int32x4.extractLane(b, 1),
        SIMD.Int32x4.extractLane(a, 2) - SIMD.Int32x4.extractLane(b, 2),
        SIMD.Int32x4.extractLane(a, 3) - SIMD.Int32x4.extractLane(b, 3));
  }
}

if (typeof SIMD.Int32x4.mul === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {Int32x4} b An instance of Int32x4.
    * @return {Int32x4} New instance of Int32x4 with values of a * b.
    */
  SIMD.Int32x4.mul = function(a, b) {
    a = SIMD.Int32x4.check(a);
    b = SIMD.Int32x4.check(b);
    return SIMD.Int32x4(
        Math.imul(SIMD.Int32x4.extractLane(a, 0),
                  SIMD.Int32x4.extractLane(b, 0)),
        Math.imul(SIMD.Int32x4.extractLane(a, 1),
                  SIMD.Int32x4.extractLane(b, 1)),
        Math.imul(SIMD.Int32x4.extractLane(a, 2),
                  SIMD.Int32x4.extractLane(b, 2)),
        Math.imul(SIMD.Int32x4.extractLane(a, 3),
                  SIMD.Int32x4.extractLane(b, 3)));
  }
}

if (typeof SIMD.Int32x4.swizzle === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4 to be swizzled.
    * @param {integer} x - Index in t for lane x
    * @param {integer} y - Index in t for lane y
    * @param {integer} z - Index in t for lane z
    * @param {integer} w - Index in t for lane w
    * @return {Int32x4} New instance of Int32x4 with lanes swizzled.
    */
  SIMD.Int32x4.swizzle = function(t, x, y, z, w) {
    t = SIMD.Int32x4.check(t);
    check4(x);
    check4(y);
    check4(z);
    check4(w);
    var storage = _i32x4;
    storage[0] = SIMD.Int32x4.extractLane(t, 0);
    storage[1] = SIMD.Int32x4.extractLane(t, 1);
    storage[2] = SIMD.Int32x4.extractLane(t, 2);
    storage[3] = SIMD.Int32x4.extractLane(t, 3);
    return SIMD.Int32x4(storage[x], storage[y], storage[z], storage[w]);
  }
}

if (typeof SIMD.Int32x4.shuffle === "undefined") {

  _i32x8 = new Int32Array(8);

  /**
    * @param {Int32x4} t1 An instance of Int32x4 to be shuffled.
    * @param {Int32x4} t2 An instance of Int32x4 to be shuffled.
    * @param {integer} x - Index in concatenation of t1 and t2 for lane x
    * @param {integer} y - Index in concatenation of t1 and t2 for lane y
    * @param {integer} z - Index in concatenation of t1 and t2 for lane z
    * @param {integer} w - Index in concatenation of t1 and t2 for lane w
    * @return {Int32x4} New instance of Int32x4 with lanes shuffled.
    */
  SIMD.Int32x4.shuffle = function(t1, t2, x, y, z, w) {
    t1 = SIMD.Int32x4.check(t1);
    t2 = SIMD.Int32x4.check(t2);
    check8(x);
    check8(y);
    check8(z);
    check8(w);
    var storage = _i32x8;
    storage[0] = SIMD.Int32x4.extractLane(t1, 0);
    storage[1] = SIMD.Int32x4.extractLane(t1, 1);
    storage[2] = SIMD.Int32x4.extractLane(t1, 2);
    storage[3] = SIMD.Int32x4.extractLane(t1, 3);
    storage[4] = SIMD.Int32x4.extractLane(t2, 0);
    storage[5] = SIMD.Int32x4.extractLane(t2, 1);
    storage[6] = SIMD.Int32x4.extractLane(t2, 2);
    storage[7] = SIMD.Int32x4.extractLane(t2, 3);
    return SIMD.Int32x4(storage[x], storage[y], storage[z], storage[w]);
  }
}

if (typeof SIMD.Int32x4.select === "undefined") {
  /**
    * @param {Bool32x4} t Selector mask. An instance of Bool32x4
    * @param {Int32x4} trueValue Pick lane from here if corresponding
    * selector lane is true
    * @param {Int32x4} falseValue Pick lane from here if corresponding
    * selector lane is false
    * @return {Int32x4} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Int32x4.select = function(t, trueValue, falseValue) {
    t = SIMD.Bool32x4.check(t);
    trueValue = SIMD.Int32x4.check(trueValue);
    falseValue = SIMD.Int32x4.check(falseValue);
    return SIMD.Int32x4(
        SIMD.Bool32x4.extractLane(t, 0) ?
            SIMD.Int32x4.extractLane(trueValue, 0) :
                SIMD.Int32x4.extractLane(falseValue, 0),
        SIMD.Bool32x4.extractLane(t, 1) ?
            SIMD.Int32x4.extractLane(trueValue, 1) :
                SIMD.Int32x4.extractLane(falseValue, 1),
        SIMD.Bool32x4.extractLane(t, 2) ?
            SIMD.Int32x4.extractLane(trueValue, 2) :
                SIMD.Int32x4.extractLane(falseValue, 2),
        SIMD.Bool32x4.extractLane(t, 3) ?
            SIMD.Int32x4.extractLane(trueValue, 3) :
                SIMD.Int32x4.extractLane(falseValue, 3));
  }
}

if (typeof SIMD.Int32x4.selectBits === "undefined") {
  /**
    * @param {Int32x4} t Selector mask. An instance of Int32x4
    * @param {Int32x4} trueValue Pick bit from here if corresponding
    * selector bit is 1
    * @param {Int32x4} falseValue Pick bit from here if corresponding
    * selector bit is 0
    * @return {Int32x4} Mix of bits from trueValue or falseValue as
    * indicated
    */
  SIMD.Int32x4.selectBits = function(t, trueValue, falseValue) {
    t = SIMD.Int32x4.check(t);
    trueValue = SIMD.Int32x4.check(trueValue);
    falseValue = SIMD.Int32x4.check(falseValue);
    var tr = SIMD.Int32x4.and(t, trueValue);
    var fr = SIMD.Int32x4.and(SIMD.Int32x4.not(t), falseValue);
    return SIMD.Int32x4.or(tr, fr);
  }
}

if (typeof SIMD.Int32x4.equal === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {Int32x4} other An instance of Int32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t == other.
    */
  SIMD.Int32x4.equal = function(t, other) {
    t = SIMD.Int32x4.check(t);
    other = SIMD.Int32x4.check(other);
    var cx =
        SIMD.Int32x4.extractLane(t, 0) == SIMD.Int32x4.extractLane(other, 0);
    var cy =
        SIMD.Int32x4.extractLane(t, 1) == SIMD.Int32x4.extractLane(other, 1);
    var cz =
        SIMD.Int32x4.extractLane(t, 2) == SIMD.Int32x4.extractLane(other, 2);
    var cw =
        SIMD.Int32x4.extractLane(t, 3) == SIMD.Int32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Int32x4.notEqual === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {Int32x4} other An instance of Int32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t != other.
    */
  SIMD.Int32x4.notEqual = function(t, other) {
    t = SIMD.Int32x4.check(t);
    other = SIMD.Int32x4.check(other);
    var cx =
        SIMD.Int32x4.extractLane(t, 0) != SIMD.Int32x4.extractLane(other, 0);
    var cy =
        SIMD.Int32x4.extractLane(t, 1) != SIMD.Int32x4.extractLane(other, 1);
    var cz =
        SIMD.Int32x4.extractLane(t, 2) != SIMD.Int32x4.extractLane(other, 2);
    var cw =
        SIMD.Int32x4.extractLane(t, 3) != SIMD.Int32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Int32x4.greaterThan === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {Int32x4} other An instance of Int32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t > other.
    */
  SIMD.Int32x4.greaterThan = function(t, other) {
    t = SIMD.Int32x4.check(t);
    other = SIMD.Int32x4.check(other);
    var cx =
        SIMD.Int32x4.extractLane(t, 0) > SIMD.Int32x4.extractLane(other, 0);
    var cy =
        SIMD.Int32x4.extractLane(t, 1) > SIMD.Int32x4.extractLane(other, 1);
    var cz =
        SIMD.Int32x4.extractLane(t, 2) > SIMD.Int32x4.extractLane(other, 2);
    var cw =
        SIMD.Int32x4.extractLane(t, 3) > SIMD.Int32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Int32x4.greaterThanOrEqual === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {Int32x4} other An instance of Int32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t >= other.
    */
  SIMD.Int32x4.greaterThanOrEqual = function(t, other) {
    t = SIMD.Int32x4.check(t);
    other = SIMD.Int32x4.check(other);
    var cx =
        SIMD.Int32x4.extractLane(t, 0) >= SIMD.Int32x4.extractLane(other, 0);
    var cy =
        SIMD.Int32x4.extractLane(t, 1) >= SIMD.Int32x4.extractLane(other, 1);
    var cz =
        SIMD.Int32x4.extractLane(t, 2) >= SIMD.Int32x4.extractLane(other, 2);
    var cw =
        SIMD.Int32x4.extractLane(t, 3) >= SIMD.Int32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Int32x4.lessThan === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {Int32x4} other An instance of Int32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t < other.
    */
  SIMD.Int32x4.lessThan = function(t, other) {
    t = SIMD.Int32x4.check(t);
    other = SIMD.Int32x4.check(other);
    var cx =
        SIMD.Int32x4.extractLane(t, 0) < SIMD.Int32x4.extractLane(other, 0);
    var cy =
        SIMD.Int32x4.extractLane(t, 1) < SIMD.Int32x4.extractLane(other, 1);
    var cz =
        SIMD.Int32x4.extractLane(t, 2) < SIMD.Int32x4.extractLane(other, 2);
    var cw =
        SIMD.Int32x4.extractLane(t, 3) < SIMD.Int32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Int32x4.lessThanOrEqual === "undefined") {
  /**
    * @param {Int32x4} t An instance of Int32x4.
    * @param {Int32x4} other An instance of Int32x4.
    * @return {Bool32x4} true or false in each lane depending on
    * the result of t <= other.
    */
  SIMD.Int32x4.lessThanOrEqual = function(t, other) {
    t = SIMD.Int32x4.check(t);
    other = SIMD.Int32x4.check(other);
    var cx =
        SIMD.Int32x4.extractLane(t, 0) <= SIMD.Int32x4.extractLane(other, 0);
    var cy =
        SIMD.Int32x4.extractLane(t, 1) <= SIMD.Int32x4.extractLane(other, 1);
    var cz =
        SIMD.Int32x4.extractLane(t, 2) <= SIMD.Int32x4.extractLane(other, 2);
    var cw =
        SIMD.Int32x4.extractLane(t, 3) <= SIMD.Int32x4.extractLane(other, 3);
    return SIMD.Bool32x4(cx, cy, cz, cw);
  }
}

if (typeof SIMD.Int32x4.shiftLeftByScalar === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {integer} bits Bit count to shift by.
    * @return {Int32x4} lanes in a shifted by bits.
    */
  SIMD.Int32x4.shiftLeftByScalar = function(a, bits) {
    a = SIMD.Int32x4.check(a);
    if (bits>>>0 >= 32)
      return SIMD.Int32x4.splat(0.0);
    var x = SIMD.Int32x4.extractLane(a, 0) << bits;
    var y = SIMD.Int32x4.extractLane(a, 1) << bits;
    var z = SIMD.Int32x4.extractLane(a, 2) << bits;
    var w = SIMD.Int32x4.extractLane(a, 3) << bits;
    return SIMD.Int32x4(x, y, z, w);
  }
}

if (typeof SIMD.Int32x4.shiftRightLogicalByScalar === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {integer} bits Bit count to shift by.
    * @return {Int32x4} lanes in a shifted by bits.
    */
  SIMD.Int32x4.shiftRightLogicalByScalar = function(a, bits) {
    a = SIMD.Int32x4.check(a);
    if (bits>>>0 >= 32)
      return SIMD.Int32x4.splat(0.0);
    var x = SIMD.Int32x4.extractLane(a, 0) >>> bits;
    var y = SIMD.Int32x4.extractLane(a, 1) >>> bits;
    var z = SIMD.Int32x4.extractLane(a, 2) >>> bits;
    var w = SIMD.Int32x4.extractLane(a, 3) >>> bits;
    return SIMD.Int32x4(x, y, z, w);
  }
}

if (typeof SIMD.Int32x4.shiftRightArithmeticByScalar === "undefined") {
  /**
    * @param {Int32x4} a An instance of Int32x4.
    * @param {integer} bits Bit count to shift by.
    * @return {Int32x4} lanes in a shifted by bits.
    */
  SIMD.Int32x4.shiftRightArithmeticByScalar = function(a, bits) {
    a = SIMD.Int32x4.check(a);
    if (bits>>>0 >= 32)
      bits = 31;
    var x = SIMD.Int32x4.extractLane(a, 0) >> bits;
    var y = SIMD.Int32x4.extractLane(a, 1) >> bits;
    var z = SIMD.Int32x4.extractLane(a, 2) >> bits;
    var w = SIMD.Int32x4.extractLane(a, 3) >> bits;
    return SIMD.Int32x4(x, y, z, w);
  }
}

if (typeof SIMD.Int32x4.load === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Int32x4} New instance of Int32x4.
    */
  SIMD.Int32x4.load = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var i32temp = _i32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : i32temp) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Int32x4(i32temp[0], i32temp[1], i32temp[2], i32temp[3]);
  }
}

if (typeof SIMD.Int32x4.load1 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Int32x4} New instance of Int32x4.
    */
  SIMD.Int32x4.load1 = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 4) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var i32temp = _i32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : i32temp) :
                _f64x2;
    var n = 4 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Int32x4(i32temp[0], 0, 0, 0);
  }
}

if (typeof SIMD.Int32x4.load2 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Int32x4} New instance of Int32x4.
    */
  SIMD.Int32x4.load2 = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 8) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var i32temp = _i32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : i32temp) :
                _f64x2;
    var n = 8 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Int32x4(i32temp[0], i32temp[1], 0, 0);
  }
}

if (typeof SIMD.Int32x4.load3 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Int32x4} New instance of Int32x4.
    */
  SIMD.Int32x4.load3 = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 12) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var i32temp = _i32x4;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : i32temp) :
                _f64x2;
    var n = 12 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Int32x4(i32temp[0], i32temp[1], i32temp[2], 0);
  }
}

if (typeof SIMD.Int32x4.store === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Int32x4} value An instance of Int32x4.
    * @return {Int32x4} value
    */
  SIMD.Int32x4.store = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Int32x4.check(value);
    _i32x4[0] = SIMD.Int32x4.extractLane(value, 0);
    _i32x4[1] = SIMD.Int32x4.extractLane(value, 1);
    _i32x4[2] = SIMD.Int32x4.extractLane(value, 2);
    _i32x4[3] = SIMD.Int32x4.extractLane(value, 3);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

if (typeof SIMD.Int32x4.store1 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Int32x4} value An instance of Int32x4.
    * @return {Int32x4} value
    */
  SIMD.Int32x4.store1 = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 4) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Int32x4.check(value);
    if (bpe == 8) {
      // tarray's elements are too wide. Just create a new view; this is rare.
      var view = new Int32Array(tarray.buffer,
                                tarray.byteOffset + index * 8, 1);
      view[0] = SIMD.Int32x4.extractLane(value, 0);
    } else {
      _i32x4[0] = SIMD.Int32x4.extractLane(value, 0);
      var array = bpe == 1 ? _i8x16 :
                  bpe == 2 ? _i16x8 :
                  (tarray instanceof Float32Array ? _f32x4 : _i32x4);
      var n = 4 / bpe;
      for (var i = 0; i < n; ++i)
        tarray[index + i] = array[i];
      return value;
    }
  }
}

if (typeof SIMD.Int32x4.store2 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Int32x4} value An instance of Int32x4.
    * @return {Int32x4} value
    */
  SIMD.Int32x4.store2 = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 8) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Int32x4.check(value);
    _i32x4[0] = SIMD.Int32x4.extractLane(value, 0);
    _i32x4[1] = SIMD.Int32x4.extractLane(value, 1);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 8 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

if (typeof SIMD.Int32x4.store3 === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Int32x4} value An instance of Int32x4.
    * @return {Int32x4} value
    */
  SIMD.Int32x4.store3 = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 12) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Int32x4.check(value);
    if (bpe == 8) {
      // tarray's elements are too wide. Just create a new view; this is rare.
      var view = new Int32Array(tarray.buffer,
                                tarray.byteOffset + index * 8, 3);
      view[0] = SIMD.Int32x4.extractLane(value, 0);
      view[1] = SIMD.Int32x4.extractLane(value, 1);
      view[2] = SIMD.Int32x4.extractLane(value, 2);
    } else {
      _i32x4[0] = SIMD.Int32x4.extractLane(value, 0);
      _i32x4[1] = SIMD.Int32x4.extractLane(value, 1);
      _i32x4[2] = SIMD.Int32x4.extractLane(value, 2);
      var array = bpe == 1 ? _i8x16 :
                  bpe == 2 ? _i16x8 :
                  (tarray instanceof Float32Array ? _f32x4 : _i32x4);
      var n = 12 / bpe;
      for (var i = 0; i < n; ++i)
        tarray[index + i] = array[i];
      return value;
    }
  }
}

if (typeof SIMD.Int16x8.and === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a & b.
    */
  SIMD.Int16x8.and = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    return SIMD.Int16x8(
        SIMD.Int16x8.extractLane(a, 0) & SIMD.Int16x8.extractLane(b, 0),
        SIMD.Int16x8.extractLane(a, 1) & SIMD.Int16x8.extractLane(b, 1),
        SIMD.Int16x8.extractLane(a, 2) & SIMD.Int16x8.extractLane(b, 2),
        SIMD.Int16x8.extractLane(a, 3) & SIMD.Int16x8.extractLane(b, 3),
        SIMD.Int16x8.extractLane(a, 4) & SIMD.Int16x8.extractLane(b, 4),
        SIMD.Int16x8.extractLane(a, 5) & SIMD.Int16x8.extractLane(b, 5),
        SIMD.Int16x8.extractLane(a, 6) & SIMD.Int16x8.extractLane(b, 6),
        SIMD.Int16x8.extractLane(a, 7) & SIMD.Int16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Int16x8.or === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a | b.
    */
  SIMD.Int16x8.or = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    return SIMD.Int16x8(
        SIMD.Int16x8.extractLane(a, 0) | SIMD.Int16x8.extractLane(b, 0),
        SIMD.Int16x8.extractLane(a, 1) | SIMD.Int16x8.extractLane(b, 1),
        SIMD.Int16x8.extractLane(a, 2) | SIMD.Int16x8.extractLane(b, 2),
        SIMD.Int16x8.extractLane(a, 3) | SIMD.Int16x8.extractLane(b, 3),
        SIMD.Int16x8.extractLane(a, 4) | SIMD.Int16x8.extractLane(b, 4),
        SIMD.Int16x8.extractLane(a, 5) | SIMD.Int16x8.extractLane(b, 5),
        SIMD.Int16x8.extractLane(a, 6) | SIMD.Int16x8.extractLane(b, 6),
        SIMD.Int16x8.extractLane(a, 7) | SIMD.Int16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Int16x8.xor === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a ^ b.
    */
  SIMD.Int16x8.xor = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    return SIMD.Int16x8(
        SIMD.Int16x8.extractLane(a, 0) ^ SIMD.Int16x8.extractLane(b, 0),
        SIMD.Int16x8.extractLane(a, 1) ^ SIMD.Int16x8.extractLane(b, 1),
        SIMD.Int16x8.extractLane(a, 2) ^ SIMD.Int16x8.extractLane(b, 2),
        SIMD.Int16x8.extractLane(a, 3) ^ SIMD.Int16x8.extractLane(b, 3),
        SIMD.Int16x8.extractLane(a, 4) ^ SIMD.Int16x8.extractLane(b, 4),
        SIMD.Int16x8.extractLane(a, 5) ^ SIMD.Int16x8.extractLane(b, 5),
        SIMD.Int16x8.extractLane(a, 6) ^ SIMD.Int16x8.extractLane(b, 6),
        SIMD.Int16x8.extractLane(a, 7) ^ SIMD.Int16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Int16x8.not === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of ~t
    */
  SIMD.Int16x8.not = function(t) {
    t = SIMD.Int16x8.check(t);
    return SIMD.Int16x8(~SIMD.Int16x8.extractLane(t, 0),
                        ~SIMD.Int16x8.extractLane(t, 1),
                        ~SIMD.Int16x8.extractLane(t, 2),
                        ~SIMD.Int16x8.extractLane(t, 3),
                        ~SIMD.Int16x8.extractLane(t, 4),
                        ~SIMD.Int16x8.extractLane(t, 5),
                        ~SIMD.Int16x8.extractLane(t, 6),
                        ~SIMD.Int16x8.extractLane(t, 7));
  }
}

if (typeof SIMD.Int16x8.neg === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of -t
    */
  SIMD.Int16x8.neg = function(t) {
    t = SIMD.Int16x8.check(t);
    return SIMD.Int16x8(-SIMD.Int16x8.extractLane(t, 0),
                        -SIMD.Int16x8.extractLane(t, 1),
                        -SIMD.Int16x8.extractLane(t, 2),
                        -SIMD.Int16x8.extractLane(t, 3),
                        -SIMD.Int16x8.extractLane(t, 4),
                        -SIMD.Int16x8.extractLane(t, 5),
                        -SIMD.Int16x8.extractLane(t, 6),
                        -SIMD.Int16x8.extractLane(t, 7));
  }
}

if (typeof SIMD.Int16x8.add === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a + b.
    */
  SIMD.Int16x8.add = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    return SIMD.Int16x8(
        SIMD.Int16x8.extractLane(a, 0) + SIMD.Int16x8.extractLane(b, 0),
        SIMD.Int16x8.extractLane(a, 1) + SIMD.Int16x8.extractLane(b, 1),
        SIMD.Int16x8.extractLane(a, 2) + SIMD.Int16x8.extractLane(b, 2),
        SIMD.Int16x8.extractLane(a, 3) + SIMD.Int16x8.extractLane(b, 3),
        SIMD.Int16x8.extractLane(a, 4) + SIMD.Int16x8.extractLane(b, 4),
        SIMD.Int16x8.extractLane(a, 5) + SIMD.Int16x8.extractLane(b, 5),
        SIMD.Int16x8.extractLane(a, 6) + SIMD.Int16x8.extractLane(b, 6),
        SIMD.Int16x8.extractLane(a, 7) + SIMD.Int16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Int16x8.sub === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a - b.
    */
  SIMD.Int16x8.sub = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    return SIMD.Int16x8(
        SIMD.Int16x8.extractLane(a, 0) - SIMD.Int16x8.extractLane(b, 0),
        SIMD.Int16x8.extractLane(a, 1) - SIMD.Int16x8.extractLane(b, 1),
        SIMD.Int16x8.extractLane(a, 2) - SIMD.Int16x8.extractLane(b, 2),
        SIMD.Int16x8.extractLane(a, 3) - SIMD.Int16x8.extractLane(b, 3),
        SIMD.Int16x8.extractLane(a, 4) - SIMD.Int16x8.extractLane(b, 4),
        SIMD.Int16x8.extractLane(a, 5) - SIMD.Int16x8.extractLane(b, 5),
        SIMD.Int16x8.extractLane(a, 6) - SIMD.Int16x8.extractLane(b, 6),
        SIMD.Int16x8.extractLane(a, 7) - SIMD.Int16x8.extractLane(b, 7));
  }
}

if (typeof SIMD.Int16x8.mul === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a * b.
    */
  SIMD.Int16x8.mul = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    return SIMD.Int16x8(Math.imul(SIMD.Int16x8.extractLane(a, 0),
                                  SIMD.Int16x8.extractLane(b, 0)),
                        Math.imul(SIMD.Int16x8.extractLane(a, 1),
                                  SIMD.Int16x8.extractLane(b, 1)),
                        Math.imul(SIMD.Int16x8.extractLane(a, 2),
                                  SIMD.Int16x8.extractLane(b, 2)),
                        Math.imul(SIMD.Int16x8.extractLane(a, 3),
                                  SIMD.Int16x8.extractLane(b, 3)),
                        Math.imul(SIMD.Int16x8.extractLane(a, 4),
                                  SIMD.Int16x8.extractLane(b, 4)),
                        Math.imul(SIMD.Int16x8.extractLane(a, 5),
                                  SIMD.Int16x8.extractLane(b, 5)),
                        Math.imul(SIMD.Int16x8.extractLane(a, 6),
                                  SIMD.Int16x8.extractLane(b, 6)),
                        Math.imul(SIMD.Int16x8.extractLane(a, 7),
                                  SIMD.Int16x8.extractLane(b, 7)));
  }
}

if (typeof SIMD.Int16x8.swizzle === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8 to be swizzled.
    * @param {integer} s0 - Index in t for lane s0
    * @param {integer} s1 - Index in t for lane s1
    * @param {integer} s2 - Index in t for lane s2
    * @param {integer} s3 - Index in t for lane s3
    * @param {integer} s4 - Index in t for lane s4
    * @param {integer} s5 - Index in t for lane s5
    * @param {integer} s6 - Index in t for lane s6
    * @param {integer} s7 - Index in t for lane s7
    * @return {Int16x8} New instance of Int16x8 with lanes swizzled.
    */
  SIMD.Int16x8.swizzle = function(t, s0, s1, s2, s3, s4, s5, s6, s7) {
    t = SIMD.Int16x8.check(t);
    check8(s0);
    check8(s1);
    check8(s2);
    check8(s3);
    check8(s4);
    check8(s5);
    check8(s6);
    check8(s7);
    var storage = _i16x8;
    storage[0] = SIMD.Int16x8.extractLane(t, 0);
    storage[1] = SIMD.Int16x8.extractLane(t, 1);
    storage[2] = SIMD.Int16x8.extractLane(t, 2);
    storage[3] = SIMD.Int16x8.extractLane(t, 3);
    storage[4] = SIMD.Int16x8.extractLane(t, 4);
    storage[5] = SIMD.Int16x8.extractLane(t, 5);
    storage[6] = SIMD.Int16x8.extractLane(t, 6);
    storage[7] = SIMD.Int16x8.extractLane(t, 7);
    return SIMD.Int16x8(storage[s0], storage[s1], storage[s2], storage[s3],
                        storage[s4], storage[s5], storage[s6], storage[s7]);
  }
}

if (typeof SIMD.Int16x8.shuffle === "undefined") {

  _i16x16 = new Int16Array(16);

  /**
    * @param {Int16x8} t0 An instance of Int16x8 to be shuffled.
    * @param {Int16x8} t1 An instance of Int16x8 to be shuffled.
    * @param {integer} s0 - Index in concatenation of t0 and t1 for lane s0
    * @param {integer} s1 - Index in concatenation of t0 and t1 for lane s1
    * @param {integer} s2 - Index in concatenation of t0 and t1 for lane s2
    * @param {integer} s3 - Index in concatenation of t0 and t1 for lane s3
    * @param {integer} s4 - Index in concatenation of t0 and t1 for lane s4
    * @param {integer} s5 - Index in concatenation of t0 and t1 for lane s5
    * @param {integer} s6 - Index in concatenation of t0 and t1 for lane s6
    * @param {integer} s7 - Index in concatenation of t0 and t1 for lane s7
    * @return {Int16x8} New instance of Int16x8 with lanes shuffled.
    */
  SIMD.Int16x8.shuffle = function(t0, t1, s0, s1, s2, s3, s4, s5, s6, s7) {
    t0 = SIMD.Int16x8.check(t0);
    t1 = SIMD.Int16x8.check(t1);
    check16(s0);
    check16(s1);
    check16(s2);
    check16(s3);
    check16(s4);
    check16(s5);
    check16(s6);
    check16(s7);
    var storage = _i16x16;
    storage[0] = SIMD.Int16x8.extractLane(t0, 0);
    storage[1] = SIMD.Int16x8.extractLane(t0, 1);
    storage[2] = SIMD.Int16x8.extractLane(t0, 2);
    storage[3] = SIMD.Int16x8.extractLane(t0, 3);
    storage[4] = SIMD.Int16x8.extractLane(t0, 4);
    storage[5] = SIMD.Int16x8.extractLane(t0, 5);
    storage[6] = SIMD.Int16x8.extractLane(t0, 6);
    storage[7] = SIMD.Int16x8.extractLane(t0, 7);
    storage[8] = SIMD.Int16x8.extractLane(t1, 0);
    storage[9] = SIMD.Int16x8.extractLane(t1, 1);
    storage[10] = SIMD.Int16x8.extractLane(t1, 2);
    storage[11] = SIMD.Int16x8.extractLane(t1, 3);
    storage[12] = SIMD.Int16x8.extractLane(t1, 4);
    storage[13] = SIMD.Int16x8.extractLane(t1, 5);
    storage[14] = SIMD.Int16x8.extractLane(t1, 6);
    storage[15] = SIMD.Int16x8.extractLane(t1, 7);
    return SIMD.Int16x8(storage[s0], storage[s1], storage[s2], storage[s3],
                        storage[s4], storage[s5], storage[s6], storage[s7]);
  }
}

if (typeof SIMD.Int16x8.addSaturate === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a + b with
    * signed saturating behavior on overflow.
    */
  SIMD.Int16x8.addSaturate = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    var c = SIMD.Int16x8.add(a, b);
    var max = SIMD.Int16x8.splat(0x7fff);
    var min = SIMD.Int16x8.splat(0x8000);
    var mask = SIMD.Int16x8.lessThan(c, a);
    var bneg = SIMD.Int16x8.lessThan(b, SIMD.Int16x8.splat(0));
    return SIMD.Int16x8.select(SIMD.Bool16x8.and(mask, SIMD.Bool16x8.not(bneg)), max,
             SIMD.Int16x8.select(SIMD.Bool16x8.and(SIMD.Bool16x8.not(mask), bneg), min,
               c));
  }
}

if (typeof SIMD.Int16x8.subSaturate === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {Int16x8} b An instance of Int16x8.
    * @return {Int16x8} New instance of Int16x8 with values of a - b with
    * signed saturating behavior on overflow.
    */
  SIMD.Int16x8.subSaturate = function(a, b) {
    a = SIMD.Int16x8.check(a);
    b = SIMD.Int16x8.check(b);
    var c = SIMD.Int16x8.sub(a, b);
    var max = SIMD.Int16x8.splat(0x7fff);
    var min = SIMD.Int16x8.splat(0x8000);
    var mask = SIMD.Int16x8.greaterThan(c, a);
    var bneg = SIMD.Int16x8.lessThan(b, SIMD.Int16x8.splat(0));
    return SIMD.Int16x8.select(SIMD.Bool16x8.and(mask, SIMD.Bool16x8.not(bneg)), min,
             SIMD.Int16x8.select(SIMD.Bool16x8.and(SIMD.Bool16x8.not(mask), bneg), max,
               c));
  }
}

if (typeof SIMD.Int16x8.select === "undefined") {
  /**
    * @param {Bool16x8} t Selector mask. An instance of Bool16x8
    * @param {Int16x8} trueValue Pick lane from here if corresponding
    * selector lane is true
    * @param {Int16x8} falseValue Pick lane from here if corresponding
    * selector lane is false
    * @return {Int16x8} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Int16x8.select = function(t, trueValue, falseValue) {
    t = SIMD.Bool16x8.check(t);
    trueValue = SIMD.Int16x8.check(trueValue);
    falseValue = SIMD.Int16x8.check(falseValue);
    return SIMD.Int16x8(
        SIMD.Bool16x8.extractLane(t, 0) ?
            SIMD.Int16x8.extractLane(trueValue, 0) :
                SIMD.Int16x8.extractLane(falseValue, 0),
        SIMD.Bool16x8.extractLane(t, 1) ?
            SIMD.Int16x8.extractLane(trueValue, 1) :
                SIMD.Int16x8.extractLane(falseValue, 1),
        SIMD.Bool16x8.extractLane(t, 2) ?
            SIMD.Int16x8.extractLane(trueValue, 2) :
                SIMD.Int16x8.extractLane(falseValue, 2),
        SIMD.Bool16x8.extractLane(t, 3) ?
            SIMD.Int16x8.extractLane(trueValue, 3) :
                SIMD.Int16x8.extractLane(falseValue, 3),
        SIMD.Bool16x8.extractLane(t, 4) ?
            SIMD.Int16x8.extractLane(trueValue, 4) :
                SIMD.Int16x8.extractLane(falseValue, 4),
        SIMD.Bool16x8.extractLane(t, 5) ?
            SIMD.Int16x8.extractLane(trueValue, 5) :
                SIMD.Int16x8.extractLane(falseValue, 5),
        SIMD.Bool16x8.extractLane(t, 6) ?
            SIMD.Int16x8.extractLane(trueValue, 6) :
                SIMD.Int16x8.extractLane(falseValue, 6),
        SIMD.Bool16x8.extractLane(t, 7) ?
            SIMD.Int16x8.extractLane(trueValue, 7) :
                SIMD.Int16x8.extractLane(falseValue, 7));
  }
}

if (typeof SIMD.Int16x8.selectBits === "undefined") {
  /**
    * @param {Int16x8} t Selector mask. An instance of Int16x8
    * @param {Int16x8} trueValue Pick bit from here if corresponding
    * selector bit is 1
    * @param {Int16x8} falseValue Pick bit from here if corresponding
    * selector bit is 0
    * @return {Int16x8} Mix of bits from trueValue or falseValue as
    * indicated
    */
  SIMD.Int16x8.selectBits = function(t, trueValue, falseValue) {
    t = SIMD.Int16x8.check(t);
    trueValue = SIMD.Int16x8.check(trueValue);
    falseValue = SIMD.Int16x8.check(falseValue);
    var tr = SIMD.Int16x8.and(t, trueValue);
    var fr = SIMD.Int16x8.and(SIMD.Int16x8.not(t), falseValue);
    return SIMD.Int16x8.or(tr, fr);
  }
}

if (typeof SIMD.Int16x8.equal === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {Int16x8} other An instance of Int16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of t == other.
    */
  SIMD.Int16x8.equal = function(t, other) {
    t = SIMD.Int16x8.check(t);
    other = SIMD.Int16x8.check(other);
    var cs0 =
        SIMD.Int16x8.extractLane(t, 0) == SIMD.Int16x8.extractLane(other, 0);
    var cs1 =
        SIMD.Int16x8.extractLane(t, 1) == SIMD.Int16x8.extractLane(other, 1);
    var cs2 =
        SIMD.Int16x8.extractLane(t, 2) == SIMD.Int16x8.extractLane(other, 2);
    var cs3 =
        SIMD.Int16x8.extractLane(t, 3) == SIMD.Int16x8.extractLane(other, 3);
    var cs4 =
        SIMD.Int16x8.extractLane(t, 4) == SIMD.Int16x8.extractLane(other, 4);
    var cs5 =
        SIMD.Int16x8.extractLane(t, 5) == SIMD.Int16x8.extractLane(other, 5);
    var cs6 =
        SIMD.Int16x8.extractLane(t, 6) == SIMD.Int16x8.extractLane(other, 6);
    var cs7 =
        SIMD.Int16x8.extractLane(t, 7) == SIMD.Int16x8.extractLane(other, 7);
    return SIMD.Bool16x8(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
  }
}

if (typeof SIMD.Int16x8.notEqual === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {Int16x8} other An instance of Int16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of t != other.
    */
  SIMD.Int16x8.notEqual = function(t, other) {
    t = SIMD.Int16x8.check(t);
    other = SIMD.Int16x8.check(other);
    var cs0 =
        SIMD.Int16x8.extractLane(t, 0) != SIMD.Int16x8.extractLane(other, 0);
    var cs1 =
        SIMD.Int16x8.extractLane(t, 1) != SIMD.Int16x8.extractLane(other, 1);
    var cs2 =
        SIMD.Int16x8.extractLane(t, 2) != SIMD.Int16x8.extractLane(other, 2);
    var cs3 =
        SIMD.Int16x8.extractLane(t, 3) != SIMD.Int16x8.extractLane(other, 3);
    var cs4 =
        SIMD.Int16x8.extractLane(t, 4) != SIMD.Int16x8.extractLane(other, 4);
    var cs5 =
        SIMD.Int16x8.extractLane(t, 5) != SIMD.Int16x8.extractLane(other, 5);
    var cs6 =
        SIMD.Int16x8.extractLane(t, 6) != SIMD.Int16x8.extractLane(other, 6);
    var cs7 =
        SIMD.Int16x8.extractLane(t, 7) != SIMD.Int16x8.extractLane(other, 7);
    return SIMD.Bool16x8(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
  }
}

if (typeof SIMD.Int16x8.greaterThan === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {Int16x8} other An instance of Int16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of t > other.
    */
  SIMD.Int16x8.greaterThan = function(t, other) {
    t = SIMD.Int16x8.check(t);
    other = SIMD.Int16x8.check(other);
    var cs0 =
        SIMD.Int16x8.extractLane(t, 0) > SIMD.Int16x8.extractLane(other, 0);
    var cs1 =
        SIMD.Int16x8.extractLane(t, 1) > SIMD.Int16x8.extractLane(other, 1);
    var cs2 =
        SIMD.Int16x8.extractLane(t, 2) > SIMD.Int16x8.extractLane(other, 2);
    var cs3 =
        SIMD.Int16x8.extractLane(t, 3) > SIMD.Int16x8.extractLane(other, 3);
    var cs4 =
        SIMD.Int16x8.extractLane(t, 4) > SIMD.Int16x8.extractLane(other, 4);
    var cs5 =
        SIMD.Int16x8.extractLane(t, 5) > SIMD.Int16x8.extractLane(other, 5);
    var cs6 =
        SIMD.Int16x8.extractLane(t, 6) > SIMD.Int16x8.extractLane(other, 6);
    var cs7 =
        SIMD.Int16x8.extractLane(t, 7) > SIMD.Int16x8.extractLane(other, 7);
    return SIMD.Bool16x8(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
  }
}

if (typeof SIMD.Int16x8.greaterThanOrEqual === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {Int16x8} other An instance of Int16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of t >= other.
    */
  SIMD.Int16x8.greaterThanOrEqual = function(t, other) {
    t = SIMD.Int16x8.check(t);
    other = SIMD.Int16x8.check(other);
    var cs0 =
        SIMD.Int16x8.extractLane(t, 0) >= SIMD.Int16x8.extractLane(other, 0);
    var cs1 =
        SIMD.Int16x8.extractLane(t, 1) >= SIMD.Int16x8.extractLane(other, 1);
    var cs2 =
        SIMD.Int16x8.extractLane(t, 2) >= SIMD.Int16x8.extractLane(other, 2);
    var cs3 =
        SIMD.Int16x8.extractLane(t, 3) >= SIMD.Int16x8.extractLane(other, 3);
    var cs4 =
        SIMD.Int16x8.extractLane(t, 4) >= SIMD.Int16x8.extractLane(other, 4);
    var cs5 =
        SIMD.Int16x8.extractLane(t, 5) >= SIMD.Int16x8.extractLane(other, 5);
    var cs6 =
        SIMD.Int16x8.extractLane(t, 6) >= SIMD.Int16x8.extractLane(other, 6);
    var cs7 =
        SIMD.Int16x8.extractLane(t, 7) >= SIMD.Int16x8.extractLane(other, 7);
    return SIMD.Bool16x8(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
  }
}

if (typeof SIMD.Int16x8.lessThan === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {Int16x8} other An instance of Int16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of t < other.
    */
  SIMD.Int16x8.lessThan = function(t, other) {
    t = SIMD.Int16x8.check(t);
    other = SIMD.Int16x8.check(other);
    var cs0 =
        SIMD.Int16x8.extractLane(t, 0) < SIMD.Int16x8.extractLane(other, 0);
    var cs1 =
        SIMD.Int16x8.extractLane(t, 1) < SIMD.Int16x8.extractLane(other, 1);
    var cs2 =
        SIMD.Int16x8.extractLane(t, 2) < SIMD.Int16x8.extractLane(other, 2);
    var cs3 =
        SIMD.Int16x8.extractLane(t, 3) < SIMD.Int16x8.extractLane(other, 3);
    var cs4 =
        SIMD.Int16x8.extractLane(t, 4) < SIMD.Int16x8.extractLane(other, 4);
    var cs5 =
        SIMD.Int16x8.extractLane(t, 5) < SIMD.Int16x8.extractLane(other, 5);
    var cs6 =
        SIMD.Int16x8.extractLane(t, 6) < SIMD.Int16x8.extractLane(other, 6);
    var cs7 =
        SIMD.Int16x8.extractLane(t, 7) < SIMD.Int16x8.extractLane(other, 7);
    return SIMD.Bool16x8(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
  }
}

if (typeof SIMD.Int16x8.lessThanOrEqual === "undefined") {
  /**
    * @param {Int16x8} t An instance of Int16x8.
    * @param {Int16x8} other An instance of Int16x8.
    * @return {Bool16x8} true or false in each lane depending on
    * the result of t <= other.
    */
  SIMD.Int16x8.lessThanOrEqual = function(t, other) {
    t = SIMD.Int16x8.check(t);
    other = SIMD.Int16x8.check(other);
    var cs0 =
        SIMD.Int16x8.extractLane(t, 0) <= SIMD.Int16x8.extractLane(other, 0);
    var cs1 =
        SIMD.Int16x8.extractLane(t, 1) <= SIMD.Int16x8.extractLane(other, 1);
    var cs2 =
        SIMD.Int16x8.extractLane(t, 2) <= SIMD.Int16x8.extractLane(other, 2);
    var cs3 =
        SIMD.Int16x8.extractLane(t, 3) <= SIMD.Int16x8.extractLane(other, 3);
    var cs4 =
        SIMD.Int16x8.extractLane(t, 4) <= SIMD.Int16x8.extractLane(other, 4);
    var cs5 =
        SIMD.Int16x8.extractLane(t, 5) <= SIMD.Int16x8.extractLane(other, 5);
    var cs6 =
        SIMD.Int16x8.extractLane(t, 6) <= SIMD.Int16x8.extractLane(other, 6);
    var cs7 =
        SIMD.Int16x8.extractLane(t, 7) <= SIMD.Int16x8.extractLane(other, 7);
    return SIMD.Bool16x8(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7);
  }
}

if (typeof SIMD.Int16x8.shiftLeftByScalar === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {integer} bits Bit count to shift by.
    * @return {Int16x8} lanes in a shifted by bits.
    */
  SIMD.Int16x8.shiftLeftByScalar = function(a, bits) {
    a = SIMD.Int16x8.check(a);
    if (bits>>>0 > 16)
      bits = 16;
    var s0 = SIMD.Int16x8.extractLane(a, 0) << bits;
    var s1 = SIMD.Int16x8.extractLane(a, 1) << bits;
    var s2 = SIMD.Int16x8.extractLane(a, 2) << bits;
    var s3 = SIMD.Int16x8.extractLane(a, 3) << bits;
    var s4 = SIMD.Int16x8.extractLane(a, 4) << bits;
    var s5 = SIMD.Int16x8.extractLane(a, 5) << bits;
    var s6 = SIMD.Int16x8.extractLane(a, 6) << bits;
    var s7 = SIMD.Int16x8.extractLane(a, 7) << bits;
    return SIMD.Int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
  }
}

if (typeof SIMD.Int16x8.shiftRightLogicalByScalar === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {integer} bits Bit count to shift by.
    * @return {Int16x8} lanes in a shifted by bits.
    */
  SIMD.Int16x8.shiftRightLogicalByScalar = function(a, bits) {
    a = SIMD.Int16x8.check(a);
    if (bits>>>0 > 16)
      bits = 16;
    var s0 = (SIMD.Int16x8.extractLane(a, 0) & 0xffff) >>> bits;
    var s1 = (SIMD.Int16x8.extractLane(a, 1) & 0xffff) >>> bits;
    var s2 = (SIMD.Int16x8.extractLane(a, 2) & 0xffff) >>> bits;
    var s3 = (SIMD.Int16x8.extractLane(a, 3) & 0xffff) >>> bits;
    var s4 = (SIMD.Int16x8.extractLane(a, 4) & 0xffff) >>> bits;
    var s5 = (SIMD.Int16x8.extractLane(a, 5) & 0xffff) >>> bits;
    var s6 = (SIMD.Int16x8.extractLane(a, 6) & 0xffff) >>> bits;
    var s7 = (SIMD.Int16x8.extractLane(a, 7) & 0xffff) >>> bits;
    return SIMD.Int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
  }
}

if (typeof SIMD.Int16x8.shiftRightArithmeticByScalar === "undefined") {
  /**
    * @param {Int16x8} a An instance of Int16x8.
    * @param {integer} bits Bit count to shift by.
    * @return {Int16x8} lanes in a shifted by bits.
    */
  SIMD.Int16x8.shiftRightArithmeticByScalar = function(a, bits) {
    a = SIMD.Int16x8.check(a);
    if (bits>>>0 > 16)
      bits = 16;
    var s0 = SIMD.Int16x8.extractLane(a, 0) >> bits;
    var s1 = SIMD.Int16x8.extractLane(a, 1) >> bits;
    var s2 = SIMD.Int16x8.extractLane(a, 2) >> bits;
    var s3 = SIMD.Int16x8.extractLane(a, 3) >> bits;
    var s4 = SIMD.Int16x8.extractLane(a, 4) >> bits;
    var s5 = SIMD.Int16x8.extractLane(a, 5) >> bits;
    var s6 = SIMD.Int16x8.extractLane(a, 6) >> bits;
    var s7 = SIMD.Int16x8.extractLane(a, 7) >> bits;
    return SIMD.Int16x8(s0, s1, s2, s3, s4, s5, s6, s7);
  }
}

if (typeof SIMD.Int16x8.load === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Int16x8} New instance of Int16x8.
    */
  SIMD.Int16x8.load = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var i16temp = _i16x8;
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? i16temp :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Int16x8(i16temp[0], i16temp[1], i16temp[2], i16temp[3],
                        i16temp[4], i16temp[5], i16temp[6], i16temp[7]);
  }
}

if (typeof SIMD.Int16x8.store === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Int16x8} value An instance of Int16x8.
    * @return {Int16x8} value
    */
  SIMD.Int16x8.store = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Int16x8.check(value);
    _i16x8[0] = SIMD.Int16x8.extractLane(value, 0);
    _i16x8[1] = SIMD.Int16x8.extractLane(value, 1);
    _i16x8[2] = SIMD.Int16x8.extractLane(value, 2);
    _i16x8[3] = SIMD.Int16x8.extractLane(value, 3);
    _i16x8[4] = SIMD.Int16x8.extractLane(value, 4);
    _i16x8[5] = SIMD.Int16x8.extractLane(value, 5);
    _i16x8[6] = SIMD.Int16x8.extractLane(value, 6);
    _i16x8[7] = SIMD.Int16x8.extractLane(value, 7);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

if (typeof SIMD.Int8x16.and === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a & b.
    */
  SIMD.Int8x16.and = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    return SIMD.Int8x16(
        SIMD.Int8x16.extractLane(a, 0) & SIMD.Int8x16.extractLane(b, 0),
        SIMD.Int8x16.extractLane(a, 1) & SIMD.Int8x16.extractLane(b, 1),
        SIMD.Int8x16.extractLane(a, 2) & SIMD.Int8x16.extractLane(b, 2),
        SIMD.Int8x16.extractLane(a, 3) & SIMD.Int8x16.extractLane(b, 3),
        SIMD.Int8x16.extractLane(a, 4) & SIMD.Int8x16.extractLane(b, 4),
        SIMD.Int8x16.extractLane(a, 5) & SIMD.Int8x16.extractLane(b, 5),
        SIMD.Int8x16.extractLane(a, 6) & SIMD.Int8x16.extractLane(b, 6),
        SIMD.Int8x16.extractLane(a, 7) & SIMD.Int8x16.extractLane(b, 7),
        SIMD.Int8x16.extractLane(a, 8) & SIMD.Int8x16.extractLane(b, 8),
        SIMD.Int8x16.extractLane(a, 9) & SIMD.Int8x16.extractLane(b, 9),
        SIMD.Int8x16.extractLane(a, 10) & SIMD.Int8x16.extractLane(b, 10),
        SIMD.Int8x16.extractLane(a, 11) & SIMD.Int8x16.extractLane(b, 11),
        SIMD.Int8x16.extractLane(a, 12) & SIMD.Int8x16.extractLane(b, 12),
        SIMD.Int8x16.extractLane(a, 13) & SIMD.Int8x16.extractLane(b, 13),
        SIMD.Int8x16.extractLane(a, 14) & SIMD.Int8x16.extractLane(b, 14),
        SIMD.Int8x16.extractLane(a, 15) & SIMD.Int8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Int8x16.or === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a | b.
    */
  SIMD.Int8x16.or = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    return SIMD.Int8x16(
        SIMD.Int8x16.extractLane(a, 0) | SIMD.Int8x16.extractLane(b, 0),
        SIMD.Int8x16.extractLane(a, 1) | SIMD.Int8x16.extractLane(b, 1),
        SIMD.Int8x16.extractLane(a, 2) | SIMD.Int8x16.extractLane(b, 2),
        SIMD.Int8x16.extractLane(a, 3) | SIMD.Int8x16.extractLane(b, 3),
        SIMD.Int8x16.extractLane(a, 4) | SIMD.Int8x16.extractLane(b, 4),
        SIMD.Int8x16.extractLane(a, 5) | SIMD.Int8x16.extractLane(b, 5),
        SIMD.Int8x16.extractLane(a, 6) | SIMD.Int8x16.extractLane(b, 6),
        SIMD.Int8x16.extractLane(a, 7) | SIMD.Int8x16.extractLane(b, 7),
        SIMD.Int8x16.extractLane(a, 8) | SIMD.Int8x16.extractLane(b, 8),
        SIMD.Int8x16.extractLane(a, 9) | SIMD.Int8x16.extractLane(b, 9),
        SIMD.Int8x16.extractLane(a, 10) | SIMD.Int8x16.extractLane(b, 10),
        SIMD.Int8x16.extractLane(a, 11) | SIMD.Int8x16.extractLane(b, 11),
        SIMD.Int8x16.extractLane(a, 12) | SIMD.Int8x16.extractLane(b, 12),
        SIMD.Int8x16.extractLane(a, 13) | SIMD.Int8x16.extractLane(b, 13),
        SIMD.Int8x16.extractLane(a, 14) | SIMD.Int8x16.extractLane(b, 14),
        SIMD.Int8x16.extractLane(a, 15) | SIMD.Int8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Int8x16.xor === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a ^ b.
    */
  SIMD.Int8x16.xor = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    return SIMD.Int8x16(
        SIMD.Int8x16.extractLane(a, 0) ^ SIMD.Int8x16.extractLane(b, 0),
        SIMD.Int8x16.extractLane(a, 1) ^ SIMD.Int8x16.extractLane(b, 1),
        SIMD.Int8x16.extractLane(a, 2) ^ SIMD.Int8x16.extractLane(b, 2),
        SIMD.Int8x16.extractLane(a, 3) ^ SIMD.Int8x16.extractLane(b, 3),
        SIMD.Int8x16.extractLane(a, 4) ^ SIMD.Int8x16.extractLane(b, 4),
        SIMD.Int8x16.extractLane(a, 5) ^ SIMD.Int8x16.extractLane(b, 5),
        SIMD.Int8x16.extractLane(a, 6) ^ SIMD.Int8x16.extractLane(b, 6),
        SIMD.Int8x16.extractLane(a, 7) ^ SIMD.Int8x16.extractLane(b, 7),
        SIMD.Int8x16.extractLane(a, 8) ^ SIMD.Int8x16.extractLane(b, 8),
        SIMD.Int8x16.extractLane(a, 9) ^ SIMD.Int8x16.extractLane(b, 9),
        SIMD.Int8x16.extractLane(a, 10) ^ SIMD.Int8x16.extractLane(b, 10),
        SIMD.Int8x16.extractLane(a, 11) ^ SIMD.Int8x16.extractLane(b, 11),
        SIMD.Int8x16.extractLane(a, 12) ^ SIMD.Int8x16.extractLane(b, 12),
        SIMD.Int8x16.extractLane(a, 13) ^ SIMD.Int8x16.extractLane(b, 13),
        SIMD.Int8x16.extractLane(a, 14) ^ SIMD.Int8x16.extractLane(b, 14),
        SIMD.Int8x16.extractLane(a, 15) ^ SIMD.Int8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Int8x16.not === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of ~t
    */
  SIMD.Int8x16.not = function(t) {
    t = SIMD.Int8x16.check(t);
    return SIMD.Int8x16(~SIMD.Int8x16.extractLane(t, 0),
                        ~SIMD.Int8x16.extractLane(t, 1),
                        ~SIMD.Int8x16.extractLane(t, 2),
                        ~SIMD.Int8x16.extractLane(t, 3),
                        ~SIMD.Int8x16.extractLane(t, 4),
                        ~SIMD.Int8x16.extractLane(t, 5),
                        ~SIMD.Int8x16.extractLane(t, 6),
                        ~SIMD.Int8x16.extractLane(t, 7),
                        ~SIMD.Int8x16.extractLane(t, 8),
                        ~SIMD.Int8x16.extractLane(t, 9),
                        ~SIMD.Int8x16.extractLane(t, 10),
                        ~SIMD.Int8x16.extractLane(t, 11),
                        ~SIMD.Int8x16.extractLane(t, 12),
                        ~SIMD.Int8x16.extractLane(t, 13),
                        ~SIMD.Int8x16.extractLane(t, 14),
                        ~SIMD.Int8x16.extractLane(t, 15));
  }
}

if (typeof SIMD.Int8x16.neg === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of -t
    */
  SIMD.Int8x16.neg = function(t) {
    t = SIMD.Int8x16.check(t);
    return SIMD.Int8x16(-SIMD.Int8x16.extractLane(t, 0),
                        -SIMD.Int8x16.extractLane(t, 1),
                        -SIMD.Int8x16.extractLane(t, 2),
                        -SIMD.Int8x16.extractLane(t, 3),
                        -SIMD.Int8x16.extractLane(t, 4),
                        -SIMD.Int8x16.extractLane(t, 5),
                        -SIMD.Int8x16.extractLane(t, 6),
                        -SIMD.Int8x16.extractLane(t, 7),
                        -SIMD.Int8x16.extractLane(t, 8),
                        -SIMD.Int8x16.extractLane(t, 9),
                        -SIMD.Int8x16.extractLane(t, 10),
                        -SIMD.Int8x16.extractLane(t, 11),
                        -SIMD.Int8x16.extractLane(t, 12),
                        -SIMD.Int8x16.extractLane(t, 13),
                        -SIMD.Int8x16.extractLane(t, 14),
                        -SIMD.Int8x16.extractLane(t, 15));
  }
}

if (typeof SIMD.Int8x16.add === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a + b.
    */
  SIMD.Int8x16.add = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    return SIMD.Int8x16(
        SIMD.Int8x16.extractLane(a, 0) + SIMD.Int8x16.extractLane(b, 0),
        SIMD.Int8x16.extractLane(a, 1) + SIMD.Int8x16.extractLane(b, 1),
        SIMD.Int8x16.extractLane(a, 2) + SIMD.Int8x16.extractLane(b, 2),
        SIMD.Int8x16.extractLane(a, 3) + SIMD.Int8x16.extractLane(b, 3),
        SIMD.Int8x16.extractLane(a, 4) + SIMD.Int8x16.extractLane(b, 4),
        SIMD.Int8x16.extractLane(a, 5) + SIMD.Int8x16.extractLane(b, 5),
        SIMD.Int8x16.extractLane(a, 6) + SIMD.Int8x16.extractLane(b, 6),
        SIMD.Int8x16.extractLane(a, 7) + SIMD.Int8x16.extractLane(b, 7),
        SIMD.Int8x16.extractLane(a, 8) + SIMD.Int8x16.extractLane(b, 8),
        SIMD.Int8x16.extractLane(a, 9) + SIMD.Int8x16.extractLane(b, 9),
        SIMD.Int8x16.extractLane(a, 10) + SIMD.Int8x16.extractLane(b, 10),
        SIMD.Int8x16.extractLane(a, 11) + SIMD.Int8x16.extractLane(b, 11),
        SIMD.Int8x16.extractLane(a, 12) + SIMD.Int8x16.extractLane(b, 12),
        SIMD.Int8x16.extractLane(a, 13) + SIMD.Int8x16.extractLane(b, 13),
        SIMD.Int8x16.extractLane(a, 14) + SIMD.Int8x16.extractLane(b, 14),
        SIMD.Int8x16.extractLane(a, 15) + SIMD.Int8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Int8x16.sub === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a - b.
    */
  SIMD.Int8x16.sub = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    return SIMD.Int8x16(
        SIMD.Int8x16.extractLane(a, 0) - SIMD.Int8x16.extractLane(b, 0),
        SIMD.Int8x16.extractLane(a, 1) - SIMD.Int8x16.extractLane(b, 1),
        SIMD.Int8x16.extractLane(a, 2) - SIMD.Int8x16.extractLane(b, 2),
        SIMD.Int8x16.extractLane(a, 3) - SIMD.Int8x16.extractLane(b, 3),
        SIMD.Int8x16.extractLane(a, 4) - SIMD.Int8x16.extractLane(b, 4),
        SIMD.Int8x16.extractLane(a, 5) - SIMD.Int8x16.extractLane(b, 5),
        SIMD.Int8x16.extractLane(a, 6) - SIMD.Int8x16.extractLane(b, 6),
        SIMD.Int8x16.extractLane(a, 7) - SIMD.Int8x16.extractLane(b, 7),
        SIMD.Int8x16.extractLane(a, 8) - SIMD.Int8x16.extractLane(b, 8),
        SIMD.Int8x16.extractLane(a, 9) - SIMD.Int8x16.extractLane(b, 9),
        SIMD.Int8x16.extractLane(a, 10) - SIMD.Int8x16.extractLane(b, 10),
        SIMD.Int8x16.extractLane(a, 11) - SIMD.Int8x16.extractLane(b, 11),
        SIMD.Int8x16.extractLane(a, 12) - SIMD.Int8x16.extractLane(b, 12),
        SIMD.Int8x16.extractLane(a, 13) - SIMD.Int8x16.extractLane(b, 13),
        SIMD.Int8x16.extractLane(a, 14) - SIMD.Int8x16.extractLane(b, 14),
        SIMD.Int8x16.extractLane(a, 15) - SIMD.Int8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Int8x16.mul === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a * b.
    */
  SIMD.Int8x16.mul = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    return SIMD.Int8x16(Math.imul(SIMD.Int8x16.extractLane(a, 0),
                                  SIMD.Int8x16.extractLane(b, 0)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 1),
                                  SIMD.Int8x16.extractLane(b, 1)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 2),
                                  SIMD.Int8x16.extractLane(b, 2)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 3),
                                  SIMD.Int8x16.extractLane(b, 3)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 4),
                                  SIMD.Int8x16.extractLane(b, 4)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 5),
                                  SIMD.Int8x16.extractLane(b, 5)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 6),
                                  SIMD.Int8x16.extractLane(b, 6)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 7),
                                  SIMD.Int8x16.extractLane(b, 7)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 8),
                                  SIMD.Int8x16.extractLane(b, 8)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 9),
                                  SIMD.Int8x16.extractLane(b, 9)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 10),
                                  SIMD.Int8x16.extractLane(b, 10)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 11),
                                  SIMD.Int8x16.extractLane(b, 11)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 12),
                                  SIMD.Int8x16.extractLane(b, 12)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 13),
                                  SIMD.Int8x16.extractLane(b, 13)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 14),
                                  SIMD.Int8x16.extractLane(b, 14)),
                        Math.imul(SIMD.Int8x16.extractLane(a, 15),
                                  SIMD.Int8x16.extractLane(b, 15)));
  }
}

if (typeof SIMD.Int8x16.swizzle === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16 to be swizzled.
    * @param {integer} s0 - Index in t for lane s0
    * @param {integer} s1 - Index in t for lane s1
    * @param {integer} s2 - Index in t for lane s2
    * @param {integer} s3 - Index in t for lane s3
    * @param {integer} s4 - Index in t for lane s4
    * @param {integer} s5 - Index in t for lane s5
    * @param {integer} s6 - Index in t for lane s6
    * @param {integer} s7 - Index in t for lane s7
    * @param {integer} s8 - Index in t for lane s8
    * @param {integer} s9 - Index in t for lane s9
    * @param {integer} s10 - Index in t for lane s10
    * @param {integer} s11 - Index in t for lane s11
    * @param {integer} s12 - Index in t for lane s12
    * @param {integer} s13 - Index in t for lane s13
    * @param {integer} s14 - Index in t for lane s14
    * @param {integer} s15 - Index in t for lane s15
    * @return {Int8x16} New instance of Int8x16 with lanes swizzled.
    */
  SIMD.Int8x16.swizzle = function(t, s0, s1, s2, s3, s4, s5, s6, s7,
                                     s8, s9, s10, s11, s12, s13, s14, s15) {
    t = SIMD.Int8x16.check(t);
    check16(s0);
    check16(s1);
    check16(s2);
    check16(s3);
    check16(s4);
    check16(s5);
    check16(s6);
    check16(s7);
    check16(s8);
    check16(s9);
    check16(s10);
    check16(s11);
    check16(s12);
    check16(s13);
    check16(s14);
    check16(s15);
    var storage = _i8x16;
    storage[0] = SIMD.Int8x16.extractLane(t, 0);
    storage[1] = SIMD.Int8x16.extractLane(t, 1);
    storage[2] = SIMD.Int8x16.extractLane(t, 2);
    storage[3] = SIMD.Int8x16.extractLane(t, 3);
    storage[4] = SIMD.Int8x16.extractLane(t, 4);
    storage[5] = SIMD.Int8x16.extractLane(t, 5);
    storage[6] = SIMD.Int8x16.extractLane(t, 6);
    storage[7] = SIMD.Int8x16.extractLane(t, 7);
    storage[8] = SIMD.Int8x16.extractLane(t, 8);
    storage[9] = SIMD.Int8x16.extractLane(t, 9);
    storage[10] = SIMD.Int8x16.extractLane(t, 10);
    storage[11] = SIMD.Int8x16.extractLane(t, 11);
    storage[12] = SIMD.Int8x16.extractLane(t, 12);
    storage[13] = SIMD.Int8x16.extractLane(t, 13);
    storage[14] = SIMD.Int8x16.extractLane(t, 14);
    storage[15] = SIMD.Int8x16.extractLane(t, 15);
    return SIMD.Int8x16(storage[s0], storage[s1], storage[s2], storage[s3],
                        storage[s4], storage[s5], storage[s6], storage[s7],
                        storage[s8], storage[s9], storage[s10], storage[s11],
                        storage[s12], storage[s13], storage[s14], storage[s15]);
  }
}

if (typeof SIMD.Int8x16.shuffle === "undefined") {

  _i8x32 = new Int8Array(32);

  /**
    * @param {Int8x16} t0 An instance of Int8x16 to be shuffled.
    * @param {Int8x16} t1 An instance of Int8x16 to be shuffled.
    * @param {integer} s0 - Index in concatenation of t0 and t1 for lane s0
    * @param {integer} s1 - Index in concatenation of t0 and t1 for lane s1
    * @param {integer} s2 - Index in concatenation of t0 and t1 for lane s2
    * @param {integer} s3 - Index in concatenation of t0 and t1 for lane s3
    * @param {integer} s4 - Index in concatenation of t0 and t1 for lane s4
    * @param {integer} s5 - Index in concatenation of t0 and t1 for lane s5
    * @param {integer} s6 - Index in concatenation of t0 and t1 for lane s6
    * @param {integer} s7 - Index in concatenation of t0 and t1 for lane s7
    * @param {integer} s8 - Index in concatenation of t0 and t1 for lane s8
    * @param {integer} s9 - Index in concatenation of t0 and t1 for lane s9
    * @param {integer} s10 - Index in concatenation of t0 and t1 for lane s10
    * @param {integer} s11 - Index in concatenation of t0 and t1 for lane s11
    * @param {integer} s12 - Index in concatenation of t0 and t1 for lane s12
    * @param {integer} s13 - Index in concatenation of t0 and t1 for lane s13
    * @param {integer} s14 - Index in concatenation of t0 and t1 for lane s14
    * @param {integer} s15 - Index in concatenation of t0 and t1 for lane s15
    * @return {Int8x16} New instance of Int8x16 with lanes shuffled.
    */
  SIMD.Int8x16.shuffle = function(t0, t1, s0, s1, s2, s3, s4, s5, s6, s7,
                                          s8, s9, s10, s11, s12, s13, s14, s15) {
    t0 = SIMD.Int8x16.check(t0);
    t1 = SIMD.Int8x16.check(t1);
    check32(s0);
    check32(s1);
    check32(s2);
    check32(s3);
    check32(s4);
    check32(s5);
    check32(s6);
    check32(s7);
    check32(s8);
    check32(s9);
    check32(s10);
    check32(s11);
    check32(s12);
    check32(s13);
    check32(s14);
    check32(s15);
    var storage = _i8x32;
    storage[0] = SIMD.Int8x16.extractLane(t0, 0);
    storage[1] = SIMD.Int8x16.extractLane(t0, 1);
    storage[2] = SIMD.Int8x16.extractLane(t0, 2);
    storage[3] = SIMD.Int8x16.extractLane(t0, 3);
    storage[4] = SIMD.Int8x16.extractLane(t0, 4);
    storage[5] = SIMD.Int8x16.extractLane(t0, 5);
    storage[6] = SIMD.Int8x16.extractLane(t0, 6);
    storage[7] = SIMD.Int8x16.extractLane(t0, 7);
    storage[8] = SIMD.Int8x16.extractLane(t0, 8);
    storage[9] = SIMD.Int8x16.extractLane(t0, 9);
    storage[10] = SIMD.Int8x16.extractLane(t0, 10);
    storage[11] = SIMD.Int8x16.extractLane(t0, 11);
    storage[12] = SIMD.Int8x16.extractLane(t0, 12);
    storage[13] = SIMD.Int8x16.extractLane(t0, 13);
    storage[14] = SIMD.Int8x16.extractLane(t0, 14);
    storage[15] = SIMD.Int8x16.extractLane(t0, 15);
    storage[16] = SIMD.Int8x16.extractLane(t1, 0);
    storage[17] = SIMD.Int8x16.extractLane(t1, 1);
    storage[18] = SIMD.Int8x16.extractLane(t1, 2);
    storage[19] = SIMD.Int8x16.extractLane(t1, 3);
    storage[20] = SIMD.Int8x16.extractLane(t1, 4);
    storage[21] = SIMD.Int8x16.extractLane(t1, 5);
    storage[22] = SIMD.Int8x16.extractLane(t1, 6);
    storage[23] = SIMD.Int8x16.extractLane(t1, 7);
    storage[24] = SIMD.Int8x16.extractLane(t1, 8);
    storage[25] = SIMD.Int8x16.extractLane(t1, 9);
    storage[26] = SIMD.Int8x16.extractLane(t1, 10);
    storage[27] = SIMD.Int8x16.extractLane(t1, 11);
    storage[28] = SIMD.Int8x16.extractLane(t1, 12);
    storage[29] = SIMD.Int8x16.extractLane(t1, 13);
    storage[30] = SIMD.Int8x16.extractLane(t1, 14);
    storage[31] = SIMD.Int8x16.extractLane(t1, 15);
    return SIMD.Int8x16(storage[s0], storage[s1], storage[s2], storage[s3],
                        storage[s4], storage[s5], storage[s6], storage[s7],
                        storage[s8], storage[s9], storage[s10], storage[s11],
                        storage[s12], storage[s13], storage[s14], storage[s15]);
  }
}

if (typeof SIMD.Int8x16.addSaturate === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a + b with
    * signed saturating behavior on overflow.
    */
  SIMD.Int8x16.addSaturate = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    var c = SIMD.Int8x16.add(a, b);
    var max = SIMD.Int8x16.splat(0x7f);
    var min = SIMD.Int8x16.splat(0x80);
    var mask = SIMD.Int8x16.lessThan(c, a);
    var bneg = SIMD.Int8x16.lessThan(b, SIMD.Int8x16.splat(0));
    return SIMD.Int8x16.select(SIMD.Bool8x16.and(mask, SIMD.Bool8x16.not(bneg)), max,
             SIMD.Int8x16.select(SIMD.Bool8x16.and(SIMD.Bool8x16.not(mask), bneg), min,
               c));
  }
}

if (typeof SIMD.Int8x16.subSaturate === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Int8x16} New instance of Int8x16 with values of a - b with
    * signed saturating behavior on overflow.
    */
  SIMD.Int8x16.subSaturate = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    var c = SIMD.Int8x16.sub(a, b);
    var max = SIMD.Int8x16.splat(0x7f);
    var min = SIMD.Int8x16.splat(0x80);
    var mask = SIMD.Int8x16.greaterThan(c, a);
    var bneg = SIMD.Int8x16.lessThan(b, SIMD.Int8x16.splat(0));
    return SIMD.Int8x16.select(SIMD.Bool8x16.and(mask, SIMD.Bool8x16.not(bneg)), min,
             SIMD.Int8x16.select(SIMD.Bool8x16.and(SIMD.Bool8x16.not(mask), bneg), max,
               c));
  }
}

if (typeof SIMD.Int8x16.sumOfAbsoluteDifferences === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {Int8x16} b An instance of Int8x16.
    * @return {Number} The sum of the absolute differences (SAD) of the
    * corresponding elements of a and b.
    */
  SIMD.Int8x16.sumOfAbsoluteDifferences = function(a, b) {
    a = SIMD.Int8x16.check(a);
    b = SIMD.Int8x16.check(b);
    return Math.abs(
        SIMD.Int8x16.extractLane(a, 0) - SIMD.Int8x16.extractLane(b, 0)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 1) - SIMD.Int8x16.extractLane(b, 1)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 2) - SIMD.Int8x16.extractLane(b, 2)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 3) - SIMD.Int8x16.extractLane(b, 3)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 4) - SIMD.Int8x16.extractLane(b, 4)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 5) - SIMD.Int8x16.extractLane(b, 5)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 6) - SIMD.Int8x16.extractLane(b, 6)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 7) - SIMD.Int8x16.extractLane(b, 7)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 8) - SIMD.Int8x16.extractLane(b, 8)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 9) - SIMD.Int8x16.extractLane(b, 9)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 10) - SIMD.Int8x16.extractLane(b, 10)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 11) - SIMD.Int8x16.extractLane(b, 11)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 12) - SIMD.Int8x16.extractLane(b, 12)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 13) - SIMD.Int8x16.extractLane(b, 13)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 14) - SIMD.Int8x16.extractLane(b, 14)) +
        Math.abs(
            SIMD.Int8x16.extractLane(a, 15) - SIMD.Int8x16.extractLane(b, 15));
  }
}

if (typeof SIMD.Int8x16.select === "undefined") {
  /**
    * @param {Bool8x16} t Selector mask. An instance of Bool8x16
    * @param {Int8x16} trueValue Pick lane from here if corresponding
    * selector lane is true
    * @param {Int8x16} falseValue Pick lane from here if corresponding
    * selector lane is false
    * @return {Int8x16} Mix of lanes from trueValue or falseValue as
    * indicated
    */
  SIMD.Int8x16.select = function(t, trueValue, falseValue) {
    t = SIMD.Bool8x16.check(t);
    trueValue = SIMD.Int8x16.check(trueValue);
    falseValue = SIMD.Int8x16.check(falseValue);
    return SIMD.Int8x16(
        SIMD.Bool8x16.extractLane(t, 0) ?
            SIMD.Int8x16.extractLane(trueValue, 0) :
                SIMD.Int8x16.extractLane(falseValue, 0),
        SIMD.Bool8x16.extractLane(t, 1) ?
            SIMD.Int8x16.extractLane(trueValue, 1) :
                SIMD.Int8x16.extractLane(falseValue, 1),
        SIMD.Bool8x16.extractLane(t, 2) ?
            SIMD.Int8x16.extractLane(trueValue, 2) :
                SIMD.Int8x16.extractLane(falseValue, 2),
        SIMD.Bool8x16.extractLane(t, 3) ?
            SIMD.Int8x16.extractLane(trueValue, 3) :
                SIMD.Int8x16.extractLane(falseValue, 3),
        SIMD.Bool8x16.extractLane(t, 4) ?
            SIMD.Int8x16.extractLane(trueValue, 4) :
                SIMD.Int8x16.extractLane(falseValue, 4),
        SIMD.Bool8x16.extractLane(t, 5) ?
            SIMD.Int8x16.extractLane(trueValue, 5) :
                SIMD.Int8x16.extractLane(falseValue, 5),
        SIMD.Bool8x16.extractLane(t, 6) ?
            SIMD.Int8x16.extractLane(trueValue, 6) :
                SIMD.Int8x16.extractLane(falseValue, 6),
        SIMD.Bool8x16.extractLane(t, 7) ?
            SIMD.Int8x16.extractLane(trueValue, 7) :
                SIMD.Int8x16.extractLane(falseValue, 7),
        SIMD.Bool8x16.extractLane(t, 8) ?
            SIMD.Int8x16.extractLane(trueValue, 8) :
                SIMD.Int8x16.extractLane(falseValue, 8),
        SIMD.Bool8x16.extractLane(t, 9) ?
            SIMD.Int8x16.extractLane(trueValue, 9) :
                SIMD.Int8x16.extractLane(falseValue, 9),
        SIMD.Bool8x16.extractLane(t, 10) ?
            SIMD.Int8x16.extractLane(trueValue, 10) :
                SIMD.Int8x16.extractLane(falseValue, 10),
        SIMD.Bool8x16.extractLane(t, 11) ?
            SIMD.Int8x16.extractLane(trueValue, 11) :
                SIMD.Int8x16.extractLane(falseValue, 11),
        SIMD.Bool8x16.extractLane(t, 12) ?
            SIMD.Int8x16.extractLane(trueValue, 12) :
                SIMD.Int8x16.extractLane(falseValue, 12),
        SIMD.Bool8x16.extractLane(t, 13) ?
            SIMD.Int8x16.extractLane(trueValue, 13) :
                SIMD.Int8x16.extractLane(falseValue, 13),
        SIMD.Bool8x16.extractLane(t, 14) ?
            SIMD.Int8x16.extractLane(trueValue, 14) :
                SIMD.Int8x16.extractLane(falseValue, 14),
        SIMD.Bool8x16.extractLane(t, 15) ?
            SIMD.Int8x16.extractLane(trueValue, 15) :
                SIMD.Int8x16.extractLane(falseValue, 15));
  }
}

if (typeof SIMD.Int8x16.selectBits === "undefined") {
  /**
    * @param {Int8x16} t Selector mask. An instance of Int8x16
    * @param {Int8x16} trueValue Pick bit from here if corresponding
    * selector bit is 1
    * @param {Int8x16} falseValue Pick bit from here if corresponding
    * selector bit is 0
    * @return {Int8x16} Mix of bits from trueValue or falseValue as
    * indicated
    */
  SIMD.Int8x16.selectBits = function(t, trueValue, falseValue) {
    t = SIMD.Int8x16.check(t);
    trueValue = SIMD.Int8x16.check(trueValue);
    falseValue = SIMD.Int8x16.check(falseValue);
    var tr = SIMD.Int8x16.and(t, trueValue);
    var fr = SIMD.Int8x16.and(SIMD.Int8x16.not(t), falseValue);
    return SIMD.Int8x16.or(tr, fr);
  }
}

if (typeof SIMD.Int8x16.equal === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {Int8x16} other An instance of Int8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of t == other.
    */
  SIMD.Int8x16.equal = function(t, other) {
    t = SIMD.Int8x16.check(t);
    other = SIMD.Int8x16.check(other);
    var cs0 =
        SIMD.Int8x16.extractLane(t, 0) == SIMD.Int8x16.extractLane(other, 0);
    var cs1 =
        SIMD.Int8x16.extractLane(t, 1) == SIMD.Int8x16.extractLane(other, 1);
    var cs2 =
        SIMD.Int8x16.extractLane(t, 2) == SIMD.Int8x16.extractLane(other, 2);
    var cs3 =
        SIMD.Int8x16.extractLane(t, 3) == SIMD.Int8x16.extractLane(other, 3);
    var cs4 =
        SIMD.Int8x16.extractLane(t, 4) == SIMD.Int8x16.extractLane(other, 4);
    var cs5 =
        SIMD.Int8x16.extractLane(t, 5) == SIMD.Int8x16.extractLane(other, 5);
    var cs6 =
        SIMD.Int8x16.extractLane(t, 6) == SIMD.Int8x16.extractLane(other, 6);
    var cs7 =
        SIMD.Int8x16.extractLane(t, 7) == SIMD.Int8x16.extractLane(other, 7);
    var cs8 =
        SIMD.Int8x16.extractLane(t, 8) == SIMD.Int8x16.extractLane(other, 8);
    var cs9 =
        SIMD.Int8x16.extractLane(t, 9) == SIMD.Int8x16.extractLane(other, 9);
    var cs10 =
        SIMD.Int8x16.extractLane(t, 10) == SIMD.Int8x16.extractLane(other, 10);
    var cs11 =
        SIMD.Int8x16.extractLane(t, 11) == SIMD.Int8x16.extractLane(other, 11);
    var cs12 =
        SIMD.Int8x16.extractLane(t, 12) == SIMD.Int8x16.extractLane(other, 12);
    var cs13 =
        SIMD.Int8x16.extractLane(t, 13) == SIMD.Int8x16.extractLane(other, 13);
    var cs14 =
        SIMD.Int8x16.extractLane(t, 14) == SIMD.Int8x16.extractLane(other, 14);
    var cs15 =
        SIMD.Int8x16.extractLane(t, 15) == SIMD.Int8x16.extractLane(other, 15);
    return SIMD.Bool8x16(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                         cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
  }
}

if (typeof SIMD.Int8x16.notEqual === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {Int8x16} other An instance of Int8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of t != other.
    */
  SIMD.Int8x16.notEqual = function(t, other) {
    t = SIMD.Int8x16.check(t);
    other = SIMD.Int8x16.check(other);
    var cs0 =
        SIMD.Int8x16.extractLane(t, 0) != SIMD.Int8x16.extractLane(other, 0);
    var cs1 =
        SIMD.Int8x16.extractLane(t, 1) != SIMD.Int8x16.extractLane(other, 1);
    var cs2 =
        SIMD.Int8x16.extractLane(t, 2) != SIMD.Int8x16.extractLane(other, 2);
    var cs3 =
        SIMD.Int8x16.extractLane(t, 3) != SIMD.Int8x16.extractLane(other, 3);
    var cs4 =
        SIMD.Int8x16.extractLane(t, 4) != SIMD.Int8x16.extractLane(other, 4);
    var cs5 =
        SIMD.Int8x16.extractLane(t, 5) != SIMD.Int8x16.extractLane(other, 5);
    var cs6 =
        SIMD.Int8x16.extractLane(t, 6) != SIMD.Int8x16.extractLane(other, 6);
    var cs7 =
        SIMD.Int8x16.extractLane(t, 7) != SIMD.Int8x16.extractLane(other, 7);
    var cs8 =
        SIMD.Int8x16.extractLane(t, 8) != SIMD.Int8x16.extractLane(other, 8);
    var cs9 =
        SIMD.Int8x16.extractLane(t, 9) != SIMD.Int8x16.extractLane(other, 9);
    var cs10 =
        SIMD.Int8x16.extractLane(t, 10) != SIMD.Int8x16.extractLane(other, 10);
    var cs11 =
        SIMD.Int8x16.extractLane(t, 11) != SIMD.Int8x16.extractLane(other, 11);
    var cs12 =
        SIMD.Int8x16.extractLane(t, 12) != SIMD.Int8x16.extractLane(other, 12);
    var cs13 =
        SIMD.Int8x16.extractLane(t, 13) != SIMD.Int8x16.extractLane(other, 13);
    var cs14 =
        SIMD.Int8x16.extractLane(t, 14) != SIMD.Int8x16.extractLane(other, 14);
    var cs15 =
        SIMD.Int8x16.extractLane(t, 15) != SIMD.Int8x16.extractLane(other, 15);
    return SIMD.Bool8x16(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                         cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
  }
}

if (typeof SIMD.Int8x16.greaterThan === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {Int8x16} other An instance of Int8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of t > other.
    */
  SIMD.Int8x16.greaterThan = function(t, other) {
    t = SIMD.Int8x16.check(t);
    other = SIMD.Int8x16.check(other);
    var cs0 =
        SIMD.Int8x16.extractLane(t, 0) > SIMD.Int8x16.extractLane(other, 0);
    var cs1 =
        SIMD.Int8x16.extractLane(t, 1) > SIMD.Int8x16.extractLane(other, 1);
    var cs2 =
        SIMD.Int8x16.extractLane(t, 2) > SIMD.Int8x16.extractLane(other, 2);
    var cs3 =
        SIMD.Int8x16.extractLane(t, 3) > SIMD.Int8x16.extractLane(other, 3);
    var cs4 =
        SIMD.Int8x16.extractLane(t, 4) > SIMD.Int8x16.extractLane(other, 4);
    var cs5 =
        SIMD.Int8x16.extractLane(t, 5) > SIMD.Int8x16.extractLane(other, 5);
    var cs6 =
        SIMD.Int8x16.extractLane(t, 6) > SIMD.Int8x16.extractLane(other, 6);
    var cs7 =
        SIMD.Int8x16.extractLane(t, 7) > SIMD.Int8x16.extractLane(other, 7);
    var cs8 =
        SIMD.Int8x16.extractLane(t, 8) > SIMD.Int8x16.extractLane(other, 8);
    var cs9 =
        SIMD.Int8x16.extractLane(t, 9) > SIMD.Int8x16.extractLane(other, 9);
    var cs10 =
        SIMD.Int8x16.extractLane(t, 10) > SIMD.Int8x16.extractLane(other, 10);
    var cs11 =
        SIMD.Int8x16.extractLane(t, 11) > SIMD.Int8x16.extractLane(other, 11);
    var cs12 =
        SIMD.Int8x16.extractLane(t, 12) > SIMD.Int8x16.extractLane(other, 12);
    var cs13 =
        SIMD.Int8x16.extractLane(t, 13) > SIMD.Int8x16.extractLane(other, 13);
    var cs14 =
        SIMD.Int8x16.extractLane(t, 14) > SIMD.Int8x16.extractLane(other, 14);
    var cs15 =
        SIMD.Int8x16.extractLane(t, 15) > SIMD.Int8x16.extractLane(other, 15);
    return SIMD.Bool8x16(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                         cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
  }
}

if (typeof SIMD.Int8x16.greaterThanOrEqual === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {Int8x16} other An instance of Int8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of t >= other.
    */
  SIMD.Int8x16.greaterThanOrEqual = function(t, other) {
    t = SIMD.Int8x16.check(t);
    other = SIMD.Int8x16.check(other);
    var cs0 =
        SIMD.Int8x16.extractLane(t, 0) >= SIMD.Int8x16.extractLane(other, 0);
    var cs1 =
        SIMD.Int8x16.extractLane(t, 1) >= SIMD.Int8x16.extractLane(other, 1);
    var cs2 =
        SIMD.Int8x16.extractLane(t, 2) >= SIMD.Int8x16.extractLane(other, 2);
    var cs3 =
        SIMD.Int8x16.extractLane(t, 3) >= SIMD.Int8x16.extractLane(other, 3);
    var cs4 =
        SIMD.Int8x16.extractLane(t, 4) >= SIMD.Int8x16.extractLane(other, 4);
    var cs5 =
        SIMD.Int8x16.extractLane(t, 5) >= SIMD.Int8x16.extractLane(other, 5);
    var cs6 =
        SIMD.Int8x16.extractLane(t, 6) >= SIMD.Int8x16.extractLane(other, 6);
    var cs7 =
        SIMD.Int8x16.extractLane(t, 7) >= SIMD.Int8x16.extractLane(other, 7);
    var cs8 =
        SIMD.Int8x16.extractLane(t, 8) >= SIMD.Int8x16.extractLane(other, 8);
    var cs9 =
        SIMD.Int8x16.extractLane(t, 9) >= SIMD.Int8x16.extractLane(other, 9);
    var cs10 =
        SIMD.Int8x16.extractLane(t, 10) >= SIMD.Int8x16.extractLane(other, 10);
    var cs11 =
        SIMD.Int8x16.extractLane(t, 11) >= SIMD.Int8x16.extractLane(other, 11);
    var cs12 =
        SIMD.Int8x16.extractLane(t, 12) >= SIMD.Int8x16.extractLane(other, 12);
    var cs13 =
        SIMD.Int8x16.extractLane(t, 13) >= SIMD.Int8x16.extractLane(other, 13);
    var cs14 =
        SIMD.Int8x16.extractLane(t, 14) >= SIMD.Int8x16.extractLane(other, 14);
    var cs15 =
        SIMD.Int8x16.extractLane(t, 15) >= SIMD.Int8x16.extractLane(other, 15);
    return SIMD.Bool8x16(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                         cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
  }
}

if (typeof SIMD.Int8x16.lessThan === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {Int8x16} other An instance of Int8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of t < other.
    */
  SIMD.Int8x16.lessThan = function(t, other) {
    t = SIMD.Int8x16.check(t);
    other = SIMD.Int8x16.check(other);
    var cs0 =
        SIMD.Int8x16.extractLane(t, 0) < SIMD.Int8x16.extractLane(other, 0);
    var cs1 =
        SIMD.Int8x16.extractLane(t, 1) < SIMD.Int8x16.extractLane(other, 1);
    var cs2 =
        SIMD.Int8x16.extractLane(t, 2) < SIMD.Int8x16.extractLane(other, 2);
    var cs3 =
        SIMD.Int8x16.extractLane(t, 3) < SIMD.Int8x16.extractLane(other, 3);
    var cs4 =
        SIMD.Int8x16.extractLane(t, 4) < SIMD.Int8x16.extractLane(other, 4);
    var cs5 =
        SIMD.Int8x16.extractLane(t, 5) < SIMD.Int8x16.extractLane(other, 5);
    var cs6 =
        SIMD.Int8x16.extractLane(t, 6) < SIMD.Int8x16.extractLane(other, 6);
    var cs7 =
        SIMD.Int8x16.extractLane(t, 7) < SIMD.Int8x16.extractLane(other, 7);
    var cs8 =
        SIMD.Int8x16.extractLane(t, 8) < SIMD.Int8x16.extractLane(other, 8);
    var cs9 =
        SIMD.Int8x16.extractLane(t, 9) < SIMD.Int8x16.extractLane(other, 9);
    var cs10 =
        SIMD.Int8x16.extractLane(t, 10) < SIMD.Int8x16.extractLane(other, 10);
    var cs11 =
        SIMD.Int8x16.extractLane(t, 11) < SIMD.Int8x16.extractLane(other, 11);
    var cs12 =
        SIMD.Int8x16.extractLane(t, 12) < SIMD.Int8x16.extractLane(other, 12);
    var cs13 =
        SIMD.Int8x16.extractLane(t, 13) < SIMD.Int8x16.extractLane(other, 13);
    var cs14 =
        SIMD.Int8x16.extractLane(t, 14) < SIMD.Int8x16.extractLane(other, 14);
    var cs15 =
        SIMD.Int8x16.extractLane(t, 15) < SIMD.Int8x16.extractLane(other, 15);
    return SIMD.Bool8x16(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                         cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
  }
}

if (typeof SIMD.Int8x16.lessThanOrEqual === "undefined") {
  /**
    * @param {Int8x16} t An instance of Int8x16.
    * @param {Int8x16} other An instance of Int8x16.
    * @return {Bool8x16} true or false in each lane depending on
    * the result of t <= other.
    */
  SIMD.Int8x16.lessThanOrEqual = function(t, other) {
    t = SIMD.Int8x16.check(t);
    other = SIMD.Int8x16.check(other);
    var cs0 =
        SIMD.Int8x16.extractLane(t, 0) <= SIMD.Int8x16.extractLane(other, 0);
    var cs1 =
        SIMD.Int8x16.extractLane(t, 1) <= SIMD.Int8x16.extractLane(other, 1);
    var cs2 =
        SIMD.Int8x16.extractLane(t, 2) <= SIMD.Int8x16.extractLane(other, 2);
    var cs3 =
        SIMD.Int8x16.extractLane(t, 3) <= SIMD.Int8x16.extractLane(other, 3);
    var cs4 =
        SIMD.Int8x16.extractLane(t, 4) <= SIMD.Int8x16.extractLane(other, 4);
    var cs5 =
        SIMD.Int8x16.extractLane(t, 5) <= SIMD.Int8x16.extractLane(other, 5);
    var cs6 =
        SIMD.Int8x16.extractLane(t, 6) <= SIMD.Int8x16.extractLane(other, 6);
    var cs7 =
        SIMD.Int8x16.extractLane(t, 7) <= SIMD.Int8x16.extractLane(other, 7);
    var cs8 =
        SIMD.Int8x16.extractLane(t, 8) <= SIMD.Int8x16.extractLane(other, 8);
    var cs9 =
        SIMD.Int8x16.extractLane(t, 9) <= SIMD.Int8x16.extractLane(other, 9);
    var cs10 =
        SIMD.Int8x16.extractLane(t, 10) <= SIMD.Int8x16.extractLane(other, 10);
    var cs11 =
        SIMD.Int8x16.extractLane(t, 11) <= SIMD.Int8x16.extractLane(other, 11);
    var cs12 =
        SIMD.Int8x16.extractLane(t, 12) <= SIMD.Int8x16.extractLane(other, 12);
    var cs13 =
        SIMD.Int8x16.extractLane(t, 13) <= SIMD.Int8x16.extractLane(other, 13);
    var cs14 =
        SIMD.Int8x16.extractLane(t, 14) <= SIMD.Int8x16.extractLane(other, 14);
    var cs15 =
        SIMD.Int8x16.extractLane(t, 15) <= SIMD.Int8x16.extractLane(other, 15);
    return SIMD.Bool8x16(cs0, cs1, cs2, cs3, cs4, cs5, cs6, cs7,
                         cs8, cs9, cs10, cs11, cs12, cs13, cs14, cs15);
  }
}

if (typeof SIMD.Int8x16.shiftLeftByScalar === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {integer} bits Bit count to shift by.
    * @return {Int8x16} lanes in a shifted by bits.
    */
  SIMD.Int8x16.shiftLeftByScalar = function(a, bits) {
    a = SIMD.Int8x16.check(a);
    if (bits>>>0 > 8)
      bits = 8;
    var s0 = SIMD.Int8x16.extractLane(a, 0) << bits;
    var s1 = SIMD.Int8x16.extractLane(a, 1) << bits;
    var s2 = SIMD.Int8x16.extractLane(a, 2) << bits;
    var s3 = SIMD.Int8x16.extractLane(a, 3) << bits;
    var s4 = SIMD.Int8x16.extractLane(a, 4) << bits;
    var s5 = SIMD.Int8x16.extractLane(a, 5) << bits;
    var s6 = SIMD.Int8x16.extractLane(a, 6) << bits;
    var s7 = SIMD.Int8x16.extractLane(a, 7) << bits;
    var s8 = SIMD.Int8x16.extractLane(a, 8) << bits;
    var s9 = SIMD.Int8x16.extractLane(a, 9) << bits;
    var s10 = SIMD.Int8x16.extractLane(a, 10) << bits;
    var s11 = SIMD.Int8x16.extractLane(a, 11) << bits;
    var s12 = SIMD.Int8x16.extractLane(a, 12) << bits;
    var s13 = SIMD.Int8x16.extractLane(a, 13) << bits;
    var s14 = SIMD.Int8x16.extractLane(a, 14) << bits;
    var s15 = SIMD.Int8x16.extractLane(a, 15) << bits;
    return SIMD.Int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                        s8, s9, s10, s11, s12, s13, s14, s15);
  }
}

if (typeof SIMD.Int8x16.shiftRightLogicalByScalar === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {integer} bits Bit count to shift by.
    * @return {Int8x16} lanes in a shifted by bits.
    */
  SIMD.Int8x16.shiftRightLogicalByScalar = function(a, bits) {
    a = SIMD.Int8x16.check(a);
    if (bits>>>0 > 8)
      bits = 8;
    var s0 = (SIMD.Int8x16.extractLane(a, 0) & 0xff) >>> bits;
    var s1 = (SIMD.Int8x16.extractLane(a, 1) & 0xff) >>> bits;
    var s2 = (SIMD.Int8x16.extractLane(a, 2) & 0xff) >>> bits;
    var s3 = (SIMD.Int8x16.extractLane(a, 3) & 0xff) >>> bits;
    var s4 = (SIMD.Int8x16.extractLane(a, 4) & 0xff) >>> bits;
    var s5 = (SIMD.Int8x16.extractLane(a, 5) & 0xff) >>> bits;
    var s6 = (SIMD.Int8x16.extractLane(a, 6) & 0xff) >>> bits;
    var s7 = (SIMD.Int8x16.extractLane(a, 7) & 0xff) >>> bits;
    var s8 = (SIMD.Int8x16.extractLane(a, 8) & 0xff) >>> bits;
    var s9 = (SIMD.Int8x16.extractLane(a, 9) & 0xff) >>> bits;
    var s10 = (SIMD.Int8x16.extractLane(a, 10) & 0xff) >>> bits;
    var s11 = (SIMD.Int8x16.extractLane(a, 11) & 0xff) >>> bits;
    var s12 = (SIMD.Int8x16.extractLane(a, 12) & 0xff) >>> bits;
    var s13 = (SIMD.Int8x16.extractLane(a, 13) & 0xff) >>> bits;
    var s14 = (SIMD.Int8x16.extractLane(a, 14) & 0xff) >>> bits;
    var s15 = (SIMD.Int8x16.extractLane(a, 15) & 0xff) >>> bits;
    return SIMD.Int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                        s8, s9, s10, s11, s12, s13, s14, s15);
  }
}

if (typeof SIMD.Int8x16.shiftRightArithmeticByScalar === "undefined") {
  /**
    * @param {Int8x16} a An instance of Int8x16.
    * @param {integer} bits Bit count to shift by.
    * @return {Int8x16} lanes in a shifted by bits.
    */
  SIMD.Int8x16.shiftRightArithmeticByScalar = function(a, bits) {
    a = SIMD.Int8x16.check(a);
    if (bits>>>0 > 8)
      bits = 8;
    var s0 = SIMD.Int8x16.extractLane(a, 0) >> bits;
    var s1 = SIMD.Int8x16.extractLane(a, 1) >> bits;
    var s2 = SIMD.Int8x16.extractLane(a, 2) >> bits;
    var s3 = SIMD.Int8x16.extractLane(a, 3) >> bits;
    var s4 = SIMD.Int8x16.extractLane(a, 4) >> bits;
    var s5 = SIMD.Int8x16.extractLane(a, 5) >> bits;
    var s6 = SIMD.Int8x16.extractLane(a, 6) >> bits;
    var s7 = SIMD.Int8x16.extractLane(a, 7) >> bits;
    var s8 = SIMD.Int8x16.extractLane(a, 8) >> bits;
    var s9 = SIMD.Int8x16.extractLane(a, 9) >> bits;
    var s10 = SIMD.Int8x16.extractLane(a, 10) >> bits;
    var s11 = SIMD.Int8x16.extractLane(a, 11) >> bits;
    var s12 = SIMD.Int8x16.extractLane(a, 12) >> bits;
    var s13 = SIMD.Int8x16.extractLane(a, 13) >> bits;
    var s14 = SIMD.Int8x16.extractLane(a, 14) >> bits;
    var s15 = SIMD.Int8x16.extractLane(a, 15) >> bits;
    return SIMD.Int8x16(s0, s1, s2, s3, s4, s5, s6, s7,
                        s8, s9, s10, s11, s12, s13, s14, s15);
  }
}

if (typeof SIMD.Int8x16.load === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @return {Int8x16} New instance of Int8x16.
    */
  SIMD.Int8x16.load = function(tarray, index) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    var i8temp = _i8x16;
    var array = bpe == 1 ? i8temp :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      array[i] = tarray[index + i];
    return SIMD.Int8x16(i8temp[0], i8temp[1], i8temp[2], i8temp[3],
                        i8temp[4], i8temp[5], i8temp[6], i8temp[7],
                        i8temp[8], i8temp[9], i8temp[10], i8temp[11],
                        i8temp[12], i8temp[13], i8temp[14], i8temp[15]);
  }
}

if (typeof SIMD.Int8x16.store === "undefined") {
  /**
    * @param {Typed array} tarray An instance of a typed array.
    * @param {Number} index An instance of Number.
    * @param {Int8x16} value An instance of Int8x16.
    * @return {Int8x16} value
    */
  SIMD.Int8x16.store = function(tarray, index, value) {
    if (!isTypedArray(tarray))
      throw new TypeError("The 1st argument must be a typed array.");
    if (!isInt32(index))
      throw new TypeError("The 2nd argument must be an Int32.");
    var bpe = tarray.BYTES_PER_ELEMENT;
    if (index < 0 || (index * bpe + 16) > tarray.byteLength)
      throw new RangeError("The value of index is invalid.");
    value = SIMD.Int8x16.check(value);
    _i8x16[0] = SIMD.Int8x16.extractLane(value, 0);
    _i8x16[1] = SIMD.Int8x16.extractLane(value, 1);
    _i8x16[2] = SIMD.Int8x16.extractLane(value, 2);
    _i8x16[3] = SIMD.Int8x16.extractLane(value, 3);
    _i8x16[4] = SIMD.Int8x16.extractLane(value, 4);
    _i8x16[5] = SIMD.Int8x16.extractLane(value, 5);
    _i8x16[6] = SIMD.Int8x16.extractLane(value, 6);
    _i8x16[7] = SIMD.Int8x16.extractLane(value, 7);
    _i8x16[8] = SIMD.Int8x16.extractLane(value, 8);
    _i8x16[9] = SIMD.Int8x16.extractLane(value, 9);
    _i8x16[10] = SIMD.Int8x16.extractLane(value, 10);
    _i8x16[11] = SIMD.Int8x16.extractLane(value, 11);
    _i8x16[12] = SIMD.Int8x16.extractLane(value, 12);
    _i8x16[13] = SIMD.Int8x16.extractLane(value, 13);
    _i8x16[14] = SIMD.Int8x16.extractLane(value, 14);
    _i8x16[15] = SIMD.Int8x16.extractLane(value, 15);
    var array = bpe == 1 ? _i8x16 :
                bpe == 2 ? _i16x8 :
                bpe == 4 ? (tarray instanceof Float32Array ? _f32x4 : _i32x4) :
                _f64x2;
    var n = 16 / bpe;
    for (var i = 0; i < n; ++i)
      tarray[index + i] = array[i];
    return value;
  }
}

};

},{}],8:[function(require,module,exports){
module.exports={
  "name": "vector_math.js",
  "version": "0.0.1",
  "description": "A Vector math library for 3D and 2D applications",
  "author": "jean Grizet <jean.grizet@gmail.com>",
  "license": "MIT",
  "keywords": [
    "vector_math", "vector_math.js",
    "vector", "matrix", "3d",
    "math", "aabb", "quaternion"
  ],
  "main": "src/vector_math.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/Tezirg/vector_math.js.git"
  },
  "scripts": {
    "test": "grunt test",
	"build": "grunt build"
  },
  "devDependencies": {
    "jshint": "latest",
    "uglify-js": "latest",
    "nodeunit": "latest",
    "grunt": "latest",
    "grunt-contrib-jshint": "latest",
    "grunt-contrib-nodeunit": "latest",
    "grunt-contrib-concat": "latest",
    "grunt-contrib-uglify": "latest",
    "grunt-contrib-yuidoc": "latest",
    "grunt-browserify": "latest",
    "browserify": "latest",
    "simd": "latest"
  }
}

},{}],9:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */

module.exports = Aabb3;

var Vector3 = require('./vector3.js');
var Triangle = require('./triangle.js');
var Sphere = require('./sphere.js');
var Quad = require('./quad.js');
var Ray = require('./ray.js');
var Plane = require('./plane.js');

/**
 * @class Aabb3
 * @description Defines a 3-dimensional axis-aligned bounding box between a [min] and a [max] position.
 * @constructor
 */
function Aabb3() {
    /**
     * @property min
     * @type {Vector3}
     */
    this.min = Vector3.zero();

    /**
     * @property max
     * @type {Vector3}
     */
    this.max = Vector3.zero();
}

/**
 * @method center
 * @description The center of the AABB.
 * @return {Vector3}
 */
Aabb3.prototype.__defineGetter__("center", function() {
    var center = this.min.clone();
    center.add(this.max);
    center.scale(0.5);
    return center;
});


/**
 * @static copy
 * @description Create a new AABB as a copy of [other].
 * @param other {Aabb3}
 * @return {Aabb3}
 */
Aabb3.copy = function(other) {
    var bb = new Aabb3();
    bb.min.setFrom(other.min);
    bb.max.setFrom(other.max);
    return bb;
};

/**
 * @static minMax
 * @description Create a new AABB with a [min] and [max].
 * @param min {Vector3}
 * @param max {Vector3}
 * @return {Aabb3}
 */
Aabb3.minMax = function(min,  max) {
    var bb = new Aabb3();
    bb.min.setFrom(min);
    bb.max.setFrom(max);
    return bb;
};

/**
 * @static fromSphere
 * @description Create a new AABB that encloses a [sphere].
 * @param sphere {Sphere}
 * @return {Aabb3}
 */
Aabb3.fromSphere = function(sphere) {
    var bb = new Aabb3();
    bb.setSphere(sphere);
    return bb;
};

/**
 * @static fromTriangle
 * @description Create a new AABB that encloses a [triangle].
 * @param triangle {Triangle}
 * @return {Aabb3}
 */
Aabb3.fromTriangle = function(triangle) {
    var bb = new Aabb3();
    bb.setTriangle(triangle);
    return bb;
};

/**
 * @static fromQuad
 * @description Create a new AABB that encloses a [quad].
 * @param quad {Quad}
 * @return {Aabb3}
 */
Aabb3.fromQuad = function(quad) {
    var bb = new Aabb3();
    bb.setQuad(quad);
    return bb;
};


/**
 * @static fromRay
 * @description Create a new AABB that encloses a limited [ray] (or line segment) that has
 * a minLimit and maxLimit.
 * @param ray {Ray}
 * @param limitMin {number}
 * @param limitMax {number}
 * @return {Aabb3}
 */
Aabb3.fromRay = function(ray, limitMin, limitMax) {
    var bb = new Aabb3();
    bb.setRay(ray, limitMin, limitMax);
    return bb;
};


/**
 * @static centerAndHalfExtends
 * @description Create a new AABB with a [center] and [halfExtents].
 * @param center {Vector3}
 * @param halfExtents {Vector3}
 * @return {Aabb3}
 */
Aabb3.centerAndHalfExtents = function(center, halfExtents) {
    var bb = new Aabb3();
    bb.setCenterAndHalfExtents(center, halfExtents);
    return bb;
};


/**
 * @static fromBuffer
 * @description Constructs [Aabb3] with a min/max [storage] that views given [buffer]
 * starting at [offset]. [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @return {Aabb3}
 */
Aabb3.fromBuffer = function(buffer, offset) {
    var bb = new Aabb3();
    bb.min = Vector3.fromBuffer(buffer, offset);
    bb.max = Vector3.fromBuffer(buffer, offset + Float32Array.BYTES_PER_ELEMENT * 3);
    return bb;
};

/**
 * @method setCenterAndHalfExtends
 * @description Set the AABB by a [center] and [halfExtents].
 * @param center {Vector3}
 * @param halfExtents {Vector3}
 */
Aabb3.prototype.setCenterAndHalfExtents = function(center, halfExtents) {
    this.min.setFrom(center);
    this.min.sub(halfExtents);
    this.max.setFrom(center);
    this.max.add(halfExtents);
};


/**
 * @method setSphere
 * @description Set the AABB to enclose a [sphere].
 * @param sphere {Sphere}
 */
Aabb3.prototype.setSphere = function(sphere) {
    this.min.splat(- (sphere.radius) );
    this.min.add(sphere.center);

    this.max.splat(sphere.radius);
    this.max.add(sphere.center);
};

/**
 * @method setTriangle
 * @description Set the AABB to enclose a [triangle].
 * @param triangle {Triangle}
 */
Aabb3.prototype.setTriangle = function(triangle) {
    this.min.setValues(
        Math.min(triangle.point0.x,
            Math.min(triangle.point1.x, triangle.point2.x)),
        Math.min(triangle.point0.y,
            Math.min(triangle.point1.y, triangle.point2.y)),
        Math.min(triangle.point0.z,
            Math.min(triangle.point1.z, triangle.point2.z)));
    this.max.setValues(
        Math.max(triangle.point0.x,
            Math.max(triangle.point1.x, triangle.point2.x)),
        Math.max(triangle.point0.y,
            Math.max(triangle.point1.y, triangle.point2.y)),
        Math.max(triangle.point0.z,
            Math.max(triangle.point1.z, triangle.point2.z)));
};

/**
 * @method setQuad
 * @description Set the AABB to enclose a [quad].
 * @param quad {Quad}
 */
Aabb3.prototype.setQuad = function(quad) {
    this.min.setValues(
        Math.min(quad.point0.x,
            Math.min(quad.point1.x, Math.min(quad.point2.x, quad.point3.x))),
        Math.min(quad.point0.y,
            Math.min(quad.point1.y, Math.min(quad.point2.y, quad.point3.y))),
        Math.min(
            quad.point0.z,
            Math.min(
                quad.point1.z, Math.min(quad.point2.z, quad.point3.z))));
    this.max.setValues(
        Math.max(quad.point0.x,
            Math.max(quad.point1.x, Math.max(quad.point2.x, quad.point3.x))),
        Math.max(quad.point0.y,
            Math.max(quad.point1.y, Math.max(quad.point2.y, quad.point3.y))),
        Math.max(
            quad.point0.z,
            Math.max(
                quad.point1.z, Math.max(quad.point2.z, quad.point3.z))));
};


/**
 * @method setRay
 * @description Set the AABB to enclose a limited [ray] (or line segment) that is limited by [limitMin] and [limitMax].
 * @param ray {Ray}
 * @param limitMin {number}
 * @param limitMax {number}
 */
Aabb3.prototype.setRay = function(ray, limitMin, limitMax) {
    ray.copyAt(this.min, limitMin);
    ray.copyAt(this.max, limitMax);

    if (this.max.x < this.min.x) {
        var temp = this.max.x;
        this.max.x = this.min.x;
        this.min.x = temp;
    }

    if (this.max.y < this.min.y) {
        temp = this.max.y;
        this.max.y = this.min.y;
        this.min.y = temp;
    }

    if (this.max.z < this.min.z) {
        temp = this.max.z;
        this.max.z = this.min.z;
        this.min.z = temp;
    }
};

/**
 * @method copyCenterAndHalfExtends
 * @description Copy the [center] and the [halfExtends] of [this].
 * @param center {Vector3}
 * @param halfExtents {Vector3}
 */
Aabb3.prototype.copyCenterAndHalfExtents = function(center, halfExtents) {
    center.setFrom(this.min);
    center.add(this.max);
    center.scale(0.5);

    halfExtents.setFrom(this.max);
    halfExtents.sub(this.min);
    halfExtents.scale(0.5);
};

/**
 * @method copyCenter
 * @description Copy the [center] of [this].
 * @param center {Vector3}
 */
Aabb3.prototype.copyCenter = function(center) {
    center.setFrom(this.min);
    center.add(this.max);
    center.scale(0.5);
};

/**
 * @method copyFrom
 * @description Copy the [min] and [max] from [other] into [this].
 * @param other {Aabb3}
 */
Aabb3.prototype.copyFrom = function(other) {
    this.min.setFrom(other.min);
    this.max.setFrom(other.max);
};

/**
 * @method transform
 * @description Transform [this] by the transform [t].
 * @param t {Matrix4}
 * @return {Aabb3}
 */
Aabb3.prototype.transform = function(t) {
    var center = Vector3.zero();
    var halfExtents = Vector3.zero();
    this.copyCenterAndHalfExtents(center, halfExtents);
    t.transform3(center);
    t.absoluteRotate(halfExtents);
    this.min.setFrom(center);
    this.min.sub(halfExtents);

    this.max.setFrom(center);
    this.max.add(halfExtents);
    return this;
};

/**
 * @method rotate
 * @description Rotate [this] by the rotation matrix [t].
 * @param t {Matrix4}
 * @return {Aabb3}
 */
Aabb3.prototype.rotate = function(t) {
    var center = Vector3.zero();
    var halfExtents = Vector3.zero();
    this.copyCenterAndHalfExtents(center, halfExtents);
    t.absoluteRotate(halfExtents);
    this.min.setFrom(center);
    this.min.sub(halfExtents);

    this.max.setFrom(center);
    this.max.add(halfExtents);
    return this;
};

/**
 * @method transformed
 * @description Create a copy of [this] that is transformed by the transform [t] and store it in [out].
 * @param t {Matrix4}
 * @param out {Aabb3}
 */
Aabb3.prototype.transformed = function(t, out) {
    out.copyFrom(this);
    out.transform(t);
};

/**
 * @method rotated
 * @description Create a copy of [this] that is rotated by the rotation matrix [t] and store it in [out].
 * @param t {Matrix4}
 * @param out {Aabb3}
 */
Aabb3.prototype.rotated = function(t, out) {
    out.copyFrom(this);
    out.rotate(t);
};

Aabb3.prototype.getPN = function(planeNormal, outP, outN) {
    if (planeNormal.x < 0.0) {
        outP.x = this.min.x;
        outN.x = this.max.x;
    } else {
        outP.x = this.max.x;
        outN.x = this.min.x;
    }

    if (planeNormal.y < 0.0) {
        outP.y = this.min.y;
        outN.y = this.max.y;
    } else {
        outP.y = this.max.y;
        outN.y = this.min.y;
    }

    if (planeNormal.z < 0.0) {
        outP.z = this.min.z;
        outN.z = this.max.z;
    } else {
        outP.z = this.max.z;
        outN.z = this.min.z;
    }
};

/**
 * @method hull
 * @description Set the min and max of [this] so that [this] is a hull of [this] and [other].
 * @param other {Aabb3}
 */
Aabb3.prototype.hull = function(other) {
    Vector3.min(this.min, other.min, this.min);
    Vector3.max(this.max, other.max, this.max);
};

/**
 * @method hullPoint
 * @description Set the min and max of [this] so that [this] contains [point].
 * @param point {Vector3}
 */
Aabb3.prototype.hullPoint = function(point) {
    Vector3.min(this.min, point, this.min);
    Vector3.max(this.max, point, this.max);
};

/**
 * @method containsAabb3
 * @description Return if [this] contains [other].
 * @param other {Aabb3}
 * @return {boolean}
 */
Aabb3.prototype.containsAabb3 = function(other) {
    var otherMax = other.max;
    var otherMin = other.min;

    return (this.min.x < otherMin.x) &&
           (this.min.y < otherMin.y) &&
           (this.min.z < otherMin.z) &&
           (this.max.x > otherMax.x) &&
           (this.max.y > otherMax.y) &&
           (this.max.z > otherMax.z);
};

/**
 * @method containsSphere
 * @description Return if [this] contains [other].
 * @param other {Sphere}
 * @return {boolean}
 */
Aabb3.prototype.containsSphere = function(other) {
    var boxExtends = Vector3.all(other.radius);
    var sphereBox = Aabb3.centerAndHalfExtents(other.center, boxExtends);

    return this.containsAabb3(sphereBox);
};

/**
 * @method containsVector3
 * @description Return if [this] contains [other].
 * @param other {Vector3}
 * @return {boolean}
 */
Aabb3.prototype.containsVector3 = function(other) {
    return (this.min.x < other.x) &&
        (this.min.y < other.y) &&
        (this.min.z < other.z) &&
        (this.max.x > other.x) &&
        (this.max.y > other.y) &&
        (this.max.z > other.z);
};

/**
 * @method containsTriangle
 * @description Return if [this] contains [other].
 * @param other {Triangle}
 * @return {boolean}
 */
Aabb3.prototype.containsTriangle = function(other) {
    return (this.containsVector3(other.point0) &&
            this.containsVector3(other.point1) &&
            this.containsVector3(other.point2));
};

/**
 * @method intersectsWithAabb3
 * @description Return if [this] intersects with [other].
 * @param other {Aabb3}
 * @return {boolean}
 */
Aabb3.prototype.intersectsWithAabb3 = function(other) {
    var otherMax = other.max;
    var otherMin = other.min;

    return (this.min.x <= otherMax.x) &&
        (this.min.y <= otherMax.y) &&
        (this.min.z <= otherMax.z) &&
        (this.max.x >= otherMin.x) &&
        (this.max.y >= otherMin.y) &&
        (this.max.z >= otherMin.z);
};

/**
 * @method intersectsWithSphere
 * @description Return if [this] intersects with [other].
 * @param other {Sphere}
 * @return {boolean}
 */
Aabb3.prototype.intersectsWithSphere = function(other) {
    var center = other.center;
    var radius = other.radius;
    var d = 0.0;
    var e = 0.0;

    for (var i = 0; i < 3; ++i) {
        if ((e = center.storage[i] - this.min.storage[i]) < 0.0) {
            if (e < -radius) {
                return false;
            }

            d = d + e * e;
        } else {
            if ((e = center.storage[i] - this.max.storage[i]) > 0.0) {
                if (e > radius) {
                    return false;
                }

                d = d + e * e;
            }
        }
    }

    return d <= radius * radius;
};

/**
 * @method intersectsWithVector3
 * @description Return if [this] intersects with [other].
 * @param other {Vector3}
 * @return {boolean}
 */
Aabb3.prototype.intersectsWithVector3 = function(other) {
    return (this.min.x <= other.x) &&
        (this.min.y <= other.y) &&
        (this.min.z <= other.z) &&
        (this.max.x >= other.x) &&
        (this.max.y >= other.y) &&
        (this.max.z >= other.z);
};

// Avoid allocating these instance on every call to intersectsWithTriangle
var _aabbCenter = Vector3.zero();
var _aabbHalfExtents = Vector3.zero();
var _v0 = Vector3.zero();
var _v1 = Vector3.zero();
var _v2 = Vector3.zero();
var _f0 = Vector3.zero();
var _f1 = Vector3.zero();
var _f2 = Vector3.zero();
var _trianglePlane = new Plane();

/**
 * @method intersectsWithTriangle
 * @description Return if [this] intersects with [other].
 * @param other {Triangle}
 * @return {boolean}
 */
Aabb3.prototype.intersectsWithTriangle = function(other) {
    var epsilon = Number.EPSILON;
    var p0, p1, p2, r, len;

    // This line isn't required if we are using center and half extents to
    // define a aabb
    this.copyCenterAndHalfExtents(_aabbCenter, _aabbHalfExtents);

    // Translate triangle as conceptually moving AABB to origin
    _v0.setFrom(other.point0);
    _v0.sub(_aabbCenter);
    _v1.setFrom(other.point1);
    _v1.sub(_aabbCenter);
    _v2.setFrom(other.point2);
    _v2.sub(_aabbCenter);

    // Translate triangle as conceptually moving AABB to origin
    _f0.setFrom(_v1);
    _f0.sub(_v0);
    _f1.setFrom(_v2);
    _f1.sub(_v1);
    _f2.setFrom(_v0);
    _f2.sub(_v2);

    // Test axes a00..a22 (category 3)
    // Test axis a00
    len = _f0.y * _f0.y + _f0.z * _f0.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.z * _f0.y - _v0.y * _f0.z;
        p2 = _v2.z * _f0.y - _v2.y * _f0.z;
        r = _aabbHalfExtents.storage[1] * Math.abs(_f0.z) + _aabbHalfExtents.storage[2] * Math.abs(_f0.y);
        if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a01
    len = _f1.y * _f1.y + _f1.z * _f1.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.z * _f1.y - _v0.y * _f1.z;
        p1 = _v1.z * _f1.y - _v1.y * _f1.z;
        r = _aabbHalfExtents.storage[1] * Math.abs(_f1.z) + _aabbHalfExtents.storage[2] * Math.abs(_f1.y);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a02
    len = _f2.y * _f2.y + _f2.z * _f2.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.z * _f2.y - _v0.y * _f2.z;
        p1 = _v1.z * _f2.y - _v1.y * _f2.z;
        r = _aabbHalfExtents.storage[1] * Math.abs(_f2.z) + _aabbHalfExtents.storage[2] * Math.abs(_f2.y);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a10
    len = _f0.x * _f0.x + _f0.z * _f0.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.x * _f0.z - _v0.z * _f0.x;
        p2 = _v2.x * _f0.z - _v2.z * _f0.x;
        r = _aabbHalfExtents.storage[0] * Math.abs(_f0.z) + _aabbHalfExtents.storage[2] * Math.abs(_f0.x);
        if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a11
    len = _f1.x * _f1.x + _f1.z * _f1.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.x * _f1.z - _v0.z * _f1.x;
        p1 = _v1.x * _f1.z - _v1.z * _f1.x;
        r = _aabbHalfExtents.storage[0] * Math.abs(_f1.z) + _aabbHalfExtents.storage[2] * Math.abs(_f1.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a12
    len = _f2.x * _f2.x + _f2.z * _f2.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.x * _f2.z - _v0.z * _f2.x;
        p1 = _v1.x * _f2.z - _v1.z * _f2.x;
        r = _aabbHalfExtents.storage[0] * Math.abs(_f2.z) + _aabbHalfExtents.storage[2] * Math.abs(_f2.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }
    }

    // Test axis a20
    len = _f0.x * _f0.x + _f0.y * _f0.y;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.y * _f0.x - _v0.x * _f0.y;
        p2 = _v2.y * _f0.x - _v2.x * _f0.y;
        r = _aabbHalfExtents.storage[0] * Math.abs(_f0.y) + _aabbHalfExtents.storage[1] * Math.abs(_f0.x);
        if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a21
    len = _f1.x * _f1.x + _f1.y * _f1.y;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.y * _f1.x - _v0.x * _f1.y;
        p1 = _v1.y * _f1.x - _v1.x * _f1.y;
        r = _aabbHalfExtents.storage[0] * Math.abs(_f1.y) + _aabbHalfExtents.storage[1] * Math.abs(_f1.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a22
    len = _f2.x * _f2.x + _f2.y * _f2.y;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.y * _f2.x - _v0.x * _f2.y;
        p1 = _v1.y * _f2.x - _v1.x * _f2.y;
        r = _aabbHalfExtents.storage[0] * Math.abs(_f2.y) + _aabbHalfExtents.storage[1] * Math.abs(_f2.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test the three axes corresponding to the face normals of AABB b (category 1). // Exit if...
    // ... [-e0, e0] and [min(v0.x,v1.x,v2.x), max(v0.x,v1.x,v2.x)] do not overlap
    if (Math.max(_v0.x, Math.max(_v1.x, _v2.x)) < -_aabbHalfExtents.storage[0] ||
        Math.min(_v0.x, Math.min(_v1.x, _v2.x)) > _aabbHalfExtents.storage[0]) {
        return false;
    }

    // ... [-e1, e1] and [min(v0.y,v1.y,v2.y), max(v0.y,v1.y,v2.y)] do not overlap
    if (Math.max(_v0.y, Math.max(_v1.y, _v2.y)) < -_aabbHalfExtents.storage[1] ||
        Math.min(_v0.y, Math.min(_v1.y, _v2.y)) > _aabbHalfExtents.storage[1]) {
        return false;
    }

    // ... [-e2, e2] and [min(v0.z,v1.z,v2.z), max(v0.z,v1.z,v2.z)] do not overlap
    if (Math.max(_v0.z, Math.max(_v1.z, _v2.z)) < -_aabbHalfExtents.storage[2] ||
        Math.min(_v0.z, Math.min(_v1.z, _v2.z)) > _aabbHalfExtents.storage[2]) {
        return false;
    }

    // It seems like that wee need to move the edges before creating the
    // plane
    _v0.add(_aabbCenter);

    // Test separating axis corresponding to triangle face normal (category 2)
    _trianglePlane.normal = _f0.cross(_f1);
    _trianglePlane.constant = _trianglePlane.normal.dot(_v0);
    return this.intersectsWithPlane(_trianglePlane);
};

/**
 * @method intersectsWithPlane
 * @description  Return if [this] intersects with [other]
 * @param other {Plane}
 * @return {boolean}
 */
Aabb3.prototype.intersectsWithPlane = function(other) {
    // This line is not necessary with a (center, extents) AABB representation
    this.copyCenterAndHalfExtents(_aabbCenter, _aabbHalfExtents);

    // Compute the projection interval radius of b onto L(t) = b.c + t * p.n
    var r = _aabbHalfExtents.storage[0] * Math.abs(other.normal.storage[0]) +
    _aabbHalfExtents.storage[1] * Math.abs(other.normal.storage[1]) +
    _aabbHalfExtents.storage[2] * Math.abs(other.normal.storage[2]);
    // Compute distance of box center from plane
    var s = other.normal.dot(_aabbCenter) - other.constant;
    // Intersection occurs when distance s falls within [-r,+r] interval
    if (Math.abs(s) <= r) {
        return true;
    }

    return false;
};

// Avoid allocating these instance on every call to intersectsWithTriangle
var _quadTriangle0 = new Triangle();
var _quadTriangle1 = new Triangle();

/**
 * @method intersectsWithQuad
 * @description Return if [this] intersects with [other].
 * @param other {Quad}
 * @return {boolean}
 */
Aabb3.prototype.intersectsWithQuad = function(other) {
    other.copyTriangles(_quadTriangle0, _quadTriangle1);

    return this.intersectsWithTriangle(_quadTriangle0) ||
           this.intersectsWithTriangle(_quadTriangle1);
};
},{"./plane.js":14,"./quad.js":15,"./ray.js":17,"./sphere.js":18,"./triangle.js":19,"./vector3.js":21}],10:[function(require,module,exports){

module.exports = vector_math;

var SIMD = require("simd");

function vector_math() {}

vector_math.EPSILON = typeof Number.EPSILON !== undefined ? Number.EPSILON : 1e-6;
vector_math.RANDOM = Math.random;
vector_math.ENABLE_SIMD =  false;
vector_math.SIMD_AVAILABLE = typeof SIMD !== undefined;
vector_math.USE_SIMD = function() { return vector_math.ENABLE_SIMD && vector_math.SIMD_AVAILABLE };
},{"simd":6}],11:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix2;

var Vector2 = require('./vector2.js');

/**
 * @class Matrix2
 * @description 2D Matrix. Values are stored in column major order.
 * @param m00 {number}
 * @param m01 {number}
 * @param m11 {number}
 * @param m12 {number}
 * @constructor
 */
function Matrix2(m00, m01, m11, m12) {
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([m00, m01, m11, m12]);

    /**
     * @property dimension
     * @type {number}
     */
    this.dimension = 2;
}

/**
 * @static fromFloat32Array
 * @description Constructs Matrix2 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Matrix2}
 */
Matrix2.fromFloat32Array = function(array) {
    var m = Matrix2.zero();
    m.storage = array;
    return m;
};

/**
 * @static fromBuffer
 * @description Constructs Matrix2 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32List.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 */
Matrix2.fromBuffer = function(buffer, offset) {
    var m = Matrix2.zero();
    m.storage = new Float32Array(buffer, offset, 4);
    return m.clone();
};

/**
 * @static solve
 * @description Solve [A] * [x] = [b].
 * @param A {Matrix2}
 * @param x {Vector2}
 * @param b {Vector2}
 */
Matrix2.solve = function(A, x, b) {
    var a11 = A.entry(0, 0);
    var a12 = A.entry(0, 1);
    var a21 = A.entry(1, 0);
    var a22 = A.entry(1, 1);
    var bx = b.x;
    var by = b.y;
    var det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
        det = 1.0 / det;
    }

    x.x = det * (a22 * bx - a12 * by);
    x.y = det * (a11 * by - a21 * bx);
};

/**
 * @description Return index in storage for [row], [col] value.
 * @method index
 * @param row
 * @param col
 */
Matrix2.prototype.index = function(row, col) {
    return (col * 2) + row;
};


/**
 * @method entry
 * @description Value at [row], [col].
 * @param row {Number}
 * @param col {Number}
 * @return {Number | null}
 */
Matrix2.prototype.entry = function(row, col) {
    if (((row >= 0) && (row < this.dimension)) == false) {
        return null;
    }
    if (((col >= 0) && (col <  this.dimension)) == false) {
        return null;
    }

    return this.storage[this.index(row, col)];
};

/**
 * @method setEntry
 * @description Set value at [row], [col] to be [v].
 * @param row {Number}
 * @param col {Number}
 * @param v {Number}
 * @return {null}
 */
Matrix2.prototype.setEntry = function(row, col, v) {
    if (((row >= 0) && (row < this.dimension)) == false) {
        return null;
    }
    if (((col >= 0) && (col <  this.dimension)) == false) {
        return null;
    }

    this.storage[this.index(row, col)] = v;
};

/**
 * @description Zero matrix.
 * @static zero
 * @return {Matrix2}
 */
Matrix2.zero = function() {
    var m = new Matrix2(0.0, 0.0, 0.0, 0.0);
    return m;
};

/**
 * @static identity
 * @description Identity matrix.
 * @return {Matrix2}
 */
Matrix2.identity = function() {
    var m = Matrix2.zero();
    m.setIdentity();
    return m;
};

/**
 * @static copy
 * @description Copies values from [other].
 * @param other {Matrix2}
 * @return {Matrix2}
 */
Matrix2.copy = function(other) {
    m = Matrix2.zero();
    m.setFrom(other);
    return m;
};


/**
 * @static columns
 * @description Matrix with values from column arguments.
 * @param arg0 {Vector2}
 * @param arg1 {Vector2}
 * @return {Matrix2}
 */
Matrix2.columns = function(arg0, arg1) {
    var m = Matrix2.zero();
    m.setColumns(arg0, arg1);
    return m;
};


/**
 * @static outer
 * @description Outer product of [u] and [v].
 * @param u {Vector2}
 * @param v {Vector2}
 * @return {Matrix2}
 */
Matrix2.outer = function(u, v) {
    var m = Matrix2.zero();
    m.setOuter(u, v);
    return m;
};


/**
 * @static rotation
 * @description Rotation of [radians].
 * @param radians {Number}
 * @return {Matrix2}
 */
Matrix2.rotation = function(radians) {
    var m = Matrix2.zero();
    m.setRotation(radians);
    return m;
};


/**
 * @method setValues
 * @description Sets the matrix with specified values.
 * @param arg0 {Number}
 * @param arg1 {Number}
 * @param arg2 {Number}
 * @param arg3 {Number}
 * @return {Matrix2}
 */
Matrix2.prototype.setValues = function(arg0, arg1, arg2, arg3) {
    this.storage[3] = arg3;
    this.storage[2] = arg2;
    this.storage[1] = arg1;
    this.storage[0] = arg0;
    return this;
};


/**
 * @method setColumns
 * @description Sets the entire matrix to the column values.
 * @param arg0 {Vector2}
 * @param arg1 {Vector2}
 * @returns {Matrix2}
 */
Matrix2.prototype.setColumns = function(arg0, arg1) {
    var arg0Storage = arg0.storage;
    var arg1Storage = arg1.storage;
    this.storage[0] = arg0Storage[0];
    this.storage[1] = arg0Storage[1];
    this.storage[2] = arg1Storage[0];
    this.storage[3] = arg1Storage[1];
    return this;
};


/**
 * @method setFrom
 * @description Sets the entire matrix to the matrix in [arg].
 * @param arg {Matrix2}
 * @returns {Matrix2}
 */
Matrix2.prototype.setFrom = function(arg) {
    this.storage[3] = arg.storage[3];
    this.storage[2] = arg.storage[2];
    this.storage[1] = arg.storage[1];
    this.storage[0] = arg.storage[0];
    return this;
};

/**
 * @method setOuter
 * @description  Set [this] to the outer product of [u] and [v].
 * @param u {Vector2}
 * @param v {Vector2}
 * @return {Matrix2}
 */
Matrix2.prototype.setOuter = function(u, v) {
    var uStorage = u.storage;
    var vStorage = v.storage;
    this.storage[0] = uStorage[0] * vStorage[0];
    this.storage[1] = uStorage[0] * vStorage[1];
    this.storage[2] = uStorage[1] * vStorage[0];
    this.storage[3] = uStorage[1] * vStorage[1];
    return this;
};


/**
 * @method splatDiagonal
 * @description Sets the diagonal to [arg].
 * @param arg {Number}
 * @return {Matrix2}
 */
Matrix2.prototype.splatDiagonal = function(arg) {
    this.storage[0] = arg;
    this.storage[3] = arg;
    return this;
};


/**
 * @method setDiagonal
 * @description Sets the diagonal of the matrix to be [arg].
 * @param arg {Vector2}
 * @return {Matrix2}
 */
Matrix2.prototype.setDiagonal = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = argStorage[0];
    this.storage[3] = argStorage[1];
    return this;
};


/**
 * @method toString
 * @description Printable string
 * @return {string}
 */
Matrix2.prototype.toString = function() {
    return '[0] '+ this.getRow(0).toString() + '\n[1] ' + this.getRow(1).toString() + '}\n';
};


/**
 * @method getAt
 * @description Access the element of the matrix at the index [i].
 * @param i {number}
 * @return {Number}
 */
Matrix2.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * @method setAt
 * @description Set the element of the matrix at the index [i].
 * @param i {number}
 * @param v {number}
 */
Matrix2.prototype.setAt = function(i, v) {
    this.storage[i] = v;
};

/**
 * @method equals
 * @description Check if two matrices are the same.
 * @param other {Matrix2}
 * @return {boolean}
 */
Matrix2.prototype.equals = function(other) {
    if (other.dimension == null || other.dimension != 2) {
        return false;
    }
    return (this.storage[0] == other.storage[0]) &&
           (this.storage[1] == other.storage[1]) &&
           (this.storage[2] == other.storage[2]) &&
           (this.storage[3] == other.storage[3]);
};

/**
 * @method almostEquals
 * @description Check if two matrices are almost the same.
 * @param other {Matrix2}
 * @param precision {number}
 * @return {boolean}
 */
Matrix2.prototype.almostEquals = function(other, precision) {
    if (other.dimension == null || other.dimension != 2) {
        return false;
    }
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if ((Math.abs(this.storage[0] - other.storage[0]) > precision) ||
        (Math.abs(this.storage[1] - other.storage[1]) > precision) ||
        (Math.abs(this.storage[2] - other.storage[2]) > precision) ||
        (Math.abs(this.storage[3] - other.storage[3]) > precision)) {
        return false;
    }
    return true;
};


/**
 * @property
 * row 0
 * @type {Vector2}
 */
Matrix2.prototype.__defineGetter__("row0", function() {
    return this.getRow(0);
});
Matrix2.prototype.__defineSetter__("row0", function(v) {
    this.setRow(0, v);
});

/**
 * @property
 * row 1
 * @type {Vector2}
 */
Matrix2.prototype.__defineGetter__("row1", function() {
    return this.getRow(1);
});
Matrix2.prototype.__defineSetter__("row1", function(v) {
    this.setRow(1, v);
});


/**
 * @method setRow
 * @description Sets [row] of the matrix to values in [arg]
 * @param row {Number}
 * @param arg {Vector2}
 */
Matrix2.prototype.setRow = function(row, arg) {
    argStorage = arg.storage;
    this.storage[this.index(row, 0)] = argStorage[0];
    this.storage[this.index(row, 1)] = argStorage[1];
};

/**
 * @method get Row
 * @description  Gets the [row] of the matrix
 * @param row {Number}
 * @return {Vector2}
 */
Matrix2.prototype.getRow = function(row) {
    var r = Vector2.zero();
    rStorage = r.storage;
    rStorage[0] = this.storage[this.index(row, 0)];
    rStorage[1] = this.storage[this.index(row, 1)];
    return r;
};

/**
 * @method setColumn
 * @description Assigns the [column] of the matrix [arg]
 * @param column {Number}
 * @param arg {Vector2}
 */
Matrix2.prototype.setColumn = function(column, arg) {
    argStorage = arg.storage;
    entry = column * 2;
    this.storage[entry + 1] = argStorage[1];
    this.storage[entry + 0] = argStorage[0];
};

/**
 * @method getColumn
 * @description Gets the [column] of the matrix
 * @param column {Number}
 * @return {Vector2}
 */
Matrix2.prototype.getColumn = function(column) {
    var r = Vector2.zero();
    entry = column * 2;
    var rStorage = r.storage;
    rStorage[1] = this.storage[entry + 1];
    rStorage[0] = this.storage[entry + 0];
    return r;
};

/**
 * @method clone
 * @description Create a copy of [this].
 * @return {Matrix2}
 */
Matrix2.prototype.clone = function() {
    return Matrix2.copy(this);
};

/**
 * @method copyInto
 * @description Copy [this] into [arg].
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.copyInto = function(arg) {
    var argStorage = arg.storage;
    argStorage[0] = this.storage[0];
    argStorage[1] = this.storage[1];
    argStorage[2] = this.storage[2];
    argStorage[3] = this.storage[3];
    return arg;
};

/**
 * @method mult
 * @description Returns a new vector or matrix by multiplying [this] with [arg].
 * @param arg
 * @return {*}
 */
Matrix2.prototype.mult = function(arg) {

    if (typeof arg == "Number") {
        return this.scaled(arg);
    }
    if (arg instanceof Vector2) {
        return this.transformed(arg);
    }
    if (arg.dimension == 2) {
        return this.multiplied(arg);
    }
    return null;
};

/**
 * @method added
 * @description Returns new matrix after component wise [this] + [arg]
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.added = function(arg) {
    var m = this.clone();
    m.add(arg);
    return m;
};

/**
 * @method subbed
 * @description Returns new matrix after component wise [this] - [arg]
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.subbed = function(arg) {
    var m = this.clone();
    m.sub(arg);
    return m;
};

/**
 * @method negated
 * @description Returns new matrix after negating [this]
 * @return {Matrix2}
 */
Matrix2.prototype.negated = function() {
    var m = this.clone();
    m.negate();
    return m;
};

/**
 * @method setZero
 * @description Zeros [this].
 * @return {Matrix2}
 */
Matrix2.prototype.setZero = function()  {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    return this;
};

/**
 * @method setIdentity
 * @description Makes [this] into the identity matrix.
 * @return {Matrix2}
 */
Matrix2.prototype.setIdentity = function () {
    this.storage[0] = 1.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 1.0;
    return this;
};

/**
 * @method transposed
 * @description Returns the tranpose of this.
 * @return {Matrix2}
 */
Matrix2.prototype.transposed = function() {
    var m = this.clone();
    m.transpose();
    return m;
};


/**
 * @method transpose
 * @description Transpose [this]
 * @return {Matrix2}
 */
Matrix2.prototype.transpose = function() {
    var temp = this.storage[2];
    this.storage[2] = this.storage[1];
    this.storage[1] = temp;
    return this;
};

/**
 * @method absolute
 * @description Returns the component wise absolute value copy of this.
 * @return {Matrix2}
 */
Matrix2.prototype.absolute = function() {
    var r = Matrix2.zero();
    var rStorage = r.storage;
    rStorage[0] = Math.abs(this.storage[0]);
    rStorage[1] = Math.abs(this.storage[1]);
    rStorage[2] = Math.abs(this.storage[2]);
    rStorage[3] = Math.abs(this.storage[3]);
    return r;
};

/**
 * @method determinant
 * @description  Returns the determinant of this matrix.
 * @return {number}
 */
Matrix2.prototype.determinant = function() {
    return (this.storage[0] * this.storage[3] - this.storage[1] * this.storage[2]);
};

/**
 * @method dotRow
 * @description  Returns the dot product of row [i] and [v].
 * @param i {Number}
 * @param v {Vector2}
 * @return {number}
 */
Matrix2.prototype.dotRow = function(i, v) {
    vStorage = v.storage;
    return this.storage[i] * vStorage[0] + this.storage[2 + i] * vStorage[1];
};

/**
 * @method dotColumn
 * @description Returns the dot product of column [j] and [v].
 * @param j {number}
 * @param v {Vector2}
 * @return {number}
 */
Matrix2.prototype.dotColumn = function(j, v) {
    vStorage = v.storage;
    return this.storage[j * 2] * vStorage[0] +
        this.storage[(j * 2) + 1] * vStorage[1];
};

/**
 * @method trace
 * @description Trace of the matrix.
 * @return {number}
 */
Matrix2.prototype.trace = function() {
    t = 0.0;
    t += this.storage[0];
    t += this.storage[3];
    return t;
};

/**
 * @method infinityNorm
 * @description Returns infinity norm of the matrix. Used for numerical analysis.
 * @return {number}
 */
Matrix2.prototype.infinityNorm = function() {
    norm = 0.0;
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[0]);
        row_norm += Math.abs(this.storage[1]);
        norm = row_norm > norm ? row_norm : norm;
    }
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[2]);
        row_norm += Math.abs(this.storage[3]);
        norm = row_norm > norm ? row_norm : norm;
    }
    return norm;
};

/**
 * @method relativeError
 * @description Returns relative error between [this] and [correct]
 * @param correct
 * @return {number}
 */
Matrix2.prototype.relativeError = function(correct) {
    diff = correct.subbed(this);
    correct_norm = correct.infinityNorm();
    diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
};

/**
 * @method absoluteError
 * @description Returns absolute error between [this] and [correct]
 * @param correct {Matrix2}
 * @return {number|*}
 */
Matrix2.prototype.absoluteError = function(correct) {
    this_norm = this.infinityNorm();
    correct_norm = correct.infinityNorm();
    diff_norm = Math.abs(this_norm - correct_norm);
    return diff_norm;
};

/**
 * @method invert
 * @description Invert the matrix. Returns the determinant.
 * @return {number}
 */
Matrix2.prototype.invert = function () {
    det = this.determinant();
    if (det == 0.0) {
        return 0.0;
    }
    invDet = 1.0 / det;
    var temp = this.storage[0];
    this.storage[0] = this.storage[3] * invDet;
    this.storage[1] = -this.storage[1] * invDet;
    this.storage[2] = -this.storage[2] * invDet;
    this.storage[3] = temp * invDet;
    return det;
};

/**
 * @method copyInverse
 * @description Set this matrix to be the inverse of [arg]
 * @param arg {Matrix2}
 * @return {number} determinant
 */
Matrix2.prototype.copyInverse = function(arg) {
    det = arg.determinant();
    if (det == 0.0) {
        this.setFrom(arg);
        return 0.0;
    }
    invDet = 1.0 / det;
    argStorage = arg.storage;
    this.storage[0] = argStorage[3] * invDet;
    this.storage[1] = -argStorage[1] * invDet;
    this.storage[2] = -argStorage[2] * invDet;
    this.storage[3] = argStorage[0] * invDet;
    return det;
};

/**
 * @method setRotation
 * @description Turns the matrix  o a rotation of [radians]
 * @param radians {number}
 */
Matrix2.prototype.setRotation = function(radians) {
    c = Math.cos(radians);
    s = Math.sin(radians);
    this.storage[0] = c;
    this.storage[1] = s;
    this.storage[2] = -s;
    this.storage[3] = c;
};

/**
 * @method scaleAdjoint
 * @description Converts  into Adjugate matrix and scales by [scale]
 * @param scale {number}
 * @return {Matrix2} this
 */
Matrix2.prototype.scaleAdjoint = function(scale) {
    var temp = this.storage[0];
    this.storage[0] = this.storage[3] * scale;
    this.storage[2] = -this.storage[2] * scale;
    this.storage[1] = -this.storage[1] * scale;
    this.storage[3] = temp * scale;
    return this;
};

/**
 * @method scale
 * @description Scale [this] by [scale].
 * @param scale {number}
 * @return {Matrix2} this
 */
Matrix2.prototype.scale = function(scale) {
    this.storage[0] = this.storage[0] * scale;
    this.storage[1] = this.storage[1] * scale;
    this.storage[2] = this.storage[2] * scale;
    this.storage[3] = this.storage[3] * scale;
    return this;
};

/**
 * @method scaled
 * @description Create a copy of [this] scaled by [scale].
 * @param scale {number}
 * @return {Matrix2} copy
 */
Matrix2.prototype.scaled = function(scale) {
    var m = this.clone();
    m.scale(scale);
    return m;
};

/**
 * @method add
 * @description Add [o] to [this].
 * @param o {Matrix2}
 * @return {Matrix2} this
 */
Matrix2.prototype.add = function(o) {
    oStorage = o.storage;
    this.storage[0] = this.storage[0] + oStorage[0];
    this.storage[1] = this.storage[1] + oStorage[1];
    this.storage[2] = this.storage[2] + oStorage[2];
    this.storage[3] = this.storage[3] + oStorage[3];
    return this;
};

/**
 * @method sub
 * @description Subtract [o] from [this].
 * @param o {Matrix2}
 * @return {Matrix2} this
 */
Matrix2.prototype.sub = function(o) {
    oStorage = o.storage;
    this.storage[0] = this.storage[0] - oStorage[0];
    this.storage[1] = this.storage[1] - oStorage[1];
    this.storage[2] = this.storage[2] - oStorage[2];
    this.storage[3] = this.storage[3] - oStorage[3];
    return this;
};

/**
 * @method negate
 * @description Negate [this].
 * @return {Matrix2} this
 */
Matrix2.prototype.negate = function() {
    this.storage[0] = -this.storage[0];
    this.storage[1] = -this.storage[1];
    this.storage[2] = -this.storage[2];
    this.storage[3] = -this.storage[3];
    return this;
};

/**
 * @method multiply
 * @description Multiply [this] with [arg] and store it in [this].
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.multiply = function(arg) {
    m00 = this.storage[0];
    m01 = this.storage[2];
    m10 = this.storage[1];
    m11 = this.storage[3];
    argStorage = arg.storage;
    n00 = argStorage[0];
    n01 = argStorage[2];
    n10 = argStorage[1];
    n11 = argStorage[3];
    this.storage[0] = (m00 * n00) + (m01 * n10);
    this.storage[2] = (m00 * n01) + (m01 * n11);
    this.storage[1] = (m10 * n00) + (m11 * n10);
    this.storage[3] = (m10 * n01) + (m11 * n11);
    return this;
};

/**
 * @method multiplied
 * @description Multiply [this] with [arg] and return the copy product.
 * @param arg {Matrix2}
 * @return {Matrix2} copy
 */
Matrix2.prototype.multiplied = function(arg) {
    var m  = this.clone();
    m.multiply(arg);
    return m;
};

/**
 * @method transposeMultiply
 * @description Multiply a transposed [this] with [arg].
 * @param arg {Matrix2}
 * @return {Matrix2} this
 */
Matrix2.prototype.transposeMultiply = function(arg) {
    m00 = this.storage[0];
    m01 = this.storage[1];
    m10 = this.storage[2];
    m11 = this.storage[3];
    argStorage = arg.storage;
    this.storage[0] = (m00 * argStorage[0]) + (m01 * argStorage[1]);
    this.storage[2] = (m00 * argStorage[2]) + (m01 * argStorage[3]);
    this.storage[1] = (m10 * argStorage[0]) + (m11 * argStorage[1]);
    this.storage[3] = (m10 * argStorage[2]) + (m11 * argStorage[3]);
    return this;
};

/**
 * @method multiplyTranspose
 * @description Multiply [this] with a transposed [arg].
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.multiplyTranspose = function(arg) {
    m00 = this.storage[0];
    m01 = this.storage[2];
    m10 = this.storage[1];
    m11 = this.storage[3];
    argStorage = arg.storage;
    this.storage[0] = (m00 * argStorage[0]) + (m01 * argStorage[2]);
    this.storage[2] = (m00 * argStorage[1]) + (m01 * argStorage[3]);
    this.storage[1] = (m10 * argStorage[0]) + (m11 * argStorage[2]);
    this.storage[3] = (m10 * argStorage[1]) + (m11 * argStorage[3]);
    return this;
};

/**
 * @method transform
 * @description  Transform [arg] of type [Vector2] using the transformation defined by [this].
 * @param arg {Vector2}
 * @return {Vector2}
 */
Matrix2.prototype.transform = function(arg) {
    argStorage = arg.storage;
    var x = (this.storage[0] * argStorage[0]) + (this.storage[2] * argStorage[1]);
    var y = (this.storage[1] * argStorage[0]) + (this.storage[3] * argStorage[1]);
    argStorage[0] = x;
    argStorage[1] = y;
    return arg;
};

/**
 * @method transformed
 * @description Transform a copy of [arg] using the transformation defined by [this].
 * @param arg {Vector2}
 * @returns {Vector2}
 */
Matrix2.prototype.transformed = function(arg) {
    var out = Vector2.copy(arg);
    return this.transform(out);
};

/**
 * @method copyIntoArray
 * @description Copies [this]  into [array] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 */
Matrix2.prototype.copyIntoArray = function(array, offset) {
    var i = offset;
    if (offset === undefined) {
        i = 0;
    }
    array[i + 3] = this.storage[3];
    array[i + 2] = this.storage[2];
    array[i + 1] = this.storage[1];
    array[i + 0] = this.storage[0];
};

/**
 * @method copyFromArray
 * @description Copies elements from [array]  into [this] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 */
Matrix2.prototype.copyFromArray = function(array, offset) {
    var i = offset;
    if (offset === undefined) {
        i = 0;
    }
    this.storage[3] = array[i + 3];
    this.storage[2] = array[i + 2];
    this.storage[1] = array[i + 1];
    this.storage[0] = array[i + 0];
};

},{"./vector2.js":20}],12:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix3;

var Vector2 = require('./vector2.js');
var Vector3 = require('./vector3.js');
var Matrix2 = require('./matrix2.js');
var Quaternion = require('./quaternion.js');


/**
 * @class Matrix3
 * @description 3D Matrix. Values are stored in column major order.
 * @param m00 {number}
 * @param m10 {number}
 * @param m20 {number}
 * @param m01 {number}
 * @param m11 {number}
 * @param m21 {number}
 * @param m02 {number}
 * @param m12 {number}
 * @param m22 {number}
 * @constructor
 */
function Matrix3(m00, m10, m20, m01, m11, m21, m02, m12, m22) {
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([m00, m10, m20, m01, m11, m21, m02, m12, m22]);

    /**
     * @property simd_c0
     * @type {null | Float32x4}
     */
    this.simd_c0 = null;

    /**
     * @property simd_c1
     * @type {null | Float32x4}
     */

    this.simd_c1 = null;
    /**
     * @property simd_c2
     * @type {null | Float32x4}
     */
    this.simd_c2 = null;

    /**
     * @property dimension
     * @type {number}
     */
    this.dimension = 3;
}

/**
* @property simd
* @description SIMD specialization
*/
Matrix3.simd = {};
/**
 * @property scalar
 * @description Scalar specialization
 */
Matrix3.scalar = {};

/**
 * @static load
 * @description Load SIMD.Float32x4 into vector.simd_storage
 * @param matrix {Matrix3}.
 */
Matrix3.simd.load = function(matrix) {
    matrix.simd_c0 = SIMD.Float32x4.load3(matrix.storage, 0);
    matrix.simd_c1 = SIMD.Float32x4.load3(matrix.storage, 3);
    matrix.simd_c2 = SIMD.Float32x4.load3(matrix.storage, 6);
};

/**
 * @static store
 * @description Store SIMD.Float32x4 at vector.simd_storage into vector.storage
 * @param matrix {Matrix3}
 */
Matrix3.simd.store = function(matrix) {
    SIMD.Float32x4.store3(matrix.storage, 0, matrix.simd_c0);
    SIMD.Float32x4.store3(matrix.storage, 3, matrix.simd_c1);
    SIMD.Float32x4.store3(matrix.storage, 6, matrix.simd_c2);
};

/**
 * @static fromFloat32Array
 * @description Constructs Matrix3 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Matrix3}
 */
Matrix3.fromFloat32Array = function(array) {
    var m = Matrix3.zero();
    m.storage = array;
    return m;
};

/**
 * @static fromBuffer
 * @description Constructs Matrix3 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32List.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @return {Matrix3}
 */
Matrix3.fromBuffer = function(buffer, offset) {
    var m = Matrix3.zero();
    m.storage = new Float32Array(buffer, offset, 9);
    return m.clone();
};


/**
 * @static solve2
 * @description Solve [A] * [x] = [b].
 * @param A {Matrix3}
 * @param x {Vector2}
 * @param b {Vector2}
 */
Matrix3.solve2 = function(A, x, b) {
    var a11 = A.entry(0, 0);
    var a12 = A.entry(0, 1);
    var a21 = A.entry(1, 0);
    var a22 = A.entry(1, 1);
    var bx = b.x - A.storage[6];
    var by = b.y - A.storage[7];
    var det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
        det = 1.0 / det;
    }

    x.x = det * (a22 * bx - a12 * by);
    x.y = det * (a11 * by - a21 * bx);
};

/**
 * @static solve
 * @description Solve [A] * [x] = [b].
 * @param A {Matrix3}
 * @param x {Vector3}
 * @param b {Vector3}
 */
Matrix3.solve = function(A, x, b) {
    var A0x = A.entry(0, 0);
    var A0y = A.entry(1, 0);
    var A0z = A.entry(2, 0);
    var A1x = A.entry(0, 1);
    var A1y = A.entry(1, 1);
    var A1z = A.entry(2, 1);
    var A2x = A.entry(0, 2);
    var A2y = A.entry(1, 2);
    var A2z = A.entry(2, 2);
    var rx, ry, rz;
    var det;

    // Column1 cross Column 2
    rx = A1y * A2z - A1z * A2y;
    ry = A1z * A2x - A1x * A2z;
    rz = A1x * A2y - A1y * A2x;

    // A.getColumn(0).dot(x)
    det = A0x * rx + A0y * ry + A0z * rz;
    if (det != 0.0) {
        det = 1.0 / det;
    }

    // b dot [Column1 cross Column 2]
     var x_ = det * (b.x * rx + b.y * ry + b.z * rz);

    // Column2 cross b
    rx = -(A2y * b.z - A2z * b.y);
    ry = -(A2z * b.x - A2x * b.z);
    rz = -(A2x * b.y - A2y * b.x);
    // Column0 dot -[Column2 cross b (Column3)]
     var y_ = det * (A0x * rx + A0y * ry + A0z * rz);

    // b cross Column 1
    rx = -(b.y * A1z - b.z * A1y);
    ry = -(b.z * A1x - b.x * A1z);
    rz = -(b.x * A1y - b.y * A1x);
    // Column0 dot -[b cross Column 1]
    var z_ = det * (A0x * rx + A0y * ry + A0z * rz);

    x.x = x_;
    x.y = y_;
    x.z = z_;
};

/**
 * @method index
 * @description Return index in storage for [row], [col] value.
 * @param row {number}
 * @param col {number}
 */
Matrix3.prototype.index = function(row, col) {
    return (col * 3) + row;
};


/**
 * @method entry
 * @description Value at [row], [col].
 * @param row {Number}
 * @param col {Number}
 * @return {Number} {null}
 */
Matrix3.prototype.entry = function(row, col) {
    if (((row >= 0) && (row < this.dimension)) == false) {
        return null;
    }
    if (((col >= 0) && (col <  this.dimension)) == false) {
        return null;
    }

    return this.storage[this.index(row, col)];
};

/**
 * @method setEntry
 * @description Set value at [row], [col] to be [v].
 * @param row {Number}
 * @param col {Number}
 * @param v {Number}
 * @return {null}
 */
Matrix3.prototype.setEntry = function(row, col, v) {
    if (((row >= 0) && (row < this.dimension)) == false) {
        return null;
    }
    if (((col >= 0) && (col <  this.dimension)) == false) {
        return null;
    }

    this.storage[this.index(row, col)] = v;
};

/**
 * @static zero
 * @description Zero matrix.
 * @return {Matrix3}
 */
Matrix3.zero = function() {
    var m = new Matrix3(0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0);
    return m;
};

/**
 * @static identity
 * @description Identity matrix.
 * @return {Matrix3}
 */
Matrix3.identity = function() {
    var m = Matrix3.zero();
    m.setIdentity();
    return m;
};

/**
 * @static copy
 * @description Copies values from [other].
 * @param other {Matrix3}
 * @return {Matrix3}
 */
Matrix3.copy = function(other) {
    var m = Matrix3.zero();
    m.setFrom(other);
    return m;
};

/**
 * @static columns
 * @description Matrix with values from column arguments.
 * @param arg0 {Vector3}
 * @param arg1 {Vector3}
 * @param arg2 {Vector3}
 * @return {Matrix3}
 */
Matrix3.columns = function(arg0, arg1, arg2) {
    var m = Matrix3.zero();
    m.setColumns(arg0, arg1, arg2);
    return m;
};

/**
 * @static outer
 * @description Outer product of [u] and [v].
 * @param u {Vector3}
 * @param v {Vector3}
 * @return {Matrix3}
 */
Matrix3.outer = function(u, v) {
    var m = Matrix3.zero();
    m.setOuter(u, v);
    return m;
};


/**
 * @static rotation
 * @description Rotation of [radians].
 * @param radians {Number}
 * @return {Matrix3}
 */
Matrix3.rotation = function(radians) {
    var m = Matrix3.zero();
    m.setRotation(radians);
    return m;
};


/**
 * @static rotationX
 * @description Rotation of [radians] on X.
 * @param radians {Number}
 * @return {Matrix3}
 */
Matrix3.rotationX = function(radians) {
    var m = Matrix3.zero();
    m.setRotationX(radians);
    return m;
};

/**
 * @static rotationY
 * @description Rotation of [radians] on Y.
 * @param radians {Number}
 * @return {Matrix3}
 */
Matrix3.rotationY = function(radians) {
    var m = Matrix3.zero();
    m.setRotationY(radians);
    return m;
};

/**
 * @static rotationZ
 * @description Rotation of [radians] on Z.
 * @param radians {Number}
 * @return {Matrix3}
 */
Matrix3.rotationZ = function(radians) {
    var m = Matrix3.zero();
    m.setRotationZ(radians);
    return m;
};


/**
 * @method setValues
 * @description Sets the matrix with specified values.
 * @param arg0 {Number}
 * @param arg1 {Number}
 * @param arg2 {Number}
 * @param arg3 {Number}
 * @param arg4 {Number}
 * @param arg5 {Number}
 * @param arg6 {Number}
 * @param arg7 {Number}
 * @param arg8 {Number}
 * @return {Matrix3}
 */
Matrix3.prototype.setValues = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    this.storage[8] = arg8;
    this.storage[7] = arg7;
    this.storage[6] = arg6;
    this.storage[5] = arg5;
    this.storage[4] = arg4;
    this.storage[3] = arg3;
    this.storage[2] = arg2;
    this.storage[1] = arg1;
    this.storage[0] = arg0;
    return this;
};


/**
 * @method setColumns
 * @description Sets the entire matrix to the column values.
 * @param arg0 {Vector3}
 * @param arg1 {Vector3}
 * @param arg2 {Vector3}
 * @return {Matrix3}
 */
Matrix3.prototype.setColumns = function(arg0, arg1, arg2) {
    var arg0Storage = arg0.storage;
    var arg1Storage = arg1.storage;
    var arg2Storage = arg2.storage;
    this.storage[0] = arg0Storage[0];
    this.storage[1] = arg0Storage[1];
    this.storage[2] = arg0Storage[2];
    this.storage[3] = arg1Storage[0];
    this.storage[4] = arg1Storage[1];
    this.storage[5] = arg1Storage[2];
    this.storage[6] = arg2Storage[0];
    this.storage[7] = arg2Storage[1];
    this.storage[8] = arg2Storage[2];
    return this;
};


/**
 * @methodsetFrom
 * @description Sets the entire matrix to the matrix in [arg].
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.setFrom = function(arg) {
    var argStorage = arg.storage;
    this.storage[8] = argStorage[8];
    this.storage[7] = argStorage[7];
    this.storage[6] = argStorage[6];
    this.storage[5] = argStorage[5];
    this.storage[4] = argStorage[4];
    this.storage[3] = argStorage[3];
    this.storage[2] = argStorage[2];
    this.storage[1] = argStorage[1];
    this.storage[0] = argStorage[0];
    return this;
};

/**
 * @method setOuter
 * @description Set [this] to the outer product of [u] and [v].
 * @param u {Vector3}
 * @param v {Vector3}
 * @return {Matrix3}
 */
Matrix3.prototype.setOuter = function(u, v) {
    var uStorage = u.storage;
    var vStorage = v.storage;
    this.storage[0] = uStorage[0] * vStorage[0];
    this.storage[1] = uStorage[0] * vStorage[1];
    this.storage[2] = uStorage[0] * vStorage[2];
    this.storage[3] = uStorage[1] * vStorage[0];
    this.storage[4] = uStorage[1] * vStorage[1];
    this.storage[5] = uStorage[1] * vStorage[2];
    this.storage[6] = uStorage[2] * vStorage[0];
    this.storage[7] = uStorage[2] * vStorage[1];
    this.storage[8] = uStorage[2] * vStorage[2];
    return this;
};

/**
 * @method splatDiagonal
 * @description Sets the diagonal to [arg].
 * @param arg {Number}
 * @return {Matrix3}
 */
Matrix3.prototype.splatDiagonal = function(arg) {
    this.storage[0] = arg;
    this.storage[4] = arg;
    this.storage[8] = arg;
    return this;
};

/**
 * @method setDiagonal
 * @description Sets the diagonal of the matrix to be [arg].
 * @param arg {Vector3}
 * @return {Matrix3}
 */
Matrix3.prototype.setDiagonal = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = argStorage[0];
    this.storage[4] = argStorage[1];
    this.storage[8] = argStorage[2];
    return this;
};

/**
 * @method toString
 * @description Printable string
 * @return {string}
 */
Matrix3.prototype.toString = function() {
    return '[0] ' + this.getRow(0).toString() +
           '\n[1] ' + this.getRow(1).toString() +
           '\n[2] ' + this.getRow(2).toString() + '}\n';
};

/**
 * @method getAt
 * @description Access the element of the matrix at the index [i].
 * @param i {number}
 * @return {Number}
 */
Matrix3.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * @method setAt
 * @description Set the element of the matrix at the index [i].
 * @param i {number}
 * @param v {number}
 */
Matrix3.prototype.setAt = function(i, v) {
    this.storage[i] = v;
};

/**
 * @method equals
 * @description Check if two matrices are the same.
 * @param other {Matrix3}
 * @return {boolean}
 */
Matrix3.prototype.equals = function(other) {
    if (other.dimension == null || other.dimension != 3) {
        return false;
    }
    return (this.storage[0] == other.storage[0]) &&
           (this.storage[1] == other.storage[1]) &&
           (this.storage[2] == other.storage[2]) &&
           (this.storage[3] == other.storage[3]) &&
           (this.storage[4] == other.storage[4]) &&
           (this.storage[5] == other.storage[5]) &&
           (this.storage[6] == other.storage[6]) &&
           (this.storage[7] == other.storage[7]) &&
           (this.storage[8] == other.storage[8]);
};

/**
 * @method almostEquals
 * @description Check if two matrices are almost the same.
 * @param other {Matrix3}
 * @param precision {number}
 * @optional
 * @return {boolean}
 */
Matrix3.prototype.almostEquals = function(other, precision) {
    if (other.dimension == null || other.dimension != 3) {
        return false;
    }
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if ((Math.abs(this.storage[0] - other.storage[0]) > precision) ||
        (Math.abs(this.storage[1] - other.storage[1]) > precision) ||
        (Math.abs(this.storage[2] - other.storage[2]) > precision) ||
        (Math.abs(this.storage[3] - other.storage[3]) > precision) ||
        (Math.abs(this.storage[4] - other.storage[4]) > precision) ||
        (Math.abs(this.storage[5] - other.storage[5]) > precision) ||
        (Math.abs(this.storage[6] - other.storage[6]) > precision) ||
        (Math.abs(this.storage[7] - other.storage[7]) > precision) ||
        (Math.abs(this.storage[8] - other.storage[8]) > precision)) {
        return false;
    }
    return true;
};

/**
 * @property
 * row 0
 * @type {Vector3}
 */
Matrix3.prototype.__defineGetter__("row0", function() {
    return this.getRow(0);
});
Matrix3.prototype.__defineSetter__("row0", function(v) {
    this.setRow(0, v);
});

/**
 * @property
 * row 1
 * @type {Vector3}
 */
Matrix3.prototype.__defineGetter__("row1", function() {
    return this.getRow(1);
});
Matrix3.prototype.__defineSetter__("row1", function(v) {
    this.setRow(1, v);
});

/**
 * @property
 * row 2
 * @type {Vector3}
 */
Matrix3.prototype.__defineGetter__("row2", function() {
    return this.getRow(2);
});
Matrix3.prototype.__defineSetter__("row2", function(v) {
    this.setRow(2, v);
});


/**
 * @method setRow
 * @description Sets [row] of the matrix to values in [arg]
 * @param row {Number}
 * @param arg {Vector2}
 */
Matrix3.prototype.setRow = function(row, arg) {
    var argStorage = arg.storage;
    this.storage[this.index(row, 0)] = argStorage[0];
    this.storage[this.index(row, 1)] = argStorage[1];
    this.storage[this.index(row, 2)] = argStorage[2];
};

/**
 * @method getRow
 * @description Gets the [row] of the matrix
 * @param row {Number}
 * @return {Vector2}
 */
Matrix3.prototype.getRow = function(row) {
    var r = Vector3.zero();
    var rStorage = r.storage;
    rStorage[0] = this.storage[this.index(row, 0)];
    rStorage[1] = this.storage[this.index(row, 1)];
    rStorage[2] = this.storage[this.index(row, 2)];
    return r;
};

/**
 * @method setColumn
 * @description Assigns the [column] of the matrix [arg]
 * @param column {Number}
 * @param arg {Vector3}
 */
Matrix3.prototype.setColumn = function(column, arg) {
    var argStorage = arg.storage;
    var entry = column * 3;
    this.storage[entry + 2] = argStorage[2];
    this.storage[entry + 1] = argStorage[1];
    this.storage[entry + 0] = argStorage[0];
    return this;
};

/**
 * @method getColumn
 * @description Gets the [column] of the matrix
 * @param column {Number}
 * @return {Vector3}
 */
Matrix3.prototype.getColumn = function(column) {
    var r = Vector3.zero();
    var entry = column * 3;
    var rStorage = r.storage;
    rStorage[2] = this.storage[entry + 2];
    rStorage[1] = this.storage[entry + 1];
    rStorage[0] = this.storage[entry + 0];
    return r;
};

/**
 * @method clone
 * @description  Create a copy of [this].
 * @return {Matrix3}
 */
Matrix3.prototype.clone = function() {
    return Matrix3.copy(this);
};

/**
 * @method copyInto
 * @description  Copy [this] into [arg].
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.copyInto = function(arg) {
    arg.setFrom(this);
    return arg;
};

/**
 * @method mult
 * @description return a new vector or matrix by multiplying [this] with [arg].
 * @param arg
 * @return {*}
 */
Matrix3.prototype.mult = function(arg) {
    if (typeof arg == "Number") {
        return this.scaled(arg);
    }
    if (arg instanceof Vector3) {
        return this.transformed(arg);
    }
    if (arg.dimension == 3) {
        return this.multiplied(arg);
    }
    return null;
};

/**
 * @method added
 * @description return new matrix after component wise [this] + [arg]
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.added = function(arg) {
    var m = this.clone();
    m.add(arg);
    return m;
};

/**
 * @method subbed
 * @description return new matrix after component wise [this] - [arg]
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.subbed = function(arg) {
    var m = this.clone();
    m.sub(arg);
    return m;
};

/**
 * @method negated
 * @description return new matrix after negating [this]
 * @return {Matrix3}
 */
Matrix3.prototype.negated = function() {
    var m = this.clone();
    m.negate();
    return m;
};

/**
 * @method setZero
 * @description Zeros [this].
 * @return {Matrix3}
 */
Matrix3.prototype.setZero = function()  {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    this.storage[4] = 0.0;
    this.storage[5] = 0.0;
    this.storage[6] = 0.0;
    this.storage[7] = 0.0;
    this.storage[8] = 0.0;
    return this;
};

/**
 * @method setIdentity
 * @description  Makes [this] into the identity matrix.
 * @return {Matrix3}
 */
Matrix3.prototype.setIdentity = function () {
    this.storage[0] = 1.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    this.storage[4] = 1.0;
    this.storage[5] = 0.0;
    this.storage[6] = 0.0;
    this.storage[7] = 0.0;
    this.storage[8] = 1.0;
    return this;
};

/**
 * @method transposed
 * @description return the tranpose of this.
 * @return {Matrix3}
 */
Matrix3.prototype.transposed = function() {
    var m = this.clone();
    m.transpose();
    return m;
};

/**
 * @method transpose
 * @description Transpose [this]
 * @return {Matrix3}
 */
Matrix3.prototype.transpose = function() {
    var temp = this.storage[3];
    this.storage[3] = this.storage[1];
    this.storage[1] = temp;
    temp = this.storage[6];
    this.storage[6] = this.storage[2];
    this.storage[2] = temp;
    temp = this.storage[7];
    this.storage[7] = this.storage[5];
    this.storage[5] = temp;
    return this;
};

/**
 * @method absolute
 * @description return the component wise absolute value copy of this.
 * @return {Matrix3}
 */
Matrix3.prototype.absolute = function() {
    if (vector_math.USE_SIMD()) {
        return Matrix3.simd.absolute(this);
    }
    else {
        return Matrix3.scalar.absolute(this);
    }
};
Matrix3.scalar.absolute = function(that) {
    var r = Matrix3.zero();
    var rStorage = r.storage;
    rStorage[0] = Math.abs(that.storage[0]);
    rStorage[1] = Math.abs(that.storage[1]);
    rStorage[2] = Math.abs(that.storage[2]);
    rStorage[3] = Math.abs(that.storage[3]);
    rStorage[4] = Math.abs(that.storage[4]);
    rStorage[5] = Math.abs(that.storage[5]);
    rStorage[6] = Math.abs(that.storage[6]);
    rStorage[7] = Math.abs(that.storage[7]);
    rStorage[8] = Math.abs(that.storage[8]);
    rStorage[9] = Math.abs(that.storage[9]);
    return r;
};
Matrix3.simd.absolute = function(that) {
    var r = Matrix3.zero();
    Matrix3.simd.load(that);
    r.simd_c0 = SIMD.Float32x4.abs(that.simd_c0);
    r.simd_c1 = SIMD.Float32x4.abs(that.simd_c1);
    r.simd_c2 = SIMD.Float32x4.abs(that.simd_c2);
    Matrix3.simd.store(r);
    return r;
};

/**
 * @method determinant
 * @description return the determinant of this matrix.
 * @return {number}
 */
Matrix3.prototype.determinant = function() {
    var x = this.storage[0] *
    ((this.storage[4] * this.storage[8]) - (this.storage[5] * this.storage[7]));
    var y = this.storage[1] *
    ((this.storage[3] * this.storage[8]) - (this.storage[5] * this.storage[6]));
    var z = this.storage[2] *
    ((this.storage[3] * this.storage[7]) - (this.storage[4] * this.storage[6]));
    return x - y + z;
};

/**
 * @method dotRow
 * @description return the dot product of row [i] and [v].
 * @param i {Number}
 * @param v {Vector3}
 * @return {number}
 */
Matrix3.prototype.dotRow = function(i, v) {
    var vStorage = v.storage;
    return this.storage[i] * vStorage[0] +
        this.storage[3 + i] * vStorage[1] +
        this.storage[6 + i] * vStorage[2];
};

/**
 * @method dotColumn
 * @description return the dot product of column [j] and [v].
 * @param j {number}
 * @param v {Vector3}
 * @return {number}
 */
Matrix3.prototype.dotColumn = function(j, v) {
    var vStorage = v.storage;
    return this.storage[j * 3] * vStorage[0] +
        this.storage[j * 3 + 1] * vStorage[1] +
        this.storage[j * 3 + 2] * vStorage[2];
};

/**
 * @method trace
 * @description Trace of the matrix.
 * @return {number}
 */
Matrix3.prototype.trace = function() {
    var t = 0.0;
    t += this.storage[0];
    t += this.storage[4];
    t += this.storage[8];
    return t;
};

/**
 * @method infinityNorm
 * @description return infinity norm of the matrix. Used for numerical analysis.
 * @return {number}
 */
Matrix3.prototype.infinityNorm = function() {
    var norm = 0.0;
    {
        var row_norm = 0.0;
        row_norm += Math.abs(this.storage[0]);
        row_norm += Math.abs(this.storage[1]);
        row_norm += Math.abs(this.storage[2]);
        norm = row_norm > norm ? row_norm : norm;
    }
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[3]);
        row_norm += Math.abs(this.storage[4]);
        row_norm += Math.abs(this.storage[5]);
        norm = row_norm > norm ? row_norm : norm;
    }
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[6]);
        row_norm += Math.abs(this.storage[7]);
        row_norm += Math.abs(this.storage[8]);
        norm = row_norm > norm ? row_norm : norm;
    }
    return norm;
};


/**
 * @method relativeError
 * @description return relative error between [this] and [correct]
 * @param correct
 * @returns {number}
 */
Matrix3.prototype.relativeError = function(correct) {
    var diff = correct.subbed(this);
    var correct_norm = correct.infinityNorm();
    var diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
};

/**
 * @method absoluteError
 * @description return absolute error between [this] and [correct]
 * @param correct {Matrix3}
 * @return {number|*}
 */
Matrix3.prototype.absoluteError = function(correct) {
    var this_norm = this.infinityNorm();
    var correct_norm = correct.infinityNorm();
    var diff_norm = Math.abs((this_norm - correct_norm));
    return diff_norm;
};

/**
 * @method invert
 * @description Invert the matrix. return the determinant.
 * @return {number}
 */
Matrix3.prototype.invert = function () {
    return this.copyInverse(this);
};

/**
 * @method copyInverse
 * @description Set this matrix to be the inverse of [arg]
 * @param arg {Matrix3}
 * @return {number}
 */
Matrix3.prototype.copyInverse = function(arg) {
    var det = arg.determinant();
    if (det == 0.0) {
        this.setFrom(arg);
        return 0.0;
    }
    var invDet = 1.0 / det;
    var argStorage = arg.storage;
    var ix = invDet *
    (argStorage[4] * argStorage[8] - argStorage[5] * argStorage[7]);
    var iy = invDet *
    (argStorage[2] * argStorage[7] - argStorage[1] * argStorage[8]);
    var iz = invDet *
    (argStorage[1] * argStorage[5] - argStorage[2] * argStorage[4]);
    var jx = invDet *
    (argStorage[5] * argStorage[6] - argStorage[3] * argStorage[8]);
    var jy = invDet *
    (argStorage[0] * argStorage[8] - argStorage[2] * argStorage[6]);
    var jz = invDet *
    (argStorage[2] * argStorage[3] - argStorage[0] * argStorage[5]);
    var kx = invDet *
    (argStorage[3] * argStorage[7] - argStorage[4] * argStorage[6]);
    var ky = invDet *
    (argStorage[1] * argStorage[6] - argStorage[0] * argStorage[7]);
    var kz = invDet *
    (argStorage[0] * argStorage[4] - argStorage[1] * argStorage[3]);
    this.storage[0] = ix;
    this.storage[1] = iy;
    this.storage[2] = iz;
    this.storage[3] = jx;
    this.storage[4] = jy;
    this.storage[5] = jz;
    this.storage[6] = kx;
    this.storage[7] = ky;
    this.storage[8] = kz;
    return det;
};


/**
 * @method copyNormalMatrix
 * @description Set this matrix to be the normal matrix of [arg].
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.copyNormalMatrix = function(arg) {
    this.copyInverse(arg.getRotation());
    this.transpose();
    return this;
};

/**
 * @method setRotationX
 * @description  Turns the matrix into a rotation of [radians] around X
 * @param radians
 */
Matrix3.prototype.setRotationX = function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    this.storage[0] = 1.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    this.storage[4] = c;
    this.storage[5] = s;
    this.storage[6] = 0.0;
    this.storage[7] = -s;
    this.storage[8] = c;
};

/**
 * @method setRotationY
 * @description Turns the matrix into a rotation of [radians] around Y
 * @param radians {number}
 */
Matrix3.prototype.setRotationY = function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    this.storage[0] = c;
    this.storage[1] = 0.0;
    this.storage[2] = s;
    this.storage[3] = 0.0;
    this.storage[4] = 1.0;
    this.storage[5] = 0.0;
    this.storage[6] = -s;
    this.storage[7] = 0.0;
    this.storage[8] = c;
};

/**
 * @method setRotationZ
 * @description Turns the matrix into a rotation of [radians] around Z
 * @param radians
 */
Matrix3.prototype.setRotationZ = function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    this.storage[0] = c;
    this.storage[1] = s;
    this.storage[2] = 0.0;
    this.storage[3] = -s;
    this.storage[4] = c;
    this.storage[5] = 0.0;
    this.storage[6] = 0.0;
    this.storage[7] = 0.0;
    this.storage[8] = 1.0;
};

/**
 * @method scaleAdjoint
 * @description Converts into Adjugate matrix and scales by [scale]
 * @param scale
 * @return {Matrix3}
 */
Matrix3.prototype.scaleAdjoint = function(scale) {
    var m00 = this.storage[0];
    var m01 = this.storage[3];
    var m02 = this.storage[6];
    var m10 = this.storage[1];
    var m11 = this.storage[4];
    var m12 = this.storage[7];
    var m20 = this.storage[2];
    var m21 = this.storage[5];
    var m22 = this.storage[8];
    this.storage[0] = (m11 * m22 - m12 * m21) * scale;
    this.storage[1] = (m12 * m20 - m10 * m22) * scale;
    this.storage[2] = (m10 * m21 - m11 * m20) * scale;
    this.storage[3] = (m02 * m21 - m01 * m22) * scale;
    this.storage[4] = (m00 * m22 - m02 * m20) * scale;
    this.storage[5] = (m01 * m20 - m00 * m21) * scale;
    this.storage[6] = (m01 * m12 - m02 * m11) * scale;
    this.storage[7] = (m02 * m10 - m00 * m12) * scale;
    this.storage[8] = (m00 * m11 - m01 * m10) * scale;
    return this;
};

/**
 * @method absoluteRotate
 * @description Rotates [arg] by the absolute rotation of [this]
 * return [arg]. Primarily used by AABB transformation code.
 * @param arg {Vector2}
 * @return {Vector2}
 */
Matrix3.prototype.absoluteRotate = function(arg) {
    var m00 = Math.abs(this.storage[0]);
    var m01 = Math.abs(this.storage[3]);
    var m02 = Math.abs(this.storage[6]);
    var m10 = Math.abs(this.storage[1]);
    var m11 = Math.abs(this.storage[4]);
    var m12 = Math.abs(this.storage[7]);
    var m20 = Math.abs(this.storage[2]);
    var m21 = Math.abs(this.storage[5]);
    var m22 = Math.abs(this.storage[8]);
    var argStorage = arg.storage;
    var x = argStorage[0];
    var y = argStorage[1];
    var z = argStorage[2];
    argStorage[0] = x * m00 + y * m01 + z * m02;
    argStorage[1] = x * m10 + y * m11 + z * m12;
    argStorage[2] = x * m20 + y * m21 + z * m22;
    return arg;
};

/**
 * @method absoluteRotate2
 * @description Rotates [arg] by the absolute rotation of [this] return [arg].
 * Primarily used by AABB transformation code.
 * @param arg {Vector2}
 */
Matrix3.prototype.absoluteRotate2 = function(arg) {
    var m00 = Math.abs(this.storage[0]);
    var m01 = Math.abs(this.storage[3]);
    var m10 = Math.abs(this.storage[1]);
    var m11 = Math.abs(this.storage[4]);
    var argStorage = arg.storage;
    var x = argStorage[0];
    var y = argStorage[1];
    argStorage[0] = x * m00 + y * m01;
    argStorage[1] = x * m10 + y * m11;
    return arg;
};

/**
 * @method transform2
 * @description Transforms [arg] with [this].
 * @param arg {Vector2}
 * @return {Vector2}
 */
Matrix3.prototype.transform2 = function(arg) {
    var argStorage = arg.storage;
    var x_ = (this.storage[0] * arg.storage[0]) +
    (this.storage[3] * arg.storage[1]) +
    this.storage[6];
    var y_ = (this.storage[1] * arg.storage[0]) +
    (this.storage[4] * arg.storage[1]) +
    this.storage[7];
    argStorage[0] = x_;
    argStorage[1] = y_;
    return arg;
};

/**
 * @method scale
 * @description Scales [this] by [scale].
 * @param scale {number}
 */
Matrix3.prototype.scale = function(scale) {
    this.storage[0] = this.storage[0] * scale;
    this.storage[1] = this.storage[1] * scale;
    this.storage[2] = this.storage[2] * scale;
    this.storage[3] = this.storage[3] * scale;
    this.storage[4] = this.storage[4] * scale;
    this.storage[5] = this.storage[5] * scale;
    this.storage[6] = this.storage[6] * scale;
    this.storage[7] = this.storage[7] * scale;
    this.storage[8] = this.storage[8] * scale;
};

/**
 * @method scaled
 * @description Create a copy of [this] and scale it by [scale].
 * @param scale {number}
 * @return {Matrix3}
 */
Matrix3.prototype.scaled = function(scale) {
    var m = this.clone();
    m.scale(scale);
    return m;
};

/**
 * @method add
 * @description Add [o] to [this].
 * @param o {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.add = function(o) {
    if (vector_math.USE_SIMD()) {
        Matrix3.simd.add(this, o);
    }
    else {
        Matrix3.scalar.add(this, o);
    }
    return this;
};
Matrix3.scalar.add = function(that, o) {
    var oStorage = o.storage;
    that.storage[0] = that.storage[0] + oStorage[0];
    that.storage[1] = that.storage[1] + oStorage[1];
    that.storage[2] = that.storage[2] + oStorage[2];
    that.storage[3] = that.storage[3] + oStorage[3];
    that.storage[4] = that.storage[4] + oStorage[4];
    that.storage[5] = that.storage[5] + oStorage[5];
    that.storage[6] = that.storage[6] + oStorage[6];
    that.storage[7] = that.storage[7] + oStorage[7];
    that.storage[8] = that.storage[8] + oStorage[8];
};
Matrix3.simd.add = function(that, o) {
    Matrix3.simd.load(that);
    Matrix3.simd.load(o);
    that.simd_c0 = SIMD.Float32x4.add(that.simd_c0, o.simd_c0);
    that.simd_c1 = SIMD.Float32x4.add(that.simd_c1, o.simd_c1);
    that.simd_c2 = SIMD.Float32x4.add(that.simd_c2, o.simd_c2);
    Matrix3.simd.store(that);
};

/**
 * @method sub
 * @description Subtract [o] from [this].
 * @param o {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.sub = function(o) {
    if (vector_math.USE_SIMD()) {
        Matrix3.simd.sub(this, o);
    }
    else {
        Matrix3.scalar.sub(this, o);
    }
    return this;
};
Matrix3.scalar.sub = function(that, o) {
    var oStorage = o.storage;
    that.storage[0] = that.storage[0] - oStorage[0];
    that.storage[1] = that.storage[1] - oStorage[1];
    that.storage[2] = that.storage[2] - oStorage[2];
    that.storage[3] = that.storage[3] - oStorage[3];
    that.storage[4] = that.storage[4] - oStorage[4];
    that.storage[5] = that.storage[5] - oStorage[5];
    that.storage[6] = that.storage[6] - oStorage[6];
    that.storage[7] = that.storage[7] - oStorage[7];
    that.storage[8] = that.storage[8] - oStorage[8];
};
Matrix3.simd.sub = function(that, o) {
    Matrix3.simd.load(that);
    Matrix3.simd.load(o);
    that.simd_c0 = SIMD.Float32x4.sub(that.simd_c0, o.simd_c0);
    that.simd_c1 = SIMD.Float32x4.sub(that.simd_c1, o.simd_c1);
    that.simd_c2 = SIMD.Float32x4.sub(that.simd_c2, o.simd_c2);
    Matrix3.simd.store(that);
};

/**
 * @method negate
 * @description Negate [this].
 * @return {Matrix3}
 */
Matrix3.prototype.negate = function() {
    if (vector_math.USE_SIMD()) {
        Matrix3.simd.neg(this);
    }
    else {
        Matrix3.scalar.neg(this);
    }
    return this;
};
Matrix3.scalar.neg = function(that) {
    that.storage[0] = -that.storage[0];
    that.storage[1] = -that.storage[1];
    that.storage[2] = -that.storage[2];
    that.storage[3] = -that.storage[3];
    that.storage[4] = -that.storage[4];
    that.storage[5] = -that.storage[5];
    that.storage[6] = -that.storage[6];
    that.storage[7] = -that.storage[7];
    that.storage[8] = -that.storage[8];
};
Matrix3.simd.neg = function(that) {
    Matrix3.simd.load(that);
    that.simd_c0 = SIMD.Float32x4.neg(that.simd_c0);
    that.simd_c1 = SIMD.Float32x4.neg(that.simd_c1);
    that.simd_c2 = SIMD.Float32x4.neg(that.simd_c2);
    Matrix3.simd.store(that);
};


/**
 * @method multiply
 * @description Multiply [this] by [arg].
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.multiply = function(arg) {
    var m00 = this.storage[0];
    var m01 = this.storage[3];
    var m02 = this.storage[6];
    var m10 = this.storage[1];
    var m11 = this.storage[4];
    var m12 = this.storage[7];
    var m20 = this.storage[2];
    var m21 = this.storage[5];
    var m22 = this.storage[8];
    var argStorage = arg.storage;
    var n00 = argStorage[0];
    var n01 = argStorage[3];
    var n02 = argStorage[6];
    var n10 = argStorage[1];
    var n11 = argStorage[4];
    var n12 = argStorage[7];
    var n20 = argStorage[2];
    var n21 = argStorage[5];
    var n22 = argStorage[8];
    this.storage[0] = (m00 * n00) + (m01 * n10) + (m02 * n20);
    this.storage[3] = (m00 * n01) + (m01 * n11) + (m02 * n21);
    this.storage[6] = (m00 * n02) + (m01 * n12) + (m02 * n22);
    this.storage[1] = (m10 * n00) + (m11 * n10) + (m12 * n20);
    this.storage[4] = (m10 * n01) + (m11 * n11) + (m12 * n21);
    this.storage[7] = (m10 * n02) + (m11 * n12) + (m12 * n22);
    this.storage[2] = (m20 * n00) + (m21 * n10) + (m22 * n20);
    this.storage[5] = (m20 * n01) + (m21 * n11) + (m22 * n21);
    this.storage[8] = (m20 * n02) + (m21 * n12) + (m22 * n22);
    return this;
};

/**
 * @method multiplied
 * @description Create a copy of [this] and multiply it by [arg].
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.multiplied = function(arg) {
    var m = this.clone();
    m.multiply(arg);
    return m;
};

/**
 * @method transposeMultiply
 * @param arg {Matrix3}
 * @return {Matrix3}
 */
Matrix3.prototype.transposeMultiply = function(arg) {
    var m00 = this.storage[0];
    var m01 = this.storage[1];
    var m02 = this.storage[2];
    var m10 = this.storage[3];
    var m11 = this.storage[4];
    var m12 = this.storage[5];
    var m20 = this.storage[6];
    var m21 = this.storage[7];
    var m22 = this.storage[8];
    var argStorage = arg.storage;
    this.storage[0] =
        (m00 * argStorage[0]) + (m01 * arg.storage[1]) + (m02 * arg.storage[2]);
    this.storage[3] =
        (m00 * argStorage[3]) + (m01 * arg.storage[4]) + (m02 * arg.storage[5]);
    this.storage[6] =
        (m00 * argStorage[6]) + (m01 * arg.storage[7]) + (m02 * arg.storage[8]);
    this.storage[1] =
        (m10 * argStorage[0]) + (m11 * arg.storage[1]) + (m12 * arg.storage[2]);
    this.storage[4] =
        (m10 * argStorage[3]) + (m11 * arg.storage[4]) + (m12 * arg.storage[5]);
    this.storage[7] =
        (m10 * argStorage[6]) + (m11 * arg.storage[7]) + (m12 * arg.storage[8]);
    this.storage[2] =
        (m20 * argStorage[0]) + (m21 * arg.storage[1]) + (m22 * arg.storage[2]);
    this.storage[5] =
        (m20 * argStorage[3]) + (m21 * arg.storage[4]) + (m22 * arg.storage[5]);
    this.storage[8] =
        (m20 * argStorage[6]) + (m21 * arg.storage[7]) + (m22 * arg.storage[8]);
    return this;
};

/**
 * @method multiplyTranspose
 * @param arg
 * @return {Matrix3}
 */
Matrix3.prototype.multiplyTranspose = function(arg) {
    var m00 = this.storage[0];
    var m01 = this.storage[3];
    var m02 = this.storage[6];
    var m10 = this.storage[1];
    var m11 = this.storage[4];
    var m12 = this.storage[7];
    var m20 = this.storage[2];
    var m21 = this.storage[5];
    var m22 = this.storage[8];
    var argStorage = arg.storage;
    this.storage[0] =
        (m00 * argStorage[0]) + (m01 * argStorage[3]) + (m02 * argStorage[6]);
    this.storage[3] =
        (m00 * argStorage[1]) + (m01 * argStorage[4]) + (m02 * argStorage[7]);
    this.storage[6] =
        (m00 * argStorage[2]) + (m01 * argStorage[5]) + (m02 * argStorage[8]);
    this.storage[1] =
        (m10 * argStorage[0]) + (m11 * argStorage[3]) + (m12 * argStorage[6]);
    this.storage[4] =
        (m10 * argStorage[1]) + (m11 * argStorage[4]) + (m12 * argStorage[7]);
    this.storage[7] =
        (m10 * argStorage[2]) + (m11 * argStorage[5]) + (m12 * argStorage[8]);
    this.storage[2] =
        (m20 * argStorage[0]) + (m21 * argStorage[3]) + (m22 * argStorage[6]);
    this.storage[5] =
        (m20 * argStorage[1]) + (m21 * argStorage[4]) + (m22 * argStorage[7]);
    this.storage[8] =
        (m20 * argStorage[2]) + (m21 * argStorage[5]) + (m22 * argStorage[8]);
    return this;
};

/**
 * @method transform
 * @description Transform [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @return {Vector3}
 */
Matrix3.prototype.transform = function(arg) {
    var argStorage = arg.storage;
    var x_ = (this.storage[0] * argStorage[0]) +
        (this.storage[3] * argStorage[1]) +
        (this.storage[6] * argStorage[2]);
    var y_ = (this.storage[1] * argStorage[0]) +
        (this.storage[4] * argStorage[1]) +
        (this.storage[7] * argStorage[2]);
    var z_ = (this.storage[2] * argStorage[0]) +
        (this.storage[5] * argStorage[1]) +
        (this.storage[8] * argStorage[2]);
    arg.x = x_;
    arg.y = y_;
    arg.z = z_;
    return arg;
};

/**
 * @method transformed
 * @description  Transform a copy of [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @return {Vector3}
 */
Matrix3.prototype.transformed = function(arg) {
    var out = Vector3.copy(arg);
    return this.transform(out);
};

/**
 * @method copyFromArray
 * @description Copies elements from [array] into [this] starting at [offset].
 * @param array
 * @param offset
 */
Matrix3.prototype.copyFromArray = function(array, offset) {
    var i = offset;
    if (offset === undefined) {
        i = 0;
    }
    this.storage[8] = array[i + 8];
    this.storage[7] = array[i + 7];
    this.storage[6] = array[i + 6];
    this.storage[5] = array[i + 5];
    this.storage[4] = array[i + 4];
    this.storage[3] = array[i + 3];
    this.storage[2] = array[i + 2];
    this.storage[1] = array[i + 1];
    this.storage[0] = array[i + 0];
};

/**
 * @method applyToVector3Array
 * @description  Multiply [this] to each set of xyz values in [array] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 * @return {Array}
 */
Matrix3.prototype.applyToVector3Array = function(array, offset) {
    var j = offset;
    if (offset === undefined) {
        j = 0;
    }
    for (var i = 0, j = offset; i < array.length; i += 3, j += 3) {
        var v = Vector3.array(array, j);
        v.applyMatrix3(this);
        array[j] = v.storage[0];
        array[j + 1] = v.storage[1];
        array[j + 2] = v.storage[2];
    }
    return array;
};

},{"./matrix2.js":11,"./quaternion.js":16,"./vector2.js":20,"./vector3.js":21}],13:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix4;
var Matrix3 = require('./matrix3.js');
var Vector3 = require('./vector3.js');
var Vector4 = require('./vector4.js');
var Quaternion = require('./quaternion.js');

var vector_math = require('./common.js');
var SIMD = require("simd");

/**
 * @class Matrix4
 * @description 4D Matrix. Values are stored in column major order.
 * @param m00 {number}
 * @param m01 {number}
 * @param m02 {number}
 * @param m03 {number}
 * @param m10 {number}
 * @param m11 {number}
 * @param m12 {number}
 * @param m13 {number}
 * @param m20 {number}
 * @param m21 {number}
 * @param m22 {number}
 * @param m23 {number}
 * @param m30 {number}
 * @param m31 {number}
 * @param m32 {number}
 * @param m33 {number}
 * @constructor
 */
function Matrix4(m00, m01, m02, m03,
                 m10, m11, m12, m13,
                 m20, m21, m22, m23,
                 m30, m31, m32, m33) {
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([m00, m01, m02, m03,
                                     m10, m11, m12, m13,
                                     m20, m21, m22, m23,
                                     m30, m31, m32, m33]);
    /**
     * @property simd_c0
     * @type {null | Float32x4}
     */
    this.simd_c0 = null;

    /**
     * @property simd_c1
     * @type {null | Float32x4}
     */

    this.simd_c1 = null;
    /**
     * @property simd_c2
     * @type {null | Float32x4}
     */
    this.simd_c2 = null;
    /**
     * @property simd_c3
     * @type {null | Float32x4}
     */
    this.simd_c3 = null;
    /**
     * @property dimension
     * @type {number}
     */
    this.dimension = 4;
}

/**
 * @static
 * SIMD specialization
 */
Matrix4.simd = {};
/**
 * @static
 * Scalar specialization
 */
Matrix4.scalar = {};

/**
 * @static
 * Load SIMD.Float32x4 into vector.simd_storage
 * @param matrix {Matrix4}
 */
Matrix4.simd.load = function(matrix) {
    matrix.simd_c0 = SIMD.Float32x4.load(matrix.storage, 0);
    matrix.simd_c1 = SIMD.Float32x4.load(matrix.storage, 4);
    matrix.simd_c2 = SIMD.Float32x4.load(matrix.storage, 8);
    matrix.simd_c3 = SIMD.Float32x4.load(matrix.storage, 12);
};

/**
 * @static
 * Store SIMD.Float32x4 at vector.simd_storage into vector.storage
 * @param matrix {Matrix4}
 */
Matrix4.simd.store = function(matrix) {
    SIMD.Float32x4.store(matrix.storage, 0, matrix.simd_c0);
    SIMD.Float32x4.store(matrix.storage, 4, matrix.simd_c1);
    SIMD.Float32x4.store(matrix.storage, 8, matrix.simd_c2);
    SIMD.Float32x4.store(matrix.storage, 12, matrix.simd_c3);
};


/**
 * @static fromFloat32Array
 * @description Constructs Matrix4 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Matrix4}
 */
Matrix4.fromFloat32Array = function(array) {
    var m = Matrix4.zero();
    m.storage = array;
    return m;
};

/**
 * @static fromBuffer
 * @description Constructs Matrix2 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32List.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 */
Matrix4.fromBuffer = function(buffer, offset) {
    var m = Matrix4.zero();
    m.storage = new Float32Array(buffer, offset, 16);
    return m.clone();
};

/**
 * @static solve2
 * @description Solve [A] * [x] = [b].
 * @param A {Matrix4}
 * @param x {Vector2}
 * @param b {Vector2}
 */
Matrix4.solve2 = function(A, x, b) {
    var m001 = A.entry(0, 0);
    var m002 = A.entry(0, 1);
    var m101 = A.entry(1, 0);
    var m102 = A.entry(1, 1);
    var bx = b.x - A.storage[8];
    var by = b.y - A.storage[9];
    var det = m001 * m102 - m002 * m101;

    if (det != 0.0) {
        det = 1.0 / det;
    }

    x.x = det * (m102 * bx - m002 * by);
    x.y = det * (m001 * by - m101 * bx);
};

/**
 * @static solve3
 * @description Solve [A] * [x] = [b].
 * @param A {Matrix4}
 * @param x {Vector3}
 * @param b {Vector3}
 */
Matrix4.solve3 = function(A, x, b) {
    var A0x = A.entry(0, 0);
    var A0y = A.entry(1, 0);
    var A0z = A.entry(2, 0);
    var m00x = A.entry(0, 1);
    var m00y = A.entry(1, 1);
    var m00z = A.entry(2, 1);
    var m10x = A.entry(0, 2);
    var m10y = A.entry(1, 2);
    var m10z = A.entry(2, 2);
    var bx = b.x - A.storage[12];
    var by = b.y - A.storage[13];
    var bz = b.z - A.storage[14];
    var rx, ry, rz;

    // Column1 cross Column 2
    rx = m00y * m10z - m00z * m10y;
    ry = m00z * m10x - m00x * m10z;
    rz = m00x * m10y - m00y * m10x;

    // A.getColumn(0).dot(x)
    var det = A0x * rx + A0y * ry + A0z * rz;
    if (det != 0.0) {
        det = 1.0 / det;
    }

    // b dot [Column1 cross Column 2]
     var x_ = det * (bx * rx + by * ry + bz * rz);

    // Column2 cross b
    rx = -(m10y * bz - m10z * by);
    ry = -(m10z * bx - m10x * bz);
    rz = -(m10x * by - m10y * bx);
    // Column0 dot -[Column2 cross b (Column3)]
     var y_ = det * (A0x * rx + A0y * ry + A0z * rz);

    // b cross Column 1
    rx = -(by * m00z - bz * m00y);
    ry = -(bz * m00x - bx * m00z);
    rz = -(bx * m00y - by * m00x);
    // Column0 dot -[b cross Column 1]
     var z_ = det * (A0x * rx + A0y * ry + A0z * rz);

    x.x = x_;
    x.y = y_;
    x.z = z_;
};

/**
 * @static solve
 * @description Solve [A] * [x] = [b].
 * @param A {Matrix4}
 * @param x {Vector4}
 * @param b {Vector4}
 */
Matrix4.solve = function(A, x, b) {
     var a00 = A.storage[0];
     var a01 = A.storage[1];
     var a02 = A.storage[2];
     var a03 = A.storage[3];
     var m000 = A.storage[4];
     var m001 = A.storage[5];
     var m002 = A.storage[6];
     var m003 = A.storage[7];
     var m100 = A.storage[8];
     var m101 = A.storage[9];
     var m102 = A.storage[10];
     var m103 = A.storage[11];
     var m200 = A.storage[12];
     var m201 = A.storage[13];
     var m202 = A.storage[14];
     var m203 = A.storage[15];
     var b00 = a00 * m001 - a01 * m000;
     var b01 = a00 * m002 - a02 * m000;
     var b02 = a00 * m003 - a03 * m000;
     var b03 = a01 * m002 - a02 * m001;
     var b04 = a01 * m003 - a03 * m001;
     var b05 = a02 * m003 - a03 * m002;
     var b06 = m100 * m201 - m101 * m200;
     var b07 = m100 * m202 - m102 * m200;
     var b08 = m100 * m203 - m103 * m200;
     var b09 = m101 * m202 - m102 * m201;
     var m010 = m101 * m203 - m103 * m201;
     var m011 = m102 * m203 - m103 * m202;

     var bX = b.storage[0];
     var bY = b.storage[1];
     var bZ = b.storage[2];
     var bW = b.storage[3];

    var det =
        b00 * m011 - b01 * m010 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det != 0.0) {
        det = 1.0 / det;
    }

    x.x = det *
    ((m001 * m011 - m002 * m010 + m003 * b09) * bX -
    (m000 * m011 - m002 * b08 + m003 * b07) * bY +
    (m000 * m010 - m001 * b08 + m003 * b06) * bZ -
    (m000 * b09 - m001 * b07 + m002 * b06) * bW);

    x.y = det *
    -((a01 * m011 - a02 * m010 + a03 * b09) * bX -
    (a00 * m011 - a02 * b08 + a03 * b07) * bY +
    (a00 * m010 - a01 * b08 + a03 * b06) * bZ -
    (a00 * b09 - a01 * b07 + a02 * b06) * bW);

    x.z = det *
    ((m201 * b05 - m202 * b04 + m203 * b03) * bX -
    (m200 * b05 - m202 * b02 + m203 * b01) * bY +
    (m200 * b04 - m201 * b02 + m203 * b00) * bZ -
    (m200 * b03 - m201 * b01 + m202 * b00) * bW);

    x.w = det *
    -((m101 * b05 - m102 * b04 + m103 * b03) * bX -
    (m100 * b05 - m102 * b02 + m103 * b01) * bY +
    (m100 * b04 - m101 * b02 + m103 * b00) * bZ -
    (m100 * b03 - m101 * b01 + m102 * b00) * bW);
};

/**
 * @method index
 * @description Return index in storage for [row], [col] value.
 * @param row
 * @param col
 */
Matrix4.prototype.index = function(row, col) {
    return (col * 4) + row;
};


/**
 * @method entry
 * @description Value at [row], [col].
 * @param row {Number}
 * @param col {Number}
 * @return {Number} {null}
 */
Matrix4.prototype.entry = function(row, col) {
    if (((row >= 0) && (row < this.dimension)) == false) {
        return null;
    }
    if (((col >= 0) && (col <  this.dimension)) == false) {
        return null;
    }

    return this.storage[this.index(row, col)];
};

/**
 * @method setEntry
 * @description Set value at [row], [col] to be [v].
 * @param row {Number}
 * @param col {Number}
 * @param v {Number}
 * @return {null}
 */
Matrix4.prototype.setEntry = function(row, col, v) {
    if (((row >= 0) && (row < this.dimension)) == false) {
        return null;
    }
    if (((col >= 0) && (col <  this.dimension)) == false) {
        return null;
    }

    this.storage[this.index(row, col)] = v;
};

/**
 * @static zero
 * @description Zero matrix.
 * @return {Matrix4}
 */
Matrix4.zero = function() {
    var m = new Matrix4(0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0);
    return m;
};

/**
 * @static identity
 * @description Identity matrix.
 * @return {Matrix4}
 */
Matrix4.identity = function() {
    var m = Matrix4.zero();
    m.setIdentity();
    return m;
};

/**
 * @static cpoy
 * @description Copies values from [other].
 * @param other {Matrix4}
 * @return {Matrix4}
 */
Matrix4.copy = function(other) {
    var m = Matrix4.zero();
    m.setFrom(other);
    return m;
};

/**
 * @static columns
 * @description Matrix with values from column arguments.
 * @param arg0 {Vector4}
 * @param arg1 {Vector4}
 * @param arg2 {Vector4}
 * @param arg3 {Vector4}
 * @return {Matrix4}
 */
Matrix4.columns = function(arg0, arg1, arg2, arg3) {
    var m = Matrix4.zero();
    m.setColumns(arg0, arg1, arg2, arg3);
    return m;
};

/**
 * @static outer
 * @description Outer product of [u] and [v].
 * @param u {Vector4}
 * @param v {Vector4}
 * @return {Matrix4}
 */
Matrix4.outer = function(u, v) {
    var m = Matrix4.zero();
    m.setOuter(u, v);
    return m;
};

/**
 * @static rotation
 * @description Rotation of [radians].
 * @param radians {Number}
 * @return {Matrix4}
 */
Matrix4.rotation = function(radians) {
    var m = Matrix4.zero();
    m.setRotation(radians);
    return m;
};


/**
 * @static rotationX
 * @description Rotation of [radians] on X.
 * @param radians {Number}
 * @return {Matrix4}
 */
Matrix4.rotationX = function(radians) {
    var m = Matrix4.zero();
    m.storage[15] = 1.0;
    m.setRotationX(radians);
    return m;
};

/**
 * @static rotationY
 * @description Rotation of [radians] on Y.
 * @param radians {Number}
 * @return {Matrix3}
 */
Matrix4.rotationY = function(radians) {
    var m = Matrix4.zero();
    m.storage[15] = 1.0;
    m.setRotationY(radians);
    return m;
};

/**
 * @static rotationZ
 * @description Rotation of [radians] on Z.
 * @param radians {Number}
 * @return {Matrix3}
 */
Matrix4.rotationZ = function(radians) {
    var m = Matrix4.zero();
    m.storage[15] = 1.0;
    m.setRotationZ(radians);
    return m;
};

/**
 * @static translation
 * @description Scale matrix
 * @param scale {Vector4}
 * @return {Matrix4}
 */
Matrix4.translation = function(scale) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setDiagonal(scale);
    return m;
};

/**
 * @static diagonalValues
 * @description Scale matrix from values x,y,z,w
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 * @return {Matrix4}
 */
Matrix4.diagonalValues = function(x, y, z, w) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setDiagonal(new Vector4(x, y, z, w));
    return m;
};

/**
 * @static translation
 * @description Translation matrix
 * @param translation {Vector3}
 * @return {Matrix4}
 */
Matrix4.translation = function(translation) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setTranslation(translation);
    return m;
};

/**
 * @static translationValues
 * @description Translation matrix from values x,y,z
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @return {Matrix4}
 */
Matrix4.translationValues = function(x, y, z) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setTranslation(new Vector3(x, y, z));
    return m;
};

/**
 * @static compose
 * @description Constructs a Matrix4 from translation, rotation and scale
 * @param translation {Vector3}
 * @param rotation {Quaternion}
 * @param scale {Vector3}
 * @return {Matrix4}
 */
Matrix4.compose = function(translation, rotation, scale) {
    var m = Matrix4.zero();
    m.setFromTranslationRotationScale(translation, rotation, scale);
    return m;
};

/**
 * @method splatDiagonal
 * @description Sets the diagonal to [arg].
 * @param arg {Number}
 * @return {Matrix4}
 */
Matrix4.prototype.splatDiagonal = function(arg) {
    this.storage[0] = arg;
    this.storage[5] = arg;
    this.storage[10] = arg;
    this.storage[15] = arg;
    return this;
};

/**
 * @method setValues
 * @description Sets the matrix with specified values
 * @param arg0 {number}
 * @param arg1 {number}
 * @param arg2 {number}
 * @param arg3 {number}
 * @param arg4 {number}
 * @param arg5 {number}
 * @param arg6 {number}
 * @param arg7 {number}
 * @param arg8 {number}
 * @param arg9 {number}
 * @param arg10 {number}
 * @param arg11 {number}
 * @param arg12 {number}
 * @param arg13 {number}
 * @param arg14 {number}
 * @param arg15 {number}
 * @return {Matrix4}
 */
Matrix4.prototype.setValues = function(arg0, arg1, arg2, arg3,
                                       arg4, arg5, arg6, arg7,
                                       arg8, arg9, arg10, arg11,
                                       arg12, arg13, arg14, arg15) {
    this.storage[15] = arg15;
    this.storage[14] = arg14;
    this.storage[13] = arg13;
    this.storage[12] = arg12;
    this.storage[11] = arg11;
    this.storage[10] = arg10;
    this.storage[9] = arg9;
    this.storage[8] = arg8;
    this.storage[7] = arg7;
    this.storage[6] = arg6;
    this.storage[5] = arg5;
    this.storage[4] = arg4;
    this.storage[3] = arg3;
    this.storage[2] = arg2;
    this.storage[1] = arg1;
    this.storage[0] = arg0;
    return this;
};

/**
 * @method setColumns
 * @description Sets the entire matrix to the column values.
 * @param arg0 {Vector4}
 * @param arg1 {Vector4}
 * @param arg2 {Vector4}
 * @param arg3 {Vector4}
 * @return {Matrix4}
 */
Matrix4.prototype.setColumns = function(arg0, arg1, arg2, arg3) {
    var arg0Storage = arg0.storage;
    var arg1Storage = arg1.storage;
    var arg2Storage = arg2.storage;
    var arg3Storage = arg3.storage;
    this.storage[0] = arg0Storage[0];
    this.storage[1] = arg0Storage[1];
    this.storage[2] = arg0Storage[2];
    this.storage[3] = arg0Storage[3];
    this.storage[4] = arg1Storage[0];
    this.storage[5] = arg1Storage[1];
    this.storage[6] = arg1Storage[2];
    this.storage[7] = arg1Storage[3];
    this.storage[8] = arg2Storage[0];
    this.storage[9] = arg2Storage[1];
    this.storage[10] = arg2Storage[2];
    this.storage[11] = arg2Storage[3];
    this.storage[12] = arg3Storage[0];
    this.storage[13] = arg3Storage[1];
    this.storage[14] = arg3Storage[2];
    this.storage[15] = arg3Storage[3];
    return this;
};

/**
 * @method setFrom
 * @description Sets the entire matrix to the matrix in [arg].
 * @param arg {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.setFrom = function(arg) {
    var argStorage = arg.storage;
    this.storage[15] = argStorage[15];
    this.storage[14] = argStorage[14];
    this.storage[13] = argStorage[13];
    this.storage[12] = argStorage[12];
    this.storage[11] = argStorage[11];
    this.storage[10] = argStorage[10];
    this.storage[9] = argStorage[9];
    this.storage[8] = argStorage[8];
    this.storage[7] = argStorage[7];
    this.storage[6] = argStorage[6];
    this.storage[5] = argStorage[5];
    this.storage[4] = argStorage[4];
    this.storage[3] = argStorage[3];
    this.storage[2] = argStorage[2];
    this.storage[1] = argStorage[1];
    this.storage[0] = argStorage[0];
    return this;
};

/**
 * @method setFromTranslationRotation
 * @description Sets the matrix from translation [arg0] and rotation [arg1].
 * @param arg0 {Vector3}
 * @param arg1 {Quaternion}
 * @return {Matrix4}
 */
Matrix4.prototype.setFromTranslationRotation = function(arg0, arg1) {
    var arg1Storage = arg1.storage;
    var x = arg1Storage[0];
    var y = arg1Storage[1];
    var z = arg1Storage[2];
    var w = arg1Storage[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;

    var arg0Storage = arg0.storage;
    this.storage[0] = 1.0 - (yy + zz);
    this.storage[1] = xy + wz;
    this.storage[2] = xz - wy;
    this.storage[3] = 0.0;
    this.storage[4] = xy - wz;
    this.storage[5] = 1.0 - (xx + zz);
    this.storage[6] = yz + wx;
    this.storage[7] = 0.0;
    this.storage[8] = xz + wy;
    this.storage[9] = yz - wx;
    this.storage[10] = 1.0 - (xx + yy);
    this.storage[11] = 0.0;
    this.storage[12] = arg0Storage[0];
    this.storage[13] = arg0Storage[1];
    this.storage[14] = arg0Storage[2];
    this.storage[15] = 1.0;
    return this;
};

/**
 * @method setFromTranslationRotationScale
 * @description Sets the matrix from [translation], [rotation] and [scale].
 * @param translation {Vector3}
 * @param rotation {Quaternion}
 * @param scale {Vector3}
 * @return {Matrix4}
 */
Matrix4.prototype.setFromTranslationRotationScale = function(translation, rotation, scale) {
    this.setFromTranslationRotation(translation, rotation);
    this.scale(scale);
    return this;
};

/**
 * @method setUpper2x2
 * @description Sets the upper 2x2 of the matrix to be [arg].
 * @param arg {Matrix2}
 * @return {Matrix4}
 */
Matrix4.prototype.setUpper2x2 = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = argStorage[0];
    this.storage[1] = argStorage[1];
    this.storage[4] = argStorage[2];
    this.storage[5] = argStorage[3];
    return this;
};

/**
 * @method setDiagonal
 * @description Sets the diagonal of the matrix to be [arg].
 * @param arg {Vector4}
 * @return {Matrix4}
 */
Matrix4.prototype.setDiagonal = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = argStorage[0];
    this.storage[5] = argStorage[1];
    this.storage[10] = argStorage[2];
    this.storage[15] = argStorage[3];
    return this;
};

/**
 * @method setOuter
 * @description Set [this] to the outer product of [u] and [v].
 * @param u {Vector4}
 * @param v {Vector4}
 */
Matrix4.prototype.setOuter = function(u, v) {
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.setOuter(this, u, v);
    }
    else {
        Matrix4.scalar.setOuter(this, u, v);
    }
};

Matrix4.scalar.setOuter = function(that, u, v) {
    var uStorage = u.storage;
    var vStorage = v.storage;
    this.storage[0] = uStorage[0] * vStorage[0];
    this.storage[1] = uStorage[0] * vStorage[1];
    this.storage[2] = uStorage[0] * vStorage[2];
    this.storage[3] = uStorage[0] * vStorage[3];
    this.storage[4] = uStorage[1] * vStorage[0];
    this.storage[5] = uStorage[1] * vStorage[1];
    this.storage[6] = uStorage[1] * vStorage[2];
    this.storage[7] = uStorage[1] * vStorage[3];
    this.storage[8] = uStorage[2] * vStorage[0];
    this.storage[9] = uStorage[2] * vStorage[1];
    this.storage[10] = uStorage[2] * vStorage[2];
    this.storage[11] = uStorage[2] * vStorage[3];
    this.storage[12] = uStorage[3] * vStorage[0];
    this.storage[13] = uStorage[3] * vStorage[1];
    this.storage[14] = uStorage[3] * vStorage[2];
    this.storage[15] = uStorage[3] * vStorage[3];
};
Matrix4.simd.setOuter = function(that, u, v) {
    Vector4.simd.load(u);
    Vector4.simd.load(v);
    that.simd_c0 = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u.simd_storage, 0, 0, 0, 0), v.simd_storage);
    that.simd_c1 = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u.simd_storage, 1, 1, 1, 1), v.simd_storage);
    that.simd_c2 = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u.simd_storage, 2, 2, 2, 2), v.simd_storage);
    that.simd_c3 = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u.simd_storage, 3, 3, 3, 3), v.simd_storage);
    Matrix4.simd.store(that);
};

/**
 * @method toString
 * @description Printable string
 * @return {string}
 */
Matrix4.prototype.toString = function() {
    return '[0] '+ this.getRow(0).toString() +
        '\n[1] ' + this.getRow(1).toString() +
        '\n[2] ' + this.getRow(2).toString() +
        '\n[3] ' + this.getRow(3).toString() + '}\n';
};

/**
 * @method getAt
 * @description Access the element of the matrix at the index [i].
 * @param i {number}
 * @return {Number}
 */
Matrix4.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * @method setAt
 * @description Set the element of the matrix at the index [i].
 * @param i {number}
 * @param v {number}
 */
Matrix4.prototype.setAt = function(i, v) {
    this.storage[i] = v;
};

/**
 * @method equals
 * @description Check if two matrices are the same.
 * @param other {Matrix4}
 * @return {boolean}
 */
Matrix4.prototype.equals = function(other) {
    if (other.dimension == null || other.dimension != 4) {
        return false;
    }
    return (this.storage[0] == other.storage[0]) &&
        (this.storage[1] == other.storage[1]) &&
        (this.storage[2] == other.storage[2]) &&
        (this.storage[3] == other.storage[3]) &&
        (this.storage[4] == other.storage[4]) &&
        (this.storage[5] == other.storage[5]) &&
        (this.storage[6] == other.storage[6]) &&
        (this.storage[7] == other.storage[7]) &&
        (this.storage[8] == other.storage[8]) &&
        (this.storage[9] == other.storage[9]) &&
        (this.storage[10] == other.storage[10]) &&
        (this.storage[11] == other.storage[11]) &&
        (this.storage[12] == other.storage[12]) &&
        (this.storage[13] == other.storage[13]) &&
        (this.storage[14] == other.storage[14]) &&
        (this.storage[15] == other.storage[15]);
};

/**
 * @method almostEquals
 * @description Check if two matrices are almost the same.
 * @param other {Matrix4}
 * @param precision {number}
 * @return {boolean}
 */
Matrix4.prototype.almostEquals = function(other, precision) {
    if (precision === undefined) {
        precision = vector_math.EPSILON;
    }

    if (vector_math.USE_SIMD()) {
        return Matrix4.simd.almostEquals(this, other, precision);
    }
    else {
        return Matrix4.scalar.almostEquals(this, other, precision);
    }
};
Matrix4.scalar.almostEquals = function(that, other, precision) {
    if (other.dimension == null || other.dimension != 4) {
        return false;
    }
    if ((Math.abs(that.storage[0] - other.storage[0]) > precision) ||
        (Math.abs(that.storage[1] - other.storage[1]) > precision) ||
        (Math.abs(that.storage[2] - other.storage[2]) > precision) ||
        (Math.abs(that.storage[3] - other.storage[3]) > precision) ||
        (Math.abs(that.storage[4] - other.storage[4]) > precision) ||
        (Math.abs(that.storage[5] - other.storage[5]) > precision) ||
        (Math.abs(that.storage[6] - other.storage[6]) > precision) ||
        (Math.abs(that.storage[7] - other.storage[7]) > precision) ||
        (Math.abs(that.storage[8] - other.storage[8]) > precision) ||
        (Math.abs(that.storage[9] - other.storage[9]) > precision) ||
        (Math.abs(that.storage[10] - other.storage[10]) > precision) ||
        (Math.abs(that.storage[11] - other.storage[11]) > precision) ||
        (Math.abs(that.storage[12] - other.storage[12]) > precision) ||
        (Math.abs(that.storage[13] - other.storage[13]) > precision) ||
        (Math.abs(that.storage[14] - other.storage[14]) > precision) ||
        (Math.abs(that.storage[15] - other.storage[15]) > precision)) {
        return false;
    }
    return true;
};

Matrix4.simd.almostEquals = function(that, other, p) {
    Matrix4.simd.load(that);
    Matrix4.simd.load(other);
    var eps = SIMD.Float32x4(p, p, p, p);
    that.simd_c0 = SIMD.Float32x4.sub(that.simd_c0, other.simd_c0);
    that.simd_c0 = SIMD.Float32x4.abs(that.simd_c0);
    that.simd_c0 = SIMD.Float32x4.greaterThan(that.simd_c0, eps);
    that.simd_c1 = SIMD.Float32x4.sub(that.simd_c1, other.simd_c1);
    that.simd_c1 = SIMD.Float32x4.abs(that.simd_c1);
    that.simd_c1 = SIMD.Float32x4.greaterThan(that.simd_c1, eps);
    that.simd_c2 = SIMD.Float32x4.sub(that.simd_c2, other.simd_c2);
    that.simd_c2 = SIMD.Float32x4.abs(that.simd_c2);
    that.simd_c2 = SIMD.Float32x4.greaterThan(that.simd_c2, eps);
    that.simd_c3 = SIMD.Float32x4.sub(that.simd_c3, other.simd_c3);
    that.simd_c3 = SIMD.Float32x4.abs(that.simd_c3);
    that.simd_c3 = SIMD.Float32x4.greaterThan(that.simd_c3, eps);
    if (SIMD.Bool32x4.extractLane(that.simd_c0, 0) ||
        SIMD.Bool32x4.extractLane(that.simd_c0, 1) ||
        SIMD.Bool32x4.extractLane(that.simd_c0, 2) ||
        SIMD.Bool32x4.extractLane(that.simd_c0, 3) ||
        SIMD.Bool32x4.extractLane(that.simd_c1, 0) ||
        SIMD.Bool32x4.extractLane(that.simd_c1, 1) ||
        SIMD.Bool32x4.extractLane(that.simd_c1, 2) ||
        SIMD.Bool32x4.extractLane(that.simd_c1, 3) ||
        SIMD.Bool32x4.extractLane(that.simd_c2, 0) ||
        SIMD.Bool32x4.extractLane(that.simd_c2, 1) ||
        SIMD.Bool32x4.extractLane(that.simd_c2, 2) ||
        SIMD.Bool32x4.extractLane(that.simd_c2, 3) ||
        SIMD.Bool32x4.extractLane(that.simd_c3, 0) ||
        SIMD.Bool32x4.extractLane(that.simd_c3, 1) ||
        SIMD.Bool32x4.extractLane(that.simd_c3, 2) ||
        SIMD.Bool32x4.extractLane(that.simd_c3, 3)) {
        return false;
    }
    return true;
};


/**
* @property
* row 0
* @type {Vector4}
*/
Matrix4.prototype.__defineGetter__("row0", function() {
    return this.getRow(0);
});
Matrix4.prototype.__defineSetter__("row0", function(v) {
    this.setRow(0, v);
});

/**
 * @property
 * row 1
 * @type {Vector4}
 */
Matrix4.prototype.__defineGetter__("row1", function() {
    return this.getRow(1);
});
Matrix4.prototype.__defineSetter__("row1", function(v) {
    this.setRow(1, v);
});

/**
 * @property
 * row 2
 * @type {Vector4}
 */
Matrix4.prototype.__defineGetter__("row2", function() {
    return this.getRow(2);
});
Matrix4.prototype.__defineSetter__("row2", function(v) {
    this.setRow(2, v);
});

/**
 * @property
 * row 3
 * @type {Vector4}
 */
Matrix4.prototype.__defineGetter__("row3", function() {
    return this.getRow(3);
});
Matrix4.prototype.__defineSetter__("row3", function(v) {
    this.setRow(3, v);
});

/**
 * @method
 * /// Sets [row] of the matrix to values in [arg]
 * @param row {Number}
 * @param arg {Vector4}
 */
Matrix4.prototype.setRow = function(row, arg) {
    var argStorage = arg.storage;
    this.storage[this.index(row, 0)] = argStorage[0];
    this.storage[this.index(row, 1)] = argStorage[1];
    this.storage[this.index(row, 2)] = argStorage[2];
    this.storage[this.index(row, 3)] = argStorage[3];
};

/**
 * @method getRow
 * @description Gets the [row] of the matrix
 * @param row {Number}
 * @return {Vector4}
 */
Matrix4.prototype.getRow = function(row) {
    var r = Vector4.zero();
    var rStorage = r.storage;
    rStorage[0] = this.storage[this.index(row, 0)];
    rStorage[1] = this.storage[this.index(row, 1)];
    rStorage[2] = this.storage[this.index(row, 2)];
    rStorage[3] = this.storage[this.index(row, 3)];
    return r;
};

/**
 * @method setColumn
 * @description Assigns the [column] of the matrix [arg]
 * @param column {Number}
 * @param arg {Vector4}
 */
Matrix4.prototype.setColumn = function(column, arg) {
    var argStorage = arg.storage;
    var entry = column * 3;
    this.storage[entry + 3] = argStorage[3];
    this.storage[entry + 2] = argStorage[2];
    this.storage[entry + 1] = argStorage[1];
    this.storage[entry + 0] = argStorage[0];
    return this;
};

/**
 * @method getColumn
 * @description Gets the [column] of the matrix
 * @param column {Number}
 * @return {Vector4}
 */
Matrix4.prototype.getColumn = function(column) {
    var r = Vector4.zero();
    var entry = column * 3;
    var rStorage = r.storage;
    rStorage[3] = this.storage[entry + 3];
    rStorage[2] = this.storage[entry + 2];
    rStorage[1] = this.storage[entry + 1];
    rStorage[0] = this.storage[entry + 0];
    return r;
};

/**
 * @method clone
 * @description Create a copy of [this].
 * @return {Matrix4}
 */
Matrix4.prototype.clone = function() {
    return Matrix4.copy(this);
};

/**
 * @method copyInto
 * @description Copy [this] into [arg].
 * @param arg {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.copyInto = function(arg) {
    arg.setFrom(this);
    return arg;
};

/**
 * @method mult
 * @description return a new vector or matrix by multiplying [this] with [arg].
 * @param arg
 * @return {*}
 */
Matrix4.prototype.mult = function(arg) {
    if (typeof arg == "Number") {
        return this.scaled(arg);
    }
    if (arg instanceof Vector4) {
        return this.transformed(arg);
    }
    if (arg instanceof Vector3) {
        return this.transformed3(arg);
    }
    if (arg.dimension == 4) {
        return this.multiplied(arg);
    }
    return null;
};

/**
 * @method added
 * @description return new matrix after component wise [this] + [arg]
 * @param arg {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.added = function(arg) {
    var m = this.clone();
    m.add(arg);
    return m;
};

/**
 * @method subbed
 * @description return new matrix after component wise [this] - [arg]
 * @param arg {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.subbed = function(arg) {
    var m = this.clone();
    m.sub(arg);
    return m;
};

/**
 * @method negated
 * @description return new matrix after negating [this]
 * @return {Matrix4}
 */
Matrix4.prototype.negated = function() {
    var m = this.clone();
    m.negate();
    return m;
};

/**
 * @method translate
 * @description Translate this matrix by a [Vector3], [Vector4], or x,y,z
 * @param x {Vector4|Vector3|number}
 * @param y {number}
 * @param z {number}
 * @return {Matrix4}
 */
Matrix4.prototype.translate = function(x, y, z) {
    var tx;
    var ty;
    var tz;
    var tw = x instanceof Vector4 ? x.w : 1.0;
    if (x instanceof Vector3 || x instanceof Vector4) {
        tx = x.x;
        ty = x.y;
        tz = x.z;
    } else {
        tx = x;
        ty = y;
        tz = z;
    }
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.translate(this, tx, ty, tz, tw);
    }
    else {
        Matrix4.scalar.translate(this, tx, ty, tz, tw);
    }
    return this;
};

Matrix4.scalar.translate = function(that, tx, ty, tz, tw) {
    var t1 = that.storage[0] * tx +
        that.storage[4] * ty +
        that.storage[8] * tz +
        that.storage[12] * tw;
    var t2 = that.storage[1] * tx +
        that.storage[5] * ty +
        that.storage[9] * tz +
        that.storage[13] * tw;
    var t3 = that.storage[2] * tx +
        that.storage[6] * ty +
        that.storage[10] * tz +
        that.storage[14] * tw;
    var t4 = that.storage[3] * tx +
        that.storage[7] * ty +
        that.storage[11] * tz +
        that.storage[15] * tw;
    that.storage[12] = t1;
    that.storage[13] = t2;
    that.storage[14] = t3;
    that.storage[15] = t4;
};
Matrix4.simd.translate = function(that, tx, ty, tz, tw) {
    Matrix4.simd.load(that);
    var vec = SIMD.Float32x4(tx, ty, tz, tw);

    t1 = SIMD.Float32x4.mul(that.simd_c0, SIMD.Float32x4.swizzle(vec, 0, 0, 0, 0));
    t2 = SIMD.Float32x4.mul(that.simd_c1, SIMD.Float32x4.swizzle(vec, 1, 1, 1, 1));
    t3 = SIMD.Float32x4.mul(that.simd_c2, SIMD.Float32x4.swizzle(vec, 2, 2, 2, 2));
    t4 = SIMD.Float32x4.mul(that.simd_c3, SIMD.Float32x4.swizzle(vec, 3, 3, 3, 3));
    that.simd_c3 = SIMD.Float32x4.add(t1, SIMD.Float32x4.add(t2, SIMD.Float32x4.add(t3, t4)));
    Matrix4.simd.store(that);
};

/**
 * @method rotate
 * @description Rotate this [angle] radians around [axis]
 * @param axis {Vector3}
 * @param angle {number}
 * @return {Matrix4}
 */
Matrix4.prototype.rotate = function(axis, angle) {
    var len = axis.length;
    var axisStorage = axis.storage;
    var x = axisStorage[0] / len;
    var y = axisStorage[1] / len;
    var z = axisStorage[2] / len;
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var C = 1.0 - c;
    var m11 = x * x * C + c;
    var m12 = x * y * C - z * s;
    var m13 = x * z * C + y * s;
    var m21 = y * x * C + z * s;
    var m22 = y * y * C + c;
    var m23 = y * z * C - x * s;
    var m31 = z * x * C - y * s;
    var m32 = z * y * C + x * s;
    var m33 = z * z * C + c;
    var t1 = this.storage[0] * m11 + this.storage[4] * m21 + this.storage[8] * m31;
    var t2 = this.storage[1] * m11 + this.storage[5] * m21 + this.storage[9] * m31;
    var t3 = this.storage[2] * m11 + this.storage[6] * m21 + this.storage[10] * m31;
    var t4 = this.storage[3] * m11 + this.storage[7] * m21 + this.storage[11] * m31;
    var t5 = this.storage[0] * m12 + this.storage[4] * m22 + this.storage[8] * m32;
    var t6 = this.storage[1] * m12 + this.storage[5] * m22 + this.storage[9] * m32;
    var t7 = this.storage[2] * m12 + this.storage[6] * m22 + this.storage[10] * m32;
    var t8 = this.storage[3] * m12 + this.storage[7] * m22 + this.storage[11] * m32;
    var t9 = this.storage[0] * m13 + this.storage[4] * m23 + this.storage[8] * m33;
    var t10 = this.storage[1] * m13 + this.storage[5] * m23 + this.storage[9] * m33;
    var t11 = this.storage[2] * m13 + this.storage[6] * m23 + this.storage[10] * m33;
    var t12 = this.storage[3] * m13 + this.storage[7] * m23 + this.storage[11] * m33;
    this.storage[0] = t1;
    this.storage[1] = t2;
    this.storage[2] = t3;
    this.storage[3] = t4;
    this.storage[4] = t5;
    this.storage[5] = t6;
    this.storage[6] = t7;
    this.storage[7] = t8;
    this.storage[8] = t9;
    this.storage[9] = t10;
    this.storage[10] = t11;
    this.storage[11] = t12;
    return this;
};


/**
 * @method rotateX
 * @description Rotate this [angle] radians around X
 * @param angle {number}
 * @return {Matrix4}
 */
Matrix4.prototype.rotateX = function(angle) {
    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    var t1 = this.storage[4] * cosAngle + this.storage[8] * sinAngle;
    var t2 = this.storage[5] * cosAngle + this.storage[9] * sinAngle;
    var t3 = this.storage[6] * cosAngle + this.storage[10] * sinAngle;
    var t4 = this.storage[7] * cosAngle + this.storage[11] * sinAngle;
    var t5 = this.storage[4] * -sinAngle + this.storage[8] * cosAngle;
    var t6 = this.storage[5] * -sinAngle + this.storage[9] * cosAngle;
    var t7 = this.storage[6] * -sinAngle + this.storage[10] * cosAngle;
    var t8 = this.storage[7] * -sinAngle + this.storage[11] * cosAngle;
    this.storage[4] = t1;
    this.storage[5] = t2;
    this.storage[6] = t3;
    this.storage[7] = t4;
    this.storage[8] = t5;
    this.storage[9] = t6;
    this.storage[10] = t7;
    this.storage[11] = t8;
    return this;
};

/**
 * @method rotateY
 * @description Rotate this matrix [angle] radians around Y
 * @param angle {number}
 * @return {Matrix4}
 */
Matrix4.prototype.rotateY = function(angle) {
    var cosAngle = Math.cos(angle);
    var sinAngle = Math.sin(angle);
    var t1 = this.storage[0] * cosAngle + this.storage[8] * -sinAngle;
    var t2 = this.storage[1] * cosAngle + this.storage[9] * -sinAngle;
    var t3 = this.storage[2] * cosAngle + this.storage[10] * -sinAngle;
    var t4 = this.storage[3] * cosAngle + this.storage[11] * -sinAngle;
    var t5 = this.storage[0] * sinAngle + this.storage[8] * cosAngle;
    var t6 = this.storage[1] * sinAngle + this.storage[9] * cosAngle;
    var t7 = this.storage[2] * sinAngle + this.storage[10] * cosAngle;
    var t8 = this.storage[3] * sinAngle + this.storage[11] * cosAngle;
    this.storage[0] = t1;
    this.storage[1] = t2;
    this.storage[2] = t3;
    this.storage[3] = t4;
    this.storage[8] = t5;
    this.storage[9] = t6;
    this.storage[10] = t7;
    this.storage[11] = t8;
    return this;
};

/**
 * @method rotateZ
 * @description Rotate this matrix [angle] radians around Z
 * @param angle {number}
 * @return {Matrix4}
 */
Matrix4.prototype.rotateZ = function(angle) {
    var  cosAngle = Math.cos(angle);
    var  sinAngle = Math.sin(angle);
    var t1 = this.storage[0] * cosAngle + this.storage[4] * sinAngle;
    var t2 = this.storage[1] * cosAngle + this.storage[5] * sinAngle;
    var t3 = this.storage[2] * cosAngle + this.storage[6] * sinAngle;
    var t4 = this.storage[3] * cosAngle + this.storage[7] * sinAngle;
    var t5 = this.storage[0] * -sinAngle + this.storage[4] * cosAngle;
    var t6 = this.storage[1] * -sinAngle + this.storage[5] * cosAngle;
    var t7 = this.storage[2] * -sinAngle + this.storage[6] * cosAngle;
    var t8 = this.storage[3] * -sinAngle + this.storage[7] * cosAngle;
    this.storage[0] = t1;
    this.storage[1] = t2;
    this.storage[2] = t3;
    this.storage[3] = t4;
    this.storage[4] = t5;
    this.storage[5] = t6;
    this.storage[6] = t7;
    this.storage[7] = t8;
    return this;
};


/**
 * @method scale
 * @description Scale this matrix by a [Vector3], [Vector4], or x,y,z
 * @param x {Vector4 | Vector3 | number}
 * @param y {number | undefined}
 * @param z {number | undefined}
 * @return {Matrix4}
 */
Matrix4.prototype.scale = function(x, y, z) {
    var sx;
    var sy;
    var sz;
    var sw = x instanceof Vector4 ? x.w : 1.0;
    if (x instanceof Vector3 || x instanceof Vector4) {
        sx = x.x;
        sy = x.y;
        sz = x.z;
    } else {
        sx = x;
        sy = y;
        sz = z;
    }
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.scale(this, sx, sy, sz, sw);
    }
    else {
        Matrix4.scalar.scale(this, sx, sy, sz, sw);
    }
    return this;
};

Matrix4.scalar.scale = function(that, sx, sy, sz, sw) {
    that.storage[0] *= sx;
    that.storage[1] *= sx;
    that.storage[2] *= sx;
    that.storage[3] *= sx;
    that.storage[4] *= sy;
    that.storage[5] *= sy;
    that.storage[6] *= sy;
    that.storage[7] *= sy;
    that.storage[8] *= sz;
    that.storage[9] *= sz;
    that.storage[10] *= sz;
    that.storage[11] *= sz;
    that.storage[12] *= sw;
    that.storage[13] *= sw;
    that.storage[14] *= sw;
    that.storage[15] *= sw;
};
Matrix4.simd.scale = function(that, sx, sy, sz, sw) {
    Matrix4.simd.load(that);
    that.simd_c0 = SIMD.Float32x4.mul(that.simd_c0, SIMD.Float32x4(sx, sx, sx, sx));
    that.simd_c1 = SIMD.Float32x4.mul(that.simd_c1, SIMD.Float32x4(sy, sy, sy, sy));
    that.simd_c2 = SIMD.Float32x4.mul(that.simd_c2, SIMD.Float32x4(sz, sz, sz, sz));
    that.simd_c3 = SIMD.Float32x4.mul(that.simd_c3, SIMD.Float32x4(sw, sw, sw, sw));
    Matrix4.simd.store(that);
};

/**
 * @method scaled
 * @description Create a copy of [this] scaled by a [Vector3], [Vector4] or [x],[y], and [z].
 * @param x
 * @param y
 * @param z
 * @return {Matrix4}
 */
Matrix4.prototype.scaled = function(x, y, z) {
    var m = this.clone();
    m.scale(x, y, z);
    return m;
};

/**
 * @method setZero
 * @description Zeros [this].
 * @return {Matrix4}
 */
Matrix4.prototype.setZero = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    this.storage[4] = 0.0;
    this.storage[5] = 0.0;
    this.storage[6] = 0.0;
    this.storage[7] = 0.0;
    this.storage[8] = 0.0;
    this.storage[9] = 0.0;
    this.storage[10] = 0.0;
    this.storage[11] = 0.0;
    this.storage[12] = 0.0;
    this.storage[13] = 0.0;
    this.storage[14] = 0.0;
    this.storage[15] = 0.0;
    return this;
};


/**
 * @method setIdentity
 * @description Makes [this] into the identity matrix.
 * @return {Matrix4}
 */
Matrix4.prototype.setIdentity = function() {
    this.storage[0] = 1.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    this.storage[4] = 0.0;
    this.storage[5] = 1.0;
    this.storage[6] = 0.0;
    this.storage[7] = 0.0;
    this.storage[8] = 0.0;
    this.storage[9] = 0.0;
    this.storage[10] = 1.0;
    this.storage[11] = 0.0;
    this.storage[12] = 0.0;
    this.storage[13] = 0.0;
    this.storage[14] = 0.0;
    this.storage[15] = 1.0;
    return this;
};

/**
 * @method transposed
 * @description return the tranpose copy of this.
 * @return {Matrix4}
 */
Matrix4.prototype.transposed = function() {
    var m = this.clone();
    m.transpose();
    return m;
};

/**
 * @method transpose
 * @description transpose this.
 * @return {Matrix4}
 */
Matrix4.prototype.transpose = function() {
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.transpose(this);
    }
    else {
        Matrix4.scalar.transpose(this);
    }
    return this;
};
Matrix4.scalar.transpose = function(that) {
    var temp;
    temp = that.storage[4];
    that.storage[4] = that.storage[1];
    that.storage[1] = temp;
    temp = that.storage[8];
    that.storage[8] = that.storage[2];
    that.storage[2] = temp;
    temp = that.storage[12];
    that.storage[12] = that.storage[3];
    that.storage[3] = temp;
    temp = that.storage[9];
    that.storage[9] = that.storage[6];
    that.storage[6] = temp;
    temp = that.storage[13];
    that.storage[13] = that.storage[7];
    that.storage[7] = temp;
    temp = that.storage[14];
    that.storage[14] = that.storage[11];
    that.storage[11] = temp;
};
Matrix4.simd.transpose = function(that) {
    Matrix4.simd.load(that);
    var tmp01 = SIMD.Float32x4.shuffle(that.simd_c0, that.simd_c1, 0, 1, 4, 5);
    var tmp23 = SIMD.Float32x4.shuffle(that.simd_c2, that.simd_c3, 0, 1, 4, 5);
    var out0  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    var out1  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    tmp01 = SIMD.Float32x4.shuffle(that.simd_c0, that.simd_c1, 2, 3, 6, 7);
    tmp23 = SIMD.Float32x4.shuffle(that.simd_c2, that.simd_c3, 2, 3, 6, 7);
    var out2  = SIMD.Float32x4.shuffle(tmp01, tmp23, 0, 2, 4, 6);
    var out3  = SIMD.Float32x4.shuffle(tmp01, tmp23, 1, 3, 5, 7);
    that.simd_c0 = out0;
    that.simd_c1 = out1;
    that.simd_c2 = out2;
    that.simd_c3 = out3;
    Matrix4.simd.store(that);
};

/**
 * @method absolute
 * @description return the component wise absolute value copy of that.
 * @return {Matrix4}
 */
Matrix4.prototype.absolute = function() {
    if (vector_math.USE_SIMD()) {
        return Matrix4.simd.absolute(this);
    }
    else {
        return Matrix4.scalar.absolute(this);
    }
};
Matrix4.scalar.absolute = function(that) {
    var r = Matrix4.zero();
    var rStorage = r.storage;
    rStorage[0] = Math.abs(that.storage[0]);
    rStorage[1] = Math.abs(that.storage[1]);
    rStorage[2] = Math.abs(that.storage[2]);
    rStorage[3] = Math.abs(that.storage[3]);
    rStorage[4] = Math.abs(that.storage[4]);
    rStorage[5] = Math.abs(that.storage[5]);
    rStorage[6] = Math.abs(that.storage[6]);
    rStorage[7] = Math.abs(that.storage[7]);
    rStorage[8] = Math.abs(that.storage[8]);
    rStorage[9] = Math.abs(that.storage[9]);
    rStorage[10] = Math.abs(that.storage[10]);
    rStorage[11] = Math.abs(that.storage[11]);
    rStorage[12] = Math.abs(that.storage[12]);
    rStorage[13] = Math.abs(that.storage[13]);
    rStorage[14] = Math.abs(that.storage[14]);
    rStorage[15] = Math.abs(that.storage[15]);
    return r;
};
Matrix4.simd.absolute = function(that) {
    Matrix4.simd.load(that);
    that.simd_c0 = SIMD.Float32x4.abs(that.simd_c0);
    that.simd_c1 = SIMD.Float32x4.abs(that.simd_c1);
    that.simd_c2 = SIMD.Float32x4.abs(that.simd_c2);
    that.simd_c3 = SIMD.Float32x4.abs(that.simd_c3);
    Matrix4.simd.store(that);
};

/**
 * @method determinant
 * @description return the determinant of this matrix.
 * @return {number}
 */
Matrix4.prototype.determinant = function() {
    var det2_01_01 =
        this.storage[0] * this.storage[5] - this.storage[1] * this.storage[4];
    var det2_01_02 =
        this.storage[0] * this.storage[6] - this.storage[2] * this.storage[4];
    var det2_01_03 =
        this.storage[0] * this.storage[7] - this.storage[3] * this.storage[4];
    var det2_01_12 =
        this.storage[1] * this.storage[6] - this.storage[2] * this.storage[5];
    var det2_01_13 =
        this.storage[1] * this.storage[7] - this.storage[3] * this.storage[5];
    var det2_01_23 =
        this.storage[2] * this.storage[7] - this.storage[3] * this.storage[6];
    var det3_201_012 = this.storage[8] * det2_01_12 -
    this.storage[9] * det2_01_02 +
    this.storage[10] * det2_01_01;
    var det3_201_013 = this.storage[8] * det2_01_13 -
    this.storage[9] * det2_01_03 +
    this.storage[11] * det2_01_01;
    var det3_201_023 = this.storage[8] * det2_01_23 -
    this.storage[10] * det2_01_03 +
    this.storage[11] * det2_01_02;
    var det3_201_123 = this.storage[9] * det2_01_23 -
    this.storage[10] * det2_01_13 +
    this.storage[11] * det2_01_12;
    return -det3_201_123 * this.storage[12] +
        det3_201_023 * this.storage[13] -
        det3_201_013 * this.storage[14] +
        det3_201_012 * this.storage[15];
};

/**
 * @method dotRow
 * @description return the dot product of row [i] and [v].
 * @param i {number}
 * @param v {Vector4}
 * @return {number}
 */
Matrix4.prototype.dotRow = function(i, v) {
    var vStorage = v.storage;
    return this.storage[i] * vStorage[0] +
           this.storage[4 + i] * vStorage[1] +
           this.storage[8 + i] * vStorage[2] +
           this.storage[12 + i] * vStorage[3];
};

/**
 * @method dotColumn
 * @description return the dot product of column [j] and [v].
 * @param j {number}
 * @param v {Vector4}
 * @return {number}
 */
Matrix4.prototype.dotColumn = function(j, v) {
    var vStorage = v.storage;
    return this.storage[j * 4] * vStorage[0] +
           this.storage[j * 4 + 1] * vStorage[1] +
           this.storage[j * 4 + 2] * vStorage[2] +
           this.storage[j * 4 + 3] * vStorage[3];
};

/**
 * @method trace
 * @description return the trace of the matrix. The trace of a matrix is the sum of the diagonal entries.
 * @return {number}
 */
Matrix4.prototype.trace = function() {
    var t = 0.0;
    t += this.storage[0];
    t += this.storage[5];
    t += this.storage[10];
    t += this.storage[15];
    return t;
};

/**
 * @method infinityNorm
 * @description return infinity norm of the matrix. Used for numerical analysis.
 * @return {number}
 */
Matrix4.prototype.infinityNorm = function() {
    var norm = 0.0;
    {
        var row_norm = 0.0;
        row_norm += Math.abs(this.storage[0]);
        row_norm += Math.abs(this.storage[1]);
        row_norm += Math.abs(this.storage[2]);
        row_norm += Math.abs(this.storage[3]);
        norm = row_norm > norm ? row_norm : norm;
    }
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[4]);
        row_norm += Math.abs(this.storage[5]);
        row_norm += Math.abs(this.storage[6]);
        row_norm += Math.abs(this.storage[7]);
        norm = row_norm > norm ? row_norm : norm;
    }
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[8]);
        row_norm += Math.abs(this.storage[9]);
        row_norm += Math.abs(this.storage[10]);
        row_norm += Math.abs(this.storage[11]);
        norm = row_norm > norm ? row_norm : norm;
    }
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[12]);
        row_norm += Math.abs(this.storage[13]);
        row_norm += Math.abs(this.storage[14]);
        row_norm += Math.abs(this.storage[15]);
        norm = row_norm > norm ? row_norm : norm;
    }
    return norm;
};

/**
 * @method relativeError
 * @description return relative error between [this] and [correct]
 * @param correct {Matrix4}
 */
Matrix4.prototype.relativeError = function(correct) {
    var diff = correct.subbed(this);
    var correct_norm = correct.infinityNorm();
    var diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
};

/**
 * @method absoluteError
 * @description return absolute error between [this] and [correct]
 * @param correct
 * @return {number}
 */
Matrix4.prototype.absoluteError = function(correct) {
    var this_norm = this.infinityNorm();
    var correct_norm = correct.infinityNorm();
    var diff_norm = Math.abs(this_norm - correct_norm);
    return diff_norm;
};


/**
 * @method getTranslation
 * @description return the translation vector from this homogeneous transformation matrix.
 * @return {Vector3}
 */
Matrix4.prototype.getTranslation = function() {
    var z = this.storage[14];
    var y = this.storage[13];
    var x = this.storage[12];
    return new Vector3(x, y, z);
};

/**
 * @method setTranslation
 * @description Sets the translation vector in this homogeneous transformation matrix.
 * @param t {Vector3}
 */
Matrix4.prototype.setTranslation = function(t) {
    var tStorage = t.storage;
    var z = tStorage[2];
    var y = tStorage[1];
    var x = tStorage[0];
    this.storage[14] = z;
    this.storage[13] = y;
    this.storage[12] = x;
};

/**
 * @method getRotation
 * @description return the rotation matrix from this homogeneous transformation matrix.
 * @return {Matrix3}
 */
Matrix4.prototype.getRotation = function() {
    var r = Matrix3.zero();
    this.copyRotation(r);
    return r;
};

/**
 * @method copyRotation
 * @description Copies the rotation matrix from this homogeneous transformation matrix into [rotation].
 * @param rotation {Matrix3}
 */
Matrix4.prototype.copyRotation = function(rotation) {
    var rStorage = rotation.storage;
    rStorage[0] = this.storage[0];
    rStorage[1] = this.storage[1];
    rStorage[2] = this.storage[2];
    rStorage[3] = this.storage[4];
    rStorage[4] = this.storage[5];
    rStorage[5] = this.storage[6];
    rStorage[6] = this.storage[8];
    rStorage[7] = this.storage[9];
    rStorage[8] = this.storage[10];
};

/**
 * @method setRotation
 * @description Sets the rotation matrix in this homogeneous transformation matrix.
 * @param r {Matrix3}
 */
Matrix4.prototype.setRotation = function(r) {
    var rStorage = r.storage;
    this.storage[0] = rStorage[0];
    this.storage[1] = rStorage[1];
    this.storage[2] = rStorage[2];
    this.storage[4] = rStorage[3];
    this.storage[5] = rStorage[4];
    this.storage[6] = rStorage[5];
    this.storage[8] = rStorage[6];
    this.storage[9] = rStorage[7];
    this.storage[10] = rStorage[8];
};

/**
 * @method getNormalMatrix
 * @description return the normal matrix from this homogeneous transformation matrix. The normal
 * matrix is the transpose of the inverse of the top-left 3x3 part of this 4x4 matrix.
 * @return {Matrix3}
 */
Matrix4.prototype.getNormalMatrix = function() {
    var m = Matrix3.identity();
    m.copyNormalMatrix(this);
    return m;
};


/**
 * @method getMaxScaleOnAxis
 * @description return the max scale value of the 3 axes.
 * @return {number}
 */
Matrix4.prototype.getMaxScaleOnAxis = function() {
    var scaleXSq = this.storage[0] * this.storage[0] +
    this.storage[1] * this.storage[1] +
    this.storage[2] * this.storage[2];
    var scaleYSq = this.storage[4] * this.storage[4] +
    this.storage[5] * this.storage[5] +
    this.storage[6] * this.storage[6];
    var scaleZSq = this.storage[8] * this.storage[8] +
    this.storage[9] * this.storage[9] +
    this.storage[10] * this.storage[10];
    return Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq, scaleZSq)));
};

/**
 * @method transposeRotation
 * @description Transposes just the upper 3x3 rotation matrix.
 * @return {Matrix4}
 */
Matrix4.prototype.transposeRotation = function() {
    var temp;
    temp = this.storage[1];
    this.storage[1] = this.storage[4];
    this.storage[4] = temp;
    temp = this.storage[2];
    this.storage[2] = this.storage[8];
    this.storage[8] = temp;
    temp = this.storage[4];
    this.storage[4] = this.storage[1];
    this.storage[1] = temp;
    temp = this.storage[6];
    this.storage[6] = this.storage[9];
    this.storage[9] = temp;
    temp = this.storage[8];
    this.storage[8] = this.storage[2];
    this.storage[2] = temp;
    temp = this.storage[9];
    this.storage[9] = this.storage[6];
    this.storage[6] = temp;
    return this;
};

/**
 * @method invert
 * @description Invert [this].
 */
Matrix4.prototype.invert = function() {
    this.copyInverse(this);
};

/**
 * @method copyInverse
 * @description Set this matrix to be the inverse of [arg]
 * @param arg {Matrix4}
 * @return {number}
 */
Matrix4.prototype.copyInverse = function(arg) {
    if (vector_math.USE_SIMD()) {
        return Matrix4.simd.copyInverse(this, arg);
    }
    else {
        return Matrix4.scalar.copyInverse(this, arg);
    }
};

Matrix4.scalar.copyInverse = function(that, arg) {
    var argStorage = arg.storage;
    var a00 = argStorage[0];
    var a01 = argStorage[1];
    var a02 = argStorage[2];
    var a03 = argStorage[3];
    var m000 = argStorage[4];
    var m001 = argStorage[5];
    var m002 = argStorage[6];
    var m003 = argStorage[7];
    var m100 = argStorage[8];
    var m101 = argStorage[9];
    var m102 = argStorage[10];
    var m103 = argStorage[11];
    var m200 = argStorage[12];
    var m201 = argStorage[13];
    var m202 = argStorage[14];
    var m203 = argStorage[15];
    var b00 = a00 * m001 - a01 * m000;
    var b01 = a00 * m002 - a02 * m000;
    var b02 = a00 * m003 - a03 * m000;
    var b03 = a01 * m002 - a02 * m001;
    var b04 = a01 * m003 - a03 * m001;
    var b05 = a02 * m003 - a03 * m002;
    var b06 = m100 * m201 - m101 * m200;
    var b07 = m100 * m202 - m102 * m200;
    var b08 = m100 * m203 - m103 * m200;
    var b09 = m101 * m202 - m102 * m201;
    var m010 = m101 * m203 - m103 * m201;
    var m011 = m102 * m203 - m103 * m202;
    var det =
        (b00 * m011 - b01 * m010 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    if (det == 0.0) {
        that.setFrom(arg);
        return 0.0;
    }
    var invDet = 1.0 / det;
    that.storage[0] = (m001 * m011 - m002 * m010 + m003 * b09) * invDet;
    that.storage[1] = (-a01 * m011 + a02 * m010 - a03 * b09) * invDet;
    that.storage[2] = (m201 * b05 - m202 * b04 + m203 * b03) * invDet;
    that.storage[3] = (-m101 * b05 + m102 * b04 - m103 * b03) * invDet;
    that.storage[4] = (-m000 * m011 + m002 * b08 - m003 * b07) * invDet;
    that.storage[5] = (a00 * m011 - a02 * b08 + a03 * b07) * invDet;
    that.storage[6] = (-m200 * b05 + m202 * b02 - m203 * b01) * invDet;
    that.storage[7] = (m100 * b05 - m102 * b02 + m103 * b01) * invDet;
    that.storage[8] = (m000 * m010 - m001 * b08 + m003 * b06) * invDet;
    that.storage[9] = (-a00 * m010 + a01 * b08 - a03 * b06) * invDet;
    that.storage[10] = (m200 * b04 - m201 * b02 + m203 * b00) * invDet;
    that.storage[11] = (-m100 * b04 + m101 * b02 - m103 * b00) * invDet;
    that.storage[12] = (-m000 * b09 + m001 * b07 - m002 * b06) * invDet;
    that.storage[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    that.storage[14] = (-m200 * b03 + m201 * b01 - m202 * b00) * invDet;
    that.storage[15] = (m100 * b03 - m101 * b01 + m102 * b00) * invDet;
    return det;
};
Matrix4.simd.copyInverse = function(that, arg) {
    var row0, row1, row2, row3,
        tmp1,
        minor0, minor1, minor2, minor3,
        det;
    Matrix4.simd.load(arg);

    // Compute matrix adjugate
    tmp1 = SIMD.Float32x4.shuffle(arg.simd_c0, arg.simd_c1, 0, 1, 4, 5);
    row1 = SIMD.Float32x4.shuffle(arg.simd_c2, arg.simd_c3, 0, 1, 4, 5);
    row0 = SIMD.Float32x4.shuffle(tmp1, row1, 0, 2, 4, 6);
    row1 = SIMD.Float32x4.shuffle(row1, tmp1, 1, 3, 5, 7);
    tmp1 = SIMD.Float32x4.shuffle(arg.simd_c0, arg.simd_c1, 2, 3, 6, 7);
    row3 = SIMD.Float32x4.shuffle(arg.simd_c2, arg.simd_c3, 2, 3, 6, 7);
    row2 = SIMD.Float32x4.shuffle(tmp1, row3, 0, 2, 4, 6);
    row3 = SIMD.Float32x4.shuffle(row3, tmp1, 1, 3, 5, 7);

    tmp1   = SIMD.Float32x4.mul(row2, row3);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
    minor0 = SIMD.Float32x4.mul(row1, tmp1);
    minor1 = SIMD.Float32x4.mul(row0, tmp1);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
    minor0 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row1, tmp1), minor0);
    minor1 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor1);
    minor1 = SIMD.Float32x4.swizzle(minor1, 2, 3, 0, 1);

    tmp1   = SIMD.Float32x4.mul(row1, row2);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
    minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor0);
    minor3 = SIMD.Float32x4.mul(row0, tmp1);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
    minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row3, tmp1));
    minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor3);
    minor3 = SIMD.Float32x4.swizzle(minor3, 2, 3, 0, 1);

    tmp1   = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(row1, 2, 3, 0, 1), row3);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
    row2   = SIMD.Float32x4.swizzle(row2, 2, 3, 0, 1);
    minor0 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor0);
    minor2 = SIMD.Float32x4.mul(row0, tmp1);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
    minor0 = SIMD.Float32x4.sub(minor0, SIMD.Float32x4.mul(row2, tmp1));
    minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row0, tmp1), minor2);
    minor2 = SIMD.Float32x4.swizzle(minor2, 2, 3, 0, 1);

    tmp1   = SIMD.Float32x4.mul(row0, row1);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
    minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor2);
    minor3 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row2, tmp1), minor3);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
    minor2 = SIMD.Float32x4.sub(SIMD.Float32x4.mul(row3, tmp1), minor2);
    minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row2, tmp1));

    tmp1   = SIMD.Float32x4.mul(row0, row3);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
    minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row2, tmp1));
    minor2 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor2);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
    minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row2, tmp1), minor1);
    minor2 = SIMD.Float32x4.sub(minor2, SIMD.Float32x4.mul(row1, tmp1));

    tmp1   = SIMD.Float32x4.mul(row0, row2);
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 1, 0, 3, 2);
    minor1 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row3, tmp1), minor1);
    minor3 = SIMD.Float32x4.sub(minor3, SIMD.Float32x4.mul(row1, tmp1));
    tmp1   = SIMD.Float32x4.swizzle(tmp1, 2, 3, 0, 1);
    minor1 = SIMD.Float32x4.sub(minor1, SIMD.Float32x4.mul(row3, tmp1));
    minor3 = SIMD.Float32x4.add(SIMD.Float32x4.mul(row1, tmp1), minor3);

    // Compute matrix determinant
    det   = SIMD.Float32x4.mul(row0, minor0);
    det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 2, 3, 0, 1), det);
    det   = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(det, 1, 0, 3, 2), det);
    tmp1  = SIMD.Float32x4.reciprocalApproximation(det);
    det   = SIMD.Float32x4.sub(
        SIMD.Float32x4.add(tmp1, tmp1),
        SIMD.Float32x4.mul(det, SIMD.Float32x4.mul(tmp1, tmp1)));
    det = SIMD.Float32x4.swizzle(det, 0, 0, 0, 0);
    real_det = SIMD.Float32x4.extractLane(det, 0);
    if (real_det == 0.0) {
        that.setFrom(arg);
        return 0.0;
    }
    that.simd_c0 = SIMD.Float32x4.mul(det, minor0);
    that.simd_c1 = SIMD.Float32x4.mul(det, minor1);
    that.simd_c2 = SIMD.Float32x4.mul(det, minor2);
    that.simd_c3 = SIMD.Float32x4.mul(det, minor3);
    Matrix4.simd.store(that);
    return 1 / real_det;
};

/**
 * @method invertRotation
 * @return {number}
 */
Matrix4.prototype.invertRotation = function() {
    var det = this.determinant();
    if (det == 0.0) {
        return 0.0;
    }
    var invDet = 1.0 / det;
    var ix;
    var iy;
    var iz;
    var jx;
    var jy;
    var jz;
    var kx;
    var ky;
    var kz;
    ix = invDet *
    (this.storage[5] * this.storage[10] - this.storage[6] * this.storage[9]);
    iy = invDet *
    (this.storage[2] * this.storage[9] - this.storage[1] * this.storage[10]);
    iz = invDet *
    (this.storage[1] * this.storage[6] - this.storage[2] * this.storage[5]);
    jx = invDet *
    (this.storage[6] * this.storage[8] - this.storage[4] * this.storage[10]);
    jy = invDet *
    (this.storage[0] * this.storage[10] - this.storage[2] * this.storage[8]);
    jz = invDet *
    (this.storage[2] * this.storage[4] - this.storage[0] * this.storage[6]);
    kx = invDet *
    (this.storage[4] * this.storage[9] - this.storage[5] * this.storage[8]);
    ky = invDet *
    (this.storage[1] * this.storage[8] - this.storage[0] * this.storage[9]);
    kz = invDet *
    (this.storage[0] * this.storage[5] - this.storage[1] * this.storage[4]);
    this.storage[0] = ix;
    this.storage[1] = iy;
    this.storage[2] = iz;
    this.storage[4] = jx;
    this.storage[5] = jy;
    this.storage[6] = jz;
    this.storage[8] = kx;
    this.storage[9] = ky;
    this.storage[10] = kz;
    return det;
};

/**
 * @method setRotationX
 * @description Sets the upper 3x3 to a rotation of [radians] around X
 * @param radians
 */
Matrix4.prototype.setRotationX = function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    this.storage[0] = 1.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[4] = 0.0;
    this.storage[5] = c;
    this.storage[6] = s;
    this.storage[8] = 0.0;
    this.storage[9] = -s;
    this.storage[10] = c;
    this.storage[3] = 0.0;
    this.storage[7] = 0.0;
    this.storage[11] = 0.0;
};

/**
 * @method setRotationY
 * @description Sets the upper 3x3 to a rotation of [radians] around Y
 * @param radians {number}
 */
Matrix4.prototype.setRotationY = function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    this.storage[0] = c;
    this.storage[1] = 0.0;
    this.storage[2] = -s;
    this.storage[4] = 0.0;
    this.storage[5] = 1.0;
    this.storage[6] = 0.0;
    this.storage[8] = s;
    this.storage[9] = 0.0;
    this.storage[10] = c;
    this.storage[3] = 0.0;
    this.storage[7] = 0.0;
    this.storage[11] = 0.0;
};

/**
 * @method setRotationZ
 * @description Sets the upper 3x3 to a rotation of [radians] around Z
 * @param radians {number}
 */
Matrix4.prototype.setRotationZ = function(radians) {
    var c = Math.cos(radians);
    var s = Math.sin(radians);
    this.storage[0] = c;
    this.storage[1] = s;
    this.storage[2] = 0.0;
    this.storage[4] = -s;
    this.storage[5] = c;
    this.storage[6] = 0.0;
    this.storage[8] = 0.0;
    this.storage[9] = 0.0;
    this.storage[10] = 1.0;
    this.storage[3] = 0.0;
    this.storage[7] = 0.0;
    this.storage[11] = 0.0;
};

/**
 * @method scaleAdjoint
 * @description Converts into Adjugate matrix and scales by [scale]
 * @param scale {number}
 * @return {Matrix4}
 */
Matrix4.prototype.scaleAdjoint = function(scale) {
    if (vector_math.USE_SIMD()) {
        Matrix4.scalar.scaleAdjoint(this, scale);
    }
    else {
       Matrix4.scalar.scaleAdjoint(this, scale);
    }
    return this;
};

Matrix4.scalar.scaleAdjoint = function(that, scale) {
    // Adapted from code by Richard Carling.
    var m00 = that.storage[0];
    var m01 = that.storage[4];
    var m02 = that.storage[8];
    var m03 = that.storage[12];
    var m10 = that.storage[1];
    var m11 = that.storage[5];
    var m12 = that.storage[9];
    var m13 = that.storage[13];
    var m20 = that.storage[2];
    var m21 = that.storage[6];
    var m22 = that.storage[10];
    var m23 = that.storage[14];
    var m30 = that.storage[3];
    var m31 = that.storage[7];
    var m32 = that.storage[11];
    var m33 = that.storage[15];
    that.storage[0] = scale * (m11 * (m22 * m33 - m32 * m23) -
                               m12 * (m21 * m33 - m31 * m23) +
                               m13 * (m21 * m32 - m31 * m22));
    that.storage[1] = -scale * (m10 * (m22 * m33 - m32 * m23) -
                                m12 * (m20 * m33 - m30 * m23) +
                                m13 * (m20 * m32 - m30 * m22));
    that.storage[2] = scale * (m10 * (m21 * m33 - m31 * m23) -
                               m11 * (m20 * m33 - m30 * m23) +
                               m13 * (m20 * m31 - m30 * m21));
    that.storage[3] = -scale * (m10 * (m21 * m32 - m31 * m22) -
                                m11 * (m20 * m32 - m30 * m22) +
                                m12 * (m20 * m31 - m30 * m21));


    that.storage[4] = -scale * (m01 * (m22 * m33 - m32 * m23) -
                                m02 * (m21 * m33 - m31 * m23) +
                                m03 * (m21 * m32 - m31 * m22));
    that.storage[5] = scale * (m00 * (m22 * m33 - m32 * m23) -
                               m02 * (m20 * m33 - m30 * m23) +
                               m03 * (m20 * m32 - m30 * m22));
    that.storage[6] = -scale * (m00 * (m21 * m33 - m31 * m23) -
                                m01 * (m20 * m33 - m30 * m23) +
                                m03 * (m20 * m31 - m30 * m21));
    that.storage[7] = scale * (m00 * (m21 * m32 - m31 * m22) -
                               m01 * (m20 * m32 - m30 * m22) +
                               m02 * (m20 * m31 - m30 * m21));


    that.storage[8] = scale * (m01 * (m12 * m33 - m32 * m13) -
                               m02 * (m11 * m33 - m31 * m13) +
                               m03 * (m11 * m32 - m31 * m12));
    that.storage[9] = -scale * (m00 * (m12 * m33 - m32 * m13) -
                                m02 * (m10 * m33 - m30 * m13) +
                                m03 * (m10 * m32 - m30 * m12));
    that.storage[10] = scale * (m00 * (m11 * m33 - m31 * m13) -
                                m01 * (m10 * m33 - m30 * m13) +
                                m03 * (m10 * m31 - m30 * m11));
    that.storage[11] = -scale * (m00 * (m11 * m32 - m31 * m12) -
                                 m01 * (m10 * m32 - m30 * m12) +
                                 m02 * (m10 * m31 - m30 * m11));


    that.storage[12] = -scale * (m01 * (m12 * m23 - m22 * m13) -
                                 m02 * (m11 * m23 - m21 * m13) +
                                 m03 * (m11 * m22 - m21 * m12));
    that.storage[13] = scale * (m00 * (m12 * m23 - m22 * m13) -
                                m02 * (m10 * m23 - m20 * m13) +
                                m03 * (m10 * m22 - m20 * m12));
    that.storage[14] = -scale * (m00 * (m11 * m23 - m21 * m13) -
                                 m01 * (m10 * m23 - m20 * m13) +
                                 m03 * (m10 * m21 - m20 * m11));
    that.storage[15] = scale * (m00 * (m11 * m22 - m21 * m12) -
                                m01 * (m10 * m22 - m20 * m12) +
                                m02 * (m10 * m21 - m20 * m11));
};

Matrix4.simd.scaleAdjoint = function(that, scale) {
 /*
    var s = SMID.Float32x4(scale, -scale, scale, -scale);
    var col0 =
        SIMD.Float32x4.add(
            SIMD.Float32x4.sub(
                SIMD.Float32x4mul(//[m11, m10, m10, m10]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m22, m22, m21, m21]
                            ,
                            //[m33, m33, m33, m32]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m32, m32, m31, m31]
                            ,
                            //[m23, m23, m23, m22]
                        )
                    )
                ),
                SIMD.Float32x4mul(//[m12, m12, m11, m11]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m21, m20, m20, m20]
                            ,
                            //[m33, m33, m33, m32]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m31, m30, m30, m30]
                            ,
                            //[m23, m23, m23, m22]
                        )
                    )
                )),
            SIMD.Float32x4mul(//[m13, m13, m13, m12]
                ,
                SIMD.Float32x4.sub(
                    SIMD.Float32x4.mul( //[m21, m20, m20, m20]
                        ,
                        //[m32, m32, m31, m31]
                    )
                    ,
                    SIMD.Float32x4.mul( //[m31, m30, m30, m30]
                        ,
                        //[m22, m22, m21, m21]
                    )
                )
            )
        );
    var out0 = SMID.Float32x4.mul(s, col0);


    s = SMID.Float32x4(-scale, scale, -scale, scale);
    var col1 =
        SIMD.Float32x4.add(
            SIMD.Float32x4.sub(
                SIMD.Float32x4mul(//[m01, m00, m00, m00]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m22, m22, m21, m21]
                            ,
                            //[m33, m33, m33, m32]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m32, m32, m31, m31]
                            ,
                            //[m23, m23, m23, m22]
                        )
                    )
                ),
                SIMD.Float32x4mul(//[m02, m02, m01, m01]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m21, m20, m20, m20]
                            ,
                            //[m33, m33, m32, m32]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m31, m30, m30, m30]
                            ,
                            //[m23, m23, m23, m22]
                        )
                    )
                )),
            SIMD.Float32x4mul(//[m03, m03, m02, m02]
                ,
                SIMD.Float32x4.sub(
                    SIMD.Float32x4.mul( ///[m21, m20, m20, m20]
                        ,
                        //[m32, m32, m31, m31]
                    )
                    ,
                    SIMD.Float32x4.mul( //[m31, m30, m30, m30]
                        ,
                        //[m22, m22, m21, m21]
                    )
                )
            )
        );
    var out1 = SMID.Float32x4.mul(s, col1);


    s = SMID.Float32x4(scale, -scale, scale, -scale);
    var col2 =
        SIMD.Float32x4.add(
            SIMD.Float32x4.sub(
                SIMD.Float32x4mul(//[m01, m00, m00, m00]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m12, m12, m11, m11]
                            ,
                            //[m33, m33, m33, m32]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m32, m32, m31, m31]
                            ,
                            //[m13, m13, m13, m12]
                        )
                    )
                ),
                SIMD.Float32x4mul(//[m02, m02, m01, m01]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m11, m10, m10, m10]
                            ,
                            //[m33, m33, m33, m32]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m31, m30, m30, m30]
                            ,
                            //[m13, m13, m13, m12]
                        )
                    )
                )),
            SIMD.Float32x4mul(//[m03, m03, m03, m02]
                ,
                SIMD.Float32x4.sub(
                    SIMD.Float32x4.mul( ///[m11, m10, m10, m10]
                        ,
                        //[m32, m32, m31, m31]
                    )
                    ,
                    SIMD.Float32x4.mul( //[m31, m30, m30, m30]
                        ,
                        //[m12, m12, m11, m11]
                    )
                )
            )
        );
    var out2 = SMID.Float32x4.mul(s, col2);


    s = SMID.Float32x4(-scale, scale, -scale, scale);
    var col3 =
        SIMD.Float32x4.add(
            SIMD.Float32x4.sub(
                SIMD.Float32x4mul(//[m01, m00, m00, m00]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m12, m12, m11, m11]
                            ,
                            //[m23, m23, m23, m22]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m22, m22, m21, m21]
                            ,
                            //[m13, m13, m13, m12]
                        )
                    )
                ),
                SIMD.Float32x4mul(//[m02, m02, m01, m01]
                    ,
                    SIMD.Float32x4.sub(
                        SIMD.Float32x4.mul( //[m11, m10, m10, m10]
                            ,
                            //[m23, m23, m23, m22]
                        )
                        ,
                        SIMD.Float32x4.mul( //[m21, m20, m20, m20]
                            ,
                            //[m13, m13, m13, m12]
                        )
                    )
                )),
            SIMD.Float32x4mul(//[m03, m03, m03, m02]
                ,
                SIMD.Float32x4.sub(
                    SIMD.Float32x4.mul( ///[m11, m10, m10, m10]
                        ,
                        //[m22, m22, m21, m21]
                    )
                    ,
                    SIMD.Float32x4.mul( //[m21, m20, m20, m20]
                        ,
                        //[m12, m12, m11, m11]
                    )
                )
            )
        );
    var out3 = SMID.Float32x4.mul(s, col3);

    Matrix4.simd.load(that);
    that.simd.simd_c0 = out0;
    that.simd.simd_c1 = out1;
    that.simd.simd_c2 = out2;
    that.simd.simd_c3 = out3;
    Matrix4.simd.store(that);
//    */
};

/**
 * @method absoluteRotate
 * @description Rotates [arg] by the absolute rotation of [that] return [arg].
 * Primarily used by AABB transformation code.
 * @param arg {Vector3}
 * @return {Vector3}
 */
Matrix4.prototype.absoluteRotate = function(arg) {
    var m00 = Math.abs(this.storage[0]);
    var m01 = Math.abs(this.storage[4]);
    var m02 = Math.abs(this.storage[8]);
    var m10 = Math.abs(this.storage[1]);
    var m11 = Math.abs(this.storage[5]);
    var m12 = Math.abs(this.storage[9]);
    var m20 = Math.abs(this.storage[2]);
    var m21 = Math.abs(this.storage[6]);
    var m22 = Math.abs(this.storage[10]);
    var argStorage = arg.storage;
    var x = argStorage[0];
    var y = argStorage[1];
    var z = argStorage[2];
    argStorage[0] = x * m00 + y * m01 + z * m02;
    argStorage[1] = x * m10 + y * m11 + z * m12;
    argStorage[2] = x * m20 + y * m21 + z * m22;
    return arg;
};

/**
 * @method add
 * @description  Add [o] to [this].
 * @param o {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.add = function(o) {
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.add(this, o);
    }
    else {
        Matrix4.scalar.add(this, o);
    }
    return this;
};
Matrix4.scalar.add = function(that, o) {
    var oStorage = o.storage;
    that.storage[0] = that.storage[0] + oStorage[0];
    that.storage[1] = that.storage[1] + oStorage[1];
    that.storage[2] = that.storage[2] + oStorage[2];
    that.storage[3] = that.storage[3] + oStorage[3];
    that.storage[4] = that.storage[4] + oStorage[4];
    that.storage[5] = that.storage[5] + oStorage[5];
    that.storage[6] = that.storage[6] + oStorage[6];
    that.storage[7] = that.storage[7] + oStorage[7];
    that.storage[8] = that.storage[8] + oStorage[8];
    that.storage[9] = that.storage[9] + oStorage[9];
    that.storage[10] = that.storage[10] + oStorage[10];
    that.storage[11] = that.storage[11] + oStorage[11];
    that.storage[12] = that.storage[12] + oStorage[12];
    that.storage[13] = that.storage[13] + oStorage[13];
    that.storage[14] = that.storage[14] + oStorage[14];
    that.storage[15] = that.storage[15] + oStorage[15];
};
Matrix4.simd.add = function(that, o) {
    Matrix4.simd.load(that);
    Matrix4.simd.load(o);
    that.simd_c0 = SIMD.Float32x4.add(that.simd_c0, o.simd_c0);
    that.simd_c1 = SIMD.Float32x4.add(that.simd_c1, o.simd_c1);
    that.simd_c2 = SIMD.Float32x4.add(that.simd_c2, o.simd_c2);
    that.simd_c3 = SIMD.Float32x4.add(that.simd_c3, o.simd_c3);
    Matrix4.simd.store(that);
};

/**
 * @method sub
 * @description Subtract [o] from [this].
 * @param o {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.sub = function(o) {
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.sub(this, o);
    }
    else {
        Matrix4.scalar.sub(this, o);
    }
    return this;
};
Matrix4.scalar.sub = function(that, o) {
    var oStorage = o.storage;
    that.storage[0] = that.storage[0] - oStorage[0];
    that.storage[1] = that.storage[1] - oStorage[1];
    that.storage[2] = that.storage[2] - oStorage[2];
    that.storage[3] = that.storage[3] - oStorage[3];
    that.storage[4] = that.storage[4] - oStorage[4];
    that.storage[5] = that.storage[5] - oStorage[5];
    that.storage[6] = that.storage[6] - oStorage[6];
    that.storage[7] = that.storage[7] - oStorage[7];
    that.storage[8] = that.storage[8] - oStorage[8];
    that.storage[9] = that.storage[9] - oStorage[9];
    that.storage[10] = that.storage[10] - oStorage[10];
    that.storage[11] = that.storage[11] - oStorage[11];
    that.storage[12] = that.storage[12] - oStorage[12];
    that.storage[13] = that.storage[13] - oStorage[13];
    that.storage[14] = that.storage[14] - oStorage[14];
    that.storage[15] = that.storage[15] - oStorage[15];
};
Matrix4.simd.sub = function(that, o) {
    Matrix4.simd.load(that);
    Matrix4.simd.load(o);
    that.simd_c0 = SIMD.Float32x4.sub(that.simd_c0, o.simd_c0);
    that.simd_c1 = SIMD.Float32x4.sub(that.simd_c1, o.simd_c1);
    that.simd_c2 = SIMD.Float32x4.sub(that.simd_c2, o.simd_c2);
    that.simd_c3 = SIMD.Float32x4.sub(that.simd_c3, o.simd_c3);
    Matrix4.simd.store(that);
};


/**
 * @method negate
 * @description Negate [this].
 * @return {Matrix4}
 */
Matrix4.prototype.negate = function() {
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.neg(this);
    }
    else {
        Matrix4.scalar.neg(this);
    }
    return this;
};
Matrix4.scalar.neg = function(that) {
    that.storage[0] = -that.storage[0];
    that.storage[1] = -that.storage[1];
    that.storage[2] = -that.storage[2];
    that.storage[3] = -that.storage[3];
    that.storage[4] = -that.storage[4];
    that.storage[5] = -that.storage[5];
    that.storage[6] = -that.storage[6];
    that.storage[7] = -that.storage[7];
    that.storage[8] = -that.storage[8];
    that.storage[9] = -that.storage[9];
    that.storage[10] = -that.storage[10];
    that.storage[11] = -that.storage[11];
    that.storage[12] = -that.storage[12];
    that.storage[13] = -that.storage[13];
    that.storage[14] = -that.storage[14];
    that.storage[15] = -that.storage[15];
};
Matrix4.simd.neg = function(that) {
    Matrix4.simd.load(that);
    that.simd_c0 = SIMD.Float32x4.neg(that.simd_c0);
    that.simd_c1 = SIMD.Float32x4.neg(that.simd_c1);
    that.simd_c2 = SIMD.Float32x4.neg(that.simd_c2);
    that.simd_c3 = SIMD.Float32x4.neg(that.simd_c3);
    Matrix4.simd.store(that);
};



/**
 * @method multiply
 * @description Multiply [this] by [arg].
 * @param arg {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.multiply = function(arg) {
    if (vector_math.USE_SIMD()) {
        Matrix4.simd.multiply(this, arg);
    }
    else {
        Matrix4.scalar.multiply(this, arg);
    }
    return this;
};
Matrix4.scalar.multiply = function(that, arg) {
    var m00 = that.storage[0];
    var m01 = that.storage[4];
    var m02 = that.storage[8];
    var m03 = that.storage[12];
    var m10 = that.storage[1];
    var m11 = that.storage[5];
    var m12 = that.storage[9];
    var m13 = that.storage[13];
    var m20 = that.storage[2];
    var m21 = that.storage[6];
    var m22 = that.storage[10];
    var m23 = that.storage[14];
    var m30 = that.storage[3];
    var m31 = that.storage[7];
    var m32 = that.storage[11];
    var m33 = that.storage[15];
    var argStorage = arg.storage;
    var n00 = argStorage[0];
    var n01 = argStorage[4];
    var n02 = argStorage[8];
    var n03 = argStorage[12];
    var n10 = argStorage[1];
    var n11 = argStorage[5];
    var n12 = argStorage[9];
    var n13 = argStorage[13];
    var n20 = argStorage[2];
    var n21 = argStorage[6];
    var n22 = argStorage[10];
    var n23 = argStorage[14];
    var n30 = argStorage[3];
    var n31 = argStorage[7];
    var n32 = argStorage[11];
    var n33 = argStorage[15];
    that.storage[0] = (m00 * n00) + (m01 * n10) + (m02 * n20) + (m03 * n30);
    that.storage[1] = (m10 * n00) + (m11 * n10) + (m12 * n20) + (m13 * n30);
    that.storage[2] = (m20 * n00) + (m21 * n10) + (m22 * n20) + (m23 * n30);
    that.storage[3] = (m30 * n00) + (m31 * n10) + (m32 * n20) + (m33 * n30);

    that.storage[4] = (m00 * n01) + (m01 * n11) + (m02 * n21) + (m03 * n31);
    that.storage[5] = (m10 * n01) + (m11 * n11) + (m12 * n21) + (m13 * n31);
    that.storage[6] = (m20 * n01) + (m21 * n11) + (m22 * n21) + (m23 * n31);
    that.storage[7] = (m30 * n01) + (m31 * n11) + (m32 * n21) + (m33 * n31);

    that.storage[8] = (m00 * n02) + (m01 * n12) + (m02 * n22) + (m03 * n32);
    that.storage[9] = (m10 * n02) + (m11 * n12) + (m12 * n22) + (m13 * n32);
    that.storage[10] = (m20 * n02) + (m21 * n12) + (m22 * n22) + (m23 * n32);
    that.storage[11] = (m30 * n02) + (m31 * n12) + (m32 * n22) + (m33 * n32);

    that.storage[12] = (m00 * n03) + (m01 * n13) + (m02 * n23) + (m03 * n33);
    that.storage[13] = (m10 * n03) + (m11 * n13) + (m12 * n23) + (m13 * n33);
    that.storage[14] = (m20 * n03) + (m21 * n13) + (m22 * n23) + (m23 * n33);
    that.storage[15] = (m30 * n03) + (m31 * n13) + (m32 * n23) + (m33 * n33);
};
Matrix4.simd.multiply = function(that, arg) {
    Matrix4.simd.load(that);
    Matrix4.simd.load(arg);
    var out0 = SIMD.Float32x4.add(
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c0, SIMD.Float32x4.swizzle(arg.simd_c0, 0, 0, 0, 0)),
            SIMD.Float32x4.mul(that.simd_c1, SIMD.Float32x4.swizzle(arg.simd_c0, 1, 1, 1, 1))
        ),
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c2, SIMD.Float32x4.swizzle(arg.simd_c0, 2, 2, 2, 2)),
            SIMD.Float32x4.mul(that.simd_c3, SIMD.Float32x4.swizzle(arg.simd_c0, 3, 3, 3, 3))
        )
    );
    var out1 = SIMD.Float32x4.add(
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c0, SIMD.Float32x4.swizzle(arg.simd_c1, 0, 0, 0, 0)),
            SIMD.Float32x4.mul(that.simd_c1, SIMD.Float32x4.swizzle(arg.simd_c1, 1, 1, 1, 1))
        ),
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c2, SIMD.Float32x4.swizzle(arg.simd_c1, 2, 2, 2, 2)),
            SIMD.Float32x4.mul(that.simd_c3, SIMD.Float32x4.swizzle(arg.simd_c1, 3, 3, 3, 3))
        )
    );
    var out2 = SIMD.Float32x4.add(
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c0, SIMD.Float32x4.swizzle(arg.simd_c2, 0, 0, 0, 0)),
            SIMD.Float32x4.mul(that.simd_c1, SIMD.Float32x4.swizzle(arg.simd_c2, 1, 1, 1, 1))
        ),
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c2, SIMD.Float32x4.swizzle(arg.simd_c2, 2, 2, 2, 2)),
            SIMD.Float32x4.mul(that.simd_c3, SIMD.Float32x4.swizzle(arg.simd_c2, 3, 3, 3, 3))
        )
    );
    var out3 = SIMD.Float32x4.add(
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c0, SIMD.Float32x4.swizzle(arg.simd_c3, 0, 0, 0, 0)),
            SIMD.Float32x4.mul(that.simd_c1, SIMD.Float32x4.swizzle(arg.simd_c3, 1, 1, 1, 1))
        ),
        SIMD.Float32x4.add(
            SIMD.Float32x4.mul(that.simd_c2, SIMD.Float32x4.swizzle(arg.simd_c3, 2, 2, 2, 2)),
            SIMD.Float32x4.mul(that.simd_c3, SIMD.Float32x4.swizzle(arg.simd_c3, 3, 3, 3, 3))
        )
    );
    that.simd_c0 = out0;
    that.simd_c1 = out1;
    that.simd_c2 = out2;
    that.simd_c3 = out3;
    Matrix4.simd.store(that);
};

/**
 * @method multiplied
 * @description Create a copy of [this] and multiply it by [arg].
 * @param arg {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.multiplied = function(arg) {
    var m = this.clone();
    m.multiply(arg);
    return m;
};


/**
 * @method transposeMultiply
 * @description Multiply a transposed [this] with [arg].
 * @param arg {Matrix4}
 * @return {Matrix4}
 */
Matrix4.prototype.transposeMultiply = function(arg) {
    var m00 = this.storage[0];
    var m01 = this.storage[1];
    var m02 = this.storage[2];
    var m03 = this.storage[3];
    var m10 = this.storage[4];
    var m11 = this.storage[5];
    var m12 = this.storage[6];
    var m13 = this.storage[7];
    var m20 = this.storage[8];
    var m21 = this.storage[9];
    var m22 = this.storage[10];
    var m23 = this.storage[11];
    var m30 = this.storage[12];
    var m31 = this.storage[13];
    var m32 = this.storage[14];
    var m33 = this.storage[15];
    var argStorage = arg.storage;
    this.storage[0] = (m00 * argStorage[0]) +
    (m01 * argStorage[1]) +
    (m02 * argStorage[2]) +
    (m03 * argStorage[3]);
    this.storage[4] = (m00 * argStorage[4]) +
    (m01 * argStorage[5]) +
    (m02 * argStorage[6]) +
    (m03 * argStorage[7]);
    this.storage[8] = (m00 * argStorage[8]) +
    (m01 * argStorage[9]) +
    (m02 * argStorage[10]) +
    (m03 * argStorage[11]);
    this.storage[12] = (m00 * argStorage[12]) +
    (m01 * argStorage[13]) +
    (m02 * argStorage[14]) +
    (m03 * argStorage[15]);
    this.storage[1] = (m10 * argStorage[0]) +
    (m11 * argStorage[1]) +
    (m12 * argStorage[2]) +
    (m13 * argStorage[3]);
    this.storage[5] = (m10 * argStorage[4]) +
    (m11 * argStorage[5]) +
    (m12 * argStorage[6]) +
    (m13 * argStorage[7]);
    this.storage[9] = (m10 * argStorage[8]) +
    (m11 * argStorage[9]) +
    (m12 * argStorage[10]) +
    (m13 * argStorage[11]);
    this.storage[13] = (m10 * argStorage[12]) +
    (m11 * argStorage[13]) +
    (m12 * argStorage[14]) +
    (m13 * argStorage[15]);
    this.storage[2] = (m20 * argStorage[0]) +
    (m21 * argStorage[1]) +
    (m22 * argStorage[2]) +
    (m23 * argStorage[3]);
    this.storage[6] = (m20 * argStorage[4]) +
    (m21 * argStorage[5]) +
    (m22 * argStorage[6]) +
    (m23 * argStorage[7]);
    this.storage[10] = (m20 * argStorage[8]) +
    (m21 * argStorage[9]) +
    (m22 * argStorage[10]) +
    (m23 * argStorage[11]);
    this.storage[14] = (m20 * argStorage[12]) +
    (m21 * argStorage[13]) +
    (m22 * argStorage[14]) +
    (m23 * argStorage[15]);
    this.storage[3] = (m30 * argStorage[0]) +
    (m31 * argStorage[1]) +
    (m32 * argStorage[2]) +
    (m33 * argStorage[3]);
    this.storage[7] = (m30 * argStorage[4]) +
    (m31 * argStorage[5]) +
    (m32 * argStorage[6]) +
    (m33 * argStorage[7]);
    this.storage[11] = (m30 * argStorage[8]) +
    (m31 * argStorage[9]) +
    (m32 * argStorage[10]) +
    (m33 * argStorage[11]);
    this.storage[15] = (m30 * argStorage[12]) +
    (m31 * argStorage[13]) +
    (m32 * argStorage[14]) +
    (m33 * argStorage[15]);
    return this;
};

/**
 * @method multiplyTranspose
 * @description Multiply [this] with a transposed [arg].
 * @param arg
 * @return {Matrix4}
 */
Matrix4.prototype.multiplyTranspose = function(arg) {
    var m00 = this.storage[0];
    var m01 = this.storage[4];
    var m02 = this.storage[8];
    var m03 = this.storage[12];
    var m10 = this.storage[1];
    var m11 = this.storage[5];
    var m12 = this.storage[9];
    var m13 = this.storage[13];
    var m20 = this.storage[2];
    var m21 = this.storage[6];
    var m22 = this.storage[10];
    var m23 = this.storage[14];
    var m30 = this.storage[3];
    var m31 = this.storage[7];
    var m32 = this.storage[11];
    var m33 = this.storage[15];
    var argStorage = arg.storage;
    this.storage[0] = (m00 * argStorage[0]) +
    (m01 * argStorage[4]) +
    (m02 * argStorage[8]) +
    (m03 * argStorage[12]);
    this.storage[4] = (m00 * argStorage[1]) +
    (m01 * argStorage[5]) +
    (m02 * argStorage[9]) +
    (m03 * argStorage[13]);
    this.storage[8] = (m00 * argStorage[2]) +
    (m01 * argStorage[6]) +
    (m02 * argStorage[10]) +
    (m03 * argStorage[14]);
    this.storage[12] = (m00 * argStorage[3]) +
    (m01 * argStorage[7]) +
    (m02 * argStorage[11]) +
    (m03 * argStorage[15]);
    this.storage[1] = (m10 * argStorage[0]) +
    (m11 * argStorage[4]) +
    (m12 * argStorage[8]) +
    (m13 * argStorage[12]);
    this.storage[5] = (m10 * argStorage[1]) +
    (m11 * argStorage[5]) +
    (m12 * argStorage[9]) +
    (m13 * argStorage[13]);
    this.storage[9] = (m10 * argStorage[2]) +
    (m11 * argStorage[6]) +
    (m12 * argStorage[10]) +
    (m13 * argStorage[14]);
    this.storage[13] = (m10 * argStorage[3]) +
    (m11 * argStorage[7]) +
    (m12 * argStorage[11]) +
    (m13 * argStorage[15]);
    this.storage[2] = (m20 * argStorage[0]) +
    (m21 * argStorage[4]) +
    (m22 * argStorage[8]) +
    (m23 * argStorage[12]);
    this.storage[6] = (m20 * argStorage[1]) +
    (m21 * argStorage[5]) +
    (m22 * argStorage[9]) +
    (m23 * argStorage[13]);
    this.storage[10] = (m20 * argStorage[2]) +
    (m21 * argStorage[6]) +
    (m22 * argStorage[10]) +
    (m23 * argStorage[14]);
    this.storage[14] = (m20 * argStorage[3]) +
    (m21 * argStorage[7]) +
    (m22 * argStorage[11]) +
    (m23 * argStorage[15]);
    this.storage[3] = (m30 * argStorage[0]) +
    (m31 * argStorage[4]) +
    (m32 * argStorage[8]) +
    (m33 * argStorage[12]);
    this.storage[7] = (m30 * argStorage[1]) +
    (m31 * argStorage[5]) +
    (m32 * argStorage[9]) +
    (m33 * argStorage[13]);
    this.storage[11] = (m30 * argStorage[2]) +
    (m31 * argStorage[6]) +
    (m32 * argStorage[10]) +
    (m33 * argStorage[14]);
    this.storage[15] = (m30 * argStorage[3]) +
    (m31 * argStorage[7]) +
    (m32 * argStorage[11]) +
    (m33 * argStorage[15]);
    return this;
};

/**
 * @method decompose
 * @description Decomposes [this] into [translation], [rotation] and [scale] components.
 * @param translation {Vector3}
 * @param rotation {Quaternion}
 * @param scale {Vector3}
 */
Matrix4.prototype.decompose = function(translation, rotation, scale) {
    var v = Vector3.zero();
    var sx = v.setValues(this.storage[0], this.storage[1], this.storage[2]).length;
    var sy = v.setValues(this.storage[4], this.storage[5], this.storage[6]).length;
    var sz = v.setValues(this.storage[8], this.storage[9], this.storage[10]).length;

    if (this.determinant() < 0) sx = -sx;

    translation.storage[0] = this.storage[12];
    translation.storage[1] = this.storage[13];
    translation.storage[2] = this.storage[14];

    var invSX = 1.0 / sx;
    var invSY = 1.0 / sy;
    var invSZ = 1.0 / sz;

    var m = Matrix4.copy(this);
    m.storage[0] *= invSX;
    m.storage[1] *= invSX;
    m.storage[2] *= invSX;
    m.storage[4] *= invSY;
    m.storage[5] *= invSY;
    m.storage[6] *= invSY;
    m.storage[8] *= invSZ;
    m.storage[9] *= invSZ;
    m.storage[10] *= invSZ;

    rotation.setFromRotation(m.getRotation());

    scale.storage[0] = sx;
    scale.storage[1] = sy;
    scale.storage[2] = sz;
};

/**
 * @method rotate3
 * @description Rotate [arg] of type [Vector3] using the rotation defined by [this].
 * @param arg {Vector3}
 */
Matrix4.prototype.rotate3 = function(arg) {
    var argStorage = arg.storage;
    var x_ = (this.storage[0] * argStorage[0]) +
    (this.storage[4] * argStorage[1]) +
    (this.storage[8] * argStorage[2]);
    var y_ = (this.storage[1] * argStorage[0]) +
    (this.storage[5] * argStorage[1]) +
    (this.storage[9] * argStorage[2]);
    var z_ = (this.storage[2] * argStorage[0]) +
    (this.storage[6] * argStorage[1]) +
    (this.storage[10] * argStorage[2]);
    argStorage[0] = x_;
    argStorage[1] = y_;
    argStorage[2] = z_;
    return arg;
};


/**
 * @method rotated3
 * @description Rotate a copy of [arg] of type [Vector3] using the rotation defined by [this].
 * @param arg {Vector3}
 * @return {Vector3}
 */
Matrix4.prototype.rotated3 = function(arg) {
    var out = Vector3.copy(arg);
    return this.rotate3(out);
};

/**
 * @method transform3
 * @description Transform [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @return {Vector3}
 */
Matrix4.prototype.transform3 = function(arg) {
    var argStorage = arg.storage;
    var x_ = (this.storage[0] * argStorage[0]) +
    (this.storage[4] * argStorage[1]) +
    (this.storage[8] * argStorage[2]) +
    this.storage[12];
    var y_ = (this.storage[1] * argStorage[0]) +
    (this.storage[5] * argStorage[1]) +
    (this.storage[9] * argStorage[2]) +
    this.storage[13];
    var z_ = (this.storage[2] * argStorage[0]) +
    (this.storage[6] * argStorage[1]) +
    (this.storage[10] * argStorage[2]) +
    this.storage[14];
    argStorage[0] = x_;
    argStorage[1] = y_;
    argStorage[2] = z_;
    return arg;
};

/**
 * @method transformed3
 * @description Transform a copy of [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @return {Vector3}
 */
Matrix4.prototype.transformed3 = function(arg) {
    var out = Vector3.copy(arg);
    return this.transform3(out);
};

/**
 * @method transform
 * @description Transform [arg] of type [Vector4] using the transformation defined by [this].
 * @param arg {Vector4}
 * @return {Vector4}
 */
Matrix4.prototype.transform = function(arg) {
    var argStorage = arg.storage;
    var x_ = (this.storage[0] * argStorage[0]) +
    (this.storage[4] * argStorage[1]) +
    (this.storage[8] * argStorage[2]) +
    (this.storage[12] * argStorage[3]);
    var y_ = (this.storage[1] * argStorage[0]) +
    (this.storage[5] * argStorage[1]) +
    (this.storage[9] * argStorage[2]) +
    (this.storage[13] * argStorage[3]);
    var z_ = (this.storage[2] * argStorage[0]) +
    (this.storage[6] * argStorage[1]) +
    (this.storage[10] * argStorage[2]) +
    (this.storage[14] * argStorage[3]);
    var w_ = (this.storage[3] * argStorage[0]) +
    (this.storage[7] * argStorage[1]) +
    (this.storage[11] * argStorage[2]) +
    (this.storage[15] * argStorage[3]);
    argStorage[0] = x_;
    argStorage[1] = y_;
    argStorage[2] = z_;
    argStorage[3] = w_;
    return arg;
};

/**
 * @method perspectiveTransform
 * @description Transform [arg] of type [Vector3] using the perspective transformation defined by [this].
 * @param arg {Vector3}
 * @return {Vector3}
 */
Matrix4.prototype.perspectiveTransform = function(arg) {
    var argStorage = arg.storage;
    var x_ = (this.storage[0] * argStorage[0]) +
    (this.storage[4] * argStorage[1]) +
    (this.storage[8] * argStorage[2]) +
    this.storage[12];
    var y_ = (this.storage[1] * argStorage[0]) +
    (this.storage[5] * argStorage[1]) +
    (this.storage[9] * argStorage[2]) +
    this.storage[13];
    var z_ = (this.storage[2] * argStorage[0]) +
    (this.storage[6] * argStorage[1]) +
    (this.storage[10] * argStorage[2]) +
    this.storage[14];
    var w_ = 1.0 /
    ((this.storage[3] * argStorage[0]) +
    (this.storage[7] * argStorage[1]) +
    (this.storage[11] * argStorage[2]) +
    this.storage[15]);
    argStorage[0] = x_ * w_;
    argStorage[1] = y_ * w_;
    argStorage[2] = z_ * w_;
    return arg;
};

/**
 * @method transformed
 * @description Transform a copy of [arg] of type [Vector4] using the transformation defined by [this].
 * @param arg
 * @return {Vector4}
 */
Matrix4.prototype.transformed = function(arg) {
    var out = Vector4.copy(arg);
    return this.transform(out);
};

/**
 * @method copyIntoArray
 * @description Copies [this] into [array] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 */
Matrix4.prototype.copyIntoArray = function(array, offset) {
    var i = offset;
    if (offset === undefined) {
        i = 0;
    }
    array[i + 15] = this.storage[15];
    array[i + 14] = this.storage[14];
    array[i + 13] = this.storage[13];
    array[i + 12] = this.storage[12];
    array[i + 11] = this.storage[11];
    array[i + 10] = this.storage[10];
    array[i + 9] = this.storage[9];
    array[i + 8] = this.storage[8];
    array[i + 7] = this.storage[7];
    array[i + 6] = this.storage[6];
    array[i + 5] = this.storage[5];
    array[i + 4] = this.storage[4];
    array[i + 3] = this.storage[3];
    array[i + 2] = this.storage[2];
    array[i + 1] = this.storage[1];
    array[i + 0] = this.storage[0];
};

/**
 * @method copyFromArray
 * @description Copies elements from [array] into [this] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 */
Matrix4.prototype.copyFromArray = function(array, offset) {
    var i = offset;
    if (offset === undefined) {
        i = 0;
    }
    this.storage[15] = array[i + 15];
    this.storage[14] = array[i + 14];
    this.storage[13] = array[i + 13];
    this.storage[12] = array[i + 12];
    this.storage[11] = array[i + 11];
    this.storage[10] = array[i + 10];
    this.storage[9] = array[i + 9];
    this.storage[8] = array[i + 8];
    this.storage[7] = array[i + 7];
    this.storage[6] = array[i + 6];
    this.storage[5] = array[i + 5];
    this.storage[4] = array[i + 4];
    this.storage[3] = array[i + 3];
    this.storage[2] = array[i + 2];
    this.storage[1] = array[i + 1];
    this.storage[0] = array[i + 0];
};
},{"./common.js":10,"./matrix3.js":12,"./quaternion.js":16,"./vector3.js":21,"./vector4.js":22,"simd":6}],14:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Plane;

var Vector3 = require('./vector3.js');

/**
 * @class Plane
 * @constructor
 */
function Plane() {
    this.normal = Vector3.zero();
    this.constant = 0.0;
}

/**
 * @static intersection
 * @description Find the intersection point between the three planes [a], [b] and [c] and copy it into [result].
 * @param a {Plane}
 * @param b {Plane}
 * @param c {Plane}
 * @param result {Vector3}
 */
Plane.intersection = function(a, b, c, result) {
    var cross = b.normal.cross(c.normal);
    var f = -a.normal.dot(cross);
    var v1 = cross.scaled(a.constant);

    cross = c.normal.cross(a.normal);
    var v2 = cross.scaled(b.constant);

    cross = a.normal.cross(b.normal);

    var v3 = cross.scaled(c.constant);

    result.x = (v1.x + v2.x + v3.x) / f;
    result.y = (v1.y + v2.y + v3.y) / f;
    result.z = (v1.z + v2.z + v3.z) / f;
};


/**
 * @static copy
 * @description return a copy of other
 * @param other {Plane}
 * @return {Plane}
 */
Plane.copy = function(other) {
    var p = new Plane();
    p.constant = other.constant;
    p.normal.setFrom(other.normal);
    return p;
};

/**
 * @static components
 * @description Constructs a Plane from components
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 * @return {Plane}
 */
Plane.components = function(x, y, z, w) {
    var p = new Plane();
    p.setFromComponents(x, y, z, w);
    return p;
};

/**
 * @static normalconstant
 * @description Constructs a Plane from a normal vector and constant value
 * @param normal {Vector3}
 * @param constant {number}
 * @return {Plane}
 */
Plane.normalconstant = function(normal, constant) {
    var p = new Plane();
    p.normal.setFrom(normal);
    p.constant = constant;
    return p;
};


/**
 * @method copyFrom
 * @description Copy other into this
 * @param o {Plane}
 */
Plane.prototype.copyFrom = function(o) {
    this.normal.setFrom(o.normal);
    this.constant = o.constant;
};

/**
 * @method setFromComponents
 * @description Sets this from values
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 */
Plane.prototype.setFromComponents = function(x, y, z, w) {
    this.normal.setValues(x, y, z);
    this.constant = w;
};

/**
 * @method normalize
 * @description Normalize this
 */
Plane.prototype.normalize = function() {
    var inverseLength = 1.0 / this.normal.length;
    this.normal.scale(inverseLength);
    this.constant = this.constant * inverseLength;
};

/**
 * @method distanceToVector3
 * @description Compute distance to a point
 * @param point {Vector3}
 * @return {number}
 */
Plane.prototype.distanceToVector3 = function(point) {
    return this.normal.dot(point) + this.constant;
};
},{"./vector3.js":21}],15:[function(require,module,exports){
/**
 * Created by grizet_j on 9/27/2015.
 */

module.exports = Quad;
var Vector3 = require('./vector3.js');
var Triangle = require('./triangle.js');

/**
 * @class Quad
 * @description Defines a quad by four points.
 * @constructor
 */
function Quad () {

    /**
     * @property point0
     * The first point of the quad.
     * @type {Vector3}
     */
    this.point0 = Vector3.zero();

    /**
     * @property point1
     * @type {Vector3}
     * The second point of the quad.
     */
    this.point1 = Vector3.zero();

    /**
     * @property point2
     * @type {Vector3}
     * The third point of the quad.
     */
    this.point2 = Vector3.zero();

    /**
     * @property point3
     * @type {Vector3}
     * The third point of the quad.
     */
    this.point3 = Vector3.zero();

}

/**
 * @static copy
 * @description Create a quad as a copy of [other].
 * @param other {Quad}
 * @return {Quad}
 */
Quad.copy = function(other) {
    var q = new Quad();
    q.point0.setFrom(other.point0);
    q.point1.setFrom(other.point1);
    q.point2.setFrom(other.point2);
    q.point3.setFrom(other.point3);
    return q;
};

/**
 * @static points
 * @description Create a quad by four points.
 * @param point0 {Vector3}
 * @param point1 {Vector3}
 * @param point2 {Vector3}
 * @param point3 {Vector3}
 * @return {Quad}
 */
Quad.points = function(point0, point1, point2, point3) {
    var q = new Quad();
    q.point0.setFrom(point0);
    q.point1.setFrom(point1);
    q.point2.setFrom(point2);
    q.point3.setFrom(point3);
    return q;
};

/**
 * @method copyFrom
 * @description Copy the quad from [other] into [this].
 * @param other {Quad}
 */
Quad.prototype.copyFrom = function(other) {
    this.point0.setFrom(other.point0);
    this.point1.setFrom(other.point1);
    this.point2.setFrom(other.point2);
    this.point3.setFrom(other.point3);
};

/**
 * @method copyNormalInto
 * @description Copy the normal of [this] into [normal].
 * @param normal {Vector3}
 */
Quad.prototype.copyNormalInto = function(normal) {
    var v0 = this.point0.clone().sub(this.point1);
    normal.setFrom(this.point2);
    normal.sub(this.point1);
    var n = normal.cross(v0);
    n.normalize();
    normal.setFrom(n);
};

/**
 * @method copyTriangles
 * @description Copies the two triangles that define [this].
 * @param triangle0 {Triangle}
 * @param triangle1 {Triangle}
 */
Quad.prototype.copyTriangles = function(triangle0, triangle1) {
    triangle0.point0.setFrom(this.point0);
    triangle0.point1.setFrom(this.point1);
    triangle0.point2.setFrom(this.point2);
    triangle1.point0.setFrom(this.point0);
    triangle1.point1.setFrom(this.point3);
    triangle1.point2.setFrom(this.point2);
};

/**
 * @method transform
 * @description Transform [this] by the transform [t].
 * @param t {Matrix4}
 */
Quad.prototype.transform = function(t) {
    t.transform3(this.point0);
    t.transform3(this.point1);
    t.transform3(this.point2);
    t.transform3(this.point3);
};

/**
 * @method translate
 * @description Translate [this] by [offset].
 * @param offset {Vector3}
 */
Quad.prototype.translate = function(offset) {
    this.point0.add(offset);
    this.point1.add(offset);
    this.point2.add(offset);
    this.point3.add(offset);
};
},{"./triangle.js":19,"./vector3.js":21}],16:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Quaternion;
var Matrix3 = require('./matrix3.js');
var Vector3 = require('./vector3.js');

/**
 * @class Quaternion
 * @description Defines a [Quaternion] (a four-dimensional vector) for efficient rotation calculations.
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 * @constructor
 */
function Quaternion(x, y, z, w) {
    this.storage = new Float32Array([x, y, z, w]);
}

/**
 * @property x
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("x", function() {
    return this.storage[0];
});
Quaternion.prototype.__defineSetter__("x", function(value) {
    this.storage[0] = value;
});


/**
 * @property y
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("y", function() {
    return this.storage[1];
});
Quaternion.prototype.__defineSetter__("y", function(value) {
    this.storage[1] = value;
});

/**
 * @property z
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("z", function() {
    return this.storage[2];
});
Quaternion.prototype.__defineSetter__("z", function(value) {
    this.storage[2] = value;
});

/**
 * @property w
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("w", function() {
    return this.storage[3];
});
Quaternion.prototype.__defineSetter__("w", function(value) {
    this.storage[3] = value;
});

/**
 * @static
 * Zero quaternion
 * @returns {Quaternion}
 */
Quaternion.zero = function() {
    var q = new Quaternion(0.0, 0.0, 0.0, 0.0);
    return q;
};

/**
 * @static fromRotation
 * @param rotationMatrix {Matrix3}
 * @return {Quaternion}
 */
Quaternion.fromRotation = function(rotationMatrix) {
    var q = Quaternion.zero();
    q.setFromRotation(rotationMatrix);
    return q;
};

/**
 * @static axisAngle
 * @description Constructs from axis and angle
 * @param axis {Vector3}
 * @param angle {number}
 * @return {Quaternion}
 */
Quaternion.axisAngle = function(axis, angle) {
    var q = Quaternion.zero();
    q.setAxisAngle(axis, angle);
    return q;
};

Quaternion.copy = function(original) {
    var q = Quaternion.zero();
    q.setFrom(original);
    return q;
};

/**
 * @static random
 * @description Constructs a quaternion with a random rotation. The random number
 * generator [rn] is used to generate the random numbers for the rotation.
 * @return {Quaternion}
 */
Quaternion.random = function() {
    var q = Quaternion.zero();
    q.setRandom();
    return q;
};


/**
 * @static identity
 * @description Constructs a quaternion set to the identity quaternion.
 * @return {Quaternion}
 */
Quaternion.identity = function() {
    var q = Quaternion.zero();
    q.storage[3] = 1.0;
    return q;
};

/**
 * @static dq
 * @description Constructs a quaternion from time derivative of [q] with angular velocity [omega].
 * @param q {Quaternion}
 * @param omega {Vector3}
 * @return {Quaternion}
 */
Quaternion.dq = function(q, omega) {
    var quat = Quaternion.zero();
    quat.setDQ(quat, omega);
    return quat;
};

/**
 * @static euler
 * @description Constructs a quaternion from [yaw], [pitch] and [roll].
 * @param yaw {number}
 * @param pitch {number}
 * @param roll {number}
 * @return {Quaternion}
 */
Quaternion.euler = function(yaw, pitch, roll) {
    var q = Quaternion.zero();
    q.setEuler(yaw, pitch, roll);
    return q;
};


/**
 * @static fromFloat32Array
 * @description Constructs a quaternion with given Float32Array as [storage].
 * @param array {Float32Array}
 * @return {Quaternion}
 */
Quaternion.fromFloat32Array = function(array) {
    var q = Quaternion.zero();
    q.storage = array;
    return q;
};

/**
 * @static fromBuffer
 * @description Constructs a quaternion with a [storage] that views given [buffer] starting at [offset].
 * [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @return {Quaternion}
 */
Quaternion.fromBuffer = function(buffer, offset) {
    var q = Quaternion.zero();
    q.storage = new Float32Array(buffer, offset, 4);
    return q;
};

/**
 * @method clone
 * @description Returns a new copy of [this].
 * @return {Quaternion}
 */
Quaternion.prototype.clone = function() {
    return Quaternion.copy(this);
};

/**
 * @method setFrom
 * @description Copy [source] into [this].
 * @param source {Quaternion}
 */
Quaternion.prototype.setFrom = function(source) {
    var sourceStorage = source.storage;
    this.storage[0] = sourceStorage[0];
    this.storage[1] = sourceStorage[1];
    this.storage[2] = sourceStorage[2];
    this.storage[3] = sourceStorage[3];
};

/**
 * @method setValues
 * @description Set the quaternion to the raw values [x], [y], [z], and [w].
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 */
Quaternion.prototype.setValues = function(x, y, z, w) {
    this.storage[0] = x;
    this.storage[1] = y;
    this.storage[2] = z;
    this.storage[3] = w;
};

/**
 * @method setAxisAngle
 * @description Set the quaternion with rotation of [radians] around [axis].
 * @param axis {Vector3}
 * @param radians {number}
 */
Quaternion.prototype.setAxisAngle = function(axis, radians) {
        var len = axis.length;
        if (len == 0.0) {
            return;
        }
        var halfSin = Math.sin(radians * 0.5) / len;
        var axisStorage = axis.storage;
        this.storage[0] = axisStorage[0] * halfSin;
        this.storage[1] = axisStorage[1] * halfSin;
        this.storage[2] = axisStorage[2] * halfSin;
        this.storage[3] = Math.cos(radians * 0.5);
};

/**
 * @method setFromRotation
 * @description Set the quaternion with rotation from a rotation matrix [rotationMatrix].
 * @param rotationMatrix {Matrix3}
 */
Quaternion.prototype.setFromRotation = function(rotationMatrix) {
    var rotationMatrixStorage = rotationMatrix.storage;
    var trace = rotationMatrix.trace();
    var s = Math.sqrt(trace + 1.0);
    if (trace > 0.0) {
        this.storage[3] = s * 0.5;
        s = 0.5 / s;
        this.storage[0] = (rotationMatrixStorage[5] - rotationMatrixStorage[7]) * s;
        this.storage[1] = (rotationMatrixStorage[6] - rotationMatrixStorage[2]) * s;
        this.storage[2] = (rotationMatrixStorage[1] - rotationMatrixStorage[3]) * s;
    } else {
        var i = rotationMatrixStorage[0] < rotationMatrixStorage[4]
            ? (rotationMatrixStorage[4] < rotationMatrixStorage[8] ? 2 : 1)
            : (rotationMatrixStorage[0] < rotationMatrixStorage[8] ? 2 : 0);
        var j = (i + 1) % 3;
        var k = (i + 2) % 3;
        s = Math.sqrt(rotationMatrixStorage[rotationMatrix.index(i, i)] -
        rotationMatrixStorage[rotationMatrix.index(j, j)] -
        rotationMatrixStorage[rotationMatrix.index(k, k)] +
        1.0);
        this.storage[i] = s * 0.5;
        s = 0.5 / s;
        this.storage[3] = (rotationMatrixStorage[rotationMatrix.index(k, j)] -
        rotationMatrixStorage[rotationMatrix.index(j, k)]) *
        s;
        this.storage[j] = (rotationMatrixStorage[rotationMatrix.index(j, i)] +
        rotationMatrixStorage[rotationMatrix.index(i, j)]) *
        s;
        this.storage[k] = (rotationMatrixStorage[rotationMatrix.index(k, i)] +
        rotationMatrixStorage[rotationMatrix.index(i, k)]) *
        s;
    }
};

/**
 * @method setRandom
 * @description Set the quaternion to a random rotation. The random number generator [rn]
 * is used to generate the random numbers for the rotation.
 */
Quaternion.prototype.setRandom = function() {
    var x0 = Math.random();
    var r1 = Math.sqrt(1.0 - x0);
    var r2 = Math.sqrt(x0);
    var t1 = Math.PI * 2.0 * Math.random();
    var t2 = Math.PI * 2.0 * Math.random();
    var c1 = Math.cos(t1);
    var s1 = Math.sin(t1);
    var c2 = Math.cos(t2);
    var s2 = Math.sin(t2);
    this.storage[0] = s1 * r1;
    this.storage[1] = c1 * r1;
    this.storage[2] = s2 * r2;
    this.storage[3] = c2 * r2;
};

/**
 * @method setDQ
 * @description Set the quaternion to the time derivative of [q] with angular velocity [omega].
 * @param q {Quaternion}
 * @param omega {Vector3}
 */
Quaternion.prototype.setDQ = function(q, omega) {
    var qStorage = q.storage;
    var omegaStorage = omega.storage;
    var qx = qStorage[0];
    var qy = qStorage[1];
    var qz = qStorage[2];
    var qw = qStorage[3];
        var ox = omegaStorage[0];
    var oy = omegaStorage[1];
    var oz = omegaStorage[2];
    var _x = ox * qw + oy * qz - oz * qy;
    var _y = oy * qw + oz * qx - ox * qz;
    var _z = oz * qw + ox * qy - oy * qx;
    var _w = -ox * qx - oy * qy - oz * qz;
    this.storage[0] = _x * 0.5;
    this.storage[1] = _y * 0.5;
    this.storage[2] = _z * 0.5;
    this.storage[3] = _w * 0.5;
};

/**
 * @method setEuler
 * @description Set quaternion with rotation of [yaw], [pitch] and [roll].
 * @param yaw {number}
 * @param pitch {number}
 * @param roll {number}
 */
Quaternion.prototype.setEuler = function(yaw, pitch, roll) {
    var halfYaw = yaw * 0.5;
    var halfPitch = pitch * 0.5;
    var halfRoll = roll * 0.5;
    var cosYaw = Math.cos(halfYaw);
    var sinYaw = Math.sin(halfYaw);
    var cosPitch = Math.cos(halfPitch);
    var sinPitch = Math.sin(halfPitch);
    var cosRoll = Math.cos(halfRoll);
    var sinRoll = Math.sin(halfRoll);
    this.storage[0] = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
    this.storage[1] = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
    this.storage[2] = sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw;
    this.storage[3] = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
};

/**
 * @method normalize
 * @description Normalize [this].
 * @return {Quaternion}
 */
Quaternion.prototype.normalize = function() {
    var l = this.length;
    if (l == 0.0) {
        return this;
    }
    l = 1.0 / l;
    this.storage[3] = this.storage[3] * l;
    this.storage[2] = this.storage[2] * l;
    this.storage[1] = this.storage[1] * l;
    this.storage[0] = this.storage[0] * l;
    return this;
};

/**
 * @method conjugate
 * @description Conjugate [this].
 * @return {Quaternion}
 */
Quaternion.prototype.conjugate = function() {
    this.storage[2] = -this.storage[2];
    this.storage[1] = -this.storage[1];
    this.storage[0] = -this.storage[0];
    return this;
};

/**
 * @method inverse
 * @description Invert [this].
 * @return {Quaternion}
 */
Quaternion.prototype.inverse = function() {
    var l = 1.0 / this.length2;
    this.storage[3] = this.storage[3] * l;
    this.storage[2] = -this.storage[2] * l;
    this.storage[1] = -this.storage[1] * l;
    this.storage[0] = -this.storage[0] * l;
    return this;
};

/**
 * @method normalized
 * @description Normalized copy of [this].
 * @return {Quaternion}
 */
Quaternion.prototype.normalized = function() {
    var q = this.clone();
    q.normalize();
    return q;
};

/**
 * @method conjugated
 * @description Conjugated copy of [this].
 * @return {Quaternion}
 */
Quaternion.prototype.conjugated = function() {
    var q = this.clone();
    q.conjugate();
    return q;
};

/**
 * @method inverted
 * @description Inverted copy of [this].
 * @return {Quaternion}
 */
Quaternion.prototype.inverted = function() {
    var q = this.clone();
    q.inverse();
    return q;
};

/**
 * @property radians
 * @description [radians] of rotation around the [axis] of the rotation.
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("radians", function() {
    return 2.0 * Math.acos(this.storage[3]);
});

/**
 * @property axis
 * @description [axis] of rotation.
 * @type {Vector3}
 */
Quaternion.prototype.__defineGetter__("axis", function() {
    var scale = 1.0 / (1.0 - (this.storage[3] * this.storage[3]));
    return new Vector3(this.storage[0] * scale, this.storage[1] * scale, this.storage[2] * scale);
});

/**
 * @property length2
 * @description Length squared.
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("length2", function() {
    var x = this.storage[0];
    var y = this.storage[1];
    var z = this.storage[2];
    var w = this.storage[3];
    return (x * x) + (y * y) + (z * z) + (w * w);
});

/**
 * @property length
 * @description Length.
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("length", function() {
    return Math.sqrt(this.length2);
});

/**
 * @method rotated
 * @description Returns a copy of [v] rotated by quaternion.
 * @param v {Vector3}
 * @return {Vector3}
 */
Quaternion.prototype.rotated = function(v) {
    var out = v.clone();
    this.rotate(out);
    return out;
};

/**
 * @method rotate
 * @description Rotates [v] by [this].
 * @param v {Vector3}
 * @return {Vector3}
 */
Quaternion.prototype.rotate = function(v) {
    // conjugate(this) * [v,0] * this
    var _w = this.storage[3];
    var _z = this.storage[2];
    var _y = this.storage[1];
    var _x = this.storage[0];
    var tiw = _w;
    var tiz = -_z;
    var tiy = -_y;
    var tix = -_x;
    var tx = tiw * v.x + tix * 0.0 + tiy * v.z - tiz * v.y;
    var ty = tiw * v.y + tiy * 0.0 + tiz * v.x - tix * v.z;
    var tz = tiw * v.z + tiz * 0.0 + tix * v.y - tiy * v.x;
    var tw = tiw * 0.0 - tix * v.x - tiy * v.y - tiz * v.z;
    var result_x = tw * _x + tx * _w + ty * _z - tz * _y;
    var result_y = tw * _y + ty * _w + tz * _x - tx * _z;
    var result_z = tw * _z + tz * _w + tx * _y - ty * _x;
    var vStorage = v.storage;
    vStorage[2] = result_z;
    vStorage[1] = result_y;
    vStorage[0] = result_x;
    return v;
};

/**
 * @method add
 * @description Add [arg] to [this].
 * @param arg {Quaternion}
 */
Quaternion.prototype.add = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = this.storage[0] + argStorage[0];
    this.storage[1] = this.storage[1] + argStorage[1];
    this.storage[2] = this.storage[2] + argStorage[2];
    this.storage[3] = this.storage[3] + argStorage[3];
};

/**
 * @method sub
 * @description Subtracts [arg] from [this].
 * @param arg {Quaternion}
 */
Quaternion.prototype.sub = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = this.storage[0] - argStorage[0];
    this.storage[1] = this.storage[1] - argStorage[1];
    this.storage[2] = this.storage[2] - argStorage[2];
    this.storage[3] = this.storage[3] - argStorage[3];
};

/**
 * @method scale
 * @description Scales [this] by [scale].
 * @param scale {number}
 */
Quaternion.prototype.scale = function(scale) {
    this.storage[3] = this.storage[3] * scale;
    this.storage[2] = this.storage[2] * scale;
    this.storage[1] = this.storage[1] * scale;
    this.storage[0] = this.storage[0] * scale;
};

/**
 * @method scaled
 * @description Scaled copy of [this].
 * @param scale {number}
 * @return {Quaternion}
 */
Quaternion.prototype.scaled = function(scale) {
    var q = this.clone();
    q.scale(scale);
    return q;
};

/**
 * @method mult
 * @description [this] rotated by [other].
 * @param other {Quaternion}
 * @return {Quaternion}
 */
Quaternion.prototype.mult = function(other) {
    var _w = this.storage[3];
    var _z = this.storage[2];
    var _y = this.storage[1];
    var _x = this.storage[0];
    var otherStorage = other.storage;
    var ow = otherStorage[3];
    var oz = otherStorage[2];
    var oy = otherStorage[1];
    var ox = otherStorage[0];
    return new Quaternion(
        _w * ox + _x * ow + _y * oz - _z * oy,
        _w * oy + _y * ow + _z * ox - _x * oz,
        _w * oz + _z * ow + _x * oy - _y * ox,
        _w * ow - _x * ox - _y * oy - _z * oz);
};

/**
 * @method equals
 * @description Returns if other equals this
 * @param other {Quaternion}
 * @return {boolean}
 */
Quaternion.prototype.equals = function(other) {
    return (this.storage[0] == other.storage[0] &&
            this.storage[1] == other.storage[1] &&
            this.storage[2] == other.storage[2] &&
            this.storage[3] == other.storage[3])
};

/**
 * @method almostEquals
 * @description Returns if other is almost this
 * @param q {Quaternion}
 * @param precision {number}
 * @return {boolean}
 */
Quaternion.prototype.almostEquals = function(q, precision) {
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if (Math.abs(this.x - q.x) > precision ||
        Math.abs(this.y - q.y) > precision ||
        Math.abs(this.z - q.z) > precision ||
        Math.abs(this.w - q.w) > precision) {
        return false;
    }
    return true;
};

/**
 * @method added
 * @description Returns copy of [this] + [other].
 * @param other {Quaternion}
 * @return {Quaternion}
 */
Quaternion.prototype.added = function(other) {
    var q = this.clone();
    q.add(other);
    return q;
};

/**
 * @method subbed
 * @description Returns copy of [this] - [other].
 * @param other {Quaternion}
 * @return {Quaternion}
 */
Quaternion.prototype.subbed = function(other) {
    var q = this.clone();
    q.sub(other);
    return q;
};

/**
 * @method negated
 * @description Returns negated copy of [this].
 * @return {Quaternion}
 */
Quaternion.prototype.negated = function() {
    return this.conjugated();
};

/**
 * @method getAt
 * @description Access the component of the quaternion at the index [i].
 * @param i {number}
 * @return {number}
 */
Quaternion.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * @method setAt
 * @description Set the component of the quaternion at the index [i].
 * @param i {number}
 * @param arg {number}
 */
Quaternion.prototype.setAt = function(i, arg) {
    this.storage[i] = arg;
};

/**
 * @method asRotationMatrix
 * @description Returns a rotation matrix containing the same rotation as [this].
 * @return {Matrix3}
 */
Quaternion.prototype.asRotationMatrix = function() {
    return this.copyRotationInto(Matrix3.zero());
};

/**
 * @method copyRotationInto
 * @description Set [rotationMatrix] to a rotation matrix containing the same rotation as [this].
 * @param rotationMatrix {Matrix3}
 * @return {Matrix3}
 */
Quaternion.prototype.copyRotationInto = function(rotationMatrix) {
    var d = this.length2;
    if (d == 0.0) {
        return null;
    }
    var s = 2.0 / d;

    var _x = this.storage[0];
    var _y = this.storage[1];
    var _z = this.storage[2];
    var _w = this.storage[3];

    var xs = _x * s;
    var ys = _y * s;
    var zs = _z * s;

    var wx = _w * xs;
    var wy = _w * ys;
    var wz = _w * zs;

    var xx = _x * xs;
    var xy = _x * ys;
    var xz = _x * zs;

    var yy = _y * ys;
    var yz = _y * zs;
    var zz = _z * zs;

    var rotationMatrixStorage = rotationMatrix.storage;
    rotationMatrixStorage[0] = 1.0 - (yy + zz); // column 0
    rotationMatrixStorage[1] = xy + wz;
    rotationMatrixStorage[2] = xz - wy;
    rotationMatrixStorage[3] = xy - wz; // column 1
    rotationMatrixStorage[4] = 1.0 - (xx + zz);
    rotationMatrixStorage[5] = yz + wx;
    rotationMatrixStorage[6] = xz + wy; // column 2
    rotationMatrixStorage[7] = yz - wx;
    rotationMatrixStorage[8] = 1.0 - (xx + yy);
    return rotationMatrix;
};

/**
 * @method toString
 * @description Printable string.
 * @return {string}
 */
Quaternion.prototype.toString = function() {
    return this.storage[0].toString() + ', ' +
           this.storage[1].toString() + ', ' +
           this.storage[2].toString() + ', ' +
           this.storage[3].toString();
};

/**
 * @method relativeError
 * @description Relative error between [this] and [correct].
 * @param correct {Quaternion}
 * @return {number}
 */
Quaternion.prototype.relativeError = function(correct) {
    var diff = correct.subbed(this);
    var norm_diff = diff.length;
    var correct_norm = correct.length;
    return norm_diff / correct_norm;
};

/**
 * @method absoluteError
 * @description Absolute error between [this] and [correct].
 * @param correct {Quaternion}
 * @return {number}
 */
Quaternion.prototype.absoluteError = function(correct) {
    var this_norm = this.length;
    var correct_norm = correct.length;
    var norm_diff = Math.abs(this_norm - correct_norm);
    return norm_diff;
};
},{"./matrix3.js":12,"./vector3.js":21}],17:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Ray;

var Vector3 = require('./vector3.js');
var Aabb3 = require('./aabb3.js');

/**
 * @class Ray
 * @description Defines a [Ray] by an [origin] and a [direction].
 * @constructor
 */
function Ray () {
    /**
     * @property origin
     * @type {Vector3}
     */
    this.origin = Vector3.zero();

    /**
     * @property direction
     * @type {Vector3}
     */
    this.direction = Vector3.zero();
}

/**
 * @static copy
 * @description Create a ray as a copy of [other].
 * @param other {Ray}
 * @return {Ray}
 */
Ray.copy = function(other) {
    var r = new Ray();
    r.origin.setFrom(other.origin);
    r.direction.setFrom(other.direction);
    return r;
};

/**
 * @static originDirection
 * @description Create a ray with an [origin] and a [direction].
 * @param origin {Vector3}
 * @param direction {Vector3}
 * @return {Ray}
 */
Ray.originDirection = function(origin, direction) {
    var r = new Ray();
    r.origin.setFrom(origin);
    r.direction.setFrom(direction);
    return r;
};

/**
 * @method copyFrom
 * @description Copy the [origin] and [direction] from [other] into [this].
 * @param other {Ray}
 */
Ray.prototype.copyFrom = function(other) {
    this.origin.setFrom(other.origin);
    this.direction.setFrom(other.direction);
};

/**
 * @method at
 * @description return the position on [this] with a distance of [t] from [origin].
 * @param t {Number}
 * @return {Vector3}
 */
Ray.prototype.at = function(t) {
    var res = this.direction.scaled(t);
    res.add(this.origin);
    return res;
};

/**
 * @method copyAt
 * @description Copy the position on [this] with a distance of [t] from [origin] into [other].
 * @param other {Vector3}
 * @param t {number}
 */
Ray.prototype.copyAt = function(other, t) {
    other.setFrom(this.direction);
    other.scale(t);
    other.add(this.origin);
};

/**
 * @method intersectsWithSphere
 * @description Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Sphere}
 * @return {number|null}
 */
Ray.prototype.intersectsWithSphere = function(other) {
    var r = other.radius;
    var r2 = r * r;
    var l = other.center.clone();
    l.sub(this.origin);
    var s = l.dot(this.direction);
    var l2 = l.dot(l);
    if (s < 0 && l2 > r2) {
        return null;
    }
    var m2 = l2 - s * s;
    if (m2 > r2) {
        return null;
    }
    var q = Math.sqrt(r2 - m2);

    return (l2 > r2) ? s - q : s + q;
};

// Some varaibles that are used for intersectsWithTriangle and
// intersectsWithQuad. The performance is better in JS if we avoid
// to create temporary instance over and over. Also reduce GC.
var _e1 = Vector3.zero();
var _e2 = Vector3.zero();
var _q = Vector3.zero();
var _s = Vector3.zero();
var _r = Vector3.zero();

/**
 * @method intersectsWithTriangle
 * @description Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Triangle}
 * @return {number | null}
 */
Ray.prototype.intersectsWithTriangle = function(other) {
    var EPSILON = 10e-6;

    var point0 = other.point0;
    var point1 = other.point1;
    var point2 = other.point2;

    _e1.setFrom(point1);
    _e1.sub(point0);
    _e2.setFrom(point2);
    _e2.sub(point0);

    _q = this.direction.cross(_e2);
    var a = _e1.dot(_q);

    if (a > -EPSILON && a < EPSILON) {
        return null;
    }

    var f = 1 / a;
    _s.setFrom(this.origin);
    _s.sub(point0);
    var u = f * (_s.dot(_q));

    if (u < 0.0) {
        return null;
    }

    _r = _s.cross(_e1);
    var v = f * (this.direction.dot(_r));

    if (v < -EPSILON || u + v > 1.0 + EPSILON) {
        return null;
    }

    var t = f * (_e2.dot(_r));

    return t;
};

/**
 * @method intersectsWithQuad
 * @description  Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Quad}
 * @return {number | null}
 */
Ray.prototype.intersectsWithQuad = function(other) {
    var EPSILON = 10e-6;

    // First triangle
    var point0 = other.point0;
    var point1 = other.point1;
    var point2 = other.point2;

    _e1.setFrom(point1);
    _e1.sub(point0);
    _e2.setFrom(point2);
    _e2.sub(point0);

    _q = this.direction.crossInto(_e2);
    var a0 = _e1.dot(_q);

    if (!(a0 > -EPSILON && a0 < EPSILON)) {
        var f = 1 / a0;
        _s.setFrom(this.origin);
        _s.sub(point0);
        var u = f * (_s.dot(_q));

        if (u >= 0.0) {
            _r = _s.cross(_e1);
            var v = f * (this.direction.dot(_r));

            if (!(v < -EPSILON || u + v > 1.0 + EPSILON)) {
                var t = f * (_e2.dot(_r));

                return t;
            }
        }
    }

    // Second triangle
    point0 = other.point3;
    point1 = other.point0;
    point2 = other.point2;

    _e1.setFrom(point1);
    _e1.sub(point0);
    _e2.setFrom(point2);
    _e2.sub(point0);

    _q = this.direction.cross(_e2);
    var a1 = _e1.dot(_q);

    if (!(a1 > -EPSILON && a1 < EPSILON)) {
        f = 1 / a1;
        _s.setFrom(this.origin);
        _s.sub(point0);
        u = f * (_s.dot(_q));

        if (u >= 0.0) {
            _r = _s.cross(_e1);
            v = f * (this.direction.dot(_r));

            if (!(v < -EPSILON || u + v > 1.0 + EPSILON)) {
                t = f * (_e2.dot(_r));

                return t;
            }
        }
    }

    return null;
};

/**
 * @method intersectsWithAabb3
 * @description Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Aabb3}
 * @return {number | null}
 */
Ray.prototype.intersectsWithAabb3 = function(other) {
    var otherMin = other.min;
    var otherMax = other.max;

    var tNear =  - Number.MAX_VALUE; //-double.MAX_FINITE;
    var tFar = Number.MAX_VALUE; //double.MAX_FINITE;

    for (var i = 0; i < 3; ++i) {
        if (this.direction.storage[i] == 0.0) {
            if (this.origin.storage[i] < otherMin.storage[i] || this.origin.storage[i] > otherMax.storage[i]) {
                return null;
            }
        } else {
            var t1 = (otherMin.storage[i] - this.origin.storage[i]) / this.direction.storage[i];
            var t2 = (otherMax.storage[i] - this.origin.storage[i]) / this.direction.storage[i];

            if (t1 > t2) {
                var temp = t1;
                t1 = t2;
                t2 = temp;
            }

            if (t1 > tNear) {
                tNear = t1;
            }

            if (t2 < tFar) {
                tFar = t2;
            }

            if (tNear > tFar || tFar < 0.0) {
                return null;
            }
        }
    }

    return tNear;
};


},{"./aabb3.js":9,"./vector3.js":21}],18:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Sphere;

var Vector3 = require('./vector3.js');

/**
 * @class Sphere
 * @description Defines a sphere with a [center] and a [radius].
 * @constructor
 */
function Sphere() {
    /**
     * @property center
     * @type {Vector3}
     */
    this.center = Vector3.zero();

    /**
     * @property radius
     * @type {number}
     */
    this.radius = 0.0;
}
/**
 * @static copy
 * @description Create a sphere as a copy of [other].
 * @param other {Sphere}
 * @return {Sphere}
 */
Sphere.copy = function(other) {
    var s = new Sphere();
    s.center.setFrom(other.center);
    s.radius = other.radius;
    return s;
};

/**
 * @static centerRadius
 * @description Create a sphere from a [center] and a [radius].
 * @param center {Vector3}
 * @param radius {number}
 * @return {Sphere}
 */
Sphere.centerRadius = function(center, radius) {
    var s = new Sphere();
    s.center.setFrom(center);
    s.radius = radius;
    return s;
};

/**
 * @method copyFrom
 * @description Copy the sphere from [other] into [this].
 * @param other {Sphere}
 */
Sphere.prototype.copyFrom = function(other) {
    this.center.setFrom(other.center);
    this.radius = other.radius;
};

/**
 * @method containsVector3
 * @description Return if [this] contains [other].
 * @param other {Vector3}
 * @return {boolean}
 */
Sphere.prototype.containsVector3 = function(other) {
    return other.distanceToSquared(this.center) < this.radius * this.radius;
};

/**
 * @method intersectsWithVector3
 * @description Return if [this] intersects with [other].
 * @param other {Vector3}
 * @return {boolean}
 */
Sphere.prototype.intersectsWithVector3 = function(other) {
    return other.distanceToSquared(this.center) <= this.radius * this.radius;
};

/**
 * @method intersectsWithSphere
 * @description Return if [this] intersects with [other].
 * @param other {Sphere}
 * @return {boolean}
 */
Sphere.prototype.intersectsWithSphere = function(other) {
    var radiusSum = this.radius + other.radius;
    return other.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
};

},{"./vector3.js":21}],19:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Triangle;

var Vector3 = require('./vector3.js');

/**
 * @class Triangle
 * @description Defines a triangle by three points.
 * @constructor
 */
function Triangle() {
    /**
     * @property point0
     * @type {Vector3}
     */
    this.point0 = Vector3.zero();

    /**
     * @property point1
     * @type {Vector3}
     */
    this.point1 = Vector3.zero();

    /**
     * @property point2
     * @type {Vector3}
     */
    this.point2 = Vector3.zero();
}

/**
 * @static copy
 * @description Create a triangle as a copy of [other].
 * @param other {Triangle}
 * @return {Triangle}
 */
Triangle.copy = function(other) {
    var t = new Triangle();
    t.point0.setFrom(other.point0);
    t.point1.setFrom(other.point1);
    t.point2.setFrom(other.point2);
    return t;
};

/**
 * @static points
 * @description Create a triangle by three points.
 * @param point0 {Vector3}
 * @param point1 {Vector3}
 * @param point2 {Vector3}
 * @return {Triangle}
 */
Triangle.points = function(point0, point1, point2) {
    var t = new Triangle();
    t.point0.setFrom(point0);
    t.point1.setFrom(point1);
    t.point2.setFrom(point2);
    return t;
};

/**
 * @method copyFrom
 * @description Copy the triangle from [other] into [this].
 * @param other {Triangle}
 */
Triangle.prototype.copyFrom = function(other) {
    this.point0.setFrom(other.point0);
    this.point1.setFrom(other.point1);
    this.point2.setFrom(other.point2);
};

/**
 * @method copyNormalInto
 * @description Copy the normal of [this] into [normal].
 * @param normal {Vector3}
 */
Triangle.prototype.copyNormalInto = function(normal) {
    var v0 = this.point0.clone().sub(this.point1);
    normal.setFrom(this.point2);
    normal.sub(this.point1);
    var n = normal.cross(v0);
    n.normalize();
    normal.setFrom(n);
};

/**
 * @method transform
 * @description Transform [this] by the transform [t].
 * @param t {Matrix4}
 */
Triangle.prototype.transform = function(t) {
    t.transform3(this.point0);
    t.transform3(this.point1);
    t.transform3(this.point2);
};

/**
 * @method translate
 * @description Translate [this] by [offset].
 * @param offset {Vector3}
 */
Triangle.prototype.translate = function(offset) {
    this.point0.add(offset);
    this.point1.add(offset);
    this.point2.add(offset);
};

},{"./vector3.js":21}],20:[function(require,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector2;

var vector_math = require('./common.js');
var SIMD = require("simd");

/**
 * @class Vector2
 * @param x {number}
 * @param y {number}
 * @constructor
 */
function Vector2(x, y){
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([x, y]);

    /**
     * @property simd_storage
     * @type {null|Float32x4}
     */
    this.simd_storage = null;
}

/**
 * @static
 * SIMD specialization
 */
Vector2.simd = {};
/**
 * @static
 * Scalar specialization
 */
Vector2.scalar = {};

/**
 * @static
 * Load SIMD.Float32x4 into vector.simd_storage
 * @param vector {Vector2}
 */
Vector2.simd.load = function(vector) {
    vector.simd_storage = SIMD.Float32x4.load2(vector.storage, 0);
};

/**
 * @static
 * Store SIMD.Float32x4 at vector.simd_storage into vector.storage
 * @param vector {Vector2}
 */
Vector2.simd.store = function(vector) {
    SIMD.Float32x4.store2(vector.storage, 0, vector.simd_storage);
};

/**
 * @property x
 * @type {Number}
 */
Vector2.prototype.__defineGetter__("x", function() {
    return this.storage[0];
});
Vector2.prototype.__defineSetter__("x", function(value) {
    this.storage[0] = value;
});

/**
 * @property y
 * @type {Number}
 */
Vector2.prototype.__defineGetter__("y", function() {
    return this.storage[1];
});
Vector2.prototype.__defineSetter__("y", function(value) {
    this.storage[1] = value;
});

/**
 * @property length
 * @type {number}
 */
Vector2.prototype.__defineGetter__("length", function() {
    return Math.sqrt(this.length2());
});
Vector2.prototype.__defineSetter__("length", function(value) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd._setter_length(this, value);
    }
    else {
        Vector2.scalar._setter_length(this, value);
    }
});

/**
 * @static
 * @description Scalar version of set length
 * @param vector {Vector2}
 * @param value {Number}
 * @private
 */
Vector2.scalar._setter_length = function(vector, value) {
    if (value == 0.0) {
        vector.setZero();
    }
    else {
        var l = this.length;
        if (l == 0.0) {
            return;
        }
        l = value / l;
        vector.storage[0] *= l;
        vector.storage[1] *= l;
    }
};

Vector2.simd._setter_length = function(vector, value) {
    if (value == 0.0) {
        vector.setZero();
    }
    else {
        var l = vector.length;
        if (l == 0.0) {
            return;
        }
        l = value / l;
        Vector2.simd.load(vector);
        vector.simd_storage = SIMD.Float32x4.mul(vector.simd_storage, SIMD.Float32x4(l, l, 0, 0));
        Vector2.simd.store(vector);
    }
};

/**
 * @static
 * @property {Vector2} zero
 */
Vector2.zero = function() {
    var v = new Vector2(0.0, 0.0);
    return v;
};

/**
 * @method setZero
 * @description Zero the vector.
 * @return {Vector2}
 */
Vector2.prototype.setZero = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    return this;
};

/**
 * @static fromFloat32Array
 * @description Constructs Vector2 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Vector2}
 */
Vector2.fromFloat32Array = function(array) {
    var vec = Vector2.zero();
    vec.storage = array;
    return vec;
};


/**
 * @static fromBuffer
 * @description Constructs Vector2 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @return {Vector2}
 */
Vector2.fromBuffer = function(buffer, offset) {
    var vec = Vector2.zero();
    vec.storage = new Float32Array(buffer, offset, 3);
    return vec.clone();
};

/**
 * @method setValues
 * @description Set the values of the vector.
 * @param x
 * @param y
 * @returns {Vector2}
 */
Vector2.prototype.setValues = function(x, y) {
    this.storage[0] = x;
    this.storage[1] = y;
    return this;
};

/**
 * @property copy
 * @type {Vector2}
 */
Vector2.copy = function(v) {
    return new Vector2(v.x, v.y);
};

/**
 * @static all
 * @property {Vector2} all
 */
Vector2.all = function(value) {
    var v = Vector2.zero();
    v.splat(value);
    return v;
};

/**
 * @static min
 * @description Set the values of [result] to the minimum of [a] and [b] for each line.
 * @param a {Vector2}
 * @param b {Vector2}
 * @param result {Vector2}
 */
Vector2.min = function(a, b, result) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.min(a, b, result);
    }
    else {
        Vector2.scalar.min(a, b, result);
    }
};
Vector2.scalar.min = function(a, b, result) {
    result.storage[0] = Math.min(a.x, b.x);
    result.storage[1] = Math.min(a.y, b.y);
};
Vector2.simd.min = function(a, b, result) {
    Vector2.simd.load(a);
    Vector2.simd.load(b);
    result.simd_storage = SIMD.Float32x4.min(a.simd_storage, b.simd_storage);

    Vector2.simd.store(result);
};
/**
 * @static max
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @static
 * @param a {Vector2}
 * @param b {Vector2}
 * @param result {Vector2}
 */
Vector2.max = function(a, b, result) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.max(a, b, result);
    }
    else {
        Vector2.scalar.max(a, b, result);
    }
};

Vector2.scalar.max = function(a, b, result) {
    result.x = Math.max(a.x, b.x);
    result.y = Math.max(a.y, b.y);
    result.z = Math.max(a.z, b.z);
};

Vector2.simd.max = function(a, b, result) {
    Vector2.simd.load(a);
    Vector2.simd.load(b);
    result.simd_storage = SIMD.Float32x4.max(a.simd_storage, b.simd_storage);
    Vector2.simd.store(result);
};

/**
 * @static mix
 * @description Interpolate between [min] and [max] with the amount of [a] using a linear
 * interpolation and store the values in [result].
 * @static
 * @param min {Vector2}
 * @param max {Vector2}
 * @param a {Number}
 * @param result {Vector2}
 */
Vector2.mix = function(min, max, a, result) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.mix(min, max, a, result);
    }
    else {
        Vector2.scalar.mix(min, max, a, result);
    }
};
Vector2.scalar.mix = function(min, max, a, result) {
    result.x = min.x + a * (max.x - min.x);
    result.y = min.y + a * (max.y - min.y);
};
Vector2.simd.mix = function(min, max, a, result) {
    Vector2.simd.load(min);
    Vector2.simd.load(max);
    var sub = SIMD.Float32x4.sub(max.simd_storage, min.simd_storage);
    var interp = SIMD.Float32x4.mul(sub, SIMD.Float32x4(a, a, a, a));
    result.simd_storage = SIMD.Float32x4.add(min.simd_storage, interp);
    Vector2.simd.store(result);
};

/**
 * @method clone
 * @description return a copy of this
 * @return {Vector2}
 */
Vector2.prototype.clone = function() {
    return Vector2.copy(this);
};

/**
 * @method setFrom
 * @description Set this to be equal to [v]
 * @param v {Vector2}
 * @return {Vector2}
 */
Vector2.prototype.setFrom = function(v) {
    this.storage[0] = v.storage[0];
    this.storage[1] = v.storage[1];
    return this;
};

/**
 * @method splat
 * @description Splat [arg] into all lanes of the vector.
 * @param value {Number}
 */
Vector2.prototype.splat = function(value) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.splat(this, value);
    }
    else {
        Vector2.scalar.splat(this, value);
    }
    return this;
};
Vector2.scalar.splat = function(that, value) {
    that.storage[0] = value;
    that.storage[1] = value;
};
Vector2.simd.splat = function(that, value) {
    Vector2.simd.load(that);
    that.simd_storage = SIMD.Float32x4.splat(value);
    Vector2.simd.store(that);
};

/**
 * @method almostEquals
 * @description return if this is almost equal to other
 * @param v {Vector2}
 * @param precision {number}
 * @return {boolean}
 */
Vector2.prototype.almostEquals = function(v, precision) {
    if (precision === undefined) {
        precision = vector_math.EPSILON;
    }

    if (vector_math.USE_SIMD()) {
        return Vector2.simd.almostEquals(this, v, precision);
    }
    else {
        return Vector2.scalar.almostEquals(this, v, precision);
    }
};
Vector2.scalar.almostEquals = function(that, v, precision) {
    if (Math.abs(this.x - v.x) > precision ||
        Math.abs(this.y - v.y) > precision) {
        return false;
    }
    return true;
};
Vector2.simd.almostEquals = function(that, v, p) {
    Vector2.simd.load(that);
    Vector2.simd.load(v);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, v.simd_storage);
    that.simd_storage = SIMD.Float32x4.abs(that.simd_storage);
    that.simd_storage = SIMD.Float32x4.greaterThan(that.simd_storage, SIMD.Float32x4(p, p, p, p));
    if (SIMD.Bool32x4.extractLane(that.simd_storage, 0) ||
        SIMD.Bool32x4.extractLane(that.simd_storage, 1)) {
        return false;
    }
    return true;
};

/**
 * @method equals
 * @description return if this is equal to other
 * @param v {Vector2}
 * @return {boolean}
 */
Vector2.prototype.equals = function(v) {
    return (this.x == v.x && this.y == v.y);
};

/**
 * @method almostZero
 * @description return if this is almost a zero vector
 * @param precision {number}
 * @return {boolean}
 */
Vector2.prototype.almostZero = function(precision) {
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if (Math.abs(this.x) > precision ||
        Math.abs(this.y) > precision) {
        return false;
    }
    return true;
};

/**
 * @method isZero
 * @description return if this is a Zero vector
 * @return {boolean}
 */
Vector2.prototype.isZero = function() {
  return (this.x == 0 && this.y == 0);
};

/**
 * @method negate
 * @description Negate this
 * @return {Vector2}
 */
Vector2.prototype.negate = function() {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.negate(this);
    }
    else {
        Vector2.scalar.negate(this);
    }
    return this;
};
Vector2.scalar.negate = function(that) {
    that.storage[0] = - that.storage[0];
    that.storage[1] = - that.storage[1];
};
Vector2.simd.negate = function(that) {
    Vector2.simd.load(that);
    that.simd_storage = SIMD.Float32x4.neg(that.simd_storage);
    Vector2.simd.store(that);
};

/**
 * @method sub
 * @description Subtract other to this
 * @param other {Vector2}
 * @return {Vector2}
 */
Vector2.prototype.sub = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.sub(this, other);
    }
    else {
        Vector2.scalar.sub(this, other);
    }
    return this;
};

Vector2.scalar.sub = function(that, other) {
    that.storage[0] = that.storage[0] - other.storage[0];
    that.storage[1] = that.storage[1] - other.storage[1];
};
Vector2.simd.sub = function(that, other) {
    Vector2.simd.load(that);
    Vector2.simd.load(other);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, other.simd_storage);
    Vector2.simd.store(that);
};

/**
 * @method add
 * @description Add other to this
 * @param other {Vector2}
 * @return {Vector2}
 */
Vector2.prototype.add = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.add(this, other);
    }
    else {
        Vector2.scalar.add(this, other);
    }
    return this;
};

Vector2.scalar.add = function(that, other) {
    that.storage[0] = that.storage[0] + other.storage[0];
    that.storage[1] = that.storage[1] + other.storage[1];
};
Vector2.simd.add = function(that, other) {
    Vector2.simd.load(that);
    Vector2.simd.load(other);
    that.simd_storage = SIMD.Float32x4.add(that.simd_storage, other.simd_storage);
    Vector2.simd.store(that);
};

/**
 * @method mul
 * @description Multiply other to this
 * @param other
 * @return {Vector2}
 */
Vector2.prototype.mul = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.mul(this, other);
    }
    else {
        Vector2.scalar.mul(this, other);
    }
    return this;
};

Vector2.scalar.mul = function(that, other) {
    that.storage[0] = that.storage[0] + other.storage[0];
    that.storage[1] = that.storage[1] + other.storage[1];
};
Vector2.simd.mul = function(that, other) {
    Vector2.simd.load(that);
    Vector2.simd.load(other);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, other.simd_storage);
    Vector2.simd.store(that);
};

/**
 * @method div
 * @description Divide this by other
 * @param other {Vector2}
 * @return {Vector2}
 */
Vector2.prototype.div = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.div(this, other);
    }
    else {
        Vector2.scalar.div(this, other);
    }
    return this;
};

Vector2.scalar.div = function(that, other) {
    that.storage[0] = that.storage[0] / other.storage[0];
    that.storage[1] = that.storage[1] / other.storage[1];
};
Vector2.simd.div = function(that, other) {
    Vector2.simd.load(that);
    Vector2.simd.load(other);
    that.simd_storage = SIMD.Float32x4.div(that.simd_storage, other.simd_storage);
    Vector2.simd.store(that);
};


/**
 * @method scale
 * @description Scale this
 * @param arg {number}
 * @return {Vector2}
 */
Vector2.prototype.scale = function(arg) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.scale(this, arg);
    }
    else {
        Vector2.scalar.scale(this, arg);
    }
    return this;
};

Vector2.scalar.scale = function(that, scale) {
    that.storage[0] = that.storage[0] * scale;
    that.storage[1] = that.storage[1] * scale;
};
Vector2.simd.scale = function(that, s) {
    Vector2.simd.load(that);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, SIMD.Float32x4(s, s, s, s));
    Vector2.simd.store(that);
};
/**
 * @method scaled
 * @description return Scaled copy of this
 * @param arg {number}
 * @return {Vector2}
 */
Vector2.prototype.scaled = function(arg) {
    var v = this.clone();
    v.scale(arg);
    return v;
};


/**
 * @method reflect
 * @description Reflect [this].
 * @param normal {Vector2}
 * @return {Vector2}
 */
Vector2.prototype.reflect = function(normal) {
    var n_copy = normal.clone();
    n_copy.scale(2.0 * normal.dot(this));
    this.sub(n_copy);
    return this;
};

/**
 * @method dot
 * @param v {Vector2}
 * @return {Number}
 */
Vector2.prototype.dot = function(v) {
    if (vector_math.USE_SIMD()) {
        return Vector2.simd.dot(this, v);
    }
    else {
        return Vector2.scalar.dot(this, v);
    }
};

Vector2.scalar.dot = function(that, v) {
    return that.storage[0] * v.storage[0] +
           that.storage[1] * v.storage[1];
};
Vector2.simd.dot = function(that, v) {
    Vector2.simd.load(that);
    Vector2.simd.load(v);

    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, v.simd_storage);
    return SIMD.Float32x4.extractLane(that.simd_storage, 0) +
        SIMD.Float32x4.extractLane(that.simd_storage, 1);
};

/**
 * @method cross
 * @description Compute cross product
 * @param v {Vector2}
 * @return {number}
 */
Vector2.prototype.cross = function(v) {
    return this.storage[0] * v.storage[1] -
           this.storage[1] * v.storage[0];
};

/**
 * @method absolute
 * @description Sets this to absolute values
 */
Vector2.prototype.absolute = function() {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.absolute(this);
    }
    else {
        Vector2.scalar.absolute(this);
    }
};
Vector2.scalar.absolute = function(that) {
    that.storage[0] = Math.abs(that.storage[0]);
    that.storage[1] = Math.abs(that.storage[1]);
};
Vector2.simd.absolute = function(that) {
    Vector2.simd.load(that);
    that.simd_storage = SIMD.Float32x4.abs(that.simd_storage);
    Vector2.store(that);
};
/**
 * @method clamp
 * @description Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector2}
 * @param max {Vector2}
 * @return {Vector2}
 */
Vector2.prototype.clamp = function(min, max) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.clamp(this, min, max);
    }
    else {
        Vector2.scalar.clamp(this, min, max);
    }
    return this;
};

Vector2.scalar.clamp = function(that, min, max) {
    var minStorage = min.storage;
    var maxStorage = max.storage;
    that.storage[0] = Math.min(Math.max(that.storage[0], minStorage[0]), maxStorage[0]);
    that.storage[1] = Math.min(Math.max(that.storage[1], minStorage[1]), maxStorage[1]);
};
Vector2.simd.clamp = function(that, min, max) {
    Vector2.simd.load(that);
    Vector2.simd.load(min);
    Vector2.simd.load(max);
    var clamp_min = SIMD.Float32x4.max(that.simd_storage, min.simd_storage);
    that.simd_storage = SIMD.Float32x4.min(clamp_min, max.simd_storage);
    Vector2.simd.store(that);
};
/**
 * @method clampScalar
 * @description Clamp entries in [this] in the range [min]-[max].
 * @param min {number}
 * @param max {number}
 * @return {Vector2}
 */
Vector2.prototype.clampScalar = function(min, max) {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.clampScalar(this, min, max);
    }
    else {
        Vector2.scalar.clampScalar(this, min, max);
    }
    return this;
};

Vector2.scalar.clampScalar = function(that, min, max) {
    that.storage[0] = Math.min(Math.max(that.storage[0], min), max);
    that.storage[1] = Math.min(Math.max(that.storage[1], min), max);
    that.storage[2] = Math.min(Math.max(that.storage[2], min), max);
};
Vector2.simd.clampScalar = function(that, min, max) {
    Vector2.simd.load(that);
    var clamp_min = SIMD.Float32x4.max(that.simd_storage, SIMD.Float32x4(min, min, min, min));
    that.simd_storage = SIMD.Float32x4.min(clamp_min, SIMD.Float32x4(max, max, max, max));
    Vector2.simd.store(that);

};

/**
 * @method isNaN
 * @description Check if this contains NaN values
 * @return {boolean}
 */
Vector2.prototype.isNaN = function() {
    var is_nan = false;
    is_nan = is_nan || this.storage[0].isNaN;
    is_nan = is_nan || this.storage[1].isNaN;
    return is_nan;
};

/**
 * @method isInfinite
 * @description Check if this contains infinite values
 * @return {boolean}
 */
Vector2.prototype.isInfinite = function() {
    var is_inf = false;
    is_inf = is_inf || this.storage[0].isInfinite();
    is_inf = is_inf || this.storage[1].isInfinite();
    return is_inf;
};

/**
 * @method toString
 * @description Printable string
 * @return {string}
 */
Vector2.prototype.toString = function() {
    return '[x=' + this.storage[0] + ', y=' + this.storage[1] + ']';
};


/**
 * @method length2
 * @description Squared length
 * @return {number}
 */
Vector2.prototype.length2 = function() {
    return this.x * this.x + this.y * this.y;
};

/**
 * @method normalize
 * @description Normalize this
 * @return {Vector2}
 */
Vector2.prototype.normalize = function() {
    if (vector_math.USE_SIMD()) {
        Vector2.simd.normalize(this);
    }
    else {
        Vector2.scalar.normalize(this);
    }
    return this;
};

Vector2.scalar.normalize = function(that) {
    var l = that.length;
    if (l != 0.0) {
        l = 1.0 / l;
        that.storage[0] *= l;
        that.storage[1] *= l;
    }
};
Vector2.simd.normalize = function(that) {
    var l = that.length;
    if (l != 0.0) {
        l = 1.0 / l;
        Vector2.simd.load(that);
        that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, SIMD.Float32x4(l, l, l, l));
        Vector2.simd.store(that);
    }
};
/**
 * @method normalized
 * @description return a normalized copy of this
 * @return {Vector2}
 */
Vector2.prototype.normalized = function() {
    var v = this.clone();
    return v.normalize();
};

/**
 * @method distanceToSquared
 * @description Compute squared distance to oter
 * @param v {Vector2}
 * @return {number}
 */
Vector2.prototype.distanceToSquared = function(v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return dx * dx + dy * dy;
};

/**
 * @method distanceTo
 * @description Compute distance to other
 * @param v {Vector2}
 * @return {number}
 */
Vector2.prototype.distanceTo = function(v) {
   return Math.sqrt(this.distanceToSquared(v));
};

/**
 * @method floor
 * @description Floor entries in [this].
 * @return {Vector2}
 */
Vector2.prototype.floor = function() {
    this.storage[0] = Math.floor(this.x);
    this.storage[1] = Math.floor(this.y);
    return this;
};

/**
 * @method ceil
 * @description Ceil entries in [this].
 * @return {Vector2}
 */
Vector2.prototype.ceil = function() {
    this.storage[0] = Math.ceil(this.x);
    this.storage[1] = Math.ceil(this.y);
    return this;
};

/**
 * @method round
 * @description Round entries in [this].
 * @return {Vector2}
 */
Vector2.prototype.round = function() {
    this.storage[0] = Math.round(this.x);
    this.storage[1] = Math.round(this.y);
    return this;
};

/**
 * @method roundToZero
 * @description Round entries in [this] towards zero.
 * @return {Vector2}
 */
Vector2.prototype.roundToZero = function() {
    this.storage[0] = this.storage[0] < 0.0
        ? Math.ceil(this.storage[0])
        : Math.floor(this.storage[0]);
    this.storage[1] = this.storage[1] < 0.0
        ? Math.ceil(this.storage[1])
        : Math.floor(this.storage[1]);
    return this;
};
},{"./common.js":10,"simd":6}],21:[function(require,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector3;

var Matrix3 = require('./matrix3.js');
var Matrix4 = require('./matrix4.js');

var vector_math = require('./common.js');
var SIMD = require("simd");

/**
 * @class Vector3
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @constructor
 */
function Vector3(x, y, z){
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([x, y, z]);

    /**
     * @property simd_storage
     * @type {null|Float32x4}
     */
    this.simd_storage = null;
}

/**
 * @static
 * SIMD specialization
 */
Vector3.simd = {};
/**
 * @static
 * Scalar specialization
 */
Vector3.scalar = {};

/**
 * @static load
 * @description Load SIMD.Float32x4 into vector.simd_storage
 * @param vector {Vector3}
 */
Vector3.simd.load = function(vector) {
    vector.simd_storage = SIMD.Float32x4.load3(vector.storage, 0);
};

/**
 * @static store
 * @description Store SIMD.Float32x4 at vector.simd_storage into vector.storage
 * @param vector {Vector3}
 */
Vector3.simd.store = function(vector) {
    SIMD.Float32x4.store3(vector.storage, 0, vector.simd_storage);
};


/**
 * @property x
 * @type {Number}
 */
Vector3.prototype.__defineGetter__("x", function() {
    return this.storage[0];
});
Vector3.prototype.__defineSetter__("x", function(value) {
    this.storage[0] = value;
});

/**
 * @property y
 * @type {Number}
 */
Vector3.prototype.__defineGetter__("y", function() {
    return this.storage[1];
});
Vector3.prototype.__defineSetter__("y", function(value) {
    this.storage[1] = value;
});

/**
 * @property z
 * @type {Number}
 */
Vector3.prototype.__defineGetter__("z", function() {
    return this.storage[2];
});
Vector3.prototype.__defineSetter__("z", function(value) {
    this.storage[2] = value;
});

/**
 * @property length
 * @type {number}
 */
Vector3.prototype.__defineGetter__("length", function() {
    return Math.sqrt(this.length2());
});
Vector3.prototype.__defineSetter__("length", function(value) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd._setter_length(this, value);
    }
    else {
        Vector3.scalar._setter_length(this, value);
    }
});

Vector3.scalar._setter_length = function(vector, value) {
    if (value == 0.0) {
        vector.setZero();
    }
    else {
        var l = this.length;
        if (l == 0.0) {
            return;
        }
        l = value / l;
        vector.storage[0] *= l;
        vector.storage[1] *= l;
        vector.storage[2] *= l;
    }
};

Vector3.simd._setter_length = function(vector, value) {
    if (value == 0.0) {
        vector.setZero();
    }
    else {
        var l = vector.length;
        if (l == 0.0) {
            return;
        }
        l = value / l;
        Vector3.simd.load(vector);
        vector.simd_storage = SIMD.Float32x4.mul(vector.simd_storage, SIMD.Float32x4(l, l, l, 0));
        Vector3.simd.store(vector);
    }
};

/**
 * @static zero
 * @property {Vector3} zero
 */
Vector3.zero = function() {
    var v = new Vector3(0.0, 0.0, 0.0);
    return v;
};

/**
 * @method setZero
 * @description Zero the vector.
 * @return {Vector3}
 */
Vector3.prototype.setZero = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    return this;
};

/**
 * @static fromFloat32Array
 * @description Constructs Vector3 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Vector3}
 */
Vector3.fromFloat32Array = function(array) {
    var vec = Vector3.zero();
    vec.storage = array;
    return vec;
};


/**
 * @static fromBuffer
 * @description Constructs Vector3 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @return {Vector3}
 */
Vector3.fromBuffer = function(buffer, offset) {
    var vec = Vector3.zero();
    vec.storage = new Float32Array(buffer, offset, 3);
    return vec.clone();
};

/**
 * @method setValues
 * @description Set the values of the vector.
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @return {Vector3}
 */
Vector3.prototype.setValues = function(x, y, z) {
    this.storage[0] = x;
    this.storage[1] = y;
    this.storage[2] = z;
    return this;
};


/**
 * @static copy
 * @param v {Vector3}
 * @return {Vector3}
 */
Vector3.copy = function(v) {
    return new Vector3(v.x, v.y, v.z);
};

/**
 * @static all
 * @param value {Vector3}
 */
Vector3.all = function(value) {
    var v = Vector3.zero();
    v.splat(value);
    return v;
};

/**
 * @static min
 * @description Set the values of [result] to the minimum of [a] and [b] for each line.
 * @param a {Vector3}
 * @param b {Vector3}
 * @param result {Vector3}
 */
Vector3.min = function(a, b, result) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.min(a, b, result);
    }
    else {
        Vector3.scalar.min(a, b, result);
    }
};
Vector3.scalar.min = function(a, b, result) {
    result.storage[0] = Math.min(a.x, b.x);
    result.storage[1] = Math.min(a.y, b.y);
    result.storage[2] = Math.min(a.z, b.z);
};
Vector3.simd.min = function(a, b, result) {
    Vector3.simd.load(a);
    Vector3.simd.load(b);
    result.simd_storage = SIMD.Float32x4.min(a.simd_storage, b.simd_storage);

    Vector3.simd.store(result);
};

/**
 * @static max
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @param a {Vector3}
 * @param b {Vector3}
 * @param result {Vector3}
 */
Vector3.max = function(a, b, result) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.max(a, b, result);
    }
    else {
        Vector3.scalar.max(a, b, result);
    }
};

Vector3.scalar.max = function(a, b, result) {
    result.x = Math.max(a.x, b.x);
    result.y = Math.max(a.y, b.y);
    result.z = Math.max(a.z, b.z);
};

Vector3.simd.max = function(a, b, result) {
    Vector3.simd.load(a);
    Vector3.simd.load(b);
    result.simd_storage = SIMD.Float32x4.max(a.simd_storage, b.simd_storage);
    Vector3.simd.store(result);
};

/**
 * @static mix
 * @description Interpolate between [min] and [max] with the amount of [a] using a linear
 * interpolation and store the values in [result].
 * @param min {Vector3}
 * @param max {Vector3}
 * @param a {Number}
 * @param result {Vector3}
 */
Vector3.mix = function(min, max, a, result) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.mix(min, max, a, result);
    }
    else {
        Vector3.scalar.mix(min, max, a, result);
    }
};
Vector3.scalar.mix = function(min, max, a, result) {
    result.x = min.x + a * (max.x - min.x);
    result.y = min.y + a * (max.y - min.y);
    result.z = min.z + a * (max.z - min.z);
};
Vector3.simd.mix = function(min, max, a, result) {
    Vector3.simd.load(min);
    Vector3.simd.load(max);
    var sub = SIMD.Float32x4.sub(max.simd_storage, min.simd_storage);
    var interp = SIMD.Float32x4.mul(sub, SIMD.Float32x4(a, a, a, a));
    result.simd_storage = SIMD.Float32x4.add(min.simd_storage, interp);
    Vector3.simd.store(result);
};

/**
 * @method clone
 * @description return a copy of this
 * @return {Vector3}
 */
Vector3.prototype.clone = function() {
    return Vector3.copy(this);
};

/**
 * @method setFrom
 * @description Set this from another vector3
 * @param v {Vector3}
 * @return {Vector3}
 */
Vector3.prototype.setFrom = function(v) {
    this.storage[0] = v.storage[0];
    this.storage[1] = v.storage[1];
    this.storage[2] = v.storage[2];
    return this;
};

/**
 * @method splat
 * @description Splat [arg] into all lanes of the vector.
 * @param value {Number}
 */
Vector3.prototype.splat = function(value) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.splat(this, value);
    }
    else {
        Vector3.scalar.splat(this, value);
    }
    return this;
};
Vector3.scalar.splat = function(that, value) {
    that.storage[0] = value;
    that.storage[1] = value;
    that.storage[2] = value;
};
Vector3.simd.splat = function(that, value) {
    Vector3.simd.load(that);
    that.simd_storage = SIMD.Float32x4.splat(value);
    Vector3.simd.store(that);
};

/**
 * @method almostEquals
 * @description Return if this is almost equal to other
 * @param v {Vector3}
 * @param precision {number}
 * @return {boolean}
 */
Vector3.prototype.almostEquals = function(v, precision) {
    if (precision === undefined) {
        precision = vector_math.EPSILON;
    }

    if (vector_math.USE_SIMD()) {
        return Vector3.simd.almostEquals(this, v, precision);
    }
    else {
        return Vector3.scalar.almostEquals(this, v, precision);
    }
};
Vector3.scalar.almostEquals = function(that, v, precision) {
    if (Math.abs(this.x - v.x) > precision ||
        Math.abs(this.y - v.y) > precision ||
        Math.abs(this.z - v.z) > precision) {
        return false;
    }
    return true;
};
Vector3.simd.almostEquals = function(that, v, p) {
    Vector3.simd.load(that);
    Vector3.simd.load(v);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, v.simd_storage);
    that.simd_storage = SIMD.Float32x4.abs(that.simd_storage);
    that.simd_storage = SIMD.Float32x4.greaterThan(that.simd_storage, SIMD.Float32x4(p, p, p, p));
    if (SIMD.Bool32x4.extractLane(that.simd_storage, 0) ||
        SIMD.Bool32x4.extractLane(that.simd_storage, 1) ||
        SIMD.Bool32x4.extractLane(that.simd_storage, 2)) {
        return false;
    }
    return true;
};
/**
 * @method equals
 * @description Return if this is equal to other
 * @param v {Vector3}
 * @return {boolean}
 */
Vector3.prototype.equals = function(v) {
    return (this.x == v.x && this.y == v.y && this.z == v.z);
};

Vector3.prototype.almostZero = function(precision) {
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if (Math.abs(this.x) > precision ||
        Math.abs(this.y) > precision ||
        Math.abs(this.z) > precision) {
        return false;
    }
    return true;
};

/**
 * @method isZero
 * @description return if this is a zero vector
 * @return {boolean}
 */
Vector3.prototype.isZero = function() {
  return (this.x == 0 && this.y == 0 && this.z == 0);
};

/**
 * @method negate
 * @description negate [this]
 * @return {Vector3}
 */
Vector3.prototype.negate = function() {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.negate(this);
    }
    else {
        Vector3.scalar.negate(this);
    }
    return this;
};

Vector3.scalar.negate = function(that) {
    that.storage[0] = - that.storage[0];
    that.storage[1] = - that.storage[1];
    that.storage[2] = - that.storage[2];
};
Vector3.simd.negate = function(that) {
    Vector3.simd.load(that);
    that.simd_storage = SIMD.Float32x4.neg(that.simd_storage);
    Vector3.simd.store(that);
};

/**
 * @method sub
 * @description Subtract other from this
 * @param other {Vector3}
 * @return {Vector3}
 */
Vector3.prototype.sub = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.sub(this, other);
    }
    else {
        Vector3.scalar.sub(this, other);
    }
    return this;
};

Vector3.scalar.sub = function(that, other) {
    that.storage[0] = that.storage[0] - other.storage[0];
    that.storage[1] = that.storage[1] - other.storage[1];
    that.storage[2] = that.storage[2] - other.storage[2];
};
Vector3.simd.sub = function(that, other) {
    Vector3.simd.load(that);
    Vector3.simd.load(other);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, other.simd_storage);
    Vector3.simd.store(that);
};

/**
 * @method add
 * @description Add other to this
 * @param other
 * @return {Vector3}
 */
Vector3.prototype.add = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.add(this, other);
    }
    else {
        Vector3.scalar.add(this, other);
    }
    return this;
};

Vector3.scalar.add = function(that, other) {
    that.storage[0] = that.storage[0] + other.storage[0];
    that.storage[1] = that.storage[1] + other.storage[1];
    that.storage[2] = that.storage[2] + other.storage[2];
};
Vector3.simd.add = function(that, other) {
    Vector3.simd.load(that);
    Vector3.simd.load(other);
    that.simd_storage = SIMD.Float32x4.add(that.simd_storage, other.simd_storage);
    Vector3.simd.store(that);
};

/**
 * @method mul
 * @description Multiply other to this
 * @param other
 * @return {Vector3}
 */
Vector3.prototype.mul = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.mul(this, other);
    }
    else {
        Vector3.scalar.mul(this, other);
    }
    return this;
};

Vector3.scalar.mul = function(that, other) {
    that.storage[0] = that.storage[0] + other.storage[0];
    that.storage[1] = that.storage[1] + other.storage[1];
    that.storage[2] = that.storage[2] + other.storage[2];
};
Vector3.simd.mul = function(that, other) {
    Vector3.simd.load(that);
    Vector3.simd.load(other);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, other.simd_storage);
    Vector3.simd.store(that);
};

/**
 * @method div
 * @description Divide this by other
 * @param other
 * @return {Vector3}
 */
Vector3.prototype.div = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.div(this, other);
    }
    else {
        Vector3.scalar.div(this, other);
    }
    return this;
};

Vector3.scalar.div = function(that, other) {
    that.storage[0] = that.storage[0] / other.storage[0];
    that.storage[1] = that.storage[1] / other.storage[1];
    that.storage[2] = that.storage[2] / other.storage[2];
};
Vector3.simd.div = function(that, other) {
    Vector3.simd.load(that);
    Vector3.simd.load(other);
    that.simd_storage = SIMD.Float32x4.div(that.simd_storage, other.simd_storage);
    Vector3.simd.store(that);
};

/**
 * @method scale
 * @description Scale this
 * @param arg {number}
 * @return {Vector3}
 */
Vector3.prototype.scale = function(arg) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.scale(this, arg);
    }
    else {
        Vector3.scalar.scale(this, arg);
    }
    return this;
};

Vector3.scalar.scale = function(that, scale) {
    that.storage[0] = that.storage[0] * scale;
    that.storage[1] = that.storage[1] * scale;
    that.storage[2] = that.storage[2] * scale;
};
Vector3.simd.scale = function(that, s) {
    Vector3.simd.load(that);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, SIMD.Float32x4(s, s, s, s));
    Vector3.simd.store(that);
};

/**
 * @method scaled
 * @description return Scaled copy this
 * @param arg
 * @return {Vector3}
 */
Vector3.prototype.scaled = function(arg) {
    var v = this.clone();
    v.scale(arg);
    return v;
};


/**
 * @method reflect
 * @description Reflect [this].
 * @param normal {Vector3}
 * @return {Vector3}
 */
Vector3.prototype.reflect = function(normal) {
    var n_copy = normal.clone();
    n_copy.scale(2.0 * normal.dot(this));
    this.sub(n_copy);
    return this;
};

/**
 * @method dot
 * @description Compute dot product
 * @param v {Vector3}
 * @return {Number}
 */
Vector3.prototype.dot = function(v) {
    if (vector_math.USE_SIMD()) {
        return Vector3.simd.dot(this, v);
    }
    else {
        return Vector3.scalar.dot(this, v);
    }
};

Vector3.scalar.dot = function(that, v) {
    return that.storage[0] * v.x +
           that.storage[1] * v.y +
           that.storage[2] * v.z;
};
Vector3.simd.dot = function(that, v) {
    Vector3.simd.load(that);
    Vector3.simd.load(v);

    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, v.simd_storage);
    return SIMD.Float32x4.extractLane(that.simd_storage, 0) +
           SIMD.Float32x4.extractLane(that.simd_storage, 1) +
           SIMD.Float32x4.extractLane(that.simd_storage, 2);
};

/**
 * @method cross
 * @description Compute cross product
 * @param v {Vector3}
 * @return {Vector3}
 */
Vector3.prototype.cross = function(v) {
    if (vector_math.USE_SIMD()) {
        return Vector3.simd.cross(this, v);
    }
    else {
        return Vector3.scalar.cross(this, v);
    }
};
Vector3.scalar.cross = function(that, v) {
    var x = that.storage[1] * v.storage[2] - that.storage[2] * v.storage[1];
    var y = that.storage[2] * v.storage[0] - that.storage[0] * v.storage[2];
    var z = that.storage[0] * v.storage[1] - that.storage[1] * v.storage[0];

    return new Vector3(x, y, z);
};
Vector3.simd.cross = function(that, v) {
    Vector3.simd.load(that);
    Vector3.simd.load(v);
    that.simd_storage = SIMD.Float32x4.swizzle(that.simd_storage, 1, 2, 0, 3);
    v.simd_storage = SIMD.Float32x4.swizzle(v.simd_storage, 2, 0, 1, 3);
    var mul1 = SIMD.Float32x4.mul(that.simd_storage, v.simd_storage);

    Vector3.simd.load(that);
    Vector3.simd.load(v);
    that.simd_storage = SIMD.Float32x4.swizzle(that.simd_storage, 2, 0, 1, 3);
    v.simd_storage = SIMD.Float32x4.swizzle(v.simd_storage, 1, 2, 0, 3);
    var mul2 = SIMD.Float32x4.mul(that.simd_storage, v.simd_storage);

    var res = SIMD.Float32x4.sub(mul1, mul2);
    return new Vector3(SIMD.Float32x4.extractLane(res, 0),
                       SIMD.Float32x4.extractLane(res, 1),
                       SIMD.Float32x4.extractLane(res, 2));
};

/**
 * @method absolute
 * @description Set this to absolute value
 */
Vector3.prototype.absolute = function() {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.absolute(this);
    }
    else {
        Vector3.scalar.absolute(this);
    }
};
Vector3.scalar.absolute = function(that) {
    that.storage[0] = Math.abs(that.storage[0]);
    that.storage[1] = Math.abs(that.storage[1]);
    that.storage[2] = Math.abs(that.storage[2]);
};
Vector3.simd.absolute = function(that) {
    Vector3.simd.load(that);
    that.simd_storage = SIMD.Float32x4.abs(that.simd_storage);
    Vector3.store(that);
};

/**
 * @method postmultiply
 * @description Transforms [this] into the product of [this] as a row vector,
 * postmultiplied by matrix, [arg].
 * If [arg] is a rotation matrix, this is a computational shortcut for applying,
 * the inverse of the transformation.
 *
 * @param arg {Matrix3}
 * @return {Vector3}
 */
Vector3.prototype.postmultiply = function(arg) {
    var argStorage = arg.storage;
    var v0 = this.storage[0];
    var v1 = this.storage[1];
    var v2 = this.storage[2];

    this.storage[0] =
        v0 * argStorage[0] + v1 * argStorage[1] + v2 * argStorage[2];
    this.storage[1] =
        v0 * argStorage[3] + v1 * argStorage[4] + v2 * argStorage[5];
    this.storage[2] =
        v0 * argStorage[6] + v1 * argStorage[7] + v2 * argStorage[8];
    return this;
};

/**
 * @method apllyProjection
 * @description Projects [this] using the projection matrix [arg]
 * @param arg {Matrix4}
 * @return {Vector3}
 */
Vector3.prototype.applyProjection = function(arg) {
    var argStorage = arg.storage;
    var x = this.storage[0];
    var y = this.storage[1];
    var z = this.storage[2];
    var d = 1.0 /
    (argStorage[3] * x +
    argStorage[7] * y +
    argStorage[11] * z +
    argStorage[15]);
    this.storage[0] = (argStorage[0] * x +
    argStorage[4] * y +
    argStorage[8] * z +
    argStorage[12]) *
    d;
    this.storage[1] = (argStorage[1] * x +
    argStorage[5] * y +
    argStorage[9] * z +
    argStorage[13]) *
    d;
    this.storage[2] = (argStorage[2] * x +
    argStorage[6] * y +
    argStorage[10] * z +
    argStorage[14]) *
    d;
    return this;
};

/**
 * @method applyAxisAngle
 * @description Applies a rotation specified by [axis] and [angle].
 * @param axis {Vector3}
 * @param angle {number}
 * @return {Vector3}
 */
Vector3.prototype.applyAxisAngle = function(axis, angle) {
    this.applyQuaternion(Quaternion.axisAngle(axis, angle));
    return this;
};

/**
 * @method applyQuaternion
 * @description Applies a quaternion transform.
 * @param arg {Quaternion}
 * @return {Vector3}
 */
Vector3.prototype.applyQuaternion = function(arg) {
    var argStorage = arg.storage;
    var v0 = this.storage[0];
    var v1 = this.storage[1];
    var v2 = this.storage[2];
    var qx = argStorage[0];
    var qy = argStorage[1];
    var qz = argStorage[2];
    var qw = argStorage[3];
    var ix = qw * v0 + qy * v2 - qz * v1;
    var iy = qw * v1 + qz * v0 - qx * v2;
    var iz = qw * v2 + qx * v1 - qy * v0;
    var iw = -qx * v0 - qy * v1 - qz * v2;
    this.storage[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.storage[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.storage[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
};

/**
 * @method applyMatrix3
 * @description Multiplies [this] by [arg].
 * @param arg {Matrix3}
 */
Vector3.prototype.applyMatrix3 = function(arg) {
    var argStorage = arg.storage;
    var v0 = this.storage[0];
    var v1 = this.storage[1];
    var v2 = this.storage[2];
    this.storage[0] =
        argStorage[0] * v0 + argStorage[3] * v1 + argStorage[6] * v2;
    this.storage[1] =
        argStorage[1] * v0 + argStorage[4] * v1 + argStorage[7] * v2;
    this.storage[2] =
        argStorage[2] * v0 + argStorage[5] * v1 + argStorage[8] * v2;
    return this;
};

/**
 * @method applyMatrix4
 * @description Multiplies [this] by a 4x3 subset of [arg]. Expects [arg] to be an affine transformation matrix.
 * @param arg {Matrix4}
 * @return {Vector3}
 */
Vector3.prototype.applyMatrix4 = function(arg) {
    var argStorage = arg.storage;
    var v0 = this.storage[0];
    var v1 = this.storage[1];
    var v2 = this.storage[2];
    this.storage[0] = argStorage[0] * v0 +
    argStorage[4] * v1 +
    argStorage[8] * v2 +
    argStorage[12];
    this.storage[1] = argStorage[1] * v0 +
    argStorage[5] * v1 +
    argStorage[9] * v2 +
    argStorage[13];
    this.storage[2] = argStorage[2] * v0 +
    argStorage[6] * v1 +
    argStorage[10] * v2 +
    argStorage[14];
    return this;
};

/**
 * @method clamp
 * @description Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector3}
 * @param max {Vector3}
 * @return {Vector3}
 */
Vector3.prototype.clamp = function(min, max) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.clamp(this, min, max);
    }
    else {
        Vector3.scalar.clamp(this, min, max);
    }
    return this;
};

Vector3.scalar.clamp = function(that, min, max) {
    var minStorage = min.storage;
    var maxStorage = max.storage;
    that.storage[0] = Math.min(Math.max(that.storage[0], minStorage[0]), maxStorage[0]);
    that.storage[1] = Math.min(Math.max(that.storage[1], minStorage[1]), maxStorage[1]);
    that.storage[2] = Math.min(Math.max(that.storage[2], minStorage[2]), maxStorage[2]);
};
Vector3.simd.clamp = function(that, min, max) {
    Vector3.simd.load(that);
    Vector3.simd.load(min);
    Vector3.simd.load(max);
    var clamp_min = SIMD.Float32x4.max(that.simd_storage, min.simd_storage);
    that.simd_storage = SIMD.Float32x4.min(clamp_min, max.simd_storage);
    Vector3.simd.store(that);
};
/**
 * @method clampScalar
 * @description Clamp entries in [this] in the range [min]-[max].
 * @param min {number}
 * @param max {number}
 * @return {Vector3}
 */
Vector3.prototype.clampScalar = function(min, max) {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.clampScalar(this, min, max);
    }
    else {
        Vector3.scalar.clampScalar(this, min, max);
    }
    return this;
};

Vector3.scalar.clampScalar = function(that, min, max) {
    that.storage[0] = Math.min(Math.max(that.storage[0], min), max);
    that.storage[1] = Math.min(Math.max(that.storage[1], min), max);
    that.storage[2] = Math.min(Math.max(that.storage[2], min), max);
};
Vector3.simd.clampScalar = function(that, min, max) {
    Vector3.simd.load(that);
    var clamp_min = SIMD.Float32x4.max(that.simd_storage, SIMD.Float32x4(min, min, min, min));
    that.simd_storage = SIMD.Float32x4.min(clamp_min, SIMD.Float32x4(max, max, max, max));
    Vector3.simd.store(that);

};

/**
 * @method isNaN
 * @description Check is vector contains NaN values
 * @return {boolean}
 */
Vector3.prototype.isNaN = function() {
    var is_nan = false;
    is_nan = is_nan || this.storage[0].isNaN;
    is_nan = is_nan || this.storage[1].isNaN;
    is_nan = is_nan || this.storage[2].isNaN;
    return is_nan;
};

/**
 * @method isInfinite
 * @description Check if vector contains Infinite values
 * @return {boolean}
 */
Vector3.prototype.isInfinite = function() {
    var is_inf = false;
    is_inf = is_inf || this.storage[0].isInfinite();
    is_inf = is_inf || this.storage[1].isInfinite();
    is_inf = is_inf || this.storage[2].isInfinite();
    return is_inf;
};

/**
 * @method toString
 * @description Printable string
 * @return {string}
 */
Vector3.prototype.toString = function() {
    return '[x=' + this.storage[0] + ', y=' + this.storage[1] + ', z=' + this.storage[2] + ']';
};

/**
 * @method length2
 * @description Squared length
 * @return {number}
 */
Vector3.prototype.length2 = function() {
    if (vector_math.USE_SIMD()) {
        return Vector3.simd.length2(this);
    }
    else {
        return Vector3.scalar.length2(this);
    }
};

Vector3.scalar.length2 = function(that) {
    return that.storage[0] * that.storage[0] +
        that.storage[1] * that.storage[1] +
        that.storage[2] * that.storage[2];
};
Vector3.simd.length2 = function(that) {
    Vector3.simd.load(that);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, that.simd_storage);
    return SIMD.Float32x4.extractLane(that.simd_storage, 0) +
        SIMD.Float32x4.extractLane(that.simd_storage, 1) +
        SIMD.Float32x4.extractLane(that.simd_storage, 2);

};

/**
 * @method normalize
 * @description Normalize this
 * @return {Vector3}
 */
Vector3.prototype.normalize = function() {
    if (vector_math.USE_SIMD()) {
        Vector3.simd.normalize(this);
    }
    else {
        Vector3.scalar.normalize(this);
    }
    return this;
};

Vector3.scalar.normalize = function(that) {
    var l = that.length;
    if (l != 0.0) {
        l = 1.0 / l;
        that.storage[0] *= l;
        that.storage[1] *= l;
        that.storage[2] *= l;
    }
};
Vector3.simd.normalize = function(that) {
    var l = that.length;
    if (l != 0.0) {
        l = 1.0 / l;
        Vector3.simd.load(that);
        that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, SIMD.Float32x4(l, l, l, l));
        Vector3.simd.store(that);
    }
};


/**
 * @method normalized
 * @description return a normalized copy of this
 * @return {Vector3}
 */
Vector3.prototype.normalized = function() {
    var v = this.clone();
    return v.normalize();
};

/**
 * @method distanceToSquared
 * @description Compute squared distance to other
 * @param v {Vector3}
 * @return {number}
 */
Vector3.prototype.distanceToSquared = function(v) {
    if (vector_math.USE_SIMD()) {
        return Vector3.simd.distanceToSquared(this, v);
    }
    else {
        return Vector3.scalar.distanceToSquared(this, v);
    }
};
Vector3.scalar.distanceToSquared = function(that, v) {
    var dx = that.x - v.x;
    var dy = that.y - v.y;
    var dz = that.z - v.z;
    return dx * dx + dy * dy + dz * dz;
};
Vector3.simd.distanceToSquared = function(that, v) {
    Vector3.simd.load(that);
    Vector3.simd.load(v);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, v.simd_storage);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, that.simd_storage);
    return SIMD.Float32x4.extractLane(that.simd_storage, 0) +
        SIMD.Float32x4.extractLane(that.simd_storage, 1) +
        SIMD.Float32x4.extractLane(that.simd_storage, 2);
};

/**
 * @method distanceTo
 * @description Compute distance to other
 * @param v {Vector3}
 * @return {number}
 */
Vector3.prototype.distanceTo = function(v) {
   return Math.sqrt(this.distanceToSquared(v));
};

/**
 * @method angleTo
 * @description return the angle between [this] vector and [other] in radians.
 * @param other {Vector3}
 * @return {number}
 */
Vector3.prototype.angleTo = function(other) {
    var otherStorage = other.storage;
    if (this.storage[0] == otherStorage[0] &&
        this.storage[1] == otherStorage[1] &&
        this.storage[2] == otherStorage[2]) {
        return 0.0;
    }

    var d = this.dot(other);

    return Math.acos(Math.min(Math.max(d, -1.0), 1.0));
};

/**
 * @method angleToSigned
 * @description return the signed angle between [this] and [other] around [normal] in radians.
 * @param other {Vector3}
 * @param normal {Vector3}
 * @return {number}
 */
Vector3.prototype.angleToSigned = function(other, normal) {
    var angle = this.angleTo(other);
    var c = this.cross(other);
    var d = c.dot(normal);

    return d < 0.0 ? -angle : angle;
};

/**
 * @method floor
 * @description Floor entries in [this].
 * @return {Vector3}
 */
Vector3.prototype.floor = function() {
    this.storage[0] = Math.floor(this.x);
    this.storage[1] = Math.floor(this.y);
    this.storage[2] = Math.floor(this.z);
    return this;
};

/**
 * @method ceil
 * @description Ceil entries in [this].
 * @return {Vector3}
 */
Vector3.prototype.ceil = function() {
    this.storage[0] = Math.ceil(this.x);
    this.storage[1] = Math.ceil(this.y);
    this.storage[2] = Math.ceil(this.z);
    return this;
};

/**
 * @method round
 * @description Round entries in [this].
 * @return {Vector3}
 */
Vector3.prototype.round = function() {
    this.storage[0] = Math.round(this.x);
    this.storage[1] = Math.round(this.y);
    this.storage[2] = Math.round(this.z);
    return this;
};

/**
 * @method roundToZero
 * @description Round entries in [this] towards zero.
 * @return {Vector3}
 */
Vector3.prototype.roundToZero = function() {
    this.storage[0] = this.storage[0] < 0.0
        ? Math.ceil(this.storage[0])
        : Math.floor(this.storage[0]);
    this.storage[1] = this.storage[1] < 0.0
        ? Math.ceil(this.storage[1])
        : Math.floor(this.storage[1]);
    this.storage[2] = this.storage[2] < 0.0
        ? Math.ceil(this.storage[2])
        : Math.floor(this.storage[2]);
    return this;
};
},{"./common.js":10,"./matrix3.js":12,"./matrix4.js":13,"simd":6}],22:[function(require,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Vector4;

var vector_math = require('./common.js');
var SIMD = require("simd");

/**
 * @class Vector4
 * @param x {Number}
 * @param y {Number}
 * @param z {Number}
 * @param w {Number}
 * @constructor
 */
function Vector4(x, y, z, w){
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([x, y, z, w]);
    /**
     * @property simd_storage
     * @type {null|Float32x4}
     */
    this.simd_storage = null;
}

/**
 * @static
 * SIMD specialization
 */
Vector4.simd = {};
/**
 * @static
 * Scalar specialization
 */
Vector4.scalar = {};

/**
 * @static
 * Load SIMD.Float32x4 into vector.simd_storage
 * @param vector {Vector4}
 */
Vector4.simd.load = function(vector) {
    vector.simd_storage = SIMD.Float32x4.load(vector.storage, 0);
};

/**
 * @static
 * Store SIMD.Float32x4 at vector.simd_storage into vector.storage
 * @param vector {Vector4}
 */
Vector4.simd.store = function(vector) {
    SIMD.Float32x4.store(vector.storage, 0, vector.simd_storage);
};

/**
 * @property x
 * @type {Number}
 */
Vector4.prototype.__defineGetter__("x", function() {
    return this.storage[0];
});
Vector4.prototype.__defineSetter__("x", function(value) {
    this.storage[0] = value;
});

/**
 * @property y
 * @type {Number}
 */
Vector4.prototype.__defineGetter__("y", function() {
    return this.storage[1];
});
Vector4.prototype.__defineSetter__("y", function(value) {
    this.storage[1] = value;
});

/**
 * @property z
 * @type {Number}
 */
Vector4.prototype.__defineGetter__("z", function() {
    return this.storage[2];
});
Vector4.prototype.__defineSetter__("z", function(value) {
    this.storage[2] = value;
});

/**
 * @property w
 * @type {Number}
 */
Vector4.prototype.__defineGetter__("w", function() {
    return this.storage[3];
});
Vector4.prototype.__defineSetter__("w", function(value) {
    this.storage[3] = value;
});

/**
 * @property length
 * @type {number}
 */
Vector4.prototype.__defineGetter__("length", function() {
    return Math.sqrt(this.length2());
});
Vector4.prototype.__defineSetter__("length", function(value) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd._setter_length(this, value);
    }
    else {
        Vector4.scalar._setter_length(this, value);
    }
});

/**
 * @static
 * Scalar version of set length
 * @param vector {Vector4}
 * @param value {Number}
 * @private
 */
Vector4.scalar._setter_length = function(vector, value) {
    if (value == 0.0) {
        vector.setZero();
    }
    else {
        var l = this.length;
        if (l == 0.0) {
            return;
        }
        l = value / l;
        vector.storage[0] *= l;
        vector.storage[1] *= l;
        vector.storage[2] *= l;
        vector.storage[3] *= l;
    }
};

Vector4.simd._setter_length = function(vector, value) {
    if (value == 0.0) {
        vector.setZero();
    }
    else {
        var l = vector.length;
        if (l == 0.0) {
            return;
        }
        l = value / l;
        Vector4.simd.load(vector);
        vector.simd_storage = SIMD.Float32x4.mul(vector.simd_storage, SIMD.Float32x4(l, l, l, l));
        Vector4.simd.store(vector);
    }
};

/**
 * @static
 * @property {Vector4} zero
 */
Vector4.zero = function() {
    var vec = new Vector4(0.0, 0.0, 0.0, 0.0);
    return vec;
};

/**
 * @method
 * Zero the vector.
 * @returns {Vector4}
 */
Vector4.prototype.setZero = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    return this;
};

/**
 * @static
 * Constructs Vector2 with a given [Float32List] as [storage].
 * @param array {Float32Array}
 * @returns {Vector4}
 */
Vector4.fromFloat32Array = function(array) {
    var vec = Vector4.zero();
    vec.storage = array;
    return vec;
};


/**
 * @static
 * Constructs Vector4 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32List.BYTES_PER_ELEMENT].
 * @param buffer {Buffer}
 * @param offset {number}
 * @returns {Vector4}
 */
Vector4.fromBuffer = function(buffer, offset) {
    var vec = Vector4.zero();
    vec.storage = new Float32Array(buffer, offset, 4);
    return vec.clone();
};

/**
 * @method
 * Set the values of the vector.
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @returns {Vector4}
 */
Vector4.prototype.setValues = function(x, y, z) {
    this.storage[0] = x;
    this.storage[1] = y;
    this.storage[2] = z;
    this.storage[3] = z;
    return this;
};


/**
 * @static
 * Returns a copy of v
 * @param v {Vector4}
 * @returns {Vector4}
 */
Vector4.copy = function(v) {
    return new Vector4(v.x, v.y, v.z, v.w);
};

/**
 * @static
 * @property {Vector4} all
 */
Vector4.all = function(value) {
    var v = Vector4.zero();
    v.splat(value);
    return v;
};

/**
 * @static
 * Returns identity vector
 * @returns {Vector4}
 */
Vector4.identity = function() {
    var v = Vector4.zero();
    v.setIdentity();
    return v;
};

/**
 * @method
 * Set the vector to identity
 * @returns {Vector4}
 */
Vector4.prototype.setIdentity = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 1.0;
    return this;
};

/**
 * @description Set the values of [result] to the minimum of [a] and [b] for each line.
 * @static
 * @param a {Vector4}
 * @param b {Vector4}
 * @param result {Vector4}
 */
Vector4.min = function(a, b, result) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.min(a, b, result);
    }
    else {
        Vector4.scalar.min(a, b, result);
    }
};

Vector4.scalar.min = function(a, b, result) {
    result.x = Math.min(a.x, b.x);
    result.y = Math.min(a.y, b.y);
    result.z = Math.min(a.z, b.z);
    result.w = Math.min(a.w, b.w);
};

Vector4.simd.min = function(a, b, result) {
    Vector4.simd.load(a);
    Vector4.simd.load(b);
    result.simd_storage = SIMD.Float32x4.min(a.simd_storage, b.simd_storage);
    Vector4.simd.store(result);
};

/**
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @static
 * @param a {Vector4}
 * @param b {Vector4}
 * @param result {Vector4}
 */
Vector4.max = function(a, b, result) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.max(a, b, result);
    }
    else {
        Vector4.scalar.max(a, b, result);
    }
};

Vector4.scalar.max = function(a, b, result) {
    result.x = Math.max(a.x, b.x);
    result.y = Math.max(a.y, b.y);
    result.z = Math.max(a.z, b.z);
    result.w = Math.max(a.w, b.w);
};

Vector4.simd.max = function(a, b, result) {
    Vector4.simd.load(a);
    Vector4.simd.load(b);
    result.simd_storage = SIMD.Float32x4.max(a.simd_storage, b.simd_storage);
    Vector4.simd.store(result);
};


/**
 * @description Interpolate between [min] and [max] with the amount of [a] using a linear
 * interpolation and store the values in [result].
 * @static
 * @param min {Vector4}
 * @param max {Vector4}
 * @param a {Number}
 * @param result {Vector4}
 */
Vector4.mix = function(min, max, a, result) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.mix(min, max, a, result);
    }
    else {
        Vector4.scalar.mix(min, max, a, result);
    }
};
Vector4.scalar.mix = function(min, max, a, result) {
    result.x = min.x + a * (max.x - min.x);
    result.y = min.y + a * (max.y - min.y);
    result.z = min.z + a * (max.z - min.z);
    result.w = min.w + a * (max.w - min.w);
};
Vector4.simd.mix = function(min, max, a, result) {
    Vector4.simd.load(min);
    Vector4.simd.load(max);
    var sub = SIMD.Float32x4.sub(max.simd_storage, min.simd_storage);
    var interp = SIMD.Float32x4.mul(sub, SIMD.Float32x4(a, a, a, a));
    result.simd_storage = SIMD.Float32x4.add(min.simd_storage, interp);
    Vector4.simd.store(result);
};


/**
 * @method
 * Returns a copy of this
 * @returns {Vector4}
 */
Vector4.prototype.clone = function() {
    return Vector4.copy(this);
};

/**
 * @method
 * Sets the values from other
 * @param v {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.setFrom = function(v) {
    this.storage[0] = v.storage[0];
    this.storage[1] = v.storage[1];
    this.storage[2] = v.storage[2];
    this.storage[3] = v.storage[3];
    return this;
};

/**
 * @description Splat [arg] into all lanes of the vector.
 * @method splat
 * @param value {Number}
 */
Vector4.prototype.splat = function(value) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.splat(this, value);
    }
    else {
        Vector4.scalar.splat(this, value);
    }
    return this;
};
Vector4.scalar.splat = function(that, value) {
    that.storage[0] = value;
    that.storage[1] = value;
    that.storage[2] = value;
    that.storage[3] = value;
};
Vector4.simd.splat = function(that, value) {
    Vector4.simd.load(that);
    that.simd_storage = SIMD.Float32x4.splat(value);
    Vector4.simd.store(that);
};

/**
 * @method
 * Check if this is almost equal to other
 * @param v {Vector4}
 * @param precision {number}
 * @returns {boolean}
 */
Vector4.prototype.almostEquals = function(v, precision) {
    if (precision === undefined) {
        precision = vector_math.EPSILON;
    }

    if (vector_math.USE_SIMD()) {
        return Vector4.simd.almostEquals(this, v, precision);
    }
    else {
        return Vector4.scalar.almostEquals(this, v, precision);
    }
};
Vector4.scalar.almostEquals = function(that, v, precision) {
    if (Math.abs(this.x - v.x) > precision ||
        Math.abs(this.y - v.y) > precision ||
        Math.abs(this.z - v.z) > precision ||
        Math.abs(this.w - v.w) > precision) {
        return false;
    }
    return true;
};
Vector4.simd.almostEquals = function(that, v, p) {
    Vector4.simd.load(that);
    Vector4.simd.load(v);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, v.simd_storage);
    that.simd_storage = SIMD.Float32x4.abs(that.simd_storage);
    that.simd_storage = SIMD.Float32x4.greaterThan(that.simd_storage, SIMD.Float32x4(p, p, p, p));
    if (SIMD.Bool32x4.extractLane(that.simd_storage, 0) ||
        SIMD.Bool32x4.extractLane(that.simd_storage, 1) ||
        SIMD.Bool32x4.extractLane(that.simd_storage, 2) ||
        SIMD.Bool32x4.extractLane(that.simd_storage, 3)) {
        return false;
    }
    return true;
};

/**
 * @method
 * Check if this equals other
 * @param v {Vector4}
 * @returns {boolean}
 */
Vector4.prototype.equals = function(v) {
    return (this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w);
};

/**
 * @method
 * Check if this is almost the zero vector
 * @param precision {number}
 * @returns {boolean}
 */
Vector4.prototype.almostZero = function(precision) {
    if (precision === undefined) {
        precision = vector_math.EPSILON;
    }
    if (Math.abs(this.x) > precision ||
        Math.abs(this.y) > precision ||
        Math.abs(this.z) > precision ||
        Math.abs(this.w) > precision) {
        return false;
    }
    return true;
};

/**
 * @method
 * Check if this is the zero vector
 * @returns {boolean}
 */
Vector4.prototype.isZero = function() {
    return (this.x == 0 && this.y == 0 && this.z == 0 && this.w == 0);
};

/**
 * @method
 * Negate this
 * @returns {Vector4}
 */
Vector4.prototype.negate = function() {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.negate(this);
    }
    else {
        Vector4.scalar.negate(this);
    }
    return this;
};

Vector4.scalar.negate = function(that) {
    that.storage[0] = - that.storage[0];
    that.storage[1] = - that.storage[1];
    that.storage[2] = - that.storage[2];
    that.storage[3] = - that.storage[3];
};
Vector4.simd.negate = function(that) {
    Vector4.simd.load(that);
    that.simd_storage = SIMD.Float32x4.neg(that.simd_storage);
    Vector4.simd.store(that);
};

/**
 * @method
 * Subtract other from this
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.sub = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.sub(this, other);
    }
    else {
        Vector4.scalar.sub(this, other);
    }
    return this;
};

Vector4.scalar.sub = function(that, other) {
    that.storage[0] = that.storage[0] - other.storage[0];
    that.storage[1] = that.storage[1] - other.storage[1];
    that.storage[2] = that.storage[2] - other.storage[2];
    that.storage[3] = that.storage[3] - other.storage[3];
};
Vector4.simd.sub = function(that, other) {
    Vector4.simd.load(that);
    Vector4.simd.load(other);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, other.simd_storage);
    Vector4.simd.store(that);
};

/**
 * @method
 * Add other into this
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.add = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.add(this, other);
    }
    else {
        Vector4.scalar.add(this, other);
    }
    return this;
};

Vector4.scalar.add = function(that, other) {
    that.storage[0] = that.storage[0] + other.storage[0];
    that.storage[1] = that.storage[1] + other.storage[1];
    that.storage[2] = that.storage[2] + other.storage[2];
    that.storage[3] = that.storage[3] + other.storage[3];
};
Vector4.simd.add = function(that, other) {
    Vector4.simd.load(that);
    Vector4.simd.load(other);
    that.simd_storage = SIMD.Float32x4.add(that.simd_storage, other.simd_storage);
    Vector4.simd.store(that);
};

/**
 * @method
 * Multiply this by other
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.mul = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.mul(this, other);
    }
    else {
        Vector4.scalar.mul(this, other);
    }
    return this;
};

Vector4.scalar.mul = function(that, other) {
    that.storage[0] = that.storage[0] + other.storage[0];
    that.storage[1] = that.storage[1] + other.storage[1];
    that.storage[2] = that.storage[2] + other.storage[2];
    that.storage[3] = that.storage[3] + other.storage[3];
};
Vector4.simd.mul = function(that, other) {
    Vector4.simd.load(that);
    Vector4.simd.load(other);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, other.simd_storage);
    Vector4.simd.store(that);
};

/**
 * @method
 * Divide this by other
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.div = function(other) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.div(this, other);
    }
    else {
        Vector4.scalar.div(this, other);
    }
    return this;
};

Vector4.scalar.div = function(that, other) {
    that.storage[0] = that.storage[0] / other.storage[0];
    that.storage[1] = that.storage[1] / other.storage[1];
    that.storage[2] = that.storage[2] / other.storage[2];
    that.storage[3] = that.storage[3] / other.storage[3];
};
Vector4.simd.div = function(that, other) {
    Vector4.simd.load(that);
    Vector4.simd.load(other);
    that.simd_storage = SIMD.Float32x4.div(that.simd_storage, other.simd_storage);
    Vector4.simd.store(that);
};

/**
 * @method
 * Scale this
 * @param arg {number}
 * @returns {Vector4}
 */
Vector4.prototype.scale = function(arg) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.scale(this, arg);
    }
    else {
        Vector4.scalar.scale(this, arg);
    }
    return this;
};

Vector4.scalar.scale = function(that, scale) {
    that.storage[0] = that.storage[0] * scale;
    that.storage[1] = that.storage[1] * scale;
    that.storage[2] = that.storage[2] * scale;
    that.storage[3] = that.storage[3] * scale;
};
Vector4.simd.scale = function(that, s) {
    Vector4.simd.load(that);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, SIMD.Float32x4(s, s, s, s));
    Vector4.simd.store(that);
};


/**
 * @method
 * Returns Scaled copy of this
 * @param arg {number}
 * @returns {Vector4}
 */
Vector4.prototype.scaled = function(arg) {
    var v = this.clone();
    v.scale(arg);
    return this;
};


/**
 * @method
 * Reflect [this].
 * @param normal
 * @returns {Vector4}
 */
Vector4.prototype.reflect = function(normal) {
    var n_copy = normal.clone();
    n_copy.scale(2.0 * normal.dot(this));
    this.sub(n_copy);
    return this;
};

/**
 * @method dot
 * @param v {Vector4}
 * @returns {Number}
 */
Vector4.prototype.dot = function(v) {
    if (vector_math.USE_SIMD()) {
        return Vector4.simd.dot(this, v);
    }
    else {
        return Vector4.scalar.dot(this, v);
    }
};

Vector4.scalar.dot = function(that, v) {
    return that.storage[0] * v.x +
        that.storage[1] * v.y +
        that.storage[2] * v.z +
        that.storage[3] * v.w;
};
Vector4.simd.dot = function(that, v) {
    Vector4.simd.load(that);
    Vector4.simd.load(v);

    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, v.simd_storage);
    return SIMD.Float32x4.extractLane(that.simd_storage, 0) +
           SIMD.Float32x4.extractLane(that.simd_storage, 1) +
           SIMD.Float32x4.extractLane(that.simd_storage, 2) +
           SIMD.Float32x4.extractLane(that.simd_storage, 3);
};



/**
 * @method
 * Set this values to absolute
 */
Vector4.prototype.absolute = function() {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.absolute(this);
    }
    else {
        Vector4.scalar.absolute(this);
    }
};
Vector4.scalar.absolute = function(that) {
    that.storage[0] = Math.abs(that.storage[0]);
    that.storage[1] = Math.abs(that.storage[1]);
    that.storage[2] = Math.abs(that.storage[2]);
    that.storage[3] = Math.abs(that.storage[3]);
};
Vector4.simd.absolute = function(that) {
    Vector4.simd.load(that);
    that.simd_storage = SIMD.Float32x4.abs(that.simd_storage);
    Vector4.store(that);
};


/**
 * @method
 * Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector4}
 * @param max {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.clamp = function(min, max) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.clamp(this, min, max);
    }
    else {
        Vector4.scalar.clamp(this, min, max);
    }
    return this;
};

Vector4.scalar.clamp = function(that, min, max) {
    var minStorage = min.storage;
    var maxStorage = max.storage;
    that.storage[0] = Math.min(Math.max(that.storage[0], minStorage[0]), maxStorage[0]);
    that.storage[1] = Math.min(Math.max(that.storage[1], minStorage[1]), maxStorage[1]);
    that.storage[2] = Math.min(Math.max(that.storage[2], minStorage[2]), maxStorage[2]);
    that.storage[3] = Math.min(Math.max(that.storage[3], minStorage[3]), maxStorage[3]);
};
Vector4.simd.clamp = function(that, min, max) {
    Vector4.simd.load(that);
    Vector4.simd.load(min);
    Vector4.simd.load(max);
    var clamp_min = SIMD.Float32x4.max(that.simd_storage, min.simd_storage);
    that.simd_storage = SIMD.Float32x4.min(clamp_min, max.simd_storage);
    Vector4.simd.store(that);
};

/**
 * @method
 * Clamp entries in [that] in the range [min]-[max].
 * @param min {Number}
 * @param max {Number}
 * @returns {Vector4}
 */
Vector4.prototype.clampScalar = function(min, max) {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.clampScalar(this, min, max);
    }
    else {
        Vector4.scalar.clampScalar(this, min, max);
    }
    return this;
};

Vector4.scalar.clampScalar = function(that, min, max) {
    that.storage[0] = Math.min(Math.max(that.storage[0], min), max);
    that.storage[1] = Math.min(Math.max(that.storage[1], min), max);
    that.storage[2] = Math.min(Math.max(that.storage[2], min), max);
    that.storage[3] = Math.min(Math.max(that.storage[3], min), max);
};
Vector4.simd.clampScalar = function(that, min, max) {
    Vector4.simd.load(that);
    var clamp_min = SIMD.Float32x4.max(that.simd_storage, SIMD.Float32x4(min, min, min, min));
    that.simd_storage = SIMD.Float32x4.min(clamp_min, SIMD.Float32x4(max, max, max, max));
    Vector4.simd.store(that);

};

/**
 * @method
 * Check if this contains NaN values
 * @returns {boolean}
 */
Vector4.prototype.isNaN = function() {
    var is_nan = false;
    is_nan = is_nan || this.storage[0].isNaN;
    is_nan = is_nan || this.storage[1].isNaN;
    is_nan = is_nan || this.storage[2].isNaN;
    is_nan = is_nan || this.storage[3].isNaN;
    return is_nan;
};

/**
 * @method
 * Check if this contains infinite values
 * @returns {boolean}
 */
Vector4.prototype.isInfinite = function() {
    var is_inf = false;
    is_inf = is_inf || this.storage[0].isInfinite();
    is_inf = is_inf || this.storage[1].isInfinite();
    is_inf = is_inf || this.storage[2].isInfinite();
    is_inf = is_inf || this.storage[3].isInfinite();
    return is_inf;
};

/**
 * @metod
 * Printable string
 * @returns {string}
 */
Vector4.prototype.toString = function() {
    return '[x=' + this.storage[0] + ', y=' + this.storage[1] + ', z=' + this.storage[2] + ', w= ' + this.storage[3] + ']';
};

/**
 * @method
 * Compute squared length
 * @returns {number}
 */
Vector4.prototype.length2 = function() {
    if (vector_math.USE_SIMD()) {
        return Vector4.simd.length2(this);
    }
    else {
        return Vector4.scalar.length2(this);
    }
};

Vector4.scalar.length2 = function(that) {
    return that.storage[0] * that.storage[0] +
           that.storage[1] * that.storage[1] +
           that.storage[2] * that.storage[2] +
           that.storage[3] * that.storage[3];
};
Vector4.simd.length2 = function(that) {
    Vector4.simd.load(that);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, that.simd_storage);
    return SIMD.Float32x4.extractLane(that.simd_storage, 0) +
        SIMD.Float32x4.extractLane(that.simd_storage, 1) +
        SIMD.Float32x4.extractLane(that.simd_storage, 2) +
        SIMD.Float32x4.extractLane(that.simd_storage, 3);

};

/**
 * @method
 * Normalize this
 * @returns {Vector4}
 */
Vector4.prototype.normalize = function() {
    if (vector_math.USE_SIMD()) {
        Vector4.simd.normalize(this);
    }
    else {
        Vector4.scalar.normalize(this);
    }
    return this;
};

Vector4.scalar.normalize = function(that) {
    var l = that.length;
    if (l != 0.0) {
        l = 1.0 / l;
        that.storage[0] *= l;
        that.storage[1] *= l;
        that.storage[2] *= l;
        that.storage[3] *= l;
    }
};
Vector4.simd.normalize = function(that) {
    var l = that.length;
    if (l != 0.0) {
        Vector4.simd.load(that);
        that.simd_storage = SIMD.Float32x4.div(that.simd_storage, SIMD.Float32x4(l, l, l, l));
        Vector4.simd.store(that);
    }
};

/**
 * @method
 * Returns a normalized copy of this
 * @returns {Vector4}
 */
Vector4.prototype.normalized = function() {
    var v = this.clone();
    return v.normalize();
};

/**
 * @method
 * Compute squared distance to other
 * @param v {Vector4}
 * @returns {number}
 */
Vector4.prototype.distanceToSquared = function(v) {
    if (vector_math.USE_SIMD()) {
        return Vector4.simd.distanceToSquared(this, v);
    }
    else {
        return Vector4.scalar.distanceToSquared(this, v);
    }
};
Vector4.scalar.distanceToSquared = function(that, v) {
    var dx = that.x - v.x;
    var dy = that.y - v.y;
    var dz = that.z - v.z;
    var dw = that.w - v.w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
};
Vector4.simd.distanceToSquared = function(that, v) {
    Vector4.simd.load(that);
    Vector4.simd.load(v);
    that.simd_storage = SIMD.Float32x4.sub(that.simd_storage, v.simd_storage);
    that.simd_storage = SIMD.Float32x4.mul(that.simd_storage, that.simd_storage);
    return SIMD.Float32x4.extractLane(that.simd_storage, 0) +
           SIMD.Float32x4.extractLane(that.simd_storage, 1) +
           SIMD.Float32x4.extractLane(that.simd_storage, 2) +
           SIMD.Float32x4.extractLane(that.simd_storage, 3);
};

/**
 * @method
 * Compute distance to other
 * @param v {Vector4}
 * @returns {number}
 */
Vector4.prototype.distanceTo = function(v) {
    return Math.sqrt(this.distanceToSquared(v));
};

/**
 * @method
 * Returns the angle between [this] vector and [other] in radians.
 * @param other
 * @returns {number}
 */
Vector4.prototype.angleTo = function(other) {
    var otherStorage = other.storage;
    if (this.storage[0] == otherStorage[0] &&
        this.storage[1] == otherStorage[1] &&
        this.storage[2] == otherStorage[2] &&
        this.storage[3] == otherStorage[3]) {
        return 0.0;
    }

    var d = this.dot(other);

    return Math.acos(Math.min(Math.max(d, -1.0), 1.0));
};


/**
 * @method
 * Floor entries in [this].
 * @returns {Vector4}
 */
Vector4.prototype.floor = function() {
    this.storage[0] = Math.floor(this.x);
    this.storage[1] = Math.floor(this.y);
    this.storage[2] = Math.floor(this.z);
    this.storage[3] = Math.floor(this.w);
    return this;
};

/**
 * @method
 * Ceil entries in [this].
 * @returns {Vector4}
 */
Vector4.prototype.ceil = function() {
    this.storage[0] = Math.ceil(this.x);
    this.storage[1] = Math.ceil(this.y);
    this.storage[2] = Math.ceil(this.z);
    this.storage[3] = Math.ceil(this.w);
    return this;
};

/**
 * @method
 * Round entries in [this].
 * @returns {Vector4}
 */
Vector4.prototype.round = function() {
    this.storage[0] = Math.round(this.x);
    this.storage[1] = Math.round(this.y);
    this.storage[2] = Math.round(this.z);
    this.storage[3] = Math.round(this.w);
    return this;
};

/**
 * @method
 * Round entries in [this] towards zero.
 * @returns {Vector4}
 */
Vector4.prototype.roundToZero = function() {
    this.storage[0] = this.storage[0] < 0.0
        ? Math.ceil(this.storage[0])
        : Math.floor(this.storage[0]);
    this.storage[1] = this.storage[1] < 0.0
        ? Math.ceil(this.storage[1])
        : Math.floor(this.storage[1]);
    this.storage[2] = this.storage[2] < 0.0
        ? Math.ceil(this.storage[2])
        : Math.floor(this.storage[2]);
    this.storage[3] = this.storage[3] < 0.0
        ? Math.ceil(this.storage[3])
        : Math.floor(this.storage[3]);
    return this;
};

},{"./common.js":10,"simd":6}],23:[function(require,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */
module.exports = {
    version:     require('../package.json').version,
    common:      require('./common.js'),

    Vector2:     require('./vector2.js'),
    Vector3:     require('./vector3.js'),
    Vector4:     require('./vector4.js'),
    Matrix2:     require('./matrix2.js'),
    Matrix3:     require('./matrix3.js'),
    Matrix4:     require('./matrix4.js'),
    Quaternion:  require('./quaternion.js'),
    Plane:       require('./plane.js'),
    Sphere:      require('./sphere.js'),
    Ray:         require('./ray.js'),
    Triangle:    require('./triangle.js')
};
},{"../package.json":8,"./common.js":10,"./matrix2.js":11,"./matrix3.js":12,"./matrix4.js":13,"./plane.js":14,"./quaternion.js":16,"./ray.js":17,"./sphere.js":18,"./triangle.js":19,"./vector2.js":20,"./vector3.js":21,"./vector4.js":22}]},{},[23]);

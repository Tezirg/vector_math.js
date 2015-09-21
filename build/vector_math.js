// Mon, 21 Sep 2015 14:22:37 GMT

/*
 * Copyright (c) 2015 vector_math.js
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&false)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vectormath=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports={
  "name": "vector_math.js",
  "version": "0.0.1",
  "author": "jean Grizet <jean.grizet@gmail.com>",
  "EPSILON": 1e-6,
  "keywords": [
    "vector_math",
    "vector_math.js",
    "vector",
    "simd"
  ],
  "main": "src/vector_math.js",
  "devDependencies": {
    "jshint": "latest",
    "uglify-js": "latest",
    "nodeunit": "^0.9.0",
    "grunt": "~0.4.5",
    "grunt-contrib-jshint": "~0.1.1",
    "grunt-contrib-nodeunit": "^0.4.1",
    "grunt-contrib-concat": "~0.1.3",
    "grunt-contrib-uglify": "^0.5.1",
    "grunt-browserify": "^2.1.4",
    "browserify": "*"
  }
}

},{}],2:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix2;
},{}],3:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix3;

},{}],4:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix4;
},{}],5:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Plane;
},{}],6:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Ray;

},{}],7:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Triangle;
},{}],8:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector2;
var EPSILON = module.EPSILON;

/**
 * @class Vector2
 * @param x
 * @param y
 * @constructor
 */
function Vector2(x, y){
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([x, y]);
}

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
 * @static
 * @property {Vector2} zero
 */
Vector2.zero = new Vector2(0.0, 0.0);

/**
 * @static
 * @property copy
 * @param v
 * @returns {Vector2}
 */
Vector2.copy = function(v) {
    return new Vector2(v.x, v.y);
};

/**
 * @static
 * @property {Vector2} all
 */
Vector2.all = function(value) {
    var v = Vector2.zero;
    v.splat(value);
    return v;
};

/**
 * @description Set the values of [result] to the minimum of [a] and [b] for each line.
 * @static
 * @param a {Vector2}
 * @param b {Vector2}
 * @param result {Vector2}
 */
Vector2.min = function(a, b, result) {
    result.x = Math.min(a.x, b.x);
    result.y = Math.min(a.y, b.y);
};

/**
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @static
 * @param a {Vector2}
 * @param b {Vector2}
 * @param result {Vector2}
 */
Vector2.max = function(a, b, result) {
    result.x = Math.max(a.x, b.x);
    result.y = Math.max(a.y, b.y);
};

/**
 * @description Interpolate between [min] and [max] with the amount of [a] using a linear
 * interpolation and store the values in [result].
 * @static
 * @param min {Vector2}
 * @param max {Vector2}
 * @param a {Number}
 * @param result {Vector2}
 */
Vector2.mix = function(min, max, a, result) {
    result.x = min.x + a * (max.x - min.x);
    result.y = min.y + a * (max.y - min.y);
};

Vector2.prototype.clone = function() {
    return Vector2.copy(this);
};

Vector2.prototype.setFrom = function(v) {
    this.storage[0] = v.storage[0];
    this.storage[1] = v.storage[1];
    return this;
};

/**
 * @description Splat [arg] into all lanes of the vector.
 * @method splat
 * @param value {Number}
 */
Vector2.prototype.splat = function(value) {
    this.storage[0] = value;
    this.storage[1] = value;
    return this;
};

Vector2.prototype.almostEquals = function(v, precision) {
    if (precision === undefined) {
        precision = EPSILON;
    }
    if (Math.abs(this.x-v.x) > precision ||
        Math.abs(this.y-v.y) > precision) {
        return false;
    }
    return true;
};

Vector2.prototype.equals = function(v) {
    return (this.x == v.x && this.y == v.y);
};

Vector2.prototype.almostZero = function(precision) {
    if (precision === undefined) {
        precision = EPSILON;
    }
    if (Math.abs(this.x) > precision ||
        Math.abs(this.y) > precision) {
        return false;
    }
    return true;
};

Vector2.prototype.isZero = function() {
  return (this.x == 0 && this.y == 0);
};

Vector2.prototype.negate = function() {
    this.storage[0] = - this.storage[0];
    this.storage[1] = - this.storage[1];
    return this;
};

Vector2.prototype.sub = function(other) {
    this.storage[0] = this.storage[0] - other.storage[0];
    this.storage[1] = this.storage[1] - other.storage[1];
    return this;
};

Vector2.prototype.add = function(other) {
    this.storage[0] = this.storage[0] + other.storage[0];
    this.storage[1] = this.storage[1] + other.storage[1];
    return this;
};

Vector2.prototype.mul = function(other) {
    this.storage[0] = this.storage[0] * other.storage[0];
    this.storage[1] = this.storage[1] * other.storage[1];
    return this;
};

Vector2.prototype.div = function(other) {
    this.storage[0] = this.storage[1] / other.storage[1];
    this.storage[1] = this.storage[1] / other.storage[1];
    return this;
};

Vector2.prototype.scale = function(arg) {
    this.storage[0] = this.storage[0] * arg;
    this.storage[1] = this.storage[1] * arg;
    return this;
};

/**
 * @method dot
 * @param v
 * @returns {Number}
 */
Vector2.prototype.dot = function(v) {
    return this.storage[0] * v.storage[0] +
           this.storage[1] * v.storage[1];
};

Vector2.prototype.cross = function(v) {
    return this.storage[0] * v.storage[1] -
           this.storage[1] * v.storage[0];
};

Vector2.prototype.absolute = function() {
    this.storage[0] = Math.abs(this.storage[0]);
    this.storage[1] = Math.abs(this.storage[1]);
};

Vector2.prototype.isNaN = function() {
    var is_nan = false;
    is_nan = is_nan || this.storage[0].isNaN;
    is_nan = is_nan || this.storage[1].isNaN;
    return is_nan;
};

Vector2.prototype.isInfinite = function() {
    var is_inf = false;
    is_inf = is_inf || this.storage[0].isInfinite();
    is_inf = is_inf || this.storage[1].isInfinite();
    return is_nan;
};

Vector2.prototype.toString = function() {
    return '[x=' + this.storage[0] + ', y=' + this.storage[1] + ']';
};

Vector2.prototype.length = function() {
    return Math.sqrt(this.length2());
};

Vector2.prototype.length2 = function() {
    return this.storage[0] * this.storage[0] +
           this.storage[1] * this.storage[1];
};

Vector2.prototype.normalize = function() {
    var l = this.length();
    if (l != 0.0) {
        l = 1.0 / l;
        this.storage[0] *= l;
        this.storage[1] *= l;
    }
    return this;
};

Vector2.prototype.normalized = function() {
    var v = this.clone();
    return v.normalize();
};

Vector2.prototype.distanceToSquared = function(v) {
    var dx = this.storage[0] - v.x;
    var dy = this.storage[1] - v.y;
    return dx * dx + dy * dy;
};

Vector2.prototype.distanceTo = function(v) {
   return Math.sqrt(this.distanceToSquared(v));
};
},{}],9:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector3;

var EPSILON = 1e-6;

/**
 * @class Vector3
 * @param x
 * @param y
 * @param z
 * @constructor
 */
function Vector3(x, y, z){
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([x, y, z]);
}

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
 * @static
 * @property {Vector3} zero
 */
Vector3.zero = new Vector3(0.0, 0.0, 0.0);

/**
 * @static
 * @property copy
 * @param v
 * @returns {Vector3}
 */
Vector3.copy = function(v) {
    return new Vector3(v.x, v.y, v.z);
};

/**
 * @static
 * @property {Vector3} all
 */
Vector3.all = function(value) {
    var v = Vector3.zero;
    v.splat(value);
    return v;
};

/**
 * @description Set the values of [result] to the minimum of [a] and [b] for each line.
 * @static
 * @param a {Vector3}
 * @param b {Vector3}
 * @param result {Vector3}
 */
Vector3.min = function(a, b, result) {
    result.x = Math.min(a.x, b.x);
    result.y = Math.min(a.y, b.y);
    result.z = Math.min(a.z, b.z);
};

/**
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @static
 * @param a {Vector3}
 * @param b {Vector3}
 * @param result {Vector3}
 */
Vector3.max = function(a, b, result) {
    result.x = Math.max(a.x, b.x);
    result.y = Math.max(a.y, b.y);
    result.z = Math.max(a.z, b.z);
};

/**
 * @description Interpolate between [min] and [max] with the amount of [a] using a linear
 * interpolation and store the values in [result].
 * @static
 * @param min {Vector3}
 * @param max {Vector3}
 * @param a {Number}
 * @param result {Vector3}
 */
Vector3.mix = function(min, max, a, result) {
    result.x = min.x + a * (max.x - min.x);
    result.y = min.y + a * (max.y - min.y);
    result.z = min.z + a * (max.z - min.z);
};

Vector3.prototype.clone = function() {
    return Vector3.copy(this);
};

Vector3.prototype.setFrom = function(v) {
    this.storage[0] = v.storage[0];
    this.storage[1] = v.storage[1];
    this.storage[2] = v.storage[2];
    return this;
};

/**
 * @description Splat [arg] into all lanes of the vector.
 * @method splat
 * @param value {Number}
 */
Vector3.prototype.splat = function(value) {
    this.storage[0] = value;
    this.storage[1] = value;
    this.storage[2] = value;
    return this;
};

Vector3.prototype.almostEquals = function(v, precision) {
    if (precision === undefined) {
        precision = EPSILON;
    }
    if (Math.abs(this.x-v.x) > precision ||
        Math.abs(this.y-v.y) > precision ||
        Math.abs(this.z-v.z) > precision) {
        return false;
    }
    return true;
};

Vector3.prototype.equals = function(v) {
    return (this.x == v.x && this.y == v.y && this.z == v.z);
};

Vector3.prototype.almostZero = function(precision) {
    if (precision === undefined) {
        precision = EPSILON;
    }
    if (Math.abs(this.x) > precision ||
        Math.abs(this.y) > precision ||
        Math.abs(this.z) > precision) {
        return false;
    }
    return true;
};

Vector3.prototype.isZero = function() {
  return (this.x == 0 && this.y == 0 && this.z == 0);
};

Vector3.prototype.negate = function() {
    this.storage[0] = - this.storage[0];
    this.storage[1] = - this.storage[1];
    this.storage[2] = - this.storage[2];
    return this;
};

Vector3.prototype.sub = function(other) {
    this.storage[0] = this.storage[0] - other.storage[0];
    this.storage[1] = this.storage[1] - other.storage[1];
    this.storage[2] = this.storage[2] - other.storage[2];
    return this;
};

Vector3.prototype.add = function(other) {
    this.storage[0] = this.storage[0] + other.storage[0];
    this.storage[1] = this.storage[1] + other.storage[1];
    this.storage[2] = this.storage[2] + other.storage[2];
    return this;
};

Vector3.prototype.mul = function(other) {
    this.storage[0] = this.storage[0] * other.storage[0];
    this.storage[1] = this.storage[1] * other.storage[1];
    this.storage[2] = this.storage[2] * other.storage[2];
    return this;
};

Vector3.prototype.div = function(other) {
    this.storage[0] = this.storage[1] / other.storage[1];
    this.storage[1] = this.storage[1] / other.storage[1];
    this.storage[2] = this.storage[2] / other.storage[2];
    return this;
};

Vector3.prototype.scale = function(arg) {
    this.storage[0] = this.storage[0] * arg;
    this.storage[1] = this.storage[1] * arg;
    this.storage[2] = this.storage[2] * arg;
    return this;
};

/**
 * @method dot
 * @param v
 * @returns {Number}
 */
Vector3.prototype.dot = function(v) {
    return this.storage[0] * v.storage[0] +
           this.storage[1] * v.storage[1] +
           this.storage[2] * v.storage[2];
};

Vector3.prototype.cross = function(v) {
    var x = this.storage[1] * v.storage[2] - this.storage[2] * v.storage[1];
    var y = this.storage[2] * v.storage[0] - this.storage[0] * v.storage[2];
    var z = this.storage[0] * v.storage[1] - this.storage[1] * v.storage[0];

    return new Vector3(x, y, z);
};

Vector3.prototype.absolute = function() {
    this.storage[0] = Math.abs(this.storage[0]);
    this.storage[1] = Math.abs(this.storage[1]);
    this.storage[2] = Math.abs(this.storage[2]);
};

Vector3.prototype.isNaN = function() {
    var is_nan = false;
    is_nan = is_nan || this.storage[0].isNaN;
    is_nan = is_nan || this.storage[1].isNaN;
    is_nan = is_nan || this.storage[2].isNaN;
    return is_nan;
};

Vector3.prototype.isInfinite = function() {
    var is_inf = false;
    is_inf = is_inf || this.storage[0].isInfinite();
    is_inf = is_inf || this.storage[1].isInfinite();
    is_inf = is_inf || this.storage[2].isInfinite();
    return is_nan;
};

Vector3.prototype.toString = function() {
    return '[x=' + this.storage[0] + ', y=' + this.storage[1] + ', z=' + this.storage[2] + ']';
};

Vector3.prototype.length = function() {
    return Math.sqrt(this.length2());
};

Vector3.prototype.length2 = function() {
    return this.storage[0] * this.storage[0] +
           this.storage[1] * this.storage[1] +
           this.storage[2] * this.storage[2];
};

Vector3.prototype.normalize = function() {
    var l = this.length();
    if (l != 0.0) {
        l = 1.0 / l;
        this.storage[0] *= l;
        this.storage[1] *= l;
        this.storage[2] *= l;
    }
    return this;
};

Vector3.prototype.normalized = function() {
    var v = this.clone();
    return v.normalize();
};

Vector3.prototype.distanceToSquared = function(v) {
    var dx = this.storage[0] - v.x;
    var dy = this.storage[1] - v.y;
    var dz = this.storage[2] - v.z;
    return dx * dx + dy * dy + dz * dz;
};

Vector3.prototype.distanceTo = function(v) {
   return Math.sqrt(this.distanceToSquared(v));
};
},{}],10:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Vector4;

},{}],11:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */
module.exports = {
    version:   _dereq_('../package.json').version,

    EPSILON:   _dereq_('../package.json').EPSILON,

    Vector2:   _dereq_('./vector2.js'),
    Vector3:   _dereq_('./vector3.js'),
    Vector4:   _dereq_('./vector4.js'),
    Matrix2:   _dereq_('./matrix2.js'),
    Matrix3:   _dereq_('./matrix3.js'),
    Matrix4:   _dereq_('./matrix4.js'),
    Plane:     _dereq_('./plane.js'),
    Ray:       _dereq_('./ray.js'),
    Triangle:  _dereq_('./triangle.js'),

};
},{"../package.json":1,"./matrix2.js":2,"./matrix3.js":3,"./matrix4.js":4,"./plane.js":5,"./ray.js":6,"./triangle.js":7,"./vector2.js":8,"./vector3.js":9,"./vector4.js":10}]},{},[11])
(11)
});
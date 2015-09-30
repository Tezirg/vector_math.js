/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector2;

var vector_math = require('./common.js');
var SIMD = require("simd");

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
 * @property length
 * @type {number}
 */
Vector2.prototype.__defineGetter__("length", function() {
    return Math.sqrt(this.length2());
});
Vector2.prototype.__defineSetter__("length", function(value) {
    if (value == 0.0) {
        this.setZero();
    }
    else {
        l = this.length;
        if (l == 0.0) {
            return;
        }
        l = value / l;
        this.storage[0] *= l;
        this.storage[1] *= l;
    }
});

/**
 * @static
 * @property {Vector2} zero
 */
Vector2.zero = function() {
    var v = new Vector2(0.0, 0.0);
    return v;
};

/// Zero the vector.
Vector2.prototype.setZero = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    return this;
};

/**
 * @static
 * Constructs Vector2 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @returns {Vector2}
 */
Vector2.fromFloat32Array = function(array) {
    var vec = Vector2.zero();
    vec.storage = array;
    return vec;
};


/**
 * @static
 * Constructs Vector2 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @returns {Vector2}
 */
Vector2.fromBuffer = function(buffer, offset) {
    var vec = Vector2.zero();
    vec.storage = new Float32Array(buffer, offset, 3);
    return vec.clone();
};

/// Set the values of the vector.
Vector2.prototype.setValues = function(x, y) {
    this.storage[0] = x;
    this.storage[1] = y;
    return this;
};

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
    var v = Vector2.zero();
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

/**
 * @method
 * Returns a copy of this
 * @returns {Vector2}
 */
Vector2.prototype.clone = function() {
    return Vector2.copy(this);
};

/**
 * @method
 * Set this to be equal to [v]
 * @param v {Vector2}
 * @returns {Vector2}
 */
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

/**
 * @method
 * Returns if this is almost equal to other
 * @param v {Vector3}
 * @param precision {number}
 * @returns {boolean}
 */
Vector2.prototype.almostEquals = function(v, precision) {
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if (Math.abs(this.x-v.x) > precision ||
        Math.abs(this.y-v.y) > precision) {
        return false;
    }
    return true;
};

/**
 * @method
 * Returns if this is equal to other
 * @param v {Vector2}
 * @returns {boolean}
 */
Vector2.prototype.equals = function(v) {
    return (this.x == v.x && this.y == v.y);
};

/**
 * @method
 * Returns if this is almost a zero vector
 * @param precision {number}
 * @returns {boolean}
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
 * @method
 * Returns if this is a Zero vector
 * @returns {boolean}
 */
Vector2.prototype.isZero = function() {
  return (this.x == 0 && this.y == 0);
};

/**
 * @method
 * Negate this
 * @returns {Vector2}
 */
Vector2.prototype.negate = function() {
    this.storage[0] = - this.storage[0];
    this.storage[1] = - this.storage[1];
    return this;
};

/**
 * @method
 * Subtract other to this
 * @param other {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.sub = function(other) {
    this.storage[0] = this.storage[0] - other.storage[0];
    this.storage[1] = this.storage[1] - other.storage[1];
    return this;
};

/**
 * @method
 * Add other to this
 * @param other {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.add = function(other) {
    this.storage[0] = this.storage[0] + other.storage[0];
    this.storage[1] = this.storage[1] + other.storage[1];
    return this;
};

/**
 * @method
 * Multiply other to this
 * @param other
 * @returns {Vector2}
 */
Vector2.prototype.mul = function(other) {
    this.storage[0] = this.storage[0] * other.storage[0];
    this.storage[1] = this.storage[1] * other.storage[1];
    return this;
};

/**
 * @method
 * Divide this by other
 * @param other {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.div = function(other) {
    this.storage[0] = this.storage[1] / other.storage[1];
    this.storage[1] = this.storage[1] / other.storage[1];
    return this;
};

/**
 * @method
 * Scale this
 * @param arg {number}
 * @returns {Vector2}
 */
Vector2.prototype.scale = function(arg) {
    this.storage[0] = this.storage[0] * arg;
    this.storage[1] = this.storage[1] * arg;
    return this;
};

/**
 * @method
 * Returns Scaled copy of this
 * @param arg {number}
 * @returns {Vector2}
 */
Vector2.prototype.scaled = function(arg) {
    var v = this.clone();
    v.scale(arg);
    return v;
};


/**
 * @method
 * Reflect [this].
 * @param normal
 * @returns {Vector2}
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
 * @returns {Number}
 */
Vector2.prototype.dot = function(v) {
    return this.storage[0] * v.storage[0] +
           this.storage[1] * v.storage[1];
};

/**
 * @method
 * Compute cross product
 * @param v {Vector2}
 * @returns {number}
 */
Vector2.prototype.cross = function(v) {
    return this.storage[0] * v.storage[1] -
           this.storage[1] * v.storage[0];
};

/**
 * @method
 * Sets this to absolute values
 */
Vector2.prototype.absolute = function() {
    this.storage[0] = Math.abs(this.storage[0]);
    this.storage[1] = Math.abs(this.storage[1]);
};

/**
 * @method
 * Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector2}
 * @param max {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.clamp = function(min, max) {
    var minStorage = min.storage;
    var maxStorage = max.storage;
    this.storage[0] = Math.min(Math.max(this.storage[0], minStorage[0]), maxStorage[0]);
    this.storage[1] = Math.min(Math.max(this.storage[1], minStorage[1]), maxStorage[1]);
    return this;
};

/**
 * @method
 * Clamp entries in [this] in the range [min]-[max].
 * @param min {number}
 * @param max {number}
 * @returns {Vector2}
 */
Vector2.prototype.clampScalar = function(min, max) {
    this.storage[0] = Math.min(Math.max(this.storage[0], min), max);
    this.storage[1] = Math.min(Math.max(this.storage[1], min), max);
    return this;
};

/**
 * @method
 * Check if this contains NaN values
 * @returns {boolean}
 */
Vector2.prototype.isNaN = function() {
    var is_nan = false;
    is_nan = is_nan || this.storage[0].isNaN;
    is_nan = is_nan || this.storage[1].isNaN;
    return is_nan;
};

/**
 * @method
 * Check if this contains infinite values
 * @returns {boolean}
 */
Vector2.prototype.isInfinite = function() {
    var is_inf = false;
    is_inf = is_inf || this.storage[0].isInfinite();
    is_inf = is_inf || this.storage[1].isInfinite();
    return is_inf;
};

/**
 * @method
 * Printable string
 * @returns {string}
 */
Vector2.prototype.toString = function() {
    return '[x=' + this.storage[0] + ', y=' + this.storage[1] + ']';
};


/**
 * @method
 * Squared length
 * @returns {number}
 */
Vector2.prototype.length2 = function() {
    return this.x * this.x + this.y * this.y;
};

/**
 * @method
 * Normalize this
 * @returns {Vector2}
 */
Vector2.prototype.normalize = function() {
    var l = this.length;
    if (l != 0.0) {
        l = 1.0 / l;
        this.storage[0] = this.x * l;
        this.storage[1] = this.y * l;
    }
    return this;
};

/**
 * @method
 * Returns a normalized copy of this
 * @returns {Vector2}
 */
Vector2.prototype.normalized = function() {
    var v = this.clone();
    return v.normalize();
};

/**
 * @method
 * Compute squared distance to oter
 * @param v {Vector2}
 * @returns {number}
 */
Vector2.prototype.distanceToSquared = function(v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return dx * dx + dy * dy;
};

/**
 * @method
 * Compute distance to other
 * @param v {Vector2}
 * @returns {number}
 */
Vector2.prototype.distanceTo = function(v) {
   return Math.sqrt(this.distanceToSquared(v));
};

/**
 * @method
 * Floor entries in [this].
 * @returns {Vector2}
 */
Vector2.prototype.floor = function() {
    this.storage[0] = Math.floor(this.x);
    this.storage[1] = Math.floor(this.y);
    return this;
};

/**
 * @method
 * Ceil entries in [this].
 * @returns {Vector2}
 */
Vector2.prototype.ceil = function() {
    this.storage[0] = Math.ceil(this.x);
    this.storage[1] = Math.ceil(this.y);
    return this;
};

/**
 * @method
 * Round entries in [this].
 * @returns {Vector2}
 */
Vector2.prototype.round = function() {
    this.storage[0] = Math.round(this.x);
    this.storage[1] = Math.round(this.y);
    return this;
};

/**
 * @method
 * Round entries in [this] towards zero.
 * @returns {Vector2}
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
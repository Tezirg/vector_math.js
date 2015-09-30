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
 * Scalar version of set length
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
 * @method
 * Returns if this is almost equal to other
 * @param v {Vector2}
 * @param precision {number}
 * @returns {boolean}
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
 * @method
 * Subtract other to this
 * @param other {Vector2}
 * @returns {Vector2}
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
 * @method
 * Add other to this
 * @param other {Vector2}
 * @returns {Vector2}
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
 * @method
 * Multiply other to this
 * @param other
 * @returns {Vector2}
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
 * @method
 * Divide this by other
 * @param other {Vector2}
 * @returns {Vector2}
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
 * @method
 * Scale this
 * @param arg {number}
 * @returns {Vector2}
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
 * @method
 * Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector2}
 * @param max {Vector2}
 * @returns {Vector2}
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
 * @method
 * Clamp entries in [this] in the range [min]-[max].
 * @param min {number}
 * @param max {number}
 * @returns {Vector2}
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
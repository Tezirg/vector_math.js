/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector3;

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

/// Zero the vector.
Vector3.prototype.setZero = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    return this;
};

/// Constructs Vector2 with a given [Float32List] as [storage].
Vector3.fromFloat32Array = function(array) {
    var vec = Vector3.zero;
    vec.storage = array;
    return vec;
};


/// Constructs Vector3 with a [storage] that views given [buffer] starting at
/// [offset]. [offset] has to be multiple of [Float32List.BYTES_PER_ELEMENT].
Vector3.fromBuffer = function(buffer, offset) {
    var vec = Vector3.zero;
    vec.storage = new Float32Array(buffer, offset, 3);
    return vec.clone();
};

/// Set the values of the vector.
Vector3.prototype.setValues = function(x, y, z) {
    this.storage[0] = x;
    this.storage[1] = y;
    this.storage[2] = z;
    return this;
};


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
        precision = Number.EPSILON;
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
        precision = Number.EPSILON;
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

/// Reflect [this].
Vector3.prototype.reflect = function(normal) {
    var n_copy = normal.clone();
    n_copy.scale(2.0 * normal.dot(this));
    this.sub(n_copy);
    return this;
};

/**
 * @method dot
 * @param v
 * @returns {Number}
 */
Vector3.prototype.dot = function(v) {
    return this.storage[0] * v.x +
           this.storage[1] * v.y +
           this.storage[2] * v.z;
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
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
};

Vector3.prototype.distanceTo = function(v) {
   return Math.sqrt(this.distanceToSquared(v));
};

/// Floor entries in [this].
Vector3.prototype.floor = function() {
    this.storage[0] = Math.floor(this.x);
    this.storage[1] = Math.floor(this.y);
    this.storage[2] = Math.floor(this.z);
    return this;
};

/// Ceil entries in [this].
Vector3.prototype.ceil = function() {
    this.storage[0] = Math.ceil(this.x);
    this.storage[1] = Math.ceil(this.y);
    this.storage[2] = Math.ceil(this.z);
    return this;
};

/// Round entries in [this].
Vector3.prototype.round = function() {
    this.storage[0] = Math.round(this.x);
    this.storage[1] = Math.round(this.y);
    this.storage[2] = Math.round(this.z);
    return this;
};
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Vector4;

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
}

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
        this.storage[2] *= l;
        this.storage[3] *= l;
    }
});

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
    result.x = Math.min(a.x, b.x);
    result.y = Math.min(a.y, b.y);
    result.z = Math.min(a.z, b.z);
    result.w = Math.min(a.w, b.w);
};

/**
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @static
 * @param a {Vector4}
 * @param b {Vector4}
 * @param result {Vector4}
 */
Vector4.max = function(a, b, result) {
    result.x = Math.max(a.x, b.x);
    result.y = Math.max(a.y, b.y);
    result.z = Math.max(a.z, b.z);
    result.w = Math.max(a.w, b.w);
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
    result.x = min.x + a * (max.x - min.x);
    result.y = min.y + a * (max.y - min.y);
    result.z = min.z + a * (max.z - min.z);
    result.w = min.w + a * (max.w - min.w);
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
    this.storage[0] = value;
    this.storage[1] = value;
    this.storage[2] = value;
    this.storage[3] = value;
    return this;
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
        precision = Number.EPSILON;
    }
    if (Math.abs(this.x - v.x) > precision ||
        Math.abs(this.y - v.y) > precision ||
        Math.abs(this.z - v.z) > precision ||
        Math.abs(this.w - v.w) > precision) {
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
        precision = Number.EPSILON;
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
    this.storage[0] = - this.storage[0];
    this.storage[1] = - this.storage[1];
    this.storage[2] = - this.storage[2];
    this.storage[3] = - this.storage[3];
    return this;
};

/**
 * @method
 * Subtract other from this
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.sub = function(other) {
    this.storage[0] = this.storage[0] - other.storage[0];
    this.storage[1] = this.storage[1] - other.storage[1];
    this.storage[2] = this.storage[2] - other.storage[2];
    this.storage[3] = this.storage[2] - other.storage[3];
    return this;
};

/**
 * @method
 * Add other into this
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.add = function(other) {
    this.storage[0] = this.storage[0] + other.storage[0];
    this.storage[1] = this.storage[1] + other.storage[1];
    this.storage[2] = this.storage[2] + other.storage[2];
    this.storage[3] = this.storage[3] + other.storage[3];
    return this;
};

/**
 * @method
 * Multiply this by other
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.mul = function(other) {
    this.storage[0] = this.storage[0] * other.storage[0];
    this.storage[1] = this.storage[1] * other.storage[1];
    this.storage[2] = this.storage[2] * other.storage[2];
    this.storage[3] = this.storage[3] * other.storage[3];
    return this;
};

/**
 * @method
 * Divide this by other
 * @param other {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.div = function(other) {
    this.storage[0] = this.storage[1] / other.storage[1];
    this.storage[1] = this.storage[1] / other.storage[1];
    this.storage[2] = this.storage[2] / other.storage[2];
    this.storage[3] = this.storage[3] / other.storage[3];
    return this;
};

/**
 * @method
 * Scale this
 * @param arg {number}
 * @returns {Vector4}
 */
Vector4.prototype.scale = function(arg) {
    this.storage[0] = this.storage[0] * arg;
    this.storage[1] = this.storage[1] * arg;
    this.storage[2] = this.storage[2] * arg;
    this.storage[3] = this.storage[3] * arg;
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
    return this.storage[0] * v.x +
        this.storage[1] * v.y +
        this.storage[2] * v.z +
        this.storage[3] * v.w;
};


/**
 * @method
 * Set this values to absolute
 */
Vector4.prototype.absolute = function() {
    this.storage[0] = Math.abs(this.storage[0]);
    this.storage[1] = Math.abs(this.storage[1]);
    this.storage[2] = Math.abs(this.storage[2]);
    this.storage[3] = Math.abs(this.storage[3]);
};

/**
 * @method
 * Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector4}
 * @param max {Vector4}
 * @returns {Vector4}
 */
Vector4.prototype.clamp = function(min, max) {
    var minStorage = min.storage;
    var maxStorage = max.storage;
    this.storage[0] = Math.min(Math.max(this.storage[0], minStorage[0]), maxStorage[0]);
    this.storage[1] = Math.min(Math.max(this.storage[1], minStorage[1]), maxStorage[1]);
    this.storage[2] = Math.min(Math.max(this.storage[2], minStorage[2]), maxStorage[2]);
    this.storage[3] = Math.min(Math.max(this.storage[3], minStorage[3]), maxStorage[3]);
    return this;
};

/**
 * @method
 * Clamp entries in [this] in the range [min]-[max].
 * @param min {Number}
 * @param max {Number}
 * @returns {Vector4}
 */
Vector4.prototype.clampScalar = function(min, max) {
    this.storage[0] = Math.min(Math.max(this.storage[0], min), max);
    this.storage[1] = Math.min(Math.max(this.storage[1], min), max);
    this.storage[2] = Math.min(Math.max(this.storage[2], min), max);
    this.storage[3] = Math.min(Math.max(this.storage[3], min), max);
    return this;
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
    return this.storage[0] * this.storage[0] +
        this.storage[1] * this.storage[1] +
        this.storage[2] * this.storage[2] +
        this.storage[3] * this.storage[3];
};

/**
 * @method
 * Normalize this
 * @returns {Vector4}
 */
Vector4.prototype.normalize = function() {
    var l = this.length;
    if (l != 0.0) {
        l = 1.0 / l;
        this.storage[0] *= l;
        this.storage[1] *= l;
        this.storage[2] *= l;
        this.storage[3] *= l;
    }
    return this;
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
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var dz = this.z - v.z;
    var dw = this.w - v.w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
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
 * Returns the signed angle between [this] and [other] around [normal] in radians.
 * @param other {Vector4}
 * @param normal {Vector4}
 * @returns {number}
 */
Vector4.prototype.angleToSigned = function(other, normal) {
    var angle = this.angleTo(other);
    var c = this.cross(other);
    var d = c.dot(normal);

    return d < 0.0 ? -angle : angle;
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

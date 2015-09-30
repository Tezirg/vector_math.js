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
    //this.storage = null;
    /*if (vector_math.USE_SIMD()) {
        this.storage = new Float32Array([x, y, z, 0.0]);
    }
    else {
    */
    // }
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
 * @static
 * Load SIMD.Float32x4 into vector.simd_storage
 * @param vector {Vector3}
 */
Vector3.simd.load = function(vector) {
    vector.simd_storage = SIMD.Float32x4.load3(vector.storage, 0);
};

/**
 * @static
 * Store SIMD.Float32x4 at vector.simd_storage into vector.storage
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

/**
 * @static
 * Scalar version of set length
 * @param vector {Vector3}
 * @param value {Number}
 * @private
 */
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
 * @static
 * @property {Vector3} zero
 */
Vector3.zero = function() {
    var v = new Vector3(0.0, 0.0, 0.0);
    return v;
};

/**
 * @method
 * Zero the vector.
 * @returns {Vector3}
 */
Vector3.prototype.setZero = function() {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    return this;
};

/**
 * @static
 * Constructs Vector3 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @returns {Vector3}
 */
Vector3.fromFloat32Array = function(array) {
    var vec = Vector3.zero();
    vec.storage = array;
    return vec;
};


/**
 * @static
 * Constructs Vector3 with a [storage] that views given [buffer] starting at
 * [offset]. [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @returns {Vector3}
 */
Vector3.fromBuffer = function(buffer, offset) {
    var vec = Vector3.zero();
    vec.storage = new Float32Array(buffer, offset, 3);
    return vec.clone();
};

/**
 *  Set the values of the vector.
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @returns {Vector3}
 */
Vector3.prototype.setValues = function(x, y, z) {
    this.storage[0] = x;
    this.storage[1] = y;
    this.storage[2] = z;
    return this;
};


/**
 * @static
 * @property copy
 * @param v {vector3}
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
    var v = Vector3.zero();
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
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @static
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
 * @description Interpolate between [min] and [max] with the amount of [a] using a linear
 * interpolation and store the values in [result].
 * @static
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
 * @method
 * Returns a copy of this
 * @returns {Vector3}
 */
Vector3.prototype.clone = function() {
    return Vector3.copy(this);
};

/**
 * @method
 * Set this from another vector3
 * @param v {Vector3}
 * @returns {Vector3}
 */
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
 * @method
 * Return if this is almost equal to other
 * @param v {Vector3}
 * @param precision {number}
 * @returns {boolean}
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
 * @method
 * Return if this is equal to other
 * @param v {other}
 * @returns {boolean}
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
 * @method
 * Returns if this is a zero vector
 * @returns {boolean}
 */
Vector3.prototype.isZero = function() {
  return (this.x == 0 && this.y == 0 && this.z == 0);
};

/**
 * @method
 * negate this
 * @returns {Vector3}
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
 * @method
 * Subtract other from this
 * @param other {Vector3}
 * @returns {Vector3}
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
 * @method
 * Add other to this
 * @param other
 * @returns {Vector3}
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
 * @method
 * Multiply other to this
 * @param other
 * @returns {Vector3}
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
 * @method
 * Divide this by other
 * @param other
 * @returns {Vector3}
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
 * @method
 * Scale this
 * @param arg
 * @returns {Vector3}
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
 * @method
 * Returns Scaled copy this
 * @param arg
 * @returns {Vector3}
 */
Vector3.prototype.scaled = function(arg) {
    var v = this.clone();
    v.scale(arg);
    return v;
};


/**
 * @method
 * Reflect [this].
 * @param normal
 * @returns {Vector3}
 */
Vector3.prototype.reflect = function(normal) {
    var n_copy = normal.clone();
    n_copy.scale(2.0 * normal.dot(this));
    this.sub(n_copy);
    return this;
};

/**
 * @method dot
 * Compute dot product
 * @param v {Vector3}
 * @returns {Number}
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
 * @method
 * Compute cross product
 * @param v {Vector3}
 * @returns {Vector3}
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
 * @method
 * Set this to absolute value
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
 * @method
 * Transforms [this] into the product of [this] as a row vector,
 * postmultiplied by matrix, [arg].
 * If [arg] is a rotation matrix, this is a computational shortcut for applying,
 * the inverse of the transformation.
 *
 * @param arg {Matrix3}
 * @returns {Vector3}
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
 * @method
 * /// Projects [this] using the projection matrix [arg]
 * @param arg {Matrix4}
 * @returns {Vector3}
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
 * /// Applies a rotation specified by [axis] and [angle].
 * @param axis {Vector3}
 * @param angle {number}
 * @returns {Vector3}
 */
Vector3.prototype.applyAxisAngle = function(axis, angle) {
    this.applyQuaternion(Quaternion.axisAngle(axis, angle));
    return this;
};

/**
 * @method
 * Applies a quaternion transform.
 * @param arg {Quaternion}
 * @returns {Vector3}
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
 * /// Multiplies [this] by [arg]. 
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
 * @method
 * /// Multiplies [this] by a 4x3 subset of [arg]. Expects [arg] to be an affine transformation matrix.
 * @param arg {Matrix4}
 * @returns {Vector3}
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
 * @method
 * Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector3}
 * @param max {Vector3}
 * @returns {Vector3}
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
 * @method
 *  Clamp entries in [this] in the range [min]-[max].
 * @param min {number}
 * @param max {number}
 * @returns {Vector3}
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
 * @method
 * Check is vector contains NaN values
 * @returns {boolean}
 */
Vector3.prototype.isNaN = function() {
    var is_nan = false;
    is_nan = is_nan || this.storage[0].isNaN;
    is_nan = is_nan || this.storage[1].isNaN;
    is_nan = is_nan || this.storage[2].isNaN;
    return is_nan;
};

/**
 * @method
 * Check if vector contains Infinte values
 * @returns {boolean}
 */
Vector3.prototype.isInfinite = function() {
    var is_inf = false;
    is_inf = is_inf || this.storage[0].isInfinite();
    is_inf = is_inf || this.storage[1].isInfinite();
    is_inf = is_inf || this.storage[2].isInfinite();
    return is_inf;
};

/**
 * @method
 * Printable string
 * @returns {string}
 */
Vector3.prototype.toString = function() {
    return '[x=' + this.storage[0] + ', y=' + this.storage[1] + ', z=' + this.storage[2] + ']';
};

/**
 * @method
 * Squared length
 * @returns {number}
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
 * @method
 * Normalize this
 * @returns {Vector3}
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
 * @method
 * Returns a normalized copy of this
 * @returns {Vector3}
 */
Vector3.prototype.normalized = function() {
    var v = this.clone();
    return v.normalize();
};

/**
 * @method
 * Compute squared distance to other
 * @param v {Vector3}
 * @returns {number}
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
 * @method
 * Compute distance to other
 * @param v {Vector3}
 * @returns {number}
 */
Vector3.prototype.distanceTo = function(v) {
   return Math.sqrt(this.distanceToSquared(v));
};

/**
 * @method
 * Returns the angle between [this] vector and [other] in radians.
 * @param other {Vector3}
 * @returns {number}
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
 * @method
 * Returns the signed angle between [this] and [other] around [normal] in radians.
 * @param other {Vector3}
 * @param normal {Vector3}
 * @returns {number}
 */
Vector3.prototype.angleToSigned = function(other, normal) {
    var angle = this.angleTo(other);
    var c = this.cross(other);
    var d = c.dot(normal);

    return d < 0.0 ? -angle : angle;
};

/**
 * @method
 * Floor entries in [this].
 * @returns {Vector3}
 */
Vector3.prototype.floor = function() {
    this.storage[0] = Math.floor(this.x);
    this.storage[1] = Math.floor(this.y);
    this.storage[2] = Math.floor(this.z);
    return this;
};

/**
 * @method
 * Ceil entries in [this].
 * @returns {Vector3}
 */
Vector3.prototype.ceil = function() {
    this.storage[0] = Math.ceil(this.x);
    this.storage[1] = Math.ceil(this.y);
    this.storage[2] = Math.ceil(this.z);
    return this;
};

/**
 * @method
 * Round entries in [this].
 * @returns {Vector3}
 */
Vector3.prototype.round = function() {
    this.storage[0] = Math.round(this.x);
    this.storage[1] = Math.round(this.y);
    this.storage[2] = Math.round(this.z);
    return this;
};

/**
 * @method
 * Round entries in [this] towards zero.
 * @returns {Vector3}
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
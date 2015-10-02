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
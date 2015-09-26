/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix4;
var Matrix3 = require('./matrix3.js');
var Vector3 = require('./vector3.js');
var Vector4 = require('./vector4.js');
var Quaternion = require('./quaternion.js');

/**
 * @class Matrix4
 * /// 4D Matrix. Values are stored in column major order.
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
     * @property dimension
     * @type {number}
     */
    this.dimension = 4;
}

/**
 * @static
 * /// Constructs Matrix4 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Matrix4}
 */
Matrix4.fromFloat32Array = function(array) {
    var m = Matrix4.zero();
    m.storage = array;
    return m;
};

/**
 * @static
 * /// Constructs Matrix2 with a [storage] that views given [buffer] starting at
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
 * @static
 * /// Solve [A] * [x] = [b].
 * @param A {Matrix4}
 * @param x {Vector2}
 * @param b {Vector2}
 */
Matrix4.solve2 = function(A, x, b) {
    var a11 = A.entry(0, 0);
    var a12 = A.entry(0, 1);
    var a21 = A.entry(1, 0);
    var a22 = A.entry(1, 1);
    var bx = b.x - A.storage[8];
    var by = b.y - A.storage[9];
    var det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
        det = 1.0 / det;
    }

    x.x = det * (a22 * bx - a12 * by);
    x.y = det * (a11 * by - a21 * bx);
};

/**
 * @static
 * /// Solve [A] * [x] = [b].
 * @param A {Matrix4}
 * @param x {Vector3}
 * @param b {Vector3}
 */
Matrix4.solve3 = function(A, x, b) {
    var A0x = A.entry(0, 0);
    var A0y = A.entry(1, 0);
    var A0z = A.entry(2, 0);
    var A1x = A.entry(0, 1);
    var A1y = A.entry(1, 1);
    var A1z = A.entry(2, 1);
    var A2x = A.entry(0, 2);
    var A2y = A.entry(1, 2);
    var A2z = A.entry(2, 2);
    var bx = b.x - A.storage[12];
    var by = b.y - A.storage[13];
    var bz = b.z - A.storage[14];
    var rx, ry, rz;

    // Column1 cross Column 2
    rx = A1y * A2z - A1z * A2y;
    ry = A1z * A2x - A1x * A2z;
    rz = A1x * A2y - A1y * A2x;

    // A.getColumn(0).dot(x)
    var det = A0x * rx + A0y * ry + A0z * rz;
    if (det != 0.0) {
        det = 1.0 / det;
    }

    // b dot [Column1 cross Column 2]
     var x_ = det * (bx * rx + by * ry + bz * rz);

    // Column2 cross b
    rx = -(A2y * bz - A2z * by);
    ry = -(A2z * bx - A2x * bz);
    rz = -(A2x * by - A2y * bx);
    // Column0 dot -[Column2 cross b (Column3)]
     var y_ = det * (A0x * rx + A0y * ry + A0z * rz);

    // b cross Column 1
    rx = -(by * A1z - bz * A1y);
    ry = -(bz * A1x - bx * A1z);
    rz = -(bx * A1y - by * A1x);
    // Column0 dot -[b cross Column 1]
     var z_ = det * (A0x * rx + A0y * ry + A0z * rz);

    x.x = x_;
    x.y = y_;
    x.z = z_;
};

/**
 * @static
 * /// Solve [A] * [x] = [b].
 * @param A {Matrix4}
 * @param x {Vector4}
 * @param b {Vector4}
 */
Matrix4.solve = function(A, x, b) {
     var a00 = A.storage[0];
     var a01 = A.storage[1];
     var a02 = A.storage[2];
     var a03 = A.storage[3];
     var a10 = A.storage[4];
     var a11 = A.storage[5];
     var a12 = A.storage[6];
     var a13 = A.storage[7];
     var a20 = A.storage[8];
     var a21 = A.storage[9];
     var a22 = A.storage[10];
     var a23 = A.storage[11];
     var a30 = A.storage[12];
     var a31 = A.storage[13];
     var a32 = A.storage[14];
     var a33 = A.storage[15];
     var b00 = a00 * a11 - a01 * a10;
     var b01 = a00 * a12 - a02 * a10;
     var b02 = a00 * a13 - a03 * a10;
     var b03 = a01 * a12 - a02 * a11;
     var b04 = a01 * a13 - a03 * a11;
     var b05 = a02 * a13 - a03 * a12;
     var b06 = a20 * a31 - a21 * a30;
     var b07 = a20 * a32 - a22 * a30;
     var b08 = a20 * a33 - a23 * a30;
     var b09 = a21 * a32 - a22 * a31;
     var b10 = a21 * a33 - a23 * a31;
     var b11 = a22 * a33 - a23 * a32;

     var bX = b.storage[0];
     var bY = b.storage[1];
     var bZ = b.storage[2];
     var bW = b.storage[3];

    var det =
        b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det != 0.0) {
        det = 1.0 / det;
    }

    x.x = det *
    ((a11 * b11 - a12 * b10 + a13 * b09) * bX -
    (a10 * b11 - a12 * b08 + a13 * b07) * bY +
    (a10 * b10 - a11 * b08 + a13 * b06) * bZ -
    (a10 * b09 - a11 * b07 + a12 * b06) * bW);

    x.y = det *
    -((a01 * b11 - a02 * b10 + a03 * b09) * bX -
    (a00 * b11 - a02 * b08 + a03 * b07) * bY +
    (a00 * b10 - a01 * b08 + a03 * b06) * bZ -
    (a00 * b09 - a01 * b07 + a02 * b06) * bW);

    x.z = det *
    ((a31 * b05 - a32 * b04 + a33 * b03) * bX -
    (a30 * b05 - a32 * b02 + a33 * b01) * bY +
    (a30 * b04 - a31 * b02 + a33 * b00) * bZ -
    (a30 * b03 - a31 * b01 + a32 * b00) * bW);

    x.w = det *
    -((a21 * b05 - a22 * b04 + a23 * b03) * bX -
    (a20 * b05 - a22 * b02 + a23 * b01) * bY +
    (a20 * b04 - a21 * b02 + a23 * b00) * bZ -
    (a20 * b03 - a21 * b01 + a22 * b00) * bW);
};

/**
 * Return index in storage for [row], [col] value.
 * @method index
 * @param row
 * @param col
 */
Matrix4.prototype.index = function(row, col) {
    return (col * 4) + row;
};


/**
 * Value at [row], [col].
 * @param row {Number}
 * @param col {Number}
 * @returns {Number} {null}
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
 * Set value at [row], [col] to be [v].
 * @param row {Number}
 * @param col {Number}
 * @param v {Number}
 * @returns {null}
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
 * Zero matrix.
 * @static
 * @returns {Matrix4}
 */
Matrix4.zero = function() {
    var m = new Matrix4(0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0, 0.0);
    return m;
};

/**
 * Identity matrix.
 * @static
 * @returns {Matrix4}
 */
Matrix4.identity = function() {
    var m = Matrix4.zero();
    m.setIdentity();
    return m;
};

/**
 * Copies values from [other].
 * @static
 * @param other {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.copy = function(other) {
    var m = Matrix4.zero();
    m.setFrom(other);
    return m;
};

/**
 * /// Matrix with values from column arguments.
 * @static
 * @param arg0 {Vector4}
 * @param arg1 {Vector4}
 * @param arg2 {Vector4}
 * @param arg3 {Vector4}
 * @returns {Matrix4}
 */
Matrix4.columns = function(arg0, arg1, arg2, arg3) {
    var m = Matrix4.zero();
    m.setColumns(arg0, arg1, arg2, arg3);
    return m;
};

/**
 * /// Outer product of [u] and [v].
 * @static
 * @param u {Vector4}
 * @param v {Vector4}
 * @returns {Matrix4}
 */
Matrix4.outer = function(u, v) {
    var m = Matrix4.zero();
    m.setOuter(u, v);
    return m;
};

/**
 * /// Rotation of [radians].
 * @param radians {Number}
 * @returns {Matrix4}
 */
Matrix4.rotation = function(radians) {
    var m = Matrix4.zero();
    m.setRotation(radians);
    return m;
};


/**
 * /// Rotation of [radians] on X.
 * @param radians {Number}
 * @returns {Matrix4}
 */
Matrix4.rotationX = function(radians) {
    var m = Matrix4.zero();
    m.storage[15] = 1.0;
    m.setRotationX(radians);
    return m;
};

/**
 * /// Rotation of [radians] on Y.
 * @param radians {Number}
 * @returns {Matrix3}
 */
Matrix4.rotationY = function(radians) {
    var m = Matrix4.zero();
    m.storage[15] = 1.0;
    m.setRotationY(radians);
    return m;
};

/**
 * /// Rotation of [radians] on Z.
 * @param radians {Number}
 * @returns {Matrix3}
 */
Matrix4.rotationZ = function(radians) {
    var m = Matrix4.zero();
    m.storage[15] = 1.0;
    m.setRotationZ(radians);
    return m;
};

/**
 * @static
 * Scale matrix
 * @param scale {Vector4}
 * @returns {Matrix4}
 */
Matrix4.translation = function(scale) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setDiagonal(scale);
    return m;
};

/**
 * @static
 * Scale matrix from values x,y,z,w
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 * @returns {Matrix4}
 */
Matrix4.diagonalValues = function(x, y, z, w) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setDiagonal(new Vector4(x, y, z, w));
    return m;
};

/**
 * @static
 * Translation matrix
 * @param translation {Vector3}
 * @returns {Matrix4}
 */
Matrix4.translation = function(translation) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setTranslation(translation);
    return m;
};

/**
 * @static
 * Translation matrix from values x,y,z
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @returns {Matrix4}
 */
Matrix4.translationValues = function(x, y, z) {
    var m = Matrix4.zero();
    m.setIdentity();
    m.setTranslation(new Vector3(x, y, z));
    return m;
};

/**
 * @static
 * Constructs a Matrix4 from translation, rotation and scale
 * @param translation {Vector3}
 * @param rotation {Quaternion}
 * @param scale {Vector3}
 * @returns {Matrix4}
 */
Matrix4.compose = function(translation, rotation, scale) {
    var m = Matrix4.zero();
    m.setFromTranslationRotationScale(translation, rotation, scale);
    return m;
};

/**
 * @method
 * /// Sets the diagonal to [arg].
 * @param arg {Number}
 * @returns {Matrix4}
 */
Matrix4.prototype.splatDiagonal = function(arg) {
    this.storage[0] = arg;
    this.storage[5] = arg;
    this.storage[10] = arg;
    this.storage[15] = arg;
    return this;
};

/**
 * Sets the matrix with specified values
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
 * @returns {Matrix4}
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
 * @method
 * Sets the entire matrix to the column values.
 * @param arg0 {Vector4}
 * @param arg1 {Vector4}
 * @param arg2 {Vector4}
 * @param arg3 {Vector4}
 * @returns {Matrix4}
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
 * @method
 * /// Sets the entire matrix to the matrix in [arg].
 * @param arg {Matrix4}
 * @returns {Matrix4}
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
 * @method
 * Sets the matrix from translation [arg0] and rotation [arg1].
 * @param arg0 {Vector3}
 * @param arg1 {Quaternion}
 * @returns {Matrix4}
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
 * @method
 * Sets the matrix from [translation], [rotation] and [scale].
 * @param translation {Vector3}
 * @param rotation {Quaternion}
 * @param scale {Vector3}
 * @returns {Matrix4}
 */
Matrix4.prototype.setFromTranslationRotationScale = function(translation, rotation, scale) {
    this.setFromTranslationRotation(translation, rotation);
    this.scale(scale);
    return this;
};

/**
 * @method
 * /// Sets the upper 2x2 of the matrix to be [arg].
 * @param arg {Matrix2}
 * @returns {Matrix4}
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
 * @method
 * /// Sets the diagonal of the matrix to be [arg].
 * @param arg {Vector4}
 * @returns {Matrix4}
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
 * @method
 * Set [this] to the outer product of [u] and [v].
 * @param u {Vector4}
 * @param v {Vector4}
 */
Matrix4.prototype.setOuter = function(u, v) {
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

/**
 * @method
 * Printable string
 * @returns {string}
 */
Matrix4.prototype.toString = function() {
    return '[0] '+ this.getRow(0).toString() +
        '\n[1] ' + this.getRow(1).toString() +
        '\n[2] ' + this.getRow(2).toString() +
        '\n[3] ' + this.getRow(3).toString() + '}\n';
};

/**
 * /// Access the element of the matrix at the index [i].
 * @method
 * @param i {number}
 * @returns {Number}
 */
Matrix4.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * /// Set the element of the matrix at the index [i].
 * @method
 * @param i {number}
 * @param v {number}
 */
Matrix4.prototype.setAt = function(i, v) {
    this.storage[i] = v;
};

/**
 * @method
 * /// Check if two matrices are the same.
 * @param other {Matrix4}
 * @returns {boolean}
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
 * @method
 * /// Check if two matrices are almost the same.
 * @param other {Matrix4}
 * @param precision {number}
 * @returns {boolean}
 */
Matrix4.prototype.almostEquals = function(other, precision) {
    if (other.dimension == null || other.dimension != 4) {
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
        (Math.abs(this.storage[8] - other.storage[8]) > precision) ||
        (Math.abs(this.storage[9] - other.storage[9]) > precision) ||
        (Math.abs(this.storage[10] - other.storage[10]) > precision) ||
        (Math.abs(this.storage[11] - other.storage[11]) > precision) ||
        (Math.abs(this.storage[12] - other.storage[12]) > precision) ||
        (Math.abs(this.storage[13] - other.storage[13]) > precision) ||
        (Math.abs(this.storage[14] - other.storage[14]) > precision) ||
        (Math.abs(this.storage[15] - other.storage[15]) > precision)) {
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
 * @method
 * /// Gets the [row] of the matrix
 * @param row {Number}
 * @returns {Vector4}
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
 * @method
 * /// Assigns the [column] of the matrix [arg]
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
 * @method
 * /// Gets the [column] of the matrix
 * @param column {Number}
 * @returns {Vector4}
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
 * /// Create a copy of [this].
 * @returns {Matrix4}
 */
Matrix4.prototype.clone = function() {
    return Matrix4.copy(this);
};

/**
 * /// Copy [this] into [arg].
 * @param arg {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.prototype.copyInto = function(arg) {
    arg.setFrom(this);
    return arg;
};

/**
 * /// Returns a new vector or matrix by multiplying [this] with [arg].
 * @param arg
 * @returns {*}
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
 * @method
 * /// Returns new matrix after component wise [this] + [arg]
 * @param arg {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.prototype.added = function(arg) {
    var m = this.clone();
    m.add(arg);
    return m;
};

/**
 * @method
 * /// Returns new matrix after component wise [this] - [arg]
 * @param arg {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.prototype.subbed = function(arg) {
    var m = this.clone();
    m.sub(arg);
    return m;
};

/**
 * @method
 * /// Returns new matrix after negating [this]
 * @returns {Matrix4}
 */
Matrix4.prototype.negated = function() {
    var m = this.clone();
    m.negate();
    return m;
};

/**
 * @method
 * Translate this matrix by a [Vector3], [Vector4], or x,y,z
 * @param x {Vector4|Vector3|number}
 * @param y {number}
 * @param z {number}
 * @returns {Matrix4}
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
    var t1 = this.storage[0] * tx +
        this.storage[4] * ty +
        this.storage[8] * tz +
        this.storage[12] * tw;
    var t2 = this.storage[1] * tx +
        this.storage[5] * ty +
        this.storage[9] * tz +
        this.storage[13] * tw;
    var t3 = this.storage[2] * tx +
        this.storage[6] * ty +
        this.storage[10] * tz +
        this.storage[14] * tw;
    var t4 = this.storage[3] * tx +
        this.storage[7] * ty +
        this.storage[11] * tz +
        this.storage[15] * tw;
    this.storage[12] = t1;
    this.storage[13] = t2;
    this.storage[14] = t3;
    this.storage[15] = t4;
    return this;
};

/**
 * @method
 * Rotate this [angle] radians around [axis]
 * @param axis {Vector3}
 * @param angle {number}
 * @returns {Matrix4}
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
 * @method
 * Rotate this [angle] radians around X
 * @param angle {number}
 * @returns {Matrix4}
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
 * @method
 * Rotate this matrix [angle] radians around Y
 * @param angle {number}
 * @returns {Matrix4}
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
 * @method
 * Rotate this matrix [angle] radians around Z
 * @param angle {number}
 * @returns {Matrix4}
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
 * @method
 * Scale this matrix by a [Vector3], [Vector4], or x,y,z
 * @param x {Vector4 | Vector3 | number}
 * @param y {number | undefined}
 * @param z {number | undefined}
 * @returns {Matrix4}
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
    this.storage[0] *= sx;
    this.storage[1] *= sx;
    this.storage[2] *= sx;
    this.storage[3] *= sx;
    this.storage[4] *= sy;
    this.storage[5] *= sy;
    this.storage[6] *= sy;
    this.storage[7] *= sy;
    this.storage[8] *= sz;
    this.storage[9] *= sz;
    this.storage[10] *= sz;
    this.storage[11] *= sz;
    this.storage[12] *= sw;
    this.storage[13] *= sw;
    this.storage[14] *= sw;
    this.storage[15] *= sw;
    return this;
};

/**
 * Create a copy of [this] scaled by a [Vector3], [Vector4] or [x],[y], and [z].
 * @param x
 * @param y
 * @param z
 * @returns {Matrix4}
 */
Matrix4.prototype.scaled = function(x, y, z) {
    var m = this.clone();
    m.scale(x, y, z);
    return m;
};

/**
 * @method
 * Zeros [this].
 * @returns {Matrix4}
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
 * @method
 * Makes [this] into the identity matrix.
 * @returns {Matrix4}
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
 * @method
 * Returns the tranpose copy of this.
 * @returns {Matrix4}
 */
Matrix4.prototype.transposed = function() {
    var m = this.clone();
    m.transpose();
    return m;
};

/**
 * @method
 * transpose this.
 * @returns {Matrix4}
 */
Matrix4.prototype.transpose = function() {
    var temp;
    temp = this.storage[4];
    this.storage[4] = this.storage[1];
    this.storage[1] = temp;
    temp = this.storage[8];
    this.storage[8] = this.storage[2];
    this.storage[2] = temp;
    temp = this.storage[12];
    this.storage[12] = this.storage[3];
    this.storage[3] = temp;
    temp = this.storage[9];
    this.storage[9] = this.storage[6];
    this.storage[6] = temp;
    temp = this.storage[13];
    this.storage[13] = this.storage[7];
    this.storage[7] = temp;
    temp = this.storage[14];
    this.storage[14] = this.storage[11];
    this.storage[11] = temp;
    return this;
};

/**
 * @method
 * Returns the component wise absolute value copy of this.
 * @returns {Matrix4}
 */
Matrix4.prototype.absolute = function() {
    var r = Matrix4.zero();
    var rStorage = r.storage;
    rStorage[0] = Math.abs(this.storage[0]);
    rStorage[1] = Math.abs(this.storage[1]);
    rStorage[2] = Math.abs(this.storage[2]);
    rStorage[3] = Math.abs(this.storage[3]);
    rStorage[4] = Math.abs(this.storage[4]);
    rStorage[5] = Math.abs(this.storage[5]);
    rStorage[6] = Math.abs(this.storage[6]);
    rStorage[7] = Math.abs(this.storage[7]);
    rStorage[8] = Math.abs(this.storage[8]);
    rStorage[9] = Math.abs(this.storage[9]);
    rStorage[10] = Math.abs(this.storage[10]);
    rStorage[11] = Math.abs(this.storage[11]);
    rStorage[12] = Math.abs(this.storage[12]);
    rStorage[13] = Math.abs(this.storage[13]);
    rStorage[14] = Math.abs(this.storage[14]);
    rStorage[15] = Math.abs(this.storage[15]);
    return r;
};

/**
 * @method
 * Returns the determinant of this matrix.
 * @returns {number}
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
 * @method
 * Returns the dot product of row [i] and [v].
 * @param i {number}
 * @param v {Vector4}
 * @returns {number}
 */
Matrix4.prototype.dotRow = function(i, v) {
    var vStorage = v.storage;
    return this.storage[i] * vStorage[0] +
           this.storage[4 + i] * vStorage[1] +
           this.storage[8 + i] * vStorage[2] +
           this.storage[12 + i] * vStorage[3];
};

/**
 * @method
 * Returns the dot product of column [j] and [v].
 * @param j {number}
 * @param v {Vector4}
 * @returns {number}
 */
Matrix4.prototype.dotColumn = function(j, v) {
    var vStorage = v.storage;
    return this.storage[j * 4] * vStorage[0] +
           this.storage[j * 4 + 1] * vStorage[1] +
           this.storage[j * 4 + 2] * vStorage[2] +
           this.storage[j * 4 + 3] * vStorage[3];
};

/**
 * @method
 * Returns the trace of the matrix. The trace of a matrix is the sum of the diagonal entries.
 * @returns {number}
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
 * @method
 * Returns infinity norm of the matrix. Used for numerical analysis.
 * @returns {number}
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
 * @method
 * Returns relative error between [this] and [correct]
 * @param correct {Matrix4}
 */
Matrix4.prototype.relativeError = function(correct) {
    var diff = correct.subbed(this);
    var correct_norm = correct.infinityNorm();
    var diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
};

/**
 * @method
 * Returns absolute error between [this] and [correct]
 * @param correct
 * @returns {number}
 */
Matrix4.prototype.absoluteError = function(correct) {
    var this_norm = this.infinityNorm();
    var correct_norm = correct.infinityNorm();
    var diff_norm = Math.abs(this_norm - correct_norm);
    return diff_norm;
};


/**
 * @method
 * Returns the translation vector from this homogeneous transformation matrix.
 * @returns {Vector3}
 */
Matrix4.prototype.getTranslation = function() {
    var z = this.storage[14];
    var y = this.storage[13];
    var x = this.storage[12];
    return new Vector3(x, y, z);
};

/**
 * @method
 * Sets the translation vector in this homogeneous transformation matrix.
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
 * @method
 * Returns the rotation matrix from this homogeneous transformation matrix.
 * @returns {Matrix3}
 */
Matrix4.prototype.getRotation = function() {
    var r = Matrix3.zero();
    this.copyRotation(r);
    return r;
};

/**
 * @method
 * Copies the rotation matrix from this homogeneous transformation matrix into [rotation].
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
 * @method
 * Sets the rotation matrix in this homogeneous transformation matrix.
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
 * @method
 * Returns the normal matrix from this homogeneous transformation matrix. The normal
 * matrix is the transpose of the inverse of the top-left 3x3 part of this 4x4 matrix.
 * @returns {Matrix3}
 */
Matrix4.prototype.getNormalMatrix = function() {
    var m = Matrix3.identity();
    m.copyNormalMatrix(this);
    return m;
};


/**
 * @method
 * Returns the max scale value of the 3 axes.
 * @returns {number}
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
 * @method
 * Transposes just the upper 3x3 rotation matrix.
 * @returns {Matrix4}
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
 * @method
 * Invert [this].
 */
Matrix4.prototype.invert = function() {
    this.copyInverse(this);
};

/**
 * @method
 * Set this matrix to be the inverse of [arg]
 * @param arg {Matrix4}
 * @returns {number}
 */
Matrix4.prototype.copyInverse = function(arg) {
    var argStorage = arg.storage;
    var a00 = argStorage[0];
    var a01 = argStorage[1];
    var a02 = argStorage[2];
    var a03 = argStorage[3];
    var a10 = argStorage[4];
    var a11 = argStorage[5];
    var a12 = argStorage[6];
    var a13 = argStorage[7];
    var a20 = argStorage[8];
    var a21 = argStorage[9];
    var a22 = argStorage[10];
    var a23 = argStorage[11];
    var a30 = argStorage[12];
    var a31 = argStorage[13];
    var a32 = argStorage[14];
    var a33 = argStorage[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det =
        (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    if (det == 0.0) {
        this.setFrom(arg);
        return 0.0;
    }
    var invDet = 1.0 / det;
    this.storage[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    this.storage[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    this.storage[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    this.storage[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    this.storage[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    this.storage[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    this.storage[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    this.storage[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    this.storage[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    this.storage[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    this.storage[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    this.storage[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    this.storage[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    this.storage[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    this.storage[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    this.storage[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    return det;
};

/**
 * @method
 * @returns {number}
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
 * @method
 * Sets the upper 3x3 to a rotation of [radians] around X
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
 * @method
 * Sets the upper 3x3 to a rotation of [radians] around Y
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
 * @method
 * Sets the upper 3x3 to a rotation of [radians] around Z
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
 * @method
 * Converts into Adjugate matrix and scales by [scale]
 * @param scale {number}
 * @returns {Matrix4}
 */
Matrix4.prototype.scaleAdjoint = function(scale) {
    // Adapted from code by Richard Carling.
    var a1 = this.storage[0];
    var b1 = this.storage[4];
    var c1 = this.storage[8];
    var d1 = this.storage[12];
    var a2 = this.storage[1];
    var b2 = this.storage[5];
    var c2 = this.storage[9];
    var d2 = this.storage[13];
    var a3 = this.storage[2];
    var b3 = this.storage[6];
    var c3 = this.storage[10];
    var d3 = this.storage[14];
    var a4 = this.storage[3];
    var b4 = this.storage[7];
    var c4 = this.storage[11];
    var d4 = this.storage[15];
    this.storage[0] = (b2 * (c3 * d4 - c4 * d3) -
    c2 * (b3 * d4 - b4 * d3) +
    d2 * (b3 * c4 - b4 * c3)) *
    scale;
    this.storage[1] = -(a2 * (c3 * d4 - c4 * d3) -
    c2 * (a3 * d4 - a4 * d3) +
    d2 * (a3 * c4 - a4 * c3)) *
    scale;
    this.storage[2] = (a2 * (b3 * d4 - b4 * d3) -
    b2 * (a3 * d4 - a4 * d3) +
    d2 * (a3 * b4 - a4 * b3)) *
    scale;
    this.storage[3] = -(a2 * (b3 * c4 - b4 * c3) -
    b2 * (a3 * c4 - a4 * c3) +
    c2 * (a3 * b4 - a4 * b3)) *
    scale;
    this.storage[4] = -(b1 * (c3 * d4 - c4 * d3) -
    c1 * (b3 * d4 - b4 * d3) +
    d1 * (b3 * c4 - b4 * c3)) *
    scale;
    this.storage[5] = (a1 * (c3 * d4 - c4 * d3) -
    c1 * (a3 * d4 - a4 * d3) +
    d1 * (a3 * c4 - a4 * c3)) *
    scale;
    this.storage[6] = -(a1 * (b3 * d4 - b4 * d3) -
    b1 * (a3 * d4 - a4 * d3) +
    d1 * (a3 * b4 - a4 * b3)) *
    scale;
    this.storage[7] = (a1 * (b3 * c4 - b4 * c3) -
    b1 * (a3 * c4 - a4 * c3) +
    c1 * (a3 * b4 - a4 * b3)) *
    scale;
    this.storage[8] = (b1 * (c2 * d4 - c4 * d2) -
    c1 * (b2 * d4 - b4 * d2) +
    d1 * (b2 * c4 - b4 * c2)) *
    scale;
    this.storage[9] = -(a1 * (c2 * d4 - c4 * d2) -
    c1 * (a2 * d4 - a4 * d2) +
    d1 * (a2 * c4 - a4 * c2)) *
    scale;
    this.storage[10] = (a1 * (b2 * d4 - b4 * d2) -
    b1 * (a2 * d4 - a4 * d2) +
    d1 * (a2 * b4 - a4 * b2)) *
    scale;
    this.storage[11] = -(a1 * (b2 * c4 - b4 * c2) -
    b1 * (a2 * c4 - a4 * c2) +
    c1 * (a2 * b4 - a4 * b2)) *
    scale;
    this.storage[12] = -(b1 * (c2 * d3 - c3 * d2) -
    c1 * (b2 * d3 - b3 * d2) +
    d1 * (b2 * c3 - b3 * c2)) *
    scale;
    this.storage[13] = (a1 * (c2 * d3 - c3 * d2) -
    c1 * (a2 * d3 - a3 * d2) +
    d1 * (a2 * c3 - a3 * c2)) *
    scale;
    this.storage[14] = -(a1 * (b2 * d3 - b3 * d2) -
    b1 * (a2 * d3 - a3 * d2) +
    d1 * (a2 * b3 - a3 * b2)) *
    scale;
    this.storage[15] = (a1 * (b2 * c3 - b3 * c2) -
    b1 * (a2 * c3 - a3 * c2) +
    c1 * (a2 * b3 - a3 * b2)) *
    scale;
    return this;
};

/**
 * @method
 * /// Rotates [arg] by the absolute rotation of [this]
 * /// Returns [arg].
 * /// Primarily used by AABB transformation code.
 * @param arg {Vector3}
 * @returns {Vector3}
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
 * @method
 * /// Add [o] to [this].
 * @param o {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.prototype.add = function(o) {
    var oStorage = o.storage;
    this.storage[0] = this.storage[0] + oStorage[0];
    this.storage[1] = this.storage[1] + oStorage[1];
    this.storage[2] = this.storage[2] + oStorage[2];
    this.storage[3] = this.storage[3] + oStorage[3];
    this.storage[4] = this.storage[4] + oStorage[4];
    this.storage[5] = this.storage[5] + oStorage[5];
    this.storage[6] = this.storage[6] + oStorage[6];
    this.storage[7] = this.storage[7] + oStorage[7];
    this.storage[8] = this.storage[8] + oStorage[8];
    this.storage[9] = this.storage[9] + oStorage[9];
    this.storage[10] = this.storage[10] + oStorage[10];
    this.storage[11] = this.storage[11] + oStorage[11];
    this.storage[12] = this.storage[12] + oStorage[12];
    this.storage[13] = this.storage[13] + oStorage[13];
    this.storage[14] = this.storage[14] + oStorage[14];
    this.storage[15] = this.storage[15] + oStorage[15];
    return this;
};

/**
 * @method
 * /// Subtract [o] from [this].
 * @param o {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.prototype.sub = function(o) {
    var oStorage = o.storage;
    this.storage[0] = this.storage[0] - oStorage[0];
    this.storage[1] = this.storage[1] - oStorage[1];
    this.storage[2] = this.storage[2] - oStorage[2];
    this.storage[3] = this.storage[3] - oStorage[3];
    this.storage[4] = this.storage[4] - oStorage[4];
    this.storage[5] = this.storage[5] - oStorage[5];
    this.storage[6] = this.storage[6] - oStorage[6];
    this.storage[7] = this.storage[7] - oStorage[7];
    this.storage[8] = this.storage[8] - oStorage[8];
    this.storage[9] = this.storage[9] - oStorage[9];
    this.storage[10] = this.storage[10] - oStorage[10];
    this.storage[11] = this.storage[11] - oStorage[11];
    this.storage[12] = this.storage[12] - oStorage[12];
    this.storage[13] = this.storage[13] - oStorage[13];
    this.storage[14] = this.storage[14] - oStorage[14];
    this.storage[15] = this.storage[15] - oStorage[15];
    return this;
};

/**
 * @method
 * /// Negate [this].
 * @returns {Matrix4}
 */
Matrix4.prototype.negate = function() {
    this.storage[0] = -this.storage[0];
    this.storage[1] = -this.storage[1];
    this.storage[2] = -this.storage[2];
    this.storage[3] = -this.storage[3];
    this.storage[4] = -this.storage[4];
    this.storage[5] = -this.storage[5];
    this.storage[6] = -this.storage[6];
    this.storage[7] = -this.storage[7];
    this.storage[8] = -this.storage[8];
    this.storage[9] = -this.storage[9];
    this.storage[10] = -this.storage[10];
    this.storage[11] = -this.storage[11];
    this.storage[12] = -this.storage[12];
    this.storage[13] = -this.storage[13];
    this.storage[14] = -this.storage[14];
    this.storage[15] = -this.storage[15];
    return this;
};


/**
 * @method
 * Multiply [this] by [arg].
 * @param arg {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.prototype.multiply = function(arg) {
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
    this.storage[0] = (m00 * n00) + (m01 * n10) + (m02 * n20) + (m03 * n30);
    this.storage[4] = (m00 * n01) + (m01 * n11) + (m02 * n21) + (m03 * n31);
    this.storage[8] = (m00 * n02) + (m01 * n12) + (m02 * n22) + (m03 * n32);
    this.storage[12] = (m00 * n03) + (m01 * n13) + (m02 * n23) + (m03 * n33);
    this.storage[1] = (m10 * n00) + (m11 * n10) + (m12 * n20) + (m13 * n30);
    this.storage[5] = (m10 * n01) + (m11 * n11) + (m12 * n21) + (m13 * n31);
    this.storage[9] = (m10 * n02) + (m11 * n12) + (m12 * n22) + (m13 * n32);
    this.storage[13] = (m10 * n03) + (m11 * n13) + (m12 * n23) + (m13 * n33);
    this.storage[2] = (m20 * n00) + (m21 * n10) + (m22 * n20) + (m23 * n30);
    this.storage[6] = (m20 * n01) + (m21 * n11) + (m22 * n21) + (m23 * n31);
    this.storage[10] = (m20 * n02) + (m21 * n12) + (m22 * n22) + (m23 * n32);
    this.storage[14] = (m20 * n03) + (m21 * n13) + (m22 * n23) + (m23 * n33);
    this.storage[3] = (m30 * n00) + (m31 * n10) + (m32 * n20) + (m33 * n30);
    this.storage[7] = (m30 * n01) + (m31 * n11) + (m32 * n21) + (m33 * n31);
    this.storage[11] = (m30 * n02) + (m31 * n12) + (m32 * n22) + (m33 * n32);
    this.storage[15] = (m30 * n03) + (m31 * n13) + (m32 * n23) + (m33 * n33);
    return this;
};

/**
 * @method
 * Create a copy of [this] and multiply it by [arg].
 * @param arg {Matrix4}
 * @returns {Matrix4}
 */
Matrix4.prototype.multiplied = function(arg) {
    var m = this.clone();
    m.multiply(arg);
    return m;
};


/**
 * @method
 * Multiply a transposed [this] with [arg].
 * @param arg {Matrix4}
 * @returns {Matrix4}
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
 * @method
 * Multiply [this] with a transposed [arg].
 * @param arg
 * @returns {Matrix4}
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
 * Decomposes [this] into [translation], [rotation] and [scale] components.
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
 * @method
 * Rotate [arg] of type [Vector3] using the rotation defined by [this].
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
 * @method
 * Rotate a copy of [arg] of type [Vector3] using the rotation defined by [this].
 * @param arg {Vector3}
 * @returns {Vector3}
 */
Matrix4.prototype.rotated3 = function(arg) {
    var out = Vector3.copy(arg);
    return this.rotate3(out);
};

/**
 * Transform [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @returns {Vector3}
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
 * Transform a copy of [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @returns {Vector3}
 */
Matrix4.prototype.transformed3 = function(arg) {
    var out = Vector3.copy(arg);
    return this.transform3(out);
};

/**
 * @method
 * Transform [arg] of type [Vector4] using the transformation defined by [this].
 * @param arg {Vector4}
 * @returns {Vector4}
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
 * @method
 * Transform [arg] of type [Vector3] using the perspective transformation defined by [this].
 * @param arg {Vector3}
 * @returns {Vector3}
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
 * @method
 * Transform a copy of [arg] of type [Vector4] using the transformation defined by [this].
 * @param arg
 * @returns {Vector4}
 */
Matrix4.prototype.transformed = function(arg) {
    var out = Vector4.copy(arg);
    return this.transform(out);
};

/**
 * @method
 * Copies [this] into [array] starting at [offset].
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
 * @method
 * Copies elements from [array] into [this] starting at [offset].
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
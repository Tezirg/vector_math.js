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
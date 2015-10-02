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

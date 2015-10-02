/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix2;

var Vector2 = require('./vector2.js');

/**
 * @class Matrix2
 * @description 2D Matrix. Values are stored in column major order.
 * @param m00 {number}
 * @param m01 {number}
 * @param m11 {number}
 * @param m12 {number}
 * @constructor
 */
function Matrix2(m00, m01, m11, m12) {
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([m00, m01, m11, m12]);

    /**
     * @property dimension
     * @type {number}
     */
    this.dimension = 2;
}

/**
 * @static fromFloat32Array
 * @description Constructs Matrix2 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Matrix2}
 */
Matrix2.fromFloat32Array = function(array) {
    var m = Matrix2.zero();
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
Matrix2.fromBuffer = function(buffer, offset) {
    var m = Matrix2.zero();
    m.storage = new Float32Array(buffer, offset, 4);
    return m.clone();
};

/**
 * @static solve
 * @description Solve [A] * [x] = [b].
 * @param A {Matrix2}
 * @param x {Vector2}
 * @param b {Vector2}
 */
Matrix2.solve = function(A, x, b) {
    var a11 = A.entry(0, 0);
    var a12 = A.entry(0, 1);
    var a21 = A.entry(1, 0);
    var a22 = A.entry(1, 1);
    var bx = b.x;
    var by = b.y;
    var det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
        det = 1.0 / det;
    }

    x.x = det * (a22 * bx - a12 * by);
    x.y = det * (a11 * by - a21 * bx);
};

/**
 * @description Return index in storage for [row], [col] value.
 * @method index
 * @param row
 * @param col
 */
Matrix2.prototype.index = function(row, col) {
    return (col * 2) + row;
};


/**
 * @method entry
 * @description Value at [row], [col].
 * @param row {Number}
 * @param col {Number}
 * @return {Number | null}
 */
Matrix2.prototype.entry = function(row, col) {
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
Matrix2.prototype.setEntry = function(row, col, v) {
    if (((row >= 0) && (row < this.dimension)) == false) {
        return null;
    }
    if (((col >= 0) && (col <  this.dimension)) == false) {
        return null;
    }

    this.storage[this.index(row, col)] = v;
};

/**
 * @description Zero matrix.
 * @static zero
 * @return {Matrix2}
 */
Matrix2.zero = function() {
    var m = new Matrix2(0.0, 0.0, 0.0, 0.0);
    return m;
};

/**
 * @static identity
 * @description Identity matrix.
 * @return {Matrix2}
 */
Matrix2.identity = function() {
    var m = Matrix2.zero();
    m.setIdentity();
    return m;
};

/**
 * @static copy
 * @description Copies values from [other].
 * @param other {Matrix2}
 * @return {Matrix2}
 */
Matrix2.copy = function(other) {
    m = Matrix2.zero();
    m.setFrom(other);
    return m;
};


/**
 * @static columns
 * @description Matrix with values from column arguments.
 * @param arg0 {Vector2}
 * @param arg1 {Vector2}
 * @return {Matrix2}
 */
Matrix2.columns = function(arg0, arg1) {
    var m = Matrix2.zero();
    m.setColumns(arg0, arg1);
    return m;
};


/**
 * @static outer
 * @description Outer product of [u] and [v].
 * @param u {Vector2}
 * @param v {Vector2}
 * @return {Matrix2}
 */
Matrix2.outer = function(u, v) {
    var m = Matrix2.zero();
    m.setOuter(u, v);
    return m;
};


/**
 * @static rotation
 * @description Rotation of [radians].
 * @param radians {Number}
 * @return {Matrix2}
 */
Matrix2.rotation = function(radians) {
    var m = Matrix2.zero();
    m.setRotation(radians);
    return m;
};


/**
 * @method setValues
 * @description Sets the matrix with specified values.
 * @param arg0 {Number}
 * @param arg1 {Number}
 * @param arg2 {Number}
 * @param arg3 {Number}
 * @return {Matrix2}
 */
Matrix2.prototype.setValues = function(arg0, arg1, arg2, arg3) {
    this.storage[3] = arg3;
    this.storage[2] = arg2;
    this.storage[1] = arg1;
    this.storage[0] = arg0;
    return this;
};


/**
 * @method setColumns
 * @description Sets the entire matrix to the column values.
 * @param arg0 {Vector2}
 * @param arg1 {Vector2}
 * @returns {Matrix2}
 */
Matrix2.prototype.setColumns = function(arg0, arg1) {
    var arg0Storage = arg0.storage;
    var arg1Storage = arg1.storage;
    this.storage[0] = arg0Storage[0];
    this.storage[1] = arg0Storage[1];
    this.storage[2] = arg1Storage[0];
    this.storage[3] = arg1Storage[1];
    return this;
};


/**
 * @method setFrom
 * @description Sets the entire matrix to the matrix in [arg].
 * @param arg {Matrix2}
 * @returns {Matrix2}
 */
Matrix2.prototype.setFrom = function(arg) {
    this.storage[3] = arg.storage[3];
    this.storage[2] = arg.storage[2];
    this.storage[1] = arg.storage[1];
    this.storage[0] = arg.storage[0];
    return this;
};

/**
 * @method setOuter
 * @description  Set [this] to the outer product of [u] and [v].
 * @param u {Vector2}
 * @param v {Vector2}
 * @return {Matrix2}
 */
Matrix2.prototype.setOuter = function(u, v) {
    var uStorage = u.storage;
    var vStorage = v.storage;
    this.storage[0] = uStorage[0] * vStorage[0];
    this.storage[1] = uStorage[0] * vStorage[1];
    this.storage[2] = uStorage[1] * vStorage[0];
    this.storage[3] = uStorage[1] * vStorage[1];
    return this;
};


/**
 * @method splatDiagonal
 * @description Sets the diagonal to [arg].
 * @param arg {Number}
 * @return {Matrix2}
 */
Matrix2.prototype.splatDiagonal = function(arg) {
    this.storage[0] = arg;
    this.storage[3] = arg;
    return this;
};


/**
 * @method setDiagonal
 * @description Sets the diagonal of the matrix to be [arg].
 * @param arg {Vector2}
 * @return {Matrix2}
 */
Matrix2.prototype.setDiagonal = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = argStorage[0];
    this.storage[3] = argStorage[1];
    return this;
};


/**
 * @method toString
 * @description Printable string
 * @return {string}
 */
Matrix2.prototype.toString = function() {
    return '[0] '+ this.getRow(0).toString() + '\n[1] ' + this.getRow(1).toString() + '}\n';
};


/**
 * @method getAt
 * @description Access the element of the matrix at the index [i].
 * @param i {number}
 * @return {Number}
 */
Matrix2.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * @method setAt
 * @description Set the element of the matrix at the index [i].
 * @param i {number}
 * @param v {number}
 */
Matrix2.prototype.setAt = function(i, v) {
    this.storage[i] = v;
};

/**
 * @method equals
 * @description Check if two matrices are the same.
 * @param other {Matrix2}
 * @return {boolean}
 */
Matrix2.prototype.equals = function(other) {
    if (other.dimension == null || other.dimension != 2) {
        return false;
    }
    return (this.storage[0] == other.storage[0]) &&
           (this.storage[1] == other.storage[1]) &&
           (this.storage[2] == other.storage[2]) &&
           (this.storage[3] == other.storage[3]);
};

/**
 * @method almostEquals
 * @description Check if two matrices are almost the same.
 * @param other {Matrix2}
 * @param precision {number}
 * @return {boolean}
 */
Matrix2.prototype.almostEquals = function(other, precision) {
    if (other.dimension == null || other.dimension != 2) {
        return false;
    }
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if ((Math.abs(this.storage[0] - other.storage[0]) > precision) ||
        (Math.abs(this.storage[1] - other.storage[1]) > precision) ||
        (Math.abs(this.storage[2] - other.storage[2]) > precision) ||
        (Math.abs(this.storage[3] - other.storage[3]) > precision)) {
        return false;
    }
    return true;
};


/**
 * @property
 * row 0
 * @type {Vector2}
 */
Matrix2.prototype.__defineGetter__("row0", function() {
    return this.getRow(0);
});
Matrix2.prototype.__defineSetter__("row0", function(v) {
    this.setRow(0, v);
});

/**
 * @property
 * row 1
 * @type {Vector2}
 */
Matrix2.prototype.__defineGetter__("row1", function() {
    return this.getRow(1);
});
Matrix2.prototype.__defineSetter__("row1", function(v) {
    this.setRow(1, v);
});


/**
 * @method setRow
 * @description Sets [row] of the matrix to values in [arg]
 * @param row {Number}
 * @param arg {Vector2}
 */
Matrix2.prototype.setRow = function(row, arg) {
    argStorage = arg.storage;
    this.storage[this.index(row, 0)] = argStorage[0];
    this.storage[this.index(row, 1)] = argStorage[1];
};

/**
 * @method get Row
 * @description  Gets the [row] of the matrix
 * @param row {Number}
 * @return {Vector2}
 */
Matrix2.prototype.getRow = function(row) {
    var r = Vector2.zero();
    rStorage = r.storage;
    rStorage[0] = this.storage[this.index(row, 0)];
    rStorage[1] = this.storage[this.index(row, 1)];
    return r;
};

/**
 * @method setColumn
 * @description Assigns the [column] of the matrix [arg]
 * @param column {Number}
 * @param arg {Vector2}
 */
Matrix2.prototype.setColumn = function(column, arg) {
    argStorage = arg.storage;
    entry = column * 2;
    this.storage[entry + 1] = argStorage[1];
    this.storage[entry + 0] = argStorage[0];
};

/**
 * @method getColumn
 * @description Gets the [column] of the matrix
 * @param column {Number}
 * @return {Vector2}
 */
Matrix2.prototype.getColumn = function(column) {
    var r = Vector2.zero();
    entry = column * 2;
    var rStorage = r.storage;
    rStorage[1] = this.storage[entry + 1];
    rStorage[0] = this.storage[entry + 0];
    return r;
};

/**
 * @method clone
 * @description Create a copy of [this].
 * @return {Matrix2}
 */
Matrix2.prototype.clone = function() {
    return Matrix2.copy(this);
};

/**
 * @method copyInto
 * @description Copy [this] into [arg].
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.copyInto = function(arg) {
    var argStorage = arg.storage;
    argStorage[0] = this.storage[0];
    argStorage[1] = this.storage[1];
    argStorage[2] = this.storage[2];
    argStorage[3] = this.storage[3];
    return arg;
};

/**
 * @method mult
 * @description Returns a new vector or matrix by multiplying [this] with [arg].
 * @param arg
 * @return {*}
 */
Matrix2.prototype.mult = function(arg) {

    if (typeof arg == "Number") {
        return this.scaled(arg);
    }
    if (arg instanceof Vector2) {
        return this.transformed(arg);
    }
    if (arg.dimension == 2) {
        return this.multiplied(arg);
    }
    return null;
};

/**
 * @method added
 * @description Returns new matrix after component wise [this] + [arg]
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.added = function(arg) {
    var m = this.clone();
    m.add(arg);
    return m;
};

/**
 * @method subbed
 * @description Returns new matrix after component wise [this] - [arg]
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.subbed = function(arg) {
    var m = this.clone();
    m.sub(arg);
    return m;
};

/**
 * @method negated
 * @description Returns new matrix after negating [this]
 * @return {Matrix2}
 */
Matrix2.prototype.negated = function() {
    var m = this.clone();
    m.negate();
    return m;
};

/**
 * @method setZero
 * @description Zeros [this].
 * @return {Matrix2}
 */
Matrix2.prototype.setZero = function()  {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    return this;
};

/**
 * @method setIdentity
 * @description Makes [this] into the identity matrix.
 * @return {Matrix2}
 */
Matrix2.prototype.setIdentity = function () {
    this.storage[0] = 1.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 1.0;
    return this;
};

/**
 * @method transposed
 * @description Returns the tranpose of this.
 * @return {Matrix2}
 */
Matrix2.prototype.transposed = function() {
    var m = this.clone();
    m.transpose();
    return m;
};


/**
 * @method transpose
 * @description Transpose [this]
 * @return {Matrix2}
 */
Matrix2.prototype.transpose = function() {
    var temp = this.storage[2];
    this.storage[2] = this.storage[1];
    this.storage[1] = temp;
    return this;
};

/**
 * @method absolute
 * @description Returns the component wise absolute value copy of this.
 * @return {Matrix2}
 */
Matrix2.prototype.absolute = function() {
    var r = Matrix2.zero();
    var rStorage = r.storage;
    rStorage[0] = Math.abs(this.storage[0]);
    rStorage[1] = Math.abs(this.storage[1]);
    rStorage[2] = Math.abs(this.storage[2]);
    rStorage[3] = Math.abs(this.storage[3]);
    return r;
};

/**
 * @method determinant
 * @description  Returns the determinant of this matrix.
 * @return {number}
 */
Matrix2.prototype.determinant = function() {
    return (this.storage[0] * this.storage[3] - this.storage[1] * this.storage[2]);
};

/**
 * @method dotRow
 * @description  Returns the dot product of row [i] and [v].
 * @param i {Number}
 * @param v {Vector2}
 * @return {number}
 */
Matrix2.prototype.dotRow = function(i, v) {
    vStorage = v.storage;
    return this.storage[i] * vStorage[0] + this.storage[2 + i] * vStorage[1];
};

/**
 * @method dotColumn
 * @description Returns the dot product of column [j] and [v].
 * @param j {number}
 * @param v {Vector2}
 * @return {number}
 */
Matrix2.prototype.dotColumn = function(j, v) {
    vStorage = v.storage;
    return this.storage[j * 2] * vStorage[0] +
        this.storage[(j * 2) + 1] * vStorage[1];
};

/**
 * @method trace
 * @description Trace of the matrix.
 * @return {number}
 */
Matrix2.prototype.trace = function() {
    t = 0.0;
    t += this.storage[0];
    t += this.storage[3];
    return t;
};

/**
 * @method infinityNorm
 * @description Returns infinity norm of the matrix. Used for numerical analysis.
 * @return {number}
 */
Matrix2.prototype.infinityNorm = function() {
    norm = 0.0;
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[0]);
        row_norm += Math.abs(this.storage[1]);
        norm = row_norm > norm ? row_norm : norm;
    }
    {
        row_norm = 0.0;
        row_norm += Math.abs(this.storage[2]);
        row_norm += Math.abs(this.storage[3]);
        norm = row_norm > norm ? row_norm : norm;
    }
    return norm;
};

/**
 * @method relativeError
 * @description Returns relative error between [this] and [correct]
 * @param correct
 * @return {number}
 */
Matrix2.prototype.relativeError = function(correct) {
    diff = correct.subbed(this);
    correct_norm = correct.infinityNorm();
    diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
};

/**
 * @method absoluteError
 * @description Returns absolute error between [this] and [correct]
 * @param correct {Matrix2}
 * @return {number|*}
 */
Matrix2.prototype.absoluteError = function(correct) {
    this_norm = this.infinityNorm();
    correct_norm = correct.infinityNorm();
    diff_norm = Math.abs(this_norm - correct_norm);
    return diff_norm;
};

/**
 * @method invert
 * @description Invert the matrix. Returns the determinant.
 * @return {number}
 */
Matrix2.prototype.invert = function () {
    det = this.determinant();
    if (det == 0.0) {
        return 0.0;
    }
    invDet = 1.0 / det;
    var temp = this.storage[0];
    this.storage[0] = this.storage[3] * invDet;
    this.storage[1] = -this.storage[1] * invDet;
    this.storage[2] = -this.storage[2] * invDet;
    this.storage[3] = temp * invDet;
    return det;
};

/**
 * @method copyInverse
 * @description Set this matrix to be the inverse of [arg]
 * @param arg {Matrix2}
 * @return {number} determinant
 */
Matrix2.prototype.copyInverse = function(arg) {
    det = arg.determinant();
    if (det == 0.0) {
        this.setFrom(arg);
        return 0.0;
    }
    invDet = 1.0 / det;
    argStorage = arg.storage;
    this.storage[0] = argStorage[3] * invDet;
    this.storage[1] = -argStorage[1] * invDet;
    this.storage[2] = -argStorage[2] * invDet;
    this.storage[3] = argStorage[0] * invDet;
    return det;
};

/**
 * @method setRotation
 * @description Turns the matrix  o a rotation of [radians]
 * @param radians {number}
 */
Matrix2.prototype.setRotation = function(radians) {
    c = Math.cos(radians);
    s = Math.sin(radians);
    this.storage[0] = c;
    this.storage[1] = s;
    this.storage[2] = -s;
    this.storage[3] = c;
};

/**
 * @method scaleAdjoint
 * @description Converts  into Adjugate matrix and scales by [scale]
 * @param scale {number}
 * @return {Matrix2} this
 */
Matrix2.prototype.scaleAdjoint = function(scale) {
    var temp = this.storage[0];
    this.storage[0] = this.storage[3] * scale;
    this.storage[2] = -this.storage[2] * scale;
    this.storage[1] = -this.storage[1] * scale;
    this.storage[3] = temp * scale;
    return this;
};

/**
 * @method scale
 * @description Scale [this] by [scale].
 * @param scale {number}
 * @return {Matrix2} this
 */
Matrix2.prototype.scale = function(scale) {
    this.storage[0] = this.storage[0] * scale;
    this.storage[1] = this.storage[1] * scale;
    this.storage[2] = this.storage[2] * scale;
    this.storage[3] = this.storage[3] * scale;
    return this;
};

/**
 * @method scaled
 * @description Create a copy of [this] scaled by [scale].
 * @param scale {number}
 * @return {Matrix2} copy
 */
Matrix2.prototype.scaled = function(scale) {
    var m = this.clone();
    m.scale(scale);
    return m;
};

/**
 * @method add
 * @description Add [o] to [this].
 * @param o {Matrix2}
 * @return {Matrix2} this
 */
Matrix2.prototype.add = function(o) {
    oStorage = o.storage;
    this.storage[0] = this.storage[0] + oStorage[0];
    this.storage[1] = this.storage[1] + oStorage[1];
    this.storage[2] = this.storage[2] + oStorage[2];
    this.storage[3] = this.storage[3] + oStorage[3];
    return this;
};

/**
 * @method sub
 * @description Subtract [o] from [this].
 * @param o {Matrix2}
 * @return {Matrix2} this
 */
Matrix2.prototype.sub = function(o) {
    oStorage = o.storage;
    this.storage[0] = this.storage[0] - oStorage[0];
    this.storage[1] = this.storage[1] - oStorage[1];
    this.storage[2] = this.storage[2] - oStorage[2];
    this.storage[3] = this.storage[3] - oStorage[3];
    return this;
};

/**
 * @method negate
 * @description Negate [this].
 * @return {Matrix2} this
 */
Matrix2.prototype.negate = function() {
    this.storage[0] = -this.storage[0];
    this.storage[1] = -this.storage[1];
    this.storage[2] = -this.storage[2];
    this.storage[3] = -this.storage[3];
    return this;
};

/**
 * @method multiply
 * @description Multiply [this] with [arg] and store it in [this].
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.multiply = function(arg) {
    m00 = this.storage[0];
    m01 = this.storage[2];
    m10 = this.storage[1];
    m11 = this.storage[3];
    argStorage = arg.storage;
    n00 = argStorage[0];
    n01 = argStorage[2];
    n10 = argStorage[1];
    n11 = argStorage[3];
    this.storage[0] = (m00 * n00) + (m01 * n10);
    this.storage[2] = (m00 * n01) + (m01 * n11);
    this.storage[1] = (m10 * n00) + (m11 * n10);
    this.storage[3] = (m10 * n01) + (m11 * n11);
    return this;
};

/**
 * @method multiplied
 * @description Multiply [this] with [arg] and return the copy product.
 * @param arg {Matrix2}
 * @return {Matrix2} copy
 */
Matrix2.prototype.multiplied = function(arg) {
    var m  = this.clone();
    m.multiply(arg);
    return m;
};

/**
 * @method transposeMultiply
 * @description Multiply a transposed [this] with [arg].
 * @param arg {Matrix2}
 * @return {Matrix2} this
 */
Matrix2.prototype.transposeMultiply = function(arg) {
    m00 = this.storage[0];
    m01 = this.storage[1];
    m10 = this.storage[2];
    m11 = this.storage[3];
    argStorage = arg.storage;
    this.storage[0] = (m00 * argStorage[0]) + (m01 * argStorage[1]);
    this.storage[2] = (m00 * argStorage[2]) + (m01 * argStorage[3]);
    this.storage[1] = (m10 * argStorage[0]) + (m11 * argStorage[1]);
    this.storage[3] = (m10 * argStorage[2]) + (m11 * argStorage[3]);
    return this;
};

/**
 * @method multiplyTranspose
 * @description Multiply [this] with a transposed [arg].
 * @param arg {Matrix2}
 * @return {Matrix2}
 */
Matrix2.prototype.multiplyTranspose = function(arg) {
    m00 = this.storage[0];
    m01 = this.storage[2];
    m10 = this.storage[1];
    m11 = this.storage[3];
    argStorage = arg.storage;
    this.storage[0] = (m00 * argStorage[0]) + (m01 * argStorage[2]);
    this.storage[2] = (m00 * argStorage[1]) + (m01 * argStorage[3]);
    this.storage[1] = (m10 * argStorage[0]) + (m11 * argStorage[2]);
    this.storage[3] = (m10 * argStorage[1]) + (m11 * argStorage[3]);
    return this;
};

/**
 * @method transform
 * @description  Transform [arg] of type [Vector2] using the transformation defined by [this].
 * @param arg {Vector2}
 * @return {Vector2}
 */
Matrix2.prototype.transform = function(arg) {
    argStorage = arg.storage;
    var x = (this.storage[0] * argStorage[0]) + (this.storage[2] * argStorage[1]);
    var y = (this.storage[1] * argStorage[0]) + (this.storage[3] * argStorage[1]);
    argStorage[0] = x;
    argStorage[1] = y;
    return arg;
};

/**
 * @method transformed
 * @description Transform a copy of [arg] using the transformation defined by [this].
 * @param arg {Vector2}
 * @returns {Vector2}
 */
Matrix2.prototype.transformed = function(arg) {
    var out = Vector2.copy(arg);
    return this.transform(out);
};

/**
 * @method copyIntoArray
 * @description Copies [this]  into [array] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 */
Matrix2.prototype.copyIntoArray = function(array, offset) {
    var i = offset;
    if (offset === undefined) {
        i = 0;
    }
    array[i + 3] = this.storage[3];
    array[i + 2] = this.storage[2];
    array[i + 1] = this.storage[1];
    array[i + 0] = this.storage[0];
};

/**
 * @method copyFromArray
 * @description Copies elements from [array]  into [this] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 */
Matrix2.prototype.copyFromArray = function(array, offset) {
    var i = offset;
    if (offset === undefined) {
        i = 0;
    }
    this.storage[3] = array[i + 3];
    this.storage[2] = array[i + 2];
    this.storage[1] = array[i + 1];
    this.storage[0] = array[i + 0];
};

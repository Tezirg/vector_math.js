/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix2;

var Vector2 = require('./vector2.js');

/// 2D Matrix.
/// Values are stored in column major order.
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
 * @static
 * Solve [A] * [x] = [b].
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
 * Return index in storage for [row], [col] value.
 * @method index
 * @param row
 * @param col
 */
Matrix2.prototype.index = function(row, col) {
    return (col * 2) + row;
};


/**
 * Value at [row], [col].
 * @param row {Number}
 * @param col {Number}
 * @returns {Number} {null}
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
 * Set value at [row], [col] to be [v].
 * @param row {Number}
 * @param col {Number}
 * @param v {Number}
 * @returns {null}
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
 * Zero matrix.
 * @static
 * @returns {Matrix2}
 */
Matrix2.zero = function() {
    var m = new Matrix2(0.0, 0.0, 0.0, 0.0);
    return m;
};

/**
 * Identity matrix.
 * @static
 * @returns {Matrix2}
 */
Matrix2.identity = function() {
    var m = Matrix2.zero();
    m.setIdentity();
    return m;
};

/**
 * Copies values from [other].
 * @static
 * @param other {Matrix2}
 * @returns {Matrix2}
 */
Matrix2.copy = function(other) {
    m = Matrix2.zero();
    m.setFrom(other);
    return m;
};


/**
 * /// Matrix with values from column arguments.
 * @static
 * @param arg0 {Vector2}
 * @param arg1 {Vector2}
 * @returns {Matrix2}
 */
Matrix2.columns = function(arg0, arg1) {
    var m = Matrix2.zero();
    m.setColumns(arg0, arg1);
    return m;
};


/**
 * /// Outer product of [u] and [v].
 * @static
 * @param u {Vector2}
 * @param v {Vector2}
 * @returns {Matrix2}
 */
Matrix2.outer = function(u, v) {
    var m = Matrix2.zero();
    m.setOuter(u, v);
    return m;
};


/**
 * /// Rotation of [radians].
 * @param radians {Number}
 * @returns {Matrix2}
 */
Matrix2.rotation = function(radians) {
    var m = Matrix2.zero();
    m.setRotation(radians);
    return m;
};


/**
 * @method
 * /// Sets the matrix with specified values.
 * @param arg0 {Number}
 * @param arg1 {Number}
 * @param arg2 {Number}
 * @param arg3 {Number}
 * @returns {Matrix2}
 */
Matrix2.setValues = function(arg0, arg1, arg2, arg3) {
    this.storage[3] = arg3;
    this.storage[2] = arg2;
    this.storage[1] = arg1;
    this.storage[0] = arg0;
    return this;
};


/**
 * @method
 * /// Sets the entire matrix to the column values.
 * @param arg0 {Vector2}
 * @param arg1 {Vector2}
 * @returns {Matrix2}
 */
Matrix2.setColumns = function(arg0, arg1) {
    var arg0Storage = arg0.storage;
    var arg1Storage = arg1.storage;
    this.storage[0] = arg0Storage[0];
    this.storage[1] = arg0Storage[1];
    this.storage[2] = arg1Storage[0];
    this.storage[3] = arg1Storage[1];
    return this;
};


/**
 * @method
 * /// Sets the entire matrix to the matrix in [arg].
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
 * @method
 * /// Set [this] to the outer product of [u] and [v].
 * @param u {Vector2}
 * @param v {Vector2}
 * @returns {Matrix2}
 */
Matrix2.setOuter = function(u, v) {
    var uStorage = u.storage;
    var vStorage = v.storage;
    this.storage[0] = uStorage[0] * vStorage[0];
    this.storage[1] = uStorage[0] * vStorage[1];
    this.storage[2] = uStorage[1] * vStorage[0];
    this.storage[3] = uStorage[1] * vStorage[1];
    return this;
};


/**
 * @method
 * /// Sets the diagonal to [arg].
 * @param arg {Number}
 * @returns {Matrix2}
 */
Matrix2.splatDiagonal = function(arg) {
    this.storage[0] = arg;
    this.storage[3] = arg;
    return this;
};


/**
 * @method
 * /// Sets the diagonal of the matrix to be [arg].
 * @param arg {Vector2}
 * @returns {Matrix2}
 */
Matrix2.setDiagonal = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = argStorage[0];
    this.storage[3] = argStorage[1];
    return this;
};


/**
 * @method
 * Printable string
 * @returns {string}
 */
Matrix2.prototype.toString = function() {
    return '[0] '+ this.getRow(0).toString() + '\n[1] ' + this.getRow(1).toString() + '}\n';
};


/**
 * /// Access the element of the matrix at the index [i].
 * @method
 * @param i {number}
 * @returns {Number}
 */
Matrix2.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * /// Set the element of the matrix at the index [i].
 * @method
 * @param i {number}
 * @param v {number}
 */
Matrix2.prototype.setAt = function(i, v) {
    this.storage[i] = v;
};

/**
 * @method
 * /// Check if two matrices are the same.
 * @param other {Matrix2}
 * @returns {boolean}
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
 * @method
 * /// Check if two matrices are almost the same.
 * @param other {Matrix2}
 * @returns {boolean}
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
 * @returns {Vector2}
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
 * @returns {Vector2}
 */
Matrix2.prototype.__defineGetter__("row1", function() {
    return this.getRow(1);
});
Matrix2.prototype.__defineSetter__("row1", function(v) {
    this.setRow(1, v);
});


/**
 * @method
 * /// Sets [row] of the matrix to values in [arg]
 * @param row {Number}
 * @param arg {Vector2}
 */
Matrix2.prototype.setRow = function(row, arg) {
    argStorage = arg.storage;
    this.storage[this.index(row, 0)] = argStorage[0];
    this.storage[this.index(row, 1)] = argStorage[1];
};

/**
 * @method
 * /// Gets the [row] of the matrix
 * @param row {Number}
 * @returns {Vector2}
 */
Matrix2.prototype.getRow = function(row) {
    var r = Vector2.zero();
    rStorage = r.storage;
    rStorage[0] = this.storage[this.index(row, 0)];
    rStorage[1] = this.storage[this.index(row, 1)];
    return r;
};

/**
 * @method
 * /// Assigns the [column] of the matrix [arg]
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
 * @method
 * /// Gets the [column] of the matrix
 * @param column {Number}
 * @returns {Vector2}
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
 * /// Create a copy of [this].
 * @returns {Matrix2}
 */
Matrix2.prototype.clone = function() {
    return Matrix2.copy(this);
};

/**
 * /// Copy [this] into [arg].
 * @param arg {Matrix2}
 * @returns {Matrix2}
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
 * /// Returns a new vector or matrix by multiplying [this] with [arg].
 * @param arg
 * @returns {*}
 */
Matrix2.prototype.mult = function(arg) {

    if (typeof arg == "Number") {
        return this.scaled(arg);
    }
    if (typeof arg == "Vector2") {
        return this.transformed(arg);
    }
    if (arg.dimension == 2) {
        return this.multiplied(arg);
    }
    return null;
};

/**
 * @method
 * /// Returns new matrix after component wise [this] + [arg]
 * @param arg {Matrix2}
 * @returns {Matrix2}
 */
Matrix2.prototype.added = function(arg) {
    var m = this.clone();
    m.add(arg);
    return m;
};

/**
 * @method
 * /// Returns new matrix after component wise [this] - [arg]
 * @param arg {Matrix2}
 * @returns {Matrix2}
 */
Matrix2.prototype.subbed = function(arg) {
    var m = this.clone();
    m.sub(arg);
    return m;
};

/**
 * @method
 * /// Returns new matrix after negating [this]
 * @returns {Matrix2}
 */
Matrix2.prototype.negated = function() {
    var m = this.clone();
    m.negate();
    return m;
};

/**
 * @method
 * /// Zeros [this].
 * @returns {Matrix2}
 */
Matrix2.prototype.setZero = function()  {
    this.storage[0] = 0.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 0.0;
    return this;
};

/**
 * @method
 * /// Makes [this] into the identity matrix.
 * @returns {Matrix2}
 */
Matrix2.prototype.setIdentity = function () {
    this.storage[0] = 1.0;
    this.storage[1] = 0.0;
    this.storage[2] = 0.0;
    this.storage[3] = 1.0;
    return this;
};

/**
 * @method
 * /// Returns the tranpose of this.
 * @returns {Matrix2}
 */
Matrix2.prototype.transposed = function() {
    var m = this.clone();
    m.transpose();
    return m;
};


/**
 * @method
 * //Transpose [this]
 * @returns {Matrix2}
 */
Matrix2.prototype.transpose = function() {
    var temp = this.storage[2];
    this.storage[2] = this.storage[1];
    this.storage[1] = temp;
    return this;
};

/**
 * /// Returns the component wise absolute value copy of this.
 * @returns {Matrix2}
 */
Matrix2.prototype.absolute = function() {
    var r = Matrix2.zero();
    var rStorage = r.storage;
    rStorage[0] = this.storage[0].abs();
    rStorage[1] = this.storage[1].abs();
    rStorage[2] = this.storage[2].abs();
    rStorage[3] = this.storage[3].abs();
    return r;
};

/**
 * /// Returns the determinant of this matrix.
 * @returns {number}
 */
Matrix2.prototype.determinant = function() {
    return (this.storage[0] * this.storage[3] - this.storage[1] * this.storage[2]);
};

/**
 * @method
 * /// Returns the dot product of row [i] and [v].
 * @param i {Number}
 * @param v {Vector2}
 * @returns {number}
 */
Matrix2.prototype.dotRow = function(i, v) {
    vStorage = v.storage;
    return this.storage[i] * vStorage[0] + this.storage[2 + i] * vStorage[1];
};

/**
 * @method
 * /// Returns the dot product of column [j] and [v].
 * @param j {number}
 * @param v {number}
 * @returns {number}
 */
Matrix2.prototype.dotColumn = function(j, v) {
    vStorage = v.storage;
    return this.storage[j * 2] * vStorage[0] +
           this.storage[(j * 2) + 1] * vStorage[1];
};

/// Trace of the matrix.
Matrix2.prototype.trace = function() {
    t = 0.0;
    t += this.storage[0];
    t += this.storage[3];
    return t;
};

/// Returns infinity norm of the matrix. Used for numerical analysis.
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
        row_norm += this.storage[2].abs();
        row_norm += this.storage[3].abs();
        norm = row_norm > norm ? row_norm : norm;
    }
    return norm;
};

/// Returns relative error between [this] and [correct]
Matrix2.prototype.relativeError = function(correct) {
    diff = correct.subbed(this);
    correct_norm = correct.infinityNorm();
    diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
};

/**
 * /// Returns absolute error between [this] and [correct]
 * @param correct {Matrix2}
 * @returns {number|*}
 */
Matrix2.prototype.absoluteError = function(correct) {
    this_norm = this.infinityNorm();
    correct_norm = correct.infinityNorm();
    diff_norm = (this_norm - correct_norm).abs();
    return diff_norm;
};

/**
 * /// Invert the matrix. Returns the determinant.
 * @returns {*}
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
 * @method
 * /// Set this matrix to be the inverse of [arg]
 * @param arg {Matrix2}
 * @returns {number}
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
 * /// Turns the matrix  o a rotation of [radians]
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
 * /// Converts  into Adjugate matrix and scales by [scale]
 * @param scale {number}
 * @returns {Matrix2}
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
 * /// Scale [this] by [scale].
 * @param scale {number}
 * @returns {Matrix2}
 */
Matrix2.prototype.scale = function(scale) {
    this.storage[0] = this.storage[0] * scale;
    this.storage[1] = this.storage[1] * scale;
    this.storage[2] = this.storage[2] * scale;
    this.storage[3] = this.storage[3] * scale;
    return this;
};

/**
 * /// Create a copy of [this] scaled by [scale].
 * @param scale {number}
 * @returns {Matrix2}
 */
Matrix2.prototype.scaled = function(scale) {
    var m = this.clone();
    m.scale(scale);
    return m;
};

/**
 * /// Add [o] to [this].
 * @param o {Matrix2}
 * @returns {Matrix2}
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
 * /// Subtract [o] from [this].
 * @param o {Matrix2}
 * @returns {Matrix2}
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
 * /// Negate [this].
 * @returns {Matrix2}
 */
Matrix2.prototype.negate = function() {
    this.storage[0] = -this.storage[0];
    this.storage[1] = -this.storage[1];
    this.storage[2] = -this.storage[2];
    this.storage[3] = -this.storage[3];
    return this;
};

/**
 * /// Multiply [this] with [arg] and store it in [this].
 * @param arg {Matrix2}
 * @returns {Matrix2}
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
 * /// Multiply [this] with [arg] and return the copy product.
 * @param arg {Matrix2}
 * @returns {Matrix2}
 */
Matrix2.prototype.multiplied = function(arg) {
    var m  = this.clone();
    m.multiply(arg);
    return m;
};

/**
 * /// Multiply a transposed [this] with [arg].
 * @param arg {Matrix2}
 * @returns {Matrix2}
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
 * /// Multiply [this] with a transposed [arg].
 * @param arg {Matrix2}
 * @returns {Matrix2}
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
 * /// Transform [arg] of type [Vector2] using the transformation defined by [this].
 * @param arg {Vector2}
 * @returns {Vector2}
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
 * Transform a copy of [arg] using the transformation defined by [this].
 * @param arg {Vector2}
 * @returns {Vector2}
 */
Matrix2.prototype.transformed = function(arg) {
    var out = Vector2.copy(arg);
    return this.transform(out);
};

/**
 * /// Copies [this]  into [array] starting at [offset].
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
 * /// Copies elements from [array]  o [this] starting at [offset].
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

// Sun, 27 Sep 2015 14:41:43 GMT

/*
 * Copyright (c) 2015 vector_math.js
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&false)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vectormath=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports={
  "name": "vector_math.js",
  "version": "0.0.1",
  "author": "jean Grizet <jean.grizet@gmail.com>",
  "keywords": [
    "vector_math",
    "vector_math.js",
    "vector",
    "simd"
  ],
  "main": "src/vector_math.js",
  "devDependencies": {
    "jshint": "latest",
    "uglify-js": "latest",
    "nodeunit": "^0.9.0",
    "grunt": "~0.4.5",
    "grunt-contrib-jshint": "~0.1.1",
    "grunt-contrib-nodeunit": "^0.4.1",
    "grunt-contrib-concat": "~0.1.3",
    "grunt-contrib-uglify": "^0.5.1",
    "grunt-browserify": "^2.1.4",
    "browserify": "*"
  }
}

},{}],2:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix2;

var Vector2 = _dereq_('./vector2.js');

/**
 * @class Matrix2
 * /// 2D Matrix. Values are stored in column major order.
 * @param m00
 * @param m01
 * @param m11
 * @param m12
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
 * @static
 * /// Constructs Matrix2 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Matrix2}
 */
Matrix2.fromFloat32Array = function(array) {
    var m = Matrix2.zero();
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
Matrix2.fromBuffer = function(buffer, offset) {
    var m = Matrix2.zero();
    m.storage = new Float32Array(buffer, offset, 4);
    return m.clone();
};

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
Matrix2.prototype.setValues = function(arg0, arg1, arg2, arg3) {
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
 * @method
 * /// Sets the diagonal to [arg].
 * @param arg {Number}
 * @returns {Matrix2}
 */
Matrix2.prototype.splatDiagonal = function(arg) {
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
Matrix2.prototype.setDiagonal = function(arg) {
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
 * @param precision {number}
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
    if (arg instanceof Vector2) {
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
    rStorage[0] = Math.abs(this.storage[0]);
    rStorage[1] = Math.abs(this.storage[1]);
    rStorage[2] = Math.abs(this.storage[2]);
    rStorage[3] = Math.abs(this.storage[3]);
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
 * @param v {Vector2}
 * @returns {number}
 */
Matrix2.prototype.dotColumn = function(j, v) {
    vStorage = v.storage;
    return this.storage[j * 2] * vStorage[0] +
        this.storage[(j * 2) + 1] * vStorage[1];
};

/**
 * @method
 * /// Trace of the matrix.
 * @returns {number}
 */
Matrix2.prototype.trace = function() {
    t = 0.0;
    t += this.storage[0];
    t += this.storage[3];
    return t;
};

/**
 * @method
 * /// Returns infinity norm of the matrix. Used for numerical analysis.
 * @returns {number}
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
    diff_norm = Math.abs(this_norm - correct_norm);
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
 * /// Copies elements from [array]  into [this] starting at [offset].
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

},{"./vector2.js":10}],3:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix3;

var Vector2 = _dereq_('./vector2.js');
var Vector3 = _dereq_('./vector3.js');
var Matrix2 = _dereq_('./matrix2.js');
var Quaternion = _dereq_('./quaternion.js');


/**
 * @class Matrix3
 * /// 3D Matrix. Values are stored in column major order.
 * @param m00
 * @param m10
 * @param m20
 * @param m01
 * @param m11
 * @param m21
 * @param m02
 * @param m12
 * @param m22
 * @constructor
 */
function Matrix3(m00, m10, m20, m01, m11, m21, m02, m12, m22) {
    /**
     * @property storage
     * @type {Float32Array}
     */
    this.storage = new Float32Array([m00, m10, m20, m01, m11, m21, m02, m12, m22]);

    /**
     * @property dimension
     * @type {number}
     */
    this.dimension = 3;
}

/**
 * @static
 * /// Constructs Matrix3 with a given [Float32Array] as [storage].
 * @param array {Float32Array}
 * @return {Matrix4}
 */
Matrix3.fromFloat32Array = function(array) {
    var m = Matrix3.zero();
    m.storage = array;
    return m;
};

/**
 * @static
 * /// Constructs Matrix3 with a [storage] that views given [buffer] starting at
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
 * @static
 * Solve [A] * [x] = [b].
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
 * @static
 * Solve [A] * [x] = [b].
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
 * Return index in storage for [row], [col] value.
 * @method index
 * @param row
 * @param col
 */
Matrix3.prototype.index = function(row, col) {
    return (col * 3) + row;
};


/**
 * Value at [row], [col].
 * @param row {Number}
 * @param col {Number}
 * @returns {Number} {null}
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
 * Set value at [row], [col] to be [v].
 * @param row {Number}
 * @param col {Number}
 * @param v {Number}
 * @returns {null}
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
 * Zero matrix.
 * @static
 * @returns {Matrix3}
 */
Matrix3.zero = function() {
    var m = new Matrix3(0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0,
                        0.0, 0.0, 0.0);
    return m;
};

/**
 * Identity matrix.
 * @static
 * @returns {Matrix3}
 */
Matrix3.identity = function() {
    var m = Matrix3.zero();
    m.setIdentity();
    return m;
};

/**
 * Copies values from [other].
 * @static
 * @param other {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.copy = function(other) {
    var m = Matrix3.zero();
    m.setFrom(other);
    return m;
};

/**
 * /// Matrix with values from column arguments.
 * @static
 * @param arg0 {Vector3}
 * @param arg1 {Vector3}
 * @param arg2 {Vector3}
 * @returns {Matrix3}
 */
Matrix3.columns = function(arg0, arg1, arg2) {
    var m = Matrix3.zero();
    m.setColumns(arg0, arg1, arg2);
    return m;
};

/**
 * /// Outer product of [u] and [v].
 * @static
 * @param u {Vector3}
 * @param v {Vector3}
 * @returns {Matrix3}
 */
Matrix3.outer = function(u, v) {
    var m = Matrix3.zero();
    m.setOuter(u, v);
    return m;
};


/**
 * /// Rotation of [radians].
 * @param radians {Number}
 * @returns {Matrix3}
 */
Matrix3.rotation = function(radians) {
    var m = Matrix3.zero();
    m.setRotation(radians);
    return m;
};


/**
 * /// Rotation of [radians] on X.
 * @param radians {Number}
 * @returns {Matrix3}
 */
Matrix3.rotationX = function(radians) {
    var m = Matrix3.zero();
    m.setRotationX(radians);
    return m;
};

/**
 * /// Rotation of [radians] on Y.
 * @param radians {Number}
 * @returns {Matrix3}
 */
Matrix3.rotationY = function(radians) {
    var m = Matrix3.zero();
    m.setRotationY(radians);
    return m;
};

/**
 * /// Rotation of [radians] on Z.
 * @param radians {Number}
 * @returns {Matrix3}
 */
Matrix3.rotationZ = function(radians) {
    var m = Matrix3.zero();
    m.setRotationZ(radians);
    return m;
};


/**
 * @method
 * /// Sets the matrix with specified values.
 * @param arg0 {Number}
 * @param arg1 {Number}
 * @param arg2 {Number}
 * @param arg3 {Number}
 * @param arg4 {Number}
 * @param arg5 {Number}
 * @param arg6 {Number}
 * @param arg7 {Number}
 * @param arg8 {Number}
 * @returns {Matrix3}
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
 * @method
 * /// Sets the entire matrix to the column values.
 * @param arg0 {Vector3}
 * @param arg1 {Vector3}
 * @param arg2 {Vector3}
 * @returns {Matrix3}
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
 * @method
 * /// Sets the entire matrix to the matrix in [arg].
 * @param arg {Matrix3}
 * @returns {Matrix3}
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
 * @method
 * /// Set [this] to the outer product of [u] and [v].
 * @param u {Vector3}
 * @param v {Vector3}
 * @returns {Matrix3}
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
 * @method
 * /// Sets the diagonal to [arg].
 * @param arg {Number}
 * @returns {Matrix3}
 */
Matrix3.prototype.splatDiagonal = function(arg) {
    this.storage[0] = arg;
    this.storage[4] = arg;
    this.storage[8] = arg;
    return this;
};

/**
 * @method
 * /// Sets the diagonal of the matrix to be [arg].
 * @param arg {Vector3}
 * @returns {Matrix3}
 */
Matrix3.prototype.setDiagonal = function(arg) {
    var argStorage = arg.storage;
    this.storage[0] = argStorage[0];
    this.storage[4] = argStorage[1];
    this.storage[8] = argStorage[2];
    return this;
};

/**
 * @method
 * Printable string
 * @returns {string}
 */
Matrix3.prototype.toString = function() {
    return '[0] ' + this.getRow(0).toString() +
           '\n[1] ' + this.getRow(1).toString() +
           '\n[2] ' + this.getRow(2).toString() + '}\n';
};

/**
 * /// Access the element of the matrix at the index [i].
 * @method
 * @param i {number}
 * @returns {Number}
 */
Matrix3.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * /// Set the element of the matrix at the index [i].
 * @method
 * @param i {number}
 * @param v {number}
 */
Matrix3.prototype.setAt = function(i, v) {
    this.storage[i] = v;
};

/**
 * @method
 * /// Check if two matrices are the same.
 * @param other {Matrix3}
 * @returns {boolean}
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
 * @method
 * /// Check if two matrices are almost the same.
 * @param other {Matrix3}
 * @param precision {number}
 * @returns {boolean}
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
 * @method
 * /// Sets [row] of the matrix to values in [arg]
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
 * @method
 * /// Gets the [row] of the matrix
 * @param row {Number}
 * @returns {Vector2}
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
 * @method
 * /// Assigns the [column] of the matrix [arg]
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
 * @method
 * /// Gets the [column] of the matrix
 * @param column {Number}
 * @returns {Vector3}
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
 * /// Create a copy of [this].
 * @returns {Matrix3}
 */
Matrix3.prototype.clone = function() {
    return Matrix3.copy(this);
};

/**
 * /// Copy [this] into [arg].
 * @param arg {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.prototype.copyInto = function(arg) {
    arg.setFrom(this);
    return arg;
};

/**
 * /// Returns a new vector or matrix by multiplying [this] with [arg].
 * @param arg
 * @returns {*}
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
 * @method
 * /// Returns new matrix after component wise [this] + [arg]
 * @param arg {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.prototype.added = function(arg) {
    var m = this.clone();
    m.add(arg);
    return m;
};

/**
 * @method
 * /// Returns new matrix after component wise [this] - [arg]
 * @param arg {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.prototype.subbed = function(arg) {
    var m = this.clone();
    m.sub(arg);
    return m;
};

/**
 * @method
 * /// Returns new matrix after negating [this]
 * @returns {Matrix3}
 */
Matrix3.prototype.negated = function() {
    var m = this.clone();
    m.negate();
    return m;
};

/**
 * @method
 * /// Zeros [this].
 * @returns {Matrix3}
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
 * @method
 * /// Makes [this] into the identity matrix.
 * @returns {Matrix3}
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
 * @method
 * /// Returns the tranpose of this.
 * @returns {Matrix3}
 */
Matrix3.prototype.transposed = function() {
    var m = this.clone();
    m.transpose();
    return m;
};

/**
 * @method
 * Transpose [this]
 * @returns {Matrix3}
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
 * /// Returns the component wise absolute value copy of this.
 * @returns {Matrix3}
 */
Matrix3.prototype.absolute = function() {
    var r = Matrix3.zero();
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
    return r;
};

/**
 * /// Returns the determinant of this matrix.
 * @returns {number}
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
 * @method
 * /// Returns the dot product of row [i] and [v].
 * @param i {Number}
 * @param v {Vector3}
 * @returns {number}
 */
Matrix3.prototype.dotRow = function(i, v) {
    var vStorage = v.storage;
    return this.storage[i] * vStorage[0] +
        this.storage[3 + i] * vStorage[1] +
        this.storage[6 + i] * vStorage[2];
};

/**
 * @method
 * /// Returns the dot product of column [j] and [v].
 * @param j {number}
 * @param v {Vector3}
 * @returns {number}
 */
Matrix3.prototype.dotColumn = function(j, v) {
    var vStorage = v.storage;
    return this.storage[j * 3] * vStorage[0] +
        this.storage[j * 3 + 1] * vStorage[1] +
        this.storage[j * 3 + 2] * vStorage[2];
};

/**
 * @method
 * /// Trace of the matrix.
 * @returns {number}
 */
Matrix3.prototype.trace = function() {
    var t = 0.0;
    t += this.storage[0];
    t += this.storage[4];
    t += this.storage[8];
    return t;
};

/**
 * @method
 * /// Returns infinity norm of the matrix. Used for numerical analysis.
 * @returns {number}
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


/// Returns relative error between [this] and [correct]
Matrix3.prototype.relativeError = function(correct) {
    var diff = correct.subbed(this);
    var correct_norm = correct.infinityNorm();
    var diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
};

/**
 * /// Returns absolute error between [this] and [correct]
 * @param correct {Matrix3}
 * @returns {number|*}
 */
Matrix3.prototype.absoluteError = function(correct) {
    var this_norm = this.infinityNorm();
    var correct_norm = correct.infinityNorm();
    var diff_norm = Math.abs((this_norm - correct_norm));
    return diff_norm;
};

/**
 * /// Invert the matrix. Returns the determinant.
 * @returns {number}
 */
Matrix3.prototype.invert = function () {
    return this.copyInverse(this);
};

/**
 * @method
 * /// Set this matrix to be the inverse of [arg]
 * @param arg {Matrix3}
 * @returns {number}
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
 * @method
 * /// Set this matrix to be the normal matrix of [arg].
 * @param arg {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.prototype.copyNormalMatrix = function(arg) {
    this.copyInverse(arg.getRotation());
    this.transpose();
    return this;
};

/**
 * @method
 * /// Turns the matrix into a rotation of [radians] around X
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
 * @method
 * /// Turns the matrix into a rotation of [radians] around Y
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
 * @method
 * /// Turns the matrix into a rotation of [radians] around Z
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
 * /// Converts into Adjugate matrix and scales by [scale]
 * @param scale
 * @returns {Matrix3}
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
 * /// Rotates [arg] by the absolute rotation of [this]
 * /// Returns [arg].
 * /// Primarily used by AABB transformation code.
 * @param arg {Vector2}
 * @returns {Vector2}
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
 * @method
 * /// Rotates [arg] by the absolute rotation of [this]
 * /// Returns [arg].
 * /// Primarily used by AABB transformation code.
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
 * @method
 * /// Transforms [arg] with [this].
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
 * @method
 * /// Scales [this] by [scale].
 * @param scale
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
 * @method
 * /// Create a copy of [this] and scale it by [scale].
 * @param scale
 * @returns {Matrix3}
 */
Matrix3.prototype.scaled = function(scale) {
    var m = this.clone();
    m.scale(scale);
    return m;
};

/**
 * @method
 * /// Add [o] to [this].
 * @param o {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.prototype.add = function(o) {
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
    return this;
};

/**
 * @method
 * /// Subtract [o] from [this].
 * @param o {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.prototype.sub = function(o) {
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
    return this;
};

/**
 * @method
 * /// Negate [this].
 * @returns {Matrix3}
 */
Matrix3.prototype.negate = function() {
    this.storage[0] = -this.storage[0];
    this.storage[1] = -this.storage[1];
    this.storage[2] = -this.storage[2];
    this.storage[3] = -this.storage[3];
    this.storage[4] = -this.storage[4];
    this.storage[5] = -this.storage[5];
    this.storage[6] = -this.storage[6];
    this.storage[7] = -this.storage[7];
    this.storage[8] = -this.storage[8];
    return this;
};

/**
 * @method
 * /// Multiply [this] by [arg].
 * @param arg {Matrix3}
 * @returns {Matrix3}
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
 * @method
 * /// Create a copy of [this] and multiply it by [arg].
 * @param arg {Matrix3}
 * @returns {Matrix3}
 */
Matrix3.prototype.multiplied = function(arg) {
    var m = this.clone();
    m.multiply(arg);
    return m;
};

/**
 * @method
 * @param arg
 * @returns {Matrix3}
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
 * @method
 * @param arg
 * @returns {Matrix3}
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
 * @method
 * /// Transform [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @returns {Vector3}
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
 * @method
 * /// Transform a copy of [arg] of type [Vector3] using the transformation defined by [this].
 * @param arg {Vector3}
 * @returns {Vector3}
 */
Matrix3.prototype.transformed = function(arg) {
    var out = Vector3.copy(arg);
    return this.transform(out);
};

/**
 * @method
 * /// Copies elements from [array] into [this] starting at [offset].
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
 * @method
 * /// Multiply [this] to each set of xyz values in [array] starting at [offset].
 * @param array {Array}
 * @param offset {number}
 * @returns {Array}
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

},{"./matrix2.js":2,"./quaternion.js":6,"./vector2.js":10,"./vector3.js":11}],4:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Matrix4;
var Matrix3 = _dereq_('./matrix3.js');
var Vector3 = _dereq_('./vector3.js');
var Vector4 = _dereq_('./vector4.js');
var Quaternion = _dereq_('./quaternion.js');

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
},{"./matrix3.js":3,"./quaternion.js":6,"./vector3.js":11,"./vector4.js":12}],5:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Plane;

var EPSILON = module.EPSILON;

function Plane() {}
},{}],6:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Quaternion;
var Matrix3 = _dereq_('./matrix3.js');
var Vector3 = _dereq_('./vector3.js');

/**
 * @class Quaternion
 * Defines a [Quaternion] (a four-dimensional vector) for efficient rotation calculations.
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
 * @static
 * @param rotationMatrix {Matrix3}
 * @returns {Quaternion}
 */
Quaternion.fromRotation = function(rotationMatrix) {
    var q = Quaternion.zero();
    q.setFromRotation(rotationMatrix);
    return q;
};

/**
 * @static
 * Constructs from axis and angle
 * @param axis {Vector3}
 * @param angle {number}
 * @returns {Quaternion}
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
 * @static
 * Constructs a quaternion with a random rotation. The random number
 * generator [rn] is used to generate the random numbers for the rotation.
 * @returns {Quaternion}
 */
Quaternion.random = function() {
    var q = Quaternion.zero();
    q.setRandom();
    return q;
};


/**
 * @static
 * Constructs a quaternion set to the identity quaternion.
 * @returns {Quaternion}
 */
Quaternion.identity = function() {
    var q = Quaternion.zero();
    q.storage[3] = 1.0;
    return q;
};

/**
 * @static
 * Constructs a quaternion from time derivative of [q] with angular velocity [omega].
 * @param q {Quaternion}
 * @param omega {Vector3}
 * @returns {Quaternion}
 */
Quaternion.dq = function(q, omega) {
    var quat = Quaternion.zero();
    quat.setDQ(quat, omega);
    return quat;
};

/**
 * @static
 * Constructs a quaternion from [yaw], [pitch] and [roll].
 * @param yaw {number}
 * @param pitch {number}
 * @param roll {number}
 * @returns {Quaternion}
 */
Quaternion.euler = function(yaw, pitch, roll) {
    var q = Quaternion.zero();
    q.setEuler(yaw, pitch, roll);
    return q;
};


/**
 * @static
 * Constructs a quaternion with given Float32Array as [storage].
 * @param array {Float32Array}
 * @returns {Quaternion}
 */
Quaternion.fromFloat32Array = function(array) {
    var q = Quaternion.zero();
    q.storage = array;
    return q;
};

/**
 * /// Constructs a quaternion with a [storage] that views given [buffer] starting at [offset].
 * // [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @returns {Quaternion}
 */
Quaternion.fromBuffer = function(buffer, offset) {
    var q = Quaternion.zero();
    q.storage = new Float32Array(buffer, offset, 4);
    return q;
};

/**
 * @method
 * /// Returns a new copy of [this].
 * @returns {Quaternion}
 */
Quaternion.prototype.clone = function() {
    return Quaternion.copy(this);
};

/**
 * @method
 * Copy [source] into [this].
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
 * @method
 * Set the quaternion to the raw values [x], [y], [z], and [w].
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
 * @method
 * Set the quaternion with rotation of [radians] around [axis].
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

/// Set the quaternion with rotation from a rotation matrix [rotationMatrix].
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
 * @method
 * /// Set the quaternion to a random rotation. The random number generator [rn]
 * /// is used to generate the random numbers for the rotation.
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
 * @method
 * Set the quaternion to the time derivative of [q] with angular velocity [omega].
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
 * @method
 * Set quaternion with rotation of [yaw], [pitch] and [roll].
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
 * @method
 * Normalize [this].
 * @returns {Quaternion}
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
 * @method
 * Conjugate [this].
 * @returns {Quaternion}
 */
Quaternion.prototype.conjugate = function() {
    this.storage[2] = -this.storage[2];
    this.storage[1] = -this.storage[1];
    this.storage[0] = -this.storage[0];
    return this;
};

/**
 * @method
 * Invert [this].
 * @returns {Quaternion}
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
 * @method
 * Normalized copy of [this].
 * @returns {Quaternion}
 */
Quaternion.prototype.normalized = function() {
    var q = this.clone();
    q.normalize();
    return q;
};

/**
 * @method
 * Conjugated copy of [this].
 * @returns {Quaternion}
 */
Quaternion.prototype.conjugated = function() {
    var q = this.clone();
    q.conjugate();
    return q;
};

/**
 * @method
 * Inverted copy of [this].
 * @returns {Quaternion}
 */
Quaternion.prototype.inverted = function() {
    var q = this.clone();
    q.inverse();
    return q;
};

/**
 * @property radians
 * [radians] of rotation around the [axis] of the rotation.
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("radians", function() {
    return 2.0 * Math.acos(this.storage[3]);
});

/**
 * @property axis
 * [axis] of rotation.
 * @type {Vector3}
 */
Quaternion.prototype.__defineGetter__("axis", function() {
    var scale = 1.0 / (1.0 - (this.storage[3] * this.storage[3]));
    return new Vector3(this.storage[0] * scale, this.storage[1] * scale, this.storage[2] * scale);
});

/**
 * @property length2
 * Length squared.
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
 * Length.
 * @type {number}
 */
Quaternion.prototype.__defineGetter__("length", function() {
    return Math.sqrt(this.length2);
});

/**
 * @method
 * Returns a copy of [v] rotated by quaternion.
 * @param v {Vector3}
 * @returns {Vector3}
 */
Quaternion.prototype.rotated = function(v) {
    var out = v.clone();
    this.rotate(out);
    return out;
};

/**
 * @method
 * Rotates [v] by [this].
 * @param v {Vector3}
 * @returns {Vector3}
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
 * @method
 * Add [arg] to [this].
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
 * @method
 * Subtracts [arg] from [this].
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
 * @method
 * Scales [this] by [scale].
 * @param scale {number}
 */
Quaternion.prototype.scale = function(scale) {
    this.storage[3] = this.storage[3] * scale;
    this.storage[2] = this.storage[2] * scale;
    this.storage[1] = this.storage[1] * scale;
    this.storage[0] = this.storage[0] * scale;
};

/**
 * @method
 * Scaled copy of [this].
 * @param scale {number}
 * @returns {Quaternion}
 */
Quaternion.prototype.scaled = function(scale) {
    var q = this.clone();
    q.scale(scale);
    return q;
};

/**
 * @method
 * [this] rotated by [other].
 * @param other {Quaternion}
 * @returns {Quaternion}
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
 * @method
 * Returns if other equals this
 * @param other {Quaternion}
 * @returns {boolean}
 */
Quaternion.prototype.equals = function(other) {
    return (this.storage[0] == other.storage[0] &&
            this.storage[1] == other.storage[1] &&
            this.storage[2] == other.storage[2] &&
            this.storage[3] == other.storage[3])
};

/**
 * @method
 * Returns if other is almost this
 * @param q {Quaternion}
 * @param precision {number}
 * @returns {boolean}
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
 * @method
 * Returns copy of [this] + [other].
 * @param other {Quaternion}
 * @returns {Quaternion}
 */
Quaternion.prototype.added = function(other) {
    var q = this.clone();
    q.add(other);
    return q;
};

/**
 * @method
 * Returns copy of [this] - [other].
 * @param other {Quaternion}
 * @returns {Quaternion}
 */
Quaternion.prototype.subbed = function(other) {
    var q = this.clone();
    q.sub(other);
    return q;
};

/**
 * @method
 * Returns negated copy of [this].
 * @returns {Quaternion}
 */
Quaternion.prototype.negated = function() {
    return this.conjugated();
};

/**
 * @method
 * Access the component of the quaternion at the index [i].
 * @param i {number}
 * @returns {number}
 */
Quaternion.prototype.getAt = function(i) {
    return this.storage[i];
};

/**
 * @method
 * Set the component of the quaternion at the index [i].
 * @param i {number}
 * @param arg {number}
 */
Quaternion.prototype.setAt = function(i, arg) {
    this.storage[i] = arg;
};

/**
 * @method
 * Returns a rotation matrix containing the same rotation as [this].
 * @returns {Matrix3}
 */
Quaternion.prototype.asRotationMatrix = function() {
    return this.copyRotationInto(Matrix3.zero());
};

/**
 * @method
 * Set [rotationMatrix] to a rotation matrix containing the same rotation as [this].
 * @param rotationMatrix {Matrix3}
 * @returns {Matrix3}
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
 * @method
 * Printable string.
 * @returns {string}
 */
Quaternion.prototype.toString = function() {
    return this.storage[0].toString() + ', ' +
           this.storage[1].toString() + ', ' +
           this.storage[2].toString() + ', ' +
           this.storage[3].toString();
};

/**
 * @method
 * Relative error between [this] and [correct].
 * @param correct {Quaternion}
 * @returns {number}
 */
Quaternion.prototype.relativeError = function(correct) {
    var diff = correct.subbed(this);
    var norm_diff = diff.length;
    var correct_norm = correct.length;
    return norm_diff / correct_norm;
};

/**
 * @method
 * Absolute error between [this] and [correct].
 * @param correct {Quaternion}
 * @returns {number}
 */
Quaternion.prototype.absoluteError = function(correct) {
    var this_norm = this.length;
    var correct_norm = correct.length;
    var norm_diff = Math.abs(this_norm - correct_norm);
    return norm_diff;
};
},{"./matrix3.js":3,"./vector3.js":11}],7:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Ray;
var EPSILON = module.EPSILON;

function Ray() {}
},{}],8:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Sphere;
var EPSILON = module.EPSILON;

function Sphere() {}
},{}],9:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Triangle;

var EPSILON = module.EPSILON;

function Triangle() {}
},{}],10:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector2;

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
}

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
    }
});

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

/// Constructs Vector2 with a given [Float32List] as [storage].
Vector2.prototype.fromFloat32Array = function(array) {
    this.storage = array;
};

/// Constructs Vector2 with a [storage] that views given [buffer] starting at
/// [offset]. [offset] has to be multiple of [Float32List.BYTES_PER_ELEMENT].
Vector2.prototype.fromBuffer = function(buffer, offset) {
    var vec = Vector2.zero();
    vec.storage = new Float32Array(buffer, offset, 2);
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
    result.x = Math.min(a.x, b.x);
    result.y = Math.min(a.y, b.y);
};

/**
 * @description Set the values of [result] to the maximum of [a] and [b] for each line.
 * @static
 * @param a {Vector2}
 * @param b {Vector2}
 * @param result {Vector2}
 */
Vector2.max = function(a, b, result) {
    result.x = Math.max(a.x, b.x);
    result.y = Math.max(a.y, b.y);
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
    result.x = min.x + a * (max.x - min.x);
    result.y = min.y + a * (max.y - min.y);
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
    this.storage[0] = value;
    this.storage[1] = value;
    return this;
};

/**
 * @method
 * Returns if this is almost equal to other
 * @param v {Vector3}
 * @param precision {number}
 * @returns {boolean}
 */
Vector2.prototype.almostEquals = function(v, precision) {
    if (precision === undefined) {
        precision = Number.EPSILON;
    }
    if (Math.abs(this.x-v.x) > precision ||
        Math.abs(this.y-v.y) > precision) {
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
    this.storage[0] = - this.storage[0];
    this.storage[1] = - this.storage[1];
    return this;
};

/**
 * @method
 * Subtract other to this
 * @param other {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.sub = function(other) {
    this.storage[0] = this.storage[0] - other.storage[0];
    this.storage[1] = this.storage[1] - other.storage[1];
    return this;
};

/**
 * @method
 * Add other to this
 * @param other {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.add = function(other) {
    this.storage[0] = this.storage[0] + other.storage[0];
    this.storage[1] = this.storage[1] + other.storage[1];
    return this;
};

/**
 * @method
 * Multiply other to this
 * @param other
 * @returns {Vector2}
 */
Vector2.prototype.mul = function(other) {
    this.storage[0] = this.storage[0] * other.storage[0];
    this.storage[1] = this.storage[1] * other.storage[1];
    return this;
};

/**
 * @method
 * Divide this by other
 * @param other {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.div = function(other) {
    this.storage[0] = this.storage[1] / other.storage[1];
    this.storage[1] = this.storage[1] / other.storage[1];
    return this;
};

/**
 * @method
 * Scale this
 * @param arg {number}
 * @returns {Vector2}
 */
Vector2.prototype.scale = function(arg) {
    this.storage[0] = this.storage[0] * arg;
    this.storage[1] = this.storage[1] * arg;
    return this;
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
    return this.storage[0] * v.storage[0] +
           this.storage[1] * v.storage[1];
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
    this.storage[0] = Math.abs(this.storage[0]);
    this.storage[1] = Math.abs(this.storage[1]);
};

/**
 * @method
 * Clamp each entry n in [this] in the range [min[n]]-[max[n]].
 * @param min {Vector2}
 * @param max {Vector2}
 * @returns {Vector2}
 */
Vector2.prototype.clamp = function(min, max) {
    var minStorage = min.storage;
    var maxStorage = max.storage;
    this.storage[0] = Math.min(Math.max(this.storage[0], minStorage[0]), maxStorage[0]);
    this.storage[1] = Math.min(Math.max(this.storage[1], minStorage[1]), maxStorage[1]);
    return this;
};

/**
 * @method
 * Clamp entries in [this] in the range [min]-[max].
 * @param min {number}
 * @param max {number}
 * @returns {Vector2}
 */
Vector2.prototype.clampScalar = function(min, max) {
    this.storage[0] = Math.min(Math.max(this.storage[0], min), max);
    this.storage[1] = Math.min(Math.max(this.storage[1], min), max);
    return this;
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
    var l = this.length;
    if (l != 0.0) {
        l = 1.0 / l;
        this.storage[0] = this.x * l;
        this.storage[1] = this.y * l;
    }
    return this;
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
},{}],11:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */

module.exports = Vector3;

var Matrix3 = _dereq_('./matrix3.js');
var Matrix4 = _dereq_('./matrix4.js');

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
 * @property length
 * @type {number}
 */
Vector3.prototype.__defineGetter__("length", function() {
    return Math.sqrt(this.length2());
});
Vector3.prototype.__defineSetter__("length", function(value) {
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
    }
});

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
 * Constructs Vector2 with a given [Float32Array] as [storage].
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
    this.storage[0] = value;
    this.storage[1] = value;
    this.storage[2] = value;
    return this;
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
        precision = Number.EPSILON;
    }
    if (Math.abs(this.x-v.x) > precision ||
        Math.abs(this.y-v.y) > precision ||
        Math.abs(this.z-v.z) > precision) {
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
    this.storage[0] = - this.storage[0];
    this.storage[1] = - this.storage[1];
    this.storage[2] = - this.storage[2];
    return this;
};

/**
 * @method
 * Subtract other from this
 * @param other
 * @returns {Vector3}
 */
Vector3.prototype.sub = function(other) {
    this.storage[0] = this.storage[0] - other.storage[0];
    this.storage[1] = this.storage[1] - other.storage[1];
    this.storage[2] = this.storage[2] - other.storage[2];
    return this;
};

/**
 * @method
 * Add other to this
 * @param other
 * @returns {Vector3}
 */
Vector3.prototype.add = function(other) {
    this.storage[0] = this.storage[0] + other.storage[0];
    this.storage[1] = this.storage[1] + other.storage[1];
    this.storage[2] = this.storage[2] + other.storage[2];
    return this;
};

/**
 * @method
 * Multiply other to this
 * @param other
 * @returns {Vector3}
 */
Vector3.prototype.mul = function(other) {
    this.storage[0] = this.storage[0] * other.storage[0];
    this.storage[1] = this.storage[1] * other.storage[1];
    this.storage[2] = this.storage[2] * other.storage[2];
    return this;
};

/**
 * @method
 * Divide this by other
 * @param other
 * @returns {Vector3}
 */
Vector3.prototype.div = function(other) {
    this.storage[0] = this.storage[1] / other.storage[1];
    this.storage[1] = this.storage[1] / other.storage[1];
    this.storage[2] = this.storage[2] / other.storage[2];
    return this;
};

/**
 * @method
 * Scale this
 * @param arg
 * @returns {Vector3}
 */
Vector3.prototype.scale = function(arg) {
    this.storage[0] = this.storage[0] * arg;
    this.storage[1] = this.storage[1] * arg;
    this.storage[2] = this.storage[2] * arg;
    return this;
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
    return this.storage[0] * v.x +
           this.storage[1] * v.y +
           this.storage[2] * v.z;
};

/**
 * @method
 * Compute cross product
 * @param v {Vector3}
 * @returns {Vector3}
 */
Vector3.prototype.cross = function(v) {
    var x = this.storage[1] * v.storage[2] - this.storage[2] * v.storage[1];
    var y = this.storage[2] * v.storage[0] - this.storage[0] * v.storage[2];
    var z = this.storage[0] * v.storage[1] - this.storage[1] * v.storage[0];

    return new Vector3(x, y, z);
};

/**
 * @method
 * Set this to absolute value
 */
Vector3.prototype.absolute = function() {
    this.storage[0] = Math.abs(this.storage[0]);
    this.storage[1] = Math.abs(this.storage[1]);
    this.storage[2] = Math.abs(this.storage[2]);
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
    var minStorage = min.storage;
    var maxStorage = max.storage;
    this.storage[0] = Math.min(Math.max(this.storage[0], minStorage[0]), maxStorage[0]);
    this.storage[1] = Math.min(Math.max(this.storage[1], minStorage[1]), maxStorage[1]);
    this.storage[2] = Math.min(Math.max(this.storage[2], minStorage[2]), maxStorage[2]);
    return this;
};

/**
 * @method
 *  Clamp entries in [this] in the range [min]-[max].
 * @param min {number}
 * @param max {number}
 * @returns {Vector3}
 */
Vector3.prototype.clampScalar = function(min, max) {
    this.storage[0] = Math.min(Math.max(this.storage[0], min), max);
    this.storage[1] = Math.min(Math.max(this.storage[1], min), max);
    this.storage[2] = Math.min(Math.max(this.storage[2], min), max);
    return this;
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
    return this.storage[0] * this.storage[0] +
           this.storage[1] * this.storage[1] +
           this.storage[2] * this.storage[2];
};

/**
 * @method
 * Normalize this
 * @returns {Vector3}
 */
Vector3.prototype.normalize = function() {
    var l = this.length;
    if (l != 0.0) {
        l = 1.0 / l;
        this.storage[0] *= l;
        this.storage[1] *= l;
        this.storage[2] *= l;
    }
    return this;
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
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
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
},{"./matrix3.js":3,"./matrix4.js":4}],12:[function(_dereq_,module,exports){
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

},{}],13:[function(_dereq_,module,exports){
/**
 * Created by grizet_j on 9/20/2015.
 */
module.exports = {
    version:     _dereq_('../package.json').version,


    Vector2:     _dereq_('./vector2.js'),
    Vector3:     _dereq_('./vector3.js'),
    Vector4:     _dereq_('./vector4.js'),
    Matrix2:     _dereq_('./matrix2.js'),
    Matrix3:     _dereq_('./matrix3.js'),
    Matrix4:     _dereq_('./matrix4.js'),
    Quaternion:  _dereq_('./quaternion.js'),
    Plane:       _dereq_('./plane.js'),
    Sphere:      _dereq_('./sphere.js'),
    Ray:         _dereq_('./ray.js'),
    Triangle:    _dereq_('./triangle.js')
};
},{"../package.json":1,"./matrix2.js":2,"./matrix3.js":3,"./matrix4.js":4,"./plane.js":5,"./quaternion.js":6,"./ray.js":7,"./sphere.js":8,"./triangle.js":9,"./vector2.js":10,"./vector3.js":11,"./vector4.js":12}]},{},[13])
(13)
});
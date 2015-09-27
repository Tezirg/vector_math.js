/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Plane;

var Vector3 = require('./vector3.js');

/**
 * @class Plane
 * @constructor
 */
function Plane() {
    this.norm = Vector3.zero();
    this.const = 0.0;
}

/**
 * @static
 * Find the intersection point between the three planes [a], [b] and [c] and copy it into [result].
 * @param a {Plane}
 * @param b {Plane}
 * @param c {Plane}
 * @param result {Vector3}
 */
Plane.intersection = function(a, b, c, result) {
    var cross = b.normal.cross(c.normal);
    var f = -a.normal.dot(cross);
    var v1 = cross.scaled(a.constant);

    cross = c.normal.cross(a.normal);
    var v2 = cross.scaled(b.constant);

    cross = a.normal.cross(b.normal);

    var v3 = cross.scaled(c.constant);

    result.x = (v1.x + v2.x + v3.x) / f;
    result.y = (v1.y + v2.y + v3.y) / f;
    result.z = (v1.z + v2.z + v3.z) / f;
};

Plane.prototype.__defineGetter__("normal", function() {
    return this.norm;
});


Plane.prototype.__defineGetter__("constant", function() {
    return this.const;
});

Plane.prototype.__defineSetter__("constant", function(value) {
   this.const = value;
});


/**
 * @static
 * Returns a copy of other
 * @param other {Plane}
 * @returns {Plane}
 */
Plane.copy = function(other) {
    var p = new Plane();
    p.const = other.constant;
    p.norm.setFrom(other.normal);
    return p;
};

/**
 * @static
 * Constructs a Plane from components
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 * @returns {Plane}
 */
Plane.components = function(x, y, z, w) {
    var p = new Plane();
    p.setFromComponents(x, y, z, w);
    return p;
};

/**
 * @static
 * Constructs a Plane from a normal vector and constant value
 * @param normal {Vector3}
 * @param constant {number}
 * @returns {Plane}
 */
Plane.normalconstant = function(normal, constant) {
    var p = new Plane();
    p.norm.setFrom(normal);
    p.const = constant;
    return p;
};


/**
 * @method
 * Copy other into this
 * @param o {Plane}
 */
Plane.prototype.copyFrom = function(o) {
    this.norm.setFrom(o.normal);
    this.const = o.const;
};

/**
 * @method
 * Sets this from values
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 */
Plane.prototype.setFromComponents = function(x, y, z, w) {
    this.norm.setValues(x, y, z);
    this.const = w;
};

/**
 * @method
 * Normalize this
 */
Plane.prototype.normalize = function() {
    var inverseLength = 1.0 / this.norm.length;
    this.norm.scale(inverseLength);
    this.const = this.const * inverseLength;
};

/**
 * @method
 * Compute distance to a point
 * @param point {Vector3}
 * @returns {number}
 */
Plane.prototype.distanceToVector3 = function(point) {
    return this.norm.dot(point) + this.const;
};
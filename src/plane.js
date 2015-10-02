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
    this.normal = Vector3.zero();
    this.constant = 0.0;
}

/**
 * @static intersection
 * @description Find the intersection point between the three planes [a], [b] and [c] and copy it into [result].
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


/**
 * @static copy
 * @description return a copy of other
 * @param other {Plane}
 * @return {Plane}
 */
Plane.copy = function(other) {
    var p = new Plane();
    p.constant = other.constant;
    p.normal.setFrom(other.normal);
    return p;
};

/**
 * @static components
 * @description Constructs a Plane from components
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 * @return {Plane}
 */
Plane.components = function(x, y, z, w) {
    var p = new Plane();
    p.setFromComponents(x, y, z, w);
    return p;
};

/**
 * @static normalconstant
 * @description Constructs a Plane from a normal vector and constant value
 * @param normal {Vector3}
 * @param constant {number}
 * @return {Plane}
 */
Plane.normalconstant = function(normal, constant) {
    var p = new Plane();
    p.normal.setFrom(normal);
    p.constant = constant;
    return p;
};


/**
 * @method copyFrom
 * @description Copy other into this
 * @param o {Plane}
 */
Plane.prototype.copyFrom = function(o) {
    this.normal.setFrom(o.normal);
    this.constant = o.constant;
};

/**
 * @method setFromComponents
 * @description Sets this from values
 * @param x {number}
 * @param y {number}
 * @param z {number}
 * @param w {number}
 */
Plane.prototype.setFromComponents = function(x, y, z, w) {
    this.normal.setValues(x, y, z);
    this.constant = w;
};

/**
 * @method normalize
 * @description Normalize this
 */
Plane.prototype.normalize = function() {
    var inverseLength = 1.0 / this.normal.length;
    this.normal.scale(inverseLength);
    this.constant = this.constant * inverseLength;
};

/**
 * @method distanceToVector3
 * @description Compute distance to a point
 * @param point {Vector3}
 * @return {number}
 */
Plane.prototype.distanceToVector3 = function(point) {
    return this.normal.dot(point) + this.constant;
};
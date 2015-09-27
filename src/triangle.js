/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Triangle;

var Vector3 = require('./vector3.js');

/**
 * @class Triangle
 * Defines a triangle by three points.
 * @constructor
 */
function Triangle() {
    /**
     * @property point0
     * @type {Vector3}
     */
    this.point0 = Vector3.zero();

    /**
     * @property point1
     * @type {Vector3}
     */
    this.point1 = Vector3.zero();

    /**
     * @property point2
     * @type {Vector3}
     */
    this.point2 = Vector3.zero();
}

/**
 * @static
 * Create a triangle as a copy of [other].
 * @param other {Triangle}
 * @returns {Triangle}
 */
Triangle.copy = function(other) {
    var t = new Triangle();
    t.point0.setFrom(other.point0);
    t.point1.setFrom(other.point1);
    t.point2.setFrom(other.point2);
    return t;
};

/**
 * @static
 * Create a triangle by three points.
 * @param point0 {Vector3}
 * @param point1 {Vector3}
 * @param point2 {Vector3}
 * @returns {Triangle}
 */
Triangle.points = function(point0, point1, point2) {
    var t = new Triangle();
    t.point0.setFrom(point0);
    t.point1.setFrom(point1);
    t.point2.setFrom(point2);
    return t;
};

/**
 * @method
 * Copy the triangle from [other] into [this].
 * @param other {Triangle}
 */
Triangle.prototype.copyFrom = function(other) {
    this.point0.setFrom(other.point0);
    this.point1.setFrom(other.point1);
    this.point2.setFrom(other.point2);
};

/**
 * @method
 * Copy the normal of [this] into [normal].
 * @param normal {Vector3}
 */
Triangle.prototype.copyNormalInto = function(normal) {
    var v0 = this.point0.clone().sub(this.point1);
    normal.setFrom(this.point2);
    normal.sub(this.point1);
    var n = normal.cross(v0);
    n.normalize();
    normal.setFrom(n);
};

/**
 * @method
 * Transform [this] by the transform [t].
 * @param t {Matrix4}
 */
Triangle.prototype.transform = function(t) {
    t.transform3(this.point0);
    t.transform3(this.point1);
    t.transform3(this.point2);
};

/**
 * @method
 * Translate [this] by [offset].
 * @param offset {Vector3}
 */
Triangle.prototype.translate = function(offset) {
    this.point0.add(offset);
    this.point1.add(offset);
    this.point2.add(offset);
};

/**
 * Created by grizet_j on 9/27/2015.
 */

module.exports = Quad;
var Vector3 = require('./vector3.js');
var Triangle = require('./triangle.js');

/**
 * @class Quad
 * @description Defines a quad by four points.
 * @constructor
 */
function Quad () {

    /**
     * @property point0
     * The first point of the quad.
     * @type {Vector3}
     */
    this.point0 = Vector3.zero();

    /**
     * @property point1
     * @type {Vector3}
     * The second point of the quad.
     */
    this.point1 = Vector3.zero();

    /**
     * @property point2
     * @type {Vector3}
     * The third point of the quad.
     */
    this.point2 = Vector3.zero();

    /**
     * @property point3
     * @type {Vector3}
     * The third point of the quad.
     */
    this.point3 = Vector3.zero();

}

/**
 * @static copy
 * @description Create a quad as a copy of [other].
 * @param other {Quad}
 * @return {Quad}
 */
Quad.copy = function(other) {
    var q = new Quad();
    q.point0.setFrom(other.point0);
    q.point1.setFrom(other.point1);
    q.point2.setFrom(other.point2);
    q.point3.setFrom(other.point3);
    return q;
};

/**
 * @static points
 * @description Create a quad by four points.
 * @param point0 {Vector3}
 * @param point1 {Vector3}
 * @param point2 {Vector3}
 * @param point3 {Vector3}
 * @return {Quad}
 */
Quad.points = function(point0, point1, point2, point3) {
    var q = new Quad();
    q.point0.setFrom(point0);
    q.point1.setFrom(point1);
    q.point2.setFrom(point2);
    q.point3.setFrom(point3);
    return q;
};

/**
 * @method copyFrom
 * @description Copy the quad from [other] into [this].
 * @param other {Quad}
 */
Quad.prototype.copyFrom = function(other) {
    this.point0.setFrom(other.point0);
    this.point1.setFrom(other.point1);
    this.point2.setFrom(other.point2);
    this.point3.setFrom(other.point3);
};

/**
 * @method copyNormalInto
 * @description Copy the normal of [this] into [normal].
 * @param normal {Vector3}
 */
Quad.prototype.copyNormalInto = function(normal) {
    var v0 = this.point0.clone().sub(this.point1);
    normal.setFrom(this.point2);
    normal.sub(this.point1);
    var n = normal.cross(v0);
    n.normalize();
    normal.setFrom(n);
};

/**
 * @method copyTriangles
 * @description Copies the two triangles that define [this].
 * @param triangle0 {Triangle}
 * @param triangle1 {Triangle}
 */
Quad.prototype.copyTriangles = function(triangle0, triangle1) {
    triangle0.point0.setFrom(this.point0);
    triangle0.point1.setFrom(this.point1);
    triangle0.point2.setFrom(this.point2);
    triangle1.point0.setFrom(this.point0);
    triangle1.point1.setFrom(this.point3);
    triangle1.point2.setFrom(this.point2);
};

/**
 * @method transform
 * @description Transform [this] by the transform [t].
 * @param t {Matrix4}
 */
Quad.prototype.transform = function(t) {
    t.transform3(this.point0);
    t.transform3(this.point1);
    t.transform3(this.point2);
    t.transform3(this.point3);
};

/**
 * @method translate
 * @description Translate [this] by [offset].
 * @param offset {Vector3}
 */
Quad.prototype.translate = function(offset) {
    this.point0.add(offset);
    this.point1.add(offset);
    this.point2.add(offset);
    this.point3.add(offset);
};
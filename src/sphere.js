/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Sphere;

var Vector3 = require('./vector3.js');

/**
 * @class Sphere
 * @description Defines a sphere with a [center] and a [radius].
 * @constructor
 */
function Sphere() {
    /**
     * @property center
     * @type {Vector3}
     */
    this.center = Vector3.zero();

    /**
     * @property radius
     * @type {number}
     */
    this.radius = 0.0;
}
/**
 * @static copy
 * @description Create a sphere as a copy of [other].
 * @param other {Sphere}
 * @return {Sphere}
 */
Sphere.copy = function(other) {
    var s = new Sphere();
    s.center.setFrom(other.center);
    s.radius = other.radius;
    return s;
};

/**
 * @static centerRadius
 * @description Create a sphere from a [center] and a [radius].
 * @param center {Vector3}
 * @param radius {number}
 * @return {Sphere}
 */
Sphere.centerRadius = function(center, radius) {
    var s = new Sphere();
    s.center.setFrom(center);
    s.radius = radius;
    return s;
};

/**
 * @method copyFrom
 * @description Copy the sphere from [other] into [this].
 * @param other {Sphere}
 */
Sphere.prototype.copyFrom = function(other) {
    this.center.setFrom(other.center);
    this.radius = other.radius;
};

/**
 * @method containsVector3
 * @description Return if [this] contains [other].
 * @param other {Vector3}
 * @return {boolean}
 */
Sphere.prototype.containsVector3 = function(other) {
    return other.distanceToSquared(this.center) < this.radius * this.radius;
};

/**
 * @method intersectsWithVector3
 * @description Return if [this] intersects with [other].
 * @param other {Vector3}
 * @return {boolean}
 */
Sphere.prototype.intersectsWithVector3 = function(other) {
    return other.distanceToSquared(this.center) <= this.radius * this.radius;
};

/**
 * @method intersectsWithSphere
 * @description Return if [this] intersects with [other].
 * @param other {Sphere}
 * @return {boolean}
 */
Sphere.prototype.intersectsWithSphere = function(other) {
    var radiusSum = this.radius + other.radius;
    return other.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
};

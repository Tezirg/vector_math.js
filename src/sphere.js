/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Sphere;

var Vector3 = require('./vector3.js');

/// Defines a sphere with a [center] and a [radius].
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
 * @static
 * Create a sphere as a copy of [other].
 * @param other {Sphere}
 * @returns {Sphere}
 */
Sphere.copy = function(other) {
    var s = new Sphere();
    s.center.setFrom(other.center);
    s.radius = other.radius;
    return s;
};

/**
 * @static
 * Create a sphere from a [center] and a [radius].
 * @param center {Vector3}
 * @param radius {number}
 * @returns {Sphere}
 */
Sphere.centerRadius = function(center, radius) {
    var s = new Sphere();
    s.center.setFrom(center);
    s.radius = radius;
    return s;
};

/**
 * method
 * Copy the sphere from [other] into [this].
 * @param other
 */
Sphere.prototype.copyFrom = function(other) {
    this.center.setFrom(other.center);
    this.radius = other.radius;
};

/**
 * @method
 * Return if [this] contains [other].
 * @param other {Vector3}
 * @returns {boolean}
 */
Sphere.prototype.containsVector3 = function(other) {
    return other.distanceToSquared(this.center) < this.radius * this.radius;
};

/**
 * @method
 * Return if [this] intersects with [other].
 * @param other {Vector3}
 * @returns {boolean}
 */
Sphere.prototype.intersectsWithVector3 = function(other) {
    return other.distanceToSquared(this.center) <= this.radius * this.radius;
};

/**
 * @method
 * Return if [this] intersects with [other].
 * @param other {Sphere}
 * @returns {boolean}
 */
Sphere.prototype.intersectsWithSphere = function(other) {
    var radiusSum = this.radius + other.radius;
    return other.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
};

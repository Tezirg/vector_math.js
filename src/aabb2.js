/**
 * Created by grizet_j on 9/21/2015.
 */

module.exports = Aabb2;

var Vector2 = require('./vector2.js');

/**
 * @class Aabb2
 * @description Defines a 2-dimensional axis-aligned bounding box between a [min] and a [max] position.
 * @constructor
 */
function Aabb2() {
    /// The minimum point defining the AABB.
    /**
     * @property min
     * @type {Vector2}
     */
    this.min = Vector2.zero();

    /// The maximum point defining the AABB.
    /**
     * @property max
     * @type {Vector2}
     */
    this.max = Vector2.zero();
}

/**
 * @method center
 * @description Returns the center of this
 */
Aabb2.prototype.__defineGetter__("center", function() {
    var tmp = this.min.clone();
    tmp.add(this.max);
    tmp.scale(0.5);
    return tmp;
});


/**
 * @static copy
 * @description Create a new AABB as a copy of [other].
 * @param other {Aabb2}
 * @return {Aabb2}
 */
Aabb2.copy = function(other) {
    var bb = new Aabb2();
    bb.min.setFrom(other.min);
    bb.max.setFrom(other.max);
    return bb;
};

/**
 * @static minMax
 * @description Create a new AABB with a [min] and [max].
 * @param min {Vector2}
 * @param max {Vector2}
 * @return {Aabb2}
 */
Aabb2.minMax = function(min,  max) {
    var bb = new Aabb2();
    bb.min.setFrom(min);
    bb.max.setFrom(max);
    return bb;
};

/**
 * @static centerAndHalfExtends
 * @description Create a new AABB with a [center] and [halfExtents].
 * @param center {Vector2}
 * @param halfExtents {Vector2}
 * @return {Aabb2}
 */
Aabb2.centerAndHalfExtents = function(center, halfExtents) {
    var bb = new Aabb2();
    bb.setCenterAndHalfExtents(center, halfExtents);
    return bb;
};

/**
 * @static from buffer
 * @description Constructs [Aabb2] with a min/max [storage] that views given [buffer]
 * starting at [offset]. [offset] has to be multiple of
 * [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @return {Aabb2}
 */
Aabb2.fromBuffer = function(buffer, offset) {
    var bb = new Aabb2();
    bb.min = Vector2.fromBuffer(buffer, offset);
    bb.max = Vector2.fromBuffer(buffer, offset + Float32Array.BYTES_PER_ELEMENT * 2);
    return bb;
};

/**
 * @method setCenterAndHalfExtends
 * @description Set the AABB by a [center] and [halfExtents].
 * @param center {Vector2}
 * @param halfExtents {Vector2}
 */
Aabb2.prototype.setCenterAndHalfExtents = function(center, halfExtents) {
    this.min.setFrom(center);
    this.min.sub(halfExtents);
    this.max.setFrom(center);
    this.max.add(halfExtents);
};

/**
 * @method copyCenterAndHalfExtends
 * @description Copy the [center] and the [halfExtends] of [this].
 * @param center {Vector2}
 * @param halfExtents {Vector2}
 */
Aabb2.prototype.copyCenterAndHalfExtents = function(center, halfExtents) {
    center.setFrom(this.min);
    center.add(this.max);
    center.scale(0.5);
    halfExtents.setFrom(this.max);
    halfExtents.sub(this.min);
    halfExtents.scale(0.5);
};

/**
 * @method copyFrom
 * @description Copy the [min] and [max] from [other] into [this].
 * @param other {Aabb2}
 */
Aabb2.prototype.copyFrom = function(other) {
    this.min.setFrom(other.min);
    this.max.setFrom(other.max);
};

/**
 * @method transform
 * @description Transform [this] by the transform [t].
 * @param t {Matrix3}
 * @return {Aabb2}
 */
Aabb2.prototype.transform = function(t) {
    var center = Vector2.zero();
    var halfExtents = Vector2.zero();
    this.copyCenterAndHalfExtents(center, halfExtents);
    t.transform2(center);
    t.absoluteRotate2(halfExtents);
    this.min.setFrom(center);
    this.min.sub(halfExtents);
    this.max.setFrom(center);
    this.max.add(halfExtents);
    return this;
};

/**
 * @method rotate
 * @description Rotate [this] by the rotation matrix [t].
 * @param t {Matrix3}
 * @return {Aabb2}
 */
Aabb2.prototype.rotate = function(t) {
    var center = Vector2.zero();
    var halfExtents = Vector2.zero();
    this.copyCenterAndHalfExtents(center, halfExtents);
    t.absoluteRotate2(halfExtents);
    this.min.setFrom(center);
    this.min.sub(halfExtents);
    this.max.setFrom(center);
    this.max.add(halfExtents);
    return this;
};

/**
 * @method transformed
 * @description Create a copy of [this] that is transformed by the transform [t] and store
 * it in [out].
 * @param t {Matrix3}
 * @param out {Aabb2}
 */
Aabb2.prototype.transformed = function(t, out) {
    out.copyFrom(this);
    out.transform(t);
};

/**
 * @method rotated
 * @description Create a copy of [this] that is rotated by the rotation matrix [t] and
 * store it in [out].
 * @param t {Matrix3}
 * @param out {Aabb2}
 */
Aabb2.prototype.rotated = function(t, out) {
    out.copyFrom(this);
    out.rotate(t);
};

/**
 * @method hull
 * @description Set the min and max of [this] so that [this] is a hull of [this] and [other].
 * @param other {Aabb2}
 */
Aabb2.prototype.hull = function(other) {
    Vector2.min(this.min, other.min, this.min);
    Vector2.max(this.max, other.max, this.max);
};

/**
 * @method hullPoint
 * @description Set the min and max of [this] so that [this] contains [point].
 * @param point {Vector2}
 */
Aabb2.prototype.hullPoint = function(point) {
    Vector2.min(this.min, point, this.min);
    Vector2.max(this.max, point, this.max);
};

/**
 * @method containsAabb2
 * @description Return if [this] contains [other].
 * @param other {Aabb2}
 * @return {boolean}
 */
Aabb2.prototype.containsAabb2 = function(other) {
    var otherMax = other.max;
    var otherMin = other.min;

    return (this.min.x < otherMin.x) &&
           (this.min.y < otherMin.y) &&
           (this.max.y > otherMax.y) &&
           (this.max.x > otherMax.x);
};

/**
 * @method containsVector2
 * @description Return if [this] contains [other].
 * @param other {Vector2}
 * @return {boolean}
 */
Aabb2.prototype.containsVector2 = function(other) {
    return (this.min.x < other.x) &&
           (this.min.y < other.y) &&
           (this.max.x > other.x) &&
           (this.max.y > other.y);
};

/**
 * @method intersectsWithAabb2
 * @description Return if [this] intersects with [other].
 * @param other {Aabb2}
 * @return {boolean}
 */
Aabb2.prototype.intersectsWithAabb2 = function(other) {
    var otherMax = other.max;
    var otherMin = other.min;

    return (this.min.x <= otherMax.x) &&
           (this.min.y <= otherMax.y) &&
           (this.max.x >= otherMin.x) &&
           (this.max.y >= otherMin.y);
};

/**
 * @method intersectsWithVector2
 * @description Return if [this] intersects with [other].
 * @param other {Aabb2}
 * @returns {boolean}
 */
Aabb2.prototype.intersectsWithVector2 = function(other) {
    return (this.min.x <= other.x) &&
           (this.min.y <= other.y) &&
           (this.max.x >= other.x) &&
           (this.max.y >= other.y);
};

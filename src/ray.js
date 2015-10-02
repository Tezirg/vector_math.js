/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = Ray;

var Vector3 = require('./vector3.js');
var Aabb3 = require('./aabb3.js');

/**
 * @class Ray
 * @description Defines a [Ray] by an [origin] and a [direction].
 * @constructor
 */
function Ray () {
    /**
     * @property origin
     * @type {Vector3}
     */
    this.origin = Vector3.zero();

    /**
     * @property direction
     * @type {Vector3}
     */
    this.direction = Vector3.zero();
}

/**
 * @static copy
 * @description Create a ray as a copy of [other].
 * @param other {Ray}
 * @return {Ray}
 */
Ray.copy = function(other) {
    var r = new Ray();
    r.origin.setFrom(other.origin);
    r.direction.setFrom(other.direction);
    return r;
};

/**
 * @static originDirection
 * @description Create a ray with an [origin] and a [direction].
 * @param origin {Vector3}
 * @param direction {Vector3}
 * @return {Ray}
 */
Ray.originDirection = function(origin, direction) {
    var r = new Ray();
    r.origin.setFrom(origin);
    r.direction.setFrom(direction);
    return r;
};

/**
 * @method copyFrom
 * @description Copy the [origin] and [direction] from [other] into [this].
 * @param other {Ray}
 */
Ray.prototype.copyFrom = function(other) {
    this.origin.setFrom(other.origin);
    this.direction.setFrom(other.direction);
};

/**
 * @method at
 * @description return the position on [this] with a distance of [t] from [origin].
 * @param t {Number}
 * @return {Vector3}
 */
Ray.prototype.at = function(t) {
    var res = this.direction.scaled(t);
    res.add(this.origin);
    return res;
};

/**
 * @method copyAt
 * @description Copy the position on [this] with a distance of [t] from [origin] into [other].
 * @param other {Vector3}
 * @param t {number}
 */
Ray.prototype.copyAt = function(other, t) {
    other.setFrom(this.direction);
    other.scale(t);
    other.add(this.origin);
};

/**
 * @method intersectsWithSphere
 * @description Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Sphere}
 * @return {number|null}
 */
Ray.prototype.intersectsWithSphere = function(other) {
    var r = other.radius;
    var r2 = r * r;
    var l = other.center.clone();
    l.sub(this.origin);
    var s = l.dot(this.direction);
    var l2 = l.dot(l);
    if (s < 0 && l2 > r2) {
        return null;
    }
    var m2 = l2 - s * s;
    if (m2 > r2) {
        return null;
    }
    var q = Math.sqrt(r2 - m2);

    return (l2 > r2) ? s - q : s + q;
};

// Some varaibles that are used for intersectsWithTriangle and
// intersectsWithQuad. The performance is better in JS if we avoid
// to create temporary instance over and over. Also reduce GC.
var _e1 = Vector3.zero();
var _e2 = Vector3.zero();
var _q = Vector3.zero();
var _s = Vector3.zero();
var _r = Vector3.zero();

/**
 * @method intersectsWithTriangle
 * @description Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Triangle}
 * @return {number | null}
 */
Ray.prototype.intersectsWithTriangle = function(other) {
    var EPSILON = 10e-6;

    var point0 = other.point0;
    var point1 = other.point1;
    var point2 = other.point2;

    _e1.setFrom(point1);
    _e1.sub(point0);
    _e2.setFrom(point2);
    _e2.sub(point0);

    _q = this.direction.cross(_e2);
    var a = _e1.dot(_q);

    if (a > -EPSILON && a < EPSILON) {
        return null;
    }

    var f = 1 / a;
    _s.setFrom(this.origin);
    _s.sub(point0);
    var u = f * (_s.dot(_q));

    if (u < 0.0) {
        return null;
    }

    _r = _s.cross(_e1);
    var v = f * (this.direction.dot(_r));

    if (v < -EPSILON || u + v > 1.0 + EPSILON) {
        return null;
    }

    var t = f * (_e2.dot(_r));

    return t;
};

/**
 * @method intersectsWithQuad
 * @description  Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Quad}
 * @return {number | null}
 */
Ray.prototype.intersectsWithQuad = function(other) {
    var EPSILON = 10e-6;

    // First triangle
    var point0 = other.point0;
    var point1 = other.point1;
    var point2 = other.point2;

    _e1.setFrom(point1);
    _e1.sub(point0);
    _e2.setFrom(point2);
    _e2.sub(point0);

    _q = this.direction.crossInto(_e2);
    var a0 = _e1.dot(_q);

    if (!(a0 > -EPSILON && a0 < EPSILON)) {
        var f = 1 / a0;
        _s.setFrom(this.origin);
        _s.sub(point0);
        var u = f * (_s.dot(_q));

        if (u >= 0.0) {
            _r = _s.cross(_e1);
            var v = f * (this.direction.dot(_r));

            if (!(v < -EPSILON || u + v > 1.0 + EPSILON)) {
                var t = f * (_e2.dot(_r));

                return t;
            }
        }
    }

    // Second triangle
    point0 = other.point3;
    point1 = other.point0;
    point2 = other.point2;

    _e1.setFrom(point1);
    _e1.sub(point0);
    _e2.setFrom(point2);
    _e2.sub(point0);

    _q = this.direction.cross(_e2);
    var a1 = _e1.dot(_q);

    if (!(a1 > -EPSILON && a1 < EPSILON)) {
        f = 1 / a1;
        _s.setFrom(this.origin);
        _s.sub(point0);
        u = f * (_s.dot(_q));

        if (u >= 0.0) {
            _r = _s.cross(_e1);
            v = f * (this.direction.dot(_r));

            if (!(v < -EPSILON || u + v > 1.0 + EPSILON)) {
                t = f * (_e2.dot(_r));

                return t;
            }
        }
    }

    return null;
};

/**
 * @method intersectsWithAabb3
 * @description Return the distance from the origin of [this] to the intersection with
 * [other] if [this] intersects with [other], or null if the don't intersect.
 * @param other {Aabb3}
 * @return {number | null}
 */
Ray.prototype.intersectsWithAabb3 = function(other) {
    var otherMin = other.min;
    var otherMax = other.max;

    var tNear =  - Number.MAX_VALUE; //-double.MAX_FINITE;
    var tFar = Number.MAX_VALUE; //double.MAX_FINITE;

    for (var i = 0; i < 3; ++i) {
        if (this.direction.storage[i] == 0.0) {
            if (this.origin.storage[i] < otherMin.storage[i] || this.origin.storage[i] > otherMax.storage[i]) {
                return null;
            }
        } else {
            var t1 = (otherMin.storage[i] - this.origin.storage[i]) / this.direction.storage[i];
            var t2 = (otherMax.storage[i] - this.origin.storage[i]) / this.direction.storage[i];

            if (t1 > t2) {
                var temp = t1;
                t1 = t2;
                t2 = temp;
            }

            if (t1 > tNear) {
                tNear = t1;
            }

            if (t2 < tFar) {
                tFar = t2;
            }

            if (tNear > tFar || tFar < 0.0) {
                return null;
            }
        }
    }

    return tNear;
};


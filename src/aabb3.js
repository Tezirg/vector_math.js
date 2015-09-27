/**
 * Created by grizet_j on 9/21/2015.
 */

module.exports = Aabb3;

var Vector3 = require('./vector3.js');
var Triangle = require('./triangle.js');
var Sphere = require('./sphere.js');
var Quad = require('./quad.js');
var Ray = require('./ray.js');
var Plane = require('./plane.js');

/**
 * @class Aabb3
 * Defines a 3-dimensional axis-aligned bounding box between a [min] and a [max] position.
 * @constructor
 */
function Aabb3() {
    /**
     * @property min
     * @type {Vector3}
     */
    this.min = Vector3.zero();

    /**
     * @property max
     * @type {Vector3}
     */
    this.max = Vector3.zero();
}

/**
 * @method
 * The center of the AABB.
 * @returns {Vector3}
 */
Aabb3.prototype.__defineGetter__("center", function() {
    var center = this.min.clone();
    center.add(this.max);
    center.scale(0.5);
    return center;
});


/**
 * @static
 * Create a new AABB as a copy of [other].
 * @param other {Aabb3}
 * @return {Aabb3}
 */
Aabb3.copy = function(other) {
    var bb = new Aabb3();
    bb.min.setFrom(other.min);
    bb.max.setFrom(other.max);
    return bb;
};

/**
 * @static
 * Create a new AABB with a [min] and [max].
 * @param min {Vector3}
 * @param max {Vector3}
 * @returns {Aabb3}
 */
Aabb3.minMax = function(min,  max) {
    var bb = new Aabb3();
    bb.min.setFrom(min);
    bb.max.setFrom(max);
    return bb;
};

/**
 * @static
 * Create a new AABB that encloses a [sphere].
 * @param sphere {Sphere}
 * @returns {Aabb3}
 */
Aabb3.fromSphere = function(sphere) {
    var bb = new Aabb3();
    bb.setSphere(sphere);
    return bb;
};

/**
 * @static
 * Create a new AABB that encloses a [triangle].
 * @param triangle {Triangle}
 * @returns {Aabb3}
 */
Aabb3.fromTriangle = function(triangle) {
    var bb = new Aabb3();
    bb.setTriangle(triangle);
    return bb;
};

/**
 * @static
 * Create a new AABB that encloses a [quad].
 * @param quad {Quad}
 * @returns {Aabb3}
 */
Aabb3.fromQuad = function(quad) {
    var bb = new Aabb3();
    bb.setQuad(quad);
    return bb;
};


/**
 * @static
 * Create a new AABB that encloses a limited [ray] (or line segment) that has
 * a minLimit and maxLimit.
 * @param ray {Ray}
 * @param limitMin {number}
 * @param limitMax {number}
 * @returns {Aabb3}
 */
Aabb3.fromRay = function(ray, limitMin, limitMax) {
    var bb = new Aabb3();
    bb.setRay(ray, limitMin, limitMax);
    return bb;
};


/**
 * @static
 * Create a new AABB with a [center] and [halfExtents].
 * @param center {Vector3}
 * @param halfExtents {Vector3}
 * @returns {Aabb3}
 */
Aabb3.centerAndHalfExtents = function(center, halfExtents) {
    var bb = new Aabb3();
    bb.setCenterAndHalfExtents(center, halfExtents);
    return bb;
};


/**
 * @static
 * Constructs [Aabb3] with a min/max [storage] that views given [buffer]
 * starting at [offset]. [offset] has to be multiple of [Float32Array.BYTES_PER_ELEMENT].
 * @param buffer {buffer}
 * @param offset {number}
 * @returns {Aabb3}
 */
Aabb3.fromBuffer = function(buffer, offset) {
    var bb = new Aabb3();
    bb.min = Vector3.fromBuffer(buffer, offset);
    bb.max = Vector3.fromBuffer(buffer, offset + Float32Array.BYTES_PER_ELEMENT * 3);
    return bb;
};

/**
 * @method
 * Set the AABB by a [center] and [halfExtents].
 * @param center {Vector3}
 * @param halfExtents {Vector3}
 */
Aabb3.prototype.setCenterAndHalfExtents = function(center, halfExtents) {
    this.min.setFrom(center);
    this.min.sub(halfExtents);
    this.max.setFrom(center);
    this.max.add(halfExtents);
};


/**
 * @method
 * Set the AABB to enclose a [sphere].
 * @param sphere {Sphere}
 */
Aabb3.setSphere = function(sphere) {
    this.min.splat(-sphere.radius);
    this.min.add(sphere.center);

    this.max.splat(sphere.radius);
    this.max.add(sphere.center);
};

/**
 * @method
 * Set the AABB to enclose a [triangle].
 * @param triangle {Triangle}
 */
Aabb3.prototype.setTriangle = function(triangle) {
    this.min.setValues(
        Math.min(triangle.point0.x,
            Math.min(triangle.point1.x, triangle.point2.x)),
        Math.min(triangle.point0.y,
            Math.min(triangle.point1.y, triangle.point2.y)),
        Math.min(triangle.point0.z,
            Math.min(triangle.point1.z, triangle.point2.z)));
    this.max.setValues(
        Math.max(triangle.point0.x,
            Math.max(triangle.point1.x, triangle.point2.x)),
        Math.max(triangle.point0.y,
            Math.max(triangle.point1.y, triangle.point2.y)),
        Math.max(triangle.point0.z,
            Math.max(triangle.point1.z, triangle.point2.z)));
};

/**
 * @method
 * Set the AABB to enclose a [quad].
 * @param quad {Quad}
 */
Aabb3.prototype.setQuad = function(quad) {
    this.min.setValues(
        Math.min(quad.point0.x,
            Math.min(quad.point1.x, Math.min(quad.point2.x, quad.point3.x))),
        Math.min(quad.point0.y,
            Math.min(quad.point1.y, Math.min(quad.point2.y, quad.point3.y))),
        Math.min(
            quad.point0.z,
            Math.min(
                quad.point1.z, Math.min(quad.point2.z, quad.point3.z))));
    this.max.setValues(
        Math.max(quad.point0.x,
            Math.max(quad.point1.x, Math.max(quad.point2.x, quad.point3.x))),
        Math.max(quad.point0.y,
            Math.max(quad.point1.y, Math.max(quad.point2.y, quad.point3.y))),
        Math.max(
            quad.point0.z,
            Math.max(
                quad.point1.z, Math.max(quad.point2.z, quad.point3.z))));
};


/**
 * @method
 * Set the AABB to enclose a limited [ray] (or line segment) that is limited by [limitMin] and [limitMax].
 * @param ray {Ray}
 * @param limitMin {number}
 * @param limitMax {number}
 */
Aabb3.prototype.setRay = function(ray, limitMin, limitMax) {
    ray.copyAt(this.min, limitMin);
    ray.copyAt(this.max, limitMax);

    if (this.max.x < this.min.x) {
        var temp = this.max.x;
        this.max.x = this.min.x;
        this.min.x = temp;
    }

    if (this.max.y < this.min.y) {
        temp = this.max.y;
        this.max.y = this.min.y;
        this.min.y = temp;
    }

    if (this.max.z < this.min.z) {
        temp = this.max.z;
        this.max.z = this.min.z;
        this.min.z = temp;
    }
};

/**
 * @method
 * Copy the [center] and the [halfExtends] of [this].
 * @param center {Vector3}
 * @param halfExtents {Vector3}
 */
Aabb3.prototype.copyCenterAndHalfExtents = function(center, halfExtents) {
    center.setFrom(this.min);
    center.add(this.max);
    center.scale(0.5);

    halfExtents.setFrom(this.max);
    halfExtents.sub(this.min);
    halfExtents.scale(0.5);
};

/**
 * @method
 * Copy the [center] of [this].
 * @param center {Vector3}
 */
Aabb3.prototype.copyCenter = function(center) {
    center.setFrom(this.min);
    center.add(this.max);
    center.scale(0.5);
};

/**
 * @method
 * Copy the [min] and [max] from [other] into [this].
 * @param other {Aabb3}
 */
Aabb3.prototype.copyFrom = function(other) {
    this.min.setFrom(other.min);
    this.max.setFrom(other.max);
};

/**
 * @method
 * Transform [this] by the transform [t].
 * @param t {Matrix4}
 * @returns {Aabb3}
 */
Aabb3.prototype.transform = function(t) {
    var center = Vector3.zero();
    var halfExtents = Vector3.zero();
    this.copyCenterAndHalfExtents(center, halfExtents);
    t.transform3(center);
    t.absoluteRotate(halfExtents);
    this.min.setFrom(center);
    this.min.sub(halfExtents);

    this.max.setFrom(center);
    this.max.add(halfExtents);
    return this;
};

/**
 * @method
 * Rotate [this] by the rotation matrix [t].
 * @param t {Matrix4}
 * @returns {Aabb3}
 */
Aabb3.prototype.rotate = function(t) {
    var center = Vector3.zero();
    var halfExtents = Vector3.zero();
    this.copyCenterAndHalfExtents(center, halfExtents);
    t.absoluteRotate(halfExtents);
    this.min.setFrom(center);
    this.min.sub(halfExtents);

    this.max.setFrom(center);
    this.max.add(halfExtents);
    return this;
};

/**
 * @method
 * Create a copy of [this] that is transformed by the transform [t] and store it in [out].
 * @param t {Matrix4}
 * @param out {Aabb3}
 */
Aabb3.prototype.transformed = function(t, out) {
    out.copyFrom(this);
    out.transform(t);
};

/**
 * @method
 * Create a copy of [this] that is rotated by the rotation matrix [t] and store it in [out].
 * @param t {Matrix4}
 * @param out {Aabb3}
 */
Aabb3.prototype.rotated = function(t, out) {
    out.copyFrom(this);
    out.rotate(t);
};

Aabb3.prototype.getPN = function(planeNormal, outP, outN) {
    if (planeNormal.x < 0.0) {
        outP.x = this.min.x;
        outN.x = this.max.x;
    } else {
        outP.x = this.max.x;
        outN.x = this.min.x;
    }

    if (planeNormal.y < 0.0) {
        outP.y = this.min.y;
        outN.y = this.max.y;
    } else {
        outP.y = this.max.y;
        outN.y = this.min.y;
    }

    if (planeNormal.z < 0.0) {
        outP.z = this.min.z;
        outN.z = this.max.z;
    } else {
        outP.z = this.max.z;
        outN.z = this.min.z;
    }
};

/**
 * @method
 * Set the min and max of [this] so that [this] is a hull of [this] and [other].
 * @param other {Aabb3}
 */
Aabb3.prototype.hull = function(other) {
    Vector3.min(this.min, other.min, this.min);
    Vector3.max(this.max, other.max, this.max);
};

/**
 * @method
 * Set the min and max of [this] so that [this] contains [point].
 * @param point {Vector3}
 */
Aabb3.prototype.hullPoint = function(point) {
    Vector3.min(this.min, point, this.min);
    Vector3.max(this.max, point, this.max);
};

/**
 * @method
 * Return if [this] contains [other].
 * @param other {Aabb3}
 * @returns {boolean}
 */
Aabb3.prototype.containsAabb3 = function(other) {
    var otherMax = other.max;
    var otherMin = other.min;

    return (this.min.x < otherMin.x) &&
           (this.min.y < otherMin.y) &&
           (this.min.z < otherMin.z) &&
           (this.max.x > otherMax.x) &&
           (this.max.y > otherMax.y) &&
           (this.max.z > otherMax.z);
};

/**
 * @method
 * Return if [this] contains [other].
 * @param other {Sphere}
 * @returns {boolean}
 */
Aabb3.prototype.containsSphere = function(other) {
    var boxExtends = Vector3.all(other.radius);
    var sphereBox = Aabb3.centerAndHalfExtents(other.center, boxExtends);

    return this.containsAabb3(sphereBox);
};

/**
 * @method
 * Return if [this] contains [other].
 * @param other {Vector3}
 * @returns {boolean}
 */
Aabb3.prototype.containsVector3 = function(other) {
    return (this.min.x < other.x) &&
        (this.min.y < other.y) &&
        (this.min.z < other.z) &&
        (this.max.x > other.x) &&
        (this.max.y > other.y) &&
        (this.max.z > other.z);
};

/**
 * @method
 * Return if [this] contains [other].
 * @param other {Triangle}
 * @returns {boolean}
 */
Aabb3.prototype.containsTriangle = function(other) {
    return (this.containsVector3(other.point0) &&
            this.containsVector3(other.point1) &&
            this.containsVector3(other.point2));
};

/**
 * @method
 * Return if [this] intersects with [other].
 * @param other {Aabb3}
 * @returns {boolean}
 */
Aabb3.prototype.intersectsWithAabb3 = function(other) {
    var otherMax = other.max;
    var otherMin = other.min;

    return (this.min.x <= otherMax.x) &&
        (this.min.y <= otherMax.y) &&
        (this.min.z <= otherMax.z) &&
        (this.max.x >= otherMin.x) &&
        (this.max.y >= otherMin.y) &&
        (this.max.z >= otherMin.z);
};

/**
 * @method
 * Return if [this] intersects with [other].
 * @param other {Sphere}
 * @returns {boolean}
 */
Aabb3.prototype.intersectsWithSphere = function(other) {
    var center = other.center;
    var radius = other.radius;
    var d = 0.0;
    var e = 0.0;

    for (var i = 0; i < 3; ++i) {
        if ((e = center[i] - this.min[i]) < 0.0) {
            if (e < -radius) {
                return false;
            }

            d = d + e * e;
        } else {
            if ((e = center[i] - this.max[i]) > 0.0) {
                if (e > radius) {
                    return false;
                }

                d = d + e * e;
            }
        }
    }

    return d <= radius * radius;
};

/**
 * Return if [this] intersects with [other].
 * @param other {Vector3}
 * @returns {boolean}
 */
Aabb3.prototype.intersectsWithVector3 = function(other) {
    return (this.min.x <= other.x) &&
        (this.min.y <= other.y) &&
        (this.min.z <= other.z) &&
        (this.max.x >= other.x) &&
        (this.max.y >= other.y) &&
        (this.max.z >= other.z);
};

// Avoid allocating these instance on every call to intersectsWithTriangle
var _aabbCenter = Vector3.zero();
var _aabbHalfExtents = Vector3.zero();
var _v0 = Vector3.zero();
var _v1 = Vector3.zero();
var _v2 = Vector3.zero();
var _f0 = Vector3.zero();
var _f1 = Vector3.zero();
var _f2 = Vector3.zero();
var _trianglePlane = new Plane();

/**
 * @method
 * Return if [this] intersects with [other].
 * @param other {Triangle}
 * @returns {boolean}
 */
Aabb3.prototype.intersectsWithTriangle = function(other) {
    var epsilon = Number.EPSILON;
    var p0, p1, p2, r, len;

    // This line isn't required if we are using center and half extents to
    // define a aabb
    this.copyCenterAndHalfExtents(_aabbCenter, _aabbHalfExtents);

    // Translate triangle as conceptually moving AABB to origin
    _v0.setFrom(other.point0);
    _v0.sub(_aabbCenter);
    _v1.setFrom(other.point1);
    _v1.sub(_aabbCenter);
    _v2.setFrom(other.point2);
    _v2.sub(_aabbCenter);

    // Translate triangle as conceptually moving AABB to origin
    _f0.setFrom(_v1);
    _f0.sub(_v0);
    _f1.setFrom(_v2);
    _f1.sub(_v1);
    _f2.setFrom(_v0);
    _f2.sub(_v2);

    // Test axes a00..a22 (category 3)
    // Test axis a00
    len = _f0.y * _f0.y + _f0.z * _f0.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.z * _f0.y - _v0.y * _f0.z;
        p2 = _v2.z * _f0.y - _v2.y * _f0.z;
        r = _aabbHalfExtents[1] * Math.abs(_f0.z) + _aabbHalfExtents[2] * Math.abs(_f0.y);
        if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a01
    len = _f1.y * _f1.y + _f1.z * _f1.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.z * _f1.y - _v0.y * _f1.z;
        p1 = _v1.z * _f1.y - _v1.y * _f1.z;
        r = _aabbHalfExtents[1] * Math.abs(_f1.z) + _aabbHalfExtents[2] * Math.abs(_f1.y);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a02
    len = _f2.y * _f2.y + _f2.z * _f2.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.z * _f2.y - _v0.y * _f2.z;
        p1 = _v1.z * _f2.y - _v1.y * _f2.z;
        r = _aabbHalfExtents[1] * Math.abs(_f2.z) + _aabbHalfExtents[2] * Math.abs(_f2.y);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a10
    len = _f0.x * _f0.x + _f0.z * _f0.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.x * _f0.z - _v0.z * _f0.x;
        p2 = _v2.x * _f0.z - _v2.z * _f0.x;
        r = _aabbHalfExtents[0] * Math.abs(_f0.z) + _aabbHalfExtents[2] * Math.abs(_f0.x);
        if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a11
    len = _f1.x * _f1.x + _f1.z * _f1.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.x * _f1.z - _v0.z * _f1.x;
        p1 = _v1.x * _f1.z - _v1.z * _f1.x;
        r = _aabbHalfExtents[0] * Math.abs(_f1.z) + _aabbHalfExtents[2] * Math.abs(_f1.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a12
    len = _f2.x * _f2.x + _f2.z * _f2.z;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.x * _f2.z - _v0.z * _f2.x;
        p1 = _v1.x * _f2.z - _v1.z * _f2.x;
        r = _aabbHalfExtents[0] * Math.abs(_f2.z) + _aabbHalfExtents[2] * Math.abs(_f2.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }
    }

    // Test axis a20
    len = _f0.x * _f0.x + _f0.y * _f0.y;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.y * _f0.x - _v0.x * _f0.y;
        p2 = _v2.y * _f0.x - _v2.x * _f0.y;
        r = _aabbHalfExtents[0] * Math.abs(_f0.y) + _aabbHalfExtents[1] * Math.abs(_f0.x);
        if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a21
    len = _f1.x * _f1.x + _f1.y * _f1.y;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.y * _f1.x - _v0.x * _f1.y;
        p1 = _v1.y * _f1.x - _v1.x * _f1.y;
        r = _aabbHalfExtents[0] * Math.abs(_f1.y) + _aabbHalfExtents[1] * Math.abs(_f1.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test axis a22
    len = _f2.x * _f2.x + _f2.y * _f2.y;
    if (len > epsilon) {
        // Ignore tests on degenerate axes.
        p0 = _v0.y * _f2.x - _v0.x * _f2.y;
        p1 = _v1.y * _f2.x - _v1.x * _f2.y;
        r = _aabbHalfExtents[0] * Math.abs(_f2.y) + _aabbHalfExtents[1] * Math.abs(_f2.x);
        if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
            return false; // Axis is a separating axis
        }

    }

    // Test the three axes corresponding to the face normals of AABB b (category 1). // Exit if...
    // ... [-e0, e0] and [min(v0.x,v1.x,v2.x), max(v0.x,v1.x,v2.x)] do not overlap
    if (Math.max(_v0.x, Math.max(_v1.x, _v2.x)) < -_aabbHalfExtents[0] ||
        Math.min(_v0.x, Math.min(_v1.x, _v2.x)) > _aabbHalfExtents[0]) {
        return false;
    }

    // ... [-e1, e1] and [min(v0.y,v1.y,v2.y), max(v0.y,v1.y,v2.y)] do not overlap
    if (Math.max(_v0.y, Math.max(_v1.y, _v2.y)) < -_aabbHalfExtents[1] ||
        Math.min(_v0.y, Math.min(_v1.y, _v2.y)) > _aabbHalfExtents[1]) {
        return false;
    }

    // ... [-e2, e2] and [min(v0.z,v1.z,v2.z), max(v0.z,v1.z,v2.z)] do not overlap
    if (Math.max(_v0.z, Math.max(_v1.z, _v2.z)) < -_aabbHalfExtents[2] ||
        Math.min(_v0.z, Math.min(_v1.z, _v2.z)) > _aabbHalfExtents[2]) {
        return false;
    }

    // It seems like that wee need to move the edges before creating the
    // plane
    _v0.add(_aabbCenter);

    // Test separating axis corresponding to triangle face normal (category 2)
    _trianglePlane.normal = _f0.cross(_f1);
    _trianglePlane.constant = _trianglePlane.normal.dot(_v0);
    return this.intersectsWithPlane(_trianglePlane);
};

/**
 * @method
 * Return if [this] intersects with [other]
 * @param other {Plane}
 * @returns {boolean}
 */
Aabb3.prototype.intersectsWithPlane = function(other) {
    // This line is not necessary with a (center, extents) AABB representation
    this.copyCenterAndHalfExtents(_aabbCenter, _aabbHalfExtents);

    // Compute the projection interval radius of b onto L(t) = b.c + t * p.n
    var r = _aabbHalfExtents[0] * Math.abs(other.normal[0]) +
    _aabbHalfExtents[1] * Math.abs(other.normal[1]) +
    _aabbHalfExtents[2] * Math.abs(other.normal[2]);
    // Compute distance of box center from plane
    var s = other.normal.dot(_aabbCenter) - other.constant;
    // Intersection occurs when distance s falls within [-r,+r] interval
    if (Math.abs(s) <= r) {
        return true;
    }

    return false;
};

// Avoid allocating these instance on every call to intersectsWithTriangle
var _quadTriangle0 = new Triangle();
var _quadTriangle1 = new Triangle();

/**
 * @method
 * Return if [this] intersects with [other].
 * @param other {Quad}
 * @returns {boolean}
 */
Aabb3.prototype.intersectsWithQuad = function(other) {
    other.copyTriangles(_quadTriangle0, _quadTriangle1);

    return this.intersectsWithTriangle(_quadTriangle0) ||
           this.intersectsWithTriangle(_quadTriangle1);
};
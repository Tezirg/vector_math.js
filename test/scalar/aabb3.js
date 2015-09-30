
var Aabb3 = require('../../src/aabb3.js');
var Vector3 = require('../../src/vector3.js');
var Matrix3 = require('../../src/matrix3.js');
var Ray = require('../../src/ray.js');
var Triangle = require('../../src/triangle.js');
var Sphere = require('../../src/sphere.js');
var Quad = require('../../src/quad.js');
var Plane = require('../../src/plane.js');
var TEST = require('./test_utils.js');

module.exports = {

    testAabb3ByteBufferInstanciation: function(test) {
        test.expect(12);
        var buffer = new Float32Array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]).buffer;
        var aabb = Aabb3.fromBuffer(buffer, 0);
        var aabbOffest = Aabb3.fromBuffer(buffer, Float32Array.BYTES_PER_ELEMENT);

        test.equals(aabb.min.x, (1.0));
        test.equals(aabb.min.y, (2.0));
        test.equals(aabb.min.z, (3.0));
        test.equals(aabb.max.x, (4.0));
        test.equals(aabb.max.y, (5.0));
        test.equals(aabb.max.z, (6.0));

        test.equals(aabbOffest.min.x, (2.0));
        test.equals(aabbOffest.min.y, (3.0));
        test.equals(aabbOffest.min.z, (4.0));
        test.equals(aabbOffest.max.x, (5.0));
        test.equals(aabbOffest.max.y, (6.0));
        test.equals(aabbOffest.max.z, (7.0));
        test.done();
    },

    testAabb3Center: function(test) {
        test.expect(3);
        var aabb = Aabb3.minMax(new Vector3(1.0, 2.0, 4.0), new Vector3(8.0, 16.0, 32.0));
        var center = aabb.center;

        test.equals(center.x, (4.5));
        test.equals(center.y, (9.0));
        test.equals(center.z, (18.0));
        test.done();
    },

    testAabb3CopyCenterAndHalfExtents: function(test) {
        test.expect(4);
        var a1 = Aabb3.minMax(new Vector3(10.0, 20.0, 30.0), new Vector3(20.0, 40.0, 60.0));
        var a2 = Aabb3.minMax(new Vector3(-10.0, -20.0, -30.0), new Vector3(0.0, 0.0, 0.0));

        var center = Vector3.zero();
        var halfExtents = Vector3.zero();

        a1.copyCenterAndHalfExtents(center, halfExtents);

        test.ok(center.almostEquals(new Vector3(15.0, 30.0, 45.0)));
        test.ok(halfExtents.almostEquals(new Vector3(5.0, 10.0, 15.0)));

        a2.copyCenterAndHalfExtents(center, halfExtents);

        test.ok(center.almostEquals(new Vector3(-5.0, -10.0, -15.0)));
        test.ok(halfExtents.almostEquals(new Vector3(5.0, 10.0, 15.0)));
        test.done();
    },

    testAabb3setCenterAndHalfExtents: function(test) {
        test.expect(4);
        var a1 = Aabb3.centerAndHalfExtents(new Vector3(0.0, 0.0, 0.0), new Vector3(10.0, 20.0, 30.0));
        var a2 = Aabb3.centerAndHalfExtents(
            new Vector3(-10.0, -20.0, -30.0), new Vector3(10.0, 20.0, 30.0));

        test.ok(a1.min.almostEquals(new Vector3(-10.0, -20.0, -30.0)));
        test.ok(a1.max.almostEquals(new Vector3(10.0, 20.0, 30.0)));

        test.ok(a2.min.almostEquals(new Vector3(-20.0, -40.0, -60.0)));
        test.ok(a2.max.almostEquals(new Vector3(0.0, 0.0, 0.0)));
        test.done();
    },

    testAabb3setSphere: function(test) {
        test.expect(2);
        var s = Sphere.centerRadius(new Vector3(10.0, 20.0, 30.0), 10.0);
        var a = Aabb3.fromSphere(s);

        test.equals(a.intersectsWithVector3(a.center), true);
        test.equals(a.intersectsWithVector3(new Vector3(20.0, 20.0, 30.0)), true);
        test.done();
    },

    testAabb3setRay: function(test) {
        test.expect(2);
        var r = Ray.originDirection(
            new Vector3(1.0, 2.0, 3.0), new Vector3(1.0, 5.0, -1.0).normalized());
        var a = Aabb3.fromRay(r, 0.0, 10.0);

        test.equals(a.intersectsWithVector3(r.at(0.0)), true);
        test.equals(a.intersectsWithVector3(r.at(10.0)), true);
        test.done();
    },

    testAabb3setTriangle: function(test) {
        test.expect(3);
        var t = Triangle.points(
            new Vector3(2.0, 0.0, 0.0), new Vector3(0.0, 2.0, 0.0), new Vector3(0.0, 0.0, 2.0));
        var a = Aabb3.fromTriangle(t);

        test.equals(a.intersectsWithVector3(t.point0), true);
        test.equals(a.intersectsWithVector3(t.point1), true);
        test.equals(a.intersectsWithVector3(t.point2), true);
        test.done();
    },

    testAabb3setQuad: function(test) {
        test.expect(4);
        var q = Quad.points(new Vector3(2.0, 0.0, 0.0), new Vector3(0.0, 2.0, 0.0),
                            new Vector3(0.0, 0.0, 2.0), new Vector3(0.0, 0.0, -2.0));
        var a = Aabb3.fromQuad(q);

        test.equals(a.intersectsWithVector3(q.point0), true);
        test.equals(a.intersectsWithVector3(q.point1), true);
        test.equals(a.intersectsWithVector3(q.point2), true);
        test.equals(a.intersectsWithVector3(q.point3), true);
        test.done();
    },

    testAabb3ContainsAabb3: function(test) {
        test.expect(5);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child = Aabb3.minMax(new Vector3(2.0, 2.0, 2.0), new Vector3(7.0, 7.0, 7.0));
        var cutting = Aabb3.minMax(new Vector3(0.0, 0.0, 0.0), new Vector3(5.0, 5.0, 5.0));
        var outside =
            Aabb3.minMax(new Vector3(10.0, 10.0, 10.0), new Vector3(20.0, 20.0, 20.0));
        var grandParent =
        Aabb3.minMax(new Vector3(0.0, 0.0, 0.0), new Vector3(10.0, 10.0, 10.0));

        test.equals(parent.containsAabb3(child), true);
        test.equals(parent.containsAabb3(parent), false);
        test.equals(parent.containsAabb3(cutting), false);
        test.equals(parent.containsAabb3(outside), false);
        test.equals(parent.containsAabb3(grandParent), false);
        test.done();
    },

    testAabb3ContainsSphere: function(test) {
        test.expect(3);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child = Sphere.centerRadius(new Vector3(3.0, 3.0, 3.0), 1.5);
        var cutting = Sphere.centerRadius(new Vector3(0.0, 0.0, 0.0), 6.0);
        var outside = Sphere.centerRadius(new Vector3(-10.0, -10.0, -10.0), 5.0);

        test.equals(parent.containsSphere(child), true);
        test.equals(parent.containsSphere(cutting), false);
        test.equals(parent.containsSphere(outside), false);
        test.done();
    },

    testAabb3ContainsVector3: function(test) {
        test.expect(3);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child = new Vector3(7.0, 7.0, 7.0);
        var cutting = new Vector3(1.0, 2.0, 1.0);
        var outside = new Vector3(-10.0, 10.0, 10.0);

        test.equals(parent.containsVector3(child), true);
        test.equals(parent.containsVector3(cutting), false);
        test.equals(parent.containsVector3(outside), false);
        test.done();
    },

    testAabb3ContainsTriangle: function(test) {
        test.expect(4);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child = Triangle.points(
            new Vector3(2.0, 2.0, 2.0), new Vector3(3.0, 3.0, 3.0), new Vector3(4.0, 4.0, 4.0));
        var edge = Triangle.points(
            new Vector3(1.0, 1.0, 1.0), new Vector3(3.0, 3.0, 3.0), new Vector3(4.0, 4.0, 4.0));
        var cutting = Triangle.points(
            new Vector3(2.0, 2.0, 2.0), new Vector3(3.0, 3.0, 3.0), new Vector3(14.0, 14.0, 14.0));
        var outside = Triangle.points(
            new Vector3(0.0, 0.0, 0.0), new Vector3(-3.0, -3.0, -3.0), new Vector3(-4.0, -4.0, -4.0));

        test.equals(parent.containsTriangle(child), true);
        test.equals(parent.containsTriangle(edge), false);
        test.equals(parent.containsTriangle(cutting), false);
        test.equals(parent.containsTriangle(outside), false);
        test.done();
    },

    testAabb3IntersectionAabb3: function(test) {
        test.expect(11);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child =  Aabb3.minMax(new Vector3(2.0, 2.0, 2.0), new Vector3(7.0, 7.0, 7.0));
        var cutting =  Aabb3.minMax(new Vector3(0.0, 0.0, 0.0), new Vector3(5.0, 5.0, 5.0));
        var outside =
            Aabb3.minMax(new Vector3(10.0, 10.0, 10.0), new Vector3(20.0, 20.0, 10.0));
        var grandParent =
             Aabb3.minMax(new Vector3(0.0, 0.0, 0.0), new Vector3(10.0, 10.0, 10.0));

        var siblingOne = Aabb3.minMax(new Vector3(0.0, 0.0, 0.0), new Vector3(3.0, 3.0, 3.0));
        var siblingTwo = Aabb3.minMax(new Vector3(3.0, 0.0, 0.0), new Vector3(6.0, 3.0, 3.0));
        var siblingThree = Aabb3.minMax(new Vector3(3.0, 3.0, 3.0), new Vector3(6.0, 6.0, 6.0));

        test.equals(parent.intersectsWithAabb3(child), true);
        test.equals(child.intersectsWithAabb3(parent), true);

        test.equals(parent.intersectsWithAabb3(parent), true);

        test.equals(parent.intersectsWithAabb3(cutting), true);
        test.equals(cutting.intersectsWithAabb3(parent), true);

        test.equals(parent.intersectsWithAabb3(outside), false);
        test.equals(outside.intersectsWithAabb3(parent), false);

        test.equals(parent.intersectsWithAabb3(grandParent), true);
        test.equals(grandParent.intersectsWithAabb3(parent), true);

        test.equals(siblingOne.intersectsWithAabb3(siblingTwo), true);
        test.equals(siblingOne.intersectsWithAabb3(siblingThree), true);
        test.done();
    },

    testAabb3IntersectionSphere: function(test) {
        test.expect(3);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child = Sphere.centerRadius(new Vector3(3.0, 3.0, 3.0), 1.5);
        var cutting = Sphere.centerRadius(new Vector3(0.0, 0.0, 0.0), 6.0);
        var outside = Sphere.centerRadius(new Vector3(-10.0, -10.0, -10.0), 5.0);

        test.equals(parent.intersectsWithSphere(child), true);
        test.equals(parent.intersectsWithSphere(cutting), true);
        test.equals(parent.intersectsWithSphere(outside), false);
        test.done();
    },

    testIntersectionTriangle: function(test) {
        test.expect(9);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child = Triangle.points(
            new Vector3(2.0, 2.0, 2.0), new Vector3(3.0, 3.0, 3.0), new Vector3(4.0, 4.0, 4.0));
        var edge = Triangle.points(
            new Vector3(1.0, 1.0, 1.0), new Vector3(3.0, 3.0, 3.0), new Vector3(4.0, 4.0, 4.0));
        var cutting = Triangle.points(
            new Vector3(2.0, 2.0, 2.0), new Vector3(3.0, 3.0, 3.0), new Vector3(14.0, 14.0, 14.0));
        var outside = Triangle.points(
            new Vector3(0.0, 0.0, 0.0), new Vector3(-3.0, -3.0, -3.0), new Vector3(-4.0, -4.0, -4.0));

        test.equals(parent.intersectsWithTriangle(child), true);
        test.equals(parent.intersectsWithTriangle(edge), true);
        test.equals(parent.intersectsWithTriangle(cutting), true);
        test.equals(parent.intersectsWithTriangle(outside), false);

        // Special tests
        var testAabb = Aabb3.minMax(
            new Vector3(20.458911895751953, -36.607460021972656, 2.549999952316284),
            new Vector3(21.017810821533203, -36.192543029785156, 3.049999952316284));
        var testTriangle = Triangle.points(
            new Vector3(20.5, -36.5, 3.5), new Vector3(21.5, -36.5, 2.5), new Vector3(20.5, -36.5, 2.5));
        test.equals(testAabb.intersectsWithTriangle(testTriangle), true);

        var aabb = Aabb3.minMax(
            new Vector3(19.07674217224121, -39.46818161010742, 2.299999952316284),
            new Vector3(19.40754508972168, -38.9503288269043, 2.799999952316284));
        var triangle4 = Triangle.points(
            new Vector3(18.5, -39.5, 2.5), new Vector3(19.5, -39.5, 2.5), new Vector3(19.5, -38.5, 2.5));
        var triangle4_1 = Triangle.points(
            new Vector3(19.5, -38.5, 2.5), new Vector3(19.5, -39.5, 2.5), new Vector3(18.5, -39.5, 2.5));
        var triangle4_2 = Triangle.points(
            new Vector3(18.5, -39.5, 2.5), new Vector3(19.5, -38.5, 2.5), new Vector3(18.5, -38.5, 2.5));
        var triangle4_3 = Triangle.points(
        new Vector3(18.5, -38.5, 2.5), new Vector3(19.5, -38.5, 2.5), new Vector3(18.5, -39.5, 2.5));

        test.equals(aabb.intersectsWithTriangle(triangle4), true);
        test.equals(aabb.intersectsWithTriangle(triangle4_1), true);
        test.equals(aabb.intersectsWithTriangle(triangle4_2), false);
        test.equals(aabb.intersectsWithTriangle(triangle4_3), false);
        test.done();
    },

    testIntersectionPlane: function(test) {
        test.expect(3);
        var plane =  Plane.normalconstant(new Vector3(1.0, 0.0, 0.0), 10.0);

        var left = Aabb3.minMax(new Vector3(-5.0, -5.0, -5.0), new Vector3(5.0, 5.0, 5.0));
        var right = Aabb3.minMax(new Vector3(15.0, 15.0, 15.0), new Vector3(30.0, 30.0, 30.0));
        var intersect = Aabb3.minMax(new Vector3(5.0, 5.0, 5.0), new Vector3(15.0, 15.0, 15.0));

        test.equals(left.intersectsWithPlane(plane), false);
        test.equals(right.intersectsWithPlane(plane), false);


        test.equals(intersect.intersectsWithPlane(plane), true);

        test.done();
    },

    testAabb3IntersectionVector3: function(test) {
        test.expect(3);
        var parent = Aabb3.minMax(new Vector3(1.0, 1.0, 1.0), new Vector3(8.0, 8.0, 8.0));
        var child = new Vector3(7.0, 7.0, 7.0);
        var cutting = new Vector3(1.0, 2.0, 1.0);
        var outside = new Vector3(-10.0, 10.0, 10.0);

        test.equals(parent.intersectsWithVector3(child), true);
        test.equals(parent.intersectsWithVector3(cutting), true);
        test.equals(parent.intersectsWithVector3(outside), false);
        test.done();
    },

    testAabb3Hull: function(test) {
        test.expect(6);
        var a = Aabb3.minMax(new Vector3(1.0, 1.0, 4.0), new Vector3(3.0, 4.0, 10.0));
        var b = Aabb3.minMax(new Vector3(3.0, 2.0, 3.0), new Vector3(6.0, 2.0, 8.0));

        a.hull(b);

        test.equals(a.min.x, (1.0));
        test.equals(a.min.y, (1.0));
        test.equals(a.min.z, (3.0));
        test.equals(a.max.x, (6.0));
        test.equals(a.max.y, (4.0));
        test.equals(a.max.z, (10.0));
        test.done();
    },

    testAabb3HullPoint: function(test) {
        test.expect(12);
        var a = Aabb3.minMax(new Vector3(1.0, 1.0, 4.0), new Vector3(3.0, 4.0, 10.0));
        var b = new Vector3(6.0, 2.0, 8.0);

        a.hullPoint(b);

        test.equals(a.min.x, (1.0));
        test.equals(a.min.y, (1.0));
        test.equals(a.min.z, (4.0));
        test.equals(a.max.x, (6.0));
        test.equals(a.max.y, (4.0));
        test.equals(a.max.z, (10.0));

        var c = new Vector3(6.0, 0.0, 2.0);

        a.hullPoint(c);

        test.equals(a.min.x, (1.0));
        test.equals(a.min.y, (0.0));
        test.equals(a.min.z, (2.0));
        test.equals(a.max.x, (6.0));
        test.equals(a.max.y, (4.0));
        test.equals(a.max.z, (10.0));
        test.done();
    }

};

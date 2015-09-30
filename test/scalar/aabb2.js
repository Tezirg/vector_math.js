
var Aabb2 = require('../../src/aabb2.js');
var Matrix2 = require('../../src/matrix2.js');
var Matrix3 = require('../../src/matrix3.js');
var Vector2 = require('../../src/vector2.js');
var TEST = require('./test_utils.js');

module.exports = {

    testAabb2Center: function(test) {
        test.expect(2);
        var aabb = Aabb2.minMax(new Vector2(1.0, 2.0), new Vector2(8.0, 16.0));
        var center = aabb.center;

        test.equals(center.x, (4.5));
        test.equals(center.y, (9.0));
        test.done();
    },

    testAabb2CopyCenterAndHalfExtents: function(test) {
        test.expect(4);
        var a1 = Aabb2.minMax(new Vector2(10.0, 20.0), new Vector2(20.0, 40.0));
        var a2 = Aabb2.minMax(new Vector2(-10.0, -20.0), new Vector2(0.0, 0.0));

        var center = Vector2.zero();
        var halfExtents = Vector2.zero();

        a1.copyCenterAndHalfExtents(center, halfExtents);

        test.ok(center.almostEquals(new Vector2(15.0, 30.0)));
        test.ok(halfExtents.almostEquals(new Vector2(5.0, 10.0)));

        a2.copyCenterAndHalfExtents(center, halfExtents);

        test.ok(center.almostEquals(new Vector2(-5.0, -10.0)));
        test.ok(halfExtents.almostEquals(new Vector2(5.0, 10.0)));
        test.done();
    },

    testAabb2CenterAndHalfExtents: function(test) {
        test.expect(4);
        var a1 = Aabb2.centerAndHalfExtents(new Vector2(0.0, 0.0), new Vector2(10.0, 20.0));
        var a2 = Aabb2.centerAndHalfExtents(new Vector2(-10.0, -20.0), new Vector2(10.0, 20.0));

        test.ok(a1.min.almostEquals(new Vector2(-10.0, -20.0)));
        test.ok(a1.max.almostEquals(new Vector2(10.0, 20.0)));

        test.ok(a2.min.almostEquals(new Vector2(-20.0, -40.0)));
        test.ok(a2.max.almostEquals(new Vector2(0.0, 0.0)));
        test.done();
    },

    testAabb2SetCenterAndHalfExtents: function(test) {
        test.expect(4);
        var a1 = new Aabb2();
        var a2 = new Aabb2();

        a1.setCenterAndHalfExtents(new Vector2(0.0, 0.0), new Vector2(10.0, 20.0));

        test.ok(a1.min.almostEquals(new Vector2(-10.0, -20.0)));
        test.ok(a1.max.almostEquals(new Vector2(10.0, 20.0)));

        a2.setCenterAndHalfExtents(new Vector2(-10.0, -20.0), new Vector2(10.0, 20.0));

        test.ok(a2.min.almostEquals(new Vector2(-20.0, -40.0)));
        test.ok(a2.max.almostEquals(new Vector2(0.0, 0.0)));
        test.done();
    },

    testAabb2ContainsAabb2: function(test) {
        test.expect(5);
        var parent = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(8.0, 8.0));
        var child = Aabb2.minMax(new Vector2(2.0, 2.0), new Vector2(7.0, 7.0));
        var cutting = Aabb2.minMax(new Vector2(0.0, 0.0), new Vector2(5.0, 5.0));
        var outside = Aabb2.minMax(new Vector2(10.0, 10.0), new Vector2(20.0, 20.0));
        var grandParent = Aabb2.minMax(new Vector2(0.0, 0.0), new Vector2(10.0, 10.0));

        test.equals(parent.containsAabb2(child), true);
        test.equals(parent.containsAabb2(parent), false);
        test.equals(parent.containsAabb2(cutting), false);
        test.equals(parent.containsAabb2(outside), false);
        test.equals(parent.containsAabb2(grandParent), false);
        test.done();
    },

    testAabb2ContainsVector2: function(test) {
        test.expect(3);
        var parent = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(8.0, 8.0));
        var child = new Vector2(2.0, 2.0);
        var cutting = new Vector2(1.0, 8.0);
        var outside = new Vector2(-1.0, 0.0);

        test.equals(parent.containsVector2(child), true);
        test.equals(parent.containsVector2(cutting), false);
        test.equals(parent.containsVector2(outside), false);
        test.done();
    },

    testAabb2IntersectionAabb2: function(test) {
        test.expect(11);
        var parent = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(8.0, 8.0));
        var child =  Aabb2.minMax(new Vector2(2.0, 2.0), new Vector2(7.0, 7.0));
        var cutting =  Aabb2.minMax(new Vector2(0.0, 0.0), new Vector2(5.0, 5.0));
        var outside =  Aabb2.minMax(new Vector2(10.0, 10.0), new Vector2(20.0, 20.0));
        var grandParent =  Aabb2.minMax(new Vector2(0.0, 0.0), new Vector2(10.0, 10.0));

        var siblingOne =  Aabb2.minMax(new Vector2(0.0, 0.0), new Vector2(3.0, 3.0));
        var siblingTwo =  Aabb2.minMax(new Vector2(3.0, 0.0), new Vector2(6.0, 3.0));
        var siblingThree = Aabb2.minMax(new Vector2(3.0, 3.0), new Vector2(6.0, 6.0));

        test.equals(parent.intersectsWithAabb2(child), true);
        test.equals(child.intersectsWithAabb2(parent), true);

        test.equals(parent.intersectsWithAabb2(parent), true);

        test.equals(parent.intersectsWithAabb2(cutting), true);
        test.equals(cutting.intersectsWithAabb2(parent), true);

        test.equals(parent.intersectsWithAabb2(outside), false);
        test.equals(outside.intersectsWithAabb2(parent), false);

        test.equals(parent.intersectsWithAabb2(grandParent), true);
        test.equals(grandParent.intersectsWithAabb2(parent), true);

        test.equals(siblingOne.intersectsWithAabb2(siblingTwo), true);
        test.equals(siblingOne.intersectsWithAabb2(siblingThree), true);
        test.done();
    },

    testAabb2IntersectionVector2: function(test) {
        test.expect(3);
        var parent = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(8.0, 8.0));
        var child = new Vector2(2.0, 2.0);
        var cutting = new Vector2(1.0, 8.0);
        var outside = new Vector2(-1.0, 0.0);

        test.equals(parent.intersectsWithVector2(child), true);
        test.equals(parent.intersectsWithVector2(cutting), true);
        test.equals(parent.intersectsWithVector2(outside), false);
        test.done();
    },

    testAabb2Hull: function(test) {
        test.expect(4);
        var a = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(3.0, 4.0));
        var b = Aabb2.minMax(new Vector2(3.0, 2.0), new Vector2(6.0, 2.0));

        a.hull(b);

        test.equals(a.min.x, (1.0));
        test.equals(a.min.y, (1.0));
        test.equals(a.max.x, (6.0));
        test.equals(a.max.y, (4.0));
        test.done();
    },

    testAabb2HullPoint: function(test) {
        test.expect(8);
        var a = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(3.0, 4.0));
        var b = new Vector2(6.0, 2.0);

        a.hullPoint(b);

        test.equals(a.min.x, (1.0));
        test.equals(a.min.y, (1.0));
        test.equals(a.max.x, (6.0));
        test.equals(a.max.y, (4.0));

        var c = new Vector2(0.0, 1.0);

        a.hullPoint(c);

        test.equals(a.min.x, (0.0));
        test.equals(a.min.y, (1.0));
        test.equals(a.max.x, (6.0));
        test.equals(a.max.y, (4.0));
        test.done();
    },

    testAabb2Rotate: function(test) {
        test.expect(6);
        var rotation = Matrix3.rotationZ(Math.PI / 4);
        var input = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(3.0, 3.0));

        var result = input.rotate(rotation);

        TEST.relativeTest(test, result.min.x, 2 - Math.sqrt(2));
        TEST.relativeTest(test, result.min.y, 2 - Math.sqrt(2));
        TEST.relativeTest(test, result.max.x, 2 + Math.sqrt(2));
        TEST.relativeTest(test, result.max.y, 2 + Math.sqrt(2));
        TEST.relativeTest(test, result.center.x, 2.0);
        TEST.relativeTest(test, result.center.y, 2.0);
        test.done();
    },

    testAabb2Transform: function(test) {
        test.expect(6);
        var rotation = Matrix3.rotationZ(Math.PI / 4);
        var input = Aabb2.minMax(new Vector2(1.0, 1.0), new Vector2(3.0, 3.0));

        var result = input.transform(rotation);
        var newCenterY = Math.sqrt(8);

        TEST.relativeTest(test, result.min.x, -Math.sqrt(2));
        TEST.relativeTest(test, result.min.y, newCenterY - Math.sqrt(2));
        TEST.relativeTest(test, result.max.x, Math.sqrt(2));
        TEST.relativeTest(test, result.max.y, newCenterY + Math.sqrt(2));
        TEST.relativeTest(test, result.center.x, 0.0);
        TEST.relativeTest(test, result.center.y, newCenterY);
        test.done();
    }
};
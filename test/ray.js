/**
 * Created by grizet_j on 9/21/2015.
 */

var Ray = require('../src/ray.js');
var Vector3 = require('../src/vector3.js');
var Sphere = require('../src/sphere.js');
var Triangle = require('../src/triangle.js');
var Aabb3 = require('../src/aabb3.js');
var TEST = require('./test_utils.js');

module.exports = {
    testRayAt: function(test) {
        test.expect(18);
        var parent = Ray.originDirection(new Vector3(1.0, 1.0, 1.0), new Vector3(-1.0, 1.0, 1.0));

        var atOrigin = parent.at(0.0);
        var atPositive = parent.at(1.0);
        var atNegative = parent.at(-2.0);

        test.equals(atOrigin.x, (1.0));
        test.equals(atOrigin.y, (1.0));
        test.equals(atOrigin.z, (1.0));
        test.equals(atPositive.x, (0.0));
        test.equals(atPositive.y, (2.0));
        test.equals(atPositive.z, (2.0));
        test.equals(atNegative.x, (3.0));
        test.equals(atNegative.y, (-1.0));
        test.equals(atNegative.z, (-1.0));

        atOrigin.setZero();
        atPositive.setZero();
        atNegative.setZero();

        parent.copyAt(atOrigin, 0.0);
        parent.copyAt(atPositive, 1.0);
        parent.copyAt(atNegative, -2.0);

        test.equals(atOrigin.x, (1.0));
        test.equals(atOrigin.y, (1.0));
        test.equals(atOrigin.z, (1.0));
        test.equals(atPositive.x, (0.0));
        test.equals(atPositive.y, (2.0));
        test.equals(atPositive.z, (2.0));
        test.equals(atNegative.x, (3.0));
        test.equals(atNegative.y, (-1.0));
        test.equals(atNegative.z, (-1.0));
        test.done();
    },

    testRayIntersectionSphere: function(test) {
        test.expect(5);
        var parent = Ray.originDirection(new Vector3(1.0, 1.0, 1.0), new Vector3(0.0, 1.0, 0.0));
        var inside = Sphere.centerRadius(new Vector3(2.0, 1.0, 1.0), 2.0);
        var hitting = Sphere.centerRadius(new Vector3(2.5, 4.5, 1.0), 2.0);
        var cutting = Sphere.centerRadius(new Vector3(0.0, 5.0, 1.0), 1.0);
        var outside = Sphere.centerRadius(new Vector3(-2.5, 1.0, 1.0), 1.0);
        var behind = Sphere.centerRadius(new Vector3(1.0, -1.0, 1.0), 1.0);

        test.equals(parent.intersectsWithSphere(inside), (Math.sqrt(3.0)));
        test.equals(parent.intersectsWithSphere(hitting), (3.5 - Math.sqrt(1.75)));
        test.equals(parent.intersectsWithSphere(cutting), (4.0));
        test.equals(parent.intersectsWithSphere(outside), (null));
        test.equals(parent.intersectsWithSphere(behind), (null));
        test.done();
    },

    testRayIntersectionTriangle: function(test) {
        test.expect(6);
        var parent = Ray.originDirection(new Vector3(1.0, 1.0, 1.0), new Vector3(0.0, 1.0, 0.0));
        var hitting = Triangle.points(
            new Vector3(2.0, 2.0, 0.0), new Vector3(0.0, 4.0, -1.0), new Vector3(0.0, 4.0, 3.0));
        var cutting = Triangle.points(
            new Vector3(0.0, 1.5, 1.0), new Vector3(2.0, 1.5, 1.0), new Vector3(1.0, 1.5, 3.0));
        var outside = Triangle.points(
            new Vector3(2.0, 2.0, 0.0), new Vector3(2.0, 6.0, 0.0), new Vector3(2.0, 2.0, 3.0));
        var behind = Triangle.points(
            new Vector3(0.0, 0.0, 0.0), new Vector3(0.0, 3.0, 0.0), new Vector3(0.0, 3.0, 4.0));

        TEST.absoluteTest(test, parent.intersectsWithTriangle(hitting), 2.0);
        TEST.absoluteTest(test, parent.intersectsWithTriangle(cutting), 0.5);
        test.equals(parent.intersectsWithTriangle(outside), (null));
        test.equals(parent.intersectsWithTriangle(behind), (null));

        // Test cases from real-world failures:
        // Just barely intersects, but gets rounded out
        var p2 = Ray.originDirection(
            new Vector3(0.0, -0.16833500564098358, 0.7677000164985657),
            new Vector3(-0.0, -0.8124330043792725, -0.5829949975013733));
        var t2 = Triangle.points(
            new Vector3(0.03430179879069328, -0.7268069982528687, 0.3532710075378418),
            new Vector3(0.0, -0.7817990183830261, 0.3641969859600067),
            new Vector3(0.0, -0.7293699979782104, 0.3516849875450134));
        TEST.relativeTest(test, p2.intersectsWithTriangle(t2), 0.7078371874391822);
        // Ray is not quite perpendicular to triangle, but gets rounded out
        var p3 = Ray.originDirection(
            new Vector3(0.023712199181318283, -0.15045200288295746, 0.7751160264015198),
            new Vector3(0.6024960279464722, -0.739005982875824, -0.3013699948787689));
        var t3 = Triangle.points(
            new Vector3(0.16174300014972687, -0.3446039855480194, 0.7121580243110657),
        new Vector3(0.1857299953699112, -0.3468630015850067, 0.6926270127296448),
            new Vector3(0.18045000731945038, -0.3193660080432892, 0.6921690106391907));
        TEST.relativeTest(test, p3.intersectsWithTriangle(t3), 0.2538471189773835);
        test.done();
    },

    testRayIntersectionAabb3: function(test) {
        test.expect(5);
        var parent = Ray.originDirection(new Vector3(1.0, 1.0, 1.0), new Vector3(0.0, 1.0, 0.0));
        var hitting = Aabb3.minMax(new Vector3(0.5, 3.5, -10.0), new Vector3(2.5, 5.5, 10.0));
        var cutting = Aabb3.minMax(new Vector3(0.0, 2.0, 1.0), new Vector3(2.0, 3.0, 2.0));
        var outside = Aabb3.minMax(new Vector3(2.0, 0.0, 0.0), new Vector3(6.0, 6.0, 6.0));
        var behind = Aabb3.minMax(new Vector3(0.0, -2.0, 0.0), new Vector3(2.0, 0.0, 2.0));
        var inside = Aabb3.minMax(new Vector3(0.0, 0.0, 0.0), new Vector3(2.0, 2.0, 2.0));

        test.equals(parent.intersectsWithAabb3(hitting), (2.5));
        test.equals(parent.intersectsWithAabb3(cutting), (1.0));
        test.equals(parent.intersectsWithAabb3(outside), (null));
        test.equals(parent.intersectsWithAabb3(behind), (null));
        test.equals(parent.intersectsWithAabb3(inside), (-1.0));
        test.done();
    }
};
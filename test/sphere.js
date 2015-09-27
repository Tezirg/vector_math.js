/**
 * Created by grizet_j on 9/21/2015.
 */

var Sphere = require('../src/sphere.js');
var Vector3 = require('../src/vector3.js');

module.exports = {

    testSphereContainsVector3: function(test) {
        test.expect(3);
        var parent = Sphere.centerRadius(new Vector3(1.0, 1.0, 1.0), 2.0);
        var child = new Vector3(1.0, 1.0, 2.0);
        var cutting = new Vector3(1.0, 3.0, 1.0);
        var outside = new Vector3(-10.0, 10.0, 10.0);

        test.ok(parent.containsVector3(child));
        test.ok( ! parent.containsVector3(cutting));
        test.ok(! parent.containsVector3(outside));
        test.done();
    },

    testSphereIntersectionVector3: function(test) {
        test.expect(3);
        var parent = Sphere.centerRadius(new Vector3(1.0, 1.0, 1.0), 2.0);
        var child = new Vector3(1.0, 1.0, 2.0);
        var cutting = new Vector3(1.0, 3.0, 1.0);
        var outside = new Vector3(-10.0, 10.0, 10.0);

        test.ok(parent.intersectsWithVector3(child));
        test.ok(parent.intersectsWithVector3(cutting));
        test.ok(! parent.intersectsWithVector3(outside));
        test.done();
    },

    testSphereIntersectionSphere: function(test) {
        test.expect(3);
        var parent = Sphere.centerRadius(new Vector3(1.0, 1.0, 1.0), 2.0);
        var child = Sphere.centerRadius(new Vector3(1.0, 1.0, 2.0), 1.0);
        var cutting = Sphere.centerRadius(new Vector3(1.0, 6.0, 1.0), 3.0);
        var outside = Sphere.centerRadius(new Vector3(10.0, -1.0, 1.0), 1.0);

        test.ok(parent.intersectsWithSphere(child));
        test.ok(parent.intersectsWithSphere(cutting));
        test.ok(! parent.intersectsWithSphere(outside));
        test.done();
    }
};
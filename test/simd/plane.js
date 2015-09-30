/**
 * Created by grizet_j on 9/21/2015.
 */
var Plane = require('../../src/plane.js');
var Vector3 = require('../../src/vector3.js');

var SIMD = require("simd");

module.exports = {

    testPlaneNormalize: function(test) {
        test.expect(5);
        var plane = Plane.normalconstant(new Vector3(2.0, 0.0, 0.0), 2.0);

        plane.normalize();

        test.equals(plane.normal.x, (1.0));
        test.equals(plane.normal.y, (0.0));
        test.equals(plane.normal.z, (0.0));
        test.equals(plane.normal.length, (1.0));
        test.equals(plane.constant, (1.0));
        test.done();
    },

    testPlaneDistanceToVector3: function(test) {
        test.expect(2);
        var plane = Plane.normalconstant(new Vector3(2.0, 0.0, 0.0), -2.0);

        plane.normalize();

        test.equals(plane.distanceToVector3(new Vector3(4.0, 0.0, 0.0)), (3.0));
        test.equals(plane.distanceToVector3(new Vector3(1.0, 0.0, 0.0)), (0.0));
        test.done();
    },

    testPlaneIntersection: function(test) {
        test.expect(3);
        var plane1 = Plane.normalconstant(new Vector3(1.0, 0.0, 0.0), -2.0);
        var plane2 = Plane.normalconstant(new Vector3(0.0, 1.0, 0.0), -3.0);
        var plane3 = Plane.normalconstant(new Vector3(0.0, 0.0, 1.0), -4.0);

        plane1.normalize();
        plane2.normalize();
        plane3.normalize();

        var point = Vector3.zero();

        Plane.intersection(plane1, plane2, plane3, point);

        test.equals(point.x, (2.0));
        test.equals(point.y, (3.0));
        test.equals(point.z, (4.0));
        test.done();
    }
};
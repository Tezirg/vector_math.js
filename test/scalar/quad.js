
var Quad = require('../../src/quad.js');
var Triangle = require('../../src/triangle.js');
var Vector3 = require('../../src/vector3.js');

module.exports  = {

    testQuadCopyNormalInto: function(test) {
        test.expect(1);
        var quad = Quad.points(
            new Vector3(1.0, 0.0, 1.0),
            new Vector3(0.0, 2.0, 1.0),
            new Vector3(1.0, 0.0, 0.0),
            new Vector3(0.0, 2.0, 0.0));
        var normal = Vector3.zero();

        quad.copyNormalInto(normal);

        test.ok(normal.almostEquals(new Vector3(-0.8944271802902222, -0.4472135901451111, 0.0)));
        test.done();
    },

    testQuadCopyTriangles: function(test) {
        test.expect(2);
        var quad = Quad.points(
            new Vector3(1.0, 0.0, 1.0),
            new Vector3(0.0, 2.0, 1.0),
            new Vector3(1.0, 0.0, 0.0),
            new Vector3(0.0, 2.0, 0.0));
        var t1 = new Triangle();
        var t2 = new Triangle();
        var normal = Vector3.zero();
        var t1Normal = Vector3.zero();
        var t2Normal = Vector3.zero();

        quad.copyNormalInto(normal);

        quad.copyTriangles(t1, t2);
        t1.copyNormalInto(t1Normal);
        t2.copyNormalInto(t2Normal);

        test.ok(t1Normal.almostEquals(normal));
        test.ok(t2Normal.almostEquals(normal));
        test.done();
    }
};
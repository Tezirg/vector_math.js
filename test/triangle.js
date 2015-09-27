/**
 * Created by grizet_j on 9/21/2015.
 */

var Triangle = require('../src/triangle.js');
var Vector3 = require('../src/vector3.js');

module.exports = {

    testCopyNormalInto: function(test) {
        test.expect(1);
        var triangle = Triangle.points(new Vector3(1.0, 0.0, 1.0),
            new Vector3(0.0, 2.0, 1.0), new Vector3(1.0, 2.0, 0.0));
        var normal = Vector3.zero();

        triangle.copyNormalInto(normal);

        test.ok(normal.almostEquals(new Vector3(-0.666666666, -0.333333333, -0.666666666)));
        test.done();
    }

};
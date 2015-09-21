/**
 * Created by grizet_j on 9/20/2015.
 */

var Vector2 = require('../src/vector2.js');

module.exports = {

    testVector2Add: function(test) {
        test.expect(4);

        var a = new Vector2(5.0, 7.0);
        var b = new Vector2(3.0, 8.0);

        a.add(b);
        test.equals(a.x, 8.0, "Add on X should be 8.0");
        test.equals(a.y, 15.0, "Add on Y should be 15.0");

        b.add(a.scale(0.5));
        test.equals(b.x, 7.0, "Add a scaled on X should be 7.0");
        test.equals(b.y, 15.5, "Add a scaled on Y should be 15.5");

        test.done();
    },
    testVector2MinMax: function (test) {
        test.expect(4);

        var a = new Vector2(5.0, 7.0);
        var b = new Vector2(3.0, 8.0);
        var result = Vector2.zero;

        Vector2.min(a, b, result);
        test.equals(result.x, 3.0, "Min 5.0 3.0 is 3.0");
        test.equals(result.y, 7.0, "Min 7.0 8.0 is 7.0");

        Vector2.max(a, b, result);
        test.equals(result.x, 5.0, "Max 5.0 3.0 is 5.0");
        test.equals(result.y, 8.0, "Max 7.0 8.0 is 8.0");
        test.done();
    },
    testVector2Mix: function (test) {
        test.expect(6);
        var a = new Vector2(5.0, 7.0);
        var b = new Vector2(3.0, 8.0);
        var result = Vector2.zero;

        Vector2.mix(a, b, 0.5, result);
        test.equals(result.x, 4.0, "Mix 5.0 3.0 at 0.5 is 4.0");
        test.equals(result.y, 7.5, "Mix 7.0 8.0 at 0.5 is 7.5");

        Vector2.mix(a, b, 0.0, result);
        test.equals(result.x, 5.0, "Mix 5.0 3.0 at 0.0 is 5.0");
        test.equals(result.y, 7.0, "Mix 7.0 8.0 at 0.0 is 7.0");

        Vector2.mix(a, b, 1.0, result);
        test.equals(result.x, 3.0, "Mix 5.0 3.0 at 1.0 is 3.0");
        test.equals(result.y, 8.0, "Mix 7.0 8.0 at 1.0 is 8.0");
        test.done();
    },
    testVector2DotProduct:  function (test) {
        test.expect(2);
        var inputA = new Vector2(0.417267069084370, 0.049654430325742);
        var inputB = new Vector2(0.944787189721646, 0.490864092468080);
        var expectedOutput = 0.4186021514853384;
        test.equals(inputA.dot(inputB), expectedOutput, "Dot product a.b");
        test.equals(inputB.dot(inputA), expectedOutput, "Dot product b.a");
        test.done();
    },
        /*
         void testVector2Postmultiplication() {
         var inputMatrix = new Matrix2.rotation(.2);
         var inputVector = new Vector2(1.0, 0.0);
         var inputInv = new Matrix2.copy(inputMatrix);
         inputInv.invert();
         // print("input $inputMatrix");
         // print("input $inputInv");
         var resultOld = inputMatrix.transposed() * inputVector;
         var resultOldvInv = inputInv * inputVector;
         var resultNew = inputVector.postmultiply(inputMatrix);
         expect(resultNew.x, equals(resultOld.x));
         expect(resultNew.y, equals(resultOld.y));
         //matrix inversion can introduce a small error
         assert((resultNew - resultOldvInv).length < .00001);
         }
         */

    testVector2CrossProduct: function (test) {
        test.expect(1);
        var inputA = new Vector2(0.417267069084370, 0.049654430325742);
        var inputB = new Vector2(0.944787189721646, 0.490864092468080);
        var expectedOutputCross = inputA.x * inputB.y - inputA.y * inputB.x;
        var result;
        result = inputA.cross(inputB);
        test.equals(result, expectedOutputCross, "Cross product AxB");
        result = Vector2.zero;
        test.done();
    },
        /*
         void testVector2OrthogonalScale() {
         var input = new Vector2(0.5, 0.75);
         var output = new Vector2.zero();

         input.scaleOrthogonalInto(2.0, output);
         expect(output.x, equals(-1.5));
         expect(output.y, equals(1.0));

         input.scaleOrthogonalInto(-2.0, output);
         expect(output.x, equals(1.5));
         expect(output.y, equals(-1.0));

         expect(0.0, equals(input.dot(output)));
         }
*/
    testVector2Constructor: function(test) {
        test.expect(4);

        var v1 = new Vector2(2.0, 4.0);
        test.equals(v1.x, 2.0, "X = 2.0");
        test.equals(v1.y, 4.0, "Y = 4.0");

        var v2 = Vector2.all(2.0);
        test.equals(v2.x, 2.0, "X = 2.0");
        test.equals(v2.y, 2.0, "Y = 2.0");
        test.done();
    },

    testVector2Length: function (test) {
        test.expect(4);
        var a = new Vector2(5.0, 7.0);

        test.equals(a.length(), 8.602325267042627, "Length a = 8.602");
        test.equals(a.length2(), 74.0, "Length2 a = 74.0");

        a.normalize();
        test.equals(a.x, 0.5812382102012634, "normalized a.x = 0.581");
        test.equals(a.y, 0.8137334585189819, "normalized a.y = 0.813");
        test.done();
    },

    testVector2Negate:  function (test) {
        test.expect(2);
        var vec1 = new Vector2(1.0, 2.0);
        vec1.negate();
        test.equals(vec1.x, -1.0, "Negate X = -1.0");
        test.equals(vec1.y, -2.0, "Negate Y = -2.0");
        test.done();
    },

    testVector2Equals: function (test) {
        test.expect(3);
        var v2 = new Vector2(1.0, 2.0);
        test.ok(v2.equals(new Vector2(1.0, 2.0)), "Should equals");
        test.ok(! v2.equals(new Vector2(1.0, 0.0)), "Shouldn't equals");
        test.ok(! v2.equals(new Vector2(0.0, 2.0)), "Shouldn't equals");
        test.done();
    },
    testVector2Reflect: function(test) {
        test.expect(12);
        var v = new Vector2(0.0, 5.0);
        v.reflect(new Vector2(0.0, -1.0));
        test.equals(v.x, 0.0, "Reflected 0.0 to 0.0 is 0.0");
        test.equals(v.y, -5.0, "Reflected 5.0 to -1.0 is -1.0");

        v = new Vector2(0.0, -5.0);
        v.reflect(new Vector2(0.0, 1.0));
        test.equals(v.x, 0.0, "Reflected 0.0 to 0.0 is 0.0");
        test.equals(v.y, 5.0, "Reflected -5.0 to 1.0 is 5.0");

         v = new Vector2(3.0, 0.0);
         v.reflect(new Vector2(-1.0, 0.0));
        test.equals(v.x, -3.0, "Reflected 3.0 to -1.0 is -3.0");
        test.equals(v.y, 0.0, "Reflected 0.0 to 0.0 is 0.0");

         v = new Vector2(-3.0, 0.0);
         v.reflect(new Vector2(1.0, 0.0));
        test.equals(v.x, 3.0, "Reflected -3.0 to 1.0 is 3.0");
        test.equals(v.y, 0.0, "Reflected 0.0 to 0.0 is 0.0");

        v = new Vector2(4.0, 4.0);
        v.reflect(new Vector2(-1.0, -1.0).normalized());
        v.round();
        test.equals(v.x, -4.0, "Reflected 4.0 to -1.0 is -4.0");
        test.equals(v.y, -4.0, "Reflected 4.0 to -1.0 is -4.0");

        v = new Vector2(-4.0, -4.0);
        v.reflect(new Vector2(1.0, 1.0).normalized());
        v.round();
        test.equals(v.x, 4.0, "Reflected -4.0 to 1.0 is 4.0");
        test.equals(v.y, 4.0, "Reflected -4.0 to 1.0 is 4.0");
        test.done();
    },

    testVector2DistanceTo: function (test) {
        test.expect(2);
        var a = new Vector2(1.0, 1.0);
        var b = new Vector2(3.0, 1.0);
        var c = new Vector2(1.0, -1.0);

        test.equals(a.distanceTo(b), 2.0, "Distance to B is 2.0");
        test.equals(a.distanceTo(c), 2.0, "Distance to C is 2.0");
        test.done();
    },

    testVector2DistanceToSquared: function (test) {
        test.expect(2);
        var a = new Vector2(1.0, 1.0);
        var b = new Vector2(3.0, 1.0);
        var c = new Vector2(1.0, -1.0);

        test.equals(a.distanceToSquared(b), 4.0, "Squared distance to B is 4.0");
        test.equals(a.distanceToSquared(c), 4.0, "Squared distance to C is 4.0");
        test.done();
    },

    /*
    testVector2Clamp: function(test) {
        var x = 2.0, y = 3.0;
        var v0 = new Vector2(x, y);
        var v1 = new Vector2(-x, -y);
        var v2 = new Vector2(-2.0 * x, 2.0 * y)..clamp(v1, v0);

         expect(v2.storage, orderedEquals([-x, y]));
         }

         void testVector2ClampScalar() {
         var x = 2.0;
         var v0 = new Vector2(-2.0 * x, 2.0 * x)..clampScalar(-x, x);
         expect(v0.storage, orderedEquals([-x, x]));
         }
*/
    testVector2Floor: function(test) {
        test.expect(3);
        var comp = new Vector2(-1.0, 0.0);
        var v0 = new Vector2(-0.1, 0.1).floor();
        var v1 = new Vector2(-0.5, 0.5).floor();
        var v2 = new Vector2(-0.9, 0.9).floor();

        test.ok(v0.equals(comp), "Ceil [-0.1, 0.1] = [-1.0, 0.0]");
        test.ok(v1.equals(comp), "Ceil [-0.5, 0.5] = [-1.0, 0.0]");
        test.ok(v2.equals(comp), "Ceil [-0.9, 0.9] = [-1.0, 0.0]");
        test.done();
    },

    testVector2Ceil: function(test) {
        test.expect(3);
        var comp = new Vector2(0.0, 1.0);
        var v0 = new Vector2(-0.1, 0.1).ceil();
        var v1 = new Vector2(-0.5, 0.5).ceil();
        var v2 = new Vector2(-0.9, 0.9).ceil();

        test.ok(v0.equals(comp), "Ceil [-0.1, 0.1] = [0.0, 1.0]");
        test.ok(v1.equals(comp), "Ceil [-0.5, 0.5] = [0.0, 1.0]");
        test.ok(v2.equals(comp), "Ceil [-0.9, 0.9] = [0.0, 1.0]");
        test.done();
    },

    testVector2Round: function(test) {
        test.expect(3);
        var v0 = new Vector2(-0.1, 0.1).round();
        var v1 = new Vector2(-0.51, 0.5).round();
        var v2 = new Vector2(-0.9, 0.9).round();

        var comp = new Vector2(0.0, 0.0);
        test.ok(v0.equals(comp), "Round [-0.1, 0.1] = [0.0, 0.0]");
        var comp2 = new Vector2(-1.0, 1.0);
        test.ok(v1.equals(comp2), "Round [-0.5, 0.5] = [-1.0, 1.0]");
        test.ok(v2.equals(comp2), "Round [-0.9, 0.9] = [-1.0, 1.0]");

        test.done();
    }
/*
         void testVector2RoundToZero() {
         var v0 = new Vector2(-0.1, 0.1)..roundToZero();
         var v1 = new Vector2(-0.5, 0.5)..roundToZero();
         var v2 = new Vector2(-0.9, 0.9)..roundToZero();
         var v3 = new Vector2(-1.1, 1.1)..roundToZero();
         var v4 = new Vector2(-1.5, 1.5)..roundToZero();
         var v5 = new Vector2(-1.9, 1.9)..roundToZero();

         expect(v0.storage, orderedEquals([0.0, 0.0]));
         expect(v1.storage, orderedEquals([0.0, 0.0]));
         expect(v2.storage, orderedEquals([0.0, 0.0]));
         expect(v3.storage, orderedEquals([-1.0, 1.0]));
         expect(v4.storage, orderedEquals([-1.0, 1.0]));
         expect(v5.storage, orderedEquals([-1.0, 1.0]));
         }
         */
   // });
};
/**
 * Created by grizet_j on 9/21/2015.
 */
var Vector3 = require('../../src/vector3.js');
var Matrix3 = require('../../src/matrix3.js');
var Matrix4 = require('../../src/matrix4.js');
var Quaternion = require('../../src/quaternion.js');
var TEST = require('./test_utils.js');

var vector_math = require('../../src/common.js');
vector_math.ENABLE_SIMD = true;

module.exports = {

    testVector3InstacingfFromFloat32Array: function(test) {
        test.expect(3);
        float32List = new Float32Array([1.0, 2.0, 3.0]);
        input = Vector3.fromFloat32Array(float32List);

        test.equals(input.x, 1.0);
        test.equals(input.y, 2.0);
        test.equals(input.z, 3.0);
        test.done();
    },

    testVector3InstacingFromByteBuffer: function(test) {
        test.expect(6);
        float32Array = new Float32Array([1.0, 2.0, 3.0, 4.0]);
        buffer = float32Array.buffer;
        zeroOffset = Vector3.fromBuffer(buffer, 0);
        offsetVector = Vector3.fromBuffer(buffer, Float32Array.BYTES_PER_ELEMENT);

        test.equals(zeroOffset.x, 1.0, "Buffer [0] == 1.0");
        test.equals(zeroOffset.y, 2.0);
        test.equals(zeroOffset.z, 3.0);

        test.equals(offsetVector.x, 2.0);
        test.equals(offsetVector.y, 3.0);
        test.equals(offsetVector.z, 4.0);

        test.done();
    },

    testVector3Add: function(test) {
        test.expect(6);
        a = new Vector3(5.0, 7.0, 3.0);
        b = new Vector3(3.0, 8.0, 2.0);

        a.add(b);
        test.equals(a.x, 8.0);
        test.equals(a.y, 15.0);
        test.equals(a.z, 5.0);

        b.add(a.scale(0.5));
        test.equals(b.x, 7.0);
        test.equals(b.y, 15.5);
        test.equals(b.z, 4.5);
        test.done();
    },


    testVector3MinMax: function(test) {
        test.expect(6);
        a = new Vector3(5.0, 7.0, -3.0);
        b = new Vector3(3.0, 8.0, 2.0);

        result = Vector3.zero();

        Vector3.min(a, b, result);
        test.equals(result.x, 3.0);
        test.equals(result.y, 7.0);
        test.equals(result.z, -3.0);

        Vector3.max(a, b, result);
        test.equals(result.x, 5.0);
        test.equals(result.y, 8.0);
        test.equals(result.z, 2.0);
        test.done();
    },

    testVector3Mix: function(test) {
        test.expect(9);
        a = new Vector3(5.0, 7.0, 3.0);
        b = new Vector3(3.0, 8.0, 2.0);

        result = Vector3.zero();

        Vector3.mix(a, b, 0.5, result);
        test.equals(result.x, 4.0);
        test.equals(result.y, 7.5);
        test.equals(result.z, 2.5);

        Vector3.mix(a, b, 0.0, result);
        test.equals(result.x, 5.0);
        test.equals(result.y, 7.0);
        test.equals(result.z, 3.0);

        Vector3.mix(a, b, 1.0, result);
        test.equals(result.x, 3.0);
        test.equals(result.y, 8.0);
        test.equals(result.z, 2.0);
        test.done();
    },

    testVector3DotProduct: function(test) {
        test.expect(2);
        inputA = [];
        inputB = [];
        expectedOutput = [];
        inputA.push(TEST.parseVector("0.417267069084370 0.049654430325742 0.902716109915281"));
        inputB.push(TEST.parseVector("0.944787189721646 0.490864092468080 0.489252638400019"));
        expectedOutput.push(0.860258396944727);
        //assert(inputA.length == inputB.length);
        //assert(inputB.length == expectedOutput.length);
        for (var i = 0; i < inputA.length; i++) {
            var output1 = inputA[i].dot(inputB[i]);
            var output2 = inputB[i].dot(inputA[i]);
            TEST.relativeTest(test, output1, expectedOutput[i]);
            TEST.relativeTest(test, output2, expectedOutput[i]);
        }
        test.done();
    },

    testVector3Postmultiplication: function(test) {
        test.expect(6);
        inputMatrix = (Matrix3.rotationX(0.4)).mult(Matrix3.rotationZ(0.5));
        inputVector = new Vector3(1.0, 2.0, 3.0);
        inputInv = Matrix3.copy(inputMatrix);
        inputInv.invert();
        var resultOld = inputMatrix.transposed().mult(inputVector);
        var resultOldvInv = inputInv.mult(inputVector);
        var resultNew = inputVector.postmultiply(inputMatrix);

        test.equals(resultNew.x,resultOld.x);
        test.equals(resultNew.y,resultOld.y);
        test.equals(resultNew.z,resultOld.z);
        test.equals(resultNew.x,resultOldvInv.x);
        test.equals(resultNew.y,resultOldvInv.y);
        test.equals(resultNew.z,resultOldvInv.z);
        test.done();
    },

    testVector3CrossProduct: function(test) {
        inputA = [];
        inputB = [];
        expectedOutput = [];

        inputA.push(TEST.parseVector("0.417267069084370 0.049654430325742 0.902716109915281"));
        inputB.push(TEST.parseVector("0.944787189721646 0.490864092468080 0.489252638400019"));
        expectedOutput.push(TEST.parseVector("-0.418817363004761 0.648725602136344 0.157908551498227"));

        inputA.push(TEST.parseVector("0.944787189721646 0.490864092468080 0.489252638400019"));
        inputB.push(TEST.parseVector("0.417267069084370 0.049654430325742 0.902716109915281"));
        expectedOutput.push(TEST.parseVector("0.418817363004761 -0.648725602136344 -0.157908551498227"));

        //assert(inputA.length == inputB.length);
        //assert(inputB.length == expectedOutput.length);

        for (i = 0; i < inputA.length; i++) {
            var output = inputA[i].clone();
            output.cross(inputB[i]);
//            cross3(inputA[i], inputB[i], output);
            TEST.relativeTest(test, output, expectedOutput[i]);
        }

        {
            var x = new Vector3(1.0, 0.0, 0.0);
            var y = new Vector3(0.0, 1.0, 0.0);
            var z = new Vector3(0.0, 0.0, 1.0);

            output = x.cross(y);
            TEST.relativeTest(test, output, new Vector3(0.0, 0.0, 1.0));
            output = y.cross(x);
            TEST.relativeTest(test, output, new Vector3(0.0, 0.0, -1.0));

            output = x.cross(z);
            TEST.relativeTest(test, output, new Vector3(0.0, -1.0, 0.0));
            output = z.cross(x);
            TEST.relativeTest(test, output, new Vector3(0.0, 1.0, 0.0));

            output = y.cross(z);
            TEST.relativeTest(test, output, new Vector3(1.0, 0.0, 0.0));
            output = z.cross(y);
            TEST.relativeTest(test, output, new Vector3(-1.0, 0.0, 0.0));
        }
        test.done();
    },

    testVector3Constructor: function(test) {
        test.expect(6);
        var v1 = new Vector3(2.0, 4.0, -1.5);
        test.equals(v1.x, 2.0);
        test.equals(v1.y, 4.0);
        test.equals(v1.z, -1.5);

        var v2 = Vector3.all(2.0);
        test.equals(v2.x, 2.0);
        test.equals(v2.y, 2.0);
        test.equals(v2.z, 2.0);
        test.done();
    },

    testVector3Length: function(test) {
        test.expect(6);
        a = new Vector3(5.0, 7.0, 3.0);

        TEST.relativeTest(test, a.length, 9.1104);
        TEST.relativeTest(test, a.length2(), 83.0);

        TEST.relativeTest(test, a.normalize().length, 9.1104);
        TEST.relativeTest(test, a.x, 0.5488);
        TEST.relativeTest(test, a.y, 0.7683);
        TEST.relativeTest(test, a.z, 0.3292);
        test.done();
    },


    testVector3SetLength: function(test) {
        test.expect(8);
        v0 = new Vector3(1.0, 2.0, 1.0);
        v1 = new Vector3(3.0, -2.0, 2.0);
        v2 = new Vector3(-1.0, 2.0, -2.0);
        v3 = new Vector3(1.0, 0.0, 0.0);

        v0.length = 0.0;
        TEST.relativeTest(test, v0, Vector3.zero());
        TEST.relativeTest(test, v0.length, 0.0);

        v1.length = 2.0;
        TEST.relativeTest(test, v1,
            new Vector3(1.4552137851715088, -0.9701424837112427, 0.9701424837112427));
        TEST.relativeTest(test, v1.length, 2.0);

        v2.length = 0.5;
        TEST.relativeTest(test,
            v2,
            new Vector3(
                -0.1666666716337204, 0.3333333432674408, -0.3333333432674408));
        TEST.relativeTest(test, v2.length, 0.5);

        v3.length = -1.0;
        TEST.relativeTest(test, v3, new Vector3(-1.0, 0.0, 0.0));
        TEST.relativeTest(test, v3.length, 1.0);
        test.done();
    },

    testVector3Negate: function(test) {
        test.expect(3);
        var vec3 = new Vector3(1.0, 2.0, 3.0);
        vec3.negate();
        test.equals(vec3.x, -1.0);
        test.equals(vec3.y, -2.0);
        test.equals(vec3.z, -3.0);
        test.done();
    },

    testVector3Equals: function(test) {
        test.expect(4);
        var v3 = new Vector3(1.0, 2.0, 3.0);
        test.ok(v3.equals(new Vector3(1.0, 2.0, 3.0)));
        test.ok(! v3.equals(new Vector3(0.0, 2.0, 3.0)));
        test.ok(! v3.equals(new Vector3(1.0, 0.0, 3.0)));
        test.ok(! v3.equals(new Vector3(1.0, 2.0, 0.0)));
        test.done();
    },
    testVector3Reflect: function(test) {
        test.expect(27);
        var v = new Vector3(5.0, 0.0, 0.0);
        v.reflect(new Vector3(-1.0, 0.0, 0.0));
        test.equals(v.x, -5.0);
        test.equals(v.y, 0.0);
        test.equals(v.y, 0.0);

        v = new Vector3(0.0, 5.0, 0.0);
        v.reflect(new Vector3(0.0, -1.0, 0.0));
        test.equals(v.x, 0.0);
        test.equals(v.y, -5.0);
        test.equals(v.z, 0.0);

        v = new Vector3(0.0, 0.0, 5.0);
        v.reflect(new Vector3(0.0, 0.0, -1.0));
        test.equals(v.x,0.0);
        test.equals(v.y,0.0);
        test.equals(v.z,-5.0);

        v = new Vector3(-5.0, 0.0, 0.0);
        v.reflect(new Vector3(1.0, 0.0, 0.0));
        test.equals(v.x,5.0);
        test.equals(v.y,0.0);
        test.equals(v.y,0.0);

        v = new Vector3(0.0, -5.0, 0.0);
        v.reflect(new Vector3(0.0, 1.0, 0.0));
        test.equals(v.x,0.0);
        test.equals(v.y,5.0);
        test.equals(v.z,0.0);

        v = new Vector3(0.0, 0.0, -5.0);
        v.reflect(new Vector3(0.0, 0.0, 1.0));
        test.equals(v.x,0.0);
        test.equals(v.y,0.0);
        test.equals(v.z,5.0);

        v = new Vector3(4.0, 4.0, 4.0);
        v.reflect(new Vector3(-1.0, -1.0, -1.0).normalized());
        TEST.relativeTest(test, v.x, -4.0);
        TEST.relativeTest(test, v.y, -4.0);
        TEST.relativeTest(test, v.z, -4.0);

        v = new Vector3(-4.0, -4.0, -4.0);
        v.reflect(new Vector3(1.0, 1.0, 1.0).normalized());
        TEST.relativeTest(test, v.x, 4.0);
        TEST.relativeTest(test, v.y, 4.0);
        TEST.relativeTest(test, v.z, 4.0);

        v = new Vector3(10.0, 20.0, 2.0);
        v.reflect(new Vector3(-10.0, -20.0, -2.0).normalized());
        TEST.relativeTest(test, v.x, -10.0);
        TEST.relativeTest(test, v.y, -20.0);
        TEST.relativeTest(test, v.z, -2.0);
        test.done();
    },

    testVector3Projection: function(test) {
        test.expect(3);
        var v = new Vector3(1.0, 1.0, 1.0);
        var a = 2.0 / 3.0;
        var b = 1.0 / 3.0;
        var m = new Matrix4(
            a, b, -b, 0.0, b, a, b, 0.0, -b, b, a, 0.0, 0.0, 0.0, 0.0, 1.0);

        v.applyProjection(m);
        TEST.relativeTest(test, v.x, a);
        TEST.relativeTest(test, v.y, 4.0 / 3.0);
        TEST.relativeTest(test, v.z, a);
        test.done();
    },

    testVector3DistanceTo: function(test) {
        test.expect(2);
        var a = new Vector3(1.0, 1.0, 1.0);
        var b = new Vector3(1.0, 3.0, 1.0);
        var c = new Vector3(1.0, 1.0, -1.0);

        test.equals(a.distanceTo(b),2.0);
        test.equals(a.distanceTo(c),2.0);
        test.done();
    },

    testVector3DistanceToSquared: function(test) {
        test.expect(2);
        var a = new Vector3(1.0, 1.0, 1.0);
        var b = new Vector3(1.0, 3.0, 1.0);
        var c = new Vector3(1.0, 1.0, -1.0);

        test.equals(a.distanceToSquared(b),4.0);
        test.equals(a.distanceToSquared(c),4.0);
        test.done();
    },
    testVector3AngleTo: function(test) {
        test.expect(2);
        v0 = new Vector3(1.0, 0.0, 0.0);
        v1 = new Vector3(0.0, 1.0, 0.0);

        test.equals(v0.angleTo(v0),0.0);
        test.equals(v0.angleTo(v1),Math.PI / 2.0);
        test.done();
    },
    testVector3AngleToSigned: function(test) {
        test.expect(3);
        v0 = new Vector3(1.0, 0.0, 0.0);
        v1 = new Vector3(0.0, 1.0, 0.0);
        n = new Vector3(0.0, 0.0, 1.0);

        test.equals(v0.angleToSigned(v0, n),0.0);
        test.equals(v0.angleToSigned(v1, n),Math.PI / 2.0);
        test.equals(v1.angleToSigned(v0, n),-Math.PI / 2.0);
        test.done();
    },

    testVector3Clamp: function(test) {
        test.expect(1);
        var x = 2.0, y = 3.0, z = 4.0;
        v0 = new Vector3(x, y, z);
        v1 = new Vector3(-x, -y, -z);
        v2 = new Vector3(-2.0 * x, 2.0 * y, -2.0 * z).clamp(v1, v0);

        cmp = new Vector3(-x, y, -z);
        test.ok(cmp.equals(v2));
        test.done();
    },

   testVector3ClampScalar: function(test) {
       test.expect(1);
       x = 2.0;
       v0 = new Vector3(-2.0 * x, 2.0 * x, -2.0 * x).clampScalar(-x, x);
       v1 = new Vector3(-x, x, -x);

       test.ok(v1.equals(v0));
       test.done();
   },

   testVector3Floor: function(test) {
       test.expect(3);
       v0 = new Vector3(-0.1, 0.1, -0.1).floor();
       v1 = new Vector3(-0.5, 0.5, -0.5).floor();
       v2 = new Vector3(-0.9, 0.9, -0.5).floor();
       v3 = new Vector3(-1.0, 0.0, -1.0);

       test.ok(v0.equals(v3));
       test.ok(v1.equals(v3));
       test.ok(v2.equals(v3));
       test.done();
   },

   testVector3Ceil: function(test) {
       v0 = new Vector3(-0.1, 0.1, -0.1).ceil();
       v1 = new Vector3(-0.5, 0.5, -0.5).ceil();
       v2 = new Vector3(-0.9, 0.9, -0.9).ceil();
       v3 = new Vector3(0.0, 1.0, 0.0);

       test.ok(v0.equals(v3));
       test.ok(v1.equals(v3));
       test.ok(v2.equals(v3));
       test.done();
   },
    testVector3Round: function(test) {
        v0 = new Vector3(-0.1, 0.1, -0.1).round();
        v1 = new Vector3(-0.51, 0.51, -0.51).round();
        v2 = new Vector3(-0.9, 0.9, -0.9).round();
        v3 = new Vector3(0.0, 0.0, 0.0);
        v4 = new Vector3(-1.0, 1.0, -1.0);

        test.ok(v0.equals(v3));
        test.ok(v1.equals(v4));
        test.ok(v2.equals(v4));
        test.done();

    },
    testVector3RoundToZero: function(test) {
        v0 = new Vector3(-0.1, 0.1, -0.1).roundToZero();
        v1 = new Vector3(-0.5, 0.5, -0.5).roundToZero();
        v2 = new Vector3(-0.9, 0.9, -0.9).roundToZero();
        v3 = new Vector3(-1.1, 1.1, -1.1).roundToZero();
        v4 = new Vector3(-1.5, 1.5, -1.5).roundToZero();
        v5 = new Vector3(-1.9, 1.9, -1.9).roundToZero();
        v6 = new Vector3(0.0, 0.0, 0.0);
        v7 = new Vector3(-1.0, 1.0, -1.0);

        test.ok(v0.equals(v6));
        test.ok(v1.equals(v6));
        test.ok(v2.equals(v6));
        test.ok(v3.equals(v7));
        test.ok(v4.equals(v7));
        test.ok(v5.equals(v7));
        test.done();
    },
    testVector3ApplyQuaternion: function(test) {
        test.expect(1);
        q = new Quaternion(0.0, 0.9238795292366128, 0.0, 0.38268342717215614);
        v = new Vector3(0.417267069084370, 0.049654430325742, 0.753423475845592)
            .applyQuaternion(q);

        TEST.relativeTest(test,
            v,
            new Vector3(
                0.23769846558570862, 0.04965442791581154, -0.8278031349182129));
        test.done();
    }
};
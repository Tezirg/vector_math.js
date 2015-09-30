/**
 * Created by grizet_j on 9/21/2015.
 */

var Quaternion = require('../../src/quaternion.js');
var Vector3 = require('../../src/vector3.js');

module.exports = {

    testQuaternionInstacinfFromFloat32List: function(test)  {
        test.expect(4);
        var float32List =
            new Float32Array([1.0, 2.0, 3.0, 4.0]);
        var input = Quaternion.fromFloat32Array(float32List);

        test.equals(input.x, 1.0);
        test.equals(input.y, 2.0);
        test.equals(input.z, 3.0);
        test.equals(input.w, 4.0);
        test.done();
    },

    testQuaternionInstacingFromByteBuffer: function(test)  {
        test.expect(8);
        float32List =  new Float32Array([1.0, 2.0, 3.0, 4.0, 5.0]);
        var buffer = float32List.buffer;
        var zeroOffset = Quaternion.fromBuffer(buffer, 0);
        var offsetVector = Quaternion.fromBuffer(buffer, Float32Array.BYTES_PER_ELEMENT);

        test.equals(zeroOffset.x, 1.0);
        test.equals(zeroOffset.y, (2.0));
        test.equals(zeroOffset.z, (3.0));
        test.equals(zeroOffset.w, (4.0));

        test.equals(offsetVector.x, (2.0));
        test.equals(offsetVector.y, (3.0));
        test.equals(offsetVector.z, (4.0));
        test.equals(offsetVector.w, (5.0));
        test.done();
    },

    testQuaternionConjugate: function(test)  {
        var input = [];
        input.push(Quaternion.identity());
        input.push(new Quaternion(0.18260, 0.54770, 0.73030, 0.36510));
        input.push(new Quaternion(0.9889, 0.0, 0.0, 0.14834));
        var expectedOutput = [];
        expectedOutput.push(new Quaternion(-0.0, -0.0, -0.0, 1.0));
        expectedOutput.push(new Quaternion(-0.18260, -0.54770, -0.73030, 0.36510));
        expectedOutput.push(new Quaternion(-0.9889, -0.0, -0.0, 0.1483));
        quat_test.testConjugate(test, input, expectedOutput);
    },


    testQuaternionMatrixQuaternionRoundTrip: function(test)  {
        var input = [];
        input.push(Quaternion.identity().normalize());
        input.push(new Quaternion(0.18260, 0.54770, 0.73030, 0.36510).normalize());
        input.push(new Quaternion(0.9889, 0.0, 0.0, 0.14834).normalize());
        input.push(new Quaternion(0.388127, 0.803418, -0.433317, -0.126429).normalize());
        input.push(new Quaternion(1.0, 0.0, 0.0, 1.0).normalize());
        input.push(new Quaternion(0.0, 1.0, 0.0, 1.0).normalize());
        input.push(new Quaternion(0.0, 0.0, 1.0, 1.0).normalize());
        quat_test.testQuaternionMatrixRoundTrip(test, input);
    },


    testQuaternionMultiplying: function(test)  {
        var inputA = [];
        inputA.push(new Quaternion(0.18260, 0.54770, 0.73030, 0.36510));
        inputA.push(new Quaternion(0.9889, 0.0, 0.0, 0.14834));
        var inputB = [];
        inputB.push(new Quaternion(0.9889, 0.0, 0.0, 0.14834));
        inputB.push(new Quaternion(0.18260, 0.54770, 0.73030, 0.36510));
        var expectedOutput = [];
        expectedOutput.push(new Quaternion(0.388127, 0.803418, -0.433317, -0.126429));
        expectedOutput.push(new Quaternion(0.388127, -0.64097, 0.649924, -0.126429));
        quat_test.testQuaternionMultiply(test, inputA, inputB, expectedOutput);
    },


    testQuaternionNormalize: function(test)  {
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];

        inputA.push(new Quaternion(0.0, 1.0, 0.0, 1.0).normalize());
        inputB.push(new Vector3(1.0, 1.0, 1.0));
        expectedOutput.push(new Vector3(-1.0, 1.0, 1.0));

        inputA.push(Quaternion.identity().normalize());
        inputB.push(new Vector3(1.0, 2.0, 3.0));
        expectedOutput.push(new Vector3(1.0, 2.0, 3.0));

        inputA.push(new Quaternion(0.18260, 0.54770, 0.73030, 0.36510).normalize());
        inputB.push(new Vector3(1.0, 0.0, 0.0));
        expectedOutput.push(new Vector3(-0.6667, -0.3333, 0.6667));

        inputA.push(new Quaternion(1.0, 0.0, 0.0, 1.0).normalize());
        inputB.push(new Vector3(1.0, 0.0, 0.0));
        expectedOutput.push(new Vector3(1.0, 0.0, 0.0));

        inputA.push(new Quaternion(1.0, 0.0, 0.0, 1.0).normalize());
        inputB.push(new Vector3(0.0, 1.0, 0.0));
        expectedOutput.push(new Vector3(0.0, 0.0, -1.0));

        inputA.push(new Quaternion(1.0, 0.0, 0.0, 1.0).normalize());
        inputB.push(new Vector3(0.0, 0.0, 1.0));
        expectedOutput.push(new Vector3(0.0, 1.0, 0.0));

        inputA.push(new Quaternion(0.0, 1.0, 0.0, 1.0).normalize());
        inputB.push(new Vector3(1.0, 0.0, 0.0));
        expectedOutput.push(new Vector3(0.0, 0.0, 1.0));

        inputA.push(new Quaternion(0.0, 1.0, 0.0, 1.0).normalize());
        inputB.push(new Vector3(0.0, 1.0, 0.0));
        expectedOutput.push(new Vector3(0.0, 1.0, 0.0));

        inputA.push(new Quaternion(0.0, 1.0, 0.0, 1.0).normalize());
        inputB.push(new Vector3(0.0, 0.0, 1.0));
        expectedOutput.push(new Vector3(-1.0, 0.0, 0.0));

        inputA.push(new Quaternion(0.0, 0.0, 1.0, 1.0).normalize());
        inputB.push(new Vector3(1.0, 0.0, 0.0));
        expectedOutput.push(new Vector3(0.0, -1.0, 0.0));

        inputA.push(new Quaternion(0.0, 0.0, 1.0, 1.0).normalize());
        inputB.push(new Vector3(0.0, 1.0, 0.0));
        expectedOutput.push(new Vector3(1.0, 0.0, 0.0));

        inputA.push(new Quaternion(0.0, 0.0, 1.0, 1.0).normalize());
        inputB.push(new Vector3(0.0, 0.0, 1.0));
        expectedOutput.push(new Vector3(0.0, 0.0, 1.0));

        quat_test.testQuaternionVectorRotate(test, inputA, inputB, expectedOutput);
    }
};

quat_test = {
    testConjugate: function(test, input, expectedOutput) {
        test.expect(expectedOutput.length);
        // assert(input.length == expectedOutput.length);
        for (var i = 0; i < input.length; i++) {
            var output = input[i].conjugate();
            test.ok(output.almostEquals(expectedOutput[i], 0.00005));
            //relativeTest(output, expectedOutput[i]);
        }
        test.done();
    },


    testQuaternionMatrixRoundTrip : function(test, input) {
        test.expect(input.length);
        for (var i = 0; i < input.length; i++) {
            var R = input[i].asRotationMatrix();
            var output = Quaternion.fromRotation(R);
            test.ok(output.almostEquals(input[i], 0.00005));
            //relativeTest(output, input[i]);
        }
        test.done();
    },


    testQuaternionMultiply: function(test, inputA, inputB, expectedOutput) {
        test.expect(inputA.length);
        for (var i = 0; i < inputA.length; i++) {
            var output = inputA[i].mult(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            //relativeTest(output, expectedOutput[i]);
        }
        test.done();
    },


    testQuaternionVectorRotate: function(test, inputA, inputB, expectedOutput) {
        test.expect(inputA.length);
        //assert((inputA.length == inputB.length) &&
        //(inputB.length == expectedOutput.length));
        for (var i = 0; i < inputA.length; i++) {
            var output = inputA[i].rotate(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            //relativeTest(output, expectedOutput[i]);
        }
        test.done();
    }
};


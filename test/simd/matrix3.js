/**
 * Created by grizet_j on 9/21/2015.
 */

var Vector2 = require('../../src/vector2.js');
var Matrix3 = require('../../src/matrix3.js');
var Vector3 = require('../../src/vector3.js');
var TEST = require('./test_utils.js');

var SIMD = require("simd");

module.exports = {

    testMatrix3Adjoint : function(test) {
		test.expect(2);
		var input = [];
        var expectedOutput = [];
        
        input.push(
            TEST.parseMatrix(" 0.285839018820374   0.380445846975357   0.053950118666607\n" +
            "    0.757200229110721   0.567821640725221   0.530797553008973    \n" +
            "0.753729094278495   0.075854289563064   0.779167230102011"));
        expectedOutput.push(
            TEST.parseMatrix(" 0.402164743710542  -0.292338588868304   0.171305679728352    \n" +
            "-0.189908046274114   0.182052622470548  -0.110871609529434    \n" +
            "-0.370546805539367   0.265070987960728  -0.125768101844091"));
        input.push(TEST.parseMatrix("1     0     0    \n" +
        "0     1     0    \n" +
        "0     0     1"));
        expectedOutput.push(TEST.parseMatrix("1     0     0  \n" +
        "  0     1     0  \n" +
        "  0     0     1"));
       /* input.push(TEST.parseMatrix("1     0     0    0 \n" +
        " 0     1    0     0   \n" +
        " 0     0     1     0    \n" +
        "0     0     0     1"));
        expectedOutput.push(TEST.parseMatrix("1     0     0     0 \n" +
        "   0     1     0     0    \n" +
        "0   0     1     0   \n" +
        " 0     0     0     1"));
        */
       // assert(input.length == expectedOutput.length);
        
        for (var i = 0; i < input.length; i++) {
            var output = input[i].clone();
            output.scaleAdjoint(1.0);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            //relativeTest(output, expectedOutput[i]);
        }
		test.done();
    },
    
    testMatrix3Determinant : function(test) {
		test.expect(1);
        var input = [];
        var expectedOutput = [];
        
        input.push(
            TEST.parseMatrix("0.285839018820374   0.380445846975357   0.053950118666607    \n" +
            "0.757200229110721   0.567821640725221   0.530797553008973    \n" +
            "0.753729094278495   0.075854289563064   0.779167230102011"));
        expectedOutput.push(0.022713604103796);
        
       // assert(input.length == expectedOutput.length);
        
        for ( i = 0; i < input.length; i++) {
             var output = input[i].determinant();
            //pr('${input[i].cols}x${input[i].rows} = $output');
            TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();
    },
    
    testMatrix3SelfTransposeMultiply : function(test) {
		test.expect(2);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(
            TEST.parseMatrix("0.084435845510910   0.800068480224308   0.181847028302852    \n" +
            "0.399782649098896   0.431413827463545   0.263802916521990    \n" +
            "0.259870402850654   0.910647594429523   0.145538980384717"));
        inputB.push(       
            TEST.parseMatrix("0.136068558708664   0.549860201836332   0.622055131485066   \n" +
            " 0.869292207640089   0.144954798223727   0.350952380892271    \n" +
            "0.579704587365570   0.853031117721894   0.513249539867053"));
        expectedOutput.push(
            TEST.parseMatrix("0.509665070066463   0.326055864494860   0.326206788210183 \n" +
            "   1.011795431418814   1.279272055656899   1.116481872383158  \n" +
            "  0.338435097301446   0.262379221330899   0.280398953455993"));
        
        inputA.push(
            TEST.parseMatrix("0.136068558708664   0.549860201836332   0.622055131485066 \n" +
            "   0.869292207640089   0.144954798223727   0.350952380892271  \n" +
            "  0.579704587365570   0.853031117721894   0.513249539867053"));
        inputB.push(
            TEST.parseMatrix("0.084435845510910   0.800068480224308   0.181847028302852 \n" +
            "   0.399782649098896   0.431413827463545   0.263802916521990   \n" +
            " 0.259870402850654   0.910647594429523   0.145538980384717"));
        expectedOutput.push(
            TEST.parseMatrix("0.509665070066463   1.011795431418814   0.338435097301446  \n" +
            "  0.326055864494860   1.279272055656899   0.262379221330899  \n" +
            "  0.326206788210183   1.116481872383158   0.280398953455993"));
      //  assert(inputA.length == inputB.length);
      //  assert(inputB.length == expectedOutput.length);
        
        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i].clone();
            output.transposeMultiply(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            // relativeTest(output, expectedOutput[i]);
        }
		test.done();
    },
    
    testMatrix3SelfMultiply : function(test) {
		test.expect(2);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(
            TEST.parseMatrix("0.084435845510910   0.800068480224308   0.181847028302852  \n" +
            "  0.399782649098896   0.431413827463545   0.263802916521990  \n" +
            "  0.259870402850654   0.910647594429523   0.145538980384717"));
        inputB.push(
            TEST.parseMatrix("0.136068558708664   0.549860201836332   0.622055131485066 \n" +
            "   0.869292207640089   0.144954798223727   0.350952380892271   \n" +
            " 0.579704587365570   0.853031117721894   0.513249539867053"));
        expectedOutput.push(
            TEST.parseMatrix("0.812399915745417   0.317522849978516   0.426642592595554  \n" +
            "  0.582350288210078   0.507392169174135   0.535489283769338  \n" +
            "  0.911348663480233   0.399044409575883   0.555945473748377"));
        
        inputA.push(
            TEST.parseMatrix("0.136068558708664   0.549860201836332   0.622055131485066  \n" +
            "  0.869292207640089   0.144954798223727   0.350952380892271  \n" +
            "  0.579704587365570   0.853031117721894   0.513249539867053"));
        inputB.push(
            TEST.parseMatrix("0.084435845510910   0.800068480224308   0.181847028302852  \n" +
            "  0.399782649098896   0.431413827463545   0.263802916521990  \n" +
            "  0.259870402850654   0.910647594429523   0.145538980384717"));
        expectedOutput.push(
            TEST.parseMatrix("0.392967349540540   0.912554468305858   0.260331657549835   \n" +
            " 0.222551972385485   1.077622741167203   0.247394954900102 \n" +
            "   0.523353251675581   1.299202246456530   0.405147467960185"));
       // assert(inputA.length == inputB.length);
      //  assert(inputB.length == expectedOutput.length);
        
        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i].clone();
            output.multiply(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            // relativeTest(output, expectedOutput[i]);
        }
		test.done();
    },
    
    testMatrix3SelfMultiplyTranspose : function(test) {
		test.expect(2);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(
            TEST.parseMatrix("0.084435845510910   0.800068480224308   0.181847028302852  \n" +
            "  0.399782649098896   0.431413827463545   0.263802916521990   \n" +
            " 0.259870402850654   0.910647594429523   0.145538980384717"));
        inputB.push(
            TEST.parseMatrix("0.136068558708664   0.549860201836332   0.622055131485066   \n" +
            " 0.869292207640089   0.144954798223727   0.350952380892271  \n" +
            "  0.579704587365570   0.853031117721894   0.513249539867053"));
        expectedOutput.push(
            TEST.parseMatrix("0.564533756922142   0.253192835205285   0.824764060523193 \n" +
            "   0.455715101026938   0.502645707562004   0.735161980594196   \n" +
            " 0.626622330821134   0.408983306176468   1.002156614695209"));
        
        inputA.push(
            TEST.parseMatrix("0.136068558708664   0.549860201836332   0.622055131485066  \n" +
            "  0.869292207640089   0.144954798223727   0.350952380892271  \n" +
            "  0.579704587365570   0.853031117721894   0.513249539867053"));
        inputB.push(
            TEST.parseMatrix("0.084435845510910   0.800068480224308   0.181847028302852  \n" +
            "  0.399782649098896   0.431413827463545   0.263802916521990  \n" +
            "  0.259870402850654   0.910647594429523   0.145538980384717"));
        expectedOutput.push(
            TEST.parseMatrix("0.564533756922142   0.455715101026938   0.626622330821134  \n" +
            "  0.253192835205285   0.502645707562004   0.408983306176468  \n" +
            "  0.824764060523193   0.735161980594196   1.002156614695209"));
       // assert(inputA.length == inputB.length);
      //  assert(inputB.length == expectedOutput.length);

        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i].clone();
            output.multiplyTranspose(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            // relativeTest(output, expectedOutput[i]);
        }
		test.done();
    },
    
    testMatrix3Transform : function(test) {
		test.expect(3);
        rotX = Matrix3.rotationX(Math.PI / 4);
        rotY = Matrix3.rotationY(Math.PI / 4);
        rotZ = Matrix3.rotationZ(Math.PI / 4);
        input = new Vector3(1.0, 0.0, 0.0);

        test.ok(rotX.transformed(input).almostEquals(input));
        test.ok(rotY.transformed(input).almostEquals(new Vector3(1.0 / Math.sqrt(2.0), 0.0, 1.0 / Math.sqrt(2.0))));
        test.ok(rotZ.transformed(input).almostEquals(new Vector3(1.0 / Math.sqrt(2.0), 1.0 / Math.sqrt(2.0), 0.0)));
        // relativeTest(rotX.transformed(input), input);
        // relativeTest(rotY.transformed(input),
        //    new Vector3(1.0 / Math.sqrt(2.0), 0.0, 1.0 / Math.sqrt(2.0)));
        // relativeTest(rotZ.transformed(input),
        //    new Vector3(1.0 / Math.sqrt(2.0), 1.0 / Math.sqrt(2.0), 0.0));
		test.done();
    },
    
    testMatrix3Transform2 : function(test) {
		test.expect(2);
        rotZ = Matrix3.rotationZ(Math.PI / 4);
        trans = new Matrix3(1.0, 0.0, 3.0, 0.0, 1.0, 2.0, 3.0, 2.0, 1.0);
        
        input = new Vector2(1.0, 0.0);

        test.ok(rotZ.transform2(input.clone()).almostEquals(new Vector2(Math.sqrt(0.5), Math.sqrt(0.5))));
        // relativeTest(rotZ.transform2(input.clone()),

        test.ok(trans.transform2(input.clone()).almostEquals(new Vector2(4.0, 2.0)));
        // relativeTest(trans.transform2(input.clone()), new Vector2(4.0, 2.0));
		test.done();
    },
    
    testMatrix3AbsoluteRotate2 : function(test) {
		test.expect(2);
        rotZ = Matrix3.rotationZ(-Math.PI / 4);
        rotZcw = Matrix3.rotationZ(Math.PI / 4);
        // push translation
        rotZ.setEntry(2, 0, 3.0);
        rotZ.setEntry(2, 1, 2.0);
        
        input = new Vector2(1.0, 0.0);

        test.ok(rotZ.absoluteRotate2(input.clone()).almostEquals(new Vector2(Math.sqrt(0.5), Math.sqrt(0.5))));
        // relativeTest(rotZ.absoluteRotate2(input.clone()),
        //     new Vector2(Math.sqrt(0.5), Math.sqrt(0.5)));

        test.ok(rotZcw.absoluteRotate2(input.clone()).almostEquals(new Vector2(Math.sqrt(0.5), Math.sqrt(0.5))));
        // relativeTest(rotZcw.absoluteRotate2(input.clone()),
        //     new Vector2(Math.sqrt(0.5), Math.sqrt(0.5)));
		test.done();
    },
    
    testMatrix3ConstructorCopy : function(test) {
		test.expect(4);
        var a = new Vector3(1.0, 2.0, 3.0);
        var b = new Vector3(4.0, 5.0, 6.0);
        var c = new Vector3(7.0, 8.0, 9.0);
        m = Matrix3.columns(a, b, c);
        test.equals(m.entry(0, 0), 1.0);
        test.equals(m.entry(2, 2), 9.0);
        c.z = 5.0;
        a.x = 2.0;
        test.equals(m.entry(0, 0), 1.0);
        test.equals(m.entry(2, 2), 9.0);
		test.done();
    },
    
    testMatrix3Inversion : function(test) {
		test.expect(10);
        var m = new Matrix3(1.0, 0.0, 5.0, 2.0, 1.0, 6.0, 3.0, 4.0, 0.0);
        var result = Matrix3.zero();
        var det = result.copyInverse(m);
        test.equals(det, 1.0);
        test.equals(result.entry(0, 0), -24.0);
        test.equals(result.entry(1, 0), 20.0);
        test.equals(result.entry(2, 0), -5.0);
        test.equals(result.entry(0, 1), 18.0);
        test.equals(result.entry(1, 1), -15.0);
        test.equals(result.entry(2, 1), 4.0);
        test.equals(result.entry(0, 2), 5.0);
        test.equals(result.entry(1, 2), -4.0);
        test.equals(result.entry(2, 2), 1.0);
		test.done();
    },
    
    testMatrix3Dot : function(test) {
		test.expect(6);
        matrix =
            new Matrix3(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0);
        
        v = new Vector3(2.0, 3.0, 4.0);
        
        test.equals(matrix.dotRow(0, v), 42.0);
        test.equals(matrix.dotRow(1, v), 51.0);
        test.equals(matrix.dotRow(2, v), 60.0);
        test.equals(matrix.dotColumn(0, v), 20.0);
        test.equals(matrix.dotColumn(1, v), 47.0);
        test.equals(matrix.dotColumn(2, v), 74.0);
		test.done();
    },
    
    testMatrix3Scale : function(test) {
		test.expect(9);
        m = new Matrix3(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0);
        n = m.scaled(2.0);
        
        test.equals(n.storage[0], 2.0);
        test.equals(n.storage[1], 4.0);
        test.equals(n.storage[2], 6.0);
        test.equals(n.storage[3], 8.0);
        test.equals(n.storage[4], 10.0);
        test.equals(n.storage[5], 12.0);
        test.equals(n.storage[6], 14.0);
        test.equals(n.storage[7], 16.0);
        test.equals(n.storage[8], 18.0);
		test.done();
    },
    
    testMatrix3Solving : function(test) {
		test.expect(5);
        A = new Matrix3(2.0, 12.0, 8.0, 20.0, 24.0, 26.0, 8.0, 4.0, 60.0);
        
        b = new Vector3(32.0, 64.0, 72.0);
        result = Vector3.zero();
        
        b2 = new Vector2(32.0, 64.0);
        result2 =Vector2.zero();
        
        Matrix3.solve(A, result, b);
        Matrix3.solve2(A, result2, b2);
        
        backwards = A.transform(Vector3.copy(result));
        backwards2 = A.transform2(Vector2.copy(result2));
        
        test.equals(backwards.x, b.x);
        test.equals(backwards.y, b.y);
        test.equals(backwards.z, b.z);
        
        test.equals(backwards2.x, b2.x);
        test.equals(backwards2.y, b2.y);
		test.done();
    },
    
    testMatrix3Equals : function(test) {
		test.expect(2);
        test.ok(Matrix3.identity().equals(Matrix3.identity()));
        test.ok(! Matrix3.zero().equals(Matrix3.identity()));
        test.done();
        // expect(Matrix3.zero, isNot(equals(5)));
        // expect(
        //     new Matrix3.identity().hashCode, equals(new Matrix3.identity().hashCode));
    }
    
    
};
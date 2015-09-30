/**
 * Created by grizet_j on 9/21/2015.
 */

var Matrix2 = require('../../src/matrix2.js');
var Vector2 = require('../../src/vector2.js');
var TEST = require('./test_utils.js');

module.exports = {
    testMatrix2Adjoint : function(test) {
		test.expect(2);
        var input = [];
        var expectedOutput = [];

        input.push(TEST.parseMatrix("0.830828627896291   0.549723608291140\n \
        0.585264091152724   0.917193663829810"));
        expectedOutput.push(TEST.parseMatrix(" 0.917193663829810  -0.549723608291140\n \
         -0.585264091152724   0.830828627896291"));
        input.push(TEST.parseMatrix(" 1     0\n  0     1"));
        expectedOutput.push(TEST.parseMatrix(" 1     0\n  0     1"));

        //assert(input.length == expectedOutput.length);

        for ( i = 0; i < input.length; i++) {
            var output = input[i].clone();
            output.scaleAdjoint(1.0);
            test.ok(output.almostEquals(expectedOutput[i]));
            //TEST.relativeTest(test, output.relativeError(expectedOutput[i], 0.0));
        }
		test.done();
    },



    testMatrix2Determinant : function(test) {
		test.expect(1);
        var input = [];
        expectedOutput =  [];

        input.push(TEST.parseMatrix("0.830828627896291   0.549723608291140  \n  0.585264091152724   0.917193663829810"));
        expectedOutput.push(0.440297265243183);

        //assert(input.length == expectedOutput.length);

        for ( i = 0; i < input.length; i++) {
            output = input[i].determinant();
            //print('${input[i].cols}x${input[i].rows} = $output');
            TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();
    },



    testMatrix2Transform : function(test) {
		test.expect(2);
        var rot = Matrix2.rotation(Math.PI / 4);
        input = new Vector2(0.234245234259, 0.890723489233);

        expected = new Vector2(
            rot.entry(0, 0) * input.x + rot.entry(0, 1) * input.y,
            rot.entry(1, 0) * input.x + rot.entry(1, 1) * input.y);

        transExpected = new Vector2(
            rot.entry(0, 0) * input.x + rot.entry(1, 0) * input.y,
            rot.entry(0, 1) * input.x + rot.entry(1, 1) * input.y);

        test.ok(rot.transformed(input).almostEquals(expected));
        // relativeTest(rot.transformed(input), expected);
        test.ok(rot.transposed().transformed(input).almostEquals(transExpected));
        // relativeTest(rot.transposed().transformed(input), transExpected);
		test.done();
    },


    testMatrix2Inversion : function(test) {
		test.expect(5);
        m = new Matrix2(4.0, 3.0, 3.0, 2.0);
        result = Matrix2.zero();
        det = result.copyInverse(m);
        test.equals(det, -1.0);
        test.equals(result.entry(0, 0), -2.0);
        test.equals(result.entry(1, 0), 3.0);
        test.equals(result.entry(0, 1), 3.0);
        test.equals(result.entry(1, 1), -4.0);
		test.done();
    },


    testMatrix2Dot : function(test) {
		test.expect(4);
        matrix = new Matrix2(1.0, 2.0, 3.0, 4.0);

        v = new Vector2(3.0, 4.0);

        test.equals(matrix.dotRow(0, v), 15.0);
        test.equals(matrix.dotRow(1, v), 22.0);
        test.equals(matrix.dotColumn(0, v), 11.0);
        test.equals(matrix.dotColumn(1, v), 25.0);
		test.done();
    },


    testMatrix2Scale : function(test) {
		test.expect(4);
        m = new Matrix2(1.0, 2.0, 3.0, 4.0);
        n = m.scaled(2.0);

        test.equals(n.storage[0], 2.0);
        test.equals(n.storage[1], 4.0);
        test.equals(n.storage[2], 6.0);
        test.equals(n.storage[3], 8.0);
		test.done();
    },


    testMatrix2Solving : function(test) {
		test.expect(2);
        A = new Matrix2(2.0, 2.0, 8.0, 20.0);
        b = new Vector2(20.0, 64.0);
        result = Vector2.zero();

        Matrix2.solve(A, result, b);

        backwards = A.transform(Vector2.copy(result));

        test.equals(backwards.x, b.x);
        test.equals(backwards.y, b.y);
		test.done();
    },


    testMatrix2Equals : function(test) {
		test.expect(2);
        test.ok(Matrix2.identity().equals(Matrix2.identity()));
        test.ok(! Matrix2.identity().equals(Matrix2.zero()));
        //expect(new Matrix2.identity(), equals(new Matrix2.identity()));
        // expect(Matrix2.zero, isNot(equals(new Matrix2.identity())));
        // expect(Matrix2.zero, isNot(equals(5)));
        // expect(
            // new Matrix2.identity().hashCode, equals(new Matrix2.identity().hashCode));
        test.done();
    }
};
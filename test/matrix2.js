/**
 * Created by grizet_j on 9/21/2015.
 */

var Matrix2 = require('../src/matrix2.js');

module.exports = {
    testMatrix2Adjoint : function(test) {
		test.expect(0);
        var input = [];
        var expectedOutput = [];

        input.add(parseMatrix("0.830828627896291   0.549723608291140    0.585264091152724   0.917193663829810"));
        expectedOutput.add(parseMatrix(" 0.917193663829810  -0.549723608291140    -0.585264091152724   0.830828627896291"));
        input.add(parseMatrix(" 1     0    0     1"));
        expectedOutput.add(parseMatrix(" 1     0    0     1"));

        assert(input.length == expectedOutput.length);

        for ( i = 0; i < input.length; i++) {
            var output = input[i].clone();
            output.scaleAdjoint(1.0);
            relativeTest(output, expectedOutput[i]);
        }
		test.done();
    },



    testMatrix2Determinant : function(test) {
		test.expect(0);
        var input = [];
        expectedOutput =  [];

        input.add(parseMatrix("0.830828627896291   0.549723608291140    0.585264091152724   0.917193663829810"));
        expectedOutput.add(0.440297265243183);

        assert(input.length == expectedOutput.length);

        for ( i = 0; i < input.length; i++) {
            output = input[i].determinant();
            //print('${input[i].cols}x${input[i].rows} = $output');
            relativeTest(output, expectedOutput[i]);
        }
		test.done();
    },



    testMatrix2Transform : function(test) {
		test.expect(0);
        var rot = new Matrix2.rotation(Math.PI / 4);
        input = new Vector2(0.234245234259, 0.890723489233);

        expected = new Vector2(
            rot.entry(0, 0) * input.x + rot.entry(0, 1) * input.y,
            rot.entry(1, 0) * input.x + rot.entry(1, 1) * input.y);

        transExpected = new Vector2(
            rot.entry(0, 0) * input.x + rot.entry(1, 0) * input.y,
            rot.entry(0, 1) * input.x + rot.entry(1, 1) * input.y);

        relativeTest(rot.transformed(input), expected);
        relativeTest(rot.transposed().transformed(input), transExpected);
		test.done();
    },


    testMatrix2Inversion : function(test) {
		test.expect(0);
        m = new Matrix2(4.0, 3.0, 3.0, 2.0);
        result = Matrix2.zero;
        det = result.copyInverse(m);
        expect(det, -1.0);
        expect(result.entry(0, 0), -2.0);
        expect(result.entry(1, 0), 3.0);
        expect(result.entry(0, 1), 3.0);
        expect(result.entry(1, 1), -4.0);
		test.done();
    },


    testMatrix2Dot : function(test) {
		test.expect(0);
        matrix = new Matrix2(1.0, 2.0, 3.0, 4.0);

        v = new Vector2(3.0, 4.0);

        expect(matrix.dotRow(0, v), equals(15.0));
        expect(matrix.dotRow(1, v), equals(22.0));
        expect(matrix.dotColumn(0, v), equals(11.0));
        expect(matrix.dotColumn(1, v), equals(25.0));
		test.done();
    },


    testMatrix2Scale : function(test) {
		test.expect(0);
        m = new Matrix2(1.0, 2.0, 3.0, 4.0);
        n = m.scaled(2.0);

        expect(n.storage[0], equals(2.0));
        expect(n.storage[1], equals(4.0));
        expect(n.storage[2], equals(6.0));
        expect(n.storage[3], equals(8.0));
		test.done();
    },


    testMatrix2Solving : function(test) {
		test.expect(0);
        A = new Matrix2(2.0, 2.0, 8.0, 20.0);
        b = new Vector2(20.0, 64.0);
        result = new Vector2.zero();

        Matrix2.solve(A, result, b);

        backwards = A.transform(new Vector2.copy(result));

        expect(backwards.x, equals(b.x));
        expect(backwards.y, equals(b.y));
		test.done();
    },


    testMatrix2Equals : function(test) {
		test.expect(0);
        expect(new Matrix2.identity(), equals(new Matrix2.identity()));
        expect(Matrix2.zero, isNot(equals(new Matrix2.identity())));
        expect(Matrix2.zero, isNot(equals(5)));
        expect(
            new Matrix2.identity().hashCode, equals(new Matrix2.identity().hashCode));
        test.done();
    }
};
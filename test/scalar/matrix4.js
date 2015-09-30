/**
 * Created by grizet_j on 9/21/2015.
 */

var Matrix4 = require('../../src/matrix4.js');
var Vector2 = require('../../src/vector2.js');
var Matrix3 = require('../../src/matrix3.js');
var Vector3 = require('../../src/vector3.js');
var Vector4 = require('../../src/vector4.js');
var Quaternion = require('../../src/quaternion.js');
var TEST = require('./test_utils.js');

module.exports = {

    testMatrix4InstacingFromFloat32Array: function(test) {
		test.expect(16);
        float32Array = new Float32Array([
            1.0,        2.0,        3.0,        4.0,
            5.0,        6.0,        7.0,        8.0,
            9.0,        10.0,        11.0,        12.0,
            13.0,        14.0,        15.0,        16.0
        ]);
        input = Matrix4.fromFloat32Array(float32Array);
        
        test.equals(input.storage[0], 1.0);
        test.equals(input.storage[1], 2.0);
        test.equals(input.storage[2], 3.0);
        test.equals(input.storage[3], 4.0);

        test.equals(input.storage[4], 5.0);
        test.equals(input.storage[5], 6.0);
        test.equals(input.storage[6], 7.0);
        test.equals(input.storage[7], 8.0);
        
        test.equals(input.storage[8], 9.0);
        test.equals(input.storage[9], 10.0);
        test.equals(input.storage[10], 11.0);
        test.equals(input.storage[11], 12.0);
        
        test.equals(input.storage[12], 13.0);
        test.equals(input.storage[13], 14.0);
        test.equals(input.storage[14], 15.0);
        test.equals(input.storage[15], 16.0);
		test.done();
    },

    testMatrix4InstacingFromByteBuffer: function(test) {
		test.expect(32);
        float32Array = new Float32Array([
            1.0,            2.0,            3.0,        4.0,
            5.0,        6.0,        7.0,            8.0,        
            9.0,        10.0,        11.0,            12.0,        
            13.0,        14.0,        15.0,        16.0,        17.0
        ]);
        buffer = float32Array.buffer;
        zeroOffset = Matrix4.fromBuffer(buffer, 0);
        offsetVector =
            Matrix4.fromBuffer(buffer, Float32Array.BYTES_PER_ELEMENT);
        
        test.equals(zeroOffset.storage[0], 1.0);
        test.equals(zeroOffset.storage[1], 2.0);
        test.equals(zeroOffset.storage[2], 3.0);
        test.equals(zeroOffset.storage[3], 4.0);
        test.equals(zeroOffset.storage[4], 5.0);
        test.equals(zeroOffset.storage[5], 6.0);
        test.equals(zeroOffset.storage[6], 7.0);
        test.equals(zeroOffset.storage[7], 8.0);
        test.equals(zeroOffset.storage[8], 9.0);
        test.equals(zeroOffset.storage[9], 10.0);
        test.equals(zeroOffset.storage[10], 11.0);
        test.equals(zeroOffset.storage[11], 12.0);
        test.equals(zeroOffset.storage[12], 13.0);
        test.equals(zeroOffset.storage[13], 14.0);
        test.equals(zeroOffset.storage[14], 15.0);
        test.equals(zeroOffset.storage[15], 16.0);
        
        test.equals(offsetVector.storage[0], 2.0);
        test.equals(offsetVector.storage[1], 3.0);
        test.equals(offsetVector.storage[2], 4.0);
        test.equals(offsetVector.storage[3], 5.0);
        test.equals(offsetVector.storage[4], 6.0);
        test.equals(offsetVector.storage[5], 7.0);
        test.equals(offsetVector.storage[6], 8.0);
        test.equals(offsetVector.storage[7], 9.0);
        test.equals(offsetVector.storage[8], 10.0);
        test.equals(offsetVector.storage[9], 11.0);
        test.equals(offsetVector.storage[10], 12.0);
        test.equals(offsetVector.storage[11], 13.0);
        test.equals(offsetVector.storage[12], 14.0);
        test.equals(offsetVector.storage[13], 15.0);
        test.equals(offsetVector.storage[14], 16.0);
        test.equals(offsetVector.storage[15], 17.0);
		test.done();

    },

    testMatrix4Transpose: function(test) {
		test.expect(1);
        var inputA = [];
        var expectedOutput = [];
        inputA.push(TEST.parseMatrix(
            "0.337719409821377   0.780252068321138   0.096454525168389   0.575208595078466 \n" +
        "0.900053846417662   0.389738836961253   0.131973292606335   0.059779542947156 \n "+
        "0.369246781120215   0.241691285913833   0.942050590775485   0.234779913372406 \n " +
        "0.111202755293787   0.403912145588115   0.956134540229802   0.353158571222071"));
        expectedOutput.push(inputA[0].transposed());
        
        for ( i = 0; i < inputA.length; i++) {
            inputA[i].transpose();
            TEST.relativeTest(test, inputA[i], expectedOutput[i]);
        }
		test.done();

    },
    testMatrix4VectorMultiplication: function(test) {
		test.expect(1);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(TEST.parseMatrix(
            "0.337719409821377   0.780252068321138   0.096454525168389   0.575208595078466 \n \
        0.900053846417662   0.389738836961253   0.131973292606335   0.059779542947156 \n \
        0.369246781120215   0.241691285913833   0.942050590775485   0.234779913372406 \n \
    0.111202755293787   0.403912145588115   0.956134540229802   0.353158571222071"));
        inputB.push(TEST.parseVector("0.821194040197959 0.015403437651555 0.043023801657808 0.168990029462704"));
        expectedOutput.push(TEST.parseVector("0.390706088480722 0.760902311900085 0.387152194918898 0.198357495624973"));
        
        //assert(inputA.length == inputB.length);
       // assert(expectedOutput.length == inputB.length);
        
        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i].mult(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            // TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();

    },

    testMatrix4Multiplication: function(test) {
		test.expect(1);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(TEST.parseMatrix(
            "0.587044704531417   0.230488160211558   0.170708047147859   0.923379642103244 \n \
        0.207742292733028   0.844308792695389   0.227664297816554   0.430207391329584 \n \
        0.301246330279491   0.194764289567049   0.435698684103899   0.184816320124136 \n \
        0.470923348517591   0.225921780972399   0.311102286650413   0.904880968679893"));
        inputB.push(TEST.parseMatrix(
            "0.979748378356085   0.408719846112552   0.711215780433683   0.318778301925882 \n \
        0.438869973126103   0.594896074008614   0.221746734017240   0.424166759713807 \n \
        0.111119223440599   0.262211747780845   0.117417650855806   0.507858284661118 \n \
        0.258064695912067   0.602843089382083   0.296675873218327   0.085515797090044"));
        expectedOutput.push(TEST.parseMatrix(
        "0.933571062150012   0.978468014433530   0.762614053950618   0.450561572247979 \n \
           0.710396171182635   0.906228190244263   0.489336274658484   0.576762187862375 \n \
    0.476730868989407   0.464650419830879   0.363428748133464   0.415721232510293 \n \
    0.828623949506267   0.953951612073692   0.690010785130483   0.481326146122225"));

        //assert(inputA.length == inputB.length);
        //assert(expectedOutput.length == inputB.length);
        
        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i] * inputB[i];
            //pr('${inputA[i].cols}x${inputA[i].rows} * ${inputB[i].cols}x${inputB[i].rows} = ${output.cols}x${output.rows}');
            TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();

    },

    testMatrix4Adjoint: function(test) {
		test.expect(3);
        var input = [];
        var expectedOutput = [];
        
        input.push(TEST.parseMatrix(
            "0.934010684229183   0.011902069501241   0.311215042044805   0.262971284540144 \n \
        0.129906208473730   0.337122644398882   0.528533135506213   0.654079098476782 \n \
        0.568823660872193   0.162182308193243   0.165648729499781   0.689214503140008 \n \
        0.469390641058206   0.794284540683907   0.601981941401637   0.748151592823709"));
        expectedOutput.push(TEST.parseMatrix(
            "0.104914550911225  -0.120218628213523   0.026180662741638   0.044107217835411 \n \
            -0.081375770192194  -0.233925009984709  -0.022194776259965   0.253560794325371 \n \
        0.155967414263983   0.300399085119975  -0.261648453454468  -0.076412061081351 \n \
        -0.104925204524921   0.082065846290507   0.217666653572481  -0.077704028180558"));
        input.push(TEST.parseMatrix("1     0     0     0 \n\
        0     1     0     0 \n\
        0     0     1     0 \n\
        0     0     0     1"));
        expectedOutput.push(TEST.parseMatrix("1     0     0     0 \n\
        0     1     0     0 \n\
        0     0     1     0 \n\
        0     0     0     1"));
            
        input.push(TEST.parseMatrix(
            "0.450541598502498   0.152378018969223   0.078175528753184   0.004634224134067 \n \
        0.083821377996933   0.825816977489547   0.442678269775446   0.774910464711502 \n \
        0.228976968716819   0.538342435260057   0.106652770180584   0.817303220653433 \n \
        0.913337361501670   0.996134716626885   0.961898080855054   0.868694705363510"));
        expectedOutput.push(TEST.parseMatrix(
            "-0.100386867815513   0.076681891597503  -0.049082198794982  -0.021689260610181 \n \
            -0.279454715225440  -0.269081505356250   0.114433412778961   0.133858687769130 \n \
        0.218879650360982   0.073892735462981   0.069073300555062  -0.132069899391626 \n \
        0.183633794399577   0.146113141160308  -0.156100829983306  -0.064859465665816"));
            
       // assert(input.length == expectedOutput.length);
        
        for ( i = 0; i < input.length; i++) {
            var output = input[i].clone();
            output.scaleAdjoint(1.0);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            // TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();

    },

    testMatrix4Determinant: function(test) {
		test.expect(3);
        var input = [];
        expectedOutput = [];
        input.push(TEST.parseMatrix(
            "0.046171390631154   0.317099480060861   0.381558457093008   0.489764395788231 \n \
        0.097131781235848   0.950222048838355   0.765516788149002   0.445586200710899 \n \
        0.823457828327293   0.034446080502909   0.795199901137063   0.646313010111265 \n \
        0.694828622975817   0.438744359656398   0.186872604554379   0.709364830858073"));
        expectedOutput.push(-0.199908980087990);
        
        input.push(TEST.parseMatrix(
            "  -2.336158020850647   0.358791716162913   0.571930324052307   0.866477090273158 \n \
            -1.190335868711951   1.132044609886021  -0.693048859451418   0.742195189800671 \n \
        0.015919048685702   0.552417702663606   1.020805610524362  -1.288062497216858 \n \
        3.020318574990609  -1.197139524685751  -0.400475005629390   0.441263145991252"));
        expectedOutput.push(-5.002276533849802);
        
        input.push(TEST.parseMatrix(
            "0.934010684229183   0.011902069501241   0.311215042044805   0.262971284540144 \n \
        0.129906208473730   0.337122644398882   0.528533135506213   0.654079098476782 \n \
        0.568823660872193   0.162182308193243   0.165648729499781   0.689214503140008 \n \
        0.469390641058206   0.794284540683907   0.601981941401637   0.748151592823709"));
        expectedOutput.push(0.117969860982876);
        //assert(input.length == expectedOutput.length);
        
        for ( i = 0; i < input.length; i++) {
            var output = input[i].determinant();
            //pr('${input[i].cols}x${input[i].rows} = $output');
            TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();

    },
    testMatrix4SelfTransposeMultiply: function(test) {
		test.expect(1);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(TEST.parseMatrix(
            "0.450541598502498   0.152378018969223   0.078175528753184   0.004634224134067 \n \
        0.083821377996933   0.825816977489547   0.442678269775446   0.774910464711502 \n \
        0.228976968716819   0.538342435260057   0.106652770180584   0.817303220653433 \n \
        0.913337361501670   0.996134716626885   0.961898080855054   0.868694705363510"));
        inputB.push(TEST.parseMatrix(
            "0.450541598502498   0.152378018969223   0.078175528753184   0.004634224134067 \n \
        0.083821377996933   0.825816977489547   0.442678269775446   0.774910464711502 \n \
        0.228976968716819   0.538342435260057   0.106652770180584   0.817303220653433 \n \
        0.913337361501670   0.996134716626885   0.961898080855054   0.868694705363510"));
        expectedOutput.push(TEST.parseMatrix(
            "1.096629343508065   1.170948826011164   0.975285713492989   1.047596917860438 \n \
        1.170948826011164   1.987289692246011   1.393079247172284   1.945966332001094 \n \
        0.975285713492989   1.393079247172284   1.138698195167051   1.266161729169725 \n \
        1.047596917860438   1.945966332001094   1.266161729169725   2.023122749969790"));
            
        //assert(inputA.length == inputB.length);
       // assert(inputB.length == expectedOutput.length);
        
        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i].clone();
            output.transposeMultiply(inputB[i]);
            TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();

    },
    testMatrix4SelfMultiply: function(test) {
		test.expect(1);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(TEST.parseMatrix(
            "0.450541598502498   0.152378018969223   0.078175528753184   0.004634224134067 \n \
    0.083821377996933   0.825816977489547   0.442678269775446   0.774910464711502 \n \
    0.228976968716819   0.538342435260057   0.106652770180584   0.817303220653433 \n \
    0.913337361501670   0.996134716626885   0.961898080855054   0.868694705363510"));
        inputB.push(TEST.parseMatrix(
            "0.450541598502498   0.152378018969223   0.078175528753184   0.004634224134067 \n \
    0.083821377996933   0.825816977489547   0.442678269775446   0.774910464711502 \n \
    0.228976968716819   0.538342435260057   0.106652770180584   0.817303220653433 \n \
    0.913337361501670   0.996134716626885   0.961898080855054   0.868694705363510"));
        expectedOutput.push(TEST.parseMatrix(
            "0.237893273152584   0.241190507375353   0.115471053480014   0.188086069635435 \n \
    0.916103942227480   1.704973929800637   1.164721763902784   1.675285658272358 \n \
    0.919182849383279   1.351023203753565   1.053750106199745   1.215382950294249 \n \
    1.508657696357159   2.344965008135463   1.450552688877760   2.316940716769603"));
        
        //assert(inputA.length == inputB.length);
       // assert(inputB.length == expectedOutput.length);
        
        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i].clone();
            output.multiply(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            //TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();

    },
    testMatrix4SelfMultiplyTranspose: function(test) {
		test.expect(1);
        var inputA = [];
        var inputB = [];
        var expectedOutput = [];
        
        inputA.push(TEST.parseMatrix(
            "0.450541598502498   0.152378018969223   0.078175528753184   0.004634224134067 \n \
        0.083821377996933   0.825816977489547   0.442678269775446   0.774910464711502 \n \
        0.228976968716819   0.538342435260057   0.106652770180584   0.817303220653433 \n \
        0.913337361501670   0.996134716626885   0.961898080855054   0.868694705363510"));
        inputB.push(TEST.parseMatrix(
            "0.450541598502498   0.152378018969223   0.078175528753184   0.004634224134067 \n \
        0.083821377996933   0.825816977489547   0.442678269775446   0.774910464711502 \n \
        0.228976968716819   0.538342435260057   0.106652770180584   0.817303220653433 \n \
        0.913337361501670   0.996134716626885   0.961898080855054   0.868694705363510"));
        expectedOutput.push(TEST.parseMatrix(
            "0.232339681975335   0.201799089276976   0.197320406329789   0.642508126615338 \n \
        0.201799089276976   1.485449982570056   1.144315170085286   1.998154153033270 \n \
        0.197320406329789   1.144315170085286   1.021602397682138   1.557970885061235 \n \
        0.642508126615338   1.998154153033270   1.557970885061235   3.506347918663387"));
            
        //assert(inputA.length == inputB.length);
        //assert(inputB.length == expectedOutput.length);
        
        for ( i = 0; i < inputA.length; i++) {
            var output = inputA[i].clone();
            output.multiplyTranspose(inputB[i]);
            test.ok(output.almostEquals(expectedOutput[i], 0.0005));
            // TEST.relativeTest(test, output, expectedOutput[i]);
        }
		test.done();

    },
    testMatrix4Translation: function(test) {
		test.expect(1);
        var inputA = [];
        var inputB = [];
        var output1 = [];
        var output2 = [];
        
        inputA.push(Matrix4.identity());
        inputB.push(Matrix4.translationValues(1.0, 3.0, 5.7));
        output1.push(inputA[0].mult(inputB[0]));
        output2.push((Matrix4.identity()).translate(1.0, 3.0, 5.7));
        
        //assert(inputA.length == inputB.length);
        //assert(output1.length == output2.length);
        
        for ( i = 0; i < inputA.length; i++) {
            test.ok(output1[i].almostEquals(output2[i]));
            //relativeTest(output1[i], output2[i]);
        }
		test.done();

    },

    testMatrix4Scale: function(test) {
		test.expect(1);
        var inputA = [];
        var inputB = [];
        var output1 = [];
        var output2 = [];
        
        inputA.push(Matrix4.identity());
        inputB.push(Matrix4.diagonalValues(1.0, 3.0, 5.7, 1.0));
        output1.push(inputA[0].mult(inputB[0]));
        output2.push(Matrix4.identity().scale(1.0, 3.0, 5.7));
        
        // assert(inputA.length == inputB.length);
        // assert(output1.length == output2.length);
        
        for ( i = 0; i < inputA.length; i++) {
            test.ok(output1[i].almostEquals(output2[i]));
            // relativeTest(output1[i], output2[i]);
        }
		test.done();

    },

    testMatrix4Rotate: function(test) {
		test.expect(4);
        var output1 = [];
        var output2 = [];
        output1.push(Matrix4.rotationX(1.57079632679));
        output2.push(Matrix4.identity().rotateX(1.57079632679));
        output1.push(Matrix4.rotationY(1.57079632679 * 0.5));
        output2.push(Matrix4.identity().rotateY(1.57079632679 * 0.5));
        output1.push(Matrix4.rotationZ(1.57079632679 * 0.25));
        output2.push(Matrix4.identity().rotateZ(1.57079632679 * 0.25));
        {
            var axis = new Vector3(1.1, 1.1, 1.1);
            axis.normalize();
            angle = 1.5;
            
            q = Quaternion.axisAngle(axis, angle);
            R = q.asRotationMatrix();
            T = Matrix4.identity();
            T.setRotation(R);
            output1.push(T);
            
            output2.push(Matrix4.identity().rotate(axis, angle));
        }
        //assert(output1.length == output2.length);
        for ( i = 0; i < output1.length; i++) {
            test.ok(output1[i].almostEquals(output2[i]));
            // relativeTest(output1[i], output2[i]);
        }
		test.done();
    },

    testMatrix4GetRotation: function(test) {
		test.expect(1);
        mat4 = Matrix4.rotationX(Math.PI).clone().mult(Matrix4.rotationY(-Math.PI)).mult(Matrix4.rotationZ(Math.PI));
        mat3 = Matrix3.rotationX(Math.PI).clone().mult(Matrix3.rotationY(-Math.PI)).mult(Matrix3.rotationZ(Math.PI));
        matRot = mat4.getRotation();

        test.ok(mat3.almostEquals(matRot, 0.0005));
        //relativeTest(mat3, matRot);
		test.done();

    },
    testMatrix4Column: function(test) {
		test.expect(4);
        var I = Matrix4.zero();
        test.equals(I.getAt(0), 0.0);
        var c0 = new Vector4(1.0, 2.0, 3.0, 4.0);
        I.setColumn(0, c0);
        test.equals(I.getAt(0), 1.0);
        c0.x = 4.0;
        test.equals(I.getAt(0), 1.0);
        test.equals(c0.x, 4.0);
		test.done();

    },

    testMatrix4Inversion: function(test) {
		test.expect(17);
        m = new Matrix4(1.0, 0.0, 2.0, 2.0, 0.0, 2.0, 1.0, 0.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 2.0, 1.0, 4.0);
        var result = Matrix4.zero();
        var det = result.copyInverse(m);
        test.equals(det, 2.0);
        test.equals(result.entry(0, 0), -2.0);
        test.equals(result.entry(1, 0), 1.0);
        test.equals(result.entry(2, 0), -8.0);
        test.equals(result.entry(3, 0), 3.0);
        test.equals(result.entry(0, 1), -0.5);
        test.equals(result.entry(1, 1), 0.5);
        test.equals(result.entry(2, 1), -1.0);
        test.equals(result.entry(3, 1), 0.5);
        test.equals(result.entry(0, 2), 1.0);
        test.equals(result.entry(1, 2), 0.0);
        test.equals(result.entry(2, 2), 2.0);
        test.equals(result.entry(3, 2), -1.0);
        test.equals(result.entry(0, 3), 0.5);
        test.equals(result.entry(1, 3), -0.5);
        test.equals(result.entry(2, 3), 2.0);
        test.equals(result.entry(3, 3), -0.5);
		test.done();

    },

    testMatrix4Dot: function(test) {
		test.expect(6);
        matrix = new Matrix4(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0,
            9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0);
        
        v = new Vector4(1.0, 2.0, 3.0, 4.0);
        
        test.equals(matrix.dotRow(0, v), 90.0);
        test.equals(matrix.dotRow(1, v), 100.0);
        test.equals(matrix.dotRow(2, v), 110.0);
        test.equals(matrix.dotColumn(0, v), 30.0);
        test.equals(matrix.dotColumn(1, v), 70.0);
        test.equals(matrix.dotColumn(2, v), 110.0);
		test.done();

    },
/*
    testMatrix4PerspectiveTransform: function(test) {
		test.expect(1);
        matrix = makePerspectiveMatrix(Math.PI, 1.0, 1.0, 100.0);
        vec = new Vector3(10.0, 20.0, 30.0);
        
        matrix.perspectiveTransform(vec);

        test.ok(vec.almostEquals(new Vector3(0.0, 0.0, 1.087)));
        //relativeTest(vec, new Vector3(0.0, 0.0, 1.087));
		test.done();

    },
*/
    testMatrix4Solving: function(test) {
		test.expect(9);
        A = new Matrix4(2.0, 12.0, 8.0, 8.0, 20.0, 24.0, 26.0, 4.0, 8.0,
            4.0, 60.0, 12.0, 16.0, 16.0, 14.0, 64.0);
        
        A_small =
            new Matrix3(2.0, 12.0, 8.0, 20.0, 24.0, 26.0, 8.0, 4.0, 60.0);
        
        b = new Vector4(32.0, 64.0, 72.0, 8.0);
        result = Vector4.zero();
        
        b3 = new Vector3(32.0, 64.0, 72.0);
        result3 = Vector3.zero();
        
        b2 = new Vector2(32.0, 64.0);
        result2 = Vector2.zero();
        
        Matrix4.solve(A, result, b);
        Matrix4.solve3(A, result3, b3);
        Matrix4.solve2(A, result2, b2);
        
        backwards = A.transform(Vector4.copy(result));
        backwards3 = A.transform3(Vector3.copy(result3));
        backwards2 = A_small.transform2(Vector2.copy(result2));
        
        test.equals(backwards2.x, b.x);
        test.equals(backwards2.y, b.y);
        
        test.equals(backwards3.x, b.x);
        test.equals(backwards3.y, b.y);
        test.equals(backwards3.z, b.z);
        
        test.equals(backwards.x, b.x);
        test.equals(backwards.y, b.y);
        test.equals(backwards.z, b.z);
        test.equals(backwards.w, b.w);
		test.done();

    },
    testMatrix4Compose: function(test) {
		test.expect(324);
        var tValues = [
            Vector3.zero(),
            new Vector3(3.0, 0.0, 0.0),
            new Vector3(0.0, 4.0, 0.0),
            new Vector3(0.0, 0.0, 5.0),
            new Vector3(-6.0, 0.0, 0.0),
            new Vector3(0.0, -7.0, 0.0),
            new Vector3(0.0, 0.0, -8.0),
            new Vector3(-2.0, 5.0, -9.0),
            new Vector3(-2.0, -5.0, -9.0)
        ];
        
        var sValues = [
            new Vector3(1.0, 1.0, 1.0),
            new Vector3(2.0, 2.0, 2.0),
            new Vector3(1.0, -1.0, 1.0),
            new Vector3(-1.0, 1.0, 1.0),
            new Vector3(1.0, 1.0, -1.0),
            new Vector3(2.0, -2.0, 1.0),
            new Vector3(-1.0, 2.0, -2.0),
            new Vector3(-1.0, -1.0, -1.0),
            new Vector3(-2.0, -2.0, -2.0)
        ];
        
        var rValues = [
            Quaternion.identity(),
            new Quaternion(0.42073549240394825, 0.42073549240394825,
                0.22984884706593015, 0.7701511529340699),
            new Quaternion(0.16751879124639693, -0.5709414713577319,
                0.16751879124639693, 0.7860666291368439),
            new Quaternion(0.0, 0.9238795292366128, 0.0, 0.38268342717215614)
        ];
        
        for (var ti = 0; ti < tValues.length; ti++) {
            for (var si = 0; si < sValues.length; si++) {
                for (var ri = 0; ri < rValues.length; ri++) {
                    t = tValues[ti];
                    s = sValues[si];
                    r = rValues[ri];
                    
                    m = Matrix4.compose(t, r, s);
                    
                    var t2 = Vector3.zero();
                    var r2 = Quaternion.identity();
                    var s2 = Vector3.zero();
                    
                    m.decompose(t2, r2, s2);
                    
                    m2 = Matrix4.compose(t2, r2, s2);

                    test.ok(m2.almostEquals(m, 0.00005));
                    // relativeTest(m2, m);
                }
            }
        }
		test.done();

    },
    testMatrix4Equals: function(test) {
		test.expect(2);
        test.ok(Matrix4.identity().equals(Matrix4.identity()));
        test.ok(! Matrix4.identity().equals(Matrix4.zero()));
        // expect(new Matrix4.identity(), equals(new Matrix4.identity()));
        // expect(Matrix4.zero, isNot(equals(new Matrix4.identity())));
        //expect(Matrix4.zero, isNot(equals(5)));
        //expect(
        //    new Matrix4.identity().hashCode, equals(new Matrix4.identity().hashCode));
        test.done();
    }
    
};
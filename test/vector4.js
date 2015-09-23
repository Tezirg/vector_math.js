/**
 * Created by grizet_j on 9/21/2015.
 */
var Vector4 = require('../src/vector4.js');
var TEST = require('./test_utils.js');

module.exports = {
    testVector4InstacinfFromFloat32Array : function(test) {
        test.expect(4);
        float32List = new Float32Array([1.0, 2.0, 3.0, 4.0]);
        input = Vector4.fromFloat32Array(float32List);
        
        test.equals(input.x, 1.0);
        test.equals(input.y, 2.0);
        test.equals(input.z, 3.0);
        test.equals(input.w, 4.0);
        test.done();
    },
    
    testVector4InstacingFromByteBuffer : function(test) {
        test.expect(8);
        float32List = new Float32Array([1.0, 2.0, 3.0, 4.0, 5.0]);
        buffer = float32List.buffer;
        zeroOffset = Vector4.fromBuffer(buffer, 0);
        offsetVector = Vector4.fromBuffer(buffer, Float32Array.BYTES_PER_ELEMENT);
        
        test.equals(zeroOffset.x, 1.0);
        test.equals(zeroOffset.y, 2.0);
        test.equals(zeroOffset.z, 3.0);
        test.equals(zeroOffset.w, 4.0);
        
        test.equals(offsetVector.x, 2.0);
        test.equals(offsetVector.y, 3.0);
        test.equals(offsetVector.z, 4.0);
        test.equals(offsetVector.w, 5.0);
        test.done();
    },
    
    testVector4Add : function(test) {
        test.expect(8);
        a = new Vector4(5.0, 7.0, 3.0, 10.0);
        b = new Vector4(3.0, 8.0, 2.0, 2.0);
        
        a.add(b);
        test.equals(a.x, 8.0);
        test.equals(a.y, 15.0);
        test.equals(a.z, 5.0);
        test.equals(a.w, 12.0);
        
        b.add(a.scale(0.5));
        test.equals(b.x, 7.0);
        test.equals(b.y, 15.5);
        test.equals(b.z, 4.5);
        test.equals(b.w, 8.0);
        test.done();
    },
    
    testVector4MinMax : function(test) {
        test.expect(8);
        a = new Vector4(5.0, 7.0, -3.0, 10.0);
        b = new Vector4(3.0, 8.0, 2.0, 2.0);
        
        result = Vector4.zero();
        
        Vector4.min(a, b, result);
        test.equals(result.x, 3.0);
        test.equals(result.y, 7.0);
        test.equals(result.z, -3.0);
        test.equals(result.w, 2.0);
        
        Vector4.max(a, b, result);
        test.equals(result.x, 5.0);
        test.equals(result.y, 8.0);
        test.equals(result.z, 2.0);
        test.equals(result.w, 10.0);
        test.done();
    },

    testVector4Mix : function(test) {
        test.expect(12);
        a = new Vector4(5.0, 7.0, 3.0, 10.0);
        b = new Vector4(3.0, 8.0, 2.0, 2.0);
        
        result = Vector4.zero();
        
        Vector4.mix(a, b, 0.5, result);
        test.equals(result.x, 4.0);
        test.equals(result.y, 7.5);
        test.equals(result.z, 2.5);
        test.equals(result.w, 6.0);
        
        Vector4.mix(a, b, 0.0, result);
        test.equals(result.x, 5.0);
        test.equals(result.y, 7.0);
        test.equals(result.z, 3.0);
        test.equals(result.w, 10.0);
        
        Vector4.mix(a, b, 1.0, result);
        test.equals(result.x, 3.0);
        test.equals(result.y, 8.0);
        test.equals(result.z, 2.0);
        test.equals(result.w, 2.0);
        test.done();
    },

    testVector4Constructor : function(test) {
        test.expect(8);
        var v1 = new Vector4(2.0, 4.0, -1.5, 10.0);
        test.equals(v1.x, 2.0);
        test.equals(v1.y, 4.0);
        test.equals(v1.z, -1.5);
        test.equals(v1.w, 10.0);
        
        var v2 = new Vector4.all(2.0);
        test.equals(v2.x, 2.0);
        test.equals(v2.y, 2.0);
        test.equals(v2.z, 2.0);
        test.equals(v2.w, 2.0);
        test.done();
    },
    
    testVector4Length : function(test) {
        test.expect(7);
        a = new Vector4(5.0, 7.0, 3.0, 10.0);
        
        TEST.relativeTest(test, a.length, 13.5277);
        TEST.relativeTest(test, a.length2, 183.0);
        
        TEST.relativeTest(test, a.normalize().length, 13.5277);
        TEST.relativeTest(test, a.x, 0.3696);
        TEST.relativeTest(test, a.y, 0.5174);
        TEST.relativeTest(test, a.z, 0.2217);
        TEST.relativeTest(test, a.w, 0.7392);
        test.done();
    },
    
    testVector4SetLength : function(test) {
        test.expect(8);
        v0 = new Vector4(1.0, 2.0, 1.0, 1.0);
        v1 = new Vector4(3.0, -2.0, 2.0, 1.0);
        v2 = new Vector4(-1.0, 2.0, -2.0, -3.0);
        v3 = new Vector4(1.0, 0.0, 0.0, 0.0);
        
        v0.length = 0.0;
        test.ok(v0.almostEquals(Vector4.zero()));
        //TEST.relativeTest(test, v0, Vector4.zero);
        TEST.relativeTest(test, v0.length, 0.0);
        
        v1.length = 2.0;
        test.ok(v1.almostEquals(new Vector4(1.4142135381698608, -0.9428090453147888, 0.9428090453147888, 0.4714045226573944)));
        /*TEST.relativeTest(test,
            v1,
            new Vector4(1.4142135381698608, -0.9428090453147888, 0.9428090453147888,
                0.4714045226573944));
                */
        TEST.relativeTest(test, v1.length, 2.0);
        
        v2.length = 0.5;
        test.ok(v2.almostEquals(new Vector4(-0.1178511306643486, 0.2357022613286972, -0.2357022613286972, -0.3535533845424652)));
        /* TEST.relativeTest(test,
            v2,
            new Vector4(-0.1178511306643486, 0.2357022613286972, -0.2357022613286972, -0.3535533845424652));
            */
        TEST.relativeTest(test, v2.length, 0.5);
        
        v3.length = -1.0;
        test.ok(v3.almostEquals(new Vector4(-1.0, 0.0, 0.0, 0.0)));
        //TEST.relativeTest(test, v3, new Vector4(-1.0, 0.0, 0.0, 0.0));
        TEST.relativeTest(test, v3.length, 1.0);
        test.done();
    },
    
    testVector4Negate : function(test) {
        test.expect(4);
        var vec3 = new Vector4(1.0, 2.0, 3.0, 4.0);
        vec3.negate();
        test.equals(vec3.x, -1.0);
        test.equals(vec3.y, -2.0);
        test.equals(vec3.z, -3.0);
        test.equals(vec3.w, -4.0);
        test.done();
    },
    
    testVector4Equals : function(test) {
        test.expect(5);
        var v4 = new Vector4(1.0, 2.0, 3.0, 4.0);
        test.ok(v4.equals(new Vector4(1.0, 2.0, 3.0, 4.0)));
        test.ok(! v4.equals(new Vector4(0.0, 2.0, 3.0, 4.0)));
        test.ok(! v4.equals(new Vector4(1.0, 0.0, 3.0, 4.0)));
        test.ok(! v4.equals(new Vector4(1.0, 2.0, 0.0, 4.0)));
        test.ok(! v4.equals(new Vector4(1.0, 2.0, 3.0, 0.0)));
        test.done();
    },
    
    testVector4DistanceTo : function(test) {
        test.expect(2);
        var a = new Vector4(1.0, 1.0, 1.0, 0.0);
        var b = new Vector4(1.0, 3.0, 1.0, 0.0);
        var c = new Vector4(1.0, 1.0, -1.0, 0.0);
        
        test.equals(a.distanceTo(b), 2.0);
        test.equals(a.distanceTo(c), 2.0);
        test.done();
    },
    
    testVector4DistanceToSquared : function(test) {
        test.expect(2);
        var a = new Vector4(1.0, 1.0, 1.0, 0.0);
        var b = new Vector4(1.0, 3.0, 1.0, 0.0);
        var c = new Vector4(1.0, 1.0, -1.0, 0.0);
        
        test.equals(a.distanceToSquared(b), 4.0);
        test.equals(a.distanceToSquared(c), 4.0);
        test.done();
    },
    
    testVector4Clamp : function(test) {
        test.expect(1);
        var x = 2.0, y = 3.0, z = 4.0, w = 5.0;
        v0 = new Vector4(x, y, z, w);
        v1 = new Vector4(-x, -y, -z, -w);
        v2 = new Vector4(-2.0 * x, 2.0 * y, -2.0 * z, 2.0 * w).clamp(v1, v0);
        v3 = new Vector4(-x, y, -z, w);

        test.ok(v2.equals(v3));
        test.done();
    },
    
    testVector4ClampScalar : function(test) {
        test.expect(1);
        x = 2.0;
        v0 = new Vector4(-2.0 * x, 2.0 * x, -2.0 * x, 2.0 * x)
            .clampScalar(-x, x);
        v1 = new Vector4(-x, x, -x, x);
        test.ok(v0.equals(v1));
        test.done();
    },
    
    testVector4Floor : function(test) {
        test.expect(3);
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).floor();
        v1 = new Vector4(-0.5, 0.5, -0.5, 0.5).floor();
        v2 = new Vector4(-0.9, 0.9, -0.5, 0.9).floor();
        v3 = new Vector4(-1.0, 0.0, -1.0, 0.0);

        test.ok(v0.equals(v3));
        test.ok(v1.equals(v3));
        test.ok(v2.equals(v3));
        test.done();
    },

    testVector4Ceil : function(test) {
        test.expect(3);
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).ceil();
        v1 = new Vector4(-0.5, 0.51, -0.51, 0.5).ceil();
        v2 = new Vector4(-0.9, 0.9, -0.9, 0.9).ceil();
        v3 = new Vector4(0.0, 1.0, 0.0, 1.0);

        test.ok(v0.equals(v3));
        test.ok(v1.equals(v3));
        test.ok(v2.equals(v3));
        test.done();
    },
    
    testVector4Round : function(test) {
        test.expect(3);
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).round();
        v1 = new Vector4(-0.51, 0.51, -0.51, 0.51).round();
        v2 = new Vector4(-0.9, 0.9, -0.9, 0.9).round();
        vt = new Vector4(-1.0, 1.0, -1.0, 1.0);

        test.ok(v0.equals(Vector4.zero()));
        test.ok(v1.equals(vt));
        test.ok(v2.equals(vt));
        test.done();
    },

    testVector4RoundToZero : function(test) {
        test.expect(6);
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).roundToZero();
        v1 = new Vector4(-0.5, 0.5, -0.5, 0.5).roundToZero();
        v2 = new Vector4(-0.9, 0.9, -0.9, 0.9).roundToZero();
        v3 = new Vector4(-1.1, 1.1, -1.1, 1.1).roundToZero();
        v4 = new Vector4(-1.5, 1.5, -1.5, 1.5).roundToZero();
        v5 = new Vector4(-1.9, 1.9, -1.9, 1.9).roundToZero();

        var vt1 = Vector4.zero();
        var vt2 = new Vector4(-1.0, 1.0, -1.0, 1.0);

        test.ok(v0.equals(vt1));
        test.ok(v1.equals(vt1));
        test.ok(v2.equals(vt1));
        test.ok(v3.equals(vt2));
        test.ok(v4.equals(vt2));
        test.ok(v5.equals(vt2));
        test.done();
    }
};
/**
 * Created by grizet_j on 9/21/2015.
 */
var Vector4 = require('./src/vector4.js');

module.exports = {
    testVector4InstacinfFromFloat32Array : function(test) {
        float32List = new Float32Array([1.0, 2.0, 3.0, 4.0]);
        input = new Vector4.fromFloat32List(float32List);
        
        expect(input.x, equals(1.0));
        expect(input.y, equals(2.0));
        expect(input.z, equals(3.0));
        expect(input.w, equals(4.0));
    },
    
    testVector4InstacingFromByteBuffer : function(test) {
        float32List = new Float32List([1.0, 2.0, 3.0, 4.0, 5.0]);
        buffer = float32List.buffer;
        zeroOffset = new Vector4.fromBuffer(buffer, 0);
        offsetVector =
            new Vector4.fromBuffer(buffer, Float32List.BYTES_PER_ELEMENT);
        
        expect(zeroOffset.x, equals(1.0));
        expect(zeroOffset.y, equals(2.0));
        expect(zeroOffset.z, equals(3.0));
        expect(zeroOffset.w, equals(4.0));
        
        expect(offsetVector.x, equals(2.0));
        expect(offsetVector.y, equals(3.0));
        expect(offsetVector.z, equals(4.0));
        expect(offsetVector.w, equals(5.0));
    },
    
    testVector4Add : function(test) {
        a = new Vector4(5.0, 7.0, 3.0, 10.0);
        b = new Vector4(3.0, 8.0, 2.0, 2.0);
        
        a.add(b);
        expect(a.x, equals(8.0));
        expect(a.y, equals(15.0));
        expect(a.z, equals(5.0));
        expect(a.w, equals(12.0));
        
        b.addScaled(a, 0.5);
        expect(b.x, equals(7.0));
        expect(b.y, equals(15.5));
        expect(b.z, equals(4.5));
        expect(b.w, equals(8.0));
    },
    
    testVector4MinMax : function(test) {
        a = new Vector4(5.0, 7.0, -3.0, 10.0);
        b = new Vector4(3.0, 8.0, 2.0, 2.0);
        
        result = Vector.zero;
        
        Vector4.min(a, b, result);
        expect(result.x, equals(3.0));
        expect(result.y, equals(7.0));
        expect(result.z, equals(-3.0));
        expect(result.w, equals(2.0));
        
        Vector4.max(a, b, result);
        expect(result.x, equals(5.0));
        expect(result.y, equals(8.0));
        expect(result.z, equals(2.0));
        expect(result.w, equals(10.0));
    },

    testVector4Mix : function(test) {
        a = new Vector4(5.0, 7.0, 3.0, 10.0);
        b = new Vector4(3.0, 8.0, 2.0, 2.0);
        
        result = Vector.zero;
        
        Vector4.mix(a, b, 0.5, result);
        expect(result.x, equals(4.0));
        expect(result.y, equals(7.5));
        expect(result.z, equals(2.5));
        expect(result.w, equals(6.0));
        
        Vector4.mix(a, b, 0.0, result);
        expect(result.x, equals(5.0));
        expect(result.y, equals(7.0));
        expect(result.z, equals(3.0));
        expect(result.w, equals(10.0));
        
        Vector4.mix(a, b, 1.0, result);
        expect(result.x, equals(3.0));
        expect(result.y, equals(8.0));
        expect(result.z, equals(2.0));
        expect(result.w, equals(2.0));
    },

    testVector4Constructor : function(test) {
        var v1 = new Vector4(2.0, 4.0, -1.5, 10.0);
        expect(v1.x, equals(2.0));
        expect(v1.y, equals(4.0));
        expect(v1.z, equals(-1.5));
        expect(v1.w, equals(10.0));
        
        var v2 = new Vector4.all(2.0);
        expect(v2.x, equals(2.0));
        expect(v2.y, equals(2.0));
        expect(v2.z, equals(2.0));
        expect(v2.w, equals(2.0));
    },
    
    testVector4Length : function(test) {
        a = new Vector4(5.0, 7.0, 3.0, 10.0);
        
        relativeTest(a.length, 13.5277);
        relativeTest(a.length2, 183.0);
        
        relativeTest(a.normalizeLength(), 13.5277);
        relativeTest(a.x, 0.3696);
        relativeTest(a.y, 0.5174);
        relativeTest(a.z, 0.2217);
        relativeTest(a.w, 0.7392);
    },
    
    testVector4SetLength : function(test) {
        v0 = new Vector4(1.0, 2.0, 1.0, 1.0);
        v1 = new Vector4(3.0, -2.0, 2.0, 1.0);
        v2 = new Vector4(-1.0, 2.0, -2.0, -3.0);
        v3 = new Vector4(1.0, 0.0, 0.0, 0.0);
        
        v0.length = 0.0;
        relativeTest(v0, Vector.zero);
        relativeTest(v0.length, 0.0);
        
        v1.length = 2.0;
        relativeTest(
            v1,
            new Vector4(1.4142135381698608, -0.9428090453147888, 0.9428090453147888,
                0.4714045226573944));
        relativeTest(v1.length, 2.0);
        
        v2.length = 0.5;
        relativeTest(
            v2,
            new Vector4(-0.1178511306643486, 0.2357022613286972, -0.2357022613286972,
                -0.3535533845424652));
        relativeTest(v2.length, 0.5);
        
        v3.length = -1.0;
        relativeTest(v3, new Vector4(-1.0, 0.0, 0.0, 0.0));
        relativeTest(v3.length, 1.0);
    },
    
    testVector4Negate : function(test) {
        var vec3 = new Vector4(1.0, 2.0, 3.0, 4.0);
        vec3.negate();
        expect(vec3.x, equals(-1.0));
        expect(vec3.y, equals(-2.0));
        expect(vec3.z, equals(-3.0));
        expect(vec3.w, equals(-4.0));
    },
    
    testVector4Equals : function(test) {
        var v4 = new Vector4(1.0, 2.0, 3.0, 4.0);
        expect(v4 == new Vector4(1.0, 2.0, 3.0, 4.0), isTrue);
        expect(v4 == new Vector4(0.0, 2.0, 3.0, 4.0), isFalse);
        expect(v4 == new Vector4(1.0, 0.0, 3.0, 4.0), isFalse);
        expect(v4 == new Vector4(1.0, 2.0, 0.0, 4.0), isFalse);
        expect(v4 == new Vector4(1.0, 2.0, 3.0, 0.0), isFalse);
        expect(new Vector4(1.0, 2.0, 3.0, 4.0).hashCode,
            equals(new Vector4(1.0, 2.0, 3.0, 4.0).hashCode));
    },
    
    testVector4DistanceTo : function(test) {
        var a = new Vector4(1.0, 1.0, 1.0, 0.0);
        var b = new Vector4(1.0, 3.0, 1.0, 0.0);
        var c = new Vector4(1.0, 1.0, -1.0, 0.0);
        
        expect(a.distanceTo(b), equals(2.0));
        expect(a.distanceTo(c), equals(2.0));
    },
    
    testVector4DistanceToSquared : function(test) {
        var a = new Vector4(1.0, 1.0, 1.0, 0.0);
        var b = new Vector4(1.0, 3.0, 1.0, 0.0);
        var c = new Vector4(1.0, 1.0, -1.0, 0.0);
        
        expect(a.distanceToSquared(b), equals(4.0));
        expect(a.distanceToSquared(c), equals(4.0));
    },
    
    testVector4Clamp : function(test) {
        x = 2.0, y = 3.0, z = 4.0, w = 5.0;
        v0 = new Vector4(x, y, z, w);
        v1 = new Vector4(-x, -y, -z, -w);
        v2 = new Vector4(-2.0 * x, 2.0 * y, -2.0 * z, 2.0 * w).clamp(v1, v0);
        
        expect(v2.storage, orderedEquals([-x, y, -z, w]));
    },
    
    testVector4ClampScalar : function(test) {
        x = 2.0;
        v0 = new Vector4(-2.0 * x, 2.0 * x, -2.0 * x, 2.0 * x)
            .clampScalar(-x, x);
        
        expect(v0.storage, orderedEquals([-x, x, -x, x]));
    },
    
    testVector4Floor : function(test) {
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).floor();
        v1 = new Vector4(-0.5, 0.5, -0.5, 0.5).floor();
        v2 = new Vector4(-0.9, 0.9, -0.5, 0.9).floor();

        expect(v0.storage, orderedEquals([-1.0, 0.0, -1.0, 0.0]));
        expect(v1.storage, orderedEquals([-1.0, 0.0, -1.0, 0.0]));
        expect(v2.storage, orderedEquals([-1.0, 0.0, -1.0, 0.0]));
    },

    testVector4Ceil : function(test) {
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).ceil();
        v1 = new Vector4(-0.5, 0.5, -0.5, 0.5).ceil();
        v2 = new Vector4(-0.9, 0.9, -0.9, 0.9).ceil();
        
        expect(v0.storage, orderedEquals([0.0, 1.0, 0.0, 1.0]));
        expect(v1.storage, orderedEquals([0.0, 1.0, 0.0, 1.0]));
        expect(v2.storage, orderedEquals([0.0, 1.0, 0.0, 1.0]));
    },
    
    testVector4Round : function(test) {
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).round();
        v1 = new Vector4(-0.5, 0.5, -0.5, 0.5).round();
        v2 = new Vector4(-0.9, 0.9, -0.9, 0.9).round();

        expect(v0.storage, orderedEquals([0.0, 0.0, 0.0, 0.0]));
        expect(v1.storage, orderedEquals([-1.0, 1.0, -1.0, 1.0]));
        expect(v2.storage, orderedEquals([-1.0, 1.0, -1.0, 1.0]));
    },

    testVector4RoundToZero : function(test) {
        v0 = new Vector4(-0.1, 0.1, -0.1, 0.1).roundToZero();
        v1 = new Vector4(-0.5, 0.5, -0.5, 0.5).roundToZero();
        v2 = new Vector4(-0.9, 0.9, -0.9, 0.9).roundToZero();
        v3 = new Vector4(-1.1, 1.1, -1.1, 1.1).roundToZero();
        v4 = new Vector4(-1.5, 1.5, -1.5, 1.5).roundToZero();
        v5 = new Vector4(-1.9, 1.9, -1.9, 1.9).roundToZero();

        expect(v0.storage, orderedEquals([0.0, 0.0, 0.0, 0.0]));
        expect(v1.storage, orderedEquals([0.0, 0.0, 0.0, 0.0]));
        expect(v2.storage, orderedEquals([0.0, 0.0, 0.0, 0.0]));
        expect(v3.storage, orderedEquals([-1.0, 1.0, -1.0, 1.0]));
        expect(v4.storage, orderedEquals([-1.0, 1.0, -1.0, 1.0]));
        expect(v5.storage, orderedEquals([-1.0, 1.0, -1.0, 1.0]));
    }
};
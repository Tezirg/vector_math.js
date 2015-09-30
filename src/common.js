
module.exports = vector_math;

var SIMD = require("simd");

function vector_math() {}

vector_math.EPSILON = typeof Number.EPSILON !== undefined ? Number.EPSILON : 1e-6;
vector_math.ENABLE_SIMD =  false;
vector_math.SIMD_AVAILABLE = typeof SIMD !== undefined;
vector_math.USE_SIMD = function() { return vector_math.ENABLE_SIMD && vector_math.SIMD_AVAILABLE };
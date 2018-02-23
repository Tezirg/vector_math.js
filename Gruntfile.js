var fs = require('fs')

module.exports = function(grunt) {
	var package_json = grunt.file.readJSON('package.json');
    var bundlePath = "build/vector_math." + package_json['version'] + ".js";
    var minifiedBundlePath = "build/vector_math." + package_json['version'] + ".min.js";

    grunt.initConfig({
        browserify : {
            vector_math : {
                src : ["src/vector_math.js"],
                dest : bundlePath,
                browserifyOptions: {
                    standalone : "vector_math"
                }
            }
        },
		concat: {
			// concat task configuration goes here.
		},

        uglify : {
            build : {
                src : [bundlePath],
                dest : minifiedBundlePath
            }
        },

        nodeunit: {
            all: [
                'test/scalar/vector2.js',
                'test/scalar/vector3.js',
                'test/scalar/vector4.js',
                'test/scalar/matrix2.js',
                'test/scalar/matrix3.js',
                'test/scalar/matrix4.js',
                'test/scalar/quaternion.js',
                'test/scalar/plane.js',
                'test/scalar/sphere.js',
                'test/scalar/triangle.js',
                'test/scalar/quad.js',
                'test/scalar/ray.js',
                'test/scalar/aabb2.js',
                'test/scalar/aabb3.js',

                'test/simd/vector2.js',
                'test/simd/vector3.js',
                'test/simd/vector4.js',
                'test/simd/matrix2.js',
                'test/simd/matrix3.js',
                'test/simd/matrix4.js',
                'test/simd/quaternion.js',
                'test/simd/plane.js',
                'test/simd/sphere.js',
                'test/simd/triangle.js',
                'test/simd/quad.js',
                'test/simd/ray.js',
                'test/simd/aabb2.js',
                'test/simd/aabb3.js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.registerTask('test', ['nodeunit']);
    
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    //@todo: Add code linling for SIMD .load and .store functions
    grunt.registerTask('build', ['browserify', 'uglify']);
};

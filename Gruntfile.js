var fs = require('fs')

module.exports = function(grunt) {

    var bundlePath = "build/vector_math.js",
        minifiedBundlePath = "build/vector_math.min.js";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n\n'
            }
        },

        browserify : {
            vector_math : {
                src : ["src/vector_math.js"],
                dest : bundlePath,
                options : {
                    bundleOptions: {
                        standalone : "vector_math"
                    }
                }
            }
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

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['test', 'concat', 'browserify', 'uglify', 'addLicense', 'addDate', 'requireJsFix']);
    grunt.registerTask('test', ['nodeunit']);

    grunt.registerTask('addDate','Adds the current date to the top of the built files',function(){
        var text = '// ' + new Date().toUTCString() + '\n';

        var dev = fs.readFileSync(bundlePath).toString();
        var min = fs.readFileSync(minifiedBundlePath).toString();

        fs.writeFileSync(bundlePath,text+"\n"+dev);
        fs.writeFileSync(minifiedBundlePath,text+"\n"+min);
    });

    grunt.registerTask('addLicense','Adds the LICENSE to the top of the built files',function(){
        var text = fs.readFileSync("LICENSE").toString();

        var dev = fs.readFileSync(bundlePath).toString();
        var min = fs.readFileSync(minifiedBundlePath).toString();

        fs.writeFileSync(bundlePath,text+"\n"+dev);
        fs.writeFileSync(minifiedBundlePath,text+"\n"+min);
    });

    // Not sure what flag Browserify needs to do this. Fixing it manually for now.
    grunt.registerTask('requireJsFix','Modifies the browserify bundle so it works with RequireJS',function(){
        [bundlePath, minifiedBundlePath].forEach(function(path){
            var text = fs.readFileSync(path).toString();
            text = text.replace('define.amd', 'false'); // This makes the bundle skip using define() from RequireJS
            fs.writeFileSync(path, text);
        });
    });
};

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
                'test/vector2.js',
                'test/vector3.js',
                'test/vector4.js',
                'test/matrix2.js',
                'test/matrix3.js',
                'test/matrix4.js',
                'test/quaternion.js',
                'test/plane.js',
                'test/sphere.js',
                'test/triangle.js',
                'test/ray.js'
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

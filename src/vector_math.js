/**
 * Created by grizet_j on 9/20/2015.
 */
module.exports = {
    version:     require('../package.json').version,


    Vector2:     require('./vector2.js'),
    Vector3:     require('./vector3.js'),
    Vector4:     require('./vector4.js'),
    Matrix2:     require('./matrix2.js'),
    Matrix3:     require('./matrix3.js'),
    Matrix4:     require('./matrix4.js'),
    Quaternion:  require('./quaternion.js'),
    Plane:       require('./plane.js'),
    Sphere:      require('./sphere.js'),
    Ray:         require('./ray.js'),
    Triangle:    require('./triangle.js')
};
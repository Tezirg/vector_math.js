# vector_math.js
### A Vector math library for 3D and 2D applications
Javascript version of [vector_math.dart](https://github.com/google/vector_math.dart) with SIMD implementation from [glMatrix](https://github.com/toji/gl-matrix)

## Features

* 2D, 3D, and 4D vector and matrix types.
* Quaternion type for animating rotations.
* Collision detection: AABB, rays, spheres, ...
* Utilities like color and common rendering related operations
* Flexible getters and setters, for example, ```position.xwz = color.grb;```.
* Fully documented.
* Well tested.
* Heavily optimized.

### Browser install

```html
<scrpit src="vector_math.min.js"></script>
```

### Example

This sample code shows how to maniupulate matrices : 
```javascript
var m1 = Matrix4.identity();
var m2 = new Matrix4(0.0, 1.0, 2.0, 3.0,
                     0,0, 1.0, 2.0, 3.0
                     0.0, 1.0, 2.0, 3.0);
var scale_mul = m1.scaled(0.5).mult(m2);
```

This sample code shows how to maniupulate vectors : 
```javascript
var v1 = Vector3.zero();
var v2 = new Vector3(1.0, 0.0, 2.0);
console.log("Dot product = ") + v1.dot(v2));
console.log("v1 + v2 = " + v1.added(v2).toString());
```

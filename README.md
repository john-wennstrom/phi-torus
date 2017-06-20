# phi-torus version 0.3.2
An array of torus that expands to the `n:th` torus based on ratio of Phi.

Every torus `n` has:

* ODia to IDia ratio is `Phi^(2n - 1)`
* Surface mapping dimension follows `36 x 9( L(2n + 1) )`, where 
* is the numbers from the [Lucas sequence](https://en.wikipedia.org/wiki/Lucas_sequence)
* Total points: `Surface mapping * 2`

![Image of torus array](https://github.com/johnny-human/phi-torus/blob/master/torus.png)

####Also in this package:

Initialize a spiraling torus with mesh and colors:
```
initTorusModel(globals)
``` 
Initialize the torus above:
```
initPhiTorusModel(globals)
```
Initialize the points of a chestahedron:
```
let chestahdron = new Chestahedron(globals, {
    scale: 1,
    lines: true,
    faces: true,
    points: false
})
```

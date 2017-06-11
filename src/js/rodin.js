var container;
var camera, scene, renderer;
var cameraFov = 60;
var circle = [];

// Materials
let material = {
    basicLine: new THREE.LineBasicMaterial({color: 0xFFFFFF}),
    dashedLine: new THREE.LineDashedMaterial({color: 0xffaa00, dashSize: 0.3, gapSize: 0.2})
}

init()
animate()

function init() {
    container = document.getElementById('container')
    scene = new THREE.Scene()
    // Add camera
    camera = new THREE.PerspectiveCamera(cameraFov, window.innerWidth / window.innerHeight, 0.1, 1000)
    // Add light
    let light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
    light.position = (0, 10, 0)
    scene.add(new THREE.AmbientLight(0x000000))
    scene.add(light)

    draw()

    // Add renderer
    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setClearColor(0x111111, 1.0)
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)
}

function draw() {

    // Draw main circle
    circle[0] = createCircle(1, 40)
    scene.add(new THREE.Line(circle[0], material.basicLine));
    //circle1.translate(1,1,0)

    // Draw numbers and their circles
    let numbers = addNumbers(1)
    for (i = 0; i < numbers.length; i++) {
        scene.add(new THREE.Line(numbers[i], material.basicLine))
    }

    // Draw Rodin lines that connect the numbers
    let rodinlines = createRodinLines()
    scene.add(new THREE.Line(rodinlines, material.basicLine));

    // Draw Rodin lines 6 to 9 to 3
    let rodinlines693 = createRodinLines693()
    scene.add(new THREE.Line(rodinlines693, material.dashedLine));

    // Draw central point where lines intersect
    circle[1] = createCircle(1/12, 16)
    let vecA = rodinVectors([1, 5])
    let vecB = rodinVectors([4, 8])
    let intersectionPoint = lineIntersect2D(
        [{x: vecA[0].x, y: vecA[0].y}, {x: vecA[1].x, y: vecA[1].y}],
        [{x: vecB[0].x, y: vecB[0].y}, {x: vecB[1].x, y: vecB[1].y}]
    )
    circle[1].translate(0, intersectionPoint.y, 0)
    scene.add(new THREE.Line(circle[1], material.basicLine));

}

function createRodinLines() {
    let geometry = new THREE.Geometry()
    geometry.vertices = rodinVectors([1, 2, 4, 8, 7, 5, 1])
    return geometry
}

function createRodinLines693() {
    let geometry = new THREE.Geometry()
    geometry.vertices = rodinVectors([6, 9, 3])
    return geometry
}

function lineIntersect2D(a, b){
    a.m = (a[0].y - a[1].y) / (a[0].x - a[1].x);  // slope of line 1
    b.m = (b[0].y - b[1].y) / (b[0].x - b[1].x);  // slope of line 2
    return a.m - b.m < Number.EPSILON
        ? undefined
        : { x: (a.m * a[0].x - b.m*b[0].x + b[0].y - a[0].y) / (a.m - b.m),
            y: (a.m*b.m*(b[0].x-a[0].x) + b.m*a[0].y - a.m*b[0].y) / (b.m - a.m)
          };
}

function rodinVectors(arr) {
    let vectors = []

    for (i = 0; i < arr.length; i++) {
        let p = (11 - arr[i]) >= 9 ? (11 - arr[i] - 9) : 11 - arr[i]
        let angle = (40 * Math.PI / 180 * p) + (Math.PI / 18)

        vectors.push( new THREE.Vector3(cartesian(1, angle).x, cartesian(1, angle).y, 0) )
    }
    return vectors
}

function addNumbers(radius) {
    let circles = []

    for (i = 0; i < 10; i++) {
        let angle = (40 * Math.PI / 180 * i) + (Math.PI / 18)
        let pos = cartesian(radius, angle)

        let circle = createCircle(radius / 12, 16)
        circle.translate(pos.x, pos.y, 0)
        circles.push(circle)

    }
    return circles
}

function cartesian(radius, angle) {
    return {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
    }
}

function createCircle(radius, segmentCount) {
    let geometry = new THREE.Geometry()

    for (var i = 0; i <= segmentCount; i++) {
        var theta = (i / segmentCount) * Math.PI * 2
        geometry.vertices.push(
            new THREE.Vector3(
                Math.cos(theta) * radius,
                Math.sin(theta) * radius,
                0))
    }
    return geometry
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var aspect = window.innerWidth / window.innerHeight;
    var fov = cameraFov * ( Math.PI / 180 );
    var objectSize = 0.6 + ( 0.5 * Math.sin(Date.now() * 0.001) );

    var cameraPosition = new THREE.Vector3(
        0,
        1,
        6
    );

    camera.position.copy(cameraPosition);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer.render(scene, camera);
}
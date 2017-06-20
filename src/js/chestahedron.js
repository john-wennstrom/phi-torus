/*
 * Chestahedron has 7 Vertices and 7 Sides
 * Vertices: A, B, C, P, Q, R, T
 * Sides: AQTR, CRTP, BPTQ, ARC, BQA, BPC, ABC
 */

function Chestahedron(globals, options) {
    let defaults = {
        radius: null,
        faceArea: null,
        scale: 13,
        faces: true,
        lines: true,
        points: true
    }

    // protected
    this.options = globals.setDefaults(options, defaults)
    this.chestahedron = new THREE.Group()
    globals.world.sceneAdd(this.chestahedron)

    // private
    let theta = 94.8309261816304
    let thetaRad = theta / 180 * Math.PI

    let baseTriangle = new EquiliteralTriangle({side: this.options.scale})

    // Calculate vertices
    this.vertices = {}
    this.vertices.A = {
        x: baseTriangle.radius('out'),
        y: 0,
        z: 0
    }
    this.vertices.B = {
        x: -baseTriangle.radius('in'),
        y: 0,
        z: -this.options.scale / 2
    }
    this.vertices.C = {
        x: this.vertices.B.x,
        y: 0,
        z: -this.vertices.B.z
    }
    this.vertices.P = {
        x: (-(Math.sqrt(3) / 2) * ((1 / 3) - Math.cos(thetaRad))) * this.options.scale,
        y: ((Math.sqrt(3) / 2) * Math.sin(thetaRad)) * this.options.scale,
        z: 0
    }
    this.vertices.Q = {
        x: ((Math.sqrt(3) / 4) * ((1 / 3) - Math.cos(thetaRad))) * this.options.scale,
        y: (Math.sqrt(3) / 2) * Math.sin(thetaRad) * this.options.scale,
        z: (-(1 / 4) + (0.75 * Math.cos(thetaRad))) * this.options.scale
    }
    this.vertices.R = {
        x: this.vertices.Q.x,
        y: this.vertices.Q.y,
        z: -this.vertices.Q.z
    }
    this.vertices.T = {
        x: 0,
        y: ( (Math.sin(thetaRad) / 2) / ((1 / Math.sqrt(3)) - ((Math.sqrt(3) / 4) * ((1 / 3) - Math.cos(thetaRad)))) ) * this.options.scale,
        z: 0
    }

    this._draw()
}

Chestahedron.prototype._draw = function(){
    if (this.options.points) {
        this.chestahedron.add(this.addPoints())
    }

    if (this.options.lines) {
        this.chestahedron.add(this.addLines())
    }

    if (this.options.faces) {
        this.chestahedron.add(this.addFaces())
    }
}

Chestahedron.prototype.addPoints = function () {
    let geometry = new THREE.BufferGeometry()
    let V = this.vertices

    let points = Float32Array.from([
        V.A.x, V.A.y, V.A.z,
        V.B.x, V.B.y, V.B.z,
        V.C.x, V.C.y, V.C.z,
        V.P.x, V.P.y, V.P.z,
        V.Q.x, V.Q.y, V.Q.z,
        V.R.x, V.R.y, V.R.z,
        V.T.x, V.T.y, V.T.z
    ])

    geometry.addAttribute('position', new THREE.BufferAttribute(points, 3))
    let material = new THREE.PointsMaterial({size: 0.1, color: 0x666666})

    return new THREE.Points(geometry, material)
}

Chestahedron.prototype.addLines = function () {
    let lines = new THREE.Object3D()

    let V = this.vertices
    let A = [V.A.x, V.A.y, V.A.z]
    let B = [V.B.x, V.B.y, V.B.z]
    let C = [V.C.x, V.C.y, V.C.z]
    let P = [V.P.x, V.P.y, V.P.z]
    let Q = [V.Q.x, V.Q.y, V.Q.z]
    let R = [V.R.x, V.R.y, V.R.z]
    let T = [V.T.x, V.T.y, V.T.z]

    const flatten = arr => arr.reduce(
        (acc, val) => acc.concat(
            Array.isArray(val) ? flatten(val) : val
        ),
        []
    )

    lines.add( this.addLine(Float32Array.from(flatten([A, Q, T, R, A]))) )
    lines.add( this.addLine(Float32Array.from(flatten([A, B, C, A]))) )
    lines.add( this.addLine(Float32Array.from(flatten([T, P, B, Q]))) )
    lines.add( this.addLine(Float32Array.from(flatten([P, C, R]))) )

    return lines
}

Chestahedron.prototype.addFaces = function () {
    let geometry = new THREE.Geometry()
    let V = this.vertices
    let A = new THREE.Vector3(V.A.x, V.A.y, V.A.z)
    let B = new THREE.Vector3(V.B.x, V.B.y, V.B.z)
    let C = new THREE.Vector3(V.C.x, V.C.y, V.C.z)
    let P = new THREE.Vector3(V.P.x, V.P.y, V.P.z)
    let Q = new THREE.Vector3(V.Q.x, V.Q.y, V.Q.z)
    let R = new THREE.Vector3(V.R.x, V.R.y, V.R.z)
    let T = new THREE.Vector3(V.T.x, V.T.y, V.T.z)

    let vec = [A, B, C, P, Q, R, T]
    let faces = [
        [2, 1, 0],
        [2, 3, 1],
        [2, 5, 3],
        [0, 5, 2],
        [0, 4, 5],
        [1, 4, 0],
        [1, 3, 4],
        [5, 6, 3],
        [3, 6, 4],
        [4, 6, 5]

    ]
    for (let i = 0; i < vec.length; i++) {
        geometry.vertices.push(vec[i])
    }
    for (let i = 0; i < faces.length; i++) {
        geometry.faces.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2]))
    }
    //geometry.computeFaceNormals()

    var material = new THREE.MeshToonMaterial({
        color: 0xff8248,
        opacity: 0.95,
        transparent: true
    });

    return new THREE.Mesh(geometry, material)
}

Chestahedron.prototype.addLine = function (line) {
    let geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(line, 3))
    let material = new THREE.LineBasicMaterial({color: 0x555555, linewidth: 0.002})

    return new THREE.Line(geometry, material)
}


function EquiliteralTriangle(options) {
    let defaults = {
        side: 1,
        area: null
    }

    this.options = globals.setDefaults(options, defaults)
}

/*
 * radius R of circumscribed circle
 * radius r of inscribed circle
 */
EquiliteralTriangle.prototype.radius = function (position) {
    if (position == 'out') {
        return this.options.side / Math.sqrt(3)
    } else if (position == 'in') {
        return (this.options.side / Math.sqrt(3)) / 2
    }
    return false
}

EquiliteralTriangle.prototype.area = function () {
    let A = (3 * Math.sqrt(3) / 4) * Math.pow(this.options.side, 2)
    return A
}
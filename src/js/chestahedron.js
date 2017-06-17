function Chestahedron(globals, options) {
    let defaults = {
        baseTriangleSide: 1,
        radius: null,
        faceArea: null,
        scale: 1
    }

    // protected
    this.options = globals.setDefaults(options, defaults)
    this.geometry = new THREE.BufferGeometry()
    this.solid = new THREE.Object3D()

    // pivate
    let theta = 94.8309261816304
    let thetaRad = theta / 180 * Math.PI

    globals.world.sceneAdd(this.solid)

    this.baseTriangle = new EquiliteralTriangle({side: this.options.baseTriangleSide})

    // Calculate vertices A, B, C, P, Q, R, T
    this.vertices = {}
    this.vertices.A = {
        x: this.baseTriangle.radius('out') * this.options.scale,
        y: 0,
        z: 0
    }
    this.vertices.B = {
        x: -this.baseTriangle.radius('in') * this.options.scale,
        y: 0,
        z: -this.options.baseTriangleSide / 2
    }
    this.vertices.C = {
        x: this.vertices.B.x * this.options.scale,
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
        y: (Math.sqrt(3) / 2) * Math.sin(thetaRad),
        z: (-(1 / 4) + (0.75 * Math.cos(thetaRad))) * this.options.scale
    }
    this.vertices.R = {
        x: this.vertices.Q.x * this.options.scale,
        y: this.vertices.Q.y * this.options.scale,
        z: -this.vertices.Q.z * this.options.scale
    }
    this.vertices.T = {
        x: 0,
        y: ( (Math.sin(thetaRad) / 2) / ((1 / Math.sqrt(3)) - ((Math.sqrt(3) / 4) * ((1 / 3) - Math.cos(thetaRad)))) ) * this.options.scale,
        z: 0
    }
}

Chestahedron.prototype.drawPoints = function () {
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
    this.solid.add(new THREE.Points(geometry, material))
}

Chestahedron.prototype.drawLines = function () {
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

    console.log(flatten([A, B, C, P, Q, R, T]))

    this.addLine( Float32Array.from(flatten( [A, Q, T, R, A] )))
    this.addLine( Float32Array.from(flatten( [A, B, C, A] )))
    this.addLine( Float32Array.from(flatten( [T, P, B, Q] )))
    this.addLine( Float32Array.from(flatten( [P, C, R] )))
}

Chestahedron.prototype.addLine = function(line) {
    let geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(line, 3))
    let material = new THREE.LineBasicMaterial({ color: 0x666666, linewidth: 0.002})
    this.solid.add(new THREE.Line(geometry, material))
}


function EquiliteralTriangle(options) {
    let defaults = {
        side: 1
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
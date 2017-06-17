function initChestahedron(globals) {

    let chestahedron = new THREE.Object3D()
    globals.world.sceneAdd(chestahedron)

    let geometry = new THREE.BufferGeometry()
    let baseTriangleSide = 1
    let radius = null
    let faceArea = null
    let scale = 1

    chestahedron.add( create() )

    function create() {

        let triangle = new EquiliteralTriangle({side: baseTriangleSide})
        let theta = 94.8309261816304
        let thetaRad = theta / 180 * Math.PI

        let Vertices = {}
        Vertices.A = {
            x: triangle.radius('out') * scale,
            y: 0,
            z: 0
        }
        Vertices.B = {
            x: -triangle.radius('in') * scale,
            y: 0,
            z: -baseTriangleSide / 2
        }
        Vertices.C = {
            x: Vertices.B.x * scale,
            y: 0,
            z: -Vertices.B.z
        }
        Vertices.P = {
            x: (-(Math.sqrt(3) / 2) * ((1 / 3) - Math.cos(thetaRad))) * scale,
            y: ((Math.sqrt(3) / 2) * Math.sin(thetaRad)) * scale,
            z: 0
        }
        Vertices.Q = {
            x: ((Math.sqrt(3) / 4) * ((1 / 3) - Math.cos(thetaRad))) * scale,
            y: (Math.sqrt(3) / 2) * Math.sin(thetaRad),
            z: (-(1 / 4) + (0.75 * Math.cos(thetaRad))) * scale
        }
        Vertices.R = {
            x: Vertices.Q.x * scale,
            y: Vertices.Q.y * scale,
            z: -Vertices.Q.z * scale
        }
        Vertices.T = {
            x: 0,
            y: ( (Math.sin(thetaRad) / 2) / ((1 / Math.sqrt(3)) - ((Math.sqrt(3) / 4) * ((1 / 3) - Math.cos(thetaRad)))) ) * scale,
            z: 0
        }
        console.log(Vertices)

        let V = Vertices
        let points = Float32Array.from([
            V.A.x, V.A.y, V.A.z,
            V.B.x, V.B.y, V.B.z,
            V.C.x, V.C.y, V.C.z,
            V.P.x, V.P.y, V.P.z,
            V.Q.x, V.Q.y, V.Q.z,
            V.R.x, V.R.y, V.R.z,
            V.T.x, V.T.y, V.T.z
        ])

        let geometry = new THREE.BufferGeometry()
        geometry.addAttribute('position', new THREE.BufferAttribute(points, 3))
        let material = new THREE.PointsMaterial({size: 0.1, color: 0x666666})
        return new THREE.Points(geometry, material)
    }
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
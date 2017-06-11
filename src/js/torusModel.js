function initTorusModel(globals) {

    let group = new THREE.Object3D()
    globals.world.sceneAdd(group)

    let diamonds
    let torusRadius
    let tubeRadius
    let buffSize

    let geometry = new THREE.BufferGeometry()
    let positions
    let normals
    let colors

    let SEQ = {
        mod9: [1, 7, 3, 5, 5, 3, 7, 1, 9, 8, 2, 6, 4, 4, 6, 2, 8, 9]
    }

    let ColorCode = [
        '#FFFFFF',  // White
        '#FFFFFF',  // White
        '#FF0000',  // Red
        '#FFFFFF',  // White
        '#FFFFFF',  // White
        '#FF0000',  // Red
        '#FFFFFF',  // White
        '#FFFFFF',  // White
        '#FF0000'  // Red
    ]

    group.add(create(36, globals.PHI / 2, (globals.PHI - 1) / 4))

    function create(d = 9, torusRad = 12, tubeRad = 5) {

        diamonds = d
        torusRadius = torusRad
        tubeRadius = tubeRad
        buffSize = (diamonds + (diamonds * diamonds * 2)) * 9 * 2

        positions = new Float32Array(buffSize)
        normals = new Float32Array(buffSize)
        colors = new Float32Array(buffSize)

        let paths = [[], []]
        for (let p = 0; p < (diamonds + 1); p ++) {
            let vector = []

            // Get path along surface of the torus
            for (let q = 0; q < (diamonds * 2 + 1); q ++) {
                let i = q + p * 2
                let tubePoint = getTubePoint(tubeRadius, diamonds, q)
                let torusPoint = getTorusPoints(torusRadius + tubePoint.r, diamonds, tubePoint.z, i)
                vector.push(new THREE.Vector3(torusPoint.x, torusPoint.y, tubePoint.z))
            }

            // Add path to last position of paths
            paths[ 1 ] = vector

            // If we actually have two paths in paths we can start to compute
            if (paths[ 0 ].length > 0) {
                let triangles = buildTriangles(paths, p)

                positions.set(triangles.positions, (p - 1) * triangles.positions.length)
                normals.set(triangles.normals, (p - 1) * triangles.normals.length)
                colors.set(triangles.colors, (p - 1) * triangles.colors.length)
            }

            // Move last path to beginning of paths
            paths = [ paths[ 1 ], []]
        }

        //geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3))
        //line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2, transparent: true}))
        //group.add(line)


        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3))
        geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))

        // TODO: Needs to be moved out from this file
        let material = new THREE.MeshPhongMaterial({
            color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
            side: THREE.DoubleSide, vertexColors: THREE.VertexColors
        })

        return new THREE.Mesh(geometry, material)
    }


    function getTorusPoints(radius, diamonds, z, i) {
        let points = diamonds * 2
        let angle = 360 / points

        return {
            x: radius * Math.cos(angle * Math.PI / 180 * i),
            y: radius * Math.sin(angle * Math.PI / 180 * i)
        }

    }


    function getTubePoint(radius, diamonds, i) {
        let points = diamonds * 2
        let angle = 360 / points

        return {
            z: - radius * Math.cos(angle * Math.PI / 180 * i),
            r: radius * Math.sin(angle * Math.PI / 180 * i)
        }
    }


    /*
     * Building the triangles of one path
     *
     * $param   v   [Array, Array]
     * $param   p   int // The path number, to know where the color sequence should start
     * $return  obj { positions Float32Array, normals Float32Array, colors Float32Array }
     */
    function buildTriangles(v, p) {

        let norm = new THREE.Vector3()
        let positions = []
        let normals = []
        let colors = []

        let i = 0
        let len = v[ 0 ].length

        // Loop all diamonds in one path and make it into triangles
        while (i < (len - 1) * 2) {

            let j = Math.floor(i / 2) // Gets the i upp to (len - 1)
            let a = (i % 2 === 0) ? v[ 0 ][ j ] : v[ 1 ][ j ] // Switch between first and second triangle
            let b = (j < len - 1) ? v[ 0 ][ j + 1 ] : v[ 0 ][ 0 ]
            let c = j === 0 ? v[ 1 ][ len - 2 ] : v[ 1 ][ j - 1 ]

            // Call normalize
            norm = normalizeTriangle(a, b, c)
            let color = colorizeTriangle(j, p)

            // Set all data
            positions.push(a.x, a.y, a.z)
            positions.push(b.x, b.y, b.z)
            positions.push(c.x, c.y, c.z)
            normals.push(
                norm.x, norm.y, norm.z,
                norm.x, norm.y, norm.z,
                norm.x, norm.y, norm.z
            )
            colors.push(
                color.r, color.g, color.b,
                color.r, color.g, color.b,
                color.r, color.g, color.b
            )

            i += 1
        }

        return {
            positions: Float32Array.from(positions),
            normals: Float32Array.from(normals),
            colors: Float32Array.from(colors)
        }
    }


    /*
     * Get an array of normalize vectors for a triangle of three points in space
     * $param a {x, y, z}
     * $param b {x, y, z}
     * $param c {x, y, z}
     * $return Vector3()
     */
    function normalizeTriangle(a, b, c) {
        let pA = new THREE.Vector3()
        let pB = new THREE.Vector3()
        let pC = new THREE.Vector3()
        let cb = new THREE.Vector3()
        let ab = new THREE.Vector3()

        pA.set(a.x, a.y, a.z)
        pB.set(b.x, b.y, b.z)
        pC.set(c.x, c.y, c.z)
        cb.subVectors(pC, pB)
        ab.subVectors(pA, pB)
        cb.cross(ab)

        return cb.normalize()
    }

    function colorizeTriangle(i, p) {
        let len = SEQ.mod9.length
        let pos = p * 2 % len
        return new THREE.Color(ColorCode[ SEQ.mod9[ pos ] - 1 ])
    }

    return {
        create: create,
        getTorusPoints: getTorusPoints,
        getTubePoint: getTubePoint,
        buildTriangles: buildTriangles,
        normalizeTriangle: normalizeTriangle,
        colorizeTriangle: colorizeTriangle
    }
}

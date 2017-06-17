function initPhiTorusModel(globals) {

    let group = new THREE.Object3D()
    globals.world.sceneAdd(group)

    let diamonds
    let crossSections
    let buffSize
    let positions
    let data

    let diameters = getDia(2)

    // Lucas 9 * lucas(2 * dInt + 1)
    for (let dInt = 0; dInt < diameters.length; dInt++) {
        group.add(create(9 * lucas(2 * dInt + 1), 36, diameters[dInt].iDia, diameters[dInt].oDia))
    }

    function getDia(amount) {
        let iDia = new Array(amount + 1)
        let oDia = new Array(amount + 1)
        let diameters = new Array(amount)

        iDia[0] = 1
        oDia[0] = globals.PHI

        for (let i = 0; i < amount; i++) {
            diameters[i] = {iDia: iDia[i], oDia: oDia[i]}

            iDia[i + 1] = iDia[i] / globals.PHI
            oDia[i + 1] = iDia[i + 1] * Math.pow(globals.PHI, (2 * (i + 1) + 1))
        }
        return diameters
    }

    function lucas(n) {
        var memo = {}
        let lucasRecursion = function (n) {
            n = parseInt(n)

            if (n === 0) {
                return 2
            } else if (n === 1) {
                return 1
            } else if (n > 1) {
                if (typeof memo[n] === 'undefined') {
                    memo[n] = lucasRecursion(n - 1) + lucasRecursion(n - 2);
                }
                return memo[n]
            } else {
                return false
            }
        }
        return lucasRecursion(n)
    }

    /*
     * Default creates a Torus with diamond mapping 9:36,
     * and with ratio PHI between inner and outer diameter
     */
    function create(mapL = 9, mapR = 36, iDia = 1, oDia = globals.PHI) {
        // TODO: Refactor this function
        diamonds = mapL * mapR
        buffSize = diamonds * 3
        positions = new Float32Array(buffSize)

        // TODO: Refactor out
        crossSections = new Float32Array(buffSize)
        let crossSectionPoints = []

        data = {
            mapL: mapL,
            mapR: mapR,
            aX: 360 / mapR,
            aZ: 360 / mapL,
            R: (oDia - 2 * ( (oDia - iDia) / 4 )) / 2,
            r: (oDia - iDia) / 4
        }

        for (let i = 0; i < diamonds; i++) {
            let j = i * 3
            let point = getTorusPoint(data, i)
            positions[j] = point.x
            positions[j + 1] = point.y
            positions[j + 2] = point.z

            // TODO: Refactor out
            let cross = getCrossSection(data, point, i)
            crossSectionPoints.push(cross)
            crossSections[j] = cross.x
            crossSections[j + 1] = cross.y
            crossSections[j + 2] = cross.z
        }

        normalizeCrossSectionPoints(data, crossSectionPoints)

        // CrossSections
        let geometry2 = new THREE.BufferGeometry()
        geometry2.addAttribute('position', new THREE.BufferAttribute(crossSections, 3))
        let material2 = new THREE.PointsMaterial({size: 0.01, color: 0x999999})
        globals.world.sceneAdd(new THREE.Points(geometry2, material2))

        // Lines
        /*
         let geometry3 = new THREE.BufferGeometry()
         geometry3.addAttribute( 'position', new THREE.BufferAttribute( normals, 3 ) )
         let material3 = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors })
         globals.world.sceneAdd( new THREE.Line( geometry3, material3 ) )*/

        // Points
        let geometry = new THREE.BufferGeometry()
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
        let material = new THREE.PointsMaterial({size: 0.01, color: 0x666666})
        return new THREE.Points(geometry, material)

    }

    function getTorusPoint(torus, i) {
        let xInt = i % torus.mapL
        let yInt = (i - xInt) / torus.mapL
        let shift = yInt % 2 === 0 ? torus.aZ / 2 : 0

        let pointR = torus.r * Math.sin((torus.aZ * xInt + shift) * Math.PI / 180)

        return {
            x: (torus.R + pointR) * Math.cos((torus.aX * yInt) * Math.PI / 180),
            y: (torus.R + pointR) * Math.sin((torus.aX * yInt) * Math.PI / 180),
            z: -torus.r * Math.cos((torus.aZ * xInt + shift) * Math.PI / 180),
            a: torus.aX * yInt,
            b: torus.aZ * xInt + shift
        }
    }

    function getCrossSection(torus, point) {
        let r = torus.r / Math.cos(torus.aZ / 2 * Math.PI / 180)

        let pointR = r * Math.sin((point.b + torus.aZ * 0.5) * Math.PI / 180)

        return {
            x: (torus.R + pointR) * Math.cos(point.a * Math.PI / 180),
            y: (torus.R + pointR) * Math.sin(point.a * Math.PI / 180),
            z: -r * Math.cos((point.b + torus.aZ * 0.5) * Math.PI / 180)
        }
    }

    function normalizeCrossSectionPoints(torus, points) {
        let pointArray = []
        let shift, zero
        let lineGroup = new THREE.Object3D()
        globals.world.sceneAdd(lineGroup)

        for (let i = 0; i < torus.mapR; i++) {
            let p1, p2

            shift = i % 2 === 0 ? 0 : 1
            zero = i === torus.mapR - 1 ? (torus.mapL * (i + 1)) : 0

            for (let j = (torus.mapL * i); j < (torus.mapL * (i + 1)); j++) {

                p1 = j
                p2 = j + torus.mapL + (shift === 1 ? 0 : 1) - zero

                pointArray.push(points[p1])

                if (j < (torus.mapL * (i + 1)) - 1) {
                    pointArray.push(points[p2])
                } else {
                    pointArray.push(points[torus.mapL * (i + 1 + shift) - shift - zero])
                    pointArray.push(points[torus.mapL * i])
                }
            }


            lineGroup.add(createLines(pointArray))

            pointArray = []
        }
    }

    function createLines(pointArray) {

        let lineGroup = new THREE.Object3D()
        globals.world.sceneAdd(lineGroup)

        let mapped = pointArray.map(function (x) {
            return [x.x, x.y, x.z]
        })
        const flatten = arr => arr.reduce(
            (acc, val) => acc.concat(
                Array.isArray(val) ? flatten(val) : val
            ),
            []
        )

        let linePoints = Float32Array.from(flatten(mapped))

        let geometry3 = new THREE.BufferGeometry()
        geometry3.addAttribute('position', new THREE.BufferAttribute(linePoints, 3))
        //let material3 = new THREE.LineBasicMaterial({ color: 0x666666, linewidth: 0.002,})
        let material3 = new THREE.MeshBasicMaterial({color: 0x666666})



        //return new THREE.Line(geometry3, material3)
        return new THREE.Mesh(geometry3, material3)
    }


    return {
        create: create,
        lucas: lucas,
        getDia: getDia,
        getTorusPoint: getTorusPoint,
    }
}

function initPhiTorusModel(globals) {

    let group = new THREE.Object3D()
    globals.world.sceneAdd(group)

    let diamonds
    let buffSize
    let positions

    let diameters = getDia(4)

    for (let dInt = 0; dInt < diameters.length; dInt ++) {
        console.log(diameters[dInt])
        group.add( create(9 * lucas(2 * dInt + 1), 72, diameters[dInt].iDia, diameters[dInt].oDia ) )
    }


    function getDia(amount) {
        let iDia        = new Array(amount + 1)
        let oDia        = new Array(amount + 1)
        let diameters   = new Array(amount)

        iDia[0] = 1
        oDia[0] = globals.PHI

        for(let i = 0; i < amount; i ++) {
            diameters[ i ] = {iDia: iDia[i], oDia: oDia[i]}

            iDia[ i + 1 ] = iDia[ i ] / globals.PHI
            oDia[ i + 1 ] = iDia[ i + 1 ] * Math.pow(globals.PHI, (2 * (i + 1) + 1))
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
        diamonds = mapL * mapR
        buffSize = diamonds * 3
        positions = new Float32Array( buffSize )
        let data = {
            mapL: mapL,
            mapR: mapR,
            aX: 360 / mapR,
            aZ: 360 / mapL,
            R: (oDia - 2 * ( (oDia - iDia) / 4 )) / 2,
            r: (oDia - iDia) / 4
        }

        for (let i = 0; i < diamonds; i ++) {
            let j = i * 3
            let point = getTorusPoint(data, i)
            positions[ j ] = point.x
            positions[ j + 1 ] = point.y
            positions[ j + 2 ] = point.z
        }

        let geometry = new THREE.BufferGeometry()
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) )
        let material = new THREE.PointsMaterial({ size: 0.03, color: 0x666666 })
        return new THREE.Points( geometry, material )
    }

    function getTorusPoint(torus, i) {
        let xInt = i % torus.mapL
        let yInt = (i - xInt) / torus.mapL
        let shift = yInt % 2 === 0 ? torus.aZ / 2 : 0

        let pointR = torus.r * Math.sin((torus.aZ * xInt + shift) * Math.PI / 180)

        return {
            x: (torus.R + pointR) * Math.cos((torus.aX * yInt) * Math.PI / 180),
            y: (torus.R + pointR) * Math.sin((torus.aX * yInt) * Math.PI / 180),
            z: - torus.r * Math.cos((torus.aZ * xInt + shift) * Math.PI / 180)
        }
    }

    return {
        create: create,
        lucas: lucas,
        getDia: getDia,
        getTorusPoint: getTorusPoint,
    }
}

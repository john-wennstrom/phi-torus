globals = {}

$(function () {

    let mouseDown = false

    globals = initGlobals()

    window.addEventListener('resize', function () {
        globals.world.onWindowResize()
    }, false)

    document.addEventListener( 'mousemove', function (event) {
        //event.preventDefault()
        globals.world.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        globals.world.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1

    }, false)

    document.addEventListener('mousedown', function (event) {
        event.preventDefault()
        globals.world.raycaster.setFromCamera(globals.world.mouse, globals.world.camera)
        mouseDown = true
    }, false)


    //globals.torusModel = initTorusModel(globals)
    //globals.torusModel = initPhiTorusModel(globals)

    globals.chestahedron = new Chestahedron(globals, {points:false})
    globals.targets.push(globals.chestahedron.chestahedron.children[1])
    //globals.chestahedron.drawPoints()
    //globals.chestahedron.drawLines()
    //globals.chestahedron.drawMesh()
    globals.world.render()

})

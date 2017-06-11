globals = {}

$(function () {

    let raycaster = new THREE.Raycaster()
    let mouse = new THREE.Vector2()
    let mouseDown = false

    window.addEventListener('resize', function () {
        globals.world.onWindowResize()
    }, false)

    document.addEventListener( 'mousemove', function (event) {
        event.preventDefault()
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
        raycaster.setFromCamera(mouse, globals.world.camera)

        //checkForIntersections()
    }, false)

    document.addEventListener('mousedown', function (event) {
        event.preventDefault()
        raycaster.setFromCamera(mouse, globals.world.camera)
        mouseDown = true
    }, false)

    globals = initGlobals()

    //globals.torusModel = initTorusModel(globals)
    globals.torusModel = initPhiTorusModel(globals)
    globals.world.render()

})

function initWorld(globals) {

    let scene = new THREE.Scene()
    let wrapper = new THREE.Object3D()
    let mouse = new THREE.Vector2(), INTERSECTED
    let camera = new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2, -100, 100);
    let renderer = new THREE.WebGLRenderer({antialias: true})
    let raycaster = new THREE.Raycaster()
    let controls, container

    init()

    function init() {

        container = $('#container')
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.append(renderer.domElement)

        scene.background = new THREE.Color(0xe6e6e6)
        scene.add(wrapper)

        // Lights
        let directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight1.position.set(0, 10, 50)
        scene.add(directionalLight1)

        var light = new THREE.PointLight(0xffffff, 1);
        camera.add(light);


        // Camera
        camera.zoom = 20
        camera.updateProjectionMatrix()
        camera.position.x = 0
        camera.position.y = 0
        camera.position.z = 20

        // Controls
        controls = new THREE.OrbitControls(camera, container.get(0))
        controls.addEventListener('change', render)

        animate()
    }

    function render() {
        _render()
    }

    function animate() {
        requestAnimationFrame(animate)
        _render()
        update()
    }

    function _render() {
        renderer.render(scene, camera)
    }

    function update() {
        checkIntersections()
    }

    function sceneAdd(object) {
        wrapper.add(object)
    }

    function sceneRemove(object) {
        wrapper.remove(object)
    }

    function sceneClear() {
        wrapper.children = []
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.left = -window.innerWidth / 2
        camera.right = window.innerWidth / 2
        camera.top = window.innerHeight / 2
        camera.bottom = -window.innerHeight / 2
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)

        render()
    }

    function enableControls(state) {
        controls.enabled = state
        controls.enableRotate = state
    }

    function checkIntersections() {
        raycaster.setFromCamera(mouse, camera)

        let intersects = raycaster.intersectObjects(globals.targets)

        if (intersects.length > 0) {
            if (INTERSECTED)
                INTERSECTED.material.color.set(INTERSECTED.currentColor)
            // store reference to closest object as current intersection object
            INTERSECTED = intersects[0].object
            // store color of closest object
            INTERSECTED.currentColor = '#' + INTERSECTED.material.color.getHexString()
            // Brighten the object
            INTERSECTED.material.color.set( globals.colors.ColorLuminance(INTERSECTED.currentColor, 0.2) )
        }
        else {
            // restore previous intersection object
            if (INTERSECTED)
                INTERSECTED.material.color.set(INTERSECTED.currentColor)
            // remove previous intersection object reference
            INTERSECTED = null
        }
    }

    return {
        sceneRemove: sceneRemove,
        sceneAdd: sceneAdd,
        sceneClear: sceneClear,
        render: render,
        onWindowResize: onWindowResize,
        animate: animate,
        enableControls: enableControls,
        checkIntersections: checkIntersections,
        mouse: mouse,
        scene: scene,
        camera: camera,
        raycaster: raycaster
    }
}

function initWorld(globals) {

    let scene = new THREE.Scene()
    let wrapper = new THREE.Object3D()
    let camera = new THREE.OrthographicCamera(
        window.innerWidth / - 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / - 2, - 100, 100);
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    let controls

    init()

    function init() {

        let container = $('#container')
        renderer.setSize(window.innerWidth, window.innerHeight)
        container.append(renderer.domElement)

        scene.background = new THREE.Color(0xe6e6e6)
        scene.add(wrapper)

        // Lights
        let directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight1.position.set(0, 10, 50)
        scene.add(directionalLight1)

        var light = new THREE.PointLight( 0xffffff, 1 );
        camera.add( light );


        // Camera
        camera.zoom = 20
        camera.updateProjectionMatrix()
        camera.position.x = 0
        camera.position.y = 0
        camera.position.z = 20

        // Controls
        controls = new THREE.OrbitControls(camera, container.get(0))
        controls.addEventListener('change', render)

        render()
    }

    function render() {
        _render()
    }

    function startAnimation(callback) {
        console.log("starting animation")
        _loop(function () {
            if (! globals.stlEditing) { callback() }
            _render()
        });

    }

    function _render() {
        renderer.render(scene, camera)
    }

    function _loop(callback) {
        callback()
        requestAnimationFrame(function () {
            _loop(callback)
        });
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
        camera.left = - window.innerWidth / 2
        camera.right = window.innerWidth / 2
        camera.top = window.innerHeight / 2
        camera.bottom = - window.innerHeight / 2
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)

        render()
    }

    function enableControls(state) {
        controls.enabled = state
        controls.enableRotate = state
    }

    return {
        sceneRemove: sceneRemove,
        sceneAdd: sceneAdd,
        sceneClear: sceneClear,
        render: render,
        onWindowResize: onWindowResize,
        startAnimation: startAnimation,
        enableControls: enableControls,
        scene: scene,
        camera: camera
    }
}

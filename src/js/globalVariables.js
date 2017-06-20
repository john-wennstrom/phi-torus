function initGlobals() {

    let _globals = {
        PHI: (1 + Math.sqrt(5)) / 2,

        setDefaults: function(options, defaults){
            return _.defaults({}, _.clone(options), defaults);
        },
        highlight: {
            mesh: new THREE.Color( 0xddaa00 ),
        },
        color: new THREE.Color( 0x999999 ),

        targets: []
    }

    _globals.world = initWorld(_globals)
    console.log(_globals)

    return _globals

}

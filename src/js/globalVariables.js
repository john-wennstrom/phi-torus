function initGlobals() {

    let _globals = {
        PHI: (1 + Math.sqrt(5)) / 2,

        setDefaults: function(options, defaults){
            return _.defaults({}, _.clone(options), defaults);
        }
    }

    _globals.world = initWorld(_globals)
    console.log(_globals)

    return _globals

}

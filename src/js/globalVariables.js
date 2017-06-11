function initGlobals() {

    var _globals = {
        PHI: (1 + Math.sqrt(5)) / 2
    }

    _globals.world = initWorld(_globals)
    console.log(_globals)
    return _globals
}

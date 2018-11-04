/**
 * MyPatch
 * @constructor
 */
class MyPatch extends MyPlane {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {npartsU} npartsU Number of circle slices
     * @param {npartsV} npartsV Circle radius
     */
    constructor(scene, npointsU, npointsV, npartsU, npartsV) {
        super(scene, npartsU, npartsV);
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.controlPoints = new Array();
    };

    addControlPoint(x, y, z){
        this.controlPoints.push( {x, y, z} );
    }
}
/**
 * MyPlane
 * @constructor
 */
class MyPlane extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {npartsU} npartsU Number of circle slices
     * @param {npartsV} npartsV Circle radius
     */
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

    };
}
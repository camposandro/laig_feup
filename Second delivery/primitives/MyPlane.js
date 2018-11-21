/**
 * MyPlane
 * @constructor
 */
class MyPlane extends Plane {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {id} id Plane id
     * @param {npartsU} npartsU Number of circle slices
     * @param {npartsV} npartsV Circle radius
     */
    constructor(scene, id, npartsU, npartsV) {
        super(scene, id, npartsU, npartsV);
    };
}
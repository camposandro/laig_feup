/**
 * MyOmni class, representing an omni light.
 */
class MyOmni extends MyLight {

    /**
     * @constructor
     * @param {id, enabled, location, ambient, diffuse, specular}
     */
    constructor(scene, id, enabled, location, ambient, diffuse, specular) {
        super(scene, id, enabled, location, ambient, diffuse, specular);
    }
}
/**
 * MyOmni class, representing an omni light.
 */
class MyOmni extends MyLight {

    /**
     * @constructor
     * @param {id, enabled, location, ambient, diffuse, specular}
     */
    constructor(id, enabled, location, ambient, diffuse, specular) {
        super(id, enabled, location, ambient, diffuse, specular);
    }
}
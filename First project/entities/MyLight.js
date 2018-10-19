/**
 * MyLight class, representing a light.
 */
class MyLight extends CGFlight {

	/**
     * @constructor
     * @param {id, enabled, location, ambient, diffuse, specular}
     */
    constructor(scene, id, enabled, location, ambient, diffuse, specular) {
        super(scene, id);
        this.enabled = enabled;
        this.location = location;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }
}
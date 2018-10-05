/**
 * MyLight class, representing a light.
 */
class MyLight {

	/**
     * @constructor
     * @param {id, enabled, location, ambient, diffuse, specular}
     */
	constructor(id, enabled, location, ambient, diffuse, specular) {
		this.id = id;
        this.enabled = enabled;
        this.location = location;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
	}
}
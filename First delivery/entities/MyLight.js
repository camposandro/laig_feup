/**
 * MyLight class, representing a light.
 */
class MyLight extends MyEntity {

	/**
     * @constructor
     * @param {id, enabled, location, ambient, diffuse, specular}
     */
	constructor(id, enabled, location, ambient, diffuse, specular) {
		super(id);
        this.enabled = enabled;
        this.location = location;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
	}
}
/**
 * MyMaterial class, representing a scaling.
 */
class MyMaterial {

	/**
     * @constructor
     * @param {id,shininess,emission,ambient,diffuse,specular}
     */
    constructor(id, shininess, emission, ambient, diffuse, specular) {
        this.id = id;
        this.shininess = shininess;
        this.emission = emission;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }
}
/**
 * MyMaterial class, representing a scaling.
 */
class MyMaterial extends CGFappearance{

	/**
     * @constructor
     * @param {id,shininess,emission,ambient,diffuse,specular}
     */
    constructor(scene, id, shininess, emission, ambient, diffuse, specular) {
        super(scene);
        this.id = id;
        
        this.shininess = shininess;
        this.emission = emission;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }

}

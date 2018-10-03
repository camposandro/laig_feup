/**
 * MyMaterial class, representing a scaling.
 */
class MyMaterial  extends MyEntity{

	/**
     * @constructor
     * @param {id,shininess,emission,ambient,diffuse,specular}
     */
    constructor(id,shininess,emission, ambient,diffuse,specular) {
        super(id);
       this.shininess = shininess;
       this.emission = emission;
       this.ambient = ambient;
       this.diffuse = diffuse;
       this.specular = specular;
    }
}
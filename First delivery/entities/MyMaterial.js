/**
 * MyMaterial class, representing a scaling.
 */
class MyMaterial {

	/**
     * @constructor
     * @param {id,shininess,emission,ambient,diffuse,specular}
     */
    constructor(scene, id, shininess, emission, ambient, diffuse, specular) {
        this.id = id;
        
        this.shininess = shininess;
        this.emission = emission;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;

        this.loadMaterial(scene);
    }

    loadMaterial(scene) {
        this.appearance = new CGFappearance(scene);
        this.appearance.setShininess(this.shininess);
        this.appearance.setEmission(this.emission);
        this.appearance.setAmbient(this.ambient);
        this.appearance.setDiffuse(this.diffuse);
        this.appearance.setSpecular(this.specular);
    }
}
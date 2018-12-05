/**
 * MyMaterial class, representing a material.
 */
class MyMaterial extends CGFappearance{

	/**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {id} id Material id 
     * @param {shininess} shininess Material shininess
     * @param {array} emission Emission rgba array
     * @param {array} ambient Ambient rgba array
     * @param {array} diffuse Diffuse rgba array
     * @param {array} specular Specular rgba array
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

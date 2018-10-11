/**
 * MyTexture class, representing a texture.
 */
class MyTexture {

	/**
     * @constructor
     * @param {id}
     */
    constructor(scene, id, file) {
        this.id = id;
        this.loadTex(scene, file);
    }

    loadTex(scene, file) {
        this.appearence = new CGFappearance(scene);
        this.appearence.loadTexture(file);
        //this.appearence.setTextureWrap('REPEAT','REPEAT');
    }
}

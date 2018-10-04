/**
 * MyTexture class, representing a texture.
 */
class MyTexture extends MyEntity {

	/**
     * @constructor
     * @param {id}
     */
    constructor(id, file) {

        super(id);
        this.appearence = new CGFappearance(this.scene);
        //this.appearence.loadTexture(file);
        //this.appearence.setTextureWrap('REPEAT','REPEAT');
    }
}

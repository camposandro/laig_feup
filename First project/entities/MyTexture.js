/**
 * MyTexture class, representing a texture.
 */
class MyTexture extends CGFtexture {

	/**
     * @constructor
     * @param {id}
     */
    constructor(scene, id, file) {
        super(scene, file);
        this.id = id;
        //this.setTextureWrap('REPEAT','REPEAT');
    }
}

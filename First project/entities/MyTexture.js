/**
 * MyTexture class, representing a texture.
 */
class MyTexture extends CGFtexture{

	/**
     * @constructor
     * @param {id}
     */
    constructor(scene, id, file) {
        super(scene, file);
        this.id = id;
        //this.appearence.setTextureWrap('REPEAT','REPEAT');
    }

}

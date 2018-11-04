/**
 * MyTexture class, representing a texture.
 */
class MyTexture extends CGFtexture {

	/**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {id} id Texture id
     * @param {file} file Texture file path
     */
    constructor(scene, id, file) {
        super(scene, file);
        this.id = id;
    }
}

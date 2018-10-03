/**
 * MyTexture class, representing a texture.
 */
class MyTexture extends MyEntity {

	/**
     * @constructor
     * @param {id, file}
     */
    constructor(id, file) {
        super(id);
        this.file = file;
    }
}
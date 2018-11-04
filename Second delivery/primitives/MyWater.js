/**
 * MyWater
 * @constructor
 */
class MyWater {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {npartsU} npartsU Number of circle slices
     * @param {npartsV} npartsV Circle radius
     */
    constructor(idTexture, idwavemap, parts, heightScale, texscale) {
        this.idTexture = idTexture
        this.idwavemap = idwavemap;
        this.parts = parts;
        this.heightScale = heightScale;
        this.texscale = texscale;
    };
}
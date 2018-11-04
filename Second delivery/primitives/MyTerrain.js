/**
 * MyTerrain
 * @constructor
 */
class MyTerrain {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {npartsU} npartsU Number of circle slices
     * @param {npartsV} npartsV Circle radius
     */
    constructor(idTexture, idHeightmap, parts, heightScale) {
        this.idTexture = idTexture
        this.idHeightmap = idHeightmap;
        this.parts = parts;
        this.heightScale = heightScale;
    };
}
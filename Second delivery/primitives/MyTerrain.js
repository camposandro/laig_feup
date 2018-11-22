/**
 * MyTerrain
 * @constructor
 */
class MyTerrain extends MyPlane {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {npartsU} npartsU Number of circle slices
     * @param {npartsV} npartsV Circle radius
     */
    constructor(scene, idTexture, idHeightmap, parts, heightScale) {
        super(scene,0,parts,parts);

        this.idTexture = idTexture
        this.idHeightmap = idHeightmap;
        this.parts = parts;
        this.heightScale = heightScale;
    };
}
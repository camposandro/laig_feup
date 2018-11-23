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
        super(scene, 0, parts, parts);

        this.scene = scene;
        this.idTexture = idTexture;
        this.idHeightmap = idHeightmap;
        this.parts = parts;
        this.heightScale = heightScale;

        this.updateUniformValues(heightScale);
    };

    updateUniformValues(heightScale) {
        this.scene.shaders[0].setUniformsValues({ uSampler: 0, uSampler2: 1 });
        this.scene.shaders[0].setUniformsValues({ normScale: heightScale });
    };

    display() {

        //Bind terrain texture to the unit 0
        this.scene.graph.textures[this.idTexture].bind(0);

        // Bind height map texture to the unit 1
        this.scene.graph.textures[this.idHeightmap].bind(1);

        // Sets terrain shader active
        this.scene.setActiveShader(this.scene.shaders[0]);

        this.scene.pushMatrix();
            this.scene.scale(10, 1, 10);
            super.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    };
}
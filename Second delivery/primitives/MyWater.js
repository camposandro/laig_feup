/**
 * MyWater
 * @constructor
 */
class MyWater extends MyPlane {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {npartsU} npartsU Number of circle slices
     * @param {npartsV} npartsV Circle radius
     */
    constructor(scene, idTexture, idWavemap, parts, heightScale, texScale) {
        super(scene, 1, parts, parts);

        this.idTexture = idTexture;
        this.idWavemap = idWavemap;
        this.parts = parts;
        this.heightScale = heightScale;
        this.texScale = texScale;

        this.updateUniformValues(heightScale);
    };

    updateUniformValues(heightScale) {
        this.scene.shaders[1].setUniformsValues({ uSampler: 0, uSampler2: 1 });
        this.scene.shaders[1].setUniformsValues({ normScale: heightScale });
    };

    display() {

        // Bind terrain texture to the unit 0
        this.scene.graph.textures[this.idTexture].bind(0);

        // Bind height map texture to the unit 1
        this.scene.graph.textures[this.idWavemap].bind(1);

        // Sets terrain shader active
        this.scene.setActiveShader(this.scene.shaders[1]);

        this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.scale(15, 1, 15);
            super.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    };
}
/**
 * MyWater, representing a waving water plane.
 * @constructor
 */
class MyWater extends Plane {

    /**
     * @constructor
     * @param {XMLscene} scene Scene
     * @param {idTexture} idTexture Water's texture id
     * @param {idWavemap} idWavemap Water's wavemap texture id
     * @param {parts} parts Number of water's U and V parts
     * @param {heightScale} heightScale Water's height scaling factor
     * @param {texScale} texScale Water's texture scaling factor
     */
    constructor(scene, idTexture, idWavemap, parts, heightScale, texScale) {
        super(scene, 1, parts, parts);

        this.idTexture = idTexture;
        this.idWavemap = idWavemap;
        this.parts = parts;
        this.heightScale = heightScale;
        this.texScale = texScale;

        this.updateUniformValues();
    };

    /**
     * Updates water uniform values, binding its textures to different
     * units and setting the normScale and texScale factors needed for the shader.
     */
    updateUniformValues() {
        this.scene.shaders[1].setUniformsValues({ uSampler: 0, uSampler2: 1 });
        this.scene.shaders[1].setUniformsValues({ normScale: this.heightScale, texScale : this.texScale });
    };

    /**
     * Displays the water plane.
     */
    display() {

        // Bind terrain texture to the unit 0
        this.scene.graph.textures[this.idTexture].bind(0);

        // Bind height map texture to the unit 1
        this.scene.graph.textures[this.idWavemap].bind(1);

        // Sets terrain shader active
        this.scene.setActiveShader(this.scene.shaders[1]);
            
        super.display();

        // Sets default shader
        this.scene.setActiveShader(this.scene.defaultShader);

        // Textures unbinding
        this.scene.graph.textures[this.idTexture].unbind();
        this.scene.graph.textures[this.idWavemap].unbind();
    };
}
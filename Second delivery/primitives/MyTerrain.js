/**
 * MyTerrain, representing a terrain.
 * @constructor
 */
class MyTerrain extends Plane {

    /**
     * @constructor
     * @param {XMLscene} scene Scene
     * @param {idTexture} idTexture Terrain's texture id
     * @param {idHeightmap} idHeightmap Terrain's heightmap texture id
     * @param {parts} parts Number of terrain's U and V parts
     * @param {heightScale} heightScale Terrain's height scaling factor
     */
    constructor(scene, idTexture, idHeightmap, parts, heightScale) {
        super(scene, 0, parts, parts);

        this.scene = scene;
        this.idTexture = idTexture;
        this.idHeightmap = idHeightmap;
        this.parts = parts;
        this.heightScale = heightScale;

        this.updateUniformValues();
    };

    /**
     * Updates terrain uniform values, binding its textures to different
     * units and setting the normScale factor needed for the shader.
     */
    updateUniformValues() {
        this.scene.shaders[0].setUniformsValues({ uSampler: 0, uSampler2: 1 });
        this.scene.shaders[0].setUniformsValues({ normScale: this.heightScale });
    };

    /**
     * Displays the terrain.
     */
    display() {

        // Bind terrain texture to the unit 0
        this.scene.graph.textures[this.idTexture].bind(0);

        // Bind height map texture to the unit 1
        this.scene.graph.textures[this.idHeightmap].bind(1);

        // Sets terrain shader active
        this.scene.setActiveShader(this.scene.shaders[0]);

        super.display();

        // Sets default shader
        this.scene.setActiveShader(this.scene.defaultShader);

        // Textures unbinding
        this.scene.graph.textures[this.idTexture].unbind();
        this.scene.graph.textures[this.idHeightmap].unbind();
    };
}
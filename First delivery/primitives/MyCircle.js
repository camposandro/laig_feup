/**
 * MyCircle
 * @constructor
 */
class MyCircle extends CGFobject {

    /**
     * @constructor
     * @param {scene, slices}
     */
    constructor(scene, slices) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    };

    initBuffers() {
        this.vertices = new Array();
        this.normals = new Array();
        this.indices = new Array();
        this.texCoords = new Array();

        var angle = (2 * Math.PI) / this.slices;

        // circle's center
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        // other vertices, its normals and texCoords
        for (var i = 0; i < this.slices; i++) {
            this.vertices.push(Math.cos(i * angle), Math.sin(i * angle), 0);
            this.normals.push(0, 0, 1);
            this.texCoords.push(Math.cos(i * angle) / 2 + 0.5, -Math.sin(i * angle) / 2 + 0.5);
        }

        // vertices indices
        for (var j = 0; j < this.slices - 1; j++)
            this.indices.push(0, j + 1, j + 2);
        this.indices.push(0, this.slices, 1);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};
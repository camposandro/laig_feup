/**
 * MyCircle
 * @constructor
 */
class MyCircle extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {slices} slices Number of circle slices
     * @param {radius} radius Circle radius
     */
    constructor(scene,id, slices, radius) {
        super(scene);
        this.id = id;
        this.slices = slices;
        this.radius = radius;

        this.initBuffers();
    };

    /**
     * Initializes vertices, normals and texCoords buffers.
     */
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
            this.vertices.push(Math.cos(i * angle) * this.radius, Math.sin(i * angle)* this.radius, 0);
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

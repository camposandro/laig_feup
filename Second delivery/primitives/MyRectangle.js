/**
 * MyRectangle class, representing a rectangle.
 */
class MyRectangle extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {*} id Rectangle id
     * @param {*} x1 Left-lower corner x-value
     * @param {*} y1 Left-lower corner y-value
     * @param {*} x2 Left-upper corner x-value
     * @param {*} y2 Left-upper corner y-value
     * @param {*} ls Texture horizontal factor
     * @param {*} lt Texture vertical factor
     */
    constructor(scene, id, x1, y1, x2, y2, ls, lt) {
        super(scene);

        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.ls = ls;
        this.lt = lt;
        
        this.initBuffers();
    };

    /**
     * Initializes vertices, normals and texCoords buffers.
     */
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y1, 0,
            this.x2, this.y2, 0,
            this.x1, this.y2, 0
        ];

        this.indices = [
            0, 1, 3,
            2, 3, 1
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        let maxS = (this.x2 - this.x1) / this.ls;
        let maxT = (this.y2 - this.y1) / this.lt;

        this.texCoords = [
            0, maxT,
            maxS, maxT,
            maxS, 0,
            0, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};

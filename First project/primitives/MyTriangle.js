/**
 * MyTriangle class, representing a triangle.
 */
class MyTriangle extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {id} id Triangle id
     * @param {x1} x1 Middle-vertice x-value
     * @param {y1} y1 Middle-vertice y-value
     * @param {z1} z1 Middle-vertice z-value
     * @param {x2} x2 Left-vertice x-value
     * @param {y2} y2 Left-vertice y-value
     * @param {z2} z2 Left-vertice z-value
     * @param {x3} x3 Right-vertice x-value
     * @param {y3} y3 Right-vertice y-value
     * @param {z3} z3 Right-vertice z-value
     * @param {*} ls Texture horizontal factor
     * @param {*} lt Texture vertical factor
     */
    constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3, ls, lt) {
        super(scene);

        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        this.x3 = x3;
        this.y3 = y3;
        this.z3 = z3;
        this.ls = ls;
        this.lt = lt;

        this.initBuffers();
    };

    /**
     * Initializes vertices and normals buffers.
     */
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3
        ];

        this.indices = [
            0, 1, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.initTexCoords();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    /**
     * Initializes texCoords buffer.
     */
    initTexCoords() {

        var c = Math.sqrt(
            Math.pow(this.x2 - this.x3, 2) +
            Math.pow(this.y2 - this.y3, 2) +
            Math.pow(this.z2 - this.z3, 2));

        var b = Math.sqrt(
            Math.pow(this.x1 - this.x2, 2) +
            Math.pow(this.y1 - this.y2, 2) +
            Math.pow(this.z1 - this.z2, 2));

        var a = Math.sqrt(
            Math.pow(this.x1 - this.x3, 2) +
            Math.pow(this.y1 - this.y3, 2) +
            Math.pow(this.z1 - this.z3, 2));

        let cosBeta = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
        let sinBeta = Math.sqrt(1 - Math.pow(cosBeta, 2));

        this.texCoords = [
            0, a * sinBeta / this.lt,
            c / this.ls, a * sinBeta / this.lt,
            (c - a * cosBeta) / this.ls, 0
        ];
    };
};

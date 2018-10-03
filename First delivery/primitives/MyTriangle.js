/**
 * MyTriangle class, representing a triangle.
 */
class MyTriangle extends CGFobject {

    /**
     * @constructor
     * @param {scene,id,x1,y1,z1,x2,y2,z2,x3,y3,z3}
     */
    constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        super(scene);

        this.id = id;
        this.p1 = [x1, y1, z1];
        this.p2 = [x2, y2, z2];
        this.p3 = [x3, y3, z3];

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = [
            this.p1[0], this.p1[1], this.p1[2],
            this.p2[0], this.p2[1], this.p2[2],
            this.p3[0], this.p3[1], this.p3[0]
        ];

        this.indices = [
            0, 1, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        //TODO: add textures

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};
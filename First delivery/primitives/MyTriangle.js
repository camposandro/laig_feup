/**
 * MyTriangle class, representing a triangle.
 */
class MyTriangle extends MyPrimitive {

    /**
     * @constructor
     * @param {scene,id,x1,y1,z1,x2,y2,z2,x3,y3,z3}
     */
    constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
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
        
        this.initBuffers();
    };

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

        //TODO: add textures

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};
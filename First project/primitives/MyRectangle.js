/**
 * MyRectangle class, representing a rectangle.
 */
class MyRectangle extends CGFobject {

    /**
     * @constructor
     * @param {scene,id,x1,y1,x2,y2}
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

    initBuffers() {
        this.vertices = [
            this.x1, this.y2, 0,
            this.x1, this.y1, 0,
            this.x2, this.y1, 0,
            this.x2, this.y2, 0
        ];

        this.indices = [
            2, 1, 0,
            2, 0, 3
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
            0, 0,
            maxS, 0,
            maxS, maxT
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};
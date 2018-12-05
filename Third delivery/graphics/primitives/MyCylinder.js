/**
 * Degrees to radians factor conversion.
 */
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * MyCylinder class, representing a cylinder.
 */
class MyCylinder extends CGFobject {

    /**
    * @constructor
    * @param {XMLScene} scene Scene
    * @param {*} id Cylinder id
    * @param {base} base Base radius
    * @param {top} top Top radius
    * @param {height} height Cylinder height
    * @param {slices} slices Cylinder number of slices
    * @param {stacks} stacks Cylinder number of stacks
    */
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);

        this.id = id;
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.circleBase = new MyCircle(scene, slices, base);
        this.circleTop = new MyCircle(scene, slices, top);

        this.initBuffers();
    };

    /**
     * Initializes vertices, normals and texCoords buffers.
     */
    initBuffers() {
        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();
        this.texCoords = new Array();

        var variation = (this.top - this.base) / this.stacks;
        var angle = (2 * Math.PI) / this.slices;

        for (var j = 0; j <= this.stacks; j++) {
            for (var i = 0; i <= this.slices; i++) {

                this.vertices.push(
                    Math.cos(i * angle) * (this.base + variation * j),
                    Math.sin(i * angle) * (this.base + variation * j),
                    j * this.height / this.stacks
                );

                this.normals.push(
                    Math.cos(i * angle), Math.sin(i * angle), 0
                );

                this.texCoords.push(
                    i * 1 / this.slices, j * 1 / this.stacks
                );
            }
        }

        for (var j = 0; j < this.stacks; j++) {
            for (var i = 0; i < this.slices; i++) {
                this.indices.push(
                    i + j * (this.slices + 1), (i + 1) + j * (this.slices + 1),
                    (i + this.slices + 1) + j * (this.slices + 1),
                    (i + 1) + j * (this.slices + 1),
                    (i + this.slices + 2) + j * (this.slices + 1),
                    (i + this.slices + 1) + j * (this.slices + 1)
                );
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    /**
     * Displays the cylinder, with covers.
     */
    display() {
        CGFobject.prototype.display.call(this);
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.circleTop.display();
        this.scene.translate(0, 0, -this.height);
        this.scene.rotate(180 * DEGREE_TO_RAD, 1, 0, 0);
        this.circleBase.display();
        this.scene.popMatrix();
    };
}
/**
 * MySphere class, representing a sphere.
 */
class MySphere extends CGFobject {

    /**
    * @constructor
    * @param {id,radius,slices,stacks}
    */
    constructor(scene, id, radius, slices, stacks) {
        super(scene);

        this.id = id;
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();
        this.texCoords = new Array();

        // bandas de latitude
        for (var j = 0; j <= this.stacks; j++) {

            var phi = (j * Math.PI) / this.stacks;

            // bandas de longitude
            for (var i = 0; i <= this.slices; i++) {

                var theta = (2 * i * Math.PI) / this.slices;

                var x = this.radius * Math.sin(theta) * Math.sin(phi);
                var y = this.radius * Math.cos(theta) * Math.sin(phi);
                var z = this.radius * Math.cos(phi);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(i / this.slices, 1 - j / this.stacks);
            }
        }

        for (var j = 0; j < this.stacks; j++) {
            for (var i = 0; i < this.slices; i++) {
                var first = (j * (this.slices + 1)) + i;
                var second = first + this.slices + 1;
                this.indices.push(second + 1, second, first);
                this.indices.push(first, first + 1, second + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};


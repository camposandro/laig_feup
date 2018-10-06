/**
 * MySphere class, representing a sphere.
 */
class MySphere extends MyPrimitive {

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

        var indice = 0, z = 0, step = 1 / this.stacks;

        // bandas de latitude
        for (var j = 0; j <= this.stacks; j++) {

            var phi = (j * Math.PI) / this.stacks;

            // bandas de longitude
            for (var i = 0; i <= this.slices; i++) {

                var theta = (2 * i * Math.PI) / this.slices;

                var x = Math.cos(theta) * Math.sin(phi);
                var y = Math.cos(phi);
                var z = Math.sin(theta) * Math.sin(phi);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
            }
        }

        for (var j = 0; j < this.stacks; j++) {
            for (var i = 0; i < this.slices; i++) {
                var first = (j * (this.slices + 1)) + i;
                var second = first + this.slices + 1;
                this.indices.push(first);
                this.indices.push(second);
                this.indices.push(first + 1);
                this.indices.push(second);
                this.indices.push(second + 1);
                this.indices.push(first + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};

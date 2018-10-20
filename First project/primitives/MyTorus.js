/**
 * MyTorus class, representing a torus.
 */
class MyTorus extends CGFobject {

	/**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {id} id Torus id
     * @param {inner} inner Torus inner-radius
     * @param {outer} outer Torus outer-radius
     * @param {slices} slices Torus number of slices
     * @param {loops} loops Torus number of loops
     */
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);

        this.id = id;
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

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

        var s = 1 / this.loops;
        var t = 1 / this.slices;

        // latitudinal stripes
        for (var j = 0; j <= this.loops; j++) {

            var phi = (2 * j * Math.PI) / this.loops;

            // longitudinal stripes
            for (var i = 0; i <= this.slices; i++) {
                
                var theta = (2 * i * Math.PI) / this.slices;

                var x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
                var y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
                var z = this.inner * Math.sin(theta);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(j * s, i * t);
            }
        }

        for (var j = 0; j < this.loops; j++) {
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
}

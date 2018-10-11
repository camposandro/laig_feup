/**
 * MyTorus class, representing a torus.
 */
class MyTorus extends CGFobject {

	/**
     * @constructor
     * @param {scene,id,inner,outer,slices,loops}
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

    initBuffers() {
        this.vertices = new Array();
        this.indices = new Array();
        this.normals = new Array();

        // TODO: add texCoords

        // bandas de latitude
        for (var j = 0; j <= this.loops; j++) {

            var phi = (2 * j * Math.PI) / this.loops;

            // bandas de longitude
            for (var i = 0; i <= this.slices; i++) {
                
                var theta = (2 * i * Math.PI) / this.slices;

                var x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
                var y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
                var z = this.inner * Math.sin(theta);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
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
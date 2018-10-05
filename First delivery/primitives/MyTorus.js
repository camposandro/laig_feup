/**
 * MyTorus class, representing a torus.
 */
class MyTorus extends MyPrimitive {

	/**
     * @constructor
     * @param {scene, id,inner,outer,slices,loops}
     */
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.id = id;
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;
    }
}
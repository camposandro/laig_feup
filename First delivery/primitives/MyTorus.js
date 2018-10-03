/**
 * MyTorus class, representing a torus.
 */
class MyTorus extends MyEntity{

	/**
     * @constructor
     * @param {id,inner,outer,slices,loops}
     */
    constructor(id,inner,outer, slices,loops) {
        super(id);
       this.inner = inner;
       this.outer = outer;
       this.slices = slices;
       this.loops = loops;
    }
}
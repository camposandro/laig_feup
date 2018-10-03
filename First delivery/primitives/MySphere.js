/**
 * MySphere class, representing a sphere.
 */
class MySphere  extends MyEntity{

	/**
     * @constructor
     * @param {id,radius,slices,stacks}
     */
    constructor(id,radius,slices,stacks) {
        super(id);
       this.radius = radius;
       this.slices = slices;
       this.stacks = stacks;
    }
}

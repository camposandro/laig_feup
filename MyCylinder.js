/**
 * MyCylinder class, representing a cylinder.
 */
class MyCylinder  extends MyEntity{

	/**
     * @constructor
     * @param {id,base,top,height,slices,stacks}
     */
    constructor(id,base,top, height,slices,stacks) {
        super(id);
       this.base = base;
       this.top = top;
       this.height = height;
       this.slices = slices;
       this.stacks = stacks;
    }
}

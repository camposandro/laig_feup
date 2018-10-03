/**
 * MyTransformation class, representing a transformation.
 */
class MyTransformation extends MyEntity {

	/**
     * @constructor
     * @param {id, transformations}
     */
    constructor(id) {
     super(id);
     this.transformations = [];
    }
    addTransformation(trans){
        this.transformations.push(trans);
    }
}
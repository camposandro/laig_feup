/**
 * MyView class, representing a view.
 */
class MyView extends MyEntity {

	/**
     * @constructor
     * @param {id, near, far} 
     */
	constructor(id, near, far) {
		super(id);
		this.near = near;
		this.far = far;
	}
}
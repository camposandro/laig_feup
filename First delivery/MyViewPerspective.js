/**
 * MyViewPerspective class, representing a view of perspective type.
 */

class MyViewPerspective extends MyView {

	/**
     * @constructor
     * @param {id, near, far, angle, from, to} 
     */
	constructor(id, near, far, angle, from, to){
		super(id, near, far);
		this.angle = angle;
		this.from = from;
		this.to = to;
	}
}
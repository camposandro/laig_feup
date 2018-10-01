
	/**
 * MyViewOrtho class, representing a view of ortho type.
 */

class MyViewOrtho extends  MyView {

	
	constructor(id,near, far,  left,  right,  top,  bottom){
		super(id, near, far);
		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
		
		
	}
}
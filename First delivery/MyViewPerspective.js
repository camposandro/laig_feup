/**
 * MyViewPerspective class, representing a view of perspective type.
 */

class MyViewPerspective extends MyView {

	constructor( id,  near, far,  angle,  x,  y,  z, x2,  y2,  z2){
		super(id, near, far);
		
		this.angle = angle;
		this.x = x;
		this.y = y;
		this.z = z;
		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;
		
		
	}
	
}
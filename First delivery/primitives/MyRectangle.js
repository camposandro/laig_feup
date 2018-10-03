/**
 * MyRectangle class, representing a rectangle.
 */
class MyRectangle  extends MyEntity{

	/**
     * @constructor
     * @param {id,x1,y1,x2,y2}
     */
    constructor(id,x1,y1,x2,y2) {
        super(id);
       this.x1 = x1;
       this.y1 = y1;
       this.x2 = x2;
       this.y2 = y2;
    }
}

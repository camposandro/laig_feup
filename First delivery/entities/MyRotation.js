/**
 * MyRotation class, representing a rotation.
 */
class MyRotation {

	/**
     * @constructor
     * @param {axis,angle}
     */
    constructor(axis, angle) {
        this.axis = axis;
        this.angle = angle;
        this.vec = [];
        this.parseAxis(axis);
    }

    parseAxis(axis) {
        if (axis == 'x')
            this.vec = [1, 0, 0];
        if (axis == 'y')
            this.vec = [0, 1, 0];
        if (axis == 'z')
            this.vec = [0, 0, 1];
    }
}

/**
 * MyRotation class, representing a rotation.
 */
class MyRotation {

	/**
     * @constructor
     * @param {axis} axis Axis of rotation (x,y,z)
     * @param {angle} angle Angle of rotation, in degrees
     */
    constructor(axis, angle) {
        this.axis = axis;
        this.angle = angle;
        this.parseAxis(axis);
    }

    /**
     * Initializes the rotation vector.
     * @param {axis} axis Axis of rotation (x,y,z)
     */
    parseAxis(axis) {
        if (axis == 'x')
            this.vec = [1, 0, 0];
        if (axis == 'y')
            this.vec = [0, 1, 0];
        if (axis == 'z')
            this.vec = [0, 0, 1];
    }
}

/**
 * MyLinearAnimation, representing a linear animation.
 * @constructor
 */
class MyLinearAnimation extends MyAnimation {

    /**
     * @constructor
     * @param {id} id LinearAnimation id
     * @param {span} span LinearAnimation span
     */
    constructor(id, span) {
        super(id, span);
        this.controlPoints = new Array();
        this.finished = false;

        this.totalTime = 0;
        this.lastCurrTime = -1;
        this.point = 1;
        this.position;
    };

    /**
     * Adds a control point to the animation.
     * @param {x} x Control point x-coordinate
     * @param {y} y Control point y-coordinate
     * @param {z} z Control point z-coordinate
     */
    addControlPoint(x, y, z) {
        this.controlPoints.push({ x, y, z });
    }

    /**
     * Updates the object's position during the course
     * of its linear animation.
     * @param {currTime} currTime Time
     */
    update(currTime) {
        if (this.finished)
            return true;

        var time = 0;
        if (this.lastCurrTime > 0)
            time = currTime - this.lastCurrTime;

        this.lastCurrTime = currTime;
        this.totalTime += time;
        if ((this.totalTime >= this.span)) {
            this.finished = true;
            this.totalTime = this.span;
        }
        var secondsPerPoint = this.span / (this.controlPoints.length - 1);
        if ((secondsPerPoint * this.point) < this.totalTime) {
            this.point++;
        }

        var difX = (this.controlPoints[this.point]['x'] - this.controlPoints[this.point - 1]['x']);
        var difY = (this.controlPoints[this.point]['y'] - this.controlPoints[this.point - 1]['y']);
        var difZ = (this.controlPoints[this.point]['z'] - this.controlPoints[this.point - 1]['z']);

        if (difX == 0 && difZ == 0)
            this.angle = 0;
        else if (difX == 0)
            if (difZ > 0)
                this.angle = Math.PI / 2;
            else
                this.angle = -Math.PI / 2;
        else if (difZ == 0)
            if (difX > 0)
                this.angle = 0;
            else
                this.angle = -Math.PI;
        else
            this.angle = Math.atan(difZ / difX);

        if (difZ < 0 && difX < 0)
            this.angle += Math.PI;
        else if (difZ > 0 && difX < 0)
            this.angle = Math.PI - this.angle;
        else if (difZ < 0 && difX > 0)
            this.angle *= -1;

        var velocityX = difX / secondsPerPoint;
        var velocityY = difY / secondsPerPoint;
        var velocityZ = difZ / secondsPerPoint;

        var posX = (velocityX * this.totalTime);
        this.posY = (velocityY * this.totalTime);
        var posZ = (velocityZ * this.totalTime);

        this.hipotenuse = Math.sqrt(posX * posX + posZ * posZ);

        return this.finished;
    }
    /**
     * Calculates and returns the transformation matrices for
     * the object afected by a linear animation, during its motion.
     */
    apply() {
        var transMatrix = mat4.create();
        mat4.identity(transMatrix);

        mat4.rotate(transMatrix, transMatrix, this.angle, [0, 1, 0]);
        mat4.translate(transMatrix, transMatrix, [0, this.posY, this.hipotenuse]);

        return transMatrix;
    }
}

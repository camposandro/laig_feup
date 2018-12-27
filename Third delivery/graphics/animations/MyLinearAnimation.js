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

        this.totalTotalTime = 0;
        this.totalTime = 0;
        this.lastCurrTime = -1;
        this.point = 1;
        this.position;
        this.x = 0;
        this.y = 0;
        this.z = 0;
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
        this.totalTotalTime += time;
        this.totalTime += time;
        if ((this.totalTotalTime >= this.span)) {
            this.finished = true;
            this.totalTotalTime = this.span;
        }
        var secondsPerPoint = this.span / (this.controlPoints.length - 1);
        if ((secondsPerPoint * this.point) < this.totalTotalTime) {
            this.totalTime = 0;
            this.point++;
            this.x = this.posX;
            this.y = this.posY;
            this.z = this.posZ;
        }

        var difX = (this.controlPoints[this.point]['x'] - this.controlPoints[this.point - 1]['x']);
        var difY = (this.controlPoints[this.point]['y'] - this.controlPoints[this.point - 1]['y']);
        var difZ = (this.controlPoints[this.point]['z'] - this.controlPoints[this.point - 1]['z']);

        var velocityX = difX / secondsPerPoint;
        var velocityY = difY / secondsPerPoint;
        var velocityZ = difZ / secondsPerPoint;

        this.posX = this.x + (velocityX * this.totalTime);
        this.posY = this.y + (velocityY * this.totalTime);
        this.posZ = this.z + (velocityZ * this.totalTime);


        return this.finished;
    }
    /**
     * Calculates and returns the transformation matrices for
     * the object afected by a linear animation, during its motion.
     */
    apply() {
        var transMatrix = mat4.create();
        mat4.identity(transMatrix);

        mat4.translate(transMatrix, transMatrix, [this.posX, this.posY, this.posZ]);

        return transMatrix;
    }
}

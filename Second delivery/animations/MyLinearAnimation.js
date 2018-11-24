/**
 * MyLinearAnimation
 * @constructor
 */
class MyLinearAnimation extends MyAnimation {

    /**
     * @constructor
     * @param {id} id LinearAnimation id
     * @param {span} span LinearAnimation span
     * @param {controlPoints} controlPoints the control points of the Animation
     */
    constructor(id, span) {
        super(id, span);
        this.controlPoints = new Array();
        this.anteriorPoint = [0, 0, 0];
        this.finished = false;
        this.hipotenuse = 0;
        this.totalTime = 0;
        this.lastCurrTime = -1;
        this.point = 1;
        this.angle = 0;
        this.lastAngle = 0;
        this.rotateFrame = true;
    };

    addControlPoint(x, y, z) {
        this.controlPoints.push({ x, y, z });
    }

    update(currTime) {
        if (this.finished)
            return true;

        if (this.controlPoints.length < 2)
            return false;

        var time;
        if (this.lastCurrTime > 0)
            time = currTime - this.lastCurrTime;
        else
            time = 0;

        this.lastCurrTime = currTime;
        this.totalTime += time;
        if ((this.totalTime > this.span)) {
            this.finished = true;
            return true;
        }

        var secondsPerPoint = this.span / (this.controlPoints.length - 1);
        if ((secondsPerPoint * this.point) < this.totalTime) {
            this.point++;
            this.lastAngle = this.angle * -1;
            this.rotateFrame = true;
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

        if (difZ > 0 && difX < 0)
            this.angle = Math.PI - this.angle;

        if (difZ < 0 && difX > 0)
            this.angle *= -1;

        var velocityX = difX / secondsPerPoint;
        var velocityY = difY / secondsPerPoint;
        var velocityZ = difZ / secondsPerPoint;

        var desX = velocityX * time;
        this.desY = velocityY * time;
        var desZ = velocityZ * time;

        this.hipotenuse = Math.sqrt(desX * desX + desZ * desZ);
    }

    apply() {
        if (!this.finished) {
            var transMatrix = mat4.create();

            mat4.identity(transMatrix);

            if (this.rotateFrame) {
                mat4.rotate(transMatrix, transMatrix, this.lastAngle, [0, 1, 0]);
                mat4.rotate(transMatrix, transMatrix, this.angle, [0, 1, 0]);
                this.rotateFrame = false;
            }

            mat4.translate(transMatrix, transMatrix, [0, this.desY, this.hipotenuse]);

            return transMatrix;
        }
    }
}
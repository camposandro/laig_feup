/**
 * MyCircularAnimation, representing a circular animation.
 * @constructor
 */
class MyCircularAnimation extends MyAnimation {

    /**
     * @constructor
     * @param {id} id CircularAnimation id
     * @param {span} span CircularAnimation span
     * @param {center} center CircularAnimation center
     * @param {radius} radius CircularAnimation radius
     * @param {startang} startang CircularAnimation initial angle
     * @param {rotang} rotang CircularAnimation total rotation angle
     */
    constructor(id, span, center, radius, startang, rotang) {
        super(id, span);

        this.center = center;
        var centerS = center += '';
        const splitString = centerS.split(" ");

        this.centerX = parseInt(splitString[0]);
        this.centerY = parseInt(splitString[1]);
        this.centerZ = parseInt(splitString[2]);

        this.radius = radius;
        this.startang = startang;
        this.rotang = rotang;
        this.finished = false;
        this.totalTime = 0;
        this.position;
        this.angle = startang;
        this.angleVelocity = this.rotang / this.span;
        this.axis = 'y';
    };

    /**
     * Updates the object's position during the course
     * of its circular animation.
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
        if (this.totalTime > this.span) {
            this.finished = true;
            this.totalTime = this.span;
        }

        this.angle = this.startang + this.angleVelocity * this.totalTime;
        var posX = this.radius * Math.cos(this.angle);
        var posZ = this.radius * Math.sin(this.angle);

        this.position = [posX, 0, posZ];

        return false;
    }

    changeAxis(axis){
        this.axis = axis;
    }

    /**
     * Calculates and returns the transformation matrices for
     * the object afected by a circular animation, during its motion.
     */
    apply() {
        var transMatrix = mat4.create();
        mat4.identity(transMatrix);

        mat4.translate(transMatrix, transMatrix, [this.centerX, this.centerY, this.centerZ]);
        
        mat4.translate(transMatrix, transMatrix, this.position);
        if(this.axis == 'y')
            mat4.rotate(transMatrix, transMatrix, this.angle, [0, 1, 0]);
        else if(this.axis == 'x')
            mat4.rotate(transMatrix, transMatrix, this.angle, [1, 0, 0]);
        else if(this.axis == 'z')
            mat4.rotate(transMatrix, transMatrix, this.angle, [0, 0, 1]);

        return transMatrix;
    }
}

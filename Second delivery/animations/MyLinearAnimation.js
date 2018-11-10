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
        super(id,span);
        this.controlPoints = new Array();
        this.anteriorPoint = [0,0,0];
        this.finished = false;

        this.totalTime = 0;
        this.lastCurrTime = -1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.velocityZ = 0;
        this.point = 1;
        this.position;
    };

    addControlPoint(x, y, z){
        this.controlPoints.push( {x, y, z} );
    }

    update(currTime) {
        if(this.finished)
            return true;

        var time;
        if(this.lastCurrTime > 0) {
            time = currTime - this.lastCurrTime;
        }
        else 
            time = 0;
        this.lastCurrTime = currTime;
        this.totalTime += time;
        if((this.totalTime > this.span)){
            this.finished = true;
            return true;
        }
            
        var secondsPerPoint = this.span / (this.controlPoints.length - 1);

        if((secondsPerPoint * this.point) < this.totalTime) {
            this.point++;
        }
        
        this.velocityX = (this.controlPoints[this.point]['x'] - this.controlPoints[this.point - 1]['x']) / secondsPerPoint;
        this.velocityY = (this.controlPoints[this.point]['y'] - this.controlPoints[this.point - 1]['y']) / secondsPerPoint;
        this.velocityZ = (this.controlPoints[this.point]['z'] - this.controlPoints[this.point - 1]['z']) / secondsPerPoint;

        var desX = (this.velocityX * time * -1);
        var desY = (this.velocityY * time * -1);
        var desZ = (this.velocityZ * time * -1);

        this.anteriorPoint = [desX, desY, desZ];

        this.position = [desX, desY, desZ];
    }

    apply(transformationsMatrix) {
        if(!this.finished) {
            mat4.translate(transformationsMatrix, transformationsMatrix, this.position);
            return transformationsMatrix;
        }
    }
}

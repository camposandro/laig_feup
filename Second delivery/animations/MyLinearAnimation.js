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

        this.totalTime = 0;
        this.lastCurrTime = -1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.velocityZ = 0;
        this.point = 1;
    };

    addControlPoint(x, y, z){
        this.controlPoints.push( {x, y, z} );
    }

    update(currTime) {
        
        var time;
        if(this.lastCurrTime > 0) {
            time = currTime - this.lastCurrTime;
        }
        else 
            time = 0;
        this.lastCurrTime = currTime;
        this.totalTime += time;
        if((this.totalTime > this.span) || (this.totalTime == 0))
            return [0,0,0];
            
        var secondsPerPoint = this.span / (this.controlPoints.length - 1);

        if((secondsPerPoint * this.point) < this.totalTime) {
            this.point++;
        }
        //console.log(this.point);
        
        this.velocityX = (this.controlPoints[this.point]['x'] - this.controlPoints[this.point - 1]['x']) / secondsPerPoint;
        this.velocityY = (this.controlPoints[this.point]['y'] - this.controlPoints[this.point - 1]['y']) / secondsPerPoint;
        this.velocityZ = (this.controlPoints[this.point]['z'] - this.controlPoints[this.point - 1]['z']) / secondsPerPoint;

        var desX = (this.velocityX * time * -1);
        var desY = (this.velocityY * time * -1);
        var desZ = (this.velocityZ * time * -1);

        this.anteriorPoint = [desX, desY, desZ];

        var position = [desX, desY, desZ];
        
        return position;
    }

    apply() {

    }
}

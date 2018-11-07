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
        this.totalTime = 0;
        var d = new Date();
        var n = d.getTime();
        this.lastCurrTime = -1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.velocityZ = 0;
    };

    addControlPoint(x, y, z){
        this.controlPoints.push( {x, y, z} );
    }

    velocity() {
        this.velocityX = (this.controlPoints[1]['x'] - this.controlPoints[0]['x']) / this.span;
        this.velocityY = (this.controlPoints[1]['y'] - this.controlPoints[0]['y']) / this.span;
        this.velocityZ = (this.controlPoints[1]['z'] - this.controlPoints[0]['z']) / this.span;
    }
    update(currTime) {
        
        var time;
        if(this.lastCurrTime > 0) {
            time = currTime - this.lastCurrTime;
        }
        else 
            time = 0;
        this.lastCurrTime = currTime;

        var nPoints = this.controlPoints.length;

        this.totalTime += time;
        if((this.totalTime > this.span) || (this.totalTime == 0))
            return [0,0,0];
        var point = this.span % this.totalTime;
        
        //console.log(this.controlPoints);

        var posX = this.velocityX * this.totalTime * -1;
        var posY = this.velocityY * this.totalTime * -1;
        var posZ = this.velocityZ * this.totalTime * -1;

        var position = [posX, posY, posZ];
        
        return position;
    }

    apply() {

    }
}

/**
 * MyLinearMyCircularAnimationAnimation
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
        super(id,span);

        this.center = center;
        var centerS = center += '';
        const splitString = centerS.split(" ") ;

        this.centerX = splitString[0];
        this.centerY = splitString[1];
        this.centerZ = splitString[2];
        this.first = true;

        this.radius = radius;
        this.startang = startang;
        this.rotang = rotang;
        this.finished = false;
        this.totalTime = 0;
        this.lastAngle = 0;
        
        this.position;
        this.angle = startang;
        this.lastIteration = false;

        this.angleVelocity = this.rotang / this.span;

    };


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
        if(this.totalTime > this.span){
            this.finished = true;
            this.lastIteration = true;
            this.totalTime = this.span;
        }

        this.angle = this.startang + this.angleVelocity * this.totalTime;
        this.transAngle = this.angle - this.lastAngle;
        this.lastAngle = this.angle;


        var posX = this.radius * Math.cos(this.angle);
        var posZ = this.radius * Math.sin(this.angle);

        
        
        this.position = [posX, 0, posZ];
        //console.log(this.position);
        this.invertposition = [-posX, 0, -posZ];
    }


    apply(transformationsMatrix) {
        if(!this.finished || this.lastIteration) {
            this.lastIteration = false;
            mat4.translate(transformationsMatrix, transformationsMatrix, [this.centerX,this.centerY,this.centerZ]);
            mat4.translate(transformationsMatrix, transformationsMatrix, this.position);
            mat4.rotate(transformationsMatrix, transformationsMatrix, this.transAngle, [0,1,0]);
            mat4.translate(transformationsMatrix, transformationsMatrix, this.invertposition);
            mat4.translate(transformationsMatrix, transformationsMatrix, [-this.centerX,-this.centerY,-this.centerZ]);
            
            
            return transformationsMatrix;
        }
        
    }
}

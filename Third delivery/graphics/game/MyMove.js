/**
 * MyMove, representing a player's move.
 * @constructor
 */
class MyMove {

    /**
     * @constructor
     * @param {type} type Move type of animation
     * @param {cell} initCell Move initial cell
     * @param {cell} finalCell Move final cell
     */
    constructor(type, initCell, finalCell) {
        this.type = type;
        this.initCell = initCell;
        this.finalCell = finalCell;
        this.span = 1; // predefined move span of 1 second
        this.initAnimation();
    };

    initAnimation() {
        switch(this.type) {
            case 'linear':
                this.animation = new MyLinearAnimation(0,1);
                this.animation.addControlPoint(this.initCell);
                this.animation.addControlPoint(this.finalCell);
                break;
            case 'circular':
                let initPos = vec3.fromValues(this.initCell);
                let finalPos = vec3.fromValues(this.finalCell);
                let deltaPos = vec3.subtract(deltaPos,initPos,finalPos);
                let radius = length(deltaPos) / 2;
                let center = initPos + deltaPos / 2;
                this.animation = new MyCircularAnimation(0,this.span,center,radius,0,180);
                break;
            default:
                console.log('[MyMove]: undefined animation type');
                return;
        }
    }
}
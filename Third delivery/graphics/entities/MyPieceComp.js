/**
 * MyPiece class, representing a piece.
 */
class MyPieceComp extends MyComponent{ 


    constructor(scene, id) {
        super(scene, id);
        this.state = 'Initial State';
        this.xPosition = -1;
        this.zPosition = -1;
        this.animIndex = 0;
    }

    updateState(nextState, move) {
        switch(this.state) {
            case 'Initial State':
                if(nextState == 'On Board'){
                    this.setOnBoard(move);
                    this.state = nextState;
                }
                else
                    return -1;
                break;

            case 'On Board':
                if(nextState == 'Picked'){
                    this.pickAnimation();
                    //this.state = nextState;
                }
                else
                    return -1;
                break;

            case 'Picked':
                if(nextState == 'On Board') {
                    this.pickAnimation(move)
                    this.state = nextState;
                }
                else if(nextState == 'Moving'){
                    this.moveAnimation(move);
                    nextState = this.state;
                }
                else if(nextState == this.state)
                    return 0;
                else
                    return -1;
                break;

                case 'Moving':
                if(nextState == 'On Board') {
                    this.pickAnimation();
                    this.state = nextState;
                }
                else if(nextState == 'Picked')
                    return 0;
                else
                    return -1;
                break;
        }   
    }   
    setOnBoard(move) {
        var x = move[0];
        var y = move[1];
    }

    pickAnimation() {
        var anim = new MyLinearAnimation(this.animIndex++,1);
        anim.addControlPoint(0,0,0);
        anim.addControlPoint(0,1,0);

        this.addAnimation(this.animIndex,anim);
        
        if(this.animationsDone){
            this.currentAnimationIndex++;
            this.animationsDone = false;
        }
    }

    moveAnimation(move) {

    }
}
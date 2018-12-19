/**
 * MyPiece class, representing a piece.
 */

var DEGREE_TO_RAD = Math.PI / 180;

class MyPieceComp extends MyComponent{ 


    constructor(scene, id) {
        super(scene, id);
        this.state = 'Initial State';
        this.animIndex = 0;
        
        var idLength = id.length; 
        var nPiece = id.charAt(idLength - 1); 
        this.pickedLength = 0.8;
        this.xPosition = 0.5*nPiece;
        this.zPosition = -1;
        this.states = new Array('Initial State','On Board','Picked','Moving');
    }

    updateState(nextState, move) {
        if(nextState = 'nextState') {
            var id = this.states.indexOf(this.state) + 1;
            if(id != 4)
                nextState = this.states[id];
            else
                nextState = this.states[2];
        }

        switch(this.state) {
            case 'Initial State':
                if(nextState == 'On Board'){
                    this.setOnBoard();
                    this.setOnCell(move);
                    this.state = nextState;
                }
                else
                    return -1;
                break;

            case 'On Board':
                if(nextState == 'Picked'){
                    this.pickAnimation();
                    this.state = nextState;
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
                    this.moveAnimation([3,4]);
                    this.state = 'On Board';
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

    setOnBoard() {

        this.addTranslation(new MyTranslation(0,-this.xPosition,0));
        this.addRotation(new MyRotation('x',-90 * DEGREE_TO_RAD));
        this.addTranslation(new MyTranslation(1.05,-0.4,-1.3));
        this.addTranslation(new MyTranslation(0,0.7,0.5));
        this.xPosition = 1;
        this.zPosition = 1;
    }

    setOnCell(move) {
        var distX = move[0] - this.xPosition;
        var distZ = move[1] - this.zPosition;
        this.addTranslation(new MyTranslation(distX,0,distZ));
        this.xPosition += distX;
        this.zPosition += distZ;
    }

    pickAnimation() {
        var anim = new MyLinearAnimation(this.animIndex++,0.3);
        anim.addControlPoint(0,0,0);
        anim.addControlPoint(0,this.pickedLength,0);

        this.addAnimation(this.animIndex,anim);
        
        if(this.animationsDone){
            this.currentAnimationIndex++;
            this.animationsDone = false;
        }
    }

    moveAnimation(move) {

        var anim = new MyLinearAnimation(this.animIndex++,1);
        anim.addControlPoint(this.xPosition,0,this.zPosition);
        anim.addControlPoint(move[1],0,move[0]);
        anim.addControlPoint(move[1],-this.pickedLength,move[0]);

        
        this.xPosition = move[1];
        this.zPosition = move[0];

        this.addAnimation(this.animIndex,anim);
        
        if(this.animationsDone){
            this.currentAnimationIndex++;
            this.animationsDone = false;
        }
    }

}
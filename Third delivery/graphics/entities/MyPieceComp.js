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
        if(nextState == 'nextState') {
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
                break;

            case 'On Board':
                console.log("ON BOARD")
                if(nextState == 'Picked'){
                    this.pickAnimation(0);
                    this.state = nextState;
                }
                break;

            case 'Picked':
                console.log("PICKED")
                if(nextState == 'On Board') {
                    this.pickAnimation(1)
                    this.state = nextState;
                }
                else if(nextState == 'Moving') {
                    this.moveAnimation(move);
                    this.state = 'On Board';
                }
               
                break;

            case 'Moving':
                if(nextState == 'On Board') {
                    this.pickAnimation();
                    this.state = nextState;
                }
               
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

    pickAnimation(inverse) {
        var anim = new MyLinearAnimation(this.animIndex++,0.3);
        anim.addControlPoint(0,0,0);

        if (inverse)
            anim.addControlPoint(0,-this.pickedLength,0);
        else
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
        anim.addControlPoint(move[0],0,move[1]);
        anim.addControlPoint(move[0],-this.pickedLength,move[1]);

        this.xPosition = move[0];
        this.zPosition = move[1];

        this.addAnimation(this.animIndex,anim);
        
        if(this.animationsDone){
            this.currentAnimationIndex++;
            this.animationsDone = false;
        }
    }

}
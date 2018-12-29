/**
 * MyPiece class, representing a piece.
 */

var DEGREE_TO_RAD = Math.PI / 180;

class MyPieceComp extends MyComponent { 


    constructor(scene, id) {
        super(scene, id);
        this.state = 'Initial State';
        this.animIndex = 0;
        
        var idLength = id.length; 
        var nPiece = id.charAt(idLength - 1); 
        this.pickedLength = 0.8;
        this.zPosition = 0.5*nPiece + 1.8;
        this.xPosition = 0;
        
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
                if(nextState == 'Picked'){
                    this.pickAnimation(0);
                    this.state = nextState;
                }
                break;

            case 'Picked':
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

        var anim = new MyLinearAnimation(this.animIndex++,0.3);
        anim.addControlPoint(0,0,0);
        anim.addControlPoint(0,0,-this.pickedLength - 0.2);
        this.addAnimation(this.animIndex,anim);

        var anim2 = new MyCircularAnimation(this.animIndex++,0.5,"0 0 0",0,0,-Math.PI/2);
        anim2.changeAxis('x');
        this.addAnimation(this.animIndex,anim2);

       
        if(this.animationsDone){
           this.currentAnimationIndex++;
           this.animationsDone = false;
        }

    }

    setOnCell(move) {
        var distX = move[0] - this.xPosition;
        var distZ = move[1] - this.zPosition;
        console.log('xPosition: ' + this.xPosition);
        console.log('move[0]: ' + move[0]);
        //this.addTranslation(new MyTranslation(distX,0,distZ));

        var anim = new MyLinearAnimation(this.animIndex++,1);
        anim.addControlPoint(0,0,0);
        anim.addControlPoint(distX,0,distZ);
        anim.addControlPoint(distX,-this.pickedLength,distZ);
        this.addAnimation(this.animIndex,anim);

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
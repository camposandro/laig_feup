/**
 * MyBlackPieceComp class, representing a black piece.
 */

var DEGREE_TO_RAD = Math.PI / 180;

class MyBlackPieceComp extends MyPieceComp{ 

    constructor(scene, id) {
        super(scene, id);
    }
    setOnBoard() {
        this.addTranslation(new MyTranslation(0,-this.xPosition,0));
        this.addRotation(new MyRotation('x',-90 * DEGREE_TO_RAD));
        this.addTranslation(new MyTranslation(-5.2,-0.4,-1.3));
        this.addTranslation(new MyTranslation(0,0.7,0.5));
        this.xPosition = 1;
        this.zPosition = 1;
    }
}
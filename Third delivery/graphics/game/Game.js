/**
 * MyMove, representing a player's move.
 * @constructor
 */
class Game {

    /**
     * @constructor
     * @param {cell} finalCell Move final cell
     */
    constructor() {
        this.states = new Array('Beggining','Playing','End');
        this.state = this.states[0];
        this.pieceSelectedId=0;
        this.cellSelectedId=0;
        this.piecesPlaced = 0;
    };

    game(pickingIndex, pickedId) {
        switch(this.state) {
            case 'Beggining':
                if(pickingIndex > 8){
                    movePieceToCellBeggining(pickedId);
                    this.piecesPlaced++;
                    if(this.piecesPlaced = 16)
                        this.state = 'Playing';
                    break;
                }
                break;
            case 'Playing':
                if(win())
                    this.state = 'End';
                break;
            case 'End':
                return 0;
                break;
        }
    }  


    movePieceToCellBeggining(cellId){
        var idLength = cellId.length;
        var x = cellId.charAt(idLength - 2); 
        var z = cellId.charAt(idLength - 1); 
        if(this.piecesPlaced % 2)  {     //is even
            this.scene.graph.components['redPiece' + (this.piecesPlaced + 1)].updateState('nextState', [x,y]);
            this.piecesPlaced++;
        }
        else
            this.scene.graph.components['blackPiece' + (this.piecesPlaced + 4)].updateState('nextState', [x,y]);
            this.piecesPlaced++;
            

    }
}


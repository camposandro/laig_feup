/**
 * Teeko, representing the game.
 * @constructor
 */
class Teeko {

    /**
     * @constructor
     * @param {XMLscene} scene Game scene
     */
    constructor(scene) {
        this.scene = scene;

        this.client = new Client()

        this.boardStack = new Array()
        this.moveStack = new Array()

        this.NUM_PIECES = 8
        this.currPlayer = 'black'

        this.state = {
            GAME_START: 0,
            WAIT_FOR_FREE_CELL: 1,
            PLACE_PIECES: 2,
            WAIT_FOR_FREE_CELL: 3,
            WAIT_FOR_VALID_CELL: 4,
            MOVING_PIECES: 5,
            GAME_END: 6
        }
        this.currState = this.state.GAME_START

        this.END_OF_GAME = false

        this.nextState()
    };

    cellPickingHandler(cell) {
        let row = cell.row
        let col = cell.col

        switch(this.currState) {
            case this.state.WAIT_FOR_FREE_CELL:
                this.isFreeCell(row,col)
                break;
            case this.state.WAIT_FOR_VALID_CELL:
                this.isValidMove(row,col)
                break;
            default:
                break;
        }
    }

    piecePickingHandler(piece) {
       
        /*if (this.selectedPiece != null) {
            this.selectedPiece.updateState("On Board",null)
        }*/

        this.selectedPiece = piece
        console.log(this.selectedPiece)


        let row = piece.xPosition
        let col = piece.zPosition

        switch(this.currState) {
            case this.state.WAIT_FOR_PIECE:
                this.isPlayerCell(row,col)
                break;
            default:
                break;
        }
    }

    nextState() {
        let row,col,finalRow,finalCol

        switch (this.currState) 
        {
            case this.state.GAME_START:
                this.getInitialBoard()
                this.piecesPlaced = 0
                this.CURR_PIECE_NUM = 1
                this.currState = this.state.WAIT_FOR_FREE_CELL
                break;

            case this.state.WAIT_FOR_FREE_CELL:
                if (this.piecesPlaced == this.NUM_PIECES)
                    this.currState = this.state.WAIT_FOR_PIECE
                else if (this.placedValues != undefined)
                    this.currState = this.state.PLACE_PIECES

                console.log('wait for free cell')
                break;

            case this.state.PLACE_PIECES:
                row = this.placeValues[0]
                col = this.placeValues[1]
                this.setPieceCell(row,col)

                console.log('place pieces')
                break;

            case this.state.WAIT_FOR_PIECE:
                if (this.moveFromValues != undefined)
                    this.currState = this.state.WAIT_FOR_VALID_CELL

                console.log('wait for piece')
                break;

            case this.state.WAIT_FOR_VALID_CELL:
                if (this.moveToValues != undefined)
                    this.currState = this.state.MOVING_PIECES

                console.log('wait for valid cell')
                break;

            case this.state.MOVING_PIECES:
                if (this.END_OF_GAME) 
                    this.currState = this.state.GAME_END

                row = this.moveFromValues[0]
                col = this.moveFromValues[1]
                finalRow = this.moveToValues[0]
                finalCol = this.moveToValues[1]

                console.log("MOVE FROM [" + row + "," + col + "]" + "to [" + finalRow + "," + finalCol + "]")
                this.movePiece(row,col,finalRow,finalCol)
    
                console.log('moving pieces')
                break;

            case this.state.GAME_END:
                console.log('end of game')
                break;
            default:
                break;
        }
    }

    updatePlayerTurn() {
        if (this.currPlayer == 'black') 
            this.currPlayer = 'red'
        else if (this.currPlayer == 'red')
            this.currPlayer = 'black'
    }

    setPieceCell(row, col) {
        if (this.currPlayer == 'red') {
            let compId = 'redPiece' + this.CURR_PIECE_NUM
            this.scene.graph.components[compId].updateState('nextState', [row, col])
            this.CURR_PIECE_NUM++
        } else if (this.currPlayer == 'black') {
            this.placePiece(row,col,'black')
            let compId = 'blackPiece' + this.CURR_PIECE_NUM
            this.scene.graph.components[compId].updateState('nextState', [row, col])
        }

        this.piecesPlaced++
        this.placePiece(row,col,this.currPlayer)
        this.updatePlayerTurn()
    
        this.currState = this.state.WAIT_FOR_FREE_CELL
        this.nextState()
    }

    isValidMove(finalRow,finalCol) {
        console.log("POSIBBLE MOVES: " + this.possibleMoves)
        console.log(finalRow,finalCol)

        if (this.possibleMoves.includes([finalRow,finalCol])) {
            this.moveToValues = [finalRow,finalCol]
            this.currState = this.state.MOVING_PIECES
            this.nextState()
            console.log("VALID MOVE")
        } else {
            this.moveToValues = undefined
            console.log("NOT VALID MOVE")
        }
    }

    updatePieceCell(row, col) {
        this.selectedPiece.updateState('nextState', [row, col])
        //this.nextState()
    }

    getInitialBoard() {
        var game = this
        let request = this.parseRequestToStr('initialBoard')

        this.client.getPrologRequest(
            request,
            (data) => {
                game.board = data.target.response
                game.nextState()
            },
            (data) => {
                console.log('# No received answer!\n')
            }
        )
    }

    isFreeCell(row,col) {
        var game = this
        let request = this.parseRequestToStr('freeCell', [this.board, row, col])

        this.client.getPrologRequest(
            request,
            (data) => {
                let freeCell = data.target.response
                if (freeCell == 1) {
                    console.log("FREE CELL")
                    game.placeValues = [row,col]
                    game.currState = game.state.PLACE_PIECES
                }
                else {
                    console.log("NOT FREE CELL")
                    game.placeValues = undefined
                }
                                
                game.nextState()
            },
            (data) => {
                console.log('# No received answer!\n')
            }
        )
    }

    isPlayerCell(row,col) {
        var game = this
        let request = this.parseRequestToStr('playerCell', [this.board, row, col, this.currPlayer])

        this.client.getPrologRequest(
            request,
            (data) => {
                let playerCell = data.target.response
                if (playerCell == 1) {
                    console.log("PLAYER " + this.currPlayer + " CELL SELECTED")
                    game.moveFromValues = [row,col]
                    game.updatePieceCell()
                    game.getValidMoves(row,col)
                }
                else {
                    console.log("NOT PLAYER " + this.currPlayer + " CELL")
                    game.moveFromValues = undefined
                }
            },
            (data) => {
                console.log('# No received answer!\n')
            }
        )
    }

    getValidMoves(row, col) {
        var game = this
        let request = this.parseRequestToStr('validMoves', [this.board, row, col])

        this.client.getPrologRequest(
            request,
            (data) => {
                console.log(data.target.response)
                game.possibleMoves = data.target.response
                game.currState = this.state.WAIT_FOR_VALID_CELL
            },
            (data) => {
                console.log('# No received answer!\n')
            }
        )
    }

    placePiece(row, col, piece) {
        var game = this
        let request = this.parseRequestToStr('placePiece', [game.board, row, col, piece])

        this.client.getPrologRequest(request,
            (data) => {
                game.board = data.target.response
                // checkWin()
                console.log(game.board)
            },
            (data) => {
                console.log("# No received answer!\n")
            }
        );
    }

    movePiece(row, col, finalRow, finalCol) {
        var game = this
        let request = this.parseRequestToStr('movePiece', [game.board, row, col, finalRow, finalCol])

        this.client.getPrologRequest(request,
            (data) => {
                game.board = data.target.response
                //checkWin()
                console.log(game.board)

                game.updatePieceCell(finalRow, finalCol)
                this.updatePlayerTurn()
                
                this.currState = this.state.WAIT_FOR_PIECE     
            },
            (data) => {
                console.log("# No received answer!\n")
            }
        );
    }

    parseRequestToStr(pred, args = []) {
        var request = pred

        for (let i = 0; i < args.length; i++) {
            if (i == 0) request += '('
            request += args[i]
            if (i == args.length - 1)
                request += ')'
            else
                request += ','
        }

        return request
    }
}
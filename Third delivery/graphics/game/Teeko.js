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

    pickingHandler(row,col) {
        if (this.currState == this.state.WAIT_FOR_FREE_CELL) {
            this.isFreeCell(row,col)
        } else if (this.currState == this.state.WAIT_FOR_PIECE) {
            this.isPlayerCell(row,col)
        } else if (this.currState == this.state.WAIT_FOR_VALID_CELL) {

        }
    }

    nextState() {
        let row,col,finalRow,finalCol
        switch (this.currState) {
            case this.state.GAME_START:
                this.getInitialBoard()
                this.piecesPlaced = 0
                this.CURR_PIECE_NUM = 1
                this.currState = this.state.WAIT_FOR_FREE_CELL
                break;
            case this.state.WAIT_FOR_FREE_CELL:
                if (this.piecesPlaced == this.NUM_PIECES)
                    this.currState = this.state.MOVING_PIECES
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
                row = this.moveFromValues[0]
                col = this.moveFromValues[1]
                this.currState = this.state.WAIT_FOR_VALID_CELL
                break;
            case this.state.WAIT_VALID_CELL:
                finalRow = this.moveToValues[0]
                finalCol = this.moveToValues[1]
                this.currState = this.state.MOVING_PIECES
                break;
            case this.state.MOVING_PIECES:
                if (this.END_OF_GAME) 
                    this.currState = this.state.GAME_END
                this.movePiece(row,col,finalRow,finalCol)
                this.currState = this.state.WAIT_FOR_PIECE
                console.log('move pieces')
                break;
            case this.state.GAME_END:
                console.log('end of game')
                break;
            default:
                break;
        }
    }

    setPieceCell(row, col) {
        if (this.piecesPlaced % 2) {
            // red pieces turn
            this.placePiece(row,col,'red')
            let compId = 'redPiece' + this.CURR_PIECE_NUM
            this.scene.graph.components[compId].updateState('nextState', [row, col])
            this.CURR_PIECE_NUM++
        }
        else {
            // black pieces turn
            this.placePiece(row,col,'black')
            let compId = 'blackPiece' + this.CURR_PIECE_NUM
            this.scene.graph.components[compId].updateState('nextState', [row, col])
        }
        this.piecesPlaced++
        this.currState = this.state.WAIT_FOR_FREE_CELL
        this.nextState()
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

    getValidMoves(row, col) {
        var game = this
        let request = this.parseRequestToStr('validMoves', [this.board, row, col])

        this.client.getPrologRequest(
            request,
            (data) => {
                console.log(data.target.response)
                game.possibleMoves = data.target.response
                game.nextState()
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
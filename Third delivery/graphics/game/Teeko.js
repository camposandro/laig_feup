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

        /** SCENERY */

        this.scene = scene
        this.defCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(25, 20, 2), vec3.fromValues(0, -1, 2));
        this.invCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-25, 20, 2), vec3.fromValues(0, -1, 2));

        /** LOGIC */

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
            GAME_END: 6,
            UNDO: 7,
            MOVIE: 8
        }
        this.currState = this.state.GAME_START

        this.END_OF_GAME = false

        this.nextState()
    };

    /** SCENERY */

    setCamera() {
        console.log(this.scene.camera)
        if (this.scene.cameraRotation) {
            this.scene.camera = this.invCamera
        } else {
            this.scene.camera = this.defCamera
        }
    }

    updateCamera() {
        if (this.scene.cameraRotation) {
            this.scene.cameraRotationAngle = Math.PI
            this.scene.activeRotation = true
        }
    }

    /** LOGIC */

    enqueue(arr, element) {
        arr.push(element)
    }

    dequeue(arr) {
        if (arr.length > 0) {
            return arr.splice(arr.length - 1)
        }
    }

    lastElement(arr) {
        if (arr.length > 0) {
            return arr[arr.length - 1]
        }
    }

    /*undoPlay() {
        if (this.currState != this.state.GAME_START && this.currState != this.state.MOVIE) {

            if (this.moveStack.length > 0) {
                console.log("Undoing play")

                let lastMove = this.dequeue(this.moveStack)



            }
        }
    }*/

    cellPickingHandler(cell) {
        let row = cell.row
        let col = cell.col

        switch (this.currState) {
            case this.state.WAIT_FOR_FREE_CELL:
                if (this.piecesPlaced == this.NUM_PIECES)
                    this.currState = this.state.WAIT_FOR_PIECE
                else
                    this.isFreeCell(row, col)
                break;

            case this.state.WAIT_FOR_VALID_CELL:
                this.isValidMove(row, col)
                break;

            default:
                break;
        }
    }

    piecePickingHandler(piece) {

        if (this.selectedPiece != null) {
            this.selectedPiece.updateState('On Board')
        }

        this.selectedPiece = piece

        let row = piece.xPosition
        let col = piece.zPosition

        switch (this.currState) {
            case this.state.WAIT_FOR_PIECE:
                this.isPlayerCell(row, col)
                break;

            case this.state.WAIT_FOR_VALID_CELL:
                this.isPlayerCell(row, col)
                break;

            default:
                break;
        }
    }

    nextState() {
        let row, col, finalRow, finalCol

        switch (this.currState) {
            case this.state.GAME_START:
                this.getInitialBoard()
                this.piecesPlaced = 0
                this.CURR_PIECE_NUM = 1
                this.currState = this.state.WAIT_FOR_FREE_CELL
                break;

            case this.state.WAIT_FOR_FREE_CELL:
                if (this.piecesPlaced == this.NUM_PIECES)
                    this.currState = this.state.WAIT_FOR_PIECE
                break;

            case this.state.PLACE_PIECES:
                row = this.placeValues[0]
                col = this.placeValues[1]
                this.setPieceCell(row, col)
                break;

            case this.state.MOVING_PIECES:
                console.log(this.moveFromValues)
                console.log(this.moveToValues)

                row = this.moveFromValues[0]
                col = this.moveFromValues[1]
                finalRow = this.moveToValues[0]
                finalCol = this.moveToValues[1]

                this.moveStack.push(new MyMove('', [row, col], [finalRow, finalCol]))
                this.movePiece(row,col,finalRow,finalCol)
                break;

            case this.state.GAME_END:
                console.log("END OF GAME!")
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

        this.updateCamera()
    }

    setPieceCell(row, col) {
        if (this.currPlayer == 'red') {
            let compId = 'redPiece' + this.CURR_PIECE_NUM
            this.scene.graph.components[compId].updateState('nextState', [row, col])
            this.CURR_PIECE_NUM++
        } else if (this.currPlayer == 'black') {
            let compId = 'blackPiece' + this.CURR_PIECE_NUM
            this.scene.graph.components[compId].updateState('nextState', [row, col])
        }

        this.piecesPlaced++
        this.placePiece(row, col, this.currPlayer)
    }

    isValidMove(finalRow, finalCol) {
        let move = [finalRow, finalCol]

        if (this.possibleMoves.includes(move)) {
            this.moveToValues = [finalRow, finalCol]
            this.currState = this.state.MOVING_PIECES
            this.nextState()
        } else {
            this.moveToValues = undefined
        }
    }

    updatePieceCell(row, col) {
        this.selectedPiece.updateState('nextState', [row, col])
    }

    getInitialBoard() {
        var game = this
        let request = this.parseRequestToStr('initialBoard')

        this.client.getPrologRequest(
            request,
            (data) => {
                game.boardStack.push(data.target.response)
                game.nextState()
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    checkWin() {
        var game = this
        let request = this.parseRequestToStr('checkWin', [this.lastElement(this.boardStack)])

        this.client.getPrologRequest(
            request,
            (data) => {
                let win = data.target.response

                if (win != 0) {
                    if (win == 'black')
                        console.log("BLACK PIECES WON!")
                    else if (win == 'red')
                        console.log("RED PIECES WON!")

                    game.currState = game.state.GAME_END
                    game.nextState()
                }
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    isFreeCell(row, col) {
        var game = this
        let request = this.parseRequestToStr('freeCell', [this.lastElement(this.boardStack), row, col])

        this.client.getPrologRequest(
            request,
            (data) => {
                let freeCell = data.target.response

                if (freeCell == 1) {
                    game.placeValues = [row, col]
                    game.currState = game.state.PLACE_PIECES
                }
                else {
                    game.placeValues = undefined
                }

                game.nextState()
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    isPlayerCell(row, col) {
        var game = this
        let request = this.parseRequestToStr('playerCell', [this.lastElement(this.boardStack), row, col, this.currPlayer])

        this.client.getPrologRequest(
            request,
            (data) => {
                let playerCell = data.target.response

                if (playerCell == 1) {
                    game.moveFromValues = [row, col]
                    game.updatePieceCell()
                    game.getValidMoves(row, col)
                }
                else {
                    // game.moveFromValues = undefined
                }
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    getValidMoves(row, col) {
        var game = this
        let request = this.parseRequestToStr('validMoves', [this.lastElement(this.boardStack), row, col])

        this.client.getPrologRequest(
            request,
            (data) => {
                game.possibleMoves = data.target.response
                game.currState = this.state.WAIT_FOR_VALID_CELL
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    placePiece(row, col, piece) {
        var game = this
        console.log(this.boardStack)
        let request = this.parseRequestToStr('placePiece', [this.lastElement(this.boardStack), row, col, piece])

        this.client.getPrologRequest(request,
            (data) => {
                game.boardStack.push(data.target.response)

                game.currState = this.state.WAIT_FOR_FREE_CELL
                game.updatePlayerTurn()
                game.checkWin()

                game.nextState()
            },
            () => {
                console.log("# No received answer!\n")
            }
        );
    }

    movePiece(row, col, finalRow, finalCol) {
        var game = this
        let request = this.parseRequestToStr('movePiece', [this.lastElement(this.boardStack), row, col, finalRow, finalCol])

        this.client.getPrologRequest(request,
            (data) => {
                game.boardStack.push(data.target.response)
                //game.moveStack.push(move)

                game.currState = this.state.WAIT_FOR_PIECE
                game.updatePieceCell(finalRow, finalCol)
                game.updatePlayerTurn()
                game.checkWin()

                game.nextState()
            },
            () => {
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
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
        this.defCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 10, 15), vec3.fromValues(0, 0, 0))
        this.rotCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(-21, 20, 2.5), vec3.fromValues(2, 0, 2.5))
        this.scene.camera = this.defCamera

        /** LOGIC */

        this.client = new Client()

        this.board = null

        this.moveId = 1

        this.blackPlayer = new MyPlayer('black', this)
        this.redPlayer = new MyPlayer('red', this)

        this.NUM_PIECES = 8

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
    };

    startGame() {
        this.currPlayer = this.blackPlayer
        this.currPlayer.startTimer()
        this.playerTime = this.currPlayer.time

        this.piecesPlaced = 0
        this.CURR_BLACK_NUM = 1
        this.CURR_RED_NUM = 1

        if (this.currState != this.state.MOVIE)
            this.nextState()
    }

    undo() {
        let prevState = this.currState
        this.currState = this.state.UNDO

        if (this.currState != this.state.GAME_START && this.currState != this.state.MOVIE) {

            let moveStack = this.currPlayer.moveStack

            if (moveStack.length > 0) {

                // retrieve last move and corresponding piece
                let lastMove = null
                while (moveStack.length > 0) {
                    let move = this.dequeue(moveStack)
                    if (move.type == 'move') {
                        lastMove = move
                        break
                    }
                }

                if (lastMove != null) {
                    let piece = this.getBoardPiece(lastMove.finalCell)

                    // if initial cell of the last move is free
                    if (this.getBoardPiece(lastMove.initCell) == null) {
                        // pick piece
                        piece.updateState('Picked')
                        // update latest board
                        this.movePiece('undo', lastMove.finalCell, lastMove.initCell)
                    }
                }
            } 
        }

        this.currState = prevState
    }

    movie() {
        let prevState = this.currState
        this.currState = this.state.MOVIE

        // restore initial board
        this.board = this.initBoard

        // retrieve all moves, sorted by asc order
        let moves = this.getSortedMoves()

        if (this.currState != this.state.GAME_START && this.currState != this.state.UNDO) {

            this.startGame()

            let index = 0
            while (index < moves.length) {
                let currMove = moves[index]

                let initCell = currMove.initCell
                let finalCell = currMove.finalCell

                console.log(currMove)

                switch(currMove.type) {
                    case 'place':
                        this.setPieceCell(initCell)
                        break;
                    case 'move':
                        this.movePiece('move', initCell, finalCell)
                        break;
                    case 'undo':
                        this.movePiece('undo', initCell, finalCell)
                        break;
                    default:
                        break;
                }

                index++
            }
        }

        this.currState = prevState
    }

    getSortedMoves() {
        let result = [...this.blackPlayer.moveStack, ...this.redPlayer.moveStack]
        return result.sort((move1,move2) => move1.id - move2.id)
    }

    quitGame() {
        /* TODO: dar reset à board e à maq. estados enquanto se metem peças nas caixas */
    }

    /** SCENERY */

    setCamera() {
        if (this.scene.cameraRotation) {
            this.rotCamera.setPosition(this.currPlayer.position)
            this.rotCamera.setTarget(this.currPlayer.target)
            this.rotCamera.zoom(10)
            this.scene.camera = this.rotCamera
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

    /** TURNS & TIMERS */

    updateTurn() {
        if (this.currPlayer == this.blackPlayer) {
            this.blackPlayer.stopTimer()
            this.currPlayer = this.redPlayer
        }
        else if (this.currPlayer == this.redPlayer) {
            this.redPlayer.stopTimer()
            this.currPlayer = this.blackPlayer
        }
        this.currPlayer.startTimer()

        this.updateCamera()
    }

    clearTimers() {
        this.blackPlayer.stopTimer()
        this.redPlayer.stopTimer()
        this.currPlayer.time = '-'
    }

    /** LOGIC */

    cellPickingHandler(cell) {
        let cellVal = [cell.row, cell.col]

        switch (this.currState) {
            case this.state.WAIT_FOR_FREE_CELL:
                if (this.piecesPlaced == this.NUM_PIECES)
                    this.currState = this.state.WAIT_FOR_PIECE
                else
                    this.isFreeCell(cellVal)
                break;

            case this.state.WAIT_FOR_VALID_CELL:
                this.isValidMove(cellVal)
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

        let cellVal = [piece.xPosition, piece.zPosition]

        switch (this.currState) {
            case this.state.WAIT_FOR_PIECE:
                this.isPlayerCell(cellVal)
                break;

            case this.state.WAIT_FOR_VALID_CELL:
                this.isPlayerCell(cellVal)
                break;

            default:
                break;
        }
    }

    nextState() {
        let initCell, finalCell

        switch (this.currState) {
            case this.state.GAME_START:
                this.getInitialBoard()
                break;

            case this.state.WAIT_FOR_FREE_CELL:
                if (this.piecesPlaced == this.NUM_PIECES)
                    this.currState = this.state.WAIT_FOR_PIECE
                break;

            case this.state.PLACE_PIECES:
                initCell = [this.placeValues[0], this.placeValues[1]]
                this.setPieceCell(initCell)
                break;

            case this.state.MOVING_PIECES:
                initCell = [this.moveFromValues[0], this.moveFromValues[1]]
                finalCell = [this.moveToValues[0], this.moveToValues[1]]
                this.movePiece('move', initCell, finalCell)
                break;

            case this.state.GAME_END:
                if (this.winner == 'black') {
                    this.blackPlayer.updateScore()
                    console.log("BLACK PLAYER WON!")
                }
                else if (this.winner == 'red') {
                    this.redPlayer.updateScore()
                    console.log("RED PLAYER WON!")
                }
                this.clearTimers()
                break;

            default:
                break;
        }
    }

    getBoardPiece(cell) {
        let row = cell[0], col = cell[1]

        let components = this.scene.graph.components

        for (let key in components) {
            let component = components[key]
            if (component instanceof MyPieceComp
                && component.xPosition == row
                && component.zPosition == col)
                return component
        }

        return null
    }

    setPieceCell(cell) {
        if (this.currPlayer == this.redPlayer) {
            let compId = 'redPiece' + this.CURR_RED_NUM
            console.log(compId)
            this.scene.graph.components[compId].updateState('nextState', cell)
            this.CURR_RED_NUM++
        } else if (this.currPlayer == this.blackPlayer) {
            let compId = 'blackPiece' + this.CURR_BLACK_NUM
            console.log(compId)
            this.scene.graph.components[compId].updateState('nextState', cell)
            this.CURR_BLACK_NUM++
        }

        this.placePiece(cell, this.currPlayer.id)
        this.piecesPlaced++
    }

    updatePieceCell(piece, cell) {
        piece.updateState('nextState', cell)
    }

    isValidMove(finalCell) {
        if (this.possibleMoves.includes(finalCell)) {
            this.moveToValues = finalCell
            this.currState = this.state.MOVING_PIECES
            this.nextState()
        } else {
            this.moveToValues = undefined
        }
    }

    getInitialBoard() {
        var game = this
        let request = this.parseRequestToStr('initialBoard')

        this.client.getPrologRequest(
            request,
            (data) => {
                game.board = data.target.response
                game.initBoard = game.board

                game.currState = this.state.WAIT_FOR_FREE_CELL
                
                game.nextState()
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    checkWin() {
        var game = this
        let request = this.parseRequestToStr('checkWin', [this.board])

        this.client.getPrologRequest(
            request,
            (data) => {
                let win = data.target.response

                if (win != 0) {
                    game.winner = win
                    game.currState = game.state.GAME_END
                    game.nextState()
                }
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    isFreeCell(cell) {
        var game = this

        let row = cell[0], col = cell[1]

        let request = this.parseRequestToStr('freeCell', [this.board, row, col])

        this.client.getPrologRequest(
            request,
            (data) => {
                let freeCell = data.target.response

                if (freeCell == 1) {
                    game.placeValues = cell
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

    isPlayerCell(cell) {
        var game = this

        let row = cell[0], col = cell[1]
        let piece = this.getBoardPiece(cell)

        let request = this.parseRequestToStr('playerCell', [this.board, row, col, this.currPlayer.id])

        this.client.getPrologRequest(
            request,
            (data) => {
                let playerCell = data.target.response

                if (playerCell == 1) {
                    game.moveFromValues = cell
                    game.updatePieceCell(piece)
                    game.getValidMoves(cell)
                }
                else {
                    game.moveFromValues = undefined
                }
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    getValidMoves(cell) {
        var game = this

        let row = cell[0], col = cell[1]

        let request = this.parseRequestToStr('validMoves', [this.board, row, col])

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

    placePiece(cell, piece) {
        var game = this

        let row = cell[0], col = cell[1]

        let request = this.parseRequestToStr('placePiece', [this.board, row, col, piece])

        this.client.getPrologRequest(request,
            (data) => {
                game.board = data.target.response
                game.currPlayer.moveStack.push(new MyMove(game.moveId++,'place',cell,null))

                game.currState = this.state.WAIT_FOR_FREE_CELL

                let someonePlacedAll = game.CURR_BLACK_NUM == 5 || game.CURR_RED_NUM == 5
                let allPlaced = game.CURR_BLACK_NUM == 5 && game.CURR_RED_NUM == 5
                let advantage = (game.CURR_BLACK_NUM == 5 && game.CURR_RED_NUM < 5) || (game.CURR_RED_NUM == 5 && game.CURR_BLACK_NUM < 5)

                let firstToReachAll = false
                if (advantage && game.firstToReachAll == undefined) {
                    game.firstToReachAll = true
                    firstToReachAll = true
                }

                if (!(someonePlacedAll && !allPlaced) || firstToReachAll)
                    game.updateTurn()

                game.checkWin()

                game.nextState()
            },
            () => {
                console.log("# No received answer!\n")
            }
        );
    }

    movePiece(type, initCell, finalCell) {
        var game = this

        let row = initCell[0], col = initCell[1]
        let finalRow = finalCell[0], finalCol = finalCell[1]
        let piece = this.getBoardPiece(initCell)

        let request = this.parseRequestToStr('movePiece', [this.board, row, col, finalRow, finalCol])

        this.client.getPrologRequest(request,
            (data) => {
                game.board = data.target.response
                game.currPlayer.moveStack.push(new MyMove(game.moveId++, type, initCell, finalCell))

                game.currState = this.state.WAIT_FOR_PIECE
                game.updatePieceCell(piece, finalCell)
                game.updateTurn()
                game.checkWin()

                game.nextState()
            },
            () => {
                console.log("# No received answer!\n")
            }
        );
    }

    /** UTILS */

    enqueue(arr, element) {
        arr.push(element)
    }

    dequeue(arr) {
        if (arr.length > 0) {
            return arr.splice(arr.length - 1)[0]
        }
    }

    lastElement(arr) {
        if (arr.length > 0) {
            return arr[arr.length - 1]
        }
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
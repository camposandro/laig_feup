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
        this.defCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(25, 25, 25), vec3.fromValues(0, 0, 0))
        this.rotCamera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(16, 22, 2.5), vec3.fromValues(2, 0, 2.5))
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
            WAIT_FOR_VALID_CELL: 3,
            MOVING_PIECES: 4,
            UNDO: 5,
            MOVIE: 6,
            GAME_END: 7,
            NO_FUNC: 8
        }
        this.currState = this.state.GAME_START
        this.funcState = this.state.NO_FUNC

        this.mode = {
            PLAYERvsPLAYER: 1,
            PLAYERvsBOT: 2,
            BOTvsBOT: 3
        }
        this.level = {
            RANDOM: 1,
            BEST_PLAY: 2
        }

        this.currMode = 'Player vs Player'
        this.currLevel = 'Random'

        this.END_OF_GAME = false
    };

    startGame() {
        if (this.currState == this.state.GAME_START) {
            this.parseParam()
            this.restartGame()
            this.nextState()
        }
    }

    quitGame() {
        if (this.funcState == this.state.NO_FUNC) {
            this.currState = this.state.GAME_END
                
            let pieces = this.getPieces()
            pieces.forEach((piece) => piece.resetAnimation())

            this.resetParam()
        }
    }

    parseParam() {
        switch (this.currMode) {
            case 'Player vs Player':
                this.currMode = this.mode.PLAYERvsPLAYER
                break;
            case 'Player vs Bot':
                this.currMode = this.mode.PLAYERvsBOT
                break;
            case 'Bot vs Bot':
                this.currMode = this.mode.BOTvsBOT
                break;
            default:
                console.log('Invalid game mode!\n')
                break;
        }

        switch (this.currLevel) {
            case 'Random':
                this.currLevel = this.level.RANDOM
                break;
            case 'Best-Play':
                this.currLevel = this.level.BEST_PLAY
                break;
            default:
                console.log('Invalid game level!\n')
                break;
        }
    }

    resetParam() {
        this.currMode = 'Player vs Player'
        this.currLevel = 'Random'
        this.currState = this.state.GAME_START
        this.funcState = this.state.NO_FUNC

        this.blackPlayer.stopTimer()
        this.redPlayer.stopTimer()
    }

    restartGame() {
        this.piecesPlaced = 0
        this.CURR_BLACK_NUM = 1
        this.CURR_RED_NUM = 1
        this.winner = undefined
        this.firstToReachAll = undefined
        this.selectedPiece = null

        this.blackPlayer.clearMoves()
        this.redPlayer.clearMoves()

        this.currPlayer = this.blackPlayer
        this.currPlayer.startTimer()
        this.playerTime = this.currPlayer.time
    }

    /** LOGIC */

    isHandlerActive() {
        return (this.currMode == this.mode.PLAYERvsPLAYER
            || (this.currMode == this.mode.PLAYERvsBOT && this.currPlayer == this.blackPlayer))
            && this.funcState == this.state.NO_FUNC
    }

    cellPickingHandler(cell) {
        let cellVal = [cell.row, cell.col]

        if (this.isHandlerActive()) {
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
    }

    piecePickingHandler(piece) {
        let cellVal = [piece.xPosition, piece.zPosition]

        if (this.isHandlerActive()) {
            if (this.selectedPiece != null) {
                this.selectedPiece.updateState('On Board')
            }
            this.selectedPiece = piece

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
    }

    isBotTurn() {
        return (this.currMode == this.mode.PLAYERvsBOT && this.currPlayer == this.redPlayer)
            || this.currMode == this.mode.BOTvsBOT;
    }

    nextState() {
        // clear any prior messages
        this.scene.clearInfo()

        let initCell, finalCell

        switch (this.currState) {
            case this.state.GAME_START:
                this.getInitialBoard()
                break;

            case this.state.WAIT_FOR_FREE_CELL:
                if (this.piecesPlaced == this.NUM_PIECES) {
                    if (this.currMode == this.mode.BOTvsBOT)
                        this.generateBotMove()
                    else {
                        if (this.isBotTurn())
                            this.generateBotMove()
                        else
                            this.currState = this.state.WAIT_FOR_PIECE
                    }
                } else {
                    if (this.isBotTurn()) {
                        if (this.CURR_RED_NUM < 5)
                            this.generateBotCell()
                        else
                            this.generateBotMove()
                    }
                }
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

            case this.state.GENERATE_BOT_MOVE:
                if (this.isBotTurn())
                    this.generateBotMove()
                break;

            case this.state.GAME_END:
                if (this.winner == 'black')
                    this.blackPlayer.updateScore()
                else if (this.winner == 'red')
                    this.redPlayer.updateScore()

                this.clearPanel()
                break;

            default:
                break;
        }
    }

    getPieces() {
        let pieces = new Array()

        let components = this.scene.graph.components
        for (let key in components) {
            let component = components[key]
            if (component instanceof MyPiece)
                pieces.push(component)
        }

        return pieces
    }

    getBoardPiece(cell) {
        let row = cell[0], col = cell[1]

        let components = this.scene.graph.components

        for (let key in components) {
            let component = components[key]
            if (component instanceof MyPiece
                && component.xPosition == row
                && component.zPosition == col)
                return component
        }

        return null
    }

    setPieceCell(cell) {
        if (this.currPlayer == this.redPlayer) {
            let compId = 'redPiece' + this.CURR_RED_NUM
            this.scene.graph.components[compId].updateState('nextState', cell)
            this.CURR_RED_NUM++
            this.currPlayer.addMove(new MyMove(this.moveId++, 'place', cell, null, compId, this.currPlayer.id))
        } else if (this.currPlayer == this.blackPlayer) {
            let compId = 'blackPiece' + this.CURR_BLACK_NUM
            this.scene.graph.components[compId].updateState('nextState', cell)
            this.CURR_BLACK_NUM++
            this.currPlayer.addMove(new MyMove(this.moveId++, 'place', cell, null, compId, this.currPlayer.id))
        }

        this.placePiece(cell, this.currPlayer.id)
        this.piecesPlaced++
    }

    updatePieceCell(piece, cell) {
        piece.updateState('nextState', cell)
        this.scene.graph.clearHighlightedCells();
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

    /** OTHER FUNCTIONALITIES */

    undo() {
        if (this.currState != this.state.GAME_START) {

            this.funcState = this.state.UNDO

            let lastMove = this.currPlayer.getLastMove()

            if (lastMove != null) {
                let piece = this.getBoardPiece(lastMove.finalCell)
                // if initial cell of the last move is free
                if (this.getBoardPiece(lastMove.initCell) == null) {
                    // pick piece
                    piece.updateState('Picked')
                    // update latest board
                    this.movePiece('undo', lastMove.finalCell, lastMove.initCell)
                } else {
                    this.scene.info = 'Unable to undo: last cell is occupied!'
                }
            } else {
                this.scene.info = 'Unable to undo: no moves available!'
            }

            this.funcState = this.state.NO_FUNC
        }
    }

    movie() {
        if (this.currState != this.state.GAME_START) {

            // restore initial board
            this.board = this.initBoard

            // quit current game
            this.quitGame()

            this.funcState = this.state.MOVIE

            // retrieve all moves, sorted by asc order
            let moves = this.getSortedMoves()

            // start new game
            this.restartGame()
            this.nextState()

            let playTime = 2000 // 1sec per play displayed
            let numPlay = 1

            // perform movie moves
            let lastMove = moves[0]
            for (let i = 1; i <= moves.length; i++) {
                
                setTimeout(function () {
                    this.moviePlay(lastMove)
                    if (i < moves.length) {
                        let move = moves[i]
                        if (lastMove.player != move.player)
                            this.updateTurn()
                        lastMove = move
                    }
                }.bind(this), 
                playTime * numPlay)

                numPlay++
            }

            setTimeout(function () {
                this.funcState = this.state.NO_FUNC
                this.currState = this.state.GAME_END
                this.nextState()
            }.bind(this),
            playTime * moves.length)
        }
    }

    moviePlay(move) {
        let piece = this.scene.graph.components[move.piece]

        switch (move.type) {
            case 'place':
                piece.setOnBoard()
                piece.setOnCell(move.initCell)
                break;
            case 'move':
                piece.pickAnimation(0)
                piece.moveAnimation(move.finalCell)
                break;
            case 'undo':
                piece.pickAnimation(0)
                piece.moveAnimation(move.finalCell)
                break;
            default:
                console.log('Undefined movie play!')
                break;
        }
    }

    getSortedMoves() {
        let result = [...this.blackPlayer.moveStack, ...this.redPlayer.moveStack]
        return result.sort((move1, move2) => move1.id - move2.id)
    }

    /** SCENERY */

    setCamera() {
        if (this.scene.cameraRotation) {
            this.rotCamera.setPosition(this.currPlayer.position)
            this.rotCamera.setTarget(this.currPlayer.target)
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

    /** PANEL - TURNS & TIMERS */

    updateTurn() {
        if (this.funcState != this.state.MOVIE && this.selectedPiece != null) {
            this.selectedPiece.updateState('On Board')
            this.scene.graph.clearHighlightedCells()
        }

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

    clearPanel() {
        this.blackPlayer.stopTimer()
        this.redPlayer.stopTimer()
        this.currPlayer = undefined
    }

    /** PROLOG REQUESTS */

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

    generateBotCell() {
        var game = this

        let request = this.parseRequestToStr('generateBotCell', [this.board])

        this.client.getPrologRequest(
            request,
            (data) => {
                game.placeValues = game.parseToArray(data.target.response)

                game.currState = game.state.PLACE_PIECES
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
                let possMoves = data.target.response
                this.highlightCells(possMoves);
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
                game.currPlayer.addMove(new MyMove(game.moveId++, type, initCell, finalCell, piece.id, game.currPlayer.id))

                game.updatePieceCell(piece, finalCell)
                game.updateTurn()
                game.checkWin()

                if (this.isBotTurn())
                    game.currState = game.state.GENERATE_BOT_MOVE
                else
                    game.currState = game.state.WAIT_FOR_PIECE

                game.nextState()
            },
            () => {
                console.log("# No received answer!\n")
            }
        );
    }

    generateBotMove() {
        var game = this

        let request = null
        if (this.currLevel == this.level.RANDOM)
            request = this.parseRequestToStr('generateBotMovement', [this.board, this.currPlayer.id])
        else if (this.currLevel == this.level.BEST_PLAY)
            request = this.parseRequestToStr('generateBotBestMovement', [this.board, this.currPlayer.id])

        this.client.getPrologRequest(
            request,
            (data) => {
                let move = game.parseToArray(data.target.response)

                if (game.winner == undefined) {
                    game.moveFromValues = [move[0], move[1]]
                    game.moveToValues = [move[2], move[3]]

                    let piece = this.getBoardPiece(game.moveFromValues)
                    game.updatePieceCell(piece, game.moveToValues)

                    game.currState = game.state.MOVING_PIECES
                    game.nextState()
                }
            },
            () => {
                console.log('# No received answer!\n')
            }
        )
    }

    /** UTILS */

    enqueue(arr, element) {
        arr.push(element)
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

    parseToArray(str) {
        str = str.replace(/[^A-Za-z0-9]+/gi, '')
        return str.split('')
    }

    highlightCells(cells) {
        if(this.possibleMoves != null){
            let possMoves = this.parseToArray(this.possibleMoves);
            for(let i = 0; i < possMoves.length; i++) {
                this.scene.graph.components['cell' + possMoves[i] + possMoves[++i]].setHighlighted(false);
            }
        }
        this.possibleMoves = cells;
        cells = this.parseToArray(this.possibleMoves);
        let highCells = new Array();
        for(let i = 0; i < cells.length - 1; i++) {
            var cell = 'cell' + cells[i] + cells[++i]
            this.scene.graph.components[cell].setHighlighted(true);
            highCells.push(cell);
        }

        this.scene.graph.addHighlightedCells(highCells);
    }
    
}
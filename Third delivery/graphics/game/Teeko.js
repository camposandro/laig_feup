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

        this.state = {
            GAME_START: 0,
            PLACE_PIECES: 1,
            GAME_END: 2
        }
        this.currState = this.state.GAME_START

        this.nextState()
    };

    pickingHandler(row,col) {
        if (this.currState == this.state.PLACE_PIECES) {
            this.selectedCell = [row,col]
            this.getValidMoves(row,col)
        }
    }

    nextState() {
        switch (this.currState) {
            case this.state.GAME_START:
                this.getInitialBoard()
                this.currState = this.state.PLACE_PIECES
                break;
            case this.state.PLACE_PIECES:
                this.scene.possibleMoves = this.possibleMoves // to highlight cells in the scene ?
                break;
            case this.state.GAME_END:
                console.log('End of game')
                break;
            default:
                break;
        }
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

    placePiece(row,col,piece) {
        var game = this
        let request = this.parseRequestToStr('placePiece', [game.board, row, col, piece])

        this.client.getPrologRequest(request,
            (data) => {
                console.log(game.board)
                //game.nextState()
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
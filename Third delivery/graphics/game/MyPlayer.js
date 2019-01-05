/**
 * MyPlayer, representing a player.
 * @constructor
 */
class MyPlayer {

    /**
     * @constructor
     * @param {id} id Player id (pieces colour)
     */
    constructor(id, game) {
        this.id = id
        this.game = game
        this.time = 10      // 10s per turn
        this.score = 0      // number of won games

        this.moveStack = new Array()
        this.undoPlays = 0

        this.setView()
    }

    setView() {
        if (this.id == 'black')
            this.position = [16, 22, 2.5]
        else if (this.id == 'red')
            this.position = [-12, 22, 2.5]

        this.target = [2, 0, 2.5]
    }

    startTimer() {
        var player = this

        this.resetTimer()
        this.timeout = setInterval(() => {
            player.time--
            player.updateTurnTime()
        },
        1000)
    }

    updateTurnTime() {
        if (this.time == 0) {
            this.game.scene.info = 'Turn\'s over!'
            this.game.updateTurn()
            if (this.game.isBotTurn())
                this.game.nextState()
        }
    }

    stopTimer() {
        clearInterval(this.timeout)
    }

    resetTimer() {
        this.time = 10
    }

    updateScore() {
        this.score++
    }

    addMove(move) {
        this.moveStack.push(move)
        this.currMoveIdx++
    }

    incUndoPlays() {
        let lastMove = this.moveStack[this.moveStack.length - 1]
        if (lastMove.type == 'undo')
            this.undoPlays++
        else
            this.undoPlays = 0
    }

    getLastMove() {
        let lastMove = null

        // update undo num of consecutive plays
        this.incUndoPlays()

        let moveIdx = this.moveStack.length - 1
        let undoIdx = this.undoPlays

        while (moveIdx > -1) {
            let move = this.moveStack[moveIdx]
            if (move.type == 'move') 
                undoIdx--
            if (undoIdx == -1) {
                lastMove = move
                break
            }
            moveIdx--
        }
        
        return lastMove
    }

    clearMoves() {
        this.moveStack = []
    }
}
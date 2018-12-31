/**
 * MyPlayer, representing a player.
 * @constructor
 */
class MyPlayer {

    /**
     * @constructor
     * @param {id} id Player id (pieces colour)
     */
    constructor(id,game) {
        this.id = id
        this.game = game
        this.time = 10      // 10s per turn
        this.score = 0      // number of won games

        this.moveStack = new Array()

        this.setView()
    }

    setView() {
        if (this.id == 'black')
            this.position = [16,22,2.5]
        else if (this.id == 'red')
            this.position = [-12,22,2.5]

        this.target = [2,0,2.5]
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
}
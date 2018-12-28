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
        this.time = 5       // 5s per turn
        this.score = 0      // number of won games

        this.setView()
    }

    setView() {
        if (this.id == 'black')
            this.position = [25,20,2.5]
        else if (this.id == 'red')
            this.position = [-21,20,2.5]

        this.target = [2,0,2.5]
    }

    startTimer() {
        this.resetTimer()
        this.timeout = setInterval(() => {
            this.time--
            this.updateTurnTime()
        },
        1000)
    }

    updateTurnTime() {
        if (this.time == 0)
            this.game.updateTurn()
    }

    stopTimer() {
        clearInterval(this.timeout)
    }

    resetTimer() {
        this.time = 5
    }

    updateScore() {
        this.score++
    }
}
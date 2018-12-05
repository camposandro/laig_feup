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
        this.boardStack = new Array();
        this.moveStack = new Array();
    };

    /** PROLOG server requests */
    getInitialBoard() {
        
    }

}
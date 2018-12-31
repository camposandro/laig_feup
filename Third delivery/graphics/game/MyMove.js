/**
 * MyMove, representing a player's move.
 * @constructor
 */
class MyMove {

    /**
     * @constructor
     * @param {type} type Move type of animation
     * @param {cell} initCell Move initial cell
     * @param {cell} finalCell Move final cell
     */
    constructor(id, type, initCell, finalCell) {
        this.id = id;
        this.type = type;
        this.initCell = initCell;
        this.finalCell = finalCell;
    };
}
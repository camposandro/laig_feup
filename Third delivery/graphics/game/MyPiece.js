/**
 * MyPiece, representing a game's piece.
 * @constructor
 */
class MyPiece {

    /**
     * @constructor
     * @param {id} id Piece id
     * @param {x} x Piece x-coordinate
     * @param {y} y Piece y-coordinate
     * @param {z} z Piece z-coordinate
     */
    constructor(id, x, y, z) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
    };
}
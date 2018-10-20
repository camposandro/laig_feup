/**
 * MyTransformation class, representing a transformation.
 */
class MyTransformation {

	/**
     * @constructor
     * @param {id} id Transformation id
     */
    constructor(id) {
        this.id = id;

        this.matrix = mat4.create();
        mat4.identity(this.matrix);
    }

    /**
     * Adds a translation to the current transformations matrix.
     * @param {MyTranslation} translation 
     */
    addTranslation(translation) {
        mat4.translate(this.matrix, this.matrix, translation.vec);
    }

    /**
     * Adds a rotation to the current transformations matrix.
     * @param {MyRotation} rotation 
     */
    addRotation(rotation) {
        mat4.rotate(this.matrix, this.matrix, rotation.angle, rotation.vec);
    }

    /**
     * Adds a scaling to the current transformations matrix.
     * @param {MyScaling} scaling 
     */
    addScale(scaling) {
        mat4.scale(this.matrix, this.matrix, scaling.vec);
    }
}

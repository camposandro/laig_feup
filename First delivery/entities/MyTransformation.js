/**
 * MyTransformation class, representing a transformation.
 */
class MyTransformation {

	/**
     * @constructor
     * @param {id}
     */
    constructor(id) {
        this.id = id;

        this.matrix = mat4.create();
        mat4.identity(this.matrix);
    }

    addTranslation(translation) {
        mat4.translate(this.matrix, this.matrix, translation.vec);
    }

    addRotation(rotation) {
        mat4.rotate(this.matrix, this.matrix, rotation.angle, rotation.vec);
    }

    addScale(scaling) {
        mat4.scale(this.matrix, this.matrix, scaling.vec);
    }
}

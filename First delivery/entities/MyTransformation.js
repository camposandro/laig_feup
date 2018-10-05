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

        this.transformationsMatrix = mat4.create();
        mat4.identity(this.transformationsMatrix);
    }
    addTranslation(transformation) {
        mat4.translate(this.transformationsMatrix, this.transformationsMatrix, transformation);
    }
    addRotation(transformation) {
        mat4.rotate(this.transformationsMatrix, this.transformationsMatrix, transformation.angle, transformation.vec);
    }
    addScale(transformation) {
        mat4.scale(this.transformationsMatrix, this.transformationsMatrix, transformation);
    }
}

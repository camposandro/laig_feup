/**
 * MyComponent class, representing a component.
 */
class MyComponent {

	/**
     * @constructor
     * @param {id}
     */
    constructor(id) {
        this.id = id;

        this.transformationsMatrix = mat4.create();
        mat4.identity(this.transformationsMatrix);

        this.materials = [];
        this.texture = [];
        this.children = [];

        this.currentMaterial = null;
    }

    addTransformation(transformation) {
        mat4.multiply(this.transformationsMatrix, this.transformationsMatrix, transformation.matrix);
    }

    addTranslation(translation) {
        mat4.translate(this.transformationsMatrix, this.transformationsMatrix, translation.vec);
    }

    addRotation(rotation) {
        mat4.rotate(this.transformationsMatrix, this.transformationsMatrix, rotation.angle, rotation.vec);
    }

    addScale(scaling) {
        mat4.scale(this.transformationsMatrix, this.transformationsMatrix, scaling.vec);
    }

    addMaterial(id) {
        this.materials.push(id);
        this.currentMaterial = id;
        //this.sortMaterials();
    }

    addTexture(id, length_s, length_t) {
        if (this.texture.length == 0)
            this.texture = [id, length_s, length_t];
    }

    addChild(child) {
        this.children.push(child);
    }

    sortMaterials() {
        /*if (this.materials.length == 1 && this.materials[0] == "inherit") {
            this.currentMaterial = this.materials[0];
        } else {
            var i = 0;
            while (i < this.materials.length) {
                this.currentMaterial = this.materials[i];
                if (this.currentMaterial == "default")
                    break;
                i++;
            }
        }*/
    }
}

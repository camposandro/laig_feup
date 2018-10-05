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

    addTransformations(transformations) {
        this.transformationsMatrix = transformationsMatrix * transformations;
    }

    addTranslation(transformation) {
        mat4.translate(transformationsMatrix, transformationsMatrix, transformation);
    }

    addRotation(transformation) {
        var vec = [];

        if (axis == 'x')
            vec = [1, 0, 0];
        if (axis == 'y')
            vec = [0, 1, 0];
        if (axis == 'z')
            vec = [0, 0, 1];

        mat4.rotate(transformationsMatrix, transformationsMatrix, transformation[0], vec);
    }

    addScale(transformation) {
        mat4.scale(transformationsMatrix, transformationsMatrix, transformation);
    }

    addMaterial(id) {
        this.materials.push(id);
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
        if (this.materials.length == 1 && this.materials[0] == "inherit") {
            this.currentMaterial = this.materials[0];
        } else {
            var i = 0;
            while (i < this.materials.length) {
                this.currentMaterial = this.materials[i];
                if (this.currentMaterial == "default")
                    break;
                i++;
            }
        }
    }
}

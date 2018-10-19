/**
 * MyComponent class, representing a component.
 */
class MyComponent {

	/**
     * @constructor
     * @param {id}
     */
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
        this.children = [];

        this.transformationsMatrix = mat4.create();
        mat4.identity(this.transformationsMatrix);

        this.materials = [];
        this.currentMaterialIndex = 0;
        this.texture = null;
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

    existsMaterial(id) {
        for (var i = 0; i < this.materials.length; i++) {
            if (this.materials[i][0] == id) {
                return true;
            }
        }
        return false;
    }

    addMaterial(id, material) {
        if (id == 'inherit' || (id == 'default' && !this.existsMaterial('inherit'))) {
            this.currentMaterialIndex = this.materials.length;
        }
        this.materials.push([id, material]);
    }

    updateMaterial() {
        if (this.materials.length != 0) {
            this.currentMaterialIndex++;
            this.currentMaterialIndex %= this.materials.length;
        }
    }

    addTexture(id, texture, length_s, length_t) {
        this.texture = new Array(id, texture, length_s, length_t);
    }

    addChild(child) {
        this.children.push(child);
    }

    /**
     * Display component
    */
    display(mat, tex) {
        this.scene.pushMatrix();

        // apply material
        if (!this.existsMaterial('inherit'))
            mat = this.materials[this.currentMaterialIndex][1];
        if (mat != null) 
            mat.apply();

        // apply texture
        if (this.texture[0] == 'inherit') {
            if (tex[1] != null) {
                tex[1].bind();
            }
        } else if (this.texture[0] == 'none') {
            if (tex[1] != null) {
                tex[1].unbind();
                tex[1] = null;
            }
        } else if (this.texture[1] != null) {
            this.texture[1].bind();
            tex = this.texture;
        }

        // apply transformations
        this.scene.multMatrix(this.transformationsMatrix);

        // process children nodes
        for (let child of this.children) {
            child.display(mat, tex);
        }

        this.scene.popMatrix();
    }
}

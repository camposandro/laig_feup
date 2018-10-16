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

        this.materials = new Map();
        this.currentMaterial = null;
        this.texture = [];
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

    addMaterial(id, material) {
        this.materials.set(id, material);
        this.currentMaterial = id;
    }

    addTexture(texture, length_s, length_t) {
        if (this.texture.length == 0) {
            this.texture = [texture, length_s, length_t];
        }
    }

    addChild(child) {
        this.children.push(child);
    }

    /**
     * Display component
    */
    display(mat, tex) {
        this.scene.pushMatrix();

        /* apply material
        if (this.currentMaterial != 'inherit') {
            var material = this.materials.get(this.currentMaterial);
            material.apply();
        }*/
 
        /*if (this.currentMaterial != 'inherit') {
            var material = this.materials.get(this.currentMaterial);
            material.apply();
        } else {
            mat.apply();
        }*/

        // apply texture
        if (this.texture.length != 0) {
            this.texture[0].bind();
        } else if (tex.length != 0) {
            tex[0].bind();
        }

        // apply transformations
        this.scene.multMatrix(this.transformationsMatrix);

        // process children nodes
        for (var i = 0; i < this.children.length; i++)
            this.children[i].display(this.currentMaterial, this.texture);

        this.scene.popMatrix();
    }
}

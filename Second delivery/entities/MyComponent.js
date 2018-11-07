/**
 * MyComponent class, representing a component.
 */
class MyComponent {

	/**
     * @constructor
     * @param {XMLscene} scene Scene
     * @param {id} id Component id
     */
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
        this.children = [];

        // Component's transformation matrix initialization
        this.transformationsMatrix = mat4.create();
        mat4.identity(this.transformationsMatrix);

        // Component characteristics
        this.materials = [];
        this.currentMaterialIndex = 0;
        this.texture = null;
        this.animations = [];
    }

    /**
     * Multiplies the transformation passed as a parameter to the current transformations matrix.
     * @param {MyTransformation} transformation 
     */
    addTransformation(transformation) {
        mat4.multiply(this.transformationsMatrix, this.transformationsMatrix, transformation.matrix);
    }

    /**
     * Adds a translation to the current transformations matrix.
     * @param {MyTranslation} translation 
     */
    addTranslation(translation) {
        mat4.translate(this.transformationsMatrix, this.transformationsMatrix, translation.vec);
    }

    /**
     * Adds a rotation to the current transformations matrix.
     * @param {MyRotation} rotation 
     */
    addRotation(rotation) {
        mat4.rotate(this.transformationsMatrix, this.transformationsMatrix, rotation.angle, rotation.vec);
    }

    /**
     * Adds a scaling to the current transformations matrix.
     * @param {MyScaling} scaling 
     */
    addScale(scaling) {
        mat4.scale(this.transformationsMatrix, this.transformationsMatrix, scaling.vec);
    }

    /**
     * Verifies the existence of the material of id passed as a parameter.
     * @param {id} id Id of the material to be searched
     */
    existsMaterial(id) {
        for (var i = 0; i < this.materials.length; i++) {
            if (this.materials[i][0] == id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a material to the component.
     * @param {id} id Id of the material to be added
     * @param {MyMaterial} material Material to be added
     */
    addMaterial(id, material) {
        if (id == 'inherit' || (id == 'default' && !this.existsMaterial('inherit'))) {
            this.currentMaterialIndex = this.materials.length;
        }
        this.materials.push([id, material]);
    }

    /**
     * Updates current material index.
     */
    updateMaterial() {
        if (this.materials.length != 0) {
            this.currentMaterialIndex++;
            this.currentMaterialIndex %= this.materials.length;
        }
    }

    addAnimation(id, animation) {
        animation.velocity();
        this.animations.push([id, animation]);
    }

    updateAnimation() {
        if(this.animations.length > 0){
            var d = new Date();
            var n = d.getTime();
            var position = this.animations[0][1].update(n / 1000);
            this.applyAnimation(position);
        }
    }
    applyAnimation(position) {
        mat4.translate(this.transformationsMatrix, this.transformationsMatrix, position);
    }
    /**
     * Adds a texture to the component.
     * @param {id} id Texture id
     * @param {MyTexture} texture Texture to be added
     * @param {ls} length_s Texture's horizontal dimension factor
     * @param {lt} length_t Texture's vertical dimension factor
     */
    addTexture(id, texture, length_s, length_t) {
        this.texture = new Array(id, texture, length_s, length_t);
    }

    /**
     * Adds a child component to the current component.
     * @param {MyComponent} child Child component
     */
    addChild(child) {
        this.children.push(child);
    }

    /**
     * Displays component.
     * @param {MyMaterial} mat Parent's material
     * @param {array} tex Array containing the texture and its parameters
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

        this.updateAnimation();

        // apply transformations
        this.scene.multMatrix(this.transformationsMatrix);

        // process children nodes
        for (let child of this.children)
            child.display(mat, tex);

        this.scene.popMatrix();
    }
}

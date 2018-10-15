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

        this.transformationsMatrix = mat4.create();
        mat4.identity(this.transformationsMatrix);

        this.materials = new Map();
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

    addMaterial(id, material) {
        this.materials.set(id,material);
        this.currentMaterial = id;
        //this.sortMaterials();
    }

    addTexture(texture, length_s, length_t) {
        if (this.texture.length == 0)
            this.texture = [texture, length_s, length_t];
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

    /**
     * Display component
     * @param {scene}
    */
    display() {
        this.scene.pushMatrix();
        if(this.currentMaterial != 'inherit'){
            var material = this.materials.get(this.currentMaterial);
            material.apply();
        }
/*
        if(this.texture[0] != 'none' && this.texture[0] != 'inherit' ) {
            
            console.log(this.texture[0]);
            this.texture[0].bind();
        }
           */
            this.scene.multMatrix(this.transformationsMatrix);
            for (var i = 0; i < this.children.length; i++)
                this.children[i].display();
        this.scene.popMatrix();
    }
}

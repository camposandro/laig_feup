/**
 * MyComponent class, representing a texture.
 */
class MyComponent extends MyEntity {

	/**
     * @constructor
     * @param {id,transformations,material,texture,components, primitive}
     */
    constructor(id) {
        super(id);
        this.transformationsMatrix = mat4.create();
        mat4.identity(this.transformationsMatrix);
        
        this.texture = [];
        this.children = [];
        this.material = [];
        this.components = [];
        this.primitive = [];
    }
    addTransformations(transformations){

        this.transformationsMatrix = transformationsMatrix * transformations ;

        //this.transformations.push(transformations);
    }
    addTranslation(transformation){
        mat4.translate(transformationsMatrix, transformationsMatrix, transformation);
    }
    addRotation(transformation){
        this.vec = [];
        if(axis == 'x')
            this.vec = [1,0,0];
        if(axis == 'y')
            this.vec = [0,1,0];
        if(axis == 'z')
            this.vec = [0,0,1];
        mat4.rotate(transformationsMatrix, transformationsMatrix, transformation[0], vec)
    }

    addScale(transformation){        
        mat4.scale(transformationsMatrix, transformationsMatrix, transformation)
    }

    addMaterials(material){
        this.material.push(material);
    }
    addTexture(texture, lenth_s, length_l){
        this.texture['id'] = texture.id;
        this.texture['link'] = texture.link;
        this.texture['lenth_s'] = lenth_s;
        this.texture['length_l'] = length_l;
    }
    addTexture(){
        this.texture['id'] = "inherit";
    }
    addNullTexture(){
        this.texture['id'] = "none";
    }
    addComponent(component){
        this.component.push(component);
    }
    addPrimitive(primitive){
        this.primitive.push(primitive);
    }
}

/**
 * MyComponent class, representing a texture.
 */
class MyComponent extends MyEntity {

	/**
     * @constructor
     * @param {id,transformations,material,texture,children}
     */
    constructor(id) {
        super(id);
        this.transformations = [];
        this.children = [];
    }
    addTransformations(transformations){
        this.transformations.push(transformations);
    }
    addTransformation(transformation){
        this.transformation.push(transformation.transformations);
    }
    addMaterials(material){
        this.material = material;
    }
    addTexture(texture){
        this.texture = texture;
    }
    addChildren(children){
        this.children.push(children);
    }
}
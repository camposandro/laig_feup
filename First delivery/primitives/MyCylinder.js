var DEGREE_TO_RAD = Math.PI / 180;

/**
 * MyCylinder class, representing a cylinder.
 */
class MyCylinder extends CGFobject {

	/**
     * @constructor
     * @param {scene,id,base,top,height,slices,stacks}
     */
    constructor(scene, id, base, top, height, slices, stacks) 
	{
        super(scene);
        
        this.id = id;
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.circle = new MyCircle(scene, slices);

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = new Array();
	    this.indices = new Array();
	    this.normals = new Array();
	    this.texCoords = new Array();

		var angle = (2 * Math.PI) / this.slices;
        
        // TODO: change radius of base and top
		for (var j = 0; j <= this.stacks; j++) {
			for (var i = 0; i <= this.slices; i++) {

				this.vertices.push(
					Math.cos(i*angle), Math.sin(i*angle), j / this.stacks
				);

				this.normals.push(
					Math.cos(i*angle), Math.sin(i*angle), 0
				);

				this.texCoords.push(
					i * 1 / this.slices, j * 1 / this.stacks
				);
			}
		}
		
		for (var j = 0; j < this.stacks; j++) {
			for (var i = 0; i < this.slices; i++) {
				this.indices.push(
                    i + j * (this.slices + 1), (i + 1) + j * (this.slices + 1), 
                    (i + this.slices + 1) + j * (this.slices + 1),
                    (i + 1) + j * (this.slices + 1),
                    (i + this.slices + 2) + j * (this.slices + 1),
                    (i + this.slices + 1) + j * (this.slices + 1)
				);
			}
		}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    /* CUIDADO: DÁ STACK OVERFLOW
    display()
    {
        this.scene.pushMatrix();
        this.scene.translate(0,0,this.height);
        this.circle.display();
        this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.translate(0,0,-this.height);
        this.scene.display();
        //CGFobject.prototype.display.call(this);
        this.scene.popMatrix();
        
    }*/
}

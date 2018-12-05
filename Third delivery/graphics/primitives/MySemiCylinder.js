/**
 * Degrees to radians factor conversion.
 */
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * MyCylinder2 class, representing a cylinder made of nurbs.
 */
class MySemiCylinder extends CGFobject {

    /**
    * @constructor
    * @param {XMLScene} scene Scene
    * @param {*} id Cylinder id
    * @param {base} base Base radius
    * @param {top} top Top radius
    * @param {height} height Cylinder height
    * @param {slices} slices Cylinder number of slices
    * @param {stacks} stacks Cylinder number of stacks
    */
    constructor(scene, id, base, top, height, slices, stacks) {
        super(scene);

        this.scene = scene;
        this.id = id;
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initNurbs();
    };

    /**
     * Initializes cylinder two-halves surfaces.
     */
    initNurbs() {
        var variation = (this.top - this.base) / this.stacks;
        var angle = Math.PI / this.slices;

        var controlVertexes = new Array();
        for (var i = 0; i <= this.stacks; i++) {

            var controlVertexesV = new Array();
            for (var j = 0; j <= this.slices; j++) {

                controlVertexesV.push(
                    [
                        Math.cos(j * angle) * (this.base + variation * i),
                        -Math.sin(j * angle) * (this.base + variation * i),
                        i * this.height / this.stacks,
                        1
                    ]
                );
            }
            controlVertexes.push(controlVertexesV);
            controlVertexes.reverse();
        }

        this.firstHalf = new MyPatch(
            this.scene,
            this.slices + 1,
            this.stacks + 1,
            this.slices,
            this.stacks,
            controlVertexes
        );


    };

    /**
     * Displays the cylinder without covers.
     */
    display() 
    {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.firstHalf.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0,this.height);
        this.scene.rotate(Math.PI,1,0,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        //this.secondHalf.display();
        this.scene.popMatrix();
    };
}

/**
 * Degrees to radians factor conversion.
 */
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * MyCylinder class, representing a cylinder.
 */
class MyCylinder2 extends CGFobject {

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

        this.initNurbs(scene);
    };

    /**
     * Initializes cylinder surfaces.
     */
    initNurbs(scene) {

        var angle = Math.PI / this.slices;

        var controlVertexes = new Array();
        for (var i = 0; i <= this.stacks; i++) {

            var controlVertexesV = new Array();
            for (var j = 0; j <= this.slices; j++) {

                controlVertexesV.push(
                    [
                        Math.cos(angle * j),
                        Math.sin(angle * j),
                        i * this.height / this.stacks,
                        1
                    ]
                );
            }
            controlVertexes.push(controlVertexesV);
        }

        this.firstHalf = new MyPatch(
            scene,
            3,
            4,
            2,
            3,
            controlVertexes
        );

        controlVertexes = new Array();
        for (var i = 0; i <= this.stacks; i++) {

            var controlVertexesV = new Array();
            for (var j = 0; j <= this.slices; j++) {

                controlVertexesV.push(
                    [
                        Math.cos(angle * j),
                        Math.sin(angle * j),
                        i * this.height / this.stacks,
                        1
                    ]
                );
            }
            controlVertexes.push(controlVertexesV);
        }

        this.secondHalf = new MyPatch(
            scene,
            3,
            4,
            2,
            3,
            controlVertexes
        );
    };

    /**
     * Displays the cylinder without covers.
     */
    display() {
        this.scene.pushMatrix();
        this.firstHalf.display();
        this.secondHalf.display();
        this.scene.popMatrix();
    };
}
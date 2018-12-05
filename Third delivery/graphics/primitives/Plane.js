/**
 * Plane class, representing a plane surface made of nurbs.
 */
class Plane extends CGFobject {

	/**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {id} id Plane id
     * @param {uDiv} uDiv Number of plane divisions in the U direction
     * @param {vDiv} vDiv Number of plane divisions in the V direction
     */
    constructor(scene, id, uDiv, vDiv) {
        super(scene);

        this.scene = scene;
        this.id = id;
        this.uDiv = uDiv;
        this.vDiv = vDiv;

        this.initPlaneNurb();
    }

    /**
     * Initializes the plane nurb surface.
     */
    initPlaneNurb() {

        var controlVertexes = new Array();
        for (var i = 0; i <= this.uDiv; i++) {

            var controlVertexesV = new Array();
            for (var j = 0; j <= this.vDiv; j++)
                controlVertexesV.push(
                    [-0.5 + i / this.uDiv, 0.0, 0.5 - j / this.vDiv, 1],
                );

            controlVertexes.push(controlVertexesV);
        }

        this.makeSurface(
            this.uDiv, // degree on U
            this.vDiv, // degree on V
            controlVertexes // controlVertexes
        );
    }

    /**
     * Creates the plane's nurb surface and object.
     * @param {degree1} degree1 Degree of nurb surface in the U direction
     * @param {degree2} degree2 Degree of nurb surface in the V direction
     * @param {array} controlVertexes Array of control vertexes for the surface
     */
    makeSurface(degree1, degree2, controlVertexes) {
        var planeSurface = new CGFnurbsSurface(degree1, degree2, controlVertexes);
        this.planeObject = new CGFnurbsObject(this.scene, this.uDiv, this.vDiv, planeSurface);
    }

    /**
     * Displays the plane object.
     */
    display() {
        this.planeObject.display();
    }
}
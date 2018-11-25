/**
 * Plane class, representing a surface.
 */
class Plane extends CGFobject {

	/**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {id} id Plane id
     * @param {uDiv} uDiv Number of divisions in the U direction
     * @param {vDiv} vDiv Number of divisions in the V direction
     */
    constructor(scene, id, uDiv, vDiv) {
        super(scene);

        this.id = id;
        this.uDiv = uDiv;
        this.vDiv = vDiv;

        this.initPlaneNurb(scene);
    }

    initPlaneNurb(scene) {

        var controlVertexes = new Array();
        for (var i = 0; i <= this.uDiv; i++) {

            var controlVertexesV = new Array();
            for (var j = 0; j <= this.vDiv; j++)
                controlVertexesV.push(
                    [-0.5 + i / this.uDiv, 0.0, 0.5 - j / this.vDiv, 1],
                );

            controlVertexes.push(controlVertexesV);
        }

        this.makeSurface(scene,
            this.uDiv, // degree on U
            this.vDiv, // degree on V
            controlVertexes // controlVertexes
        );
    }

    makeSurface(scene, degree1, degree2, controlVertexes) {
        var planeSurface = new CGFnurbsSurface(degree1, degree2, controlVertexes);
        this.planeObject = new CGFnurbsObject(scene, this.uDiv, this.vDiv, planeSurface);
    }

    display() {
        this.planeObject.display();
    }
}
/**
 * MyPatch, representing a surface of any degree.
 */
class MyPatch {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     * @param {nPointsU} nPointsU Number of control points in the U direction
     * @param {nPointsV} nPointsV Number of control points in the V direction
     * @param {nPartsU} nPartsU Number of divisions in the U direction
     * @param {nPartsV} nPartsV Number of divisions in the V direction
     * @param {array} controlPoints Array of control points
     */
    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {

        this.scene = scene;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.controlPoints = controlPoints;

        this.initNurb(scene);
    }

    initNurb(scene) {
        var planeSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, this.controlPoints);
        this.planeObject = new CGFnurbsObject(scene, this.nPartsU, this.nPartsV, planeSurface);
    }

    display() {
        this.planeObject.display();
    }
}
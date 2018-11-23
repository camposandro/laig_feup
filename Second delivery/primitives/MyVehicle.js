/**
 * MyVehicle
 * @constructor
 */
class MyVehicle extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     */
    constructor(scene) {
        super(scene);
        this.initSurfaces();
    };

    initSurfaces(scene) {

        var surfaceId = 0;

        var backConeParam = new Array();
        backConeParam['base'] = 0;
        backConeParam['top'] = 1;
        backConeParam['height'] = 1;
        backConeParam['slices'] = 15;
        backConeParam['stacks'] = 15;

        var backBodyConeParam = new Array();
        backBodyConeParam['base'] = 1;
        backBodyConeParam['top'] = 2;
        backBodyConeParam['height'] = 2;
        backBodyConeParam['slices'] = 15;
        backBodyConeParam['stacks'] = 15;

        var bodyCylinderParam = new Array();
        bodyCylinderParam['base'] = 2;
        bodyCylinderParam['top'] = 2;
        bodyCylinderParam['height'] = 5;
        bodyCylinderParam['slices'] = 15;
        bodyCylinderParam['stacks'] = 15;

        var frontBodyConeParam = new Array();
        frontBodyConeParam['base'] = 2;
        frontBodyConeParam['top'] = 1;
        frontBodyConeParam['height'] = 2;
        frontBodyConeParam['slices'] = 15;
        frontBodyConeParam['stacks'] = 15;

        var frontConeParam = new Array();
        frontConeParam['base'] = 1;
        frontConeParam['top'] = 0;
        frontConeParam['height'] = 1;
        frontConeParam['slices'] = 15;
        frontConeParam['stacks'] = 15;

        var cabinPlaneParts = 5;

        this.backCone = new MyCylinder2(
            this.scene,
            surfaceId++,
            backConeParam['base'],
            backConeParam['top'],
            backConeParam['height'],
            backConeParam['slices'],
            backConeParam['stacks']
        );

        this.backBodyCone = new MyCylinder2(
            this.scene,
            surfaceId++,
            backBodyConeParam['base'],
            backBodyConeParam['top'],
            backBodyConeParam['height'],
            backBodyConeParam['slices'],
            backBodyConeParam['stacks']
        );

        this.bodyCylinder = new MyCylinder2(
            this.scene,
            surfaceId++,
            bodyCylinderParam['base'],
            bodyCylinderParam['top'],
            bodyCylinderParam['height'],
            bodyCylinderParam['slices'],
            bodyCylinderParam['stacks']
        );

        this.frontBodyCone = new MyCylinder2(
            this.scene,
            surfaceId++,
            frontBodyConeParam['base'],
            frontBodyConeParam['top'],
            frontBodyConeParam['height'],
            frontBodyConeParam['slices'],
            frontBodyConeParam['stacks']
        );

        this.frontCone = new MyCylinder2(
            this.scene,
            surfaceId++,
            frontConeParam['base'],
            frontConeParam['top'],
            frontConeParam['height'],
            frontConeParam['slices'],
            frontConeParam['stacks']
        );

        this.cabinPatch = new MyPlane(
            this.scene,
            surfaceId++,
            cabinPlaneParts,
            cabinPlaneParts
        );
    };

    display() {
        // zeppelin body
        this.scene.pushMatrix();
            this.backCone.display();
            this.scene.translate(0,0,1);
            this.backBodyCone.display();
            this.scene.translate(0,0,2);
            this.bodyCylinder.display();
            this.scene.translate(0,0,5);
            this.frontBodyCone.display();
            this.scene.translate(0,0,2);
            this.frontCone.display();
        this.scene.popMatrix();

        // zeppelin cabin
        this.scene.pushMatrix();

        this.scene.translate(0,-2.0,6.5);
        this.scene.scale(1,0.5,2);

        this.scene.pushMatrix();
            this.scene.translate(0,0.5,0);
            this.cabinPatch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,-0.5,0);
            this.scene.rotate(Math.PI,1,0,0);
            this.cabinPatch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,-0.5);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.cabinPatch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,0.5);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.cabinPatch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-0.5,0,0);
            this.scene.rotate(Math.PI/2,0,0,1);
            this.cabinPatch.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.5,0,0);
            this.scene.rotate(-Math.PI/2,0,0,1);
            this.cabinPatch.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    };
}
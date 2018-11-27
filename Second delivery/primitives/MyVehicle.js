/**
 * MyVehicle, representing a flying zeppelin.
 * @constructor
 */
class MyVehicle extends CGFobject {

    /**
     * @constructor
     * @param {XMLScene} scene Scene
     */
    constructor(scene) {
        super(scene);
        this.surfaceId = 0;
        this.initSurfaces();
        this.initTextures();
    };

    /**
     * Initializes the nurbs surfaces needed for the zeppelin.
     */
    initSurfaces() {
        this.backCone = new MyCylinder2(this.scene,this.surfaceId++,0,1,1,15,15);
        this.backBodyCone = new MyCylinder2(this.scene,this.surfaceId++,1,2,2,15,15);
        this.bodyCylinder = new MyCylinder2(this.scene,this.surfaceId++,2,2,5,15,15);
        this.frontBodyCone = new MyCylinder2(this.scene,this.surfaceId++,2,1,2,15,15);
        this.frontCone = new MyCylinder2(this.scene,this.surfaceId++,1,0,1,15,15);
        this.cabinPatch = new Plane(this.scene,this.surfaceId++,5,5);
      
    };

    /**
     * Initializes the textures needed for the zeppelin.
     */
    initTextures() {
        this.bodyTexture = this.scene.graph.textures['goodyearTexture'];
        this.cabinTexture = this.scene.graph.textures['windowsTexture'];
    };

    /**
     * Displays the zeppelin.
     */
    display() {

        this.scene.pushMatrix();
        this.scene.translate(-6.5,0,-2.5);
        // zeppelin body
        this.scene.pushMatrix();
            this.backCone.display();
            this.scene.translate(0,0,1);
            this.backBodyCone.display();
            this.scene.translate(0,0,2);

            if (this.bodyTexture != null)
                this.bodyTexture.bind(0);
            this.bodyCylinder.display();
            if (this.bodyTexture != null)
                this.bodyTexture.unbind();

            this.scene.translate(0,0,5);
            this.frontBodyCone.display();
            this.scene.translate(0,0,2);
            this.frontCone.display();
        this.scene.popMatrix();

        // zeppelin cabin
        this.scene.pushMatrix();

        this.scene.translate(0,-2.1,6.5);
        this.scene.scale(1,0.5,2);

        // top face
        this.scene.pushMatrix();
            this.scene.translate(0,0.5,0);
            this.cabinPatch.display();
        this.scene.popMatrix();

        // bottom face
        this.scene.pushMatrix();
            this.scene.translate(0,-0.5,0);
            this.scene.rotate(Math.PI,1,0,0);
            this.cabinPatch.display();
        this.scene.popMatrix();

        // back face
        this.scene.pushMatrix();
            this.scene.translate(0,0,-0.5);
            this.scene.rotate(-Math.PI/2,1,0,0);

            if (this.cabinTexture != null)
                this.cabinTexture.bind(0);
            this.cabinPatch.display();

        this.scene.popMatrix();

        // front face
        this.scene.pushMatrix();
            this.scene.translate(0,0,0.5);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.cabinPatch.display();
        this.scene.popMatrix();

        // right face
        this.scene.pushMatrix();
            this.scene.translate(-0.5,0,0);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.scene.rotate(Math.PI/2,0,0,1);
            this.cabinPatch.display();
        this.scene.popMatrix();

        // left face
        this.scene.pushMatrix();
            this.scene.translate(0.5,0,0);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.scene.rotate(-Math.PI/2,0,0,1);
            this.cabinPatch.display();

            if (this.cabinTexture != null)
                this.cabinTexture.unbind();

        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.popMatrix();
    };
}

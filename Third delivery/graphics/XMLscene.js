/**
 * Degrees to radians factor conversion.
 */
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {

    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = [];
        this.viewsValues = [];
        this.currentViewIndex = null;

        this.currBackground = 'Living Room'
        this.cameraRotation = false
        this.activeRotation = false
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.setPickEnabled(true);
    
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(20);

        this.initShaders();

        this.game = new Teeko(this);
    }
    
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {

        // lights index
        var i = 0;

        // reads the lights from the scene graph
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // only eight lights allowed by WebGL

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light.location[0], light.location[1], light.location[2], light.location[3]);
                this.lights[i].setAmbient(light.ambient[0], light.ambient[1], light.ambient[2], light.ambient[3]);
                this.lights[i].setDiffuse(light.diffuse[0], light.diffuse[1], light.diffuse[2], light.diffuse[3]);
                this.lights[i].setSpecular(light.specular[0], light.specular[1], light.specular[2], light.specular[3]);

                this.clearPickRegistration();
                this.lights[i].setVisible(true);
                this.clearPickRegistration();

                if (light instanceof MySpotlight) {
                    this.lights[i].setSpotCutOff(light.angle);
                    this.lights[i].setSpotExponent(light.exponent);

                    let directionX = light.target[0] - light.location[0];
                    let directionY = light.target[1] - light.location[1];
                    let directionZ = light.target[2] - light.location[2];
                    this.lights[i].setSpotDirection(directionX, directionY, directionZ);
                }

                this.lightValues[key] = light.enabled == 1 ? true : false;

                this.updateLights();

                i++;
            }
        }
    }

    /**
    * Initializes the terrain and water shaders.
    */
    initShaders() {
        this.shaders = [
            // highlighting cells shader
            new CGFshader(this.gl, "shaders/shader.vert", "shaders/shader.frag")
        ];
    }

    /**
    * Updates view camera at each display.
    */
    updateView() {
        this.camera = this.graph.views[this.currentViewIndex];
        this.interface.setActiveCamera(this.camera);
    }

    /**
    * Updates lights at each display.
    */
    updateLights() {

        // lights index
        var i = 0;

        // reads lights 'enabled' status
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.clearPickRegistration();
                    this.lights[i].setVisible(false);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }

                this.lights[i].update();

                i++;
            }
        }
    }

    update(currTime) {

        if (this.lastTime == null)
            this.lastTime = 0

        let deltaTime = (currTime - this.lastTime) / 1000
        
        this.lastTime = currTime

        if (this.activeRotation) {
            let currAng = Math.PI * deltaTime
            
            this.cameraRotationAngle -= currAng

            if (this.cameraRotationAngle < 0) {
                this.activeRotation = false
                this.game.setCamera()
                this.clearInfo()
            } else {
                this.camera.orbit(vec3.fromValues(0, 1, 0), currAng)
            }
        }
    }

    /**
     * Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop.
     */
    onGraphLoaded() {

        // set parsed default camera
        //this.updateView();

        // change axis reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axis_length);

        // change ambient and background details according to parsed graph
        this.setGlobalAmbientLight(this.graph.ambient['r'],
            this.graph.ambient['g'],
            this.graph.ambient['b'],
            this.graph.ambient['a']);

        this.gl.clearColor(this.graph.background['r'],
            this.graph.background['g'],
            this.graph.background['b'],
            this.graph.background['a']);

        this.initLights();

        // adds interface settings groups
        this.interface.addSettingsGroup(this.game)
        this.interface.addOptionsGroup()
        this.interface.addLightsGroup(this.lightValues);

        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN background, camera and axis setup

        this.logPicking();
        this.clearPickRegistration();

        // update teeko info panel
        this.updatePanel()

        // clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // draw axis
            //this.axis.display();

            // update lights
            this.updateLights();

            // displays the scene
            this.graph.displayScene();
        }
        else {
            // draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END background, camera and axis setup
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        //console.log("Picked object: " + obj + ", with pick id " + customId);

                        let cellExp = new RegExp('cell')
                        let pieceExp = new RegExp('Piece')

                        if (cellExp.test(obj)) {
                            let cell = this.graph.components[obj]
                            this.game.cellPickingHandler(cell)
                        }
                        else if (pieceExp.test(obj)) {
                            let piece = this.graph.components[obj]
                            this.game.piecePickingHandler(piece)
                        }
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    updatePanel() {

        let playerStr = '-', scoreStr = '-', timeStr = '-'
        if (this.game.currPlayer != undefined) {
            playerStr = this.game.currPlayer.id
            scoreStr = this.game.currPlayer.score
            timeStr = this.game.currPlayer.time
        }
        document.getElementById('player').innerText = 'Player: ' + playerStr+ '\n\n'
        document.getElementById('score').innerText = 'Score: ' + scoreStr + '\n\n'
        document.getElementById('time').innerText = 'Time: ' + timeStr + ' s\n\n'

        let winnerStr = '-'
        if (this.game.winner != undefined) 
            winnerStr = this.game.winner
        document.getElementById('winner').innerText = 'Winner: ' + winnerStr + '\n\n'

        if (this.info != undefined)
            document.getElementById('info').innerText = this.info + '\n\n'
        else
            this.clearInfo()
    }

    clearInfo() {
        this.info = undefined
        document.getElementById('info').innerText = '' + '\n\n'
    }
}

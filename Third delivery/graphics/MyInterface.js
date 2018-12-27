/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lightValues
     */
    addLightsGroup(lightValues) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in lightValues) {
            group.add(lightValues, key);
        }
    }

    addSettingsGroup(teeko) {
        
        var group = this.gui.addFolder('Settings')
        group.open()

        group.add(this.scene,'gameMode',['Player VS Player', 'Player VS Bot', 'Bot VS Bot']).name('Game mode')
        group.add(this.scene,'gameLevel',['Random','Best-play']).name('Game level')
        
        var controller = group.add(this.scene,'cameraRotation').name('Camera rotation')
        controller.onChange(() => teeko.setCamera())
    }

    addOptionsGroup() {
        
        var group = this.gui.addFolder('Options')
        group.open()

        group.add(this.scene,'startGame').name('Start game')
        group.add(this.scene,'undo').name('Undo')
        group.add(this.scene,'movie').name('Movie')
        group.add(this.scene,'quitGame').name('Quit game')
    }
}
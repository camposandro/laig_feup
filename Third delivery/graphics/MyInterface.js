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

        for (var key in lightValues) {
            group.add(lightValues, key);
        }
    }

    addSettingsGroup(teeko) {
        
        var group = this.gui.addFolder('Settings')
        group.open()

        group.add(this.scene.game,'currMode',['Player vs Player', 'Player vs Bot', 'Bot vs Bot']).name('Game mode')
        group.add(this.scene.game,'currLevel',['Random','Best-Play']).name('Game level')
        group.add(this.scene,'currBackground',['Living Room','Space']).name('Background')
        
        var controller = group.add(this.scene,'cameraRotation').name('Camera rotation')
        controller.onChange(() => {
            if (teeko.currState != teeko.state.GAME_START)
                teeko.setCamera()
            else {
                this.scene.info = 'Press \'Start Game\' first!'
                this.scene['cameraRotation'] = false
            }
        })
    }

    addOptionsGroup() {
        
        var group = this.gui.addFolder('Options')
        group.open()

        group.add(this.scene.game,'startGame').name('Start game')
        group.add(this.scene.game,'undo').name('Undo')
        group.add(this.scene.game,'movie').name('Movie')
        group.add(this.scene.game,'quitGame').name('Quit game')
    }
}
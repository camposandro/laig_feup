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

    /**
     * Adds a folder containing the IDs of the views passed as parameter.
     * @param {array} viewsValues
     */
    addViewsGroup(viewsValues) {

        var group = this.gui.addFolder("Views");
        group.open();

        this.gui.add(this.scene, 'currentViewIndex', viewsValues).name("Selected view:");
    }

    /**
     * Processes keyboard events.
     * Triggers a material change on the scene when the 'm' key is pressed.
     * @param {event} event Keyboard event
     */
    processKeyboard(event) {
        CGFinterface.prototype.processKeyboard.call(this, event);
        switch (event.code) {
            case 'KeyM':
                this.scene.changeMaterials();
                break;
            default:
                break;
        }
    }
}

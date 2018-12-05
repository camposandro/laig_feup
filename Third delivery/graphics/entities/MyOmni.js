/**
 * MyOmni class, representing an omni light.
 */
class MyOmni extends MyLight {

    /**
     * @constructor
     * @param {XMLScene} scene Scene 
     * @param {id} id Light id
     * @param {enabled} enabled Enabled 0/1 value
     * @param {array} location Light position array
     * @param {array} ambient Ambient rgba array
     * @param {array} diffuse Diffuse rgba array
     * @param {array} specular Specular rgba array
     */
    constructor(scene, id, enabled, location, ambient, diffuse, specular) {
        super(scene, id, enabled, location, ambient, diffuse, specular);
    }
}
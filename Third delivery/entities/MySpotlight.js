/**
 * MySpotlight class, representing a spotlight.
 */
class MySpotlight extends MyLight {

	/**
     * @constructor
     * @param {XMLScene} scene Scene 
     * @param {id} id Light id
     * @param {enabled} enabled Enabled 0/1 value
     * @param {array} location Light position array
     * @param {array} ambient Ambient rgba array
     * @param {array} diffuse Diffuse rgba array
     * @param {array} specular Specular rgba array
     * @param {angle} angle Spotlight angle
     * @param {exponent} exponent Spotlight exponent factor
     * @param {array} target Spotlight target position array
     */
    constructor(scene, id, enabled, location, ambient, diffuse, specular, angle, exponent, target) {
        super(scene, id, enabled, location, ambient, diffuse, specular);
        this.angle = angle;
        this.exponent = exponent;
        this.target = target;
    }
}
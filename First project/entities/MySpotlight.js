/**
 * MySpotlight class, representing a spotlight.
 */
class MySpotlight extends MyLight {

	/**
     * @constructor
     * @param {id, enabled, angle, exponent, target, location, ambient, diffuse, specular} 
     */
    constructor(scene, id, enabled, location, ambient, diffuse, specular, angle, exponent, target) {
        super(scene, id, enabled, location, ambient, diffuse, specular);
        this.angle = angle;
        this.exponent = exponent;
        this.target = target;
    }
}
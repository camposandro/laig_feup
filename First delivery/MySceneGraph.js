var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var YAS_INDEX = 0;
var SCENE_INDEX = 1;
var VIEWS_INDEX = 2;
var AMBIENT_INDEX = 3;
var LIGHTS_INDEX = 4;
var TEXTURES_INDEX = 5;
var MATERIALS_INDEX = 6;
var TRANSFORMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = YAS_INDEX;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {

        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++)
            nodeNames.push(nodes[i].nodeName);

        var error, index;

        // Processes each node, verifying errors.

        // <scene>
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX - 1)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX - 1)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX - 1)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX - 1)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX - 1)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX - 1)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX - 1)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <materials> missing";
        else {
            if (index != PRIMITIVES_INDEX - 1)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX - 1)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode) {

        this.root = this.reader.getString(sceneNode, 'root');
        if (this.root == null)
            return "unable to parse root object";

        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (!(this.axis_length != null && !isNaN(this.axis_length)))
            return "unable to parse axis length";
        
        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        // TODO: Parse Views node

        this.default = this.reader.getString(viewsNode, 'default');
        if (this.default == null)
            return "unable to parse default view";

        var children = viewsNode.children;
        var grandChildren = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // get current id
            var id = this.reader.getString(children[i], 'id');
            if (id == null)
                return "no ID defined for perspective";

            // get current near value
            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near))) {
                this.onXMLMinorError("near value missing for perspective ID = " + id +
                    "; assuming near = 0.1");
                near = 0.1;
            }

            // get current far value
            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far))) {
                this.onXMLMinorError("near value missing for perspective ID = " + id +
                    "; assuming far = 500");
                far = 500;
            }

            grandChildren = children[i].children;

            // specific perspective parameters
            if (children[i].nodeName == "perspective") {

                // get angle
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "angle value missing for perspective ID = " + id;

                // check the existence of only 1 'from' and 'to' tags
                if (children[i].getElementsByTagName('from').length != 1)
                    return "no more than one <from> tag may be defined in a perspective";

                if (children[i].getElementsByTagName('to').length != 1)
                    return "no more than one <to> tag may be defined in a perspective";

                // get perspective
                var fromPos = [], toPos = [];

                for (var k = 0; k < grandChildren.length; k++) {

                    var x, y, z;

                    if (grandChildren[i].nodeName == "from") {

                        // x
                        x = this.reader.getFloat(grandChildren[i], 'x');
                        if (!(x != null && !isNaN(x)))
                            return "unable to parse x-coordinate of the perspective of ID = " + id;
                        else
                            fromPos.push(x);

                        // y
                        y = this.reader.getFloat(grandChildren[i], 'y');
                        if (!(y != null && !isNaN(y)))
                            return "unable to parse y-coordinate of the perspective of ID = " + id;
                        else
                            fromPos.push(y);

                        // z
                        z = this.reader.getFloat(grandChildren[i], 'z');
                        if (!(z != null && !isNaN(z)))
                            return "unable to parse z-coordinate of the perspective of ID = " + id;
                        else
                            fromPos.push(z);

                    } else if (grandChildren[i].nodeName == "to") {

                        // x
                        x = this.reader.getFloat(grandChildren[i], 'x');
                        if (!(x != null && !isNaN(x)))
                            return "unable to parse x-coordinate of the perspective of ID = " + id;
                        else
                            toPos.push(x);

                        // y
                        y = this.reader.getFloat(grandChildren[i], 'y');
                        if (!(y != null && !isNaN(y)))
                            return "unable to parse y-coordinate of the perspective of ID = " + id;
                        else
                            toPos.push(y);

                        // z
                        z = this.reader.getFloat(grandChildren[i], 'z');
                        if (!(z != null && !isNaN(z)))
                            return "unable to parse z-coordinate of the perspective of ID = " + id;
                        else
                            toPos.push(z);

                    } else {
                        this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                        continue;
                    }
                }

                // add to perspective array
                this.perspective[id].push([near, far, angle, fromPos, toPos]);

                // specific ortho parameters
            } else if (children[i].nodeName == "ortho") {

                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "left value missing for ortho ID = " + id;

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "right value missing for ortho ID = " + id;

                var top = this.reader.getFloat(children[i], 'right');
                if (!(top != null && !isNaN(top)))
                    return "top value missing for ortho ID = " + id;

                var bottom = this.reader.getFloat(children[i], 'right');
                if (!(bottom != null && !isNaN(bottom)))
                    return "bottom value missing for ortho ID = " + id;

                // add to ortho array
                this.ortho[id].push(near, far, left, right, top, bottom);
            }
        }

        this.log("Parsed views");

        return null;
    }

    /**
      * Parses the <ambient> block.
      * @param {ambient block element} ambientNode
      */
    parseAmbient(ambientNode) {
        // TODO: Parse Ambient node

        var children = ambientNode.children;

        this.ambientValues = [];
        this.backgroundValues = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "ambient" && children[i].nodeName != "background") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var r, g, b, a;

            // Retrieves the ambient values.
            if (children[i].nodeName == "ambient") {

                // R
                r = this.reader.getFloat(children[i], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "no r defined for ambient";
                else
                    ambientValues.push(r);
                // G
                g = this.reader.getFloat(children[i], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "no g defined for ambient";
                else
                    ambientValues.push(g);
                // B
                b = this.reader.getFloat(children[i], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "no b defined for ambient";
                else
                    ambientValues.push(b);
                // A
                a = this.reader.getFloat(children[i], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "no a defined for ambient";
                else
                    ambientValues.push(a);

            } else if (children[i].nodeName == "background") {

                // R
                r = this.reader.getFloat(children[i], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "no r defined for ambient";
                else
                    backgroundValues.push(r);
                // G
                g = this.reader.getFloat(children[i], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "no g defined for ambient";
                else
                    backgroundValues.push(g);
                // B
                b = this.reader.getFloat(children[i], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "no b defined for ambient";
                else
                    backgroundValues.push(b);
                // A
                var a = this.reader.getFloat(children[i], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "no a defined for ambient";
                else
                    backgroundValues.push(a);
            }
        }

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;
        var grandChildren = [];

        this.lights = [];
        var numLights = 0;

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var id = this.reader.getString(children[i], 'id');
            if (id == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[id] != null)
                return "ID must be unique for each light (conflict: ID = " + id + ")";

            // Light enable/disable
            var enabled = this.reader.getFloat(children[i], 'enabled');
            if (!(enabled != null && !isNaN(enabled))) {
                this.onXMLMinorError("enabled value missing for ID = " + id +
                    "; assuming 'enabled = true'");
            } else {
                if (enabled != 0 && enabled != 1) {
                    this.onXMLMinorError("unable to parse enable component of the" +
                        "'enable light' field for ID = " + id + "; assuming 'value = true'");
                    enabled = 1;
                }
            }

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            // Gets common indices of each element.
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the light position.
            var locationLight = [];
            if (locationIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light location for ID = " + id;
                else
                    locationLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light location for ID = " + id;
                else
                    locationLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light location for ID = " + id;
                else
                    locationLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light location for ID = " + id;
                else
                    locationLight.push(w);
            }
            else
                return "light location undefined for ID = " + id;

            
            var r, g, b, a;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + id;

            // Retrieves the diffuse component.
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(r);

                // G
                g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(g);

                // B
                b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(b);

                // A
                a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + id;

            // TODO: Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + id;
                else
                    specularIllumination.push(r);

                // G
                g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + id;
                else
                    specularIllumination.push(g);

                // B
                b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + id;
                else
                    specularIllumination.push(b);

                // A
                a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + id;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + id;

            // get target if it is a spot
            if (children[i].nodeName == "spot") {

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the target position.
                var targetPos = [];

                if (targetIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the light location for ID = " + id;
                    else
                        targetPos.push(x);

                    // y
                    var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the target location for ID = " + id;
                    else
                        targetPos.push(y);

                    // z
                    var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the target location for ID = " + id;
                    else
                        targetPos.push(z);
                }

                this.spotlights.push([id, enabled, angle, exponent, location, target, ambient, diffuse, specular]);

            } else
                this.omni.push([id, enabled, location, ambient, diffuse, specular]);

            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <transformations> node.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        /* Initial transforms.
        this.initialTranslate = [];
        this.initialScaling = [];
        this.initialRotations = [];
    
        // Gets indices of each element.
        var translationIndex = nodeNames.indexOf("translation");
        var thirdRotationIndex = nodeNames.indexOf("rotation");
        var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
        var firstRotationIndex = nodeNames.lastIndexOf("rotation");
        var scalingIndex = nodeNames.indexOf("scale");
    
        // Checks if the indices are valid and in the expected order.
        // Translation.
        this.initialTransforms = mat4.create();
        mat4.identity(this.initialTransforms);
    
        if (translationIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
        else {
            var tx = this.reader.getFloat(children[translationIndex], 'x');
            var ty = this.reader.getFloat(children[translationIndex], 'y');
            var tz = this.reader.getFloat(children[translationIndex], 'z');
    
            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }
    
            //TODO: Save translation data
        }
    
        // TODO: Parse block
        this.log("Parsed transformations");
        return null;*/
    }

    /**
     * Parses the <primitives> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        // TODO: Parse block
        this.log("Parsed primitives");
        return null;

    }

    /**
     * Parses the <components> node.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse block
        this.log("Parsed components");
        return null;

    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}

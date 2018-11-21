/**
 * Degrees to radians factor conversion.
 */
var DEGREE_TO_RAD = Math.PI / 180;

/**
 * Order of the groups in the XML document.
 */
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {

    /**
     * @constructor
     * @param {XML scene file} filename 
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        // Axis
        this.axisCoords = new Array();
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // Initial transformations matrix
        this.initialMatrix = mat4.create();
        mat4.identity(this.initialMatrix);

        // Arrays of element scenes
        this.views = new Array();
        this.lights = new Array();
        this.textures = new Array();
        this.materials = new Array();
        this.transformations = new Array();
        this.animations = new Array();
        this.primitives = new Array();
        this.components = new Array();

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
     * Callback to be executed after successful reading.
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

        // verifies if xml is in YAS format
        if (rootElement.nodeName != "yas")
            return "[parseXMLFile]: root tag <yas> missing";

        // reads the names of the nodes to an auxiliary buffer
        var nodeNames = new Array();
        var nodes = rootElement.children;
        for (let node of nodes)
            nodeNames.push(node.nodeName);

        // processes each node, verifying errors
        var error, index;

        // <scene>
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "[parseXMLFile]: tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <scene> out of order");

            // parse scene block
            if ((error = this.parseScene(nodes[index])) != null) return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "[parseXMLFile]: tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <views> out of order");

            // parse views block
            if ((error = this.parseViews(nodes[index])) != null) return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "[parseXMLFile]: tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <ambient> out of order");

            // parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null) return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "[parseXMLFile]: tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <lights> out of order");

            // parse lights block
            if ((error = this.parseLights(nodes[index])) != null) return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "[parseXMLFile]: tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <textures> out of order");

            // parse textures block
            if ((error = this.parseTextures(nodes[index])) != null) return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "[parseXMLFile]: tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <materials> out of order");

            // parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null) return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "[parseXMLFile]: tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <transformations> out of order");

            // parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null) return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "[parseXMLFile]: tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <animations> out of order");

            // parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null) return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "[parseXMLFile]: tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <primitives> out of order");

            // parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null) return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "[parseXMLFile]: tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("[parseXMLFile]: tag <components> out of order");

            // parse components block
            if ((error = this.parseComponents(nodes[index])) != null) return error;
        }
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // parse root component 'id'
        this.root = this.reader.getString(sceneNode, 'root');
        if (this.root == null)
            return "[parseScene]: unable to parse root object";

        // parse 'axis length'
        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (!(this.axis_length != null && !isNaN(this.axis_length)))
            return "[parseScene]: unable to parse axis axis_length";

        this.log("Parsed scene!");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {

        // parse default view 'id'
        var def = this.reader.getString(viewsNode, 'default');
        if (def == null)
            return "[parseViews]: unable to parse default view";

        var children = viewsNode.children;
        for (let child of children) {
            if (child.nodeName != "perspective" && child.nodeName != "ortho") {
                this.onXMLMinorError("[parseViews]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse view 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parseViews]: no ID defined for perspective";

            // checks for repeated view ids
            if (this.views[id] != null)
                return "[parseViews]: ID must be unique for each view (conflict: ID = " + id + ")";

            // parse 'near' value
            var near = this.reader.getFloat(child, 'near');
            if (!(near != null && !isNaN(near))) {
                this.onXMLMinorError("[parseViews]: near value missing for perspective ID = "
                    + id + "; assuming near = 0.1");
                near = 0.1;
            }

            // parse 'far' value
            var far = this.reader.getFloat(child, 'far');
            if (!(far != null && !isNaN(far))) {
                this.onXMLMinorError("[parseViews]: near value missing for perspective ID = "
                    + id + "; assuming far = 500");
                far = 500;
            }

            if (child.getElementsByTagName('from').length != 1)
                return "[parseViews]: one <from> tag may be defined in a perspective";

            if (child.getElementsByTagName('to').length != 1)
                return "[parseViews]: one <to> tag may be defined in a perspective";

            var position, target;

            // get views 'from' and 'to' subtags
            var grandChildren = child.children;
            for (let grandChild of grandChildren) {

                var x, y, z;

                // parse view 'from' and 'to' positions
                var fromPos = new Array(), toPos = new Array();

                if (grandChild.nodeName == "from") {

                    x = this.reader.getFloat(grandChild, 'x');
                    if (!(x != null && !isNaN(x)))
                        return "[parseViews]: unable to parse x-coordinate of the perspective of ID = " + id;
                    else
                        fromPos.push(x);

                    y = this.reader.getFloat(grandChild, 'y');
                    if (!(y != null && !isNaN(y)))
                        return " [parseViews]:unable to parse y-coordinate of the perspective of ID = " + id;
                    else
                        fromPos.push(y);

                    z = this.reader.getFloat(grandChild, 'z');
                    if (!(z != null && !isNaN(z)))
                        return "[parseViews]: unable to parse z-coordinate of the perspective of ID = " + id;
                    else
                        fromPos.push(z);

                    position = vec3.fromValues(fromPos[0], fromPos[1], fromPos[2]);

                } else if (grandChild.nodeName == "to") {

                    x = this.reader.getFloat(grandChild, 'x');
                    if (!(x != null && !isNaN(x)))
                        return "[parseViews]: unable to parse x-coordinate of the perspective of ID = " + id;
                    else
                        toPos.push(x);

                    y = this.reader.getFloat(grandChild, 'y');
                    if (!(y != null && !isNaN(y)))
                        return "[parseViews]: unable to parse y-coordinate of the perspective of ID = " + id;
                    else
                        toPos.push(y);

                    z = this.reader.getFloat(grandChild, 'z');
                    if (!(z != null && !isNaN(z)))
                        return "[parseViews]: unable to parse z-coordinate of the perspective of ID = " + id;
                    else
                        toPos.push(z);

                    target = vec3.fromValues(toPos[0], toPos[1], toPos[2]);

                } else {
                    this.onXMLMinorError("[parseViews]: unknown tag <" + grandChild.nodeName + ">");
                    continue;
                }
            }

            // parse specific view parameters
            switch (child.nodeName) {
                case 'perspective':
                    {
                        var angle = this.reader.getFloat(child, 'angle');
                        if (!(angle != null && !isNaN(angle)))
                            return "[parseViews]: angle value missing for perspective ID = " + id;
                        else
                            angle *= DEGREE_TO_RAD;

                        this.views[id] = new CGFcamera(angle, near, far, position, target);

                        break;
                    }
                case 'ortho':
                    {
                        var left = this.reader.getFloat(child, 'left');
                        if (!(left != null && !isNaN(left)))
                            return "[parseViews]: left value missing for ortho ID = " + id;

                        var right = this.reader.getFloat(child, 'right');
                        if (!(right != null && !isNaN(right)))
                            return "[parseViews]: right value missing for ortho ID = " + id;

                        var top = this.reader.getFloat(child, 'top');
                        if (!(top != null && !isNaN(top)))
                            return "[parseViews]: top value missing for ortho ID = " + id;

                        var bottom = this.reader.getFloat(child, 'bottom');
                        if (!(bottom != null && !isNaN(bottom)))
                            return "[parseViews]: bottom value missing for ortho ID = " + id;

                        var dx = target[0] - position[0];
                        var dz = target[2] - position[2];

                        var up = new Array();
                        if (!dx && !dz)
                            up = [1, 0, 0];
                        else
                            up = [0, 1, 0];

                        this.views[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, position, target, up);

                        break;
                    }
                default:
                    return "[parseViews]: Tag invalid: " + child.nodeName;
            }
        }

        // save default camera index to the scene
        this.scene.currentViewIndex = def;

        this.log("Parsed views!");

        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

        var children = ambientNode.children;
        for (let child of children) {
            if (child.nodeName != "ambient" && child.nodeName != "background") {
                this.onXMLMinorError("[parseAmbient]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse 'ambient' and 'background' rgba values
            var r = this.reader.getFloat(child, 'r');
            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                return "[parseAmbient]: no r defined for ambient";

            var g = this.reader.getFloat(child, 'g');
            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                return "[parseAmbient]: no g defined for ambient";

            var b = this.reader.getFloat(child, 'b');
            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                return "[parseAmbient]: no b defined for ambient";

            var a = this.reader.getFloat(child, 'a');
            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                return "[parseAmbient]: no a defined for ambient";

            switch (child.nodeName) {
                case 'ambient':
                    if (this.ambient == null)
                        this.ambient = new MyColor(r, g, b, a);
                    else
                        return "[parseAmbient]: multiple tags for ambient";
                    break;
                case 'background':
                    if (this.background == null)
                        this.background = new MyColor(r, g, b, a);
                    else
                        return "[parseAmbient]: multiple tags for background";
                    break;
                default:
                    return "[parseAmbient]: tag invalid: " + child.nodeName;
            }
        }

        this.log("Parsed ambient!");

        return null;
    }


    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        // total number of lights
        var numLights = 0;

        var children = lightsNode.children;
        for (let child of children) {
            if (child.nodeName != 'omni' && child.nodeName != 'spot') {
                this.onXMLMinorError("[parseLights]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse light 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parseLights]: no ID defined for light";

            // check for repeated light ids
            if (this.lights[id] != null)
                return "[parseLights]: ID must be unique for each light (conflict: ID = " + id + ")";

            // parse 'enabled' light state
            var enabled = this.reader.getFloat(child, 'enabled');
            if (!(enabled != null && !isNaN(enabled))) {
                this.onXMLMinorError("[parseLights]: enabled value missing for ID = " + id + "; assuming 'enabled = true'");
            } else if (enabled != 0 && enabled != 1) {
                this.onXMLMinorError("[parseLights]: unable to parse enable component of the 'enable light' field for ID = " + id + "; assuming 'value = true'");
                enabled = 1;
            }

            var nodeNames = new Array();
            var grandChildren = child.children;
            for (let grandChild of grandChildren)
                nodeNames.push(grandChild.nodeName);

            var locationIndex = nodeNames.indexOf("location");
            if (locationIndex == -1)
                return "[parseLights]: light location undefined for ID = " + id;

            var ambientIndex = nodeNames.indexOf("ambient");
            if (ambientIndex == -1)
                return "[parseLights]: light ambient undefined for ID = " + id;

            var diffuseIndex = nodeNames.indexOf("diffuse");
            if (diffuseIndex == -1)
                return "[parseLights]: light diffuse undefined for ID = " + id;

            var specularIndex = nodeNames.indexOf("specular");
            if (specularIndex == -1)
                return "[parseLights]: light specular undefined for ID = " + id;

            // common light characteristics
            var x, y, z, w, r, g, b, a;
            var location = new Array();
            var ambient = new Array();
            var diffuse = new Array();
            var specular = new Array();

            for (let grandChild of grandChildren) {
                switch (grandChild.nodeName) {
                    case 'location':
                        {
                            x = this.reader.getFloat(grandChild, 'x');
                            if (!(x != null && !isNaN(x)))
                                return "[parseLights]: unable to parse x-coordinate of the light location for ID = " + id;
                            else
                                location.push(x);

                            y = this.reader.getFloat(grandChild, 'y');
                            if (!(y != null && !isNaN(y)))
                                return "[parseLights]: unable to parse y-coordinate of the light location for ID = " + id;
                            else
                                location.push(y);

                            z = this.reader.getFloat(grandChild, 'z');
                            if (!(z != null && !isNaN(z)))
                                return "[parseLights]: unable to parse z-coordinate of the light location for ID = " + id;
                            else
                                location.push(z);

                            w = this.reader.getFloat(grandChild, 'w');
                            if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                                return "[parseLights]: unable to parse x-coordinate of the light location for ID = " + id;
                            else
                                location.push(w);
                        }
                        break;
                    case 'ambient': case 'diffuse': case 'specular':
                        {
                            r = this.reader.getFloat(grandChild, 'r');
                            if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                                return "[parseLights]: unable to parse R component of the " + grandChild.nodeName + " illumination for ID = " + id;

                            g = this.reader.getFloat(grandChild, 'g');
                            if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                                return "[parseLights]: unable to parse G component of the " + grandChild.nodeName + " illumination for ID = " + id;

                            b = this.reader.getFloat(grandChild, 'b');
                            if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                                return "[parseLights]: unable to parse B component of the " + grandChild.nodeName + " illumination for ID = " + id;

                            a = this.reader.getFloat(grandChild, 'a');
                            if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                                return "[parseLights]: unable to parse A component of the " + grandChild.nodeName + " illumination for ID = " + id;

                            switch (grandChild.nodeName) {
                                case 'ambient':
                                    ambient.push(r, g, b, a);
                                    break;
                                case 'diffuse':
                                    diffuse.push(r, g, b, a);
                                    break;
                                case 'specular':
                                    specular.push(r, g, b, a);
                                    break;
                            }
                        }
                        break;
                    default:
                        if (child.nodeName == 'omni' || (child.nodeName == 'spot' && grandChild.nodeName != 'target'))
                            return "[parseLights]: tag invalid: " + grandChild.nodeName;
                }
            }

            // parse light specific parameters
            if (child.nodeName == 'spot') {

                // parse light 'angle'
                var angle = this.reader.getFloat(child, 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "[parseLights]: unable to parse angle of the light for ID = " + id;

                // parse light 'exponent'
                var exponent = this.reader.getFloat(child, 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "[parseLights]: unable to parse exponent of the light for ID = " + id;

                // parse light 'target' position
                var target = new Array();
                var targetIndex = nodeNames.indexOf("target");

                if (targetIndex != -1) {
                    x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "[parseLights]: unable to parse x-coordinate of the light target for ID = " + id;
                    else
                        target.push(x);

                    y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "[parseLights]: unable to parse y-coordinate of the target target for ID = " + id;
                    else
                        target.push(y);

                    z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "[parseLights]: unable to parse z-coordinate of the target target for ID = " + id;
                    else
                        target.push(z);
                } else {
                    return "[parseLights]: tag <target> missing of the light ID = " + id;
                }

                this.lights[id] = new MySpotlight(this.scene, id, enabled, location, ambient, diffuse, specular, angle, exponent, target);
            }
            else if (child.nodeName == 'omni') {
                this.lights[id] = new MyOmni(this.scene, id, enabled, location, ambient, diffuse, specular);
            }

            numLights++;
        }

        if (numLights == 0)
            return "[parseLights]: at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("[parseLights]: too many lights defined - WebGL imposes a limit of 8 lights");

        this.log("Parsed lights!");

        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;
        for (let child of children) {
            if (child.nodeName != "texture") {
                this.onXMLMinorError("[parseTextures]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse texture 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parseTextures]: no ID defined for texture";

            // checks for repeated texture ids
            if (this.textures[id] != null)
                return "[parseTextures]: ID must be unique for each texture (conflict: ID = " + id + ")";

            // reads texture 'file' path
            var file = this.reader.getString(child, 'file');
            if (file == null)
                return "[parseTextures]: no file defined for texture";

            this.textures[id] = new MyTexture(this.scene, id, file);
        }

        console.log("Parsed textures!");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var children = materialsNode.children;
        for (let child of children) {
            if (child.nodeName != "material") {
                this.onXMLMinorError("[parseMaterials]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse material 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parseMaterials]: no ID defined for transformation";

            // check for repeated material ids
            if (this.materials[id] != null)
                return "[parseMaterials]: ID must be unique for each material (conflict: ID = " + id + ")";

            // parse material 'shininess'
            var shininess = this.reader.getString(child, 'shininess');
            if (!(shininess != null) && !isNaN(shininess))
                return "[parseMaterials]: no shininess defined for transformation";

            // parse material characteristics
            var r, g, b, a;
            var emission = new Array();
            var ambient = new Array();
            var diffuse = new Array();
            var specular = new Array();

            var grandChildren = child.children;
            for (let grandChild of grandChildren) {

                r = this.reader.getFloat(grandChild, 'r');
                if (r == null || isNaN(r))
                    return "[parseMaterials]: no r defined for " + grandChild.nodeName;

                g = this.reader.getFloat(grandChild, 'g');
                if (g == null || isNaN(g))
                    return "[parseMaterials]: no g defined for " + grandChild.nodeName;

                b = this.reader.getFloat(grandChild, 'b');
                if (b == null || isNaN(b))
                    return "[parseMaterials]: no b defined for " + grandChild.nodeName;

                a = this.reader.getFloat(grandChild, 'a');
                if (a == null || isNaN(a))
                    return "[parseMaterials]: no b defined for " + grandChild.nodeName;

                switch (grandChild.nodeName) {
                    case 'emission':
                        emission = [r, g, b];
                        break;
                    case 'ambient':
                        ambient = [r, g, b];
                        break;
                    case 'diffuse':
                        diffuse = [r, g, b];
                        break;
                    case 'specular':
                        specular = [r, g, b];
                        break;
                    default:
                        return "[parseMaterials]: Invalid: " + grandChild.nodeName;
                }
            }

            this.materials[id] = new MyMaterial(this.scene, id, shininess, emission, ambient, diffuse, specular);
        }

        this.log("Parsed materials!");

        return null;
    }

    /**
    * Parses the <transformations> node.
    * @param {transformations block element} transformationsNode
    */
    parseTransformations(transformationsNode) {

        var children = transformationsNode.children;
        for (let child of children) {
            if (child.nodeName != "transformation") {
                this.onXMLMinorError("[parseTransformations]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse transformation 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parseTransformations]: no ID defined for transformation";

            // check for repeated transformation ids
            if (this.transformations[id] != null)
                return "[parseTransformations]: ID must be unique for each transformation (conflict: ID = " + id + ")";

            var trf = new MyTransformation(id);

            // parse transformation factors
            var x, y, z;

            var grandChildren = child.children;
            for (let grandChild of grandChildren) {
                switch (grandChild.nodeName) {
                    case 'translate':
                        x = this.reader.getFloat(grandChild, 'x');
                        if (x == null || isNaN(x))
                            return "[parseTransformations]: no x defined for translate";

                        y = this.reader.getFloat(grandChild, 'y');
                        if (y == null || isNaN(y))
                            return "[parseTransformations]: no y defined for translate";

                        z = this.reader.getFloat(grandChild, 'z');
                        if (z == null || isNaN(z))
                            return "[parseTransformations]: no z defined for translate";

                        trf.addTranslation(new MyTranslation(x, y, z));
                        break;
                    case 'scale':
                        x = this.reader.getFloat(grandChild, 'x');
                        if (x == null || isNaN(x))
                            return "[parseTransformations]: no x defined for scale";

                        y = this.reader.getFloat(grandChild, 'y');
                        if (y == null || isNaN(y))
                            return "[parseTransformations]: no y defined for scale";

                        z = this.reader.getFloat(grandChild, 'z');
                        if (z == null || isNaN(z))
                            return "[parseTransformations]: no z defined for scale";

                        trf.addScale(new MyScaling(x, y, z));
                        break;
                    case 'rotate':
                        var axis = this.reader.getString(grandChild, 'axis');
                        if (axis == null)
                            return "[parseTransformations]: no axis defined for rotate";

                        var angle = this.reader.getFloat(grandChild, 'angle');
                        if (angle == null || isNaN(angle))
                            return "[parseTransformations]: no angle defined for rotate";

                        trf.addRotation(new MyRotation(axis, angle * DEGREE_TO_RAD));
                        break;
                    default:
                        return "[parseTransformations]: invalid: " + grandChild.nodeName;
                }
            }

            this.transformations[id] = trf;
        }

        this.log("Parsed transformations!");

        return null;
    }

    /**
         * Parses the <animations> node.
         * @param {animations block element} animationsNode
         */
    parseAnimations(animationsNode) {

        var animation;
        var children = animationsNode.children;
        for (let child of children) {
            if (child.nodeName != "linear" && child.nodeName != "circular") {
                this.onXMLMinorError("[parseMaterials]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse animation 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parseAnimations]: no ID defined for animations";

            // check for repeated animation ids
            if (this.animations[id] != null)
                return "[parseAnimations]: ID must be unique for each animation (conflict: ID = " + id + ")";

            // parse animation 'span'
            var span = this.reader.getFloat(child, 'span');
            if (span == null)
                return "[parseAnimations]: no span defined for transformation";


            switch (child.nodeName) {
                case 'linear':
                    animation = new MyLinearAnimation(id, span);

                    // parse animation control points
                    var x, y, z;

                    var grandChildren = child.children;
                    for (let grandChild of grandChildren) {
                        x = this.reader.getFloat(grandChild, 'xx');
                        if (x == null || isNaN(x))
                            return "[parseAnimations]: no x defined for " + grandChild.nodeName;

                        y = this.reader.getFloat(grandChild, 'yy');
                        if (y == null || isNaN(y))
                            return "[parseAnimations]: no y defined for " + grandChild.nodeName;

                        z = this.reader.getFloat(grandChild, 'zz');
                        if (z == null || isNaN(z))
                            return "[parseAnimations]: no z defined for " + grandChild.nodeName;

                        animation.addControlPoint(x, y, z);
                    }
                    this.animations[id] = animation;
                    break;

                case 'circular':
                    // parse animation 'center'
                    var center = this.reader.getString(child, 'center');
                    if (center == null)
                        return "[parseAnimations]: no center defined for " + grandChild.nodeName;

                    // parse animation 'radius'
                    var radius = this.reader.getFloat(child, 'radius');
                    if (radius == null)
                        return "[parseAnimations]: no radius defined for " + grandChild.nodeName;

                    // parse animation 'startang'
                    var startang = this.reader.getFloat(child, 'startang');
                    if (startang == null)
                        return "[parseAnimations]: no startang defined for " + grandChild.nodeName;

                    // parse animation 'rotang'
                    var rotang = this.reader.getFloat(child, 'rotang');
                    if (rotang == null)
                        return "[parseAnimations]: no rotang defined for " + grandChild.nodeName;

                    this.animations[id] = new MyCircularAnimation(id, span, center, radius, startang * DEGREE_TO_RAD, rotang * DEGREE_TO_RAD);        
                    break;

                default:
                    return "[parseAnimations]: invalid " + child.nodeName;
            }
        }

        this.log("Parsed animations!");

        return null;
    }

    /**
     * Parses the <primitives> node.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;
        for (let child of children) {
            if (child.nodeName != "primitive") {
                this.onXMLMinorError("[parsePrimitives]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse primitive 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parsePrimitives]: no ID defined for primitive";

            // checks for repeated primitive ids
            if (this.primitives[id] != null)
                return "[parsePrimitives]: ID must be unique for each primitive (conflict: ID = " + id + ")";

            // parse specific primitive parameters
            var x, y, z, x2, y2, z2, x3, y3, z3;
            var base, top, height, radius, slices, stacks, inner, outer, loops;
            var npartsU, npartsV, npointsU, npointsV;
            var idtexture, idheightmap, parts, heightscale, idwavemap, texscale;

            var grandChildren = child.children;
            for (let grandChild of grandChildren) {
                switch (grandChild.nodeName) {

                    case 'plane':
                        npartsU = this.reader.getFloat(grandChild, 'npartsU');
                        if (npartsU == null || isNaN(npartsU))
                            return "[parsePrimitives]: no npartsU defined for plane";

                        npartsV = this.reader.getFloat(grandChild, 'npartsV');
                        if (npartsV == null || isNaN(npartsV))
                            return "[parsePrimitives]: no npartsV defined for plane";

                        this.primitives[id] = new MyPlane(this.scene, npartsU, npartsV);
                        break;

                    case 'patch':
                        npointsU = this.reader.getFloat(grandChild, 'npointsU');
                        if (npointsU == null || isNaN(npointsU))
                            return "[parsePrimitives]: no npointsU defined for patch";

                        npointsV = this.reader.getFloat(grandChild, 'npointsV');
                        if (npointsV == null || isNaN(npointsV))
                            return "[parsePrimitives]: no npointsV defined for npointsV";

                        npartsU = this.reader.getFloat(grandChild, 'npartsU');
                        if (npartsU == null || isNaN(npartsU))
                            return "[parsePrimitives]: no npartsU defined for plane";

                        npartsV = this.reader.getFloat(grandChild, 'npartsV');
                        if (npartsV == null || isNaN(npartsV))
                            return "[parsePrimitives]: no npartsV defined for plane";
                        
                        var grandGrandChildren = grandChild.children;
                        if (grandGrandChildren.length != (npointsU * npointsV)) 
                            return "[parsePrimitives]: controlPoints != (nPointsU * nPoints V)!";

                        var cPoints = new Array();
                        for (var i = 0; i < npointsU; i++) {

                            var uControlVertices = new Array();
                            for (var j = i * npointsU; j < npointsV * (i + 1); j++) {
                                
                                x = this.reader.getFloat(grandGrandChildren[j], 'xx');
                                if (x == null || isNaN(x))
                                    return "[parsePrimitives]: no xx defined for patch's control point";
    
                                y = this.reader.getFloat(grandGrandChildren[j], 'yy');
                                if (y == null || isNaN(y))
                                    return "[parsePrimitives]: no yy defined for patch's control point";
    
                                z = this.reader.getFloat(grandGrandChildren[j], 'zz');
                                if (z == null || isNaN(z))
                                    return "[parsePrimitives]: no zz defined for patch's control point";
    
                                uControlVertices.push([x, y, z, 1]);
                            }

                            cPoints.push(uControlVertices);
                        }

                        this.primitives[id] = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, cPoints);
                        break;

                    case 'vehicle':
                        break;

                    case 'cylinder2':
                        base = this.reader.getFloat(grandChild, 'base');
                        if (base == null || isNaN(base))
                            return "[parsePrimitives]: no base defined for cylinder2";

                        top = this.reader.getFloat(grandChild, 'top');
                        if (top == null || isNaN(top))
                            return "[parsePrimitives]: no top defined for cylinder2";

                        height = this.reader.getFloat(grandChild, 'height');
                        if (height == null || isNaN(height))
                            return "[parsePrimitives]: no height defined for cylinder2";

                        slices = this.reader.getFloat(grandChild, 'slices');
                        if (slices == null || isNaN(slices))
                            return "[parsePrimitives]: no slices defined for cylinder2";

                        stacks = this.reader.getFloat(grandChild, 'stacks');
                        if (stacks == null || isNaN(stacks))
                            return "[parsePrimitives]: no stacks defined for cylinder2";

                        this.primitives[id] = new MyCylinder2(this.scene, id, base, top, height, slices, stacks);
                        break;

                    case 'terrain':
                        idtexture = this.reader.getFloat(grandChild, 'idtexture');
                        if (idtexture == null)
                            return "[parsePrimitives]: no idtexture defined for terrain";

                        idheightmap = this.reader.getFloat(grandChild, 'idheightmap');
                        if (idheightmap == null)
                            return "[parsePrimitives]: no idheightmap defined for terrain";

                        parts = this.reader.getFloat(grandChild, 'parts');
                        if (parts == null || isNaN(parts))
                            return "[parsePrimitives]: no parts defined for terrain";

                        heightscale = this.reader.getFloat(heightscale, 'heightscale');
                        if (heightscale == null || isNaN(heightscale))
                            return "[parsePrimitives]: no heightscale defined for terrain";

                        this.primitives[id] = new MyTerrain(idtexture, idheightmap, parts, heightscale);
                        break;

                    case 'water':
                        idtexture = this.reader.getFloat(grandChild, 'idtexture');
                        if (idtexture == null)
                            return "[parsePrimitives]: no idtexture defined for water";

                        idwavemap = this.reader.getFloat(grandChild, 'idwavemap');
                        if (idwavemap == null)
                            return "[parsePrimitives]: no idwavemap defined for water";

                        parts = this.reader.getFloat(grandChild, 'parts');
                        if (parts == null || isNaN(parts))
                            return "[parsePrimitives]: no parts defined for water";

                        heightscale = this.reader.getFloat(grandChild, 'heightscale');
                        if (heightscale == null || isNaN(heightscale))
                            return "[parsePrimitives]: no heightscale defined for water";

                        texscale = this.reader.getFloat(grandChild, 'texscale');
                        if (texscale == null || isNaN(texscale))
                            return "[parsePrimitives]: no texscale defined for water";

                        this.primitives[id] = new MyWater(idtexture, idwavemap, parts, heightscale, texscale);
                        break;

                    case 'rectangle':
                        x = this.reader.getFloat(grandChild, 'x1');
                        if (x == null || isNaN(x))
                            return "[parsePrimitives]: no x defined for rectangle";

                        y = this.reader.getFloat(grandChild, 'y1');
                        if (y == null || isNaN(y))
                            return "[parsePrimitives]: no y defined for rectangle";

                        x2 = this.reader.getFloat(grandChild, 'x2');
                        if (x2 == null || isNaN(x2))
                            return "[parsePrimitives]: no x2 defined for rectangle";

                        y2 = this.reader.getFloat(grandChild, 'y2');
                        if (y2 == null || isNaN(y2))
                            return "[parsePrimitives]: no y2 defined for translate";

                        this.primitives[id] = new MyRectangle(this.scene, id, x, y, x2, y2);
                        break;

                    case 'triangle':
                        x = this.reader.getFloat(grandChild, 'x1');
                        if (x == null || isNaN(x))
                            return "[parsePrimitives]: no x defined for triangle";

                        y = this.reader.getFloat(grandChild, 'y1');
                        if (y == null || isNaN(y))
                            return "[parsePrimitives]: no y defined for triangle";

                        z = this.reader.getFloat(grandChild, 'z1');
                        if (z == null || isNaN(z))
                            return "[parsePrimitives]: no z defined for triangle";

                        x2 = this.reader.getFloat(grandChild, 'x2');
                        if (x2 == null || isNaN(x2))
                            return "[parsePrimitives]: no x2 defined for triangle";

                        y2 = this.reader.getFloat(grandChild, 'y2');
                        if (y2 == null || isNaN(y2))
                            return "[parsePrimitives]: no y2 defined for triangle";

                        z2 = this.reader.getFloat(grandChild, 'z2');
                        if (z2 == null || isNaN(z2))
                            return "[parsePrimitives]: no z2 defined for triangle";

                        x3 = this.reader.getFloat(grandChild, 'x3');
                        if (x3 == null || isNaN(x3))
                            return "[parsePrimitives]: no x2 defined for triangle";

                        y3 = this.reader.getFloat(grandChild, 'y3');
                        if (y3 == null || isNaN(y3))
                            return "[parsePrimitives]: no y3 defined for triangle";

                        z3 = this.reader.getFloat(grandChild, 'z3');
                        if (z3 == null || isNaN(z3))
                            return "[parsePrimitives]: no z3 defined for triangle";

                        this.primitives[id] = new MyTriangle(this.scene, id, x, y, z, x2, y2, z2, x3, y3, z3);
                        break;

                    case 'cylinder':
                        base = this.reader.getFloat(grandChild, 'base');
                        if (base == null || isNaN(base))
                            return "[parsePrimitives]: no base defined for cylinder";

                        top = this.reader.getFloat(grandChild, 'top');
                        if (top == null || isNaN(top))
                            return "[parsePrimitives]: no top defined for cylinder";

                        height = this.reader.getFloat(grandChild, 'height');
                        if (height == null || isNaN(height))
                            return "[parsePrimitives]: no height defined for cylinder";

                        slices = this.reader.getFloat(grandChild, 'slices');
                        if (slices == null || isNaN(slices))
                            return "[parsePrimitives]: no slices defined for cylinder";

                        stacks = this.reader.getFloat(grandChild, 'stacks');
                        if (stacks == null || isNaN(stacks))
                            return "[parsePrimitives]: no stacks defined for cylinder";

                        this.primitives[id] = new MyCylinder(this.scene, id, base, top, height, slices, stacks);
                        break;

                    case 'sphere':
                        radius = this.reader.getFloat(grandChild, 'radius');
                        if (radius == null || isNaN(radius))
                            return "[parsePrimitives]: no radius defined for sphere";

                        slices = this.reader.getFloat(grandChild, 'slices');
                        if (slices == null || isNaN(slices))
                            return "[parsePrimitives]: no slices defined for sphere";

                        stacks = this.reader.getFloat(grandChild, 'stacks');
                        if (stacks == null || isNaN(stacks))
                            return "[parsePrimitives]: no stacks defined for sphere";

                        this.primitives[id] = new MySphere(this.scene, id, radius, slices, stacks);
                        break;

                    case 'torus':
                        inner = this.reader.getFloat(grandChild, 'inner');
                        if (inner == null || isNaN(inner))
                            return "[parsePrimitives]: no inner defined for torus";

                        outer = this.reader.getFloat(grandChild, 'outer');
                        if (outer == null || isNaN(outer))
                            return "[parsePrimitives]: no outer defined for torus";

                        slices = this.reader.getFloat(grandChild, 'slices');
                        if (slices == null || isNaN(slices))
                            return "[parsePrimitives]: no slices defined for torus";

                        loops = this.reader.getFloat(grandChild, 'loops');
                        if (loops == null || isNaN(loops))
                            return "[parsePrimitives]: no loops defined for torus";

                        this.primitives[id] = new MyTorus(this.scene, id, inner, outer, slices, loops);
                        break;

                    default:
                        return "[parsePrimitives]: invalid: " + grandChild.nodeName;
                }
            }
        }

        this.log("Parsed primitives!");

        return null;
    }

    /**
     * Parses the <components> node.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        // array of unparsed components
        var unparsedComponents = new Array();

        var children = componentsNode.children;
        for (let child of children) {
            if (child.nodeName != "component") {
                this.onXMLMinorError("[parseComponents]: unknown tag <" + child.nodeName + ">");
                continue;
            }

            // parse component 'id'
            var id = this.reader.getString(child, 'id');
            if (id == null)
                return "[parseComponents]: no ID defined for component";

            // checks for repeated component ids
            if (this.components[id] != null)
                return "[parseComponents]: ID must be unique for each component (conflict: ID = " + id + ")";

            var comp = new MyComponent(this.scene, id);

            // parse component transformations, materials, textures and children components/primitives
            var id2, length_s, length_t;

            var grandChildren = child.children;
            for (let grandChild of grandChildren) {

                var grandGrandChildren = grandChild.children;

                switch (grandChild.nodeName) {
                    case 'transformation':
                        {
                            for (let grandGrandChild of grandGrandChildren) {
                                var x, y, z;
                                switch (grandGrandChild.nodeName) {
                                    case 'transformationref':
                                        id2 = this.reader.getString(grandGrandChild, 'id');
                                        if (id2 == null)
                                            return "[parseComponents]: no id defined for transformationref";
                                        if (this.transformations[id2] != null)
                                            comp.addTransformation(this.transformations[id2]);
                                        else
                                            return "[parseComponents]: Id for transformationref invalid: " + id2;
                                        break;

                                    case 'translate':
                                        x = this.reader.getFloat(grandGrandChild, 'x');
                                        if (x == null || isNaN(x))
                                            return "[parseComponents]: no x defined for translate";

                                        y = this.reader.getFloat(grandGrandChild, 'y');
                                        if (y == null || isNaN(y))
                                            return "[parseComponents]: no y defined for translate";

                                        z = this.reader.getFloat(grandGrandChild, 'z');
                                        if (z == null || isNaN(z))
                                            return "[parseComponents]: no z defined for translate";

                                        comp.addTranslation(new MyTranslation(x, y, z));
                                        break;

                                    case 'scale':
                                        x = this.reader.getFloat(grandGrandChild, 'x');
                                        if (x == null || isNaN(x))
                                            return "[parseComponents]: no x defined for scale";

                                        y = this.reader.getFloat(grandGrandChild, 'y');
                                        if (y == null || isNaN(y))
                                            return "[parseComponents]: no y defined for scale";

                                        z = this.reader.getFloat(grandGrandChild, 'z');
                                        if (z == null || isNaN(z))
                                            return "[parseComponents]: no z defined for scale";

                                        comp.addScale(new MyScaling(x, y, z));
                                        break;

                                    case 'rotate':
                                        var axis = this.reader.getString(grandGrandChild, 'axis');
                                        if (axis == null)
                                            return "[parseComponents]: no axis defined for rotate";

                                        var angle = this.reader.getFloat(grandGrandChild, 'angle');
                                        if (angle == null || isNaN(angle))
                                            return "[parseComponents]: no angle defined for rotate";

                                        comp.addRotation(new MyRotation(axis, angle * DEGREE_TO_RAD));
                                        break;
                                }
                            }
                            break;
                        }
                    case 'materials':
                        {
                            for (let grandGrandChild of grandGrandChildren) {
                                id2 = this.reader.getString(grandGrandChild, 'id');
                                if (id2 == null)
                                    return "[parseComponents]: no id defined for materials";

                                if (id2 != 'inherit' && this.materials[id2] != null)
                                    comp.addMaterial(id2, this.materials[id2]);
                                else
                                    comp.addMaterial(id2, null);
                            }
                            break;
                        }
                    case 'animations':
                        {
                            for (let grandGrandChild of grandGrandChildren) {
                                id2 = this.reader.getString(grandGrandChild, 'id');
                                if (id2 == null)
                                    return "[parseComponents]: no id defined for animationref";

                                if (this.animations[id2] != null) {
                                    var anim, id3, span;
                                    
                                    if(this.animations[id2] instanceof MyLinearAnimation ){
                                        id3 = this.animations[id2].id;
                                        span = this.animations[id2].span;
                                        var controlPoints = this.animations[id2].controlPoints;
                                        
                                        anim = new MyLinearAnimation(id3,span);
                                        for(let controlPoint of controlPoints)
                                            anim.addControlPoint(controlPoint['x'],controlPoint['y'],controlPoint['z']);

                                    } 
                                    else if( this.animations[id2] instanceof MyCircularAnimation ){
                                        
                                        id3 = this.animations[id2].id;
                                        span = this.animations[id2].span;
                                        var center = this.animations[id2].center;
                                        var radius = this.animations[id2].radius;
                                        var startang = this.animations[id2].startang;
                                        var rotang = this.animations[id2].rotang;

                                        anim = new MyCircularAnimation(id3, span, center, radius, startang, rotang);
                                    }
                                    comp.addAnimation(id2, anim);
                                }
                            }

                            break;
                        }
                    case 'texture':
                        {
                            id2 = this.reader.getString(grandChild, 'id');
                            if (id2 == null)
                                return "[parseComponents]: no id defined for texture";
                            else if (id2 == 'none')
                                comp.addTexture(id2, null, 0, 0);
                            else if (id2 == 'inherit') {
                                length_s = this.reader.getFloat(grandChild, 'length_s');
                                if (!(length_s != null && !isNaN(length_s)))
                                    length_s = 1;

                                length_t = this.reader.getFloat(grandChild, 'length_t');
                                if (!(length_t != null && !isNaN(length_t)))
                                    length_t = 1;

                                comp.addTexture(id2, this.textures[id2], length_s, length_t);

                            } else {
                                length_s = this.reader.getFloat(grandChild, 'length_s');
                                if (!(length_s != null && !isNaN(length_s)))
                                    return "[parseComponents]: no length_s defined for texture";

                                length_t = this.reader.getFloat(grandChild, 'length_t');
                                if (!(length_t != null && !isNaN(length_t)))
                                    return "[parseComponents]: no length_t defined for texture";

                                if (this.textures[id2] != null)
                                    comp.addTexture(id2, this.textures[id2], length_s, length_t);
                                else
                                    comp.addTexture(id2, null, length_s, length_t);
                            }
                            break;
                        }
                    case 'children':
                        {
                            for (let grandGrandChild of grandGrandChildren) {
                                if (grandGrandChild.nodeName == 'componentref') {
                                    id2 = this.reader.getString(grandGrandChild, 'id');
                                    if (id2 == null)
                                        return "[parseComponents]: no id defined for component";
                                    else if (this.components[id2] != null)
                                        comp.addChild(this.components[id2]);
                                    else
                                        unparsedComponents.push([id, id2]);
                                }
                                else if (grandGrandChild.nodeName == 'primitiveref') {
                                    id2 = this.reader.getString(grandGrandChild, 'id');
                                    if (id2 == null)
                                        return "[parseComponents]: no id defined for primitive";

                                    if (this.primitives[id2] instanceof MyRectangle)
                                        comp.addChild(new MyRectangle(
                                            this.primitives[id2].scene,
                                            this.primitives[id2].id,
                                            this.primitives[id2].x1,
                                            this.primitives[id2].y1,
                                            this.primitives[id2].x2,
                                            this.primitives[id2].y2,
                                            length_s,
                                            length_t));
                                    else if (this.primitives[id2] instanceof MyTriangle)
                                        comp.addChild(new MyTriangle(
                                            this.primitives[id2].scene,
                                            this.primitives[id2].id,
                                            this.primitives[id2].x1,
                                            this.primitives[id2].y1,
                                            this.primitives[id2].z1,
                                            this.primitives[id2].x2,
                                            this.primitives[id2].y2,
                                            this.primitives[id2].z2,
                                            this.primitives[id2].x3,
                                            this.primitives[id2].y3,
                                            this.primitives[id2].z3,
                                            length_s,
                                            length_t));
                                    else
                                        comp.addChild(this.primitives[id2]);
                                }
                            }
                            break;
                        }
                }
            }

            this.components[id] = comp;
        }

        // add currently unparsed components to their parent component
        for (let component of unparsedComponents)
            this.components[component[0]].addChild(this.components[component[1]]);

        this.log("Parsed components!");

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
        var root = this.components[this.root];
        if (root == null)
            return "[displayScene]: root node does not exist!";

        // display scene graph starting at the root component
        root.display(root.materials[root.currentMaterialIndex][1], root.texture);
    }
}

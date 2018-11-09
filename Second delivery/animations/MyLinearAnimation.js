<yas>

    <!-- Initial values -->
    <scene root="root" axis_length="5"/>

    <!-- Views specification -->
    <views default="perspective_1">
        <perspective id="perspective_1" near="0.1" far="500" angle="20">
            <from x="15.0" y="10.0" z="15.0"/>
            <to x="0.0" y="0.0" z="0.0"/>
        </perspective>

        <ortho id="ortho_1" near="0.1" far="70" left="-10" right="10" top="7" bottom="-4">
            <from x="7.5" y="5.0" z="15.0"/>
            <to x="7.5" y="0.0" z="0.0"/>
        </ortho>

        <ortho id="ortho_2" near="0.1" far="70" left="-10" right="10" top="4" bottom="-5">
            <from x="15.0" y="5.0" z="8.0"/>
            <to x="0.0" y="4.0" z="8.0"/>
        </ortho>
    </views>

    <!-- Ilumination parameters -->
    <ambient>
        <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>
        <background r="0.7" g="0.4" b="1.0" a="1.0"/>
    </ambient>

    <!-- Light sources -->
    <lights>
        <omni id="light1" enabled="1">
            <location x="7.5" y="6.0" z="14.0" w="1.0"/>
            <ambient r="0.0" g="0.0" b="0.0" a="0.0"/>
            <diffuse r="1.0" g="1.0" b="1.0" a="1.0"/>
            <specular r="1.0" g="1.0" b="0.0" a="1.0"/>
        </omni>
        <omni id="light2" enabled="1">
            <location x="1.0" y="4.0" z="7.5" w="1.0"/>
            <ambient r="0.0" g="0.0" b="0.0" a="0.0"/>
            <diffuse r="1.0" g="0.7" b="0.1" a="1.0"/>
            <specular r="1.0" g="1.0" b="0.0" a="1.0"/>
        </omni>
         <omni id="light3" enabled="1">
            <location x="7.5" y="6.0" z="1.0" w="1.0"/>
            <ambient r="0.0" g="0.0" b="0.0" a="0.0"/>
            <diffuse r="1.0" g="0.7" b="0.1" a="1.0"/>
            <specular r="1.0" g="1.0" b="1.0" a="1.0"/>
        </omni>
        <omni id="light4" enabled="1">
            <location x="14.0" y="4.0" z="7.5" w="1.0"/>
            <ambient r="0.0" g="0.0" b="0.0" a="0.0"/>
            <diffuse r="1.0" g="0.7" b="0.1" a="1.0"/>
            <specular r="1.0" g="1.0" b="0.0" a="1.0"/>
        </omni>
        <spot id="light5" enabled="1" angle="1.0" exponent="1.0">
            <location x="7.5" y="7.0" z="7.5" w="1.0"/>
            <target x="7.5" y="4.0" z="7.5"/>
            <ambient r="0.1" g="0.1" b="0.1" a="1.0"/>
            <diffuse r="0.9" g="0.3" b="0.2" a="1.0"/>
            <specular r="0.9" g="0.9" b="0.4" a="1.0"/>
        </spot>
    </lights>

    <!-- Textures -->
    <textures>
        <texture id="floorAppearance" file="textures/floor.png"/>
        <texture id="windowAppearance" file="textures/window.png"/>
        <texture id="paintingAppearance" file="textures/painting.png"/>
        <texture id="carpetAppearance" file="textures/carpet.png"/>
        <texture id="tableAppearance" file="textures/marble.png"/>
        <texture id="lampAppearance" file="textures/lamp.png"/>
        <texture id="sphereAppearance" file="textures/sphere.png"/>
        <texture id="boxAppearance" file="textures/vaporwave.png"/>
        <texture id="roofAppearance" file="textures/roof.png"/>
    </textures>

    <!-- Materials -->
    <materials>
        <material id="default" shininess="10">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.2" g="0.2" b="0.2" a="1.0"/>
            <specular r="0.1" g="0.1" b="0.1" a="1.0"/>   
        </material>
        <material id="wallMaterial1" shininess="1">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.2" g="0.2" b="0.2" a="1.0"/>
            <specular r="0.1" g="0.1" b="0.1" a="1.0"/>   
        </material>
        <material id="wallMaterial2" shininess="1">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.2" g="1.0" b="0.3" a="1.0"/>
            <specular r="0.1" g="0.1" b="0.1" a="1.0"/>   
        </material>
        <material id="tableLegsMaterial1" shininess="10">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.40" g="0.26" b="0.13" a="1.0"/>
            <specular r="0.0" g="0.0" b="0.0" a="1.0"/>   
        </material>
        <material id="tableLegsMaterial2" shininess="1">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.0" g="0.0" b="0.4" a="1.0"/>
            <specular r="0.0" g="0.0" b="0.0" a="1.0"/>   
        </material>
        <material id="lampBodyMaterial" shininess="10">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.3" g="0.3" b="0.3" a="1.0"/>
            <specular r="0.6" g="0.6" b="0.6" a="1.0"/>   
        </material>
        <material id="lit" shininess="120">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.5" g="0.5" b="0.5" a="1.0"/>
            <specular r="0.3" g="0.3" b="0.3" a="1.0"/>   
        </material>
        <material id="vaporwave" shininess="10">
            <emission r="0.0" g="0.0" b="0.0" a="1.0"/>  
            <ambient r="0.0" g="0.0" b="0.0" a="1.0"/>   
            <diffuse r="0.72" g="0.4" b="1.0" a="1.0"/>
            <specular r="0.0" g="0.0" b="0.0" a="1.0"/>   
        </material>
    </materials>

    <!-- Transformations -->
    <transformations>
        <transformation id="trfLeftWall">
            <translate x="0.0" y="4.0" z="7.5"/>
            <rotate axis="y" angle="90"/>
            <scale x="15.0" y="8.0" z="0.2"/>
        </transformation>

        <transformation id="trfWindowFrame">
            <translate x="0.1" y="4.5" z="7.5"/>
            <rotate axis="y" angle="90"/>
            <scale x="4.0" y="4.0" z="0.2"/>
        </transformation>

        <transformation id="trfRightWall">
            <translate x="7.5" y="4.0" z="0.0"/>
            <scale x="15.0" y="8.0" z="0.2"/>
        </transformation>

        <transformation id="trfPaintingFrame">
            <translate x="7.5" y="4.0" z="0.1"/>
            <scale x="10.0" y="5.0" z="0.2"/>
        </transformation>

        <transformation id="trfFloor">
            <translate x="7.5" y="0.0" z="7.5"/>
            <rotate axis="x" angle="-90"/>
            <scale x="15.0" y="15.0" z="0.2"/>
        </transformation>

        <transformation id="trfCarpet">
            <translate x="7.5" y="0.1" z="7.5"/>
            <rotate axis="x" angle="-90"/>
            <scale x="8.0" y="6.0" z="1.0"/>
        </transformation>

	    <transformation id="trfTable">
            <translate x="7.5" y="0.0" z="7.5"/>
        </transformation>
        
        <transformation id="trfLamp">
            <translate x="5.8" y="3.7" z="7.5"/>
        </transformation>

        <transformation id="trfBox">
            <translate x="9.0" y="4.15" z="7.5"/>
        </transformation>

	    <transformation id="trfPyramid">
            <translate x="9.0" y="4.65" z="7.5"/>
        </transformation>

        <transformation id="trfSphere">
            <translate x="7.3" y="4.15" z="7.5"/>
            <scale x="0.5" y="0.5" z="0.5"/>
            <rotate axis="y" angle="180"/>
            <rotate axis="x" angle="90"/>
        </transformation>
    </transformations>

    <!-- Animations -->
    <animations>
        <linear id = "1" span = "2">
            <controlpoint xx = "0" yy = "0" zz = "0" />
            <controlpoint xx = "5" yy = "0" zz = "0" />
            <controlpoint xx = "5" yy = "5" zz = "0" />
        </linear>

        <circular id = "2" span = "2" center = "00 00 00" radius = "3" startang = "0" rotang = "45" />
    </animations>

    <!-- Primitive objects -->
    <primitives>
        <primitive id="rectangle">
            <rectangle x1="-0.5" y1="-0.5" x2="0.5" y2="0.5"/>
        </primitive>

        <primitive id="triangle1">
            <triangle x1="-0.5" y1="0.0" z1="0.5" x2="0.5" y2="0.0" z2="0.5" x3="0.0" y3="0.5" z3="0.0"/>
        </primitive>

	    <primitive id="triangle2">
            <triangle x1="0.5" y1="0.0" z1="0.5" x2="0.5" y2="0.0" z2="-0.5" x3="0.0" y3="0.5" z3="0.0"/>
        </primitive>

	    <primitive id="triangle3">
            <triangle x1="0.5" y1="0.0" z1="-0.5" x2="-0.5" y2="0.0" z2="-0.5" x3="0.0" y3="0.5" z3="0.0"/>
        </primitive>

	    <primitive id="triangle4">
            <triangle x1="-0.5" y1="0.0" z1="-0.5" x2="-0.5" y2="0.0" z2="0.5" x3="0.0" y3="0.5" z3="0.0"/>
        </primitive>

        <primitive id="cylinder">
            <cylinder base="1" top="1" height="1" slices="30" stacks="30"/>
        </primitive>

        <primitive id="sphere">
            <sphere radius="1" slices="50" stacks="30"/>
        </primitive>

        <primitive id="torus">
            <torus inner="0.5" outer="1" slices="30" loops="50"/>
        </primitive>
    </primitives>

    <!-- Composed objects -->
    <components>

        <!-- Sphere -->
        <component id="mySphere">
            <transformation>
                <transformationref id="trfSphere"/>
            </transformation>

            <animations>
                <animationref id = "1"/>
            </animations>
            <materials>

                <material id="default"/>
                <material id="lit"/>
            </materials>

            <texture id="sphereAppearance" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="sphere"/>
            </children>
        </component>

        <!-- Cube -->
        <component id="face1">
            <transformation>
                <translate x="0" y="0" z="0.5"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="face2">
            <transformation>
                <translate x="0" y="0" z="-0.5"/>
                <rotate axis="y" angle="180"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="face3">
            <transformation>
                <translate x="0" y="-0.5" z="0"/>
                <rotate axis="x" angle="90"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="face4">
            <transformation>
                <translate x="0" y="0.5" z="0"/>
                <rotate axis="x" angle="-90"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="face5">
            <transformation>
                <translate x="-0.5" y="0" z="0"/>
                <rotate axis="y" angle="-90"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
           <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="face6">
            <transformation>
                <translate x="0.5" y="0" z="0"/>
                <rotate axis="y" angle="90"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="myCube">
            <transformation>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <componentref id="face1"/>
                <componentref id="face2"/>
                <componentref id="face3"/>
                <componentref id="face4"/>
                <componentref id="face5"/>
                <componentref id="face6"/>
            </children>
        </component>

	    <!-- Pyramid -->
	 <component id="pyramidTriangle1">
            <transformation>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="triangle1"/>
            </children>
        </component>

	    <component id="pyramidTriangle2">
            <transformation>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="triangle2"/>
            </children>
        </component>

	    <component id="pyramidTriangle3">
            <transformation>   
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="triangle3"/>
            </children>
        </component>

	    <component id="pyramidTriangle4">
            <transformation>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="inherit" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="triangle4"/>
            </children>
        </component>

	    <component id="myPyramid">
            <transformation>
                <transformationref id="trfPyramid"/>
            </transformation>

            <materials>
                <material id="default"/>
                <material id="vaporwave"/>
            </materials>

            <texture id="roofAppearance" length_s="1" length_t="1"/>

            <children>
                <componentref id="pyramidTriangle1"/>
		<componentref id="pyramidTriangle2"/>
		<componentref id="pyramidTriangle3"/>
		<componentref id="pyramidTriangle4"/>
            </children>
        </component>

        <!-- Box -->
        <component id="myBox">
            <transformation>
                <transformationref id="trfBox"/>
            </transformation>

            <materials>
                <material id="default"/>
                <material id="vaporwave"/>
            </materials>

            <texture id="boxAppearance" length_s="1" length_t="1"/>

            <children>
                <componentref id="myCube"/>
            </children>
        </component>

        <!-- Lamp -->
        <component id="lampSphere">
            <transformation>
                <translate x="0.0" y="1.6" z="0.0"/>
                <scale x="0.3" y="0.8" z="0.3"/>
            </transformation>

            <materials>
                <material id="default"/>
                <material id="lit"/>
            </materials>

            <texture id="lampAppearance" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="sphere"/>
            </children>
        </component>

        <component id="lampBody">
            <transformation>
                <translate x="0.0" y="1.0" z="0.0"/>
                <scale x ="0.15" y="1" z="0.15"/>
                <rotate axis ="x" angle="90"/>
            </transformation>

            <materials>
                <material id="lampBodyMaterial"/>
            </materials>

            <texture id="none"/>

            <children>
                <primitiveref id="cylinder"/>
            </children>
        </component>

        <component id="lampBase">
            <transformation>
                <scale x ="0.3" y="0.2" z="0.3"/>
                <rotate axis ="x" angle="90"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="none"/>

            <children>
                <primitiveref id="torus"/>
            </children>
        </component>

        <!-- Lamp -->
        <component id="myLamp">
            <transformation>
                <transformationref id="trfLamp"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="none"/>

            <children>
                <componentref id="lampSphere"/>
                <componentref id="lampBody"/>
                <componentref id="lampBase"/>
            </children>
        </component>

        <!-- Table -->
        <component id="tableTop">
            <transformation>
                <translate x="0.0" y="3.5" z="0.0"/>
                <scale x="5.0" y="0.3" z="3.0"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>
           
            <texture id="tableAppearance" length_s="1" length_t="1"/>

            <children>
                <componentref id="myCube"/>
            </children>
        </component>

        <component id="tableLeg1">
            <transformation>
                <translate x="-2.3" y="1.7" z="1.3"/>
                <scale x="0.3" y="3.5" z="0.3"/>
            </transformation>

            <materials>
                <material id="tableLegsMaterial1"/>
                <material id="tableLegsMaterial2"/>
            </materials>
           
            <texture id="none"/>

            <children>
                <componentref id="myCube"/>
            </children>
        </component>

         <component id="tableLeg2">
            <transformation>
                <translate x="2.3" y="1.7" z="1.3"/>
                <scale x="0.3" y="3.5" z="0.3"/>
            </transformation>

            <materials>
                <material id="tableLegsMaterial1"/>
                <material id="tableLegsMaterial2"/>
            </materials>
           
            <texture id="none"/>

            <children>
                <componentref id="myCube"/>
            </children>
        </component>

        <component id="tableLeg3">
            <transformation>
                <translate x="2.3" y="1.7" z="-1.3"/>
                <scale x="0.3" y="3.5" z="0.3"/>
            </transformation>

            <materials>
                <material id="tableLegsMaterial1"/>
                <material id="tableLegsMaterial2"/>
            </materials>
           
            <texture id="none"/>

            <children>
                <componentref id="myCube"/>
            </children>
        </component>

         <component id="tableLeg4">
            <transformation>
                <translate x="-2.3" y="1.7" z="-1.3"/>
                <scale x="0.3" y="3.5" z="0.3"/>
            </transformation>

            <materials>
                <material id="tableLegsMaterial1"/>
                <material id="tableLegsMaterial2"/>
            </materials>
           
            <texture id="none"/>

            <children>
                <componentref id="myCube"/>
            </children>
        </component>

        <component id="myTable">
            <transformation>
                <transformationref id="trfTable"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="none"/>

            <children>
                <componentref id="tableTop"/>
                <componentref id="tableLeg1"/>
                <componentref id="tableLeg2"/>
                <componentref id="tableLeg3"/>
                <componentref id="tableLeg4"/>
            </children>
        </component>

        <!-- Carpet -->
        <component id="myCarpet">
            <transformation>
                <transformationref id="trfCarpet"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="carpetAppearance" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <!-- Floor -->
        <component id="myFloor">
            <transformation>
                <transformationref id="trfFloor"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="floorAppearance" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <!-- Right wall -->
        <component id="paintingFrame">
            <transformation>
                <transformationref id="trfPaintingFrame"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="paintingAppearance" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="rightWall">
            <transformation>
                <transformationref id="trfRightWall"/>
            </transformation>

            <materials>
                <material id="wallMaterial1"/>
                <material id="wallMaterial2"/>
            </materials>

            <texture id="none"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="myRightWall">
            <transformation>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="none"/>

            <children>
                <componentref id="rightWall"/>
                <componentref id="paintingFrame"/>
            </children>
        </component>

         <!-- Left wall -->
         <component id="windowFrame">
            <transformation>
                <transformationref id="trfWindowFrame"/>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="windowAppearance" length_s="1" length_t="1"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="leftWall">
            <transformation>
                <transformationref id="trfLeftWall"/>
            </transformation>

            <materials>
                <material id="wallMaterial1"/>
                <material id="wallMaterial2"/>
            </materials>

            <texture id="none"/>

            <children>
                <primitiveref id="rectangle"/>
            </children>
        </component>

        <component id="myLeftWall">
            <transformation>
            </transformation>

            <materials>
                <material id="inherit"/>
            </materials>

            <texture id="none"/>

            <children>
                <componentref id="leftWall"/>
                <componentref id="windowFrame"/>
            </children>
        </component>

        <!-- Root element -->
        <component id="root">
            <transformation>
            </transformation>

            <materials>
                <material id="default"/>
            </materials>

            <texture id="none"/>

            <children>
                <componentref id="myLeftWall"/>
                <componentref id="myRightWall"/>
                <componentref id="myFloor"/>
                <componentref id="myCarpet"/>
                <componentref id="myTable"/>
                <componentref id="myLamp"/>
                <componentref id="mySphere"/>
		<componentref id="myBox"/>
		<componentref id="myPyramid"/>
            </children>
        </component>

    </components>

</yas>

#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec3 vertexPosition;
varying vec3 vertexNormal;
varying vec2 vTextureCoord;

void main() 
{
	vertexPosition = aVertexPosition;
	vertexNormal = aVertexNormal;
	vTextureCoord = aTextureCoord;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float normScale;
uniform float wavingFactor;
uniform float runningFactor;
uniform sampler2D uSampler2;

varying vec3 vertexPosition;
varying vec3 vertexNormal;
varying vec2 vTextureCoord;

void main() 
{
    vertexPosition = aVertexPosition;
	vertexNormal = aVertexNormal;
    vTextureCoord = vec2(aTextureCoord.x + runningFactor, aTextureCoord.y);

    vec4 color = texture2D(uSampler2, vTextureCoord);

	float sum = (color.r + color.g + color.b) / 3.0;

	vec3 offset = aVertexNormal * sum * normScale * wavingFactor * 0.1;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}
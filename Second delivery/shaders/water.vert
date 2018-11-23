#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float normScale;
uniform float timeFactor;
uniform sampler2D uSampler2;

void main() {

    vTextureCoord = aTextureCoord;
    //vTextureCoord /= (timeFactor + 1.0);

    vec4 color = texture2D(uSampler2, vTextureCoord);
	float sum = (color.r + color.g + color.b) / 3.0;

	vec3 offset = aVertexNormal * sum * normScale * timeFactor * 0.5;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}
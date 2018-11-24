#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float texScale;

uniform sampler2D uSampler;

void main() 
{
	gl_FragColor = texture2D(uSampler, mod(vTextureCoord * texScale, 1.0));
}
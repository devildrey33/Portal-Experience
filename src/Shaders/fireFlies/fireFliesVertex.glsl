uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {
    vec4 modelPosition      = modelMatrix       * vec4(position , 1.0);
    modelPosition.y += sin(abs(uTime) + modelPosition.x * 100.0) * aScale * 0.2;

    vec4 viewPosition       = viewMatrix        * modelPosition;
    vec4 projectionPosition = projectionMatrix  * viewPosition;

    gl_Position = projectionPosition;

    // Adapt point size to pixel ratio and random scale
    gl_PointSize = uSize * aScale * uPixelRatio;

    // Size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);
}
uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
uniform float uAnimationDelay;
uniform float uAnimationSpeed;

attribute float aScale;
attribute float aRand;
attribute float aRadius;
attribute float aAngle;



/* Cubic bezier function from ChatGPT */
float cubic_bezier(float A, float B, float C, float D, float t) {
     float E = mix(A, B, t);
     float F = mix(B, C, t);
     float G = mix(C, D, t);

     float H = mix(E, F, t);
     float I = mix(F, G, t);

     float P = mix(H, I, t);

     return P;
}


void main() {
    vec4 modelPosition      = modelMatrix       * vec4(position , 1.0);
    
    // clampTime its 0 until uAnimationDelay its consumed, then goes from 0 to 1
    float clampTime = clamp((uTime - uAnimationDelay) * uAnimationSpeed, 0.0, 1.0);
    // current time for cubic-bezier timeline, can go from 0.01 to 1.9 to -0.01
    float curTime =  cubic_bezier(0.0, 0.7, 1.4, -0.01, clampTime);
    
    // distance from center x, y
    float rad = (clampTime * (aRadius * curTime * 0.5)) * 3.0;

    // Rotate particles
    modelPosition.x = modelPosition.x + (cos(mod(360.0, aAngle + clampTime)) * rad * (curTime * 0.5));
    modelPosition.y = modelPosition.y + (sin(mod(360.0, aAngle + clampTime)) * rad * (curTime * 0.5));

    // aRand ads a bit of random velocity for the particles
    modelPosition.z += 3.0 * (curTime * aScale * aRand);

    vec4 viewPosition       = viewMatrix        * modelPosition;
    vec4 projectionPosition = projectionMatrix  * viewPosition;

    // Set the final position
    gl_Position = projectionPosition;

    // scale goes smaller when curTime reaches the end
    float scale = ((aScale * clampTime) * 15.0);

    // Adapt point size to pixel ratio and random scale
    gl_PointSize = uSize * scale * uPixelRatio;

    // Size attenuation
    gl_PointSize *= (1.0 / - viewPosition.z);
}
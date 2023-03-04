uniform float uTime;
uniform float uAnimationDelay;
uniform float uAnimationSpeed;
uniform vec3  uColorStart;
uniform vec3  uColorEnd;


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
    // current time for cubic-bezier timeline, can go from 0.01 to 1.9 to -0.01
    float clampTime = clamp(((uTime - uAnimationDelay) * uAnimationSpeed), 0.0, 1.0);
    float curTime =  cubic_bezier(0.0, 0.05, 1.9, -0.01, clampTime);

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5)) * 2.0;
    float strength = (0.05 / distanceToCenter - 0.1) * curTime;

    vec3 color = mix(uColorStart, uColorEnd, clampTime);

    gl_FragColor = vec4(color, strength);
}
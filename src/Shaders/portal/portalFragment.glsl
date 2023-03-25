uniform float uTime;
uniform vec3  uColorStart;
uniform vec3  uColorEnd;
uniform float uPerlinNoiseStrength1;
uniform float uPerlinNoiseStrength2;
uniform float uPerlinNoiseTime1;
uniform float uPerlinNoiseTime2;
uniform float uOutherGlowStrength;
uniform float uOutherGlowLimit;
uniform float uColorWaveTime;
uniform float uColorWaveAmplitude;
uniform float uAnimationDelay;
uniform float uAnimationSpeed;

varying vec2  vUv;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)       { return mod(((x*34.0)+1.0)*x, 289.0);            }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t)          { return t*t*t*(t*(t*6.0-15.0)+10.0);             }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}


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



//	<https://www.shadertoy.com/view/4dS3Wd>
//	By Morgan McGuire @morgan3d, http://graphicscodex.com
//
/*float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise(float x) {
	float i = floor(x);
	float f = fract(x);
	float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i), hash(i + 1.0), u);
}

float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	// Four corners in 2D of a tile
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));

	// Simple 2D lerp using smoothstep envelope between the values.
	// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
	//			mix(c, d, smoothstep(0.0, 1.0, f.x)),
	//			smoothstep(0.0, 1.0, f.y)));

	// Same code, with the clamps in smoothstep and common subexpressions
	// optimized away.
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}*/

/* Creates a inverted circle and returns the alpha channel
 * 0.85 if its outside, 0 if its inside
 */
/*float circle(float rad) {
    if (rad == 0.0) return 0.85;

    vec2 st = vUv;
    st = st * 2.0 - 1.0;
    float d = length(st);

    vec3 color = vec3(1.0);

    if (d < 0.8) {
        color = mix(vec3(1.0), vec3(0.0), smoothstep(0.6, 0.8, d));
    } 
    else {
        color = vec3(0.0);
    }

    float noiseFactor = 0.075;
    float noiseValue = noise(st * .5 + vec2(uTime * .5));
    float noiseDisplacement = noiseFactor * noiseValue;

    float radius = rad + noiseDisplacement;
    float circle = smoothstep(radius, radius + 0.02, d);

    color = mix(color, vec3(0.0), circle);
    float alpha = 0.85;
    if (color.r > 0.0) alpha = 0.0;

    return alpha;
}*/

#define CLOSE_TIME 60.0

// Main
void main() {
    // For some strange reason time sometimes its a negative value.... (happens mostly when the tap is not active)
    float time = abs(uTime);

    // current time for cubic-bezier timeline closing animation, can go from 0.0 to 1.0
    float curTimeClose = cubic_bezier(0.0, 0.75, 1.0, 1.0, clamp((time - CLOSE_TIME) * uAnimationSpeed * 2.0, 0.0, 1.0));


    // current time for cubic-bezier timeline opening animation, can go from 1.0 to 0.0
    float curTime =  1.0 - cubic_bezier(0.35, 1.45, 0.9, 1.0, clamp((time - uAnimationDelay) * uAnimationSpeed, 0.0, 1.0));
    // current time for cubic-bezier timeline opening animation, can go from 1.0 to 0.1
    float curTime2 =  1.0 - cubic_bezier(0.0, 0.75, 1.0, 0.9, clamp((time - uAnimationDelay) * uAnimationSpeed, 0.0, 1.0));
    // Max uOutherGlowStrength value
    float OGSMax = (uOutherGlowStrength * 30.0);   
    // Set OutherGlowStrength value to cubic-bezier timeline
    float OutherGlowStrength = uOutherGlowStrength +  (OGSMax * curTime);

    // Make a wave for the dark part of the portal
    float OutherGlowLimit = uOutherGlowLimit + (sin(time * uColorWaveTime) * (uColorWaveAmplitude + curTime));
    OutherGlowLimit = OutherGlowLimit * (1.0 +  (curTimeClose * 0.5));

    // Displace uV (first perlin noise)
    vec2 displacedUv = vUv + cnoise(vec3(vUv * uPerlinNoiseStrength1, time * uPerlinNoiseTime1));

    // Make second perlin noise for the strength
    float strength = cnoise(vec3(displacedUv * uPerlinNoiseStrength2, time * uPerlinNoiseTime2));

    // Outher glow                     
    float outherGlow = distance(vUv, vec2(0.5)) * OutherGlowStrength - OutherGlowLimit;
    strength += outherGlow;

    // Apply cool step
    strength = strength + step(-0.1, strength) * 0.8; 

    // Insert a inverted circle with curTime radius as a transparent area
    // This will make the portal appear from outside to the center
    float dist = step(0.4, abs(distance(vUv, vec2(0.5)) - (curTime2 + curTimeClose)));
    float alpha = (dist < 0.5) ? 0.85 : 0.0;

//     float alpha = circle((curTime2 + curTimeClose));
//     float alpha = circle(10.2);

    // Final color
    vec3 color = mix (uColorStart, uColorEnd, strength * 0.75);

    // Apply the color and the alpha channel
    gl_FragColor = vec4(color, alpha);
}
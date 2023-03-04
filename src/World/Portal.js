import * as THREE from 'three'
import Experience from "../Experience";
import portalVertexShader from "../Shaders/portal/portalVertex.glsl"
import portalFragmentShader from "../Shaders/portal/portalFragment.glsl"


export default class Portal {
    constructor() {
        this.experience     = new Experience();
        this.scene          = this.experience.scene;
        this.time           = this.experience.time;
        this.debug          = this.experience.debug;
        this.defaultOptions = this.experience.debug.defaultOptions;
        this.setup();
    }


    setup() {
        // Portal light material
        this.portalLightMaterial = new THREE.ShaderMaterial({ 
            uniforms        : {
                uTime                   : { value : 0.0 },
                uColorStart             : { value : new THREE.Color(this.defaultOptions.portalColorStart) },
                uColorEnd               : { value : new THREE.Color(this.defaultOptions.portalColorEnd) },
                uPerlinNoiseStrength1   : { value : this.defaultOptions.perlinNoiseStrength1 },
                uPerlinNoiseStrength2   : { value : this.defaultOptions.perlinNoiseStrength2 },
                uPerlinNoiseTime1       : { value : this.defaultOptions.perlinNoiseTime1 },
                uPerlinNoiseTime2       : { value : this.defaultOptions.perlinNoiseTime2 },
                uOutherGlowStrength     : { value : this.defaultOptions.outherGlowStrength },
                uOutherGlowLimit        : { value : this.defaultOptions.outherGlowLimit },
                uAnimationDelay         : { value : this.defaultOptions.animationDelay },
                uAnimationSpeed         : { value : this.defaultOptions.animationSpeed },

                uColorWaveTime          : { value : this.defaultOptions.colorWaveTime },
                uColorWaveAmplitude     : { value : this.defaultOptions.colorWaveAmplitude }
            },
            side            : THREE.DoubleSide,
            vertexShader    : portalVertexShader,
            fragmentShader  : portalFragmentShader, 
            transparent     : true            
        })

        this.portal2DMesh = this.experience.world.sceneMesh.portal2DMesh;
        this.portal2DMesh.material = this.portalLightMaterial;

    }

    // update the time on each frame adding delta time to ensure same result with diferent framerates
    update() {
        this.portalLightMaterial.uniforms.uTime.value += this.time.delta;
    }
}
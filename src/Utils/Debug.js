import Experience from '../Experience.js'
import * as dat from 'lil-gui'

export default class Debug {
    // State of the debug class, if the url ends with "#debug" is true, else is false
    active = window.location.hash === '#debug';

    defaultOptions = {
        clearColor              : "#201919",
        portalColorStart        : "#7a7ae6",
        portalColorEnd          : "#444497",
        perlinNoiseStrength1    : 11.75,
        perlinNoiseStrength2    : 1.8,
        perlinNoiseTime1        : 1.376,
        perlinNoiseTime2        : 0.60,
        outherGlowStrength      : 12.5,
        outherGlowLimit         : 3.77,
        animationDelay          : 0.6,
        animationSpeed          : (this.active === false) ? 0.8 : 0.2,
        colorWaveTime           : 1.2,
        colorWaveAmplitude      : 0.5,
        bloomEnabled            : true,
        bloomThreshold          : -0.92,
        bloomStrength           : 0.11,
        bloomRadius             : -0.85,
        kabushParticleSize      : 100,
        kabushHeight            : 3.62
    };
    
    constructor() {        
        this.experience = new Experience();
        console.log(this.defaultOptions.animationSpeed)
    }

    
    createGUI() {
        // Exit if debug its not active
        if (this.active === false) return;

        this.gui = new dat.GUI({ width : 300 });

        // Get materials reference
        this.portalLightMaterial = this.experience.world.portal.portalLightMaterial;
        this.kabushMaretial      = this.experience.world.portalKabush.kabushMaretial;
        this.firefliesMaretial   = this.experience.world.fireFliers.firefliesMaretial;
        this.bloomPass           = this.experience.renderer.bloomPass;
        this.world               = this.experience.world;

        this.debugPortal = this.gui.addFolder("Portal").open(false);
//        this.gui.open(true)
        
        this.debugPortal.addColor(this.defaultOptions, 'portalColorStart').onChange(() => {
            this.portalLightMaterial.uniforms.uColorStart.value.set(this.defaultOptions.portalColorStart);
        })
        this.debugPortal.addColor(this.defaultOptions, 'portalColorEnd').onChange(() => {
            this.portalLightMaterial.uniforms.uColorEnd.value.set(this.defaultOptions.portalColorEnd);
        })
        
        /* 
         * 2D Perlin noise animation
         */
        this.debug2dPerlinNoise = this.debugPortal.addFolder("2D Perlin noise animation").open(false);

        this.debug2dPerlinNoise.add(this.defaultOptions, 'perlinNoiseStrength1').min(0.1).max(30).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseStrength1.value = this.defaultOptions.perlinNoiseStrength1;
        });
        
        this.debug2dPerlinNoise.add(this.defaultOptions, 'perlinNoiseStrength2').min(0.1).max(10).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseStrength2.value = this.defaultOptions.perlinNoiseStrength2;
        });
        
        this.debug2dPerlinNoise.add(this.defaultOptions, 'perlinNoiseTime1').min(0.01).max(3).step(0.001).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseTime1.value = this.defaultOptions.perlinNoiseTime1;
        });
        
        this.debug2dPerlinNoise.add(this.defaultOptions, 'perlinNoiseTime2').min(0.01).max(4).step(0.001).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseTime2.value = this.defaultOptions.perlinNoiseTime2;
        });
        
        this.debug2dPerlinNoise.add(this.defaultOptions, 'outherGlowStrength').min(0.1).max(300).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uOutherGlowStrength.value = this.defaultOptions.outherGlowStrength;
        });
        
        this.debug2dPerlinNoise.add(this.defaultOptions, 'outherGlowLimit').min(0.1).max(20).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uOutherGlowLimit.value = this.defaultOptions.outherGlowLimit;
        });

        /*
         *  Porttal open / close animation
         */
        
        this.debugPortalShow = this.debugPortal.addFolder("Portal open / close animation").open(false);
        this.debugPortalShow.add(this.defaultOptions, 'animationDelay').min(0).max(3).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uAnimationDelay.value = this.defaultOptions.animationDelay;
            this.kabushMaretial.uniforms.uAnimationDelay.value = this.defaultOptions.animationDelay;
        });
        
        this.debugPortalShow.add(this.defaultOptions, 'animationSpeed').min(0.1).max(3).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uAnimationSpeed.value = this.defaultOptions.animationSpeed;
            this.kabushMaretial.uniforms.uAnimationSpeed.value = this.defaultOptions.animationSpeed;
        });
        
        
        this.animateButton = { animate : () => { 
            // Reset shader time
            this.portalLightMaterial.uniforms.uTime.value = 0; 
            this.kabushMaretial.uniforms.uTime.value      = 0; 
        }}        
        this.debugPortalShow.add(this.animateButton, 'animate').name("Open StarGate");

        this.animateButton2 = { animate2 : () => { 
            // Set shader time to 1 minute, so the close animation starts
            this.portalLightMaterial.uniforms.uTime.value = 60; 
            this.kabushMaretial.uniforms.uTime.value      = 60; 
        }}
        
        this.debugPortalShow.add(this.animateButton2, 'animate2').name("Close StarGate");

        /*
         * Wave animation
         */

        this.debugPortalWaves = this.debugPortal.addFolder("Wave animation").open(false);
        this.debugPortalWaves.add(this.defaultOptions, 'colorWaveTime').min(0.1).max(10).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uColorWaveTime.value = this.defaultOptions.colorWaveTime;
        });
        
        this.debugPortalWaves.add(this.defaultOptions, 'colorWaveAmplitude').min(0.1).max(2).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uColorWaveAmplitude.value = this.defaultOptions.colorWaveAmplitude;
        });

        /*
         * Portal kabush
         */

        this.debugPortalKabush = this.debugPortal.addFolder("Kabush animation").open(false);
        this.debugPortalKabush.add(this.defaultOptions, "kabushParticleSize").min(0.1).max(500).step(0.01).onChange(() => {
            this.world.portalKabush.kabushMaretial.uniforms.uSize.value = this.defaultOptions.kabushParticleSize;
        });
        this.debugPortalKabush.add(this.defaultOptions, "kabushHeight").min(0.2).max(10).step(0.01).onChange(() => {
            this.world.portalKabush.kabushMaretial.uniforms.uKabushHeight.value = this.defaultOptions.kabushHeight;
        });

        /*
         * Bloom
         */
        this.debugBloom = this.gui.addFolder("Bloom (postprocessing)").open(false);

        this.debugBloom.add(this.defaultOptions, "bloomEnabled").onChange(() => {
            this.bloomPass.enabled = this.defaultOptions.bloomEnabled;
        });
        this.debugBloom.add(this.defaultOptions, "bloomThreshold").min(-2).max(2).step(0.01).onChange(() => {
            this.bloomPass.threshold = this.defaultOptions.bloomThreshold;
        });
        this.debugBloom.add(this.defaultOptions, "bloomRadius").min(-2).max(2).step(0.01).onChange(() => {
            this.bloomPass.radius = this.defaultOptions.bloomRadius;
        });
        this.debugBloom.add(this.defaultOptions, "bloomStrength").min(0).max(1).step(0.01).name("bloomMultiplyer").onChange(() => {
            this.world.bloomMultiplyer = this.defaultOptions.bloomStrength;
            console.log(this.experience.renderer.bloomPass.strength);
        });
        
        // Firefliers size
        this.gui.add(this.firefliesMaretial.uniforms.uSize, 'value').min(0.0).max(500).step(1).name('fireFliesSize');

        this.gui.addColor(this.defaultOptions, 'clearColor').onChange(() => { 
            this.experience.renderer.instance.setClearColor(this.defaultOptions.clearColor); 
        })

    }
}
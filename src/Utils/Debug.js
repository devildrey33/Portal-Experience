import Experience from '../Experience.js'
import * as dat from 'lil-gui'

export default class Debug {

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
        animationSpeed          : 0.1,
        colorWaveTime           : 1.2,
        colorWaveAmplitude      : 0.5
    };
    
    constructor() {
        this.active = window.location.hash === '#debug'
        this.experience = new Experience();
    }

    
    createGUI() {
        // Exit if debug its not active
        if (this.active === false) return;

        this.gui = new dat.GUI({ width : 300 });

        // Get materials reference
        this.portalLightMaterial = this.experience.world.portal.portalLightMaterial;
        this.kabushMaretial      = this.experience.world.portalKabush.kabushMaretial;
        this.firefliesMaretial   = this.experience.world.fireFliers.firefliesMaretial;

        this.debugPortal = this.gui.addFolder("Portal")
//        this.gui.open(true)
        
        this.debugPortal.addColor(this.defaultOptions, 'portalColorStart').onChange(() => {
            this.portalLightMaterial.uniforms.uColorStart.value.set(this.defaultOptions.portalColorStart);
        })
        this.debugPortal.addColor(this.defaultOptions, 'portalColorEnd').onChange(() => {
            this.portalLightMaterial.uniforms.uColorEnd.value.set(this.defaultOptions.portalColorEnd);
        })
        
        this.debugPortal.add(this.defaultOptions, 'perlinNoiseStrength1').min(0.1).max(10).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseStrength1.value = this.defaultOptions.perlinNoiseStrength1;
        });
        
        this.debugPortal.add(this.defaultOptions, 'perlinNoiseStrength2').min(0.1).max(10).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseStrength2.value = this.defaultOptions.perlinNoiseStrength2;
        });
        
        this.debugPortal.add(this.defaultOptions, 'perlinNoiseTime1').min(0.01).max(1).step(0.001).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseTime1.value = this.defaultOptions.perlinNoiseTime1;
        });
        
        this.debugPortal.add(this.defaultOptions, 'perlinNoiseTime2').min(0.01).max(1).step(0.001).onChange(() => {
            this.portalLightMaterial.uniforms.uPerlinNoiseTime2.value = this.defaultOptions.perlinNoiseTime2;
        });
        
        this.debugPortal.add(this.defaultOptions, 'outherGlowStrength').min(0.1).max(300).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uOutherGlowStrength.value = this.defaultOptions.outherGlowStrength;
        });
        
        this.debugPortal.add(this.defaultOptions, 'outherGlowLimit').min(0.1).max(20).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uOutherGlowLimit.value = this.defaultOptions.outherGlowLimit;
        });
        
        this.debugPortalShow = this.debugPortal.addFolder("Portal show animation")
        this.debugPortalShow.add(this.defaultOptions, 'animationDelay').min(0).max(3).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uAnimationDelay.value = this.defaultOptions.animationDelay;
            this.kabushMaretial.uniforms.uAnimationDelay.value = this.defaultOptions.animationDelay;
        });
        
        this.debugPortalShow.add(this.defaultOptions, 'animationSpeed').min(0.1).max(10).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uAnimationSpeed.value = this.defaultOptions.animationSpeed;
            this.kabushMaretial.uniforms.uAnimationSpeed.value = this.defaultOptions.animationSpeed;
        });
        
        
        this.animateButton = { animate : () => { 
            this.portalLightMaterial.uniforms.uTime.value = 0; 
            this.kabushMaretial.uniforms.uTime.value = 0; 
        }}
        this.debugPortalShow.add(this.animateButton, 'animate').name("Animate StarGate");
        this.debugPortalWaves = this.debugPortal.addFolder("Portal waves animation")
        
        this.debugPortalWaves.add(this.defaultOptions, 'colorWaveTime').min(0.1).max(10).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uColorWaveTime.value = this.defaultOptions.colorWaveTime;
        });
        
        this.debugPortalWaves.add(this.defaultOptions, 'colorWaveAmplitude').min(0.1).max(2).step(0.01).onChange(() => {
            this.portalLightMaterial.uniforms.uColorWaveAmplitude.value = this.defaultOptions.colorWaveAmplitude;
        });
        
        // Firefliers size
        this.gui.add(this.firefliesMaretial.uniforms.uSize, 'value').min(0.0).max(500).step(1).name('fireFliesSize');

        this.gui.addColor(this.defaultOptions, 'clearColor').onChange(() => { 
            this.experience.renderer.instance.setClearColor(this.defaultOptions.clearColor); 
        })

    }
}
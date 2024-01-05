import * as THREE from 'three'
import Experience from "./Experience"

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export default class Renderer {
    // Costructor
    constructor() {
        // Get the experience instance
        this.experience = new Experience();
        this.canvas     = this.experience.canvas;
        this.sizes      = this.experience.sizes;
        this.scene      = this.experience.scene;
        this.camera     = this.experience.camera;
        this.time       = this.experience.time;
        this.debug      = this.experience.debug;

        this.setInstance();
    }

    /**
     * Create the renderer instance and set his configuration
    */
    setInstance() {
        this.instance = new THREE.WebGL1Renderer({
            canvas      : this.canvas, 
            antialias   : true
        })
        
        this.instance.physicallyCorrectLights = true;
        this.instance.outputEncoding = THREE.sRGBEncoding;
/*        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;*/
        this.instance.setClearColor('#211d20');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        /**
         * Post processing
         */
        this.effectComposer = new EffectComposer(this.instance);
        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // first pass 
        this.renderPass = new RenderPass(this.scene, this.camera.instance);
        this.effectComposer.addPass(this.renderPass);

        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.sizes.width, this.sizes.height ), 1.5, 0.4, 0.85 );
        this.bloomPass.threshold = this.debug.defaultOptions.bloomThreshold;
        this.bloomPass.strength  = 0.0;
        this.bloomPass.radius    = this.debug.defaultOptions.bloomRadius;        

        this.effectComposer.addPass(this.bloomPass);
    }

    /**
     * Function called on resize
     */
    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);

        this.effectComposer.setSize(this.sizes.width, this.sizes.height);
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    /**
     * Function called on update
     */
    update() {
//        this.bloomPass.strength = Math.sin(this.time.current * 2);
//        this.instance.render(this.scene, this.camera.instance);
        this.effectComposer.render();
    }
}
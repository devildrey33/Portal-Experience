import * as THREE from 'three'
import Experience from "../Experience";
import kabushVertexShader from "../Shaders/kabush/kabushVertex.glsl"
import kabushFragmentShader from "../Shaders/kabush/kabushFragment.glsl"


export default class PortalKabush {
    constructor() {
        this.experience     = new Experience();
        this.scene          = this.experience.scene;
        this.time           = this.experience.time;
        this.debug          = this.experience.debug;
        this.defaultOptions = this.experience.debug.defaultOptions;
        this.portal2DMesh   = this.experience.world.portal.portal2DMesh;
        this.setup();
    }


    setup() {

        this.kabushMaretial = new THREE.ShaderMaterial({
            transparent     : true,
            blending        : THREE.AdditiveBlending,   // Fusionate colors with the scene
            depthWrite      : false,                    // deactivate depthWrite to show objects behind
            uniforms        : {
                uTime                   : { value : 0 },
                uColorStart             : { value : new THREE.Color(this.defaultOptions.portalColorStart) },
                uColorEnd               : { value : new THREE.Color(this.defaultOptions.portalColorEnd) },
                uPixelRatio             : { value : Math.min(window.devicePixelRatio, 2) },
                uSize                   : { value : 50 },
                uAnimationDelay         : { value : this.defaultOptions.animationDelay },
                uAnimationSpeed         : { value : this.defaultOptions.animationSpeed },        
            },
            vertexShader    : kabushVertexShader,
            fragmentShader  : kabushFragmentShader
        });

        this.kabushGeometry      = new THREE.BufferGeometry();
        this.kabushCount         = 2000;
        this.kabushPositionArray = new Float32Array(this.kabushCount * 3);
        this.kabushScaleArray    = new Float32Array(this.kabushCount);
        this.kabushAngleArray    = new Float32Array(this.kabushCount);
        this.kabushRadiusArray   = new Float32Array(this.kabushCount);
        this.kabushRandArray     = new Float32Array(this.kabushCount);
    
        for (let i = 0; i < this.kabushCount; i++) {
            const angle  = Math.random() * 360;
            const radius = 0.1 + (Math.random() * 2);
            
            this.kabushPositionArray[i * 3 + 0] = this.portal2DMesh.position.x;
            this.kabushPositionArray[i * 3 + 1] = this.portal2DMesh.position.y;
            this.kabushPositionArray[i * 3 + 2] = this.portal2DMesh.position.z + 0.05; // from -1.75 to 1.75

            /*this.kabushPositionArray[i * 3 + 0] = this.portal2DMesh.position.x + (Math.cos(angle) * radius)
            this.kabushPositionArray[i * 3 + 1] = this.portal2DMesh.position.y + (Math.sin(angle) * radius);
            this.kabushPositionArray[i * 3 + 2] = (this.portal2DMesh.position.z + 0.05) - (radius * 0.5)  // from -1.75 to 1.75*/
    
            this.kabushScaleArray[i]  = Math.random();        
            this.kabushRandArray[i]   = Math.random();
            this.kabushAngleArray[i]  = angle;
            this.kabushRadiusArray[i] = radius;
        }
    
        this.kabushGeometry.setAttribute('position', new THREE.BufferAttribute(this.kabushPositionArray, 3));
        this.kabushGeometry.setAttribute('aScale',   new THREE.BufferAttribute(this.kabushScaleArray, 1));
        this.kabushGeometry.setAttribute('aRand',    new THREE.BufferAttribute(this.kabushRandArray, 1));
        this.kabushGeometry.setAttribute('aAngle',   new THREE.BufferAttribute(this.kabushAngleArray, 1));
        this.kabushGeometry.setAttribute('aRadius',  new THREE.BufferAttribute(this.kabushRadiusArray, 1));
        
        
        // Points
        this.kabush = new THREE.Points(this.kabushGeometry, this.kabushMaretial);
        this.scene.add(this.kabush);
    }


    // update the time on each frame adding delta time to ensure same result with diferent framerates
    update() {
        this.kabushMaretial.uniforms.uTime.value += this.time.delta;
    }

}

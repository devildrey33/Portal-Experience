import * as THREE from 'three'
import Experience from "../Experience";
import fireFliersVertexShader from "../Shaders/fireFlies/fireFliesVertex.glsl"
import fireFliersFragmentShader from "../Shaders/fireFlies/fireFliesFragment.glsl"

export default class FireFliers {
    constructor() {
        this.experience = new Experience();
        this.scene      = this.experience.scene;
        this.time       = this.experience.time;

        this.setup();
    }

    setup() {
        this.fireFliesGeometry      = new THREE.BufferGeometry();
        this.fireFlyesCount         = 30;
        this.fireFlyesPositionArray = new Float32Array(this.fireFlyesCount * 3);
        this.fireFlyesScaleArray    = new Float32Array(this.fireFlyesCount);
        
        for (let i = 0; i < this.fireFlyesCount; i++) {
            this.fireFlyesPositionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;   // from -2 to 2
            this.fireFlyesPositionArray[i * 3 + 1] = (Math.random() * 1.5);       // from 0 to 1.5
            this.fireFlyesPositionArray[i * 3 + 2] = (Math.random() - 0.5) * 3.5;   // from -1.75 to 1.75
        
            this.fireFlyesScaleArray[i] = Math.random();
        }
        
        this.fireFliesGeometry.setAttribute('position', new THREE.BufferAttribute(this.fireFlyesPositionArray, 3));
        this.fireFliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.fireFlyesScaleArray, 1));
        this.firefliesMaretial = new THREE.ShaderMaterial({
            transparent     : true,
            blending        : THREE.AdditiveBlending,   // Fusionate colors with the scene
            depthWrite      : false,                    // deactivate depthWrite to show objects behind
            uniforms        : {
                uTime       : { value : 0 },
                uPixelRatio : { value : Math.min(window.devicePixelRatio, 2) },
                uSize       : { value : 100 }
            },
            vertexShader    : fireFliersVertexShader,
            fragmentShader  : fireFliersFragmentShader
        });
        
        // Points
        this.fireFlies = new THREE.Points(this.fireFliesGeometry, this.firefliesMaretial);
        this.scene.add(this.fireFlies);        
    }

    // update the time on each frame adding delta time to ensure same result with diferent framerates
    update() {
        this.firefliesMaretial.uniforms.uTime.value += this.time.delta;
    }

}

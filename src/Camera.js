import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import Experience from "./Experience";


export default class Camera {
    // Constructor
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setOrbitControls();
    }


    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        const angle = 0.17 * Math.PI;
        this.instance.position.set(Math.cos(angle) * 8, 4, Math.sin(angle) * 8);        
        this.instance.lookAt(new THREE.Vector3(0, 0, 0));

        this.scene.add(this.instance);
    }


    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
//        this.controls.enableDamping = true;
        // Limit the view angle to avoid position the camera under the ground
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;

        
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        
    }
}
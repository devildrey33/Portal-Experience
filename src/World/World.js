import Experience from '../Experience.js'
import SceneMesh from './SceneMesh.js';
import Portal from './Portal.js'
import FireFliers from './FireFliers.js';
import PortalKabush from './PortalKabush.js';
import * as THREE from 'three';
import "../Utils/MathUtils.js";


export default class World {
    constructor() {
        this.experience      = new Experience();
        this.canvas          = this.experience.canvas;
        this.sizes           = this.experience.sizes;
        this.scene           = this.experience.scene;
        this.resources       = this.experience.resources;
        this.debug           = this.experience.debug;      
        this.renderer        = this.experience.renderer;  
        this.raycaster       = new THREE.Raycaster();
        this.mouse           = new THREE.Vector2(0, 0);
        this.portalHover     = false;
        this.bloomMultiplyer = this.debug.defaultOptions.bloomStrength;

        // Click event
        this.hEventClick = this.eventClick.bind(this);
        this.canvas.addEventListener("click", this.hEventClick);

        // Mouse move event
        this.hEventMouseMove = this.eventMouseMouve.bind(this);
        this.canvas.addEventListener("mousemove", this.hEventMouseMove);

        // wait for resources
        this.resources.on('ready', (p) => {
            // setup
            this.sceneMesh      = new SceneMesh();
            this.portal         = new Portal();
            this.portalKabush   = new PortalKabush();
            this.fireFliers     = new FireFliers();

            // init debug controls if they are enabled
            this.debug.createGUI();

            // reset all shader time vars, to ensure start all shaders with uTime set to 0
            this.setPortalTime(0);

        });        
    }

    /* Function to set the current portal time. 
       at 0 starts the open animation
       at 60 starts the end animation
     */
    setPortalTime(time) {
        this.portal.portalLightMaterial.uniforms.uTime.value  = time;
        this.portalKabush.kabushMaretial.uniforms.uTime.value = time;
    }

    // Gets the current portal time
    getPortalTime() {
        let time = this.portal.portalLightMaterial.uniforms.uTime.value;
        if (time < 0) time = 61;
        return time;
    }

    // Mouse move event
    eventMouseMouve(event) {
        this.mouse.x = event.clientX / this.sizes.width    * 2 - 1;
        this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1;
    }

    // Click event
    eventClick(event) {
        event.preventDefault();
        const time = this.getPortalTime();
        const delay = this.portal.portalLightMaterial.uniforms.uAnimationDelay.value;
        // if the mouse is hover the portal
        if (this.portalHover === true) {
            // if animations are runing, do nothing
            if (time < 1.0 + delay || (time > 60.0 && time < 61.0)) {
                return;
            }
            // if the gate its closed
            else if (time > 61.0) {
                this.setPortalTime(delay);
            }
            // if the gate is open
            else {
                this.setPortalTime(60);
            }
        }
    }

    // RayCaster for mouse detection, it only apply to the 2d portal
    updateRaycaster() {
        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        
        // Set portal hover to false by default
        this.portalHover = false;

        // Search the portal
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object === this.portal.portal2DMesh) {
                // Portal hover to true, because whe found it
                this.portalHover = true;
                break;
            }
        }

        // if the resolution doesn't seem a mobile
        if (this.sizes.width > 767) {
            // set the mouse cursor 
            // I DONT KNOW WHY, BUT WHEN I CHANGE THE CURSOR IN MOBILE, IT DOES A 
            // FULL SCREEN SELECTION, so this code only works if the width of the viewport its geater than 767
            document.body.style.cursor = (this.portalHover) ? "pointer" : "default";
        }
    }

    // updates bloom on each frame
    updateBloom() {
        const time  = this.getPortalTime();
        const delay = this.portal.portalLightMaterial.uniforms.uAnimationDelay.value;
        const speed = this.portal.portalLightMaterial.uniforms.uAnimationSpeed.value;

        if (time < 1.0 + delay ||  time < 61.0) {
            // clampTime after delay its 0 and then comes to one with the time
            const clampTime  = Math.clamp(((time - delay) * speed), 0.0, 1.0);
            // use the same cubic-bezier values of the kabush to start
            const bloomStart = Math.cubicBezier(0.0, 0.0, 1.4, 1, clampTime);
            // if time its below 60 its because portal its open
            if (time < 60.0) {
                // apply strength
                this.renderer.bloomPass.strength = Math.abs(bloomStart * this.bloomMultiplyer);
                // add a wave effect to strength
                this.renderer.bloomPass.strength += (Math.sin(time * 1.2) * 0.10);
                this.lastStrength = this.renderer.bloomPass.strength;
            }
            // Portal is closing
            else {
                // need to decrease the last wave to 0 smoothly
                this.renderer.bloomPass.strength -= this.lastStrength / 30;
                //console.log(bloomStart, bloomEnd, this.renderer.bloomPass.strength);
            }
        }
        // Portal is closed
        else {
            this.renderer.bloomPass.strength = 0;
        }
    }

    // Updates values for the world
    update() {
        if (this.resources.finished) {
            this.portal.update();
            this.portalKabush.update();
            this.fireFliers.update();

            this.updateRaycaster();
            this.updateBloom();
        }
    }
}


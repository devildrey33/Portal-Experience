import Experience from '../Experience.js'
import SceneMesh from './SceneMesh.js';
import Portal from './Portal.js'
import FireFliers from './FireFliers.js';
import PortalKabush from './PortalKabush.js';
import * as THREE from 'three';


export default class World {
    constructor() {
        this.experience  = new Experience();
        this.canvas      = this.experience.canvas;
        this.sizes       = this.experience.sizes;
        this.scene       = this.experience.scene;
        this.resources   = this.experience.resources;
        this.debug       = this.experience.debug;        
        this.raycaster   = new THREE.Raycaster();
        this.mouse       = new THREE.Vector2(0, 0);
        this.portalHover = false;

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

    /* Function to set the portal current time. 
       at 0 starts the open animation
       at 60 starts the end animation
     */
    setPortalTime(time) {
        this.portal.portalLightMaterial.uniforms.uTime.value  = time;
        this.portalKabush.kabushMaretial.uniforms.uTime.value = time;
    }

    getPortalTime() {
        return this.portal.portalLightMaterial.uniforms.uTime.value;
    }

    eventMouseMouve(event) {
        this.mouse.x = event.clientX / this.sizes.width    * 2 - 1;
        this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1;
    }

    eventClick(event) {
        const time = this.getPortalTime();
        const delay = this.portal.portalLightMaterial.uniforms.uAnimationDelay.value;
        console.log(delay)
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

    updateRaycaster() {
        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        this.portalHover = false;

        // Search the portal
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object === this.portal.portal2DMesh) {
                this.portalHover = true;
                break;
            }
        }

        // set the mouse cursor
        this.canvas.style.cursor = (this.portalHover) ? "pointer" : "default";
    }

    // Updates values for portal2D, portalKabush and fireFliers
    update() {
        if (this.resources.finished) {
            this.portal.update();
            this.portalKabush.update();
            this.fireFliers.update();

            this.updateRaycaster();
        }
    }
}
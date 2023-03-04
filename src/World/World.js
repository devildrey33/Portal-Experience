import Experience from '../Experience.js'
import SceneMesh from './SceneMesh.js';
import Portal from './Portal.js'
import FireFliers from './FireFliers.js';
import PortalKabush from './PortalKabush.js';


export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene      = this.experience.scene;
        this.resources  = this.experience.resources;
        this.debug      = this.experience.debug;


        // wait for resources
        this.resources.on('ready', (p) => {

            // setup
            this.sceneMesh  = new SceneMesh();
            this.portal     = new Portal();
            this.portalKabush     = new PortalKabush();
            this.fireFliers = new FireFliers();
//            this.environment = new Environment();

            // init debug controls if they are enabled
            this.debug.createGUI();


            // reset all shader time vars, to ensure start all shaders with uTime set to 0
            this.portal.portalLightMaterial.uniforms.uTime.value = 0;

            console.log("resources rdy2")
        });
        
    }

    // Updates values for portal2D, portalKabush and fireFliers
    update() {
        if (this.resources.finished) {
            this.portal.update();
            this.portalKabush.update();
            this.fireFliers.update();
        }
    }
}
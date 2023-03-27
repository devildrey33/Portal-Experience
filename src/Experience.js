import * as THREE from 'three'
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import World from './World/World.js'
import Resources from './Utils/Resources.js';
import Debug from "./Utils/Debug.js"
import HTMLElements from './Utils/HTMLElements.js';
import sources from './ResourcesToLoad.js'

let experienceInstance = null;

export default class Experience {

    optionsExperienceByDefault = {
        // Y position. Use 'auto' to center canvas horizontaly to the view port
        top                     : 0,
        // X position. Use 'auto' to center canvas verticaly to the view port
        left                    : 0,
        // Width in pixels. Use 'auto' to fit all viewport width
        width                   : "auto",           
        // Height in pixels. Use 'auto' to fit all viewport height
        height                  : "auto",           
        // Show framerate inside the butons frame
        showFPS                 : false,            
        // Show full screen buton in the buttons frame
        buttonFullScreen        : false,            
        // Show my logo buton in the buttons frame (that redirects to devildrey33.es)
        buttonLogo              : false,            
        // Element where canvas is inserted (by default is document.body)
        // For example you can use document.getElementById() to retrieve tag inside you want to create the canvas
        rootElement             : document.body,
        // Anti alias (by default true)
        antialias               : true
    };


    // Constructor
    constructor(options) {
        // Look for previous instance
        if (experienceInstance) {
            // return the previous instance
            return experienceInstance;
        }
        experienceInstance = this;

        // Setup the default options
        this.options = this.optionsExperienceByDefault;
        // If options is an object 
        if (typeof(options) === "object") {
            // Overwrite the current option in the options of the experience
            for (let indice in options) {
                this.options[indice] = options[indice];
            }                        
        }


        // Create the html tags and insert into body (canvas, buttons, fps, loading and error messages)
        this.htmlElements   = new HTMLElements();


        this.sizes          = new Sizes();
        this.canvas         = this.htmlElements.elementCanvas;

/*        this.audioAnalizer  = new AudioAnalizer();
        this.audioAnalizer.start(2048, () => {}, () => {});        
        this.audioAnalizer.loadSong("/songs/01. Handshake with Hell.flac");
        window.addEventListener("click", () => { this.audioAnalizer.playPause(); })*/

        this.debug          = new Debug();
        this.time           = new Time();
        this.scene          = new THREE.Scene();
        this.resources      = new Resources(sources);
        this.camera         = new Camera();
        this.renderer       = new Renderer();
        this.world          = new World();

        

        // Listen events
        this.sizes.on('resize', () => { this.resize(); })
        this.time.on ('tick'  , () => { this.update(); })

    }


    get loading() {
        let Ret = this.htmlElements.elementExperience.getAttribute("loading");
        return (Ret === "true" || Ret === true);
    }

    set loading(isLoading) {
        this.htmlElements.elementExperience.setAttribute("loading", isLoading);
    }

    /**
     * Function called on resize
    */
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    /**
     * Function called when a frame is about to update
    */
    update() {
        this.camera.update();
//        this.audioAnalizer.update();
        this.world.update();
        this.renderer.update();
    }
 



    /** 
     * This function destroy the whole scene
     */
    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof(value.dispose) === 'function') {
                        value.dispose()
                    }
                }
            }
        })
        // orbit
        this.camera.controls.dispose();
        // renderer
        this.renderer.instance.dispose();
        
        if (this.debug.active) {
            this.debug.ui.destroy();
        }
    }
}    

import * as THREE from 'three'
import Experience from "../Experience";

export default class SceneMesh {
    constructor() {
        this.experience = new Experience();
        this.scene      = this.experience.scene;
        this.resources  = this.experience.resources;

        this.setup();
    }


    setup() {
        // Get a reference of the 4 main meshes
        this.portal2DMesh = this.resources.portalLightMesh;
        this.poleAMesh    = this.resources.poleAMesh;
        this.poleBMesh    = this.resources.poleBMesh;
        this.portalScene  = this.resources.portalSceneMesh;

        // Create a material for the pole lights
        this.poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

        // Set the pole light materials to pole lights
        this.poleAMesh.material = this.poleLightMaterial;
        this.poleBMesh.material = this.poleLightMaterial;
        
        // Adapt the blender texture to three.js
        this.resources.portalSceneTexture.flipY = false;                // disable flipY because its a blender texture
        this.resources.portalSceneTexture.encoding = THREE.sRGBEncoding // set color encoding like blender
        // Create a new material to use in the main scene texture
        this.sceneMaterial = new THREE.MeshBasicMaterial({ map : this.resources.portalSceneTexture});
        // Set the scene material
        this.resources.portalSceneMesh.material = this.sceneMaterial;
        // add the scene
        this.scene.add(this.resources.fullScene);



/*        this.geometry = new THREE.PlaneGeometry(30, 30);
        this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshStandardMaterial({
            color : new THREE.Color(0x15092d) ,
            metalness : 8.5,
            roughness : .4
        }));
        this.mesh.rotation.x = - Math.PI * 0.5
        this.mesh.receiveShadow = true;
        this.mesh.position.y = 0.050;
        this.scene.add(this.mesh);*/
    }
}
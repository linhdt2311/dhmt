import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Experience from "./Experience.js";

export default class SetUp {
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    constructor(){
		this.experience = new Experience();
        this.scene = this.experience.scene;
        this.init();
        this.setLight();
        this.setCamera();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate());
    }

    init() {
        this.camera.position.set(-35, 70, 100);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.background = new THREE.Color(0xbfd1e5);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enable = true;
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', this.onWindowResize());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        //dragObject();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate());
    }
    
    setLight() {
        let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
        this.scene.add(hemiLight);
        
        let dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(-30, 50, -30);
        this.scene.add(dirLight);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.left = -70;
        dirLight.shadow.camera.right = 70;
        dirLight.shadow.camera.top = 70;
        dirLight.shadow.camera.bottom = -70;
    }
    
    setCamera() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set(0, 0, 0);
        controls.minDistance = 0;
        controls.maxDistance = 200.0;
        controls.update();
    }
}
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export default class SetUp {
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    scene = new THREE.Scene();
    transformControls = new TransformControls(this.camera, this.renderer.domElement);
    controls = new OrbitControls(this.camera, this.renderer.domElement);
    constructor() {
        this.init();
        this.setLight();
        this.setCamera();
        this.animate();
    }

    init() {
        this.camera.position.set(-35, 100, 300);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.background = new THREE.Color(0xbfd1e5);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize());
        this.transformControls.enabled = false;
        this.transformControls.mode = "translate";
        this.scene.add(this.transformControls);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        //dragObject();
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
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
        this.controls.maxPolarAngle = Math.PI * 0.495;
        this.controls.target.set(0, 0, 0);
        this.controls.minDistance = 0;
        this.controls.maxDistance = 200.0;
        this.controls.update();
    }
}
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export default class SetUp {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 2, 1500);
    canvas = document.getElementById('myCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    scene = new THREE.Scene();
    transformControls = new TransformControls(this.camera, this.renderer.domElement);
    controls = new OrbitControls(this.camera, this.renderer.domElement);
    raycaster = new THREE.Raycaster();
    clickMouse = new THREE.Vector2();
    moveMouse = new THREE.Vector2();
    group = new THREE.Group();
    groupModel = new THREE.Group();
    axesHelper = new THREE.AxesHelper( 1 );
    constructor() {
        this.init();
        this.setLight();
        this.setCamera();
        this.animate();
    }

    init() {
        this.camera.position.set(-35, 100, 200);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.background = new THREE.Color(0xbfd1e5);
        var myCanvas = document.getElementById('myCanvas');

        myCanvas.height = window.innerHeight;
        this.renderer.domElement = myCanvas;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(myCanvas.innerWidth, myCanvas.innerHeight);
        this.camera.aspect =  myCanvas.innerWidth / myCanvas.innerHeight;
        this.renderer.shadowMap.enabled = true;
        // document.body.appendChild(this.renderer.domElement);
        window.addEventListener("resize", this.onWindowResize());
        this.transformControls.enabled = false;
        this.transformControls.mode = "translate";
        this.scene.add(this.transformControls);
        this.scene.add( this.axesHelper );
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
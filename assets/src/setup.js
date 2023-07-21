import * as THREE from "three";
import { AmbientLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

export default class SetUp {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    2,
    1500
  );
  gradiantBackGroundUrl = "https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/images%2Fgradient.png?alt=media&token=3acf96bc-369a-40a8-a7fa-cf081d289b52";
  canvas = document.getElementById("myCanvas");
  renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  scene = new THREE.Scene();
  transformControls = new TransformControls(
    this.camera,
    this.renderer.domElement
  );
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  raycaster = new THREE.Raycaster();
  clickMouse = new THREE.Vector2();
  moveMouse = new THREE.Vector2();
  group = new THREE.Group();
  groupModel = new THREE.Group();
  axesHelper = new THREE.AxesHelper(1);
  constructor() {
    this.init();
    this.setLight();
    this.setCamera();
    this.animate();
  }


  init() {
    this.camera.position.set(-35, 100, 200);
    this.camera.lookAt(new THREE.Vector3(0, 0, 20));
    const loader = new THREE.TextureLoader();
    loader.load(this.gradiantBackGroundUrl, (texture) => {
      this.scene.background = texture;
    });
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.6;

    var myCanvas = document.getElementById("myCanvas");

    myCanvas.height = window.innerHeight;
    this.renderer.domElement = myCanvas;
  
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(myCanvas.innerWidth, myCanvas.innerHeight);
    this.camera.aspect = myCanvas.innerWidth / myCanvas.innerHeight;
   
    this.renderer.shadowMap.enabled = true;

    window.addEventListener("resize", this.onWindowResize());
    this.transformControls.enabled = false;
    this.transformControls.mode = "translate";
    this.transformControls.showY = false;
    this.scene.add(this.transformControls);
    this.scene.add(this.axesHelper);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    //dragObject();
    this.controls.update();
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  setLight() {
    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0);
    // hemiLight.color.setHSL(0, 0, 0);
    // hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    // hemiLight.position.set(0, 100, 0);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.75);
    dirLight.position.set(10, 10, 10);
		dirLight.target.position.set(0, 0, 0)
    dirLight.castShadow = true;
    // dirLight.shadow.mapSize.width = 2048;
    // dirLight.shadow.mapSize.height = 2048;
    // dirLight.shadow.camera.left = -70;
    // dirLight.shadow.camera.right = 70;
    // dirLight.shadow.camera.top = 70;
    // dirLight.shadow.camera.bottom = -70;

    // const topDownSpotLight = new SpotLight(0xffffff, 1, 10);

    const ambientLight = new AmbientLight(0xffffff, 0.3)

    this.scene.add(ambientLight, dirLight);
  }

  setCamera() {
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = 0;
    this.controls.maxDistance = 200.0;
    this.controls.update();
  }
}

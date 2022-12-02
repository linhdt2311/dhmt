import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const houseLoader = new GLTFLoader();
let houseMesh, light;

init();

function init() {
	scene.background = new THREE.Color('green');
	camera.position.set(0, 2, 2);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	document.body.appendChild(renderer.domElement);
	setLight();
	loadGLTF();
	animate();
	setCamera();
}

function setLight() {
	light = new THREE.AmbientLight(0xffffff);
	scene.add(light);
}

function loadGLTF() {
	houseLoader.load('/models/blenderKitTestModel.glb', (gltf) => {
		houseMesh = gltf.scene;
		scene.add(houseMesh);
		houseMesh.scale.set(0.2, 0.2, 0.2);
		houseMesh.position.set(0, 0, 0);
	});
}

function animate() {
	requestAnimationFrame(animate);
	if (houseMesh && houseMesh.rotation) {
		houseMesh.rotation.y -= 0.005;
	}
	renderer.render(scene, camera);
	window.addEventListener('resize', onWindowResize());
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function setCamera() {
	controls = new OrbitControls(camera, renderer.domElement);
	controls.maxPolarAngle = Math.PI * 0.495;
	controls.target.set(0, 0, 0);
	controls.minDistance = 40.0;
	controls.maxDistance = 200.0;
	controls.update();
}

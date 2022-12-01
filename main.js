import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
let houseMesh;
let light;

function init(){
	scene.background = new THREE.Color('green');
	camera.position.set(0, 1, 2);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
}

function setLight(){
	light = new THREE.AmbientLight(0xffffff);
	scene.add(light);
}

function loadGLTF(){
	const  houseLoader = new GLTFLoader();
	houseLoader.load('/models/shapeModel.glb', (gltf) => {
		houseMesh = gltf.scene;
		houseMesh.scale.set(0.2, 0.2, 0.2);
		scene.add(houseMesh);
		houseMesh.position.set(0, 0, 0);
	});
}

function animate(){
	requestAnimationFrame(animate);
	if(houseMesh && houseMesh.rotation){
		houseMesh.rotation.y -= 0.005;
	}
	renderer.render(scene, camera);
}

init();
setLight();
loadGLTF();
animate();
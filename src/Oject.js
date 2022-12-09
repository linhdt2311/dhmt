import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Experience from "./Experience.js";

export default class Object {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.plane();
		this.box();
		this.sphere();
		this.batmanObj();
		this.batmanGltf();
	}
	plane() {
		const plane = new THREE.Mesh(new THREE.BoxBufferGeometry(),
			new THREE.MeshPhongMaterial({ color: 0xf9c834 }));
		plane.position.set(0, -1, 3);
		plane.scale.set(200, 2, 200);
		plane.castShadow = true;
		plane.receiveShadow = true;
		this.scene.add(plane);

		plane.userData.ground = true
	}

	box() {
		const box = new THREE.Mesh(new THREE.BoxBufferGeometry(),
			new THREE.MeshPhongMaterial({ color: 0xDC143C }));
		box.position.set(15, 3, 15);
		box.scale.set(6, 6, 6);
		box.castShadow = true;
		box.receiveShadow = true;
		this.scene.add(box)

		box.userData.draggable = true
		box.userData.name = 'BOX'
	}

	sphere() {
		const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(4, 32, 32),
			new THREE.MeshPhongMaterial({ color: 0x43a1f4 }))
		sphere.position.set(15, 4, -15)
		sphere.castShadow = true
		sphere.receiveShadow = true
		scene.add(sphere)
		sphere.userData.draggable = true
		sphere.userData.name = 'SPHERE'
	}

	cylinder() {
		const cylinder = new THREE.Mesh(new THREE.CylinderBufferGeometry(4, 4, 6, 32),
			new THREE.MeshPhongMaterial({ color: 0x90ee90 }));
		cylinder.position.set(-15, 3, 15);
		cylinder.castShadow = true;
		cylinder.receiveShadow = true;
		this.scene.add(cylinder);
		cylinder.userData.draggable = true
		cylinder.userData.name = 'CYLINDER'
	}

	batmanObj() {
		const objLoader = new OBJLoader();
		objLoader.load('/models/batman.obj', function (obj) {
			const batman = obj.children[0];
			batman.position.set(-15, 0, -15);
			batman.scale.set(5, 5, 5);
			batman.castShadow = true
			batman.receiveShadow = true
			this.scene.add(batman);
			batman.userData.draggable = true
			batman.userData.name = 'BATMANOBJ';

		})
	}

	batmanGltf() {
		const gltfLoader = new GLTFLoader();
		gltfLoader.load('/models/batman.glb', function (gltf) {
			const batman = gltf.scene;
			batman.position.set(0, 0, 0);
			batman.scale.set(10, 10, 10);
			batman.castShadow = true;
			batman.receiveShadow = true;
			this.scene.add(batman);
			batman.userData.draggable = true;
			batman.userData.name = 'BATMANGLTF';
		});
	}
}
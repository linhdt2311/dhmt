import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import SetUp from "./Setup";

export default class Object {
  setUp = new SetUp();
  group = this.setUp.group;
  scene = this.setUp.scene;
  constructor() {
    this.sphere();
    this.cylinder();
    //this.batmanGltf();
    this.loadFloor();
  }
  loadFloor() {
    const gltfLoader = new GLTFLoader();
    let floor;
    gltfLoader.loadAsync("/models/floorPlan.glb").then((gltf) => {
      floor = gltf.scene;
      this.group.add(floor);
      this.group.position.set(0, 1, 0);
      this.group.scale.set(3, 3, 3);
      this.group.castShadow = true;
      this.group.receiveShadow = true;
      this.group.userData.name = "FloorPlan";
      this.group.userData.type = "Plane";
      this.scene.add(this.group);
    });
  }


  sphere() {
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(4, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0x43a1f4 })
    );
    sphere.position.set(15, 4, -15);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.scene.add(sphere);
    sphere.userData.name = "SPHERE";
    sphere.userData.material = "Vibranium";
  }

  cylinder() {
    const cylinder = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(4, 4, 6, 32),
      new THREE.MeshPhongMaterial({ color: 0x90ee90 })
    );
    cylinder.position.set(-15, 3, 15);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    this.scene.add(cylinder);
    cylinder.userData.draggable = true;
    cylinder.userData.name = "CYLINDER";
    cylinder.userData.material = "Vibranium";
  }

  batmanGltf() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("/models/batman.glb", function (gltf) {
      const batman = gltf.scene;
      batman.position.set(0, 0, 0);
      batman.scale.set(10, 10, 10);
      batman.castShadow = true;
      batman.receiveShadow = true;
      this.scene.add(batman);
      batman.userData.draggable = true;
      batman.userData.name = "BATMANGLTF";
    });
  }
}

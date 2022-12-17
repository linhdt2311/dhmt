import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import SetUp from "./Setup";

export default class Object {
  setUp = new SetUp();
  group = this.setUp.group;
  groupModel = this.setUp.groupModel;
  scene = this.setUp.scene;
  listModel = [];
  constructor() {
    this.fetchData();
    this.addModel();
    this.loadFloor();
  }

  loadFloor() {
    const gltfLoader = new GLTFLoader();
    let floor;
    gltfLoader.loadAsync("/models/floorPlan.glb").then((gltf) => {
      floor = gltf.scene;
      for (let i = 0; i < floor.children.length; i++) {
        floor.children[i].userData.name = "Plane";
        floor.children[i].userData.type = "Plane";
      };
      this.group.add(floor);
      this.group.position.set(0, 1, 0);
      this.group.scale.set(3, 3, 3);
      this.group.castShadow = true;
      this.group.receiveShadow = true;
      this.group.userData.name = "Plane";
      this.group.userData.type = "Plane";
      this.scene.add(this.group);
    });
  }

  async fetchData() {
    var modelList = document.getElementById('object');
    await fetch('./data/data.json')
      .then((response) => response.json())
      .then((json) => {
        this.listModel = [...json];
        let stringHtml = '';
        this.listModel.forEach(item => {
          stringHtml += `
            <div>Name: ${item.name}</div>
            <div>Material: ${item.material}</div>
          `
        })
        modelList.innerHTML = stringHtml;
      });
  }

  loadModel(id) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../node_modules/three/examples/js/libs/draco/gltf/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const model = this.listModel.find(item => item.id === id);
    gltfLoader.loadAsync(model.url).then((gltf) => {
      this.groupModel.add(gltf.scene)
      this.groupModel.position.set(0, 0, 0);
      this.groupModel.scale.set(10, 10, 10);
      this.groupModel.castShadow = true;
      this.groupModel.receiveShadow = true;
      this.scene.add(this.groupModel);
      this.groupModel.userData.draggable = true;
      this.groupModel.userData.name = "BATMANGLTF";
      this.groupModel.userData.material = "Vibranium";
    });
  }

  addModel() {
    const modelList = document.getElementById('modelList');
    modelList.addEventListener("click", () => {
      this.loadModel('ebeec382-8259-4e37-9014-b2e5c8181682');
    })
  }
}

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import SetUp from "./Setup";

export default class Object {
  setUp = new SetUp();
  group = this.setUp.group;
  groupModel = this.setUp.groupModel;
  scene = this.setUp.scene;
  listModel = [];
  model;
  constructor() {
    this.fetchData();
    this.loadFloor();
    setTimeout(() => {
      this.addModel();
    }, 1500);
  }

  loadFloor() {
    const gltfLoader = new GLTFLoader();
    let floor;
    gltfLoader.loadAsync("/models/floorPlan.glb").then((gltf) => {
      floor = gltf.scene;
      for (let i = 0; i < floor.children.length; i++) {
        floor.children[i].userData.name = "Plane";
        floor.children[i].userData.type = "Plane";
      }
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
    var modelList = document.getElementById("model");
    await fetch("./data/data.json")
      .then((response) => response.json())
      .then((json) => {
        this.listModel = [...json];
        let stringHtml = "";
        this.listModel.forEach((item) => {
          stringHtml += `
          <div class="flex flex-column list-model">
          <div class="row">
          <div class="col col-12">
          <div class="card p-0 border-0" style="border-radius: unset !important">
          <div class="card-header border-0 rounded" id="heading-${item.type}">
          <h5 class="mb-0">
          <a style="color: #888" role="button" data-bs-toggle="collapse" href="#${
            item.type
          }"
          aria-expanded="false" aria-controls="${item.type}"
          class="text-uppercase">
           ${item.type}
          </a>
          </h5>
          </div>
            <div id="${
              item.type
            }" class="collapse" style="transition: 0.8s ease-in-out;
            border-radius: 0 !important;
            " data-parent="#accordion" aria-labelledby="heading-${item.type}">
              ${this.loadDetailObject(item)}
            </div>
          </div>
          </div>
          </div>
          </div>
            `;
        });
        modelList.innerHTML = stringHtml;
      });
  }

  loadDetailObject(data) {
    let stringHtml = "";
    data.list.forEach((item) => {
      stringHtml += `
      <div class="card-body">
          <div class="d-flex row">
            <div class="col col-5">
              <img width="100%" height="100%" src="${item.photoUrl}">
            </div>
            <div class="col col-7">
            <span class="fw-bold">${item.name}</span>
            <p class="fst-italic">${item.description}</p>
          </div>
          </div>
        
     <button  id=but-${item.id} class="d-flex" >
     <div style="display:none">
     <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
     </div>
     Load</button>
     </div>
     `;
    });
    return stringHtml;
  }

  async loadModel(id) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "../node_modules/three/examples/js/libs/draco/gltf/"
    );
    dracoLoader.setDecoderConfig({ type: "js" });
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    for(const item of this.listModel) {
      this.model = item.list.find((x) => x.id == id);
      if(this.model != undefined) { break; }
    }
    await gltfLoader.loadAsync(this.model.url).then((gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(10, 10, 10);
      model.castShadow = true;
      model.receiveShadow = true;
      this.scene.add(model);
      model.userData.draggable = true;
      model.userData.name = this.model.name;
      model.userData.description = this.model.description;
      model.userData.size = this.model.size;
      model.userData.material = this.model.material;
      model.userData.origin = this.model.origin;
      model.userData.price = this.model.price;
      model.userData.photoUrl = this.model.photoUrl;
      model.userData.type = this.model.type;
      model.userData.insurance = this.model.insurance;
    });
  }

  addModel() {
    const btns = document.querySelectorAll("button[id^=but]");
    btns.forEach((btn) => {
      btn.addEventListener("click", (event) => this.handleLoad(event));
    });
  }

  async handleLoad(event) {
    const loadBtn = document.getElementById(event.target.id);
    const loadingState = loadBtn.firstElementChild;
    loadingState.style.display = "block";
    loadBtn.setAttribute("disabled", true);
    const id = event.target.id.slice(4);
    await this.loadModel(id);
    loadingState.style.display = "none";
    loadBtn.removeAttribute("disabled");
  }
}

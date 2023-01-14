import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import SetUp from "./Setup";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { Auth } from "/auth.js";
export default class Object {
  setUp = new SetUp();
  auth = new Auth();
  dracoLoader = new DRACOLoader();
  gltfLoader = new GLTFLoader();
  database = this.auth.database;
  group = this.setUp.group;
  groupModel = this.setUp.groupModel;
  scene = this.setUp.scene;
  listModel = [];
  storeModel = [];
  loading = document.getElementById("loading");
  model;
  constructor() {
    this.initLoader();
    this.fetchData();
    setTimeout(() => {
      this.loadFloor();
      this.fetchModel();
      this.addModel();
    }, 2000);
    this.saveModel();
  }

  initLoader() {
    this.dracoLoader.setDecoderPath(
      "../node_modules/three/examples/js/libs/draco/gltf/"
    );
    this.dracoLoader.setDecoderConfig({ type: "js" });
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  loadFloor() {
    let floor;
    this.gltfLoader.loadAsync("/models/floorPlan.glb").then((gltf) => {
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
          <div class="card-header border-0 " id="heading-${item.type}">
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
            <div class="col col-5 ">
            <div class="img-wrap" style="cursor: pointer"  id=but-${item.id}>
              <img class="img-content w-100" height="80px"  src="${item.photoUrl}">
              <p class="img-des m-0 text-center" >
              <span class="fw-bold" style="line-height: 80px;">Load</span>
              <div class="spinner" style="display:none">
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              </p>
              </div>
            </div>
            </div>
            <div class="col col-7">
            <span class="fw-bold">${item.name}</span>
            <p class="fst-italic">${item.description}</p>
          </div>
          </div>
          </div>
        
     `;
    });
    return stringHtml;
  }

 async fetchModel() {
    const data = JSON.parse(localStorage.getItem("models"));
    if (data) {
      this.storeModel = [...data];
      for (const item of data) {
        // Cannot async/ await forEach, map func
        await this.loadModelFromStore(item.id);
      }
    }
  }

  async loadModelFromList(id) {
    this.listModel.every((item) => {
      this.model = item.list.find((x) => x.id == id);
      if (this.model) return false;
      else return true;
    });
    await this.loadModelByUrl(this.model.url);
  }

  async loadModelFromStore(id) {
    this.loading.style.display = "block";
    this.model = this.storeModel.find((item) => item.id == id);
    await this.loadModelByUrl(this.model.url);
    this.loading.style.display = "none";
  }

  async loadModelByUrl(url) {
    await this.gltfLoader.loadAsync(url).then((gltf) => {
      const model = gltf.scene;
      model.castShadow = true;
      model.receiveShadow = true;
      if (this.model.position) {
        model.position.set(
          this.model.position.x,
          this.model.position.y,
          this.model.position.z
        );
        model.scale.set(
          this.model.scale.x,
          this.model.scale.y,
          this.model.scale.z
        );
        model.rotation.set(
          this.model.rotation.x,
          this.model.rotation.y,
          this.model.rotation.z
        );
      } else {
        model.position.set(0, 0, 0);
        model.scale.set(10, 10, 10);
        model.rotation.set(0, 0, 0);
      }
      model.userData.draggable = true;
      model.userData.id = this.model.id;
      model.userData.name = this.model.name;
      model.userData.description = this.model.description;
      model.userData.size = this.model.size;
      model.userData.material = this.model.material;
      model.userData.origin = this.model.origin;
      model.userData.price = this.model.price;
      model.userData.photoUrl = this.model.photoUrl;
      model.userData.type = this.model.type;
      model.userData.insurance = this.model.insurance;
      model.userData.url = this.model.url;
      this.scene.add(model);
    });
  }

  addModel() {
    const btns = document.querySelectorAll("div[id^=but]");
    btns.forEach((btn) => {
      btn.addEventListener("click", (event) => this.handleLoad(event));
    });
  }

  async handleLoad(event) {
    const loadBtn = document.getElementById(event.currentTarget.id);
    const loadingState = document.getElementsByClassName("spinner");
    for(let item of loadingState){
      item.style.display = "block";
    }
    loadBtn.setAttribute("disabled", true);
    const id = event.currentTarget.id.slice(4);
    await this.loadModelFromList(id);
    for(let item of loadingState){
      item.style.display = "none";
    }
  }

  saveModel() {
    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", (event) => {
      let data = [];
      this.setUp.animate();
      this.scene.children.forEach((item) => {
        if (item.type === "Group" && item.userData.type !== "Plane") {
          data.push({
            ...item.userData,
            position: item.position,
            rotation: {
              x: item.rotation._x,
              y: item.rotation._y,
              z: item.rotation._z,
            },
            scale: item.scale,
          });
        }
      });
      this.onSaveData(data);
    });
  }

  onSaveData(data) {
    const user = JSON.parse(localStorage.getItem("user"));
    this.loading.style.display = "block";
    set(ref(this.database, "users/" + user.uid), {
      models: data,
    }).then(() => {
      this.loading.style.display = "none";
      localStorage.setItem('models', JSON.stringify(data));
    });
  }
}

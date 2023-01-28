import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import SetUp from "./setup";
import { getDatabase, ref, child, get, set } from "firebase/database";
import { getStorage, ref as sRef } from "firebase/storage";
import { Auth } from "./auth.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Object {
  setUp = new SetUp();
  auth = new Auth();
  dracoLoader = new DRACOLoader();
  gltfLoader = new GLTFLoader();
  database = this.auth.database;
  group = this.setUp.group;
  groupModel = this.setUp.groupModel;
  listModel = [];
  storeModel = [];
  loading = document.getElementById("loading");
  toastLiveExample = document.getElementById("liveToast");
  previewCanvas = null;
  previewModal = null;
  scene = null;
  camera = null;
  controls = null;
  model;
  storage = getStorage();
  floorUrl =
    "https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/models%2FfloorPlan.glb?alt=media&token=55f0fde5-5419-438b-9dd4-87b15da442ff";
  constructor() {
    this.initLoader();
    this.fetchData();
    setTimeout(() => {
      this.loadFloor();
      this.fetchModel();
      this.addModel();
      this.previewCanvas = document.getElementById("previewCanvas");
      this.previewModal = document.getElementById("preview-modal");
      // this.renderer = new THREE.WebGLRenderer({ canvas: previewCanvas });
      this.onPreviewModel();
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
    // const httpsReference = sRef(this.storage, 'gs://da-dhmt.appspot.com/models/floorPlan.glb');
    this.gltfLoader.loadAsync(this.floorUrl).then((gltf) => {
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
      this.setUp.scene.add(this.group);
    });
  }

  async fetchData() {
    var modelList = document.getElementById("model");
    this.listModel = JSON.parse(localStorage.getItem("data"));
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
            <button  data-bs-toggle="modal" data-bs-target="#preview-modal" data-preview-id=pre-${item.id}>Preview</button>
            <p class="fst-italic">${item.description}</p>
          </div>
          </div>
          </div>
        
         
     `;
    });
    stringHtml += ` <div class="modal modal-lg" tabindex="-1" id="preview-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Preview model</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
            </div>
            <div class="modal-body">
              <canvas width="100%" height="300px" id="previewCanvas"></canvas>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <a class="btn btn-danger btn-delete" data-bs-dismiss="modal"  id="load" >Load</a>
            </div>
        </div>
    </div>
  </div>`;
    return stringHtml;
  }

  async fetchModel() {
    const data = JSON.parse(localStorage.getItem("userModels"));
    if (data) {
      this.storeModel = [...data];
      for (const item of data) {
        // Cannot async/ await forEach, map func
        await this.loadUserModels(item.id, this.setUp.scene);
      }
    }
  }

  async loadListModels(id) {
    this.listModel.every((item) => {
      this.model = item.list.find((x) => x.id == id);
      if (this.model) return false;
      else return true;
    });
    await this.loadModelByUrl(this.model.url, this.setUp.scene);
  }

  async loadUserModels(id, scene) {
    this.loading.style.display = "block";
    this.model = this.storeModel.find((item) => item.id == id);
    await this.loadModelByUrl(this.model.url, scene);
    this.loading.style.display = "none";
  }

  async loadModelByUrl(url, scene) {
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
      scene.add(model);
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
    for (let item of loadingState) {
      item.style.display = "block";
    }
    loadBtn.setAttribute("disabled", true);
    const id = event.currentTarget.id.slice(4);
    await this.loadListModels(id);
    for (let item of loadingState) {
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

  onPreviewModel() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.previewCanvas });
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(20, 20, 25);
    this.camera.lookAt(new THREE.Vector3(0, 0, 20));

    this.renderer.domElement = this.previewCanvas;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.previewCanvas.style.width = "100%";
    this.previewCanvas.style.height = "300px";
    this.renderer.setSize(
      this.previewCanvas.innerWidth,
      this.previewCanvas.innerHeight
    );
    this.camera.aspect =
      this.previewCanvas.innerWidth / this.previewCanvas.innerHeight;
    this.renderer.shadowMap.enabled = true;
    this.setLight();
    this.setCamera();
    this.previewModal.addEventListener("shown.bs.modal", async (e) => {
      var previewId = $(e.relatedTarget).data("preview-id").slice(4);
      debugger;
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
      // await this.loadUserModels(previewId, this.scene);
      this.renderer.render(this.scene, this.camera);
      this.animate();
    });
    this.animate();
  }

  setLight() {
    const light = new THREE.AmbientLight(0xffaaff);
    light.position.set(10, 10, 10);
    this.scene.add(light);
  }

  setCamera() {
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.target.set(0, 0, 0);
    this.controls.minDistance = 0;
    this.controls.maxDistance = 200.0;
    this.controls.update();
  }

  animate() {
    //dragObject();
    this.controls.update();
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  onSaveData(data) {
    const user = JSON.parse(localStorage.getItem("user"));
    this.loading.style.display = "block";
    set(ref(this.database, "users/" + user.uid), {
      models: data,
    }).then(() => {
      this.loading.style.display = "none";
      localStorage.setItem("userModels", JSON.stringify(data));
    });
    const toast = new bootstrap.Toast(this.toastLiveExample);
    toast.show();
  }
}

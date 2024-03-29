import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import SetUp from "./setup";
import { ref, set } from "firebase/database";
import { Auth } from "./auth.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Object {
  setUp = new SetUp();
  auth = new Auth();
  dracoLoader = new DRACOLoader();
  gltfLoader = new GLTFLoader();
  dracoLoaderPath = "https://www.gstatic.com/draco/v1/decoders/";
  floorModelPath = "https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/models%2FfloorPlan.glb?alt=media&token=2ee1ff51-e03e-4e5d-8542-08a5c7174fa9";
  //TODO: Set dynamic path with each account
  
  database = this.auth.database;
  group = this.setUp.group;
  groupModel = this.setUp.groupModel;
  listModel = [];
  storeModel = [];
  loading = document.getElementById("loading");
  toastLiveExample = document.getElementById("liveToast");
  previewCanvas = document.getElementById("previewCanvas");
  previewModal;
  scene;
  renderer;
  camera;
  controls;
  model;
  previewId;
  previewModel;

  constructor() {
    this.initLoader();
    this.fetchData();
    this.onChangeStorage();
    setTimeout(() => {
      this.loadFloor();
      this.fetchModel();
      this.addModel();
      this.previewCanvas = document.getElementById("previewCanvas");
      this.previewModal = document.getElementById("preview-modal");
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({ canvas: this.previewCanvas });
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.onPreviewModel();
    }, 2000);
    this.saveModel();
    this.loadOnlyModel();
  }

  initLoader() {
    this.dracoLoader.setDecoderPath(this.dracoLoaderPath);
    this.dracoLoader.setDecoderConfig({ type: "js" });
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  loadFloor() {
    let floor;
    this.gltfLoader.loadAsync(this.floorModelPath)
    .then((gltf) => {
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
    modelList.innerHTML = '';

    this.listModel = JSON.parse(localStorage.getItem("data"));
    let stringHtml = "";
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
                <a class="btn btn-primary btn-delete" data-bs-dismiss="modal" id="load">Load</a>
            </div>
        </div>
    </div>
    <div class="d-flex justify-content-center" id="loading-model" style="visibility: hidden">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  `;
    this.listModel.forEach((item) => {
      stringHtml += `
          <div class="flex flex-column list-model">
            <div class="row">
              <div class="col col-12">
                <div class="card p-0 border-0" style="border-radius: unset !important">
                  <div class="card-header border-0 " id="heading-${item.type}">
                    <h5 class="mb-0">
                      <a style="color: #888" role="button" data-bs-toggle="collapse" href="#${item.type}"
                        aria-expanded="false" aria-controls="${item.type}" class="text-uppercase">
                        ${item.type}
                      </a>
                    </h5>
                  </div>
                  <div id="${item.type}" class="collapse" style="transition: 0.8s ease-in-out;
                    border-radius: 0 !important;" data-parent="#accordion" aria-labelledby="heading-${item.type}">
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
            <div class="img-wrap" style="cursor: pointer" id=but-${item.id}>
              <img class="img-content w-100" height="80px" src="${item.photoUrl}">
              <p class="img-des m-0 text-center" >
                <span class="fw-bold" style="line-height: 80px;">Load</span>
                <div class="spinner" style="display:none">
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                </div>
              </p>
            </div>
          </div>
          <div class="col col-7">
            <span class="fw-bold">${item.name}</span>
            <br>
            <a style="color: #08f; cursor: pointer" id="preview-${item.id}" data-bs-toggle="modal" data-bs-target="#preview-modal" data-preview-id=pre-${item.id}><i class="far fa-eye"></i>&nbsp Preview</a>
            <p class="fst-italic">${item.description}</p>
          </div>
        </div>
      </div>
     `;
    });
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

  async loadListModels(id, scene) {
    this.listModel.every((item) => {
      this.model = item.list.find((x) => x.id == id);
      if (this.model) return false;
      else return true;
    });
    await this.loadModelByUrl(this.model.url, scene);
  }

  async loadUserModels(id, scene) {
    this.model = this.storeModel.find((item) => item.id == id);
    await this.loadModelByUrl(this.model.url, scene);
  }

  async loadModelByUrl(url, scene) {
    if(this.loading.style.display === 'none'){
      this.loading.style.display = 'block';
      await this.gltfLoader.loadAsync(url).then((gltf) => {
        const model = gltf.scene;
        this.previewModel = gltf.scene;
        model.castShadow = true;
        model.receiveShadow = true;
        if (this.model.position && this.model.scale && this.model.rotation) {
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
          model.position.set(0, 0, 1);
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
      }).finally(() => {
        this.loading.style.display = 'none';
      });
    }
  }
  
   onChangeStorage(){
    window.addEventListener("storage",async (e) => {
      // do your checks to detect
      // changes in "e1", "e2" & "e3" here
      await this.fetchData();
      this.addModel();
      this.previewModal = document.getElementById("preview-modal");
      this.onPreviewModel();
  });
  }

  addModel() {
    const btns = document.querySelectorAll("div[id^=but]");
    btns.forEach((btn) => {
      btn.addEventListener("click", (event) => this.handleLoad(event));
    });
  }

  async handleLoad(event) {
    if(this.loading.style.display === 'none'){
      const loadBtn = document.getElementById(event.currentTarget.id);
      const loadingState = document.getElementsByClassName("spinner");
      for (let item of loadingState) {
        item.style.display = "block";
      }
      loadBtn.setAttribute("disabled", true);
      const id = event.currentTarget.id.slice(4);
      await this.loadListModels(id, this.setUp.scene);
      for (let item of loadingState) {
        item.style.display = "none";
      }
    }
  }

  saveModel() {
    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", (event) => {
      let data = [];
      this.setUp.animate();
      this.setUp.scene.children.forEach((item) => {
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

  resetScene() {
    while (this.scene.children.length) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  setSky() {
    var geometry = new THREE.BoxGeometry(999, 999, 999);
    var cubeMaterials = [
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/images%2Fzeus_ft.jpg?alt=media&token=93e3ddd0-9578-4d7a-9b83-34f1d87f808f"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/images%2Fzeus_bk.jpg?alt=media&token=7cbf1d6f-6772-45f9-8779-2a6b97007aa4"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/images%2Fzeus_up.jpg?alt=media&token=a4ee370e-ed90-45fc-9fd5-921a3e4022da"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/images%2Fzeus_dn.jpg?alt=media&token=6b50e5f4-2f2a-43e1-b1b9-45fae79f1888"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/images%2Fzeus_rt.jpg?alt=media&token=4a713bb5-35af-4579-b827-5b147074bff1"), side: THREE.DoubleSide }),
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("https://firebasestorage.googleapis.com/v0/b/da-dhmt.appspot.com/o/images%2Fzeus_lf.jpg?alt=media&token=e0b97054-491c-45af-a9b8-4d6ff564d721"), side: THREE.DoubleSide }),
    ];
    var cube = new THREE.Mesh(geometry, cubeMaterials);
    this.scene.add(cube);
  }

  onPreviewModel() {
    this.previewModal.addEventListener("shown.bs.modal", async (e) => {
      const loadingState = document.getElementById("loading-model");
      loadingState.style.visibility = "visible";
      this.resetScene();
      this.setSky();

      this.camera.position.set(10, 20, 10);
      this.camera.lookAt(new THREE.Vector3(0, 0, 20));

      const colorWhite = new THREE.Color(255, 255, 255);
      this.scene.background = colorWhite;

      this.previewCanvas.style.width = "100%";
      this.previewCanvas.style.height = "300px";
      this.renderer.domElement = this.previewCanvas;
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(
        this.previewCanvas.offsetWidth,
        this.previewCanvas.offsetHeight
      );
      this.camera.aspect =
        this.previewCanvas.offsetWidth / this.previewCanvas.offsetHeight;
      this.renderer.shadowMap.enabled = true;
      this.setLight();
      this.setCamera();
      this.previewId = $(e.relatedTarget).data("preview-id").slice(4);
      await this.loadListModels(this.previewId, this.scene);
      this.renderer.render(this.scene, this.camera);
      this.animate();
      loadingState.style.visibility = "hidden";
    });
    this.animate();
  }

  setLight() {
    const light = new THREE.AmbientLight();
    light.position.set(10, 10, 30);
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
      window.localStorage.setItem("userModels", JSON.stringify(data));
    });
    const toast = new bootstrap.Toast(this.toastLiveExample);
    toast.show();
  }

  loadOnlyModel() {
    const btn = document.getElementById('load');
    btn.addEventListener("click", (e) => this.setUp.scene.add(this.previewModel));
  }
}

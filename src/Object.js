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
    this.loadFloor();
    setTimeout(() => {
    this.addModel();
    }, 1500)
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
    var modelList = document.getElementById('model');
    await fetch('./data/data.json')
      .then((response) => response.json())
      .then((json) => {
        this.listModel = [...json];
        let stringHtml = '';
        this.listModel.forEach(item => {
          stringHtml += `
          <div class="flex flex-column list-model">
          <div class="row">
          <div class="col col-12">
          <div class="card p-0 border-0" style="border-radius: unset !important">
          <div class="card-header border-0 rounded" id="heading-${item.type}">
          <h5 class="mb-0">
          <a role="button" data-bs-toggle="collapse" href="#${item.type}"
          aria-expanded="false" aria-controls="${item.type}"
          class="text-uppercase">
           ${item.type}
          </a>
          </h5>
          </div>
            <div id="${item.type}" class="collapse" style="transition: 0.8s ease-in-out;" data-parent="#accordion" aria-labelledby="heading-${item.type}">
              ${this.loadDetailObject(item)}
            </div>
          </div>
          </div>
          </div>
          </div>
            `
          })
          modelList.innerHTML = stringHtml;
        })
 
  }

    loadDetailObject(data){
      let stringHtml = ''
      data.list.forEach(item => {
        stringHtml += `
      <div class="card-body">
          <div class="d-flex row">
            <div class="col col-5">
              <img width="100%" height="100%" src="${item.photoUrl}">
            </div>
            <div class="col col-7">
            <span >${item.name}</span>
          </div>
          </div>
          <div class="d-flex row">
           <div class="col col-5">
            <span >Material:</span>
          </div>
          <div class="col col-7">
            <span >${item.material}</span>
          </div>
        </div>
        <div class="d-flex row">
        <div class="col col-5">
         <span >Size:</span>
       </div>
       <div class="col col-7">
         <span >${item.size}</span>
       </div>
     </div>
           <div class="d-flex row">
           <div class="col col-5">
            <span >Origin:</span>
          </div>
          <div class="col col-7">
            <span >${item.origin}</span>
          </div>
        </div>
        <div class="d-flex row">
        <div class="col col-5">
         <span >Price:</span>
       </div>
       <div class="col col-7">
         <span >${item.price}</span>
       </div>
     </div>
     <button id=but-${item.url}>Load</button>
     </div>
     `
      })
      return stringHtml
    }


  loadModel(url) {
    debugger
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../node_modules/three/examples/js/libs/draco/gltf/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    // const model = this.listModel.find(item => item.id === id);
    gltfLoader.loadAsync(url).then((gltf) => {
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

    addModel(){
      const btns = document.querySelectorAll('button[id^=but]')
      btns.forEach(btn => {
        btn.addEventListener('click', event => {
          const url = event.target.id.slice(4)
          this.loadModel(url)
        });
     });
}
}


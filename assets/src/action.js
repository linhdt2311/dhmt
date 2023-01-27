import Object from "./object.js";
import canvasToImage from "canvas-to-image";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
export default class Experience {
  object = new Object();
  camera = this.object.setUp.camera;
  renderer = this.object.setUp.renderer;
  scene = this.object.setUp.scene;
  controls = this.object.setUp.controls;
  transformControls = this.object.setUp.transformControls;
  raycaster = this.object.setUp.raycaster;
  clickMouse = this.object.setUp.clickMouse;
  moveMouse = this.object.setUp.moveMouse;
  group = this.object.setUp.group;
  draggable;
  translateBtn = document.getElementById("translate-btn");
  rotateBtn = document.getElementById("rotate-btn");
  scaleBtn = document.getElementById("scale-btn");
  deleteBtn = document.getElementById("delete-btn");
  deleteConfirmBtn = document.getElementById("delete-confirm");
  //scaleAdjust = document.getElementById("scale-adjust");
  exportGlbBtn = document.getElementById("export-glb");
  exporGltfBtn = document.getElementById("export-gltf");
  exportImgBtn = document.getElementById("export-img");

  constructor() {
    this.foundObject();
    this.mouseMove();
    this.translate();
    this.rotate();
    this.scale();
    this.deleteObject();
    //this.onClickScaleAdjust();
    this.export();
  }

  foundObject() {
    if (this.draggable != null) {
      this.draggable = null;
      return;
    }
    this.deleteBtn.style.display = "none";
    var myCanvas = document.getElementById("myCanvas");
    window.addEventListener("click", (event) => {
      this.deleteBtn.style.display = "none";
      this.clickMouse.x = (event.clientX / myCanvas.clientWidth) * 2 - 1;
      this.clickMouse.y = -(event.clientY / myCanvas.clientHeight) * 2 + 1;
      const found = this.intersect(this.clickMouse);
      if (found.length > 0) {
        while (found[0].object.parent.parent !== null) {
          found[0].object = found[0].object.parent;
        }
      }
      this.transformControls.detach();
      if (
        found.length > 0 &&
        found[0].object.type != "TransformControlsPlane" &&
        found[0].object.userData.name &&
        found[0].object.userData.type !== "Plane"
      ) {
        this.transformControls.enabled = true;
        this.draggable = found[0].object;
        this.deleteBtn.style.display = "block";
        this.addTransformControl(this.draggable);
        this.viewDetailObject();
        const scaleForm = document.getElementById("scale-form");
        const positionForm = document.getElementById("position-form");
        const rotationForm = document.getElementById("rotation-form");
        positionForm.elements["xAsis"].value = Math.round(this.draggable.position.x * 100) / 100;
        positionForm.elements["yAsis"].value = Math.round(this.draggable.position.y * 100) / 100;
        positionForm.elements["zAsis"].value = Math.round(this.draggable.position.z * 100) / 100;
        scaleForm.elements["xAsis"].value = Math.round(this.draggable.scale.x * 100) / 100;
        scaleForm.elements["yAsis"].value = Math.round(this.draggable.scale.y * 100) / 100;
        scaleForm.elements["zAsis"].value = Math.round(this.draggable.scale.z * 100) / 100;
        rotationForm.elements["xAsis"].value = Math.round(this.draggable.rotation.x * 100) / 100;
        rotationForm.elements["yAsis"].value = Math.round(this.draggable.rotation.y * 100) / 100;
        rotationForm.elements["zAsis"].value = Math.round(this.draggable.rotation.z * 100) / 100;
        this.onChangeScale();
        this.onChangePosition();
        this.onChangeRotation();
      } else {
        this.transformControls.enabled = false;
      }
    });
  }

  // onClickScaleAdjust() {
  //   this.scaleAdjust.addEventListener("click", (e) => {
  //     e.stopPropagation();
  //   });
  // }

  onChangeScale() {
    const scaleForm = document.getElementById("scale-form");
    scaleForm.addEventListener("change", (e) => {
      this.draggable.scale.set(
        Math.round(scaleForm.elements["xAsis"].value * 100) / 100,
        Math.round(scaleForm.elements["yAsis"].value * 100) / 100,
        Math.round(scaleForm.elements["zAsis"].value * 100) / 100
      );
    });
  }

  onChangePosition() {
    const positionForm = document.getElementById("position-form");
    positionForm.addEventListener("change", (e) => {
      this.draggable.position.set(
        Math.round(positionForm.elements["xAsis"].value * 100) / 100,
        Math.round(positionForm.elements["yAsis"].value * 100) / 100,
        Math.round(positionForm.elements["zAsis"].value * 100) / 100
      );
    });
  }

  onChangeRotation() {
    const rotationForm = document.getElementById("rotation-form");
    rotationForm.addEventListener("change", (e) => {
      this.draggable.rotation.set(
        Math.round(rotationForm.elements["xAsis"].value * 100) / 100,
        Math.round(rotationForm.elements["yAsis"].value * 100) / 100,
        Math.round(rotationForm.elements["zAsis"].value * 100) / 100
      );
    });
  }

  viewDetailObject() {
    const objectInfo = document.getElementById("object");
    let stringHtml = "";
    stringHtml += `
  <div class="d-flex row mt-4 mb-4">
    <div class="col col-12 text-center">
      <img  width="80px" height="80px" src="${this.draggable.userData.photoUrl
      }">
    </div>
  </div>
  
  <div class="px-3" style="font-size: 15px">
    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Type:</span>
      </div>
      <div class="col col-7">
        <span>${this.draggable.userData.type}</span>
      </div>
    </div>

    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Is 3D:</span>
      </div>
      <div class="col col-7">
        <span>${this.draggable.isObject3D}</span>
      </div>
    </div>

    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Material:</span>
      </div>
      <div class="col col-7">
        <span>${this.draggable.userData.material}</span>
      </div>
    </div>

    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Size:</span>
      </div>
      <div class="col col-7">
        <span>${this.draggable.userData.size}</span>
      </div>
    </div>

    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Origin:</span>
      </div>
      <div class="col col-7">
        <span>${this.draggable.userData.origin}</span>
      </div>
    </div>
    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Price:</span>
      </div>
      <div class="col col-7">
        <span>${this.draggable.userData.price}</span>
      </div>
    </div>
    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Insurance:</span>
      </div>
      <div class="col col-7">
        <span>${this.draggable.userData.insurance}</span>
      </div>
    </div>
    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Position:</span>
      </div>
      <div class="col col-7">
        <form class="d-flex row" id="position-form">
          <div class="col col-4">
            <input (blur)="onChangePosition()" name="xAsis" min="0" max="3" type="number" placeholder="X" >
          </div>
          <div class="col col-4">
            <input (blur)="onChangePosition()" name="yAsis"  min="0" max="3" type="number" placeholder="Y" >
          </div>
          <div class="col col-4">
            <input (blur)="onChangePosition()" name="zAsis"  min="0" max="3" type="number" placeholder="Z" >
          </div>
        </form>
      </div>
    </div>
    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Scale:</span>
      </div>
      <div class="col col-7">
        <form class="d-flex row" id="scale-form">
          <div class="col col-4">
            <input (blur)="onChangeScale()" name="xAsis" min="0" max="3" type="number" placeholder="X" >
          </div>
          <div class="col col-4">
            <input (blur)="onChangeScale()" name="yAsis"  min="0" max="3" type="number" placeholder="Y" >
          </div>
          <div class="col col-4">
            <input (blur)="onChangeScale()" name="zAsis"  min="0" max="3" type="number" placeholder="Z" >
          </div>
        </form>
      </div>
    </div>
    <div class="d-flex row mb-2">
      <div class="col col-5">
        <span class="fw-bold">Rotation:</span>
      </div>
      <div class="col col-7">
        <form class="d-flex row" id="rotation-form">
          <div class="col col-4">
            <input (blur)="onChangeScale()" name="xAsis" min="0" max="3" type="number" placeholder="X" >
          </div>
          <div class="col col-4">
            <input (blur)="onChangeScale()" name="yAsis"  min="0" max="3" type="number" placeholder="Y" >
          </div>
          <div class="col col-4">
            <input (blur)="onChangeScale()" name="zAsis"  min="0" max="3" type="number" placeholder="Z" >
          </div>
        </form>
      </div>
    </div>
  </div>
  `;
    objectInfo.innerHTML = stringHtml;
  }

  deleteObject() {
    this.deleteConfirmBtn.addEventListener("click", (event) => {
      if (this.draggable) {
        this.transformControls.detach();
        this.scene.remove(this.draggable);
        this.deleteBtn.style.display = "none";
      }
    });
  }

  mouseMove() {
    var myCanvas = document.getElementById("myCanvas");
    myCanvas.addEventListener("mousemove", (event) => {
      this.moveMouse.x = (event.clientX / myCanvas.clientWidth) * 2 - 1;
      this.moveMouse.y = -(event.clientY / myCanvas.clientHeight) * 2 + 1;
    });
  }

  translate() {
    this.translateBtn.addEventListener("click", () => {
      this.resetTransformState();
      this.transformControls.showY = false;
      this.transformControls.showX = true;
      this.transformControls.showZ = true;
      this.translateBtn.classList.add("focus");
      this.transformControls.mode = "translate";
    });
  }

  rotate() {
    this.rotateBtn.addEventListener("click", () => {
      this.resetTransformState();
      this.rotateBtn.classList.add("focus");
      this.transformControls.showY = true;
      this.transformControls.showX = false;
      this.transformControls.showZ = false;
      this.transformControls.mode = "rotate";
    });
  }

  scale() {
    this.scaleBtn.addEventListener("click", () => {
      this.resetTransformState();
      this.scaleBtn.classList.add("focus");
      this.transformControls.showY = true;
      this.transformControls.showX = true;
      this.transformControls.showZ = true;
      this.transformControls.mode = "scale";
    });
  }

  intersect(pos) {
    this.raycaster.setFromCamera(pos, this.camera);
    return this.raycaster.intersectObjects(this.scene.children);
  }

  addTransformControl(model) {
    this.transformControls.addEventListener("mouseDown", () => {
      this.controls.enabled = false;
    });
    this.transformControls.addEventListener("mouseUp", () => {
      this.controls.enabled = true;
    });
    this.transformControls.attach(model);
  }

  resetTransformState() {
    this.translateBtn.classList.remove("focus");
    this.rotateBtn.classList.remove("focus");
    this.scaleBtn.classList.remove("focus");
  }

  export() {
    this.exportGlbBtn.addEventListener("click", () => {
      this.exportGlb();
    });
    this.exporGltfBtn.addEventListener("click", () => {
      this.exportGltf();
    });
    this.exportImgBtn.addEventListener("click", () => {
      this.exportImg();
    });
  }

  exportGltf() {
    const exporter = new GLTFExporter();
    const options = {};
    exporter.parse(
      this.scene,
      (result) => {
        const output = JSON.stringify(result, null, 2);
        console.log(output);
        this.save(new Blob([output], { type: "text/plain" }), "scene.gltf");
      },
      function (error) {
        console.log("An error happened during parsing", error);
      },
      options
    );
  }

  exportGlb() {
    const exporter = new GLTFExporter();
    const options = {};
    exporter.parse(
      this.scene,
      (result) => {
        const output = JSON.stringify(result, null, 2);
        console.log(output);
        this.save(new Blob([output], { type: "text/plain" }), "scene.glb");

      },
      function (error) {
        console.log("An error happened during parsing", error);
      },
      options
    );
  }

  exportImg() {
    const canvasEl = document.getElementById("myCanvas");
    // This will prevent return black image.
    this.object.setUp.animate();
    canvasToImage(canvasEl, {
      name: "myImage",
      type: "png",
      quality: 1,
    });
  }

  save(blob, filename) {
    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    link.remove();
    // URL.revokeObjectURL( url ); breaks Firefox...
  }
}

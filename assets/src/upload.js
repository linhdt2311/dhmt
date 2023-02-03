import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Guid } from "js-guid";
import { set, ref } from "firebase/database";
import {Auth} from "./auth";

const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  description = dropArea.querySelector("span"),
  icon = dropArea.querySelector("i"),
  input = dropArea.querySelector("input");

export default class Upload {
  auth = new Auth();
  storage = getStorage();
  database = this.auth.database;

  dropArea = document.querySelector(".drag-area");
  inputModel = document.getElementById("inputModel");
  inputImage = document.getElementById("inputImage");
  loading = document.getElementById("loading-upload");
  file = null;
  image = null;
  modelUrl = null;
  imageUrl = null;

  uploadBtn = document.getElementById("uploadBtn");
  constructor() {
    this.upload();
    this.onChangeInputImage();
    this.onChangeInputModel();
    this.onDropModel();
  }

  upload() {
    this.uploadBtn.addEventListener("click", async (e) => {
      this.uploadBtn.setAttribute('disabled', true);
      this.loading.style.display = 'block';
      const formElement = document.querySelector("form");
      const formData = new FormData(formElement);
      await this.uploadToCloud(this.image, "image");
      await this.uploadToCloud(this.file, "model");
      var newModel = {
        id: Guid.newGuid().StringGuid,
        name: formData.get("title"),
        material: formData.get("material"),
        size: formData.get("size"),
        origin: formData.get("origin"),
        price: formData.get("price"),
        insurance: formData.get("insurance"),
        type: formData.get("type"),
        description: formData.get("description"),
        url: this.modelUrl,
        photoUrl: this.imageUrl,
      };
      var data = JSON.parse(localStorage.getItem("data"));
      data.forEach((item) => {
        if (item.type == formData.get("type")) {
          item.list.push(newModel);
        }
      });
      set(ref(this.database, 'data/'), {
        data,
      }).then(async () => {
        localStorage.setItem("data", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
      });
      this.uploadBtn.removeAttribute('disabled');
      this.loading.style.display = 'none';
      const close = document.getElementById('close');
      close.click();
    });
  }

  async uploadToCloud(file, type) {
    if (type == "model") {
      const storageRef = sRef(this.storage, "/models/" + file.name);
      // 'file' comes from the Blob or File API
      await uploadBytes(storageRef, file).then(async (snapshot) => {
        dropArea.classList.add("active");
        await getDownloadURL(storageRef).then((url) => {
          this.modelUrl = url;
        });
      });
    } else {
      const storageRef = sRef(this.storage, "/images/" + file.name);
      // 'file' comes from the Blob or File API
      await uploadBytes(storageRef, file).then(async (snapshot) => {
        await getDownloadURL(storageRef).then((url) => {
          this.imageUrl = url;
        });
      });
    }
  }

  onChangeInputImage() {
    this.inputImage.addEventListener("change", (e) => {
      //Getting User Select File And [0] This Means If User Select Multiple Files Then We'll Select Only The First One
      this.image = e.target.files[0];
      //showFile(); //Calling Function
    });
  }

  onChangeInputModel() {
    this.inputModel.addEventListener("change", (e) => {
      //Getting User Select File And [0] This Means If User Select Multiple Files Then We'll Select Only The First One
      this.file = e.target.files[0];
      //showFile(); //Calling Function
    });
  }

  onDropModel() {
    this.dropArea.addEventListener("drop", (event) => {
      event.preventDefault(); //Preventing From Default Behaviour
      //Getting User Select File And [0] This Means If User Select Multiple Files Then We'll Select Only The First One
      this.file = event.dataTransfer.files[0];
      this.afterUpload(this.file);
      //showFile(); //Calling Function
    });
  }

  afterUpload(file) {
    dragText.textContent = file.name;
    description.style.display = "none";
    button.style.display = "none";
    icon.classList.remove("fa-cloud-upload-alt");
    icon.classList.add("fa-file");
  }
}

button.onclick = () => {
  input.click(); //If User Click On The button Then The input Also Clicked
};

$("#upload-model").on("hidden.bs.modal", function () {
  $(this).find("form").trigger("reset");
  dragText.textContent = "Drag & Drop To Upload File";
  description.style.display = "block";
  button.style.display = "block";
  icon.style.display = "block";
  dropArea.classList.remove("active");
});

//If User Drag File Over dropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //Preventing From Default Behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release To Upload File";
});

//If User Leave Dragged File From dropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop To Upload File";
});

//If User Drop File On dropArea

// import "./style.css";
// import Experience from "/src/Experience.js";

// const experience = new Experience(document.querySelector(".experience-canvas"));

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OrbitControlsGizmo } from "three/examples/jsm/controls/OrbitControlsGizmo";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1500
);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
let draggable;

init();
animate();
setLight();
setCamera();
plane();
// box();
sphere();
cylinder();
batmanObj();
loadFloor();

function init() {
  camera.position.set(-35, 100, 300);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.background = new THREE.Color(0xbfd1e5);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  dragObject();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function setLight() {
  const hemiLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-30, 50, -30);
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.left = -70;
  dirLight.shadow.camera.right = 70;
  dirLight.shadow.camera.top = 70;
  dirLight.shadow.camera.bottom = -70;
}

function setCamera() {
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 0, 0);
  controls.minDistance = 0;
  controls.maxDistance = 1000.0;
  controls.update();
}

function loadFloor() {
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/models/floorPlan.glb", function (gltf) {
    const floor = gltf.scene;
    floor.position.set(0, 1, 0);
    floor.scale.set(3, 3, 3);
    floor.castShadow = true;
    floor.receiveShadow = true;
    floor.userData.name = "FloorPlan";
    floor.userData.ground = true;
    scene.add(floor);
    // batman.userData.draggable = true;
  });
}

function plane() {
  const plane = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  plane.position.set(0, 0, 0);
  plane.scale.set(180, 1, 198);
  plane.castShadow = true;
  plane.receiveShadow = true;
  scene.add(plane);
  plane.userData.ground = true;
}

function box() {
  const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xdc143c })
  );
  box.position.set(15, 3, 15);
  box.scale.set(6, 6, 6);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);
  box.userData.draggable = true;
 
  box.userData.name = "BOX";
  box.userData.material = "Wood";

}

function sphere() {
  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(4, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0x43a1f4 })
  );
  sphere.position.set(15, 4, -15);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);
  sphere.userData.draggable = true;
  sphere.userData.name = "SPHERE";
  sphere.userData.material = "Vibranium";

}

function cylinder() {
  const cylinder = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(4, 4, 6, 32),
    new THREE.MeshPhongMaterial({ color: 0x90ee90 })
  );
  cylinder.position.set(-15, 3, 15);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  scene.add(cylinder);
  cylinder.userData.draggable = true;
  cylinder.userData.name = "CYLINDER";
  cylinder.userData.material = "Vibranium";

}

function batmanObj() {
  const objLoader = new OBJLoader();
  objLoader.load("/models/batman.obj", function (obj) {
    const batman = obj.children[0];
    batman.position.set(-15, 0, -15);
    batman.scale.set(5, 5, 5);
    batman.castShadow = true;
    batman.receiveShadow = true;
    scene.add(batman);
    batman.userData.draggable = true;
    batman.userData.name = "BATMANOBJ";
    batman.userData.material = "Platinum";

  });
}

// function batmanGltf() {
// 	const gltfLoader = new GLTFLoader();
// 	gltfLoader.load('/models/batman.glb', function (gltf) {
// 		const batman = gltf.scene;
// 		batman.position.set(0, 0, 0);
// 		batman.scale.set(10, 10, 10);
// 		batman.castShadow = true;
// 		batman.receiveShadow = true;
// 		scene.add(batman);
// 		batman.userData.draggable = true;
// 		batman.userData.name = 'BATMANGLTF';
// 	});
// }

function intersect(pos) {
  raycaster.setFromCamera(pos, camera);
  return raycaster.intersectObjects(scene.children);
}

var box1 = document.getElementById('modelList');
console.log(box1)
box1.addEventListener("click", (event) => {
  debugger
  box();
})

window.addEventListener("click", (event) => {
  if (draggable != null) {
    draggable = null;
    return;
  }
 

  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const found = intersect(clickMouse);
  if (found.length > 0) {
    if (found[0].object.userData.draggable) {
      draggable = found[0].object;
	  var userDetail = document.getElementById("userDetail");
	  userDetail.innerHTML = `
	  <h5 class="fs-6 text-white">Name: ${found[0].object.userData.name}</h5>
	  <h5 class="fs-6 text-white">Material: ${found[0].object.userData.material}</h5>
`;
    }
  }
});


window.addEventListener("mousemove", (event) => {
  moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject() {
  if (draggable != null) {
    const found = intersect(moveMouse);
    if (found.length > 0) {
      for (let i = 0; i < found.length; i++) {
        if (!found[i].object.userData.ground) {
          continue;
        }
        const target = found[i].point;
        if (target) {
 
        }
        draggable.position.x = target.x;
        draggable.position.z = target.z;
      }
    }
  }

  const controlsGizmo = new  OrbitControlsGizmo(controls, { size:  100, padding:  8 });
  document.body.appendChild(controlsGizmo.domElement);  
}

import * as THREE from 'three'
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import Object from "./Object.js";
export default class Experience {
    object = new Object();
    camera = this.object.setUp.camera;
    renderer = this.object.setUp.renderer;
    scene = this.object.setUp.scene;
    controls = this.object.setUp.controls;
    transformControls = this.object.setUp.transformControls;
    raycaster =  this.object.setUp.raycaster;
    clickMouse =  this.object.setUp.clickMouse;
    moveMouse =  this.object.setUp.moveMouse;
    group = this.object.setUp.group;
    draggable;
    translateBtn = document.getElementById("translate-btn");
    rotateBtn = document.getElementById("rotate-btn");
    scaleBtn = document.getElementById("scale-btn");

    constructor() {
        this.foundObject();
        this.mouseMove();
        this.translate();
        this.rotate();
        this.scale();
    }

    foundObject() {
        window.addEventListener("click", (event) => {
            this.clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            const found = this.intersect(this.clickMouse);
            this.transformControls.detach();
            if (found.length > 0 && found[0].object.type !== "TransformControlsPlane"
                && found[0].object.userData.name && found[0].object.userData.name !== 'Plane') {
                this.transformControls.enabled = true;
                this.draggable = found[0].object;
                this.addTransformControl(this.draggable);
            }
            else {
                this.transformControls.enabled = false;
            }
        });
    }

    mouseMove() {
        window.addEventListener("mousemove", (event) => {
            this.moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    translate() {
        this.translateBtn.addEventListener('click', () => {
            this.resetTransformState();
            this.translateBtn.classList.add('focus');
            this.transformControls.mode = "translate";
        });
    }

    rotate() {
        this.rotateBtn.addEventListener('click', () => {
            this.resetTransformState();
            this.rotateBtn.classList.add('focus');
            this.transformControls.mode = "rotate";
        });
    }

    scale() {
        this.scaleBtn.addEventListener('click', () => {
            this.resetTransformState();
            this.scaleBtn.classList.add('focus');
            this.transformControls.mode = "scale";
        });
    }

    intersect(pos) {
        this.raycaster.setFromCamera(pos, this.camera);
        return this.raycaster.intersectObjects(this.scene.children, false);
    }

    addTransformControl(model) {
        // transformControls.setSpace('local');
        this.transformControls.addEventListener("mouseDown", ()  => {
            this.controls.enabled = false;
        });
        this.transformControls.addEventListener("mouseUp",() => {
            this.controls.enabled = true;
        });
        this.transformControls.attach(model);
    }

    resetTransformState() {
        this.translateBtn.classList.remove('focus');
        this.rotateBtn.classList.remove('focus');
        this.scaleBtn.classList.remove('focus');
    }
}
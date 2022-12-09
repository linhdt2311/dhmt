import * as THREE from "three";

// import Sizes from "./Utils/Sizes.js";

// import Camera from "./Camera.js";
// import Renderer from "./Renderer.js";

import SetUp from "./Setup.js";
import Object from "./Oject.js";

export default class Experience {
    constructor(canvas) {
        if (Experience.instance) {
            return Experience.instance;
        }
        Experience.instance = this;
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        // this.sizes = new Sizes();
        // this.camera = new Camera();
        // this.renderer = new Renderer();
        this.setup = new SetUp();
        this.object = new Object();

        // this.sizes.on("resize", () => {
        //     this.resize();
        // });
    }
}
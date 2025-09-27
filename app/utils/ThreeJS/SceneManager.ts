import * as THREE from 'three';
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import type { RScene } from './scenes/Scene';

export class SceneManager {
  private scenes: RScene[] = [];
  private renderer: THREE.WebGLRenderer;
  private gltfLoader: GLTFLoader;
  private hdrLoader: HDRLoader;
  private exrLoader: EXRLoader;
  private textureLoader: THREE.TextureLoader;
  private objectLoader: OBJLoader = new OBJLoader();

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.gltfLoader = new GLTFLoader();
    this.hdrLoader = new HDRLoader();
    this.exrLoader = new EXRLoader();
    this.textureLoader = new THREE.TextureLoader();

    window.addEventListener("resize", () => {
      this.onWindowResize(container);
    });
  }

  addScene(object: RScene) {
    this.scenes.push(object);
  }

  popScene(): RScene | undefined {
    return this.scenes.pop();
  }

  getCurrentScene(): RScene | undefined {
    if (this.scenes.length === 0) return undefined;
    return this.scenes[this.scenes.length - 1];
  }

  render(scene: RScene | undefined = this.getCurrentScene()) {
    if (!scene) return;
    this.renderer.render(scene.getScene(), scene.getCamera());
  }

  private onWindowResize(container: HTMLElement) {
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  animate(callback?: () => void) {
    const loop = () => {
      requestAnimationFrame(loop);
      if (callback) callback();
      this.render();
    };
    loop();
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getGLTFLoader(): GLTFLoader {
    return this.gltfLoader;
  }

  getHDRLoader(): HDRLoader {
    return this.hdrLoader;
  }

  getEXRLoader(): EXRLoader {
    return this.exrLoader;
  }

  getTextureLoader(): THREE.TextureLoader {
    return this.textureLoader;
  }

  getObjectLoader(): OBJLoader {
    return this.objectLoader;
  }
}

import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import type { RScene } from "./scenes/Scene";

export class SceneManager {
	private readonly scenes: RScene[] = [];
	private readonly renderer: THREE.WebGLRenderer;
	private readonly gltfLoader: GLTFLoader;
	private readonly hdrLoader: HDRLoader;
	private readonly exrLoader: EXRLoader;
	private readonly textureLoader: THREE.TextureLoader;
	private readonly objectLoader: OBJLoader = new OBJLoader();

	private currentSceneIndex: number = 0;

	constructor(container: HTMLElement) {
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(container.clientWidth, container.clientHeight);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
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

	clearScenes(): void {
		while (this.scenes.length > 1) {
			this.popScene();
		}
		this.currentSceneIndex = 0;
	}

	getCurrentScene(): RScene | undefined {
		if (this.scenes.length === 0) return undefined;
		return this.scenes.at(this.currentSceneIndex);
	}

	goBackOneScene(): void {
		this.currentSceneIndex--;
		if (this.currentSceneIndex < 0) this.currentSceneIndex = 0;
	}

	goBackForward(): void {
		this.currentSceneIndex++;
		if (this.currentSceneIndex >= this.scenes.length) this.currentSceneIndex = this.scenes.length - 1;
	}

	goToLastScene(): void {
		this.setSceneIndex(this.scenes.length - 1);
	}

	getScenesNumber(): number {
		return this.scenes.length;
	}

  getCurrentIndex(): number {
    return this.currentSceneIndex;
  }

	setSceneIndex(index: number): void {
		this.currentSceneIndex = index;
		if (this.currentSceneIndex < 0) this.currentSceneIndex = 0;
		if (this.currentSceneIndex >= this.scenes.length) this.currentSceneIndex = this.scenes.length - 1;
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

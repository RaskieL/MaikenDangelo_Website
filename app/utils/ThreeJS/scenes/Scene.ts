import * as THREE from "three";
import type { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import type { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import type { SceneManager } from "../SceneManager";
import type { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export abstract class RScene {
	public label: string;
	private readonly scene: THREE.Scene;
	private readonly camera: THREE.PerspectiveCamera;
	private readonly gltfLoader: GLTFLoader;
	private readonly hdrLoader: HDRLoader;
	private readonly exrLoader: EXRLoader;
	private readonly textureLoader: THREE.TextureLoader;
	private readonly objectLoader: OBJLoader;

	constructor(container: HTMLElement, sceneManager: SceneManager, label: string) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
		this.camera.position.z = 5;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.gltfLoader = sceneManager.getGLTFLoader();
		this.hdrLoader = sceneManager.getHDRLoader();
		this.exrLoader = sceneManager.getEXRLoader();
		this.textureLoader = sceneManager.getTextureLoader();
		this.objectLoader = sceneManager.getObjectLoader();

		this.label = label;

		window.addEventListener("resize", () => {
			this.onWindowResize(container);
		});
	}

	protected addToScene(object: THREE.Object3D) {
		this.scene.add(object);
	}

	async loadGLTF(path: string): Promise<THREE.Group> {
		const gltf = await this.gltfLoader.loadAsync(path);
		const root = gltf.scene;
		return root;
	}

	async loadObject(path: string): Promise<THREE.Object3D> {
		const object = await this.objectLoader.loadAsync(path);
		return object;
	}

	protected loadTexture(path: string): Promise<THREE.Texture> {
		return this.textureLoader.loadAsync(path);
	}

	protected addSkyboxFromEquirectangular(path: string) {
		const splitString = path.split(".");
		if (splitString.length < 2) return;
		const extension: string = splitString[1] as string;

		if (extension === "hdr") {
			this.hdrLoader.load(path, (texture) => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				this.scene.background = texture;
				this.scene.environment = texture;
			});
		} else if (extension === "exr") {
			this.exrLoader.load(path, (texture) => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				this.scene.background = texture;
				this.scene.environment = texture;
			});
		} else {
			this.textureLoader.load(path, (texture) => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				this.scene.background = texture;
			});
		}
	}

	protected onWindowResize(container: HTMLElement) {
		this.camera.aspect = container.clientWidth / container.clientHeight;
		this.camera.updateProjectionMatrix();
	}

	public getScene(): THREE.Scene {
		return this.scene;
	}

	public getCamera(): THREE.PerspectiveCamera {
		return this.camera;
	}

	abstract animate(): void;
}

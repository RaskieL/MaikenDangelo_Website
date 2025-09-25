import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import type { SceneManager } from '../SceneManager';

export abstract class RScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private gltfLoader: GLTFLoader;
    private hdrLoader: HDRLoader;
    private exrLoader: EXRLoader;
    private textureLoader: THREE.TextureLoader;

    constructor(container: HTMLElement, sceneManager: SceneManager) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.gltfLoader = sceneManager.getGLTFLoader();
        this.hdrLoader = sceneManager.getHDRLoader();
        this.exrLoader = sceneManager.getEXRLoader();
        this.textureLoader = new THREE.TextureLoader();

        window.addEventListener('resize', () => {
            this.onWindowResize(container)
        })
    }

    protected addToScene(object: THREE.Object3D) {
        this.scene.add(object);
    }

    async loadGLTF(path: string) : Promise<THREE.Group> {
        let root: THREE.Group = new THREE.Group();
        const gltf = await this.gltfLoader.loadAsync(path);
        root = gltf.scene;
        return root;
    }

    protected loadTexture(path: string): Promise<THREE.Texture> {
        return this.textureLoader.loadAsync(path);
    }

    protected addSkyboxFromEquirectangular(path: string) {
        const splitString = path.split('.');
        if (splitString.length < 2) return;
        const extension: string = splitString[1] as string;

        if (extension === "hdr") {
            this.hdrLoader.load(path, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = texture;
                this.scene.environment = texture;
            })
        } else if (extension === "exr") {
            this.exrLoader.load(path, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = texture;
                this.scene.environment = texture;
            })
        }
        else {
            this.textureLoader.load(path, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = texture;
            })
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
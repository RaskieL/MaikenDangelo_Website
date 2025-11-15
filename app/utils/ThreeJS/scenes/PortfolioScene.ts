import * as THREE from "three";
import type { SceneManager } from "../SceneManager";

import { RScene } from "./Scene";

export class PortfolioScene extends RScene {
	constructor(container: HTMLElement, sceneManager: SceneManager) {
		super(container, sceneManager, "PortfolioScene");
		this.Init();
	}

	async Init() {
		const skybox = await this.loadGLTF("/models/inside_galaxy/scene.gltf");
		if (skybox) {
			skybox.scale.set(10, 10, 10);
			skybox.castShadow = false;
			skybox.receiveShadow = false;
			this.addToScene(skybox);
		}
	}

	override animate(): void {}
}

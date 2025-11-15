<template>
	<div class="flex z-20 m-5 gap-10 absolute h-[10vh] w-full items-center">
		<div
			class="flex flex-row p-5 gap-5 justify-center items-center bg-[rgba(0,0,0,0.6)] rounded-xl backdrop-blur-sm w-[10vw] h-[6vh]">
			<Button
				:disabled="(props.sceneManager && props.sceneManager.getCurrentIndex() <= 0) as boolean"
				icon="pi pi-angle-left"
				rounded
				@click="goBack()" />
			<Button
				:disabled="(props.sceneManager && props.sceneManager.getCurrentIndex() <= 0) as boolean"
				icon="pi pi-home"
				rounded
				@click="goHome()" />
			<Button
				:disabled="
					(props.sceneManager &&
						props.sceneManager.getCurrentIndex() >= props.sceneManager.getScenesNumber() - 1) as boolean
				"
				icon="pi pi-angle-right"
				rounded
				@click="goBackForward()" />
		</div>

		<div
			class="flex flex-row gap-10 justify-center items-center bg-[rgba(0,0,0,0.6)] p-5 rounded-xl backdrop-blur-sm w-[80vw] h-[6vh]">
			<Button
				label="Portfolio"
				class="w-[18%]"
				icon="pi pi-folder"
				@mouseover="menuElementHover(new THREE.Vector3(-0.5, 0, 1))"
				@mouseout="menuElementOut()"
				@click="clickMenuButton(0)" />
			<Button
				label="Blog"
				class="w-[18%]"
				icon="pi pi-book"
				@mouseover="menuElementHover(new THREE.Vector3(0, 1, 3))"
				@mouseout="menuElementOut()"
				@click="clickMenuButton(1)" />

			<div class="text-center mr-10 ml-10">
				<h1 class="text-[40px]">maikendangelo.fr</h1>
			</div>
			<Button
				label="Contact"
				class="w-[18%]"
				icon="pi pi-phone"
				@mouseover="menuElementHover(new THREE.Vector3(-3, 0, 1))"
				@mouseout="menuElementOut()"
				@click="clickMenuButton(2)" />
			<Button
				label="À propos"
				class="w-[18%]"
				icon="pi pi-info-circle"
				@mouseover="menuElementHover(new THREE.Vector3(2, -1, 4))"
				@mouseout="menuElementOut()"
				@click="clickMenuButton(3)" />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import * as THREE from "three";
	import { useRouter } from "vue-router";
	import type { SceneManager } from "~/utils/ThreeJS/SceneManager";
	import { AboutScene } from "~/utils/ThreeJS/scenes/AboutScene";
	import { BlogScene } from "~/utils/ThreeJS/scenes/BlogScene";
	import { ContactScene } from "~/utils/ThreeJS/scenes/ContactScene";
	import { MainMenuScene } from "~/utils/ThreeJS/scenes/MainMenuScene";
	import { PortfolioScene } from "~/utils/ThreeJS/scenes/PortfolioScene";

	const router = useRouter();

	const props = defineProps<{
		sceneManager: SceneManager | null;
		container: HTMLDivElement | null;
	}>();
	function goHome() {
		if (props.sceneManager) {
			props.sceneManager.clearScenes();
			goToRightPage();
		}
	}
	function goBack() {
		if (props.sceneManager) {
			props.sceneManager.goBackOneScene();
			goToRightPage();
		}
	}
	function goBackForward() {
		if (props.sceneManager) {
			props.sceneManager.goBackForward();
			goToRightPage();
		}
	}

	function goToRightPage() {
		if(!props.sceneManager) return;
		const scene = props.sceneManager.getCurrentScene();
		if (scene instanceof MainMenuScene) router.push("/");
		else if (scene instanceof PortfolioScene) router.push("/portfolio");
		else if (scene instanceof BlogScene) router.push("/blog");
		else if (scene instanceof ContactScene) router.push("/contact");
		else if (scene instanceof AboutScene) router.push("/about");
	}

	function menuElementHover(position?: THREE.Vector3) {
		if (props.sceneManager && position) {
			const currentScene = props.sceneManager.getCurrentScene() as MainMenuScene;
			if (currentScene && currentScene instanceof MainMenuScene) {
				const planet = currentScene.getPlanet();
				const clouds = currentScene.getClouds();
				if (planet && clouds) {
					currentScene.rotatePlanetTo(position);
					currentScene.setIsHoveringMenuElement(true);
				}
			}
		}
	}

	function menuElementOut() {
		if (props.sceneManager) {
			const currentScene = props.sceneManager.getCurrentScene() as MainMenuScene;
			if (currentScene && currentScene instanceof MainMenuScene) {
				currentScene.setIsHoveringMenuElement(false);
			}
		}
	}

	function clickMenuButton(x: number) {
		if (props.sceneManager && props.container) {
			switch (x) {
				case 0:
					props.sceneManager.addScene(
						new PortfolioScene(props.container, props.sceneManager as SceneManager)
					);
					router.push("/portfolio");
					break;
				case 1:
					props.sceneManager.addScene(new BlogScene(props.container, props.sceneManager as SceneManager));
					router.push("/blog");
					break;
				case 2:
					props.sceneManager.addScene(new ContactScene(props.container, props.sceneManager as SceneManager));
					router.push("/contact");
					break;
				case 3:
					props.sceneManager.addScene(new AboutScene(props.container, props.sceneManager as SceneManager));
					router.push("/about");
					break;
			}
		}
	}
</script>

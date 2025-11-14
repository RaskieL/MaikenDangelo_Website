<template>
	<div ref="containerRef" class="w-screen h-screen absolute">
		<div class="flex z-20 m-5 gap-10 absolute h-[10vh] w-full items-center">
			<div
				class="flex flex-row p-5 gap-5 justify-center items-center bg-[rgba(0,0,0,0.6)] rounded-xl backdrop-blur-sm w-[10vw] h-[6vh]">
				<Button
					:disabled="sceneManagerRef && sceneManagerRef.getCurrentIndex() <= 0"
					icon="pi pi-angle-left"
					rounded
					@click="goBack()" />
				<Button
					:disabled="sceneManagerRef && sceneManagerRef.getCurrentIndex() <= 0"
					icon="pi pi-home"
					rounded
					@click="goHome()" />
				<Button
					:disabled="
						sceneManagerRef && sceneManagerRef.getCurrentIndex() >= sceneManagerRef.getScenesNumber() - 1
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
		<div class="flex absolute z-10 h-screen w-screen items-center justify-center">
			<div v-if="sceneManagerRef && sceneManagerRef.getCurrentScene() instanceof MainMenuScene">
				<MainMenu />
			</div>
			<div v-else-if="sceneManagerRef && sceneManagerRef.getCurrentScene() instanceof ContactScene">
				<Contact />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import * as THREE from "three";
	import { SceneManager } from "~/utils/ThreeJS/SceneManager";
	import { AboutScene } from "~/utils/ThreeJS/scenes/AboutScene";
	import { BlogScene } from "~/utils/ThreeJS/scenes/BlogScene";
	import { ContactScene } from "~/utils/ThreeJS/scenes/ContactScene";
	import { MainMenuScene } from "~/utils/ThreeJS/scenes/MainMenuScene";
	import { PortfolioScene } from "~/utils/ThreeJS/scenes/PortfolioScene";
	import  MainMenu from "~/pages/MainMenu.vue" 

	useHead({
		titleTemplate: "%s - Maïken D'Angelo",
	});
	useSeoMeta({
		title: "Maïken D'Angelo",
		ogTitle: "Maïken D'Angelo",
		description: "Site portfolio de Maïken D'Angelo, développeuse informatique.",
		ogDescription: "Site portfolio de Maïken D'Angelo, développeuse informatique.",
	});

	const containerRef = ref<HTMLDivElement | undefined>(undefined);
	const sceneManagerRef = ref<SceneManager | undefined>(undefined);

	onMounted(async () => {
		if (!containerRef.value) {
			return;
		}
		const sceneManager = new SceneManager(containerRef.value);
		sceneManagerRef.value = sceneManager;

		const main_menu = new MainMenuScene(containerRef.value, sceneManager);
		sceneManager.addScene(main_menu);

		sceneManager.render();
		sceneManager.animate(() => {
			const scene = sceneManager.getCurrentScene();
			if (scene && scene instanceof MainMenuScene) {
				scene.animate();
			}
		});
	});

	function goHome() {
		if (sceneManagerRef.value) {
			sceneManagerRef.value.clearScenes();
		}
	}
	function goBack() {
		if (sceneManagerRef.value) {
			sceneManagerRef.value.goBackOneScene();
		}
	}
	function goBackForward() {
		if (sceneManagerRef.value) {
			sceneManagerRef.value.goBackForward();
		}
	}

	function menuElementHover(position?: THREE.Vector3) {
		if (sceneManagerRef.value && position) {
			const currentScene = sceneManagerRef.value.getCurrentScene() as MainMenuScene;
			if (currentScene) {
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
		if (sceneManagerRef.value) {
			const currentScene = sceneManagerRef.value.getCurrentScene() as MainMenuScene;
			if (currentScene) {
				currentScene.setIsHoveringMenuElement(false);
			}
		}
	}

	function clickMenuButton(x: number) {
		if (sceneManagerRef.value && containerRef.value) {
			switch (x) {
				case 0:
					sceneManagerRef.value.addScene(
						new PortfolioScene(containerRef.value, sceneManagerRef.value as SceneManager)
					);
					break;
				case 1:
					sceneManagerRef.value.addScene(
						new BlogScene(containerRef.value, sceneManagerRef.value as SceneManager)
					);
					break;
				case 2:
					sceneManagerRef.value.addScene(
						new ContactScene(containerRef.value, sceneManagerRef.value as SceneManager)
					);
					break;
				case 3:
					sceneManagerRef.value.addScene(
						new AboutScene(containerRef.value, sceneManagerRef.value as SceneManager)
					);
					break;
			}
			sceneManagerRef.value.goToLastScene();
		}
	}
</script>

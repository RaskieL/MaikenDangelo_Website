<template>
	<div ref="containerRef" class="h-screen w-screen absolute z-10">
    <NavBar class="z-30" :scene-manager="sceneManagerRef as SceneManager" :container="containerRef as HTMLDivElement" />
		<div class="flex h-screen w-screen absolute z-20 items-center justify-center">
			<slot />
		</div>
    <Footer />
	</div>
</template>

<script lang="ts" setup>
	import { SceneManager } from "~/utils/ThreeJS/SceneManager";
	import { MainMenuScene } from "~/utils/ThreeJS/scenes/MainMenuScene";

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
</script>

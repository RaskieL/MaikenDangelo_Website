<template>
	<div ref="containerRef" class="h-screen w-screen absolute z-10">
		<NavBar
			class="z-30"
			:scene-manager="sceneManagerRef as SceneManager"
			:container="containerRef as HTMLDivElement" />
		<div class="flex h-screen w-screen absolute z-20 items-center justify-center">
			<slot />
		</div>
		<Footer />
	</div>
</template>

<script lang="ts" setup>
	import { SceneManager } from "~/utils/ThreeJS/SceneManager";
	import { MainMenuScene } from "~/utils/ThreeJS/scenes/MainMenuScene";
	import { useRoute } from "vue-router";
	import { ContactScene } from "~/utils/ThreeJS/scenes/ContactScene";
	import { AboutScene } from "~/utils/ThreeJS/scenes/AboutScene";
	import { PortfolioScene } from "~/utils/ThreeJS/scenes/PortfolioScene";
	import { BlogScene } from "~/utils/ThreeJS/scenes/BlogScene";

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

	const route = useRoute();

	onMounted(async () => {
		if (!containerRef.value) {
			return;
		}
		const sceneManager = new SceneManager(containerRef.value);
		sceneManagerRef.value = sceneManager;

		const main_menu = new MainMenuScene(containerRef.value, sceneManager);
		sceneManager.addScene(main_menu);

		const currentRoute = route.name;
		if (currentRoute === "Contact") {
			const contact = new ContactScene(containerRef.value, sceneManager);
			sceneManager.addScene(contact);
		} else if (currentRoute === "About") {
			const about = new AboutScene(containerRef.value, sceneManager);
			sceneManager.addScene(about);
		} else if (currentRoute === "Portfolio") {
			const portfolio = new PortfolioScene(containerRef.value, sceneManager);
			sceneManager.addScene(portfolio);
		} else if (currentRoute === "Blog") {
			const blog = new BlogScene(containerRef.value, sceneManager);
			sceneManager.addScene(blog);
		}

		sceneManager.render();
		sceneManager.animate(() => {
			const scene = sceneManager.getCurrentScene();
			if (scene && scene instanceof MainMenuScene) {
				scene.animate();
			}
		});
	});
</script>

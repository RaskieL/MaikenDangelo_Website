<template>
  <div ref="containerRef" class="w-screen h-screen absolute">
    <div class="flex absolute z-10 h-screen w-screen items-center justify-center">
      <div v-if="sceneManagerRef && sceneManagerRef.getCurrentScene() instanceof MainMenu_Scene">
        <MainMenu :scene-manager="sceneManagerRef as SceneManager" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { SceneManager } from "~/utils/ThreeJS/SceneManager";
  import { MainMenu_Scene } from "~/utils/ThreeJS/scenes/MainMenu_Scene";

  useHead({
    titleTemplate: "%s - Maïken D'Angelo",
  })
  useSeoMeta({
  title: "Maïken D\'Angelo",
  ogTitle: "Maïken D\'Angelo",
  description: "Site portfolio de Maïken D'Angelo, développeuse informatique.",
  ogDescription: "Site portfolio de Maïken D'Angelo, développeuse informatique.",
})

  const containerRef = ref<HTMLDivElement | null>(null);
  const sceneManagerRef = ref<SceneManager | null>(null);

  onMounted( async () => {
    if (!containerRef.value) return;
      const sceneManager = new SceneManager(containerRef.value);
      sceneManagerRef.value = sceneManager;
    
      const main_menu = new MainMenu_Scene(containerRef.value, sceneManager);
      sceneManager.addScene(main_menu);

      sceneManager.render();
      sceneManager.animate(() => {
        const scene = sceneManager.getCurrentScene();
        if (!scene) return;
        if (scene instanceof MainMenu_Scene) {
          scene.animate();
        }
      })
  });
  
</script>

<style>

</style>
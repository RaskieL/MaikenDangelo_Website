<template>
  <div ref="containerRef" class="w-full h-screen absolute">
    <div class="main-menu absolute inset-0 flex flex-col justify-center items-center lg:items-start lg:ml-[5vw] text-white z-10">

      <div v-if="sceneManagerRef && sceneManagerRef.getCurrentScene() instanceof MainMenu_Scene" class="w-full flex justify-center lg:justify-start">
        <MainMenu :scene-manager="sceneManagerRef as SceneManager" />
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
  import { SceneManager } from "~/utils/ThreeJS/SceneManager";
  import { MainMenu_Scene } from "~/utils/ThreeJS/scenes/MainMenu_Scene";

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
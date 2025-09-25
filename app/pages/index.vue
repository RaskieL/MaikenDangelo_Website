<template>
  <div ref="containerRef" class="w-full h-screen absolute">
    <div class="main-menu absolute inset-0 flex flex-col justify-center items-center lg:items-start lg:ml-[5vw] text-white z-10">

      <div class="flex flex-col gap-5 justify-center text-align-center items-center bg-[rgba(0,0,0,0.6)] p-10 rounded-xl">
        <h1 class="w-[95vw] lg:w-[25vw] text-[40px] lg:text-[48px] text-center bg-[rgba(0,0,0,0.4)] p-5 rounded-lg">MAÏ-K3N OS v1.0</h1>
        <Button label="Portfolio" class="w-[95vw] lg:w-[25vw]"/>
        <Button label="Blog" class="w-[95vw] lg:w-[25vw]" disabled/>
        <Button label="Contact" class="w-[95vw] lg:w-[25vw]"/>
        <Button label="À propos" class="w-[95vw] lg:w-[25vw]"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
  import { SceneManager } from "~/utils/ThreeJS/SceneManager";
  import { MainMenu_Scene } from "~/utils/ThreeJS/scenes/MainMenu_Scene";

  const containerRef = ref<HTMLDivElement | null>(null);

  onMounted( async () => {
    if (!containerRef.value) return;
      const sceneManager = new SceneManager(containerRef.value);
    
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
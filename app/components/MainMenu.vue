<template>
  <div
    class="flex flex-col gap-5 justify-center items-center bg-[rgba(0,0,0,0.6)] p-10 rounded-xl backdrop-blur-sm lg:mr-[50vw] w-[95vw] md:w-[500px] lg:w-[500px]"
  >
    <div class="lg:w-full p-5 rounded-lg text-center">
      <h1 class="text-[40px] lg:text-[48px]">maikendangelo.fr</h1>
      <p class="text-[14px] lg:text-[16px] text-center">
        Le jardin de Maïken, développeuse informatique.
      </p>
    </div>

    <Button
      label="Portfolio"
      class="w-[98%]"
      @mouseover="menuElementHover(new THREE.Vector3(-0.5, 0, 1))"
      @mouseout="menuElementOut()"
    />
    <Button
      label="Blog"
      class="w-[98%]"
      @mouseover="menuElementHover(new THREE.Vector3(0, 1, 3))"
      @mouseout="menuElementOut()"
    />
    <Button
      label="Contact"
      class="w-[98%]"
      @mouseover="menuElementHover(new THREE.Vector3(-3, 0, 1))"
      @mouseout="menuElementOut()"
    />
    <Button
      label="À propos"
      class="w-[98%]"
      @mouseover="menuElementHover(new THREE.Vector3(2, -1, 4))"
      @mouseout="menuElementOut()"
    />
  </div>
</template>

<script lang="ts" setup>
import * as THREE from "three";
import type { SceneManager } from "~/utils/ThreeJS/SceneManager";
import type { MainMenu_Scene } from "~/utils/ThreeJS/scenes/MainMenu_Scene";

useHead({
  title: "Accueil",
});

const props = defineProps<{
  sceneManager: SceneManager | null;
}>();

function menuElementHover(position?: THREE.Vector3) {
  if (props.sceneManager && position) {
    const currentScene = props.sceneManager.getCurrentScene() as MainMenu_Scene;
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
  if (props.sceneManager) {
    const currentScene = props.sceneManager.getCurrentScene() as MainMenu_Scene;
    if (currentScene) {
      currentScene.setIsHoveringMenuElement(false);
    }
  }
}
</script>

<style></style>

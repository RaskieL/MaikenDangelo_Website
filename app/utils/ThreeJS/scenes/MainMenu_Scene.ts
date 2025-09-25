import * as THREE from 'three';
import { SceneManager } from '../SceneManager';

import { RScene } from './Scene';

export class MainMenu_Scene extends RScene {
  private planet: THREE.Mesh | null = null;
  private clouds: THREE.Mesh | null = null;
  private atmosphere: THREE.Mesh | null = null;
  private cockpit: THREE.Group | null = null;
  private navsphere: THREE.Mesh | null = null;
  private planetMaterial: THREE.MeshStandardMaterial | null = null;
  private cloudMaterial: THREE.MeshStandardMaterial | null = null;
  private initialized = false;
  private introAnimationDone = false;

  constructor(container: HTMLElement, sceneManager: SceneManager) {
    super(container, sceneManager);
    this.Init();
  }

  private async InitPlanet() {
    // Constructing Planet
    const baseColor = await this.loadTexture('/textures/BaseColor_NoCloud_Texture.png');
    const normalMap = await this.loadTexture('/textures/Normal_Texture.png');
    const roughnessMap = await this.loadTexture('/textures/Roughness_NoCloud_Texture.png');
    baseColor.colorSpace = THREE.SRGBColorSpace;

    const planetMaterial = new THREE.MeshStandardMaterial({
      map: baseColor,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      metalness: 0.0,
      roughness: 1.0,
      flatShading: false,
      side: THREE.FrontSide,
    });

    const geometry = new THREE.SphereGeometry(1, 128, 128);
    geometry.computeVertexNormals();
    const planet = new THREE.Mesh(geometry, planetMaterial);
    planet.name = 'Planet';
    this.planet = planet;
    this.planetMaterial = planetMaterial;

    const clouds = await this.loadTexture('/textures/earth_clouds_8K.png');
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: clouds,
      alphaMap: clouds,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      flatShading: false,
    });
    const cloudGeometry = new THREE.SphereGeometry(1.01, 128, 128);
    cloudGeometry.computeVertexNormals();
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.name = 'Clouds';
    this.clouds = cloudMesh;
    this.cloudMaterial = cloudMaterial;


    const uniforms = {
      uColor: { value: new THREE.Color(0x3399ff) },
      uDensity: { value: 0.05 },
    };

    const volMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec3 vPos;
        void main() {
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        uniform vec3 uColor;
        uniform float uDensity;

        void main() {
          float intensity = exp(-uDensity * length(vPos)); 
          gl_FragColor = vec4(uColor, 1.0 - intensity); // effet "brume"
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const volumetricSphere = new THREE.Mesh(cloudGeometry, volMat);
    volumetricSphere.name = 'VolumetricSphere';
    this.atmosphere = volumetricSphere;

    this.addToScene(planet);
    this.addToScene(cloudMesh);
    this.addToScene(volumetricSphere);

    planet.scale.set(0.01, 0.01, 0.01);
    cloudMesh.scale.set(0.01, 0.01, 0.01);
    volumetricSphere.scale.set(0.01, 0.01, 0.01);
    planet.position.set(3.25, -1.75, 1);
    cloudMesh.position.set(3.25, -1.75, 1);
    volumetricSphere.position.set(3.25, -1.75, 1);
  }

  private async InitCockpit() {
    const cockpit = await this.loadGLTF('/models/cockpit/cockpit.gltf');
    let navsphere: THREE.Mesh | null = null;
    if (cockpit) {
      cockpit.rotation.set(0, 1.57075, 0);
      cockpit.scale.set(0.25, 0.25, 0.25);
      cockpit.position.set(
        this.getCamera().position.x,
        this.getCamera().position.y - 0.15,
        this.getCamera().position.z - 0.25
      );
      navsphere = cockpit.getObjectByName("Navsphere") as THREE.Mesh;
      this.cockpit = cockpit;
      this.navsphere = navsphere;
    }

    //const navsphereTexture = await this.loadTexture('/textures/Navsphere_Texture.png');
    const emissionTexture = await this.loadTexture('/textures/Navsphere_Emission_Texture.png');

    // emission
    if (navsphere && navsphere.material) {
      const material = navsphere.material as THREE.MeshStandardMaterial;
      material.emissive = new THREE.Color(0xffffff);
      material.emissiveIntensity = 5.0;
      material.emissiveMap = emissionTexture;
      material.needsUpdate = true;
    }
  }


  async Init() {
    if (this.initialized) return;

    this.getCamera().fov = 180;
    this.getCamera().updateProjectionMatrix();

    const lightColor = '#FDE9A4';
    const lightIntensity = 5;
    const light = new THREE.DirectionalLight(lightColor, lightIntensity);
    light.position.set(-10, 5, -2);
    light.target.position.set(0, 0, 0);

    this.addToScene(light);
    this.addToScene(light.target);

    // this.addSkyboxFromEquirectangular('/textures/HDR_galactic_plane_no_nebulae.hdr');

    const skybox = await this.loadGLTF('/models/inside_galaxy/scene.gltf');
    if (skybox) {
      skybox.scale.set(10, 10, 10);
      this.addToScene(skybox);
    }

    await this.InitPlanet();
    await this.InitCockpit();

    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
  isIntroAnimationDone(): boolean {
    return this.introAnimationDone;
  }
  setIntroAnimationDone(value: boolean) {
    this.introAnimationDone = value;
    if (!value) {
      // Reset planet and camera
      if (this.planet && this.clouds && this.atmosphere) {
        this.planet.scale.set(0.01, 0.01, 0.01);
        this.clouds.scale.set(0.01, 0.01, 0.01);
        this.atmosphere.scale.set(0.01, 0.01, 0.01);
      }
      this.getCamera().fov = 180;
      this.getCamera().updateProjectionMatrix();
    }
  }

  animate() {
    if (!this.initialized) return;



    if (this.planet && this.planetMaterial) {
      this.planet.rotateOnAxis(new THREE.Vector3(0.34, 0.76, 0), 0.00005);
      this.planetMaterial.needsUpdate = true;
    }
    if (this.clouds && this.cloudMaterial) {
      this.clouds.rotateOnAxis(new THREE.Vector3(0.34, 0.76, 0), 0.000035);
      this.cloudMaterial.needsUpdate = true;
    }
    if (this.cockpit && this.navsphere) {
      this.navsphere.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
    }
    if (!this.introAnimationDone) {
      // Intro animation
      if (this.planet && this.clouds && this.atmosphere) {
        if (this.getCamera().fov > 75) {
          const scaleFactor = 0.2;
          this.getCamera().fov -= scaleFactor;
          this.getCamera().updateProjectionMatrix();
        } else {
          this.getCamera().fov = 75;
          this.getCamera().updateProjectionMatrix();
        }

        if (this.planet.scale.x < 4) {
          const scaleFactor = 0.01;
          this.planet.scale.x += scaleFactor;
          this.planet.scale.y += scaleFactor;
          this.planet.scale.z += scaleFactor;

          this.clouds.scale.x += scaleFactor * 1.0125;
          this.clouds.scale.y += scaleFactor * 1.0125;
          this.clouds.scale.z += scaleFactor * 1.0125;

          this.atmosphere.scale.x += scaleFactor * 1.015;
          this.atmosphere.scale.y += scaleFactor * 1.015;
          this.atmosphere.scale.z += scaleFactor * 1.015;
        } else {
          this.planet.scale.set(4, 4, 4);
          this.clouds.scale.set(4.05, 4.05, 4.05);
          this.atmosphere.scale.set(4.06, 4.06, 4.06);
        }

        if (this.planet.scale.x >= 4 && this.getCamera().fov <= 75) {
          this.introAnimationDone = true;
        }
      }
    }
  }
}

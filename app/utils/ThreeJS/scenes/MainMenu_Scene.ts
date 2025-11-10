import * as THREE from "three";
import { SceneManager } from "../SceneManager";

import { RScene } from "./Scene";

export class MainMenu_Scene extends RScene {
  private planet: THREE.Mesh | null = null;
  private clouds: THREE.Mesh | null = null;
  private atmosphere: THREE.Mesh | null = null;
  private planetMaterial: THREE.MeshStandardMaterial | null = null;
  private cloudMaterial: THREE.MeshStandardMaterial | null = null;
  private light: THREE.DirectionalLight | null = null;
  private initialized = false;
  private introAnimationDone = false;
  private isRotatingToCoordinate = false;
  private targetRotationQuaternion: THREE.Quaternion | null = null;
  private isHoveringMenuElement = false;
  private isResettingCameraPosition = false;
  private cameraLerpStart: number | null = null;
  private cameraLerpDuration = 500; // durée en ms (1.5s)
  private startCameraQuaternion: THREE.Quaternion | null = null;
  private targetCameraQuaternion: THREE.Quaternion | null = null;

  constructor(container: HTMLElement, sceneManager: SceneManager) {
    super(container, sceneManager);
    this.Init();
  }

  private async InitPlanet() {
    // Constructing Planet
    const baseColor = await this.loadTexture(
      "/textures/BaseColor_NoCloud_Texture.png"
    );
    const normalMap = await this.loadTexture("/textures/Normal_Texture.png");
    const roughnessMap = await this.loadTexture(
      "/textures/Roughness_NoCloud_Texture.png"
    );
    baseColor.colorSpace = THREE.SRGBColorSpace;

    const planetMaterial = new THREE.MeshPhysicalMaterial({
      map: baseColor,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      metalness: 0.0,
      roughness: 1.0,
    });

    const geometry = new THREE.SphereGeometry(1, 512, 512);
    geometry.computeVertexNormals();
    const planet = new THREE.Mesh(geometry, planetMaterial);
    planet.name = "Planet";
    this.planet = planet;
    this.planetMaterial = planetMaterial;

    const clouds = await this.loadTexture("/textures/earth_clouds_8K.png");
    const cloudMaterial = new THREE.MeshPhysicalMaterial({
      map: clouds,
      alphaMap: clouds,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.1,
    });
    const cloudGeometry = new THREE.SphereGeometry(1.01, 128, 128);
    cloudGeometry.computeVertexNormals();
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.name = "Clouds";
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
    volumetricSphere.name = "VolumetricSphere";
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

    this.planet.castShadow = true;
    this.clouds.castShadow = true;
    this.planet.receiveShadow = true;
    this.clouds.receiveShadow = true;

    this.atmosphere.castShadow = false;
    this.atmosphere.receiveShadow = false;
  }

  async Init() {
    if (this.initialized) return;

    this.getCamera().fov = 180;
    this.getCamera().updateProjectionMatrix();

    const lightColor = "#F4E99B";
    const lightIntensity = 5;
    const sunLight = new THREE.DirectionalLight(lightColor, lightIntensity);
    const ambientLight = new THREE.AmbientLight(lightColor, 0.2);
    sunLight.position.set(-8, 2, -3);

    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 1000;

    sunLight.shadow.camera.left = -5;
    sunLight.shadow.camera.right = 5;
    sunLight.shadow.camera.top = 5;
    sunLight.shadow.camera.bottom = -5;

    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;

    // this.addSkyboxFromEquirectangular('/textures/HDR_galactic_plane_no_nebulae.hdr');

    const skybox = await this.loadGLTF("/models/inside_galaxy/scene.gltf");
    if (skybox) {
      skybox.scale.set(10, 10, 10);
      skybox.castShadow = false;
      skybox.receiveShadow = false;
      this.addToScene(skybox);
    }

    await this.InitPlanet();

    sunLight.target = new THREE.Object3D();
    sunLight.target.position.set(0, 0, 0);
    this.addToScene(sunLight.target);

    this.light = sunLight;
    this.addToScene(sunLight);
    this.addToScene(ambientLight);

    this.initialized = true;
  }

  // ANIMATION LOGIC
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
        this.planet.scale.set(0.001, 0.001, 0.001);
        this.clouds.scale.set(0.001, 0.001, 0.001);
        this.atmosphere.scale.set(0.001, 0.001, 0.001);
      }
      this.getCamera().fov = 180;
      this.getCamera().updateProjectionMatrix();
    }
  }

  animate() {
    if (!this.initialized) return;

    if (!this.isHoveringMenuElement) {
      if (this.planet && this.planetMaterial) {
        this.planet.rotateOnAxis(new THREE.Vector3(0.34, 0.76, 0), 0.00005);
      }
    }

    if (this.clouds && this.cloudMaterial) {
      this.clouds.rotateOnAxis(new THREE.Vector3(0.34, 0.76, 0), 0.000035);
    }

    if (!this.introAnimationDone) {
      // Intro animation
      if (this.planet && this.clouds && this.atmosphere) {
        if (this.getCamera().fov > 75) {
          const scaleFactor = 0.4375;
          this.getCamera().fov -= scaleFactor;
          this.getCamera().updateProjectionMatrix();
        } else {
          this.getCamera().fov = 75;
          this.getCamera().updateProjectionMatrix();
        }

        if (this.planet.scale.x < 4) {
          const scaleFactor = 0.01665;
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

    if (
      this.isRotatingToCoordinate &&
      this.targetRotationQuaternion &&
      this.planet &&
      this.clouds
    ) {
      this.rotatePlanetToQt(this.targetRotationQuaternion);
      this.pointCameraToQt(this.targetRotationQuaternion);
    }

    if (
      this.isResettingCameraPosition &&
      this.cameraLerpStart &&
      this.startCameraQuaternion &&
      this.targetCameraQuaternion
    ) {
      const elapsed = performance.now() - this.cameraLerpStart;
      const t = Math.min(elapsed / this.cameraLerpDuration, 1);

      this.getCamera().quaternion.slerpQuaternions(
        this.startCameraQuaternion,
        this.targetCameraQuaternion,
        t
      );

      if (t >= 1) {
        this.cameraLerpStart = null;
        this.startCameraQuaternion = null;
        this.targetCameraQuaternion = null;
        this.isResettingCameraPosition = false;
      }
    }
  }

  public rotatePlanetTo(position: THREE.Vector3) {
    if (!this.planet) return;
    if (!this.clouds) return;
    if (!this.introAnimationDone) return;
    const direction = new THREE.Vector3()
      .subVectors(position, this.planet.position)
      .normalize();

    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );

    this.isRotatingToCoordinate = true;
    this.isResettingCameraPosition = false;
    this.targetRotationQuaternion = targetQuaternion;
  }

  public rotatePlanetToQt(
    targetQuaternion: THREE.Quaternion,
    speed: number = 0.05
  ) {
    if (!this.planet) return;
    if (!this.clouds) return;

    this.planet.quaternion.slerp(targetQuaternion, speed);
    this.clouds.quaternion.slerp(targetQuaternion, speed);

    const angleDifference = this.planet.quaternion.angleTo(targetQuaternion);

    if (angleDifference < 0.001) {
      this.planet.quaternion.copy(targetQuaternion);
      this.clouds.quaternion.copy(targetQuaternion);
      this.isRotatingToCoordinate = false;
      this.targetRotationQuaternion = null;
    }
  }

  public pointCameraTo(position: THREE.Vector3) {
    if (!this.introAnimationDone) return;

    const direction = new THREE.Vector3()
      .subVectors(position, this.getCamera().position)
      .normalize();

    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, -1),
      direction
    );

    this.startCameraQuaternion = this.getCamera().quaternion.clone();
    this.targetCameraQuaternion = targetQuaternion;
    this.cameraLerpStart = performance.now();
    this.cameraLerpDuration = this.cameraLerpDuration;
  }

  public pointCameraToQt(
    targetQuaternion: THREE.Quaternion,
    speed: number = 0.05
  ) {
    if (!targetQuaternion) return;
    this.isResettingCameraPosition = false;

    this.getCamera().quaternion.slerp(targetQuaternion, speed);

    const angleDifference =
      this.getCamera().quaternion.angleTo(targetQuaternion);

    if (isNaN(angleDifference)) return;

    if (angleDifference < 0.001) {
      this.getCamera().quaternion.copy(targetQuaternion);
      this.targetCameraQuaternion = null;
    }
  }

  public resetCameraTarget() {
    if (!this.introAnimationDone) return;
    this.isResettingCameraPosition = true;
    this.isRotatingToCoordinate = false;

    this.pointCameraTo(new THREE.Vector3(0, 0, 0));
  }

  public getPlanet(): THREE.Mesh | null {
    return this.planet;
  }

  public getClouds(): THREE.Mesh | null {
    return this.clouds;
  }

  public getAtmosphere(): THREE.Mesh | null {
    return this.atmosphere;
  }

  public setIsHoveringMenuElement(value: boolean) {
    this.isHoveringMenuElement = value;
    if (!value) {
      this.resetCameraTarget();
    }
  }

  public getIsHoveringMenuElement(): boolean {
    return this.isHoveringMenuElement;
  }
}

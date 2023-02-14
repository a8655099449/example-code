import React from 'react';
import {
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MultiplyBlending,
  PlaneGeometry,
  SpotLight,
  TextureLoader,
} from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GroundProjectedEnv } from 'three/examples/jsm/objects/GroundProjectedEnv';

import { three } from '../../utils';
import { carEnv, ferrari, ferrari_aoTexture } from './imgs';
import { useBaseTree } from './useBaseThree';

export default function Porsche() {
  function initPage() {
    ref.current.camera.position.set(-20, 7, 20);
    const { renderer } = ref.current;
    renderer.outputEncoding = three.sRGBEncoding;
    renderer.toneMapping = three.ACESFilmicToneMapping;

    addEnv();
    loadCarModel();
  }
  const { ref, dom } = useBaseTree({
    onCreated() {
      initPage();
    },
    axesHelper: true,
    // light: false,
  });
  // 加载环境贴图
  async function addEnv() {
    const hdrLoader = new RGBELoader();
    const envMap = await hdrLoader.loadAsync(carEnv);
    envMap.mapping = three.EquirectangularRefractionMapping;
    const env = new GroundProjectedEnv(envMap);
    env.scale.setScalar(100);
    ref.current.scene.add(env);
  }
  // 加载法拉利模型
  async function loadCarModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/libs/draco/gltf/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const gltf = await loader.loadAsync(ferrari);
    const shadow = new TextureLoader().load(ferrari_aoTexture.default);

    const bodyMaterial = new MeshPhysicalMaterial({
      color: '#000',
      metalness: 1.0,
      roughness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
    });

    const detailsMaterial = new MeshStandardMaterial({
      color: '#fff',
      metalness: 1.0,
      roughness: 0.5,
    });
    const glassMaterial = new MeshPhysicalMaterial({
      color: '#fff',
      metalness: 0.25,
      roughness: 0,
      transmission: 1,
    });

    const carModel = gltf.scene.children[0];

    carModel.scale.multiplyScalar(4);

    carModel.rotation.y = Math.PI;

    carModel.getObjectByName('body').material = bodyMaterial;

    carModel.getObjectByName('rim_fl').material = detailsMaterial;
    carModel.getObjectByName('rim_fr').material = detailsMaterial;
    carModel.getObjectByName('rim_rr').material = detailsMaterial;
    carModel.getObjectByName('rim_rl').material = detailsMaterial;
    carModel.getObjectByName('trim').material = detailsMaterial;
    carModel.getObjectByName('glass').material = glassMaterial;

    const mesh = new Mesh(
      new PlaneGeometry(0.655 * 4, 1.3 * 4),
      new MeshBasicMaterial({
        map: shadow,
        blending: MultiplyBlending,
        toneMapped: false,
        transparent: true,
      }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 2;
    carModel.add(mesh);

    const { scene } = ref.current;

    const light = new SpotLight('#f00', 1);
    light.position.set(1, 1, 1);
    // light.target = carModel;
    carModel.add(light);

    scene.add(carModel);
    scene.add(light);
  }

  return (
    <div
      style={{
        height: 800,
      }}
      ref={dom}
    ></div>
  );
}

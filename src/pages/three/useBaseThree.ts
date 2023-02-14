import { GUI } from 'dat.gui';
import { useEffect, useRef } from 'react';
import Stats from 'stats.js';

import { MyOrbitControls } from '../../types';
import { OrbitControls, THREE } from '../../utils/index';

type TRef = Partial<{
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  cube: THREE.Mesh;
  plane: THREE.Mesh; //平面
  controls: MyOrbitControls;
  gui: dat.GUI;
  color: string;
  texture: THREE.Texture;
  alphaTexture: THREE.Texture;
  material: THREE.MeshStandardMaterial;
  loaderManger: THREE.LoadingManager;
  directionalLight: THREE.SpotLight;
  stats: Stats;
}>;

type UseBaseTreeParams = Partial<{
  renderColor: string; // 场景颜色
  onCreated(): void; // 创建的回调函数
  gui: boolean; // 是否开启gui调试器
  light: boolean; // 是否自动加光
  onUpdate(): void; // 更新触发的回调
  axesHelper: boolean; // 是否添加坐标轴辅助
}>;

export const useBaseTree = (params: UseBaseTreeParams = {}) => {
  const {
    onCreated,
    renderColor = '#000',
    gui,
    light = true,
    onUpdate,
    axesHelper,
  } = params;

  const dom = useRef<HTMLDivElement>(null);
  const ref = useRef<TRef>({});

  // todo 1. 初始化场景
  const initScene = () => {
    const scene = new THREE.Scene();
    if (axesHelper) {
      const axes = new THREE.AxesHelper(5);
      scene.add(axes);
    }
    ref.current.scene = scene;
  };
  // todo 2. 初始化照相机
  const initCamera = () => {
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;
    const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);
    ref.current.camera = camera;
    ref.current.scene.add(camera);
  };

  // todo  添加控制器
  const addControls = () => {
    const { camera, renderer } = ref.current;
    const controls = new OrbitControls(camera, renderer.domElement);
    ref.current.controls = controls;
    controls.addEventListener('change', rerender);
    ref.current.controls.enableDamping = true;
  };

  const initStats = () => {
    const stats = new Stats();
    stats.showPanel(0);
    dom.current.appendChild(stats.dom);
    ref.current.stats = stats;
  };

  // todo 初始化渲染器
  const initRenderer = () => {
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(renderColor);
    ref.current.renderer = renderer;
    dom.current.appendChild(renderer.domElement);
    rerender();
  };

  // todo 重新渲染
  const rerender = () => {
    const { scene, camera, renderer } = ref.current;
    // console.log('👴2', renderer, scene, camera);
    renderer?.render(scene, camera);
  };
  // todo 更新视图 但存在动画时就需要调用这个函数
  const startAutoUpdate = () => {
    ref.current.stats.begin();

    // monitored code goes here

    requestAnimationFrame(startAutoUpdate);
    onUpdate?.();
    rerender();
    const { controls, directionalLight } = ref.current;
    controls?.update();

    directionalLight?.shadow.camera.updateProjectionMatrix();
    ref.current.stats.end();
  };
  // todo 打光
  const initLight = () => {
    const light = new THREE.AmbientLight('#fff', 1);
    ref.current.scene.add(light);
    // const directionalLight = new THREE.SpotLight('#fff', 1);
    // directionalLight.position.set(1, 1, 1);
    // ref.current.scene.add(directionalLight);
    // ref.current.directionalLight = directionalLight;
  };
  // todo 添加gui控制器

  const initGui = () => {
    ref.current.gui = new GUI();
  };

  const onMounted = () => {
    initStats();
    initScene();
    initCamera();
    initRenderer();
    addControls();
    light && initLight();
    startAutoUpdate();
    gui && initGui();
    onCreated?.();
  };
  const unMounted = () => {
    try {
      ref.current.renderer.dispose();
      ref.current.scene.clear();
      console.log('👴2023-02-09 14:31:03 useBaseThree.ts line:91', ref.current.renderer);
      dom.current?.removeChild(ref.current.renderer.domElement);
      ref.current.renderer = null;
      ref.current.gui?.destroy();
    } catch (error) {
      console.log('👴2023-02-09 14:35:38 useBaseThree.ts line:98', error);
    }
  };

  useEffect(() => {
    onMounted();
    return () => unMounted();
  });

  return {
    ...ref.current,
    dom,
    rerender,
    ref,
  };
};

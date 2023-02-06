import dat from 'dat.gui';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Material } from 'three';

import { MyOrbitControls } from '../../types';
import { OrbitControls, Three } from '../../utils';
import useBoxSize from '../../utils/hooks/useBoxSize';

type TRef = Partial<{
  render: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  cube: Three.Mesh;
  controls: MyOrbitControls;
  gui: dat.GUI;
  color: string;
}>;

const useThree = () => {
  const dom = useRef<HTMLDivElement>(null);
  const ref = useRef<TRef>({
    color: '#f00',
  });
  useBoxSize(dom, () => {
    if (!dom.current) {
      return;
    }
    // console.log('👴2023-02-03 17:58:03 useThree.ts line:16', width);
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;

    if (clientWidth < 1) {
      return;
    }
    ref.current.render.setSize(clientWidth, clientHeight);
    const { camera } = ref.current;
    camera.aspect = clientWidth / clientHeight;

    camera.updateProjectionMatrix();

    rerender();
  });

  const rerender = () => {
    const { scene, camera } = ref.current;
    ref.current.render.render(scene, camera);
  };

  /** @name 添加几何体 */
  const addCube = () => {
    const cubeGeometry = new Three.BoxGeometry(1, 1, 1);
    const cubeMaterial = new Three.MeshBasicMaterial({
      color: ref.current.color || '#f00',
    });
    const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
    ref.current.cube = cube;
  };
  /** @name 初始化场景 */
  const initScene = () => {
    const { camera, cube } = ref.current;
    const scene = new Three.Scene();
    const axes = new Three.AxesHelper(5);
    scene.add(camera);
    scene.add(axes);
    scene.add(cube);
    ref.current.scene = scene;
  };
  /** @name 初始化相机 */
  const initCamera = () => {
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;
    const camera = new Three.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);

    camera.position.set(0, 0, 10);
    ref.current.camera = camera;
  };

  const startRender = () => {
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;

    initCamera();
    addCube();
    initScene();
    const { scene, camera } = ref.current;

    const render = new Three.WebGLRenderer();
    render.setSize(clientWidth, clientHeight);
    dom.current.appendChild(render.domElement);
    // 设置场景背景颜色
    render.setClearColor('#000', 0.2);

    render.render(scene, camera);

    ref.current.render = render;

    // startMoveCube();
    startRotate();
    addControls();
    addGui();
  };

  /** @name 添加控制器 */
  const addControls = () => {
    const { camera, render } = ref.current;
    const controls = new OrbitControls(camera, render.domElement);
    ref.current.controls = controls;

    controls.addEventListener('change', rerender);

    ref.current.controls.enableDamping = true;
  };

  /** @name 添加gui调试器 */
  const addGui = () => {
    const { cube } = ref.current;
    const gui = new dat.GUI();
    gui.add(cube.position, 'x').min(0).max(5).name('x位置').step(0.01);
    gui.add(cube.rotation, 'x').min(0).max(5).name('角度');
    gui.add(cube.material, 'wireframe').name('展示线框');
    gui
      .addColor(ref.current, 'color')
      .name('展示线框')
      .onChange((e) => {
        (cube.material as any).color.set(e);
      });

    ref.current.gui = gui;
  };

  /** @name 启动物体移动 */
  const startMoveCube = () => {
    /*   requestAnimationFrame(startMoveCube);
    const { cube } = ref.current;
    cube.position.x += 0.01;
    if (cube.position.x > 5) {
      cube.position.x = 0;
    }
    rerender(); */

    const { cube } = ref.current;
    cube.position.x = 0;
    cube.rotation.x = 0;
    const a1 = gsap.to(cube.position, {
      x: 5,
      duration: 5,
      ease: 'power1.in', // 速度 https://greensock.com/docs/v3/Eases
      repeat: 2, // 重复次数 -1 为无限次
      yoyo: true, // 往返运动
      delay: 2, //延迟时间
    });

    gsap.to(cube.rotation, {
      x: 2 * Math.PI,
      duration: 5,
      ease: 'power1.in',
      repeat: -1,
    });
  };
  /** @name 启动物体旋转 */
  const startRotate = () => {
    // const { cube } = ref.current;
    requestAnimationFrame(startRotate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    rerender();

    // 将动画进行更新
    const { controls } = ref.current;
    controls?.update();
  };

  /** @name 清除实例 */
  const clear = () => {
    ref.current.render.forceContextLoss();
    ref.current.render.dispose();
    ref.current.scene.clear();
    dom.current.removeChild(ref.current.render.domElement);
    ref.current.render = null;
    gsap.killTweensOf(ref.current.cube);

    ref.current.gui.destroy();
  };

  useEffect(() => {
    startRender();
    return () => {
      clear();
    };
  }, []);

  return {
    dom,
    ref,
  };
};

export default useThree;

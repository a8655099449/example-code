import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three-orbitcontrols-ts';

import { Three } from '../../utils';
import useBoxSize from '../../utils/hooks/useBoxSize';
type TRef = Partial<{
  render: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  cube: Three.Mesh;
  controls: OrbitControls;
}>;

const useThree = () => {
  const dom = useRef<HTMLDivElement>(null);
  const ref = useRef<TRef>({});
  useBoxSize(dom, () => {
    // console.log('👴2023-02-03 17:58:03 useThree.ts line:16', width);
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;

    if (clientWidth < 1) {
      return;
    }
    ref.current.render.setSize(clientWidth, clientHeight);
    rerender();
  });
  const rerender = () => {
    const { scene, camera } = ref.current;
    ref.current.render.render(scene, camera);
  };

  const startRender = () => {
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;
    // 初始化场景
    const scene = new Three.Scene();

    // 初始化相机
    const camera = new Three.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    scene.add(camera);
    camera.position.set(0, 0, 10);
    // 添加物体
    const cubeGeometry = new Three.BoxGeometry(1, 1, 1);
    const cubeMaterial = new Three.MeshBasicMaterial({ color: '#f00' });
    const cube = new Three.Mesh(cubeGeometry, cubeMaterial);

    const axes = new Three.AxesHelper(10);
    scene.add(axes);
    scene.add(cube);

    const render = new Three.WebGLRenderer();
    render.setSize(clientWidth, clientHeight);
    dom.current.appendChild(render.domElement);
    // 设置场景背景颜色
    render.setClearColor('#000', 0.2);

    render.render(scene, camera);

    ref.current = {
      ...ref.current,
      render,
      scene,
      camera,
      cube,
    };

    startMoveCube();
    // startRotate();
    addControls();
  };

  /** @name 添加控制器 */
  const addControls = () => {
    const { camera, render } = ref.current;
    ref.current.controls = new OrbitControls(camera, render.domElement);
  };
  /** @name 启动物体移动 */
  const startMoveCube = () => {
    requestAnimationFrame(startMoveCube);

    const { cube } = ref.current;
    cube.position.x += 0.01;
    if (cube.position.x > 5) {
      cube.position.x = -5;
    }

    rerender();
  };
  /** @name 启动物体旋转 */
  const startRotate = () => {
    const { cube } = ref.current;
    requestAnimationFrame(startRotate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    rerender();
  };

  /** @name 清除实例 */
  const clear = () => {
    ref.current.render.forceContextLoss();
    ref.current.render.dispose();
    ref.current.scene.clear();
    dom.current.removeChild(ref.current.render.domElement);
    ref.current.render = null;
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

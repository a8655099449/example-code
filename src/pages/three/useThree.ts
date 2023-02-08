import dat from 'dat.gui';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { Material } from 'three';

import diamondImg from '../../assets/images/diamond_ore.png';
import alpha from '../../assets/images/textures/door/alpha.jpg';
import ambientOcclusion from '../../assets/images/textures/door/ambientOcclusion.jpg';
import doorImg from '../../assets/images/textures/door/color.jpg';
import doorHeightImg from '../../assets/images/textures/door/height.jpg';
import metalnessImg from '../../assets/images/textures/door/metalness.jpg';
import normalImg from '../../assets/images/textures/door/normal.jpg';
import roughnessImg from '../../assets/images/textures/door/roughness.jpg';
import { MyOrbitControls } from '../../types';
import { OrbitControls, Three } from '../../utils';
import useBoxSize from '../../utils/hooks/useBoxSize';

type TRef = Partial<{
  render: Three.WebGLRenderer;
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  cube: Three.Mesh;
  plane: Three.Mesh; //平面
  controls: MyOrbitControls;
  gui: dat.GUI;
  color: string;
  texture: Three.Texture;
  alphaTexture: Three.Texture;
  material: Three.MeshStandardMaterial;
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
  /** @name 重新渲染 */
  const rerender = () => {
    const { scene, camera } = ref.current;
    ref.current.render.render(scene, camera);
  };
  /**
   * @name 添加灯光
   *
   */
  const addLight = () => {
    // todo 添加环境光 https://threejs.org/docs/index.html?q=light#api/en/lights/AmbientLight
    const light = new Three.AmbientLight('#fff', 0.6);
    ref.current.scene.add(light);
    // todo 添加平行光 https://threejs.org/docs/index.html?q=light#api/en/lights/DirectionalLight
    const directionalLight = new Three.DirectionalLight('#fff', 1);

    directionalLight.position.set(1, 1, 1);

    ref.current.scene.add(directionalLight);
  };

  /** @name 导入纹理 */
  const loadTexture = () => {
    const textureLoader = new Three.TextureLoader();

    const doorTexture = textureLoader.load(doorImg);
    const alphaTexture = textureLoader.load(alpha);
    const aoTexture = textureLoader.load(ambientOcclusion);
    const doorHeightTexture = textureLoader.load(doorHeightImg);
    const roughnessTexture = textureLoader.load(roughnessImg);
    const metalnessTexture = textureLoader.load(metalnessImg);
    const normalTexture = textureLoader.load(normalImg);

    // 设置纹理的偏移量
    // doorTexture.offset.x = 0.5;
    // 设置纹理的旋转

    // doorTexture.rotation = Math.PI / 4;
    // 设置中心点
    doorTexture.center.set(0.5, 0.5);
    // 设置重复
    // doorTexture.wrapS = Three.MirroredRepeatWrapping; // 重复的模式
    // doorTexture.wrapT = Three.RepeatWrapping; // 重复的模式
    // doorTexture.repeat.set(2, 2);
    // 根据双插槽算法可以使很小的图片显示的更加清晰
    doorTexture.magFilter = Three.NearestFilter;
    doorTexture.minFilter = Three.NearestFilter;

    ref.current.texture = doorTexture;
    ref.current.alphaTexture = alphaTexture;
    return {
      doorTexture,
      aoTexture,
      doorHeightTexture,
      roughnessTexture,
      metalnessTexture,
      normalTexture,
    };
  };

  /** @name 添加几何体 */
  const addCube = () => {
    const cubeGeometry = new Three.BoxGeometry(1, 1, 1, 100, 100, 100);

    const {
      doorTexture,
      aoTexture,
      doorHeightTexture,
      roughnessTexture,
      metalnessTexture,
      normalTexture,
    } = loadTexture();
    const { alphaTexture } = ref.current;
    const cubeMaterial = new Three.MeshStandardMaterial({
      // color: ref.current.color || '#f00',
      transparent: true,
      map: doorTexture,
      alphaMap: alphaTexture, // 环境遮挡
      side: Three.DoubleSide, // 是否两面渲染贴图
      aoMap: aoTexture,
      displacementMap: doorHeightTexture, // 添加高度差
      displacementScale: 0.05, // 影响程度
      roughness: 1, // 粗糙度
      roughnessMap: roughnessTexture, // 粗糙度贴图
      metalness: 0.5, // 金属材质
      metalnessMap: metalnessTexture,
      normalMap: normalTexture,
    });
    // 添加环境遮挡
    cubeGeometry.setAttribute(
      'uv2',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Three.BufferAttribute(cubeGeometry.attributes.uv.array, 2),
    );
    ref.current.material = cubeMaterial;

    const cube = new Three.Mesh(cubeGeometry, cubeMaterial);
    // cube.position.set(10, 10, 10);
    ref.current.cube = cube;
    ref.current.scene.add(cube);
    const lightCubeGeometry = new Three.BoxGeometry(1, 1, 1);
    const lightCube = new Three.Mesh(
      lightCubeGeometry,
      new Three.MeshBasicMaterial({ color: '#f00' }),
    );
    lightCube.position.set(10, 10, 10);
    ref.current.scene.add(lightCube);
  };
  /** @name 添加平面 */
  const addPlane = () => {
    const planeGeometry = new Three.PlaneGeometry(1, 1, 200, 200);
    const plane = new Three.Mesh(planeGeometry, ref.current.material);
    // 添加环境遮挡
    planeGeometry.setAttribute(
      'uv2',
      new Three.BufferAttribute((planeGeometry.attributes.uv as any).array, 2),
    );

    plane.position.set(1.2, 0, 0);
    ref.current.scene.add(plane);
    ref.current.plane = plane;
  };

  /** @name 初始化场景 */
  const initScene = () => {
    const scene = new Three.Scene();
    // 添加坐标轴辅助
    const axes = new Three.AxesHelper(5);
    scene.add(axes);
    ref.current.scene = scene;
  };
  /** @name 初始化相机 */
  const initCamera = () => {
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;
    const camera = new Three.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);

    camera.position.set(0, 0, 10);
    ref.current.camera = camera;
    ref.current.scene.add(camera);
  };
  /** @name 使用坐标轴画几何图形 */
  const addGeometry = () => {
    const geometry = new Three.BufferGeometry();

    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
      -1.0, 1.0,
    ]);

    geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3));
    const cubeMaterial = new Three.MeshBasicMaterial({
      color: ref.current.color || '#f00',
    });
    const mesh = new Three.Mesh(geometry, cubeMaterial);
    ref.current.cube = mesh;
  };
  /** @name 添加随机三角形 */
  const addRandomTriangle = () => {
    for (let i = 0; i < 50; i++) {
      const geometry = new Three.BufferGeometry();
      const vertices = new Float32Array(9);
      const cubeMaterial = new Three.MeshBasicMaterial({
        color: new Three.Color(Math.random(), Math.random(), Math.random()),
        transparent: true,
        opacity: 0.8,
      });
      for (let j = 0; j < 9; j++) {
        vertices[j] = Math.random() * 10 - 5;
      }

      geometry.setAttribute('position', new Three.BufferAttribute(vertices, 3));

      const mesh = new Three.Mesh(geometry, cubeMaterial);
      ref.current.scene.add(mesh);
    }
  };

  const startRender = () => {
    const { clientHeight, clientWidth } = dom.current as HTMLDivElement;
    initScene();
    initCamera();
    addCube();
    addLight();
    // addGeometry();
    addPlane();
    // addRandomTriangle();
    const { scene, camera } = ref.current;

    const render = new Three.WebGLRenderer();
    render.setSize(clientWidth, clientHeight);
    dom.current.appendChild(render.domElement);
    // 设置场景背景颜色
    render.setClearColor('#000', 1);

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
    const { cube, texture } = ref.current;
    const gui = new dat.GUI();

    const cubeGui = gui.addFolder('cube');

    cubeGui.add(cube.position, 'x').min(0).max(5).name('x位置').step(0.01);
    cubeGui.add(cube.rotation, 'x').min(0).max(5).name('角度');
    cubeGui.add(cube.material, 'wireframe').name('展示线框');
    cubeGui.add(cube.material, 'roughness').name('粗糙度').min(0).max(2);
    cubeGui.add(cube.material, 'metalness').name('金属度').min(0).max(2);
    cubeGui
      .addColor(ref.current, 'color')
      .name('展示线框')
      .onChange((e) => {
        (cube.material as any).color.set(e);
      });

    const textureGui = gui.addFolder('贴图');
    console.log('👴2023-02-06 15:15:57 useThree.ts line:193', texture);
    textureGui.add(texture.offset, 'x').name('贴图x偏移').max(1).min(-1);
    textureGui.add(texture.offset, 'y').name('贴图y偏移').max(1).min(-1);
    textureGui.add(texture, 'rotation').name('贴图旋转').max(Math.PI).min(0);
    // textureGui.add(texture, 'repeat').name('是否重复');
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

import { FC, ReactElement } from 'react';

import { three } from '../../utils';
import { useBaseTree } from './useBaseThree';

type shadowProps = any;
const shadow: FC<shadowProps> = (): ReactElement => {
  const { dom, ref } = useBaseTree({
    onCreated() {
      const { scene, renderer, directionalLight, gui, camera } = ref.current;
      camera.position.set(5, 5, 5);
      // 添加一个球
      const sphereGeometry = new three.SphereGeometry(1, 20, 20);
      const material = new three.MeshStandardMaterial({
        metalness: 0.5,
        roughness: 0,
      });
      const sphere = new three.Mesh(sphereGeometry, material);
      scene.add(sphere);
      // 添加一个地面
      const planeGeometry = new three.PlaneGeometry(10, 10);
      const plane = new three.Mesh(planeGeometry, material);
      plane.position.set(0, -3, 0);
      // 将其设置到球的下方用于展示阴影
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);

      // todo 开启阴影
      renderer.shadowMap.enabled = true; // 渲染器阴影效果打开
      directionalLight.castShadow = true; // 直射光打开阴影效果
      sphere.castShadow = true; // 球可以产生阴影
      plane.receiveShadow = true; // 地面可以接受阴影

      // todo 设置阴影的属性

      directionalLight.shadow.radius = 50;
      directionalLight.shadow.mapSize.x = 5096;
      directionalLight.shadow.mapSize.y = 5096;

      const shadowFolder = gui.addFolder('阴影');

      shadowFolder.add(directionalLight.shadow, 'radius').min(0).max(50).name('模糊度');
      shadowFolder
        .add(directionalLight.shadow.mapSize, 'x')
        .min(0)
        .max(5000)
        .name('shadow.x');
      shadowFolder
        .add(directionalLight.shadow.mapSize, 'y')
        .min(0)
        .max(5000)
        .name('shadow.y');
    },
    gui: true,
  });

  return (
    <div
      ref={dom}
      style={{
        height: 800,
      }}
    ></div>
  );
};

export default shadow;

import { FC, ReactElement } from 'react';
import { SphereGeometry } from 'three';

import { three } from '../../utils';
import { useBaseTree } from './useBaseThree';

type pointLightProps = any;
const pointLight: FC<pointLightProps> = (): ReactElement => {
  const { dom, ref } = useBaseTree({
    onCreated() {
      const { scene, renderer, gui } = ref.current;
      const material = new three.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0,
      });
      const sphere = new three.Mesh(new SphereGeometry(1, 20, 20), material);

      scene.add(sphere);
      const light = new three.PointLight('#f00', 1);
      scene.add(light);
      light.position.set(2, 2, 2);
      // 添加一个地面
      const planeGeometry = new three.PlaneGeometry(50, 50);
      const plane = new three.Mesh(planeGeometry, material);
      plane.position.set(0, -2, 0);
      // 将其设置到球的下方用于展示阴影
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);
      // todo 开启阴影
      renderer.shadowMap.enabled = true; // 渲染器阴影效果打开
      light.castShadow = true; // 直射光打开阴影效果
      sphere.castShadow = true; // 球可以产生阴影
      plane.receiveShadow = true; // 地面可以接受阴影

      light.distance = 5;
      gui.add(light, 'distance').min(0).max(100).name('远近');
      gui.add(light, 'power').min(0).max(100).name('强度');
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

export default pointLight;

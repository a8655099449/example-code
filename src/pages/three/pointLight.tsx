import { FC, ReactElement, useRef } from 'react';
import { Clock, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

import { three } from '../../utils';
import { useBaseTree } from './useBaseThree';

type pointLightProps = any;
const pointLight: FC<pointLightProps> = (): ReactElement => {
  const _ref = useRef<Partial<{ smallSphere: Mesh; clock: Clock }>>({});

  const { dom, ref } = useBaseTree({
    onCreated() {
      const { scene, renderer, gui } = ref.current;
      const material = new three.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0,
      });
      const sphere = new three.Mesh(new SphereGeometry(1, 20, 20), material);

      const smallSphere = new three.Mesh(
        new SphereGeometry(0.1, 20, 20),
        new MeshBasicMaterial({ color: '#f00' }),
      );

      smallSphere.position.set(2, 2, 2);

      scene.add(sphere);
      const light = new three.PointLight('#f00', 1);

      smallSphere.add(light);
      scene.add(smallSphere);

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
      renderer.physicallyCorrectLights = true;
      light.decay = 0.5;
      light.power = 50;

      _ref.current.smallSphere = smallSphere;
      _ref.current.clock = new Clock();

      // light.distance = 5;
      gui.add(light, 'distance').min(0).max(50).name('光照距离');
      gui.add(light, 'power').min(0).max(100).name('强度');
      gui.add(light, 'decay').min(0).max(5).name('衰减').step(0.01);
    },
    onUpdate() {
      const { smallSphere, clock } = _ref.current;

      if (!smallSphere || !clock) return;
      const time = clock.getElapsedTime();
      smallSphere.position.x = Math.sin(time) * 3;
      smallSphere.position.z = Math.cos(time) * 3;
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

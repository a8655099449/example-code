import { FC, ReactElement } from 'react';

import { three } from '../../utils';
import { useBaseTree } from './useBaseThree';

type shadowProps = any;
const shadow: FC<shadowProps> = (): ReactElement => {
  const { dom, ref } = useBaseTree({
    onCreated() {
      const { scene, renderer, gui, camera } = ref.current;
      camera.position.set(5, 5, 5);
      const directionalLight = new three.SpotLight('#fff', 1);
      directionalLight.position.set(1, 1, 1);
      ref.current.scene.add(directionalLight);
      ref.current.directionalLight = directionalLight;
      // 添加一个球
      const sphereGeometry = new three.SphereGeometry(1, 20, 20);
      const material = new three.MeshStandardMaterial({
        metalness: 0.5,
        roughness: 0,
      });

      const sphere = new three.Mesh(sphereGeometry, material);
      const lightSphere = new three.Mesh(new three.SphereGeometry(0.1, 20, 20), material);
      lightSphere.position.set(1, 1, 1);
      scene.add(sphere);
      scene.add(lightSphere);
      // 添加一个地面
      const planeGeometry = new three.PlaneGeometry(50, 50);
      const plane = new three.Mesh(planeGeometry, material);
      plane.position.set(0, -2, 0);
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

      const cameraFolder = gui.addFolder('阴影相机');
      cameraFolder
        .add(directionalLight.shadow.camera, 'far')
        .min(0)
        .max(1000)
        .name('far');
      cameraFolder
        .add(directionalLight.shadow.camera, 'near')
        .min(0)
        .max(10)
        .name('near');
      cameraFolder.add(sphere.position, 'y').min(-1).max(10).name('球的位置').step(0.01);
      cameraFolder
        .add(directionalLight.position, 'y')
        .min(-1)
        .max(10)
        .name('光线Y的位置')
        .step(0.01)
        .onChange((v) => {
          console.log(v);
          lightSphere.position.y = v;
        });
      cameraFolder
        .add(directionalLight.position, 'x')
        .min(-1)
        .max(10)
        .name('光线X的位置')
        .step(0.01)
        .onChange((v) => {
          console.log(v);
          lightSphere.position.x = v;
        });
      cameraFolder
        .add(directionalLight.position, 'z')
        .min(-1)
        .max(10)
        .name('光线z的位置')
        .step(0.01)
        .onChange((v) => {
          console.log(v);
          lightSphere.position.z = v;
        });
      cameraFolder
        .add(directionalLight, 'angle')
        .min(0)
        .max(Math.PI / 2)
        .name('聚光灯角度')
        .step(0.01)
        .onChange((v) => {
          console.log(v);
          lightSphere.position.z = v;
        });
      cameraFolder
        .add(directionalLight, 'power')
        .min(0)
        .max(100)
        .name('光照强度')
        .step(0.01);
      cameraFolder
        .add(directionalLight, 'penumbra')
        .min(0)
        .max(1)
        .name('聚光锥的半影衰减百分比')
        .step(0.01);
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

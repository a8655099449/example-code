import { FC, ReactElement } from 'react';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { THREE } from '../../utils/index';
import { envImgs, hdr2 } from './imgs';
import { useBaseTree } from './useBaseThree';
type envProps = any;

const env: FC<envProps> = (): ReactElement => {
  const { dom, rerender, ref } = useBaseTree({
    renderColor: '#000',
    onCreated() {
      const { scene } = ref.current;
      const rgbLoader = new RGBELoader();

      rgbLoader.loadAsync(hdr2).then((e) => {
        e.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = e;
        scene.environment = e;
        console.log('👴2023-02-09 16:15:36 env.tsx line:18', e);
      });

      const cubeTextureLoader = new THREE.CubeTextureLoader();
      const envTexture = cubeTextureLoader.load(envImgs);

      const sphereGeometry = new THREE.SphereGeometry(1, 200, 200);
      const material = new THREE.MeshStandardMaterial({
        color: '#fff',
        metalness: 0.7,
        roughness: 0,
        // envMap: envTexture,
      });
      const sphere = new THREE.Mesh(sphereGeometry, material);
      const light = new THREE.AmbientLight('#fff', 0.6);
      const directionalLight = new THREE.DirectionalLight('#fff', 1);
      directionalLight.position.set(1, 1, 1);
      ref.current.scene.add(directionalLight);
      scene.add(light);
      scene.add(sphere);
      // scene.background = envTexture;
    },
  });

  return (
    <div
      ref={dom}
      style={{
        height: 800,
        // width: 500,
      }}
    ></div>
  );
};

export default env;

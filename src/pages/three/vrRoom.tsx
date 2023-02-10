import React from 'react';
import { FC, ReactElement } from 'react';
import {
  BackSide,
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TextureLoader,
} from 'three';

import { three } from '../../utils';
import { room1Images1, texture1 } from './imgs';
import { useBaseTree } from './useBaseThree';

type vrRoomProps = any;
const vrRoom: FC<vrRoomProps> = (): ReactElement => {
  const { ref, dom } = useBaseTree({
    onCreated() {
      useBox();
    },
  });
  // todo 使用盒子当作盒子的贴图 需要6张图
  const useBox = () => {
    const { scene, camera } = ref.current;
    camera.position.set(0, 0, 0.1);
    const loader = new TextureLoader();
    const boxMaterial = room1Images1.map((image) => {
      return new MeshBasicMaterial({
        map: loader.load(image),
        side: three.BackSide,
      });
    });
    const cube = new Mesh(new BoxGeometry(10, 10, 10), boxMaterial);
    scene.add(cube);
  };
  // todo 使用球当容器，只需要一张特殊的图片
  const useSphere = () => {
    const { scene, camera } = ref.current;
    camera.position.set(0, 0, 0.1);

    const loader = new TextureLoader();

    const sphere = new Mesh(
      new SphereGeometry(5, 20, 20),
      new MeshBasicMaterial({
        map: loader.load(texture1),
        side: BackSide,
      }),
    );
    scene.add(sphere);
  };

  return (
    <div
      ref={dom}
      style={{
        height: 800,
      }}
    ></div>
  );
};

export default vrRoom;

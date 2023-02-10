/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef } from 'react';
import {
  BackSide,
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Sphere,
  SphereGeometry,
  TextureLoader,
  Vector2,
  VideoTexture,
} from 'three';
import { Water } from 'three/examples/jsm/objects/Water2';

import { three } from '../../utils';
import { skyImg, skyVideo } from './imgs';
import { useBaseTree } from './useBaseThree';

export default function land() {
  const videoDom = useRef<HTMLVideoElement>();
  const { dom, ref } = useBaseTree({
    onCreated() {
      useImg();
      initWaterPlane();
    },
  });
  const useImg = () => {
    const { scene } = ref.current;

    const sky = new Mesh(
      new SphereGeometry(100, 20, 20),
      new MeshBasicMaterial({
        map: new TextureLoader().load(skyImg),
        side: BackSide,
      }),
    );
    scene.add(sky);
  };

  function useVideo() {
    const { scene } = ref.current;
    const texture = new VideoTexture(videoDom.current);
    // texture.mapping = three.EquirectangularReflectionMapping;
    texture.center = new Vector2(0.5, 0.5);
    texture.rotation = Math.PI;
    const sky = new Mesh(
      new SphereGeometry(100, 20, 20),
      new MeshBasicMaterial({
        map: texture,
        side: BackSide,
      }),
    );
    sky.material.map.needsUpdate = true;

    scene.add(sky);
  }
  // 初始化水面
  function initWaterPlane() {
    const { renderer } = ref.current;

    const water = new Water(new PlaneGeometry(20, 20), {
      textureHeight: 1024,
      textureWidth: 1024,
      color: '#359fb3',
      flowDirection: new Vector2(1, 1),
      scale: 5,
    });

    water.rotation.x = -Math.PI / 2;
    ref.current.scene.add(water);
    ref.current.camera.position.set(5, 5, 5);
  }

  return (
    <div>
      <video
        src={skyVideo}
        ref={videoDom}
        autoPlay
        loop
        style={{
          display: 'none',
        }}
      ></video>
      <div ref={dom} style={{ height: 800 }}></div>
    </div>
  );
}

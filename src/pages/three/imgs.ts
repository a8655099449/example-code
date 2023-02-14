import carEnv from '../../assets/images/car/blouberg_sunrise_2_1k.hdr';
export * as ferrari_aoTexture from '../../assets/images/car/ferrari_ao.png';
import room1 from '../../assets/images/rooms/home1_back.jpg';
import room2 from '../../assets/images/rooms/home1_bottom.jpg';
import room3 from '../../assets/images/rooms/home1_front.jpg';
import room4 from '../../assets/images/rooms/home1_left.jpg';
import room5 from '../../assets/images/rooms/home1_right.jpg';
import room6 from '../../assets/images/rooms/home1_top.jpg';
import env2 from '../../assets/images/textures/environmentMaps/2/nx.jpg';
import env4 from '../../assets/images/textures/environmentMaps/2/ny.jpg';
import env6 from '../../assets/images/textures/environmentMaps/2/nz.jpg';
import env1 from '../../assets/images/textures/environmentMaps/2/px.jpg';
import env3 from '../../assets/images/textures/environmentMaps/2/py.jpg';
import env5 from '../../assets/images/textures/environmentMaps/2/pz.jpg';
import hdr2 from '../../assets/images/textures/hdr/002.hdr';
import texture1 from '../../assets/images/textures/hdr/012.jpg';
import skyImg from '../../assets/images/textures/sky.jpg';
import skyVideo from '../../assets/images/textures/sky.mp4';
import ferrari from '../../assets/model/bottle/ferrari.glb';
import bottle from '../../assets/model/bottle/ship_in_a_bottle.glb';

export const envImgs = [env1, env2, env3, env4, env5, env6];
// 顺序分为 左、右、前、后 、 上、下、
export const room1Images1 = [room4, room5, room6, room2, room3, room1];
export { bottle, carEnv, ferrari, hdr2, skyImg, skyVideo, texture1 };

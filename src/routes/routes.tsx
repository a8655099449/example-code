import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import lazyLoad from '../components/Lazyload/lazyload';
import ErrorPage from '../ErrorPage';
import Root from './Root';

type MyRoute = RouteObject & {
  Element?: any;
  name?: string;
};

export const routers: MyRoute[] = [
  {
    Element: lazyLoad(() => import('../pages/three/start')),
    path: '/three/start',
    name: '正方体贴图',
  },
  {
    Element: lazyLoad(() => import('../pages/three/env')),
    path: '/three/env',
    name: '环境贴图',
  },
  {
    Element: lazyLoad(() => import('../pages/three/shadow')),
    path: '/three/shadow',
    name: '阴影和聚光灯',
  },
  {
    Element: lazyLoad(() => import('../pages/three/pointLight')),
    path: '/three/pointLight',
    name: '点光源',
  },
  {
    Element: lazyLoad(() => import('../pages/three/vrRoom')),
    path: '/three/vrRoom',
    name: 'vr看房',
  },
  {
    Element: lazyLoad(() => import('../pages/three/land')),
    path: '/three/land',
    name: '小岛',
  },
  {
    Element: lazyLoad(() => import('../pages/three/Porsche')),
    path: '/three/Porsche',
    name: '保时捷',
  },
];

export default createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      ...routers.map(({ Element, ...item }) => ({ ...item, element: <Element /> })),
      {
        path: '/',
        element: <Navigate to={'/three/shadow'} />,
      },
    ],
  },
]);

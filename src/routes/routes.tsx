import { ReactElement } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

import lazyLoad from '../components/Lazyload/lazyload';
import ErrorPage from '../ErrorPage';
import Root from './Root';

type MyRoute = RouteObject & {
  Element?: any;
};

const router: MyRoute[] = [
  {
    Element: lazyLoad(() => import('../pages/three/start')),
    path: '/three/start',
  },
];

export default createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: router.map(({ Element, ...item }) => ({ ...item, element: <Element /> })),
  },
]);

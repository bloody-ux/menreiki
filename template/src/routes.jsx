import { redirect, async } from 'menreiki';
import DefaultLayout from './layout/Default';
import Home from './pages/Home';
import NotFound from './pages/404';

export default [
  {
    path: '/',
    component: DefaultLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
        title: 'Home Page',
      },
      {
        path: '/oldpage',
        component: redirect({ to: '/' }),
        title: 'Redirecting',
      },
      {
        path: '/about',
        component: async(import('./pages/About')),
        title: 'About',
      },
      {
        component: NotFound,
        title: 'Not Found',
      },
    ],
  },
];

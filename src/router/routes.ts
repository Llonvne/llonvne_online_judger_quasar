import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/HomePage.vue'),
      },
      {
        path: 'problem',
        name: 'problem',
        component: () => import('pages/ProblemPage.vue'),
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('pages/ProblemDetail.vue'),
      },
      {
        path: 'status',
        component: () => import('pages/StatusPage.vue'),
      },
      {
        path: 'sub',
        component: () => import('pages/SubDetail.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('pages/SigninPage.vue'),
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('pages/SignupPage.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('pages/UserProfie.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

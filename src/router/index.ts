import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { UserStore } from 'stores/example-store';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(async function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from) => {
    if (
      to.name !== 'home' &&
      to.name !== 'problem' &&
      to.name !== 'detail' &&
      to.name !== 'signup'
    ) {
      if (
        // 检查用户是否已登录
        UserStore().loginUser == null &&
        // ❗️ 避免无限重定向
        to.name !== 'Login'
      ) {
        // 将用户重定向到登录页面
        return { name: 'Login' };
      }
    }
  });
  return Router;
});

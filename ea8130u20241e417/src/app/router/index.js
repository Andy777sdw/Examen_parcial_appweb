/**
 * Application Router. Configures client-side routing, semantic routes, redirection, and catch-all 404 handler.
 *
 * @summary Vue Router configuration.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/inspections/presentation/views/home.view.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/telemetry/items/new',
    name: 'new-telemetry',
    component: () => import('@/inspections/presentation/views/new-telemetry.view.vue'),
    meta: { title: 'New Telemetry' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/shared/presentation/views/page-not-found.view.vue'),
    meta: { title: 'Page Not Found' }
  }
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const defaultTitle = 'GeoMine Solutions — Machinery & Telemetry Management';
  document.title = to.meta.title ? `${to.meta.title} — GeoMine Solutions` : defaultTitle;
  next();
});

export default router;

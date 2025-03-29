import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Posts from '@/views/Posts.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'posts',
    component: Posts,
  },
  {
    path: '/posts/:postId',
    name: 'post',
    component: () => import('@/views/Post.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;

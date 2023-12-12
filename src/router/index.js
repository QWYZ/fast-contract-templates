import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import pdfView from "../views/view-pdf/index.vue";
import fastTemplate from "../views/fast-template/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/view-pdf',
      name: 'view-pdf',
      component: pdfView
    },
    {
      path: '/fast-template',
      name: 'fast-template',
      component: fastTemplate
    },
  ]
})

export default router

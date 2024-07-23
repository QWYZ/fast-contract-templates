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
    {
      path: '/ocr',
      name: 'func-ocr',
      component: import("@/views/ocr/index.vue")
    }
  ]
})

export default router

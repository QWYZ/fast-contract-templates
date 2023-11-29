import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '../views/editor/index.vue'
import HomeView from '../views/HomeView.vue'
import ContractView1 from "../views/contract/first.vue";
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
      path: '/editor',
      name: 'editor',
      component: EditorView
    },
    {
      path: '/first',
      redirect:'/contract/first',
    },
    {
      path: '/contract/first',
      name: 'contract',
      component: ContractView1
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

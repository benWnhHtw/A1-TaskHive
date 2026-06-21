import { createRouter, createWebHistory } from 'vue-router'

import TaskDashboardView from '@/features/tasks/views/TaskDashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/tasks/new',
  },
  {
    path: '/tasks',
    redirect: '/tasks/new',
  },
  {
    path: '/tasks/new',
    name: 'task-new',
    component: TaskDashboardView,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
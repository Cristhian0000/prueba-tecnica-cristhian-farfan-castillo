import { createRouter, createWebHistory } from 'vue-router'
import GameRouletteView from '@/views/GameRouletteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'GameRoulette',
      component: GameRouletteView,
    },
  ],
})

export default router

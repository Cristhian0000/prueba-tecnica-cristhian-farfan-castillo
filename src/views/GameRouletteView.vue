<template>
    <v-app>
        <v-main>
            <v-container class="pa-4 justify-center align-center juego-container">
                <v-card elevation="0" class="pa-6">
                    <div class="position-relative">
                        <v-card-title class="text-center pa-4 text-h3">El juego de la ruleta</v-card-title>
                        <form-player v-if="showForm" @comenzarJuego="comenzarJuego"></form-player>
                        <roulette v-else></roulette>
                        <v-progress-circular v-if="store.isLoading" class="overlay-loader" color="primary"
                            indeterminate></v-progress-circular>
                        <result></result>
                    </div>
                </v-card>
                <v-overlay :model-value="store.isLoading" persistent></v-overlay>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
import FormPlayer from '@/components/FormPlayer.vue'
import Roulette from '@/components/Roulette.vue'
import Result from '@/components/Result.vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
const showForm = ref(true)
function comenzarJuego() {
    showForm.value = false
}

</script>

<style scoped>
.juego-container {
    height: 100vh;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

.acciones button {
    margin: 10px;
    padding: 10px 20px;
}

.overlay-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.position-relative {
    position: relative;
}
</style>

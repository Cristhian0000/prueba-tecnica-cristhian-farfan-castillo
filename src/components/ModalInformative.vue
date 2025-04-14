<template>
    <v-dialog v-model="store.modalConfig.show" max-width="500px">
        <v-card>
            <v-card-title class="d-flex justify-space-between justify-center" >
                {{ store.modalConfig.title }}
                <v-btn icon="mdi-close" variant="text" @click="store.hideModal"></v-btn>
            </v-card-title>

            <v-card-text>
                {{ store.modalConfig.content }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    variant="elevated"
                    @click="store.hideModal"
                >
                    {{ store.modalConfig.buttonText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useGameStore } from '@/stores/game'

const store = useGameStore()
</script>

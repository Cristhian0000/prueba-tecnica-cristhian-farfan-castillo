<template>
    <v-dialog v-model="store.showResult" max-width="300" persistent>
        <v-card class="roulette-card" :style="{ 'background-color': store.resultadoRuletaColor }" elevation="8">
            <v-card-title class="label-container">
                <span class="label">{{ colorEnEspanol }}</span>
                <span class="label">{{ store.resultadoRuletaParImpar.toUpperCase() }}</span>
            </v-card-title>
            <v-card-text class="number-display pa-2">
                {{ store.resultadoRuletaNumero }}
            </v-card-text>
            <span class="text-h6 text-center result-text">{{ store.resultadoDelJuego.toUpperCase() }}</span>
            <v-card-actions class="justify-center d-flex flex-column">
                <v-btn class="ma-2" color="primary" variant="elevated" @click="handleClose">
                    Aceptar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { useGameStore } from '@/stores/game';
import { computed } from 'vue';

const store = useGameStore();
const colorEnEspanol = computed(() => {
    const colores = {
        'red': 'ROJO',
        'black': 'NEGRO',
        'green': 'VERDE'
    };
    return colores[store.resultadoRuletaColor] || store.resultadoRuletaColor;
});

const handleClose = () => {
    store.setShowResult(false);
    // Mostrar modal informativo solo si ganó
    if (store.resultadoDelJuego === 'ganaste' && store.jugadorNuevo) {
        store.showModal({
            title: 'Recordatorio',
            content: 'Recuerda guardar tu partida si deseas conservar tus ganancias. De lo contrario, se perderán al cerrar la ventana.',
            buttonText: 'Entendido'
        });
    }
}
</script>

<style scoped>
.roulette-card {
    border-radius: 50%;
    aspect-ratio: 1;
    padding: 20px;
    border: 4px solid gold;
    min-height: 300px;
    min-width: 300px;

}

.label-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    color: white;
    opacity: 1;
}

.label {
    color: white !important;
}

.number-display {
    font-size: 6rem !important;
    font-weight: bold;
    color: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
}

.result-text {
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>

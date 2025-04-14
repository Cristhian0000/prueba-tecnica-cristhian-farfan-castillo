<template>
    <v-row class="mb-4">
        <v-col cols="12" md="6" offset-md="3">
            <v-text-field v-model="nombre" label="Ingresa tu nombre" variant="underlined"></v-text-field>
        </v-col>
        <v-col cols="12" md="6" offset-md="3" v-if="showSaldo">
            <v-text-field type="number" v-model.number="saldo" label="Saldo" variant="underlined"></v-text-field>
        </v-col>
        <v-col cols="12" md="6" offset-md="3" v-if="tieneSaldo">
            <v-text-field type="number" v-model.number="apuestaInicial" label="Apuesta Inicial"
                variant="underlined"></v-text-field>
        </v-col>
    </v-row>
    <v-row class="mb-4 justify-center align-center">
        <v-col v-if="showBuscarJugador" class="d-flex justify-center align-center">
            <v-btn color="primary" @click="buscarJugador" :disabled="!nombre">
                <v-icon left>mdi-account-search</v-icon>
                Buscar Jugador
            </v-btn>
        </v-col>
        <v-col v-else cols="auto" class="d-flex justify-center align-center">
            <v-btn :color="tieneSaldo ? 'success' : 'warning'" @click="handleButtonClick"
                :disabled="tieneSaldo ? isDisabled : isDisabledCargarSaldo">
                <v-icon left>{{ tieneSaldo ? 'mdi-play' : 'mdi-cash-plus' }}</v-icon>
                {{ tieneSaldo ? 'Comenzar Juego' : 'Cargar Saldo' }}
            </v-btn>
        </v-col>
    </v-row>
    <modal-inforamtive />
</template>

<script setup>
import ModalInforamtive from '@/components/ModalInformative.vue'
import { useGameStore } from '@/stores/game'
import { ref, defineEmits, computed } from "vue"


const store = useGameStore();
const nombre = ref('')
const saldo = ref(0)
const showSaldo = ref(false)
const showApuesta = ref(false)
const showBuscarJugador = ref(true)
const tieneSaldo = ref(false)
const tieneApuesta = ref(false)
const apuestaInicial = ref(0)
// const store.jugadorNuevo = ref(false)
const emit = defineEmits(['comenzarJuego']);

const isDisabled = computed(() => {
    return saldo.value <= 0 || apuestaInicial.value <= 0 || apuestaInicial.value > saldo.value
})
const isDisabledCargarSaldo = computed(() => {

    return saldo.value <= 0
})

const buscarJugador = async () => {
    if (nombre.value.trim() === '') {
        mostrarModal('Campo vacío', 'Por favor ingresa tu nombre.', 'Continuar');
        return;
    }

    try {
        const data = await obtenerMontoUsuario(nombre.value);

        if (data.success) {
            manejarJugadorExistente(data);
        } else {
            manejarNuevoJugador(data);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
const obtenerMontoUsuario = async (nombre) => {
    console.log(nombre)
    const response = await fetch(`https://localhost:44382/Usuario/GetMontoUsuario?nombre=${nombre}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('Error al cargar el usuario.');
    }

    return await response.json();
}

const mostrarModal = (titulo, contenido, boton) => {
    store.showModal({
        title: titulo,
        content: contenido,
        buttonText: boton
    });
}

const manejarJugadorExistente = (data) => {
    const { monto, message } = data;

    showSaldo.value = true;
    showApuesta.value = true;
    tieneSaldo.value = monto > 0;
    saldo.value = monto;
    tieneApuesta.value = false;

    mostrarModal('Bienvenido de nuevo', message, 'Continuar');
    showBuscarJugador.value = false;
    store.setJugadorNuevo(false);
}

const manejarNuevoJugador = (data) => {
    const { message } = data;

    showSaldo.value = true;
    showApuesta.value = true;
    tieneSaldo.value = false;
    saldo.value = 0;
    tieneApuesta.value = false;

    mostrarModal('Bienvenido', message, 'Continuar');
    showBuscarJugador.value = false;
    store.setJugadorNuevo(true);
}

const comenzarJuego = async () => {
    store.setName(nombre.value)
    store.setSaldo(saldo.value - apuestaInicial.value)
    store.setApuesta(apuestaInicial.value)
    emit('comenzarJuego', true)
}
// const cargarSaldo = async () => {
//     try {
//         console.log(store.jugadorNuevo)
//         if (store.jugadorNuevo) {
//             tieneSaldo.value = true;
//             store.setSaldo(saldo.value)
//             store.setApuesta(apuestaInicial.value)

//             return
//         }
//         const response = await fetch('https://localhost:44382/Usuario/CargarSaldo', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 nombre: nombre.value,
//                 monto: saldo.value
//             })
//         });

//         if (!response.ok) {
//             throw new Error('Error al cargar el saldo');
//         }

//         const data = await response.json();
//         const { success, monto, message } = data;
//         if (success) {
//             tieneSaldo.value = true;
//             saldo.value = monto;
//             mostrarModal('Éxito', message, 'Continuar');
//         } else {
//             mostrarModal('Error', message, 'Entendido');
//         }

//     } catch (error) {
//         console.error(error);
//         mostrarModal('Error', 'Error al cargar el saldo', 'Entendido');
//     }
// }
const handleCargarSaldo = async () => {
    if (store.jugadorNuevo) {
        const result = await store.cargarSaldo(saldo.value, nombre.value, true);
        if (result.success) {
            tieneSaldo.value = true;
            showApuesta.value = true;
        }
    } else {
        const result = await store.cargarSaldo(saldo.value, nombre.value, false);
        if (result.success) {
            tieneSaldo.value = true;
            mostrarModal('Éxito', result.message, 'Continuar');
        } else {
            mostrarModal('Error', result.message, 'Entendido');
        }
    }
}
const handleButtonClick = () => {

    if (tieneSaldo.value) {
        comenzarJuego();
    } else {
        handleCargarSaldo();
    }
}
</script>

<style scoped>
/* Your styles here */
</style>
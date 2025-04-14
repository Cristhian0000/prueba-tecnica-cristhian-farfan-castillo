<template>
    <v-container class="pa-4">
        <v-row class="justify-center">
            <v-col cols="12" sm="10" md="8">
                <v-row justify="space-between" class="mb-4">
                    <v-label class="text-left">Nombre: {{ store.nombre }} | Saldo:{{ store.saldo }}</v-label>
                    <v-label class="text-right">apuesta: {{ store.apuesta }}</v-label>
                </v-row>
                <v-row class="justify-center" dense v-for="(row, rowIndex) in rouletteNumbers" :key="rowIndex">
                    <v-chip :disabled="noSelectionLocked && !selectedItems.includes(number.value)"
                        v-for="(number, index) in row" :key="index" :color="number.color" class="ma-1 square-chip"
                        :class="{ selected: selectedItems.includes(number.value) }" @click="toggleItem(number.value)">
                        <span>{{ number.value }}</span>
                    </v-chip>
                </v-row>
                <v-divider class="my-4"></v-divider>
                <v-row class="justify-center">
                    <v-chip :disabled="tipoApuestaActual === tipoApuesta.NUMERO_ESPECIFICO" class="ma-2 square-chip"
                        :class="{ selected: selectedColor === 'red' }" color="red"
                        @click="filterByColor('red')">Rojo</v-chip>
                    <v-chip :disabled="tipoApuestaActual === tipoApuesta.NUMERO_ESPECIFICO" class="ma-2 square-chip"
                        :class="{ selected: selectedColor === 'black' }" color="black" text-color="white"
                        @click="filterByColor('black')">Negro</v-chip>
                    <v-chip :disabled="tipoApuestaActual === tipoApuesta.NUMERO_ESPECIFICO" class="ma-2 square-chip"
                        color="warning lighten-2" @click="filterByParImpar('par')"
                        :class="{ selected: selectedParImpar == 'par' }">Par</v-chip>
                    <v-chip :disabled="tipoApuestaActual === tipoApuesta.NUMERO_ESPECIFICO" class="ma-2 square-chip"
                        color="green lighten-2" @click="filterByParImpar('impar')"
                        :class="{ selected: selectedParImpar == 'impar' }">Impar</v-chip>
                </v-row>
                <v-divider class="my-4"></v-divider>

                <v-row v-if="tieneApuesta" class="align-center justify-center">
                    <v-col cols="4">
                        <v-btn color="secondary" class="ma-2" @click="girarRuleta">Girar Ruleta</v-btn>
                    </v-col>
                </v-row>
                <v-row v-else class="align-center" justify="space-beetween justify-center">
                    <v-col cols="4">
                        <v-text-field v-if="store.saldo > 0" v-model.number="montoApostar"
                            label="ingrese apuesta para poder girar la ruleta" type="number"
                            variant="underlined"></v-text-field>
                        <v-text-field v-else v-model.number="montoRecargar"
                            label="recargar saldo para poder girar la ruleta" type="number"
                            variant="underlined"></v-text-field>
                    </v-col>
                    <v-col cols="4" class="align-center">
                        <v-btn v-if="store.saldo > 0" color="primary" class="ma-2" @click="apostar"
                            :disabled="tieneApuesta">Apostar</v-btn>
                        <v-btn v-else color="warning" class="ma-2" @click="recargarSaldo"
                            :disabled="tieneApuesta">Recargar Saldo</v-btn>
                    </v-col>
                    <v-col cols="4">
                        <v-btn color="success" class="ma-2" @click="guardarPartida"
                            v-if="store.resultadoDelJuego === 'ganaste' && store.jugadorNuevo"> Guardar Partida</v-btn>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>
    </v-container>
    <modal-informative />
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import ModalInformative from '@/components/ModalInformative.vue'
import rouletteNumbersData from '@/utils/rouletteData'
import { multiplicadores, tipoApuesta } from '@/utils/tipoApuesta'

const store = useGameStore()
const selectedItems = ref([])
const selectedColor = ref(null)
const selectedParImpar = ref(null)
const noSelectionLocked = ref(false)
const colorsLocked = ref(false)
const ParImparLocked = ref(false)
const montoApostar = ref(0)
const montoRecargar = ref(0)
const tipoApuestaActual = ref(null)

const rouletteNumbers = rouletteNumbersData
const tieneApuesta = computed(() => store.apuesta > 0)
const filteredItems = computed(() => {

    const noFiltersSelected = !selectedColor.value && !selectedParImpar.value
    if (noFiltersSelected) {
        return []
    }

    const allNumbers = rouletteNumbers.flat()

    const filtered = allNumbers.filter((number) => {
        const matchesColor = !selectedColor.value || number.color.trim() === selectedColor.value
        const matchesParity = !selectedParImpar.value || number.type === selectedParImpar.value
        return matchesColor && matchesParity
    })

    const values = filtered.map((n) => n.value)
    console.log('Items filtrados:', values)
    return values
})

watch(filteredItems, (newItems) => {
    selectedItems.value = newItems
})

const clearSelections = () => {
    // Restablecer selecciones
    selectedColor.value = null
    selectedParImpar.value = null
    selectedItems.value = []

    // Restablecer tipo de apuesta
    tipoApuestaActual.value = null

    // Desbloquear todas las opciones
    noSelectionLocked.value = false

    // Remover referencias no utilizadas
    // colorsLocked y ParImparLocked no son necesarios ya que
    // la lógica de bloqueo se maneja con noSelectionLocked
}

const filterByColor = (color) => {
    if (tipoApuestaActual.value === tipoApuesta.NUMERO_ESPECIFICO) return

    selectedColor.value = selectedColor.value === color ? null : color
    if (selectedColor.value != null) {
        selectedParImpar.value = null
        tipoApuestaActual.value = tipoApuesta.COLOR
        noSelectionLocked.value = true
    }
    else {
        selectedColor.value = null
        selectedItems.value = []
        tipoApuestaActual.value = null
        noSelectionLocked.value = false
    }
}

const filterByParImpar = (parity) => {
    if (tipoApuestaActual.value === tipoApuesta.NUMERO_ESPECIFICO) return
    if (!selectedColor.value) {
        store.showModal({
            title: 'Selección inválida',
            content: 'Primero debes seleccionar un color para filtrar por paridad',
            buttonText: 'Entendido'
        })
        return
    }

    selectedParImpar.value = selectedParImpar.value === parity ? null : parity
    tipoApuestaActual.value = tipoApuesta.COLOR_PARIDAD
    noSelectionLocked.value = true
}

const toggleItem = (item) => {
    if (tipoApuestaActual.value &&
        tipoApuestaActual.value !== tipoApuesta.NUMERO_ESPECIFICO) {
        return
    }

    selectedColor.value = null
    selectedParImpar.value = null
    const index = selectedItems.value.indexOf(item)

    if (index === -1) {
        selectedItems.value = [item]
        tipoApuestaActual.value = tipoApuesta.NUMERO_ESPECIFICO
        console.log(selectedItems.value)
    } else {
        selectedItems.value = []
        tipoApuestaActual.value = null
    }

    colorsLocked.value = true
    ParImparLocked.value = true
}
const girarRuleta = async () => {
    if (selectedItems.value.length === 0) {
        store.showModal({
            title: 'Sin selección',
            content: 'Por favor selecciona al menos un número o color para apostar.',
            buttonText: 'Entendido'
        })
        return
    }

    try {
        store.setLoading(true)

        const response = await fetch('https://localhost:44382/Juego/GetRandomNumberAndColor', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor')
        }

        const { numero, color } = await response.json()
        const esGanador = selectedItems.value.includes(numero)

        let premio = 0
        let montoActual = store.saldo
        // console.log('Monto actual:', montoActual)

        if (store.jugadorNuevo) {
            // console.log(montoActual)
            if (esGanador) {
                premio = calcularMontoPremioLocal(store.apuesta, tipoApuestaActual.value)
                montoActual = montoActual + store.apuesta + premio
                store.setSaldo(montoActual)
                store.setResultadoDelJuego('ganaste')
            } else {
                montoActual == 0 ? 0 : montoActual = montoActual - store.apuesta
                store.setSaldo(montoActual)
                store.setResultadoDelJuego('perdiste')
            }
        } else {

            const responseCalcularPremio = await fetch('https://localhost:44382/Apuesta/CalcularPremio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    NombreJugador: store.nombre,
                    MontoApostado: store.apuesta,
                    TipoDeApuesta: tipoApuestaActual.value,
                    ResultadoJugador: esGanador
                }),
            })

            if (!responseCalcularPremio.ok) {
                throw new Error('Error en la respuesta del servidor')
            }

            const data = await responseCalcularPremio.json()
            montoActual = data.montoActual
            store.setSaldo(montoActual)
            premio = data.premio

            store.setResultadoDelJuego(premio > 0 ? 'ganaste' : 'perdiste')
        }


        store.setApuesta(0)
        store.setResultadoRuletaNumero(numero)
        store.setResultadoRuletaColor(color)
        store.setResultadoRuletaParImpar(numero % 2 === 0 ? 'par' : 'impar')
        clearSelections()
        store.setShowResult(true)
        store.setLoading(false)

    } catch (error) {
        console.error(error)
        store.setLoading(false)
        store.showModal({
            title: 'Error',
            content: 'Ocurrió un error al girar la ruleta. Por favor intenta nuevamente.',
            buttonText: 'Entendido'
        })
    }
}

const apostar = () => {
    console.log('Apostar', montoApostar.value)
    if (montoApostar.value <= 0) {
        store.showModal({
            title: 'Apuesta inválida',
            content: 'Por favor, ingresa una cantidad válida para apostar.',
            buttonText: 'Entendido'
        })
        return
    }
    if (montoApostar.value > store.saldo) {
        store.showModal({
            title: 'Saldo insuficiente',
            content: 'No tienes suficiente saldo para realizar esta apuesta.',
            buttonText: 'Entendido'
        })
        return
    }

    store.setSaldo(store.saldo - montoApostar.value)
    store.setApuesta(montoApostar.value)

    store.showModal({
        title: 'Apuesta realizada',
        content: `Apuesta de ${montoApostar.value} realizada.`,
        buttonText: 'Entendido'
    })
}

const guardarPartida = async () => {
    try {
        const response = await fetch('https://localhost:44382/Usuario/CargarSaldo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: store.nombre,
                monto: store.saldo
            })
        });

        if (!response.ok) {
            throw new Error('Error al guardar la partida');
        }

        const data = await response.json();
        if (data.success) {
            store.showModal({
                title: 'Éxito',
                content: 'Partida guardada correctamente',
                buttonText: 'Continuar'
            });
        }
        clearSelections()
    } catch (error) {
        console.error(error);
        store.showModal({
            title: 'Error',
            content: 'Error al guardar la partida',
            buttonText: 'Entendido'
        });
    }
}
const calcularMontoPremioLocal = (montoApostado, tipoApuesta) => {
    return montoApostado * (multiplicadores[tipoApuesta] || 0)
}
const recargarSaldo = async () => {
    if (montoRecargar.value <= 0) {
        store.showModal({
            title: 'Monto inválido',
            content: 'Por favor ingresa un monto válido',
            buttonText: 'Entendido'
        });
        return;
    }

    const result = await store.cargarSaldo(montoRecargar.value, store.nombre, store.jugadorNuevo);
    if (result.success) {
        montoRecargar.value = 0;
        store.showModal({
            title: 'Éxito',
            content: 'Saldo recargado correctamente',
            buttonText: 'Continuar'
        });
    } else {
        store.showModal({
            title: 'Error',
            content: result.message,
            buttonText: 'Entendido'
        });
    }
}
onMounted(() => {
    window.addEventListener('beforeunload', (event) => {
        if (store.saldo > 0) {
            event.preventDefault();
            event.returnValue = '¿Estás seguro? Los cambios no guardados se perderán.';
        }
    });
    clearSelections()
})
</script>

<style scoped>
.square-chip {
    width: 45px;
    height: 45px;
    justify-content: center;
    font-weight: bold;
    padding: 0;
    border-radius: 6px;
}

.square-chip:hover {
    transform: scale(1.05);
    transition: transform 0.2s;
    cursor: pointer;
}

.selected {
    border: 3px solid yellow;
}
</style>

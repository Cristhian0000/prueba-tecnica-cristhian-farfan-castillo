import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  // Estado del jugador
  const nombre = ref('')
  const saldo = ref(0)  // Saldo del jugador
  const apuesta = ref(0) // Apuesta actual
  const isLoading = ref(false) // Estado de carga
  const showResult = ref(false) // Estado para mostrar el resultado
  const resultadoDelJuego = ref(null) // Resultado del juego
  const resultadoRuletaColor = ref(null) // Color de la ruleta
  const resultadoRuletaNumero = ref(null) // Número de la ruleta
  const resultadoRuletaParImpar = ref(null) // Par o impar de la ruleta
  const jugadorNuevo = ref(true) // Estado para saber si es un jugador nuevo
  const modalConfig = ref({
    show: false,
    title: 'Información',
    buttonText: 'Aceptar',
    content: ''
  })

  const premioTemporal = ref(0)



  // Computada para saber si el jugador tiene suficiente saldo para apostar
  const puedeApostar = computed(() => saldo.value >= apuesta.value)

  // Función para actualizar el nombre
  function setName(newName) {
    nombre.value = newName
  }

  // Función para establecer el saldo
  const setSaldo = (newSaldo) => {
    saldo.value = newSaldo
  }

  // Función para realizar una apuesta
  const setApuesta = (amount) => {
    apuesta.value = amount
  }
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setShowResult = (show) => {
    showResult.value = show
  }

  const setResultadoDelJuego = (resultado) => {
    resultadoDelJuego.value = resultado
  }
  const setResultadoRuletaColor = (color) => {
    resultadoRuletaColor.value = color
  }
  const setResultadoRuletaNumero = (numero) => {
    resultadoRuletaNumero.value = numero
  }
  const setResultadoRuletaParImpar = (parImpar) => {
    resultadoRuletaParImpar.value = parImpar
  }
  const setJugadorNuevo = (nuevo) => {
    jugadorNuevo.value = nuevo
  }
  const setPremioTemporal = (monto) => {
    premioTemporal.value = monto
  }

  // Función para procesar el resultado del juego
  const procesarJuego = (resultado) => {
    // Aquí puedes añadir la lógica para determinar si el jugador ganó o perdió
    // Imagina que el "resultado" es el número obtenido de la ruleta y que tú comparas
    // la apuesta del jugador con el resultado.

    if (resultado === 'ganar') {
      saldo.value += apuesta.value  // El jugador gana
      console.log('¡Ganaste! Nuevo saldo: ', saldo.value)
    } else {
      saldo.value -= apuesta.value  // El jugador pierde
      console.log('Perdiste. Nuevo saldo: ', saldo.value)
    }

    // Reseteamos la apuesta
    apuesta.value = 0
  }

  // Función para guardar el saldo en un servidor o base de datos (si es necesario)
  const cargarSaldo = async (montoARecargar, nombreJugador, isNuevo = false) => {
    try {
        if (isNuevo) {
            saldo.value = montoARecargar
            nombre.value = nombreJugador
            return { success: true, message: 'Saldo cargado correctamente' }
        }

        const response = await fetch('https://localhost:44382/Usuario/CargarSaldo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombreJugador,
                monto: montoARecargar
            })
        });

        if (!response.ok) {
            throw new Error('Error al cargar el saldo');
        }

        const data = await response.json();
        if (data.success) {
            saldo.value = data.monto;
            nombre.value = nombreJugador;
        }
        return data;
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error al cargar el saldo' };
    }
}
  const showModal = (config) => {
    modalConfig.value = {
      ...modalConfig.value,
      ...config,
      show: true
    }
  }

  const hideModal = () => {
    modalConfig.value.show = false
  }
  return {
    nombre,
    saldo,
    apuesta,
    isLoading,
    showResult,
    resultadoDelJuego,
    resultadoRuletaColor,
    resultadoRuletaNumero,
    resultadoRuletaParImpar,
    modalConfig,
    jugadorNuevo,
    premioTemporal,
    setName,
    setSaldo,
    setApuesta,
    setLoading,
    setShowResult,
    setResultadoDelJuego,
    setResultadoRuletaColor,
    setResultadoRuletaNumero,
    setResultadoRuletaParImpar,
    setJugadorNuevo,
    setPremioTemporal,
    procesarJuego,
    puedeApostar,
    cargarSaldo,
    showModal,
    hideModal
  }
})

# juego de la ruleta

 Desarrollado con Vue 3 y Vite que permite a los usuarios realizar apuestas y guardar sus ganancias.

## Requisitos del Sistema

- Node.js (versión 22.x)
- NPM (última versión estable)
- Windows 10/11

## Tecnologías Utilizadas

- Vue 3.x
- Vite 4.x
- Vuetify 3.x
- Pinia 2.x
- Vue Router 4.x

## Instalación

1. Clonar el repositorio:

```sh
git clone <url-del-repositorio>
cd prueba-tecnica-crishian-farfan
```

2. Verificar versión de Node:

```sh
node --version
# Debe mostrar v22.x.x
```

3. Instalar dependencias:

```sh
npm install
```

## Ejecución

### Desarrollo

```sh
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Producción

```sh
npm run build
npm run preview
```

### Linting

```sh
npm run lint
```

## Características del Juego

- 🎮 Sistema de Apuestas

  - Por color (rojo/negro)
  - Por paridad (par/impar) de un color específico
  - Por número específico

- 👤 Gestión de Usuarios

  - Registro de nuevos jugadores
  - Sistema de saldo
  - Guardado de partidas

- 💰 Premios
  - Número específico: x3
  - Color: x0.5
  - Color + Paridad: x2

## Estructura del Proyecto

```
src/
├── components/           # Componentes Vue
│   ├── FormPlayer.vue   # Formulario de jugador
│   ├── Roulette.vue     # Componente principal de ruleta
│   ├── Result.vue       # Mostrador de resultados
│   └── Modal.vue        # Modal informativo
├── stores/
│   └── game.js          # Estado global con Pinia
├── views/
│   └── GameRouletteView.vue  # Vista principal
└── utils/
    └── rouletteData.js  # Datos y configuraciones
```

## Autor

Cristhian Farfan

## Licencia

MIT

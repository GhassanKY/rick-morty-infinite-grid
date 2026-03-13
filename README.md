# Infinite Grid Rick & Morty

Aplicación construida con **Next.js (App Router)** y **React 19** que muestra una galería de personajes con **scroll infinito**, animaciones y eliminación dinámica de elementos utilizando la API pública de Rick & Morty.

---

# Stack principal

- **Next.js (App Router)**
- **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- **Axios**
- **Framer Motion**
- **react-infinite-scroll-component**

Testing:

- **Jest**
- **React Testing Library**
- **Testing Library / User Event**

---

# Decisiones técnicas

### Arquitectura (Next.js App Router)

Se utiliza **Next.js con App Router** para separar la lógica de servidor de la interactividad del cliente mediante **Server Components y Server Actions**, reduciendo el bundle enviado al cliente y mejorando el rendimiento inicial.

### Scroll infinito

La carga progresiva de datos se implementa con **react-infinite-scroll-component**, que dispara nuevas peticiones cuando el usuario alcanza el final del contenido.

### Animaciones

Las transiciones de entrada, salida y reorganización de elementos se gestionan con **Framer Motion** (`AnimatePresence` + `motion.div`) para proporcionar una experiencia visual fluida.

### Manejo de red

Las llamadas HTTP se realizan mediante **Axios** utilizando una instancia centralizada con interceptores para manejar errores de red y respuestas fallidas de forma consistente.

Además, se implementa una estrategia de **Exponential Backoff con Jitter** para reintentos ante errores de rate limit (429) o fallos temporales de red.

### Encapsulación de lógica

La lógica de estado y paginación de la galería se encapsula en un hook personalizado (`usePhotoGallery`), separando claramente la lógica de negocio de los componentes de UI.

### Estrategia de testing

Se utiliza **Jest** junto con **React Testing Library** siguiendo un enfoque **user-centric**, probando el comportamiento visible para el usuario (renderizado, carga de elementos, eliminación) en lugar de estados internos de los componentes.

---

# Estructura del proyecto

```
app/
 ├ actions/      # Server Actions (llamadas a la API)
 ├ hooks/        # Hooks de lógica (usePhotoGallery)
 ├ components/   # Componentes UI
 ├ lib/          # Utilidades
 ├ services/     # Configuración de Axios
 └ constants/    # Configuración global
```

---

# Instalación y ejecución

## Método rápido

```
npm run setup
```

Este comando instala dependencias, construye el proyecto y arranca el servidor.

La aplicación estará disponible en:

```
http://localhost:3000
```

## Desarrollo

```
npm install
npm run dev
```

---

# Ejecutar los tests

```
npm run test
```

---

# Uso de herramientas de IA

Durante el desarrollo se utilizaron herramientas de **IA generativa (ChatGPT)** como apoyo en distintas tareas:

- Generación de **boilerplate inicial** para algunos componentes.
- Asistencia en la **implementación de la lógica de reintentos (Exponential Backoff + Jitter)**.
- Apoyo en la **escritura de tests con Jest y React Testing Library**.
- Ayuda puntual en **refactorización y simplificación de código repetitivo**, especialmente en el manejo de errores de red.

Todas las decisiones finales de arquitectura, organización del proyecto y validación del comportamiento del código fueron revisadas y ajustadas manualmente.
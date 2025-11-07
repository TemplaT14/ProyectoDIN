# 2DAM DIN: Task List App

Aplicación de escritorio para gestionar una lista de tareas pendientes.

Realizada con **_Electron_**, **_React_** y **_Vite_** para el módulo de **Desarrollo de Interfaces** de **2º DAM**.

![Captura de pantalla de la app](./doc/Screen.png)

## Instalación de dependencias

```bash
$ npm install
````

## Trabajar en desarrollo

```bash
$ npm run dev
```

-----

# Estructura de la aplicación

## Proceso Principal (src/main)

**`main/index.js`** es el proceso principal de *Electron*. Se encarga de crear la ventana y gestionar todos los eventos nativos (diálogos, títulos de ventana, etc.).

**`main/StoreManager.js`** utiliza `electron-store` para guardar los datos de las tareas en un fichero `JSON` en el sistema del usuario.

Contiene los siguientes **manejadores (ipcMain)**:

  * **`window:set-title`**: (Petición mía) Cambia el título de la ventana nativa de la aplicación.
  * **`store:get-list`**: Lee la lista de tareas y la envía al renderer (React) usando el evento `list-updated`.
  * **`store:get-item`**: Busca una tarea por su `ID` y la devuelve.
  * **`store:add-item`**: Añade una tarea nueva, guarda y avisa al renderer (`list-updated`).
  * **`store:update-item`**: Actualiza una tarea, guarda y avisa al renderer (`list-updated`).
  * **`store:delete-item`**: Muestra un **diálogo nativo** de confirmación antes de borrar. Si se acepta, borra la tarea y avisa al renderer (`list-updated`).
  * **`store:confirm-item`**: Muestra un diálogo nativo con 3 opciones (Guardar, Descartar, Cancelar) cuando se intenta salir de 'Editar' con cambios sin guardar.
  * **`show-dialog`**: Un manejador genérico para mostrar alertas de error o info.

## Preload (src/preload)

**`preload/index.js`** es el puente seguro que conecta el Proceso Principal (Node.js) con el Renderer (React).

Expone los siguientes métodos en `window.api` para que React pueda llamarlos:

  * `getList`
  * `getItem`
  * `addItem`
  * `deleteItem`
  * `updateItem`
  * `confirmItem`
  * `showDialog`
  * `setTitle`

-----

# Componentes React (src/renderer/src)

## App.jsx

Componente de entrada. Usa `HashRouter` (requerido por Electron) para la navegación entre las 3 vistas (páginas) de la aplicación.

  * `/`: Carga `TaskList` (la lista principal).
  * `/new`: Carga `TaskCreate` (formulario de creación).
  * `/edit/:taskId`: Carga `TaskEdit` (formulario de edición).

También incluye el `ThemeSwitcher` (para el modo oscuro/claro).

## Vistas Principales

### TaskList.jsx

Es la vista principal (`/`). Es un componente "inteligente" que:

  * Escucha el evento `list-updated` para refrescar la lista automáticamente.
  * Gestiona el estado de los filtros y la ordenación.
  * Pasa los datos a los componentes "tontos".
  * Renderiza la **cabecera** de la lista  y un `TaskRow` por cada tarea.

### TaskCreate.jsx

Vista (`/new`). Componente "inteligente" que:

  * Inicializa una `Task` vacía (usando `Task.class.js`).
  * Gestiona el `handleSave` y `handleDiscard`.
  * Renderiza el `TaskForm` (el formulario reutilizable).

### TaskEdit.jsx

Vista (`/edit/:taskId`). Es el componente más complejo:

  * Carga la tarea a editar usando el `taskId` de la URL.
  * Guarda una copia (`originalTask`) para detectar cambios (`hasChanges`).
  * Gestiona `handleSave`, `handleBack` (lógica de "Volver") y `handleDelete` .
  * Renderiza `TaskForm`, pasándole las props para cambiar el título del formulario (`formTitle`), el texto del botón (`discardButtonText`) y desactivar el guardado (`isSaveDisabled`).

## Componentes Reutilizables (components)

  * ### `TaskForm.jsx`

    Formulario "tonto" reutilizable para `TaskCreate` y `TaskEdit`. Recibe todas las funciones y el estado vía props.

  * ### `TaskRow.jsx`

    Renderiza cada fila de la lista. Es un componente complejo que incluye:

      * Un desplegable (acordeón) con flecha (`bi-chevron-down`) para ver la descripción.
      * Un `<select>` para cambiar el estado de la tarea directamente en la lista.
      * Los botones de "Editar" (navega) y "Borrar" (llama a `handleDelete`).

  * ### `TaskFilters.jsx`

    Componente "tonto" con los filtros. (solo checkboxes y el `<select>` de ordenación).

  * ### `ModalDialog.jsx`

    Un modal "de React" (no nativo) que se usa para mostrar mensajes de éxito o error (ej. "Tarea guardada").

  * ### `ThemeSwitcher.jsx`

    El interruptor que cambia el atributo `data-bs-theme` para activar el modo oscuro/claro de Bootstrap.

-----

## Detalles de implementación, decisiones y problemas

La verdad es q este proyecto tuvo varias cosas q se decidieron sobre la marcha y algun que otro problema:

   **Doble diálogo al borrar:** Al principio, al dar a borrar, salía un modal de React y luego el 'alert' nativo de Electron. Era super molesto. Lo arreglamos (tanto en la lista como en 'Editar') para q solo salga el nativo (llamando a `window.api.deleteItem` directamente).
   **El "undefined" en el alert:** El alert nativo decía "Borrar undefined". Era un fallo tonto en `main/index.js`, estaba buscando `item.name` en vez de `item.title`.
   **No volvía a inicio:** Despues de guardar una tarea (crear o editar), el modal de "Guardado OK" no te mandaba a la lista. El problema era un bug en `ModalDialog.jsx`, q no llamaba a la funcion `onClose` q le pasabamos (lo arreglamos en el `onClose={() => ...}` del modal).
   **Activar/Desactivar Guardar:** Queria q el boton 'Guardar' en 'Editar' estuviera desactivado si no habías cambiado nada. Para esto tuve q guardar una copia de la tarea original (`originalTask`) y comparar si `JSON.stringify(task)` era diferente del original (`hasChanges`).
   **Cambio de título:** Hubo una confusion al cambiar el título. Yo quería cambiar el `<h2>` de la página de Editar (ej: "Editando: Comprar pan"), pero primero implementamos un cambio en el título de la ventana del S.O. (usando `window.api.setTitle`). Al final dejamos las dos cosas, que queda mejor.
   **Manejo de estado en la fila:** En vez de un boton "cambiar estado", al final pusimos un `<select>` directamente en la fila (`TaskRow.jsx`), y tmb un desplegable (acordeón) con la descripción para no tener q ir a 'Editar' solo para verla.

-----

## Agradecimientos

En la creación de este proyecto he usado tanto los apuntes que nos ha facilitado la profesora, como la ayuda de la inteligencia artificial, ¡y sobre todo me ha ayudado mi compañera Jova que es una ídola!

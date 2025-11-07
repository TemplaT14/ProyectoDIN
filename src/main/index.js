import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { StoreManager } from './StoreManager.js'

// la ventana principal
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // aqui le decimos q use el script de preload
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // para q no se vea la ventana hasta q este lista
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // para q los enlaces se abran en el navegador 
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Carga la URL de desarrollo (vite) o el html en producion.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// cuando la app esta lista
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // Para abrir las devtools con F12
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // para macos
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Cerrar la app del todo si no estamos en mac
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// --- Aqui empiezan los eventos ipc (la chicha) ---
const store = new StoreManager({ name: 'app-data' }) 
// Cambia el titulo de la ventana 
ipcMain.on('window:set-title', (event, title) => {
  if (mainWindow) {
    mainWindow.setTitle(title);
  }
});

// cuando el renderer pide la lista de tareas
ipcMain.handle('store:get-list', async () => {
  try {
    const list = await store.getList()
    // mandamos la lista actualizada a la ventana con 'list-updated'
    mainWindow.send('list-updated', list)
  } catch (error) {
    console.error(error)
  }
})

// pillar solo 1 tarea por id
ipcMain.handle('store:get-item', async (event, itemId) => {
  return await store.getItem(itemId)
})

// añadir tarea y avisar a todos (list-updated)
ipcMain.on('store:add-item', (event, item) => {
  mainWindow.send('list-updated', store.addItem(item))
})

// dialogo de borrar
ipcMain.handle('store:delete-item', async (event, item) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: `Borrar ${item.title}`,// arreglado, antes ponia item.name y salia undefined
    message: `¿Borrar '${item.title}' de la lista?`,
    buttons: ['Cancelar', 'BORRAR'],
    cancelId: 0, //  0 es cancelar
    defaultId: 1 //  1 es borrar
  })

  // si pulsa 'BORRAR' (q es el boton 1)
  if (result.response === 1) {
    console.log('Borrando', item)
    mainWindow.send('list-updated', store.deleteItem(item))
    return true // devolvemos true al renderer para q sepa q se borro
  }
})

// un dialogo generico (para errores y tal)
ipcMain.handle('show-dialog', async (event, { type, message }) => {
  const win = BrowserWindow.getFocusedWindow()
  await dialog.showMessageBox(win, {
    type: type,
    message: message
  })
})

// actualizar y avisar
ipcMain.on('store:update-item', (event, item) => {
  mainWindow.send('list-updated', store.updateItem(item))
})

// dialogo para descartar cambios (el de editar/volver)
ipcMain.handle('store:confirm-item', async (event, item) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    title: `Hay cambios sin guardar`,
    message: `¿Seguro que deseas descartar los cambios?`,
    detail: 'Se perderán los cambios realizados en el producto.',
    buttons: ['Cancelar', 'Guardar', 'Descartar'],
    cancelId: 0,
    defaultId: 2
  })

  // devuelve al renderer q boton ha pulsao
  switch (result.response) {
    case 0:
      return 'cancel' 
    case 1:
      // si le da a guardar, la guardamos y avisamos
      mainWindow.send('list-updated', store.updateItem(item))
      return 'save' 
    case 2:
      return 'discard' 
  }
})
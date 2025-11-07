// src/main/index.js
import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { StoreManager } from './StoreManager.js'


let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Register events
const store = new StoreManager({ name: 'app-data' })

// CAMBIAR TÍTULO DE VENTANA (AÑADIDO)
ipcMain.on('window:set-title', (event, title) => {
  if (mainWindow) {
    mainWindow.setTitle(title);
  }
});

ipcMain.handle('store:get-list', async () => {
  try {
    const list = await store.getList()
    mainWindow.send('list-updated', list)
  } catch (error) {
    console.error(error)
  }
})

// GET ITEM (ID)
ipcMain.handle('store:get-item', async (event, itemId) => {
  return await store.getItem(itemId)
})

// ADD ITEM
ipcMain.on('store:add-item', (event, item) => {
  mainWindow.send('list-updated', store.addItem(item))
})

// DELETE ITEM (CORREGIDO CON .title)
ipcMain.handle('store:delete-item', async (event, item) => {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: `Borrar ${item.title}`, // CORREGIDO
    message: `¿Borrar '${item.title}' de la lista?`, // CORREGIDO
    buttons: ['Cancelar', 'BORRAR'],
    cancelId: 0,
    defaultId: 1
  })

  if (result.response === 1) {
    console.log('Borrando', item)
    mainWindow.send('list-updated', store.deleteItem(item))
    return true
  }
})

//DIALOGO
ipcMain.handle('show-dialog', async (event, { type, message }) => {
  const win = BrowserWindow.getFocusedWindow()
  await dialog.showMessageBox(win, {
    type: type, // 'info', 'error', 'warning', etc.
    message: message
  })
})

// UPDATE ITEM
ipcMain.on('store:update-item', (event, item) => {
  mainWindow.send('list-updated', store.updateItem(item))
})

// CONFIRM ITEM
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

  switch (result.response) {
    case 0:
      return 'cancel'
    case 1:
      mainWindow.send('list-updated', store.updateItem(item))
      return 'save'
    case 2:
      return 'discard'
  }
})
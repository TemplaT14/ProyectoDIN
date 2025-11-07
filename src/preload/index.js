import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// APIs personalizadas pal renderer
const api = {
  getList: () => ipcRenderer.invoke('store:get-list'), // 'invoke' es esperar respuesta
  getItem: (itemId) => ipcRenderer.invoke('store:get-item', itemId),
  addItem: (item) => ipcRenderer.send('store:add-item', item), // 'send' es solo enviar, sin esperar
  deleteItem: (item) => ipcRenderer.invoke('store:delete-item', item),
  updateItem: (item) => ipcRenderer.send('store:update-item', item),
  confirmItem: (item) => ipcRenderer.invoke('store:confirm-item', item),
  showDialog: (type, message) => ipcRenderer.invoke('show-dialog', { type, message }), 
  setTitle: (title) => ipcRenderer.send('window:set-title', title)//para cambiar el titulo de la ventana
}

// Esto es el 'puente' seguro de Electron.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
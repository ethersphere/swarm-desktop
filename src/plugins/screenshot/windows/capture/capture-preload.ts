import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  takeScreenshot: async () => ipcRenderer.invoke('take-screenshot'),
  hideCaptureWindow: () => ipcRenderer.send('hide-capture-window'),
  closeWindow: async () => ipcRenderer.invoke('close-capture-window'),
})

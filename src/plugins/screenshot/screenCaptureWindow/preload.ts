import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  takeScreenshot: async () => ipcRenderer.invoke('take-screenshot'),
  setCaptureWindowOpacity: (opacity: number) => ipcRenderer.send('set-capture-window-opacity', opacity),
})

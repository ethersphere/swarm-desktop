import { contextBridge, ipcRenderer } from 'electron'
import type { OnImageDataURL } from '../interface'

contextBridge.exposeInMainWorld('electron', {
  onImageDataURL: (cb: OnImageDataURL) => ipcRenderer.on('image-data-url', (_, dataURL) => cb(dataURL)),
})

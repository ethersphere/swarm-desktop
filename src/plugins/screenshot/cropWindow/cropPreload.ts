import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  onLoadImageForCropping: (cb: (imgUrl: string) => void) =>
    ipcRenderer.on('load-image-for-cropping', (_, imgDataURL) => cb(imgDataURL)),
})

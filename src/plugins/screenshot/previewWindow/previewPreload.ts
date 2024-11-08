import { contextBridge, ipcRenderer } from 'electron'
import type { OnImageDataURL } from '../interface'

contextBridge.exposeInMainWorld('electron', {
  onImageDataURL: (cb: OnImageDataURL) => ipcRenderer.on('image-data-url', (_, dataURL) => cb(dataURL)),
  openCropWindow: (imgSrc: string) => ipcRenderer.send('open-crop-window', imgSrc),
  onCroppedImage: (cb: (imgDataURL: string) => void) =>
    ipcRenderer.on('update-with-cropped-image', (_evnt, imgDataURL) => cb(imgDataURL)),
  setTitle: (t: string) => ipcRenderer.send('set-title', t),
})

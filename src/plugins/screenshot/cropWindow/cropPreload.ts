import { contextBridge, ipcRenderer } from 'electron'

export type CropImageArgs = {
  x: number // X coordinates relative to original image
  y: number // Y coordinates relative to original image
  width: number
  height: number
  imgDataURL: string
}

contextBridge.exposeInMainWorld('electron', {
  onLoadImageForCropping: (cb: (imgUrl: string) => void) =>
    ipcRenderer.on('load-image-for-cropping', (_, imgDataURL) => cb(imgDataURL)),
  cropImage: (args: CropImageArgs) => ipcRenderer.send('crop-image', args),
})

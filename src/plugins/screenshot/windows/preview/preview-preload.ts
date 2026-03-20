import { PostageBatch } from '@ethersphere/bee-js'
import { contextBridge, ipcRenderer } from 'electron'

import type { OnImageDataURL } from '../../interface'

contextBridge.exposeInMainWorld('electron', {
  onImageDataURL: (cb: OnImageDataURL) => ipcRenderer.on('image-data-url', (_, dataURL) => cb(dataURL)),
  openCropWindow: (imgSrc: string) => ipcRenderer.send('open-crop-window', imgSrc),
  onCroppedImage: (cb: (imgDataURL: string) => void) =>
    ipcRenderer.on('update-with-cropped-image', (_evnt, imgDataURL) => cb(imgDataURL)),
  setTitle: (t: string) => ipcRenderer.send('set-title', t),
  nodeIsConnected: async () => ipcRenderer.invoke('node-is-connected'),
  getAllPostageBatch: async () => ipcRenderer.invoke('get-all-postage-batch'),
  createPostageStamp: () => ipcRenderer.send('create-postage-stamp'),
  updatePostageStampState: (cb: (ps: PostageBatch[]) => void) =>
    ipcRenderer.on('update-postage-stamp-state', (_, ps) => cb(ps)),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadToSwarm: async (obj: any) => ipcRenderer.invoke('upload-to-swarm', obj),
  onUploadResult: (cb: (resObj: string) => void) => ipcRenderer.on('upload-result', (_, resObj) => cb(resObj)),
})

import type { CreateElementArg } from './utils'

export type OnImageDataURL = (imgData: string) => void

export interface IElectronAPI {
  setChildWindowOpacity: (num: number) => void
  takeScreenshot: () => Promise<void>
  setCaptureWindowOpacity: () => void
  onImageDataURL: OnImageDataURL
  createElement: <T extends keyof HTMLElementTagNameMap>(args: CreateElementArg<T>) => HTMLElementTagNameMap[T]
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}

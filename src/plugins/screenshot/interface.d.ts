import type { CreateElementArg } from './utils'

export interface IElectronAPI {
  setChildWindowOpacity: (num: number) => void
  takeScreenshot: () => Promise<void>
  setCaptureWindowOpacity: () => void
  createElement: <T extends keyof HTMLElementTagNameMap>(args: CreateElementArg<T>) => HTMLElementTagNameMap[T]
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}

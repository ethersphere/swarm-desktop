import { dialog, screen } from 'electron'

import { logger } from '../../..//logger'

export type CreateElementArg<T extends keyof HTMLElementTagNameMap> = {
  tagName: T
  options?: {
    type?: HTMLInputElement['type']
  }
  id: string
  textContent?: string
  classes?: string[]
  attributes?: {
    [key: string]: string
  }
}

export function createElement<T extends keyof HTMLElementTagNameMap>(
  args: CreateElementArg<T>,
): HTMLElementTagNameMap[T] {
  const elem = document.createElement(args.tagName)

  if (args.id) elem.id = args.id

  if (args.textContent) elem.textContent = args.textContent
  args.classes?.forEach(clsName => elem.classList.add(clsName))

  Object.entries(args.attributes || {}).forEach(([k, v]) => {
    elem.setAttribute(k, v)
  })

  return elem as HTMLElementTagNameMap[T]
}

export function errorHandler(e: Error | string) {
  if (typeof e !== 'string') {
    e = e.message
  }

  logger.error(e)
  dialog.showErrorBox('There was an error in Swarm Desktop', e)
}

/**
 *
 * @param {number} resizeBy Number to resize window to
 * @returns
 */
export function getScreenSize(resizeBy = 3) {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { height, width } = primaryDisplay.size
  const scaleFactor = primaryDisplay.scaleFactor

  const defaultScreenSize = {
    width: Math.floor((width / resizeBy) * scaleFactor),
    height: Math.floor((height / resizeBy) * scaleFactor),
  }

  return {
    height,
    width,
    scaleFactor,
    defaultScreenSize,
  }
}

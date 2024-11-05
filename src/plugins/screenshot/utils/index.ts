import { screen } from 'electron'

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
    width: (width / resizeBy) * scaleFactor,
    height: (height / resizeBy) * scaleFactor,
  }

  return {
    height,
    width,
    scaleFactor,
    defaultScreenSize,
  }
}

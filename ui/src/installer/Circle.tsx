interface CircleProps {
  color: string
  size: string
  borderSize: string
  borderColor: string
  quarter: boolean
  spinner: boolean
}

export function Circle({ color, size, borderSize, borderColor, quarter = false, spinner = false }: CircleProps) {
  const style = {
    background: color,
    width: size,
    height: size,
    border: `${borderSize} solid ${borderColor}`,
    borderRadius: '9999px',
    borderRightColor: quarter ? 'transparent' : borderColor,
  }

  return <div className={spinner ? 'spinner' : ''} style={style}></div>
}

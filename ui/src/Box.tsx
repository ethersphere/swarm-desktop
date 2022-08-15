import { ReactElement } from 'react'

interface BoxProps {
  children: ReactElement
  mb: number | undefined
}

export function Box({ children, mb }: BoxProps) {
  const style = {
    marginBottom: mb ? mb * 8 : undefined,
  }

  return <div style={style}>{children}</div>
}

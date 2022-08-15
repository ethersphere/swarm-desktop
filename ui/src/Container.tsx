import { ReactElement } from 'react'

export function Container({ children }: { children: ReactElement[] }) {
  return (
    <div className="container">
      {children.map((x, i) => (
        <div key={i} className="container-item">
          {x}
        </div>
      ))}
    </div>
  )
}

import BeeDashboard from '@ethersphere/bee-dashboard'
import React from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BeeDashboard isDesktop={true} />
  </React.StrictMode>,
)

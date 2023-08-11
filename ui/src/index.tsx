import BeeDashboard from '@ethersphere/bee-dashboard'
import React from 'react'
import ReactDOM from 'react-dom'

const container = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <BeeDashboard isDesktop={true} />
  </React.StrictMode>,
  container,
)

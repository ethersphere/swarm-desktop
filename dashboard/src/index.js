import Dashboard from '@ethersphere/bee-dashboard'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <React.StrictMode>
    <Dashboard isBeeDesktop={true} />
  </React.StrictMode>,
  document.getElementById('root'),
)

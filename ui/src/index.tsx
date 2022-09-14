import React from 'react'
import ReactDOM from 'react-dom'
import BeeDashboard from '@ethersphere/bee-dashboard'
import { initSentry } from './utils/sentry'

if (process.env.REACT_APP_SENTRY_KEY) {
  initSentry(process.env.REACT_APP_SENTRY_KEY)
}

const container = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <BeeDashboard isDesktop={true} />
  </React.StrictMode>,
  container,
)

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom'

import Installer from './installer'
import Dashboard from './dashboard'
import { initSentry } from './utils/sentry'

if (process.env.REACT_APP_SENTRY_KEY) {
  initSentry(process.env.REACT_APP_SENTRY_KEY)
}

const container = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/installer" element={<Installer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  container,
)

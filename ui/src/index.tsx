import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Installer from './installer/Installer'
import Dashboard from '@ethersphere/bee-dashboard'
import ReactDOM from 'react-dom'

const container = document.getElementById('root')
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard isBeeDesktop={true} />} />
        <Route path="/installer" element={<Installer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  container,
)

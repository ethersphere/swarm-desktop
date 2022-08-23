import Dashboard from '@ethersphere/bee-dashboard'

export function App() {
  return <Dashboard beeApiUrl="http://localhost:1633" beeDebugApiUrl="http://localhost:1635" isBeeDesktop={true} />
}

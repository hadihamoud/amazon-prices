import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Amazon Prices - Test Build</h1>
      <p>If you can see this, the build is working!</p>
      <p>This is a minimal test version.</p>
    </div>
  )
}

const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

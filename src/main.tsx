import React from 'react'
import ReactDOM from 'react-dom/client'
import Shell from './app/shell'
import './index.css'

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => console.clear())
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell />
  </React.StrictMode>
)

import ReactDOM from 'react-dom/client'
import Shell from './shell'
import './index.css'

import './i18n'

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => console.clear())
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Shell />)

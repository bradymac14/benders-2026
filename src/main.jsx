import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// The auto-updating service worker (skipWaiting + clientsClaim) installs new
// builds in the background, but an already-open app keeps the old in-memory
// JS until something forces a reload — which iOS standalone PWAs rarely do on
// their own. Reload once the new worker takes control so updates actually land.
if ('serviceWorker' in navigator) {
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// importa los componentes de react y react-dom
import React from 'react'
import ReactDOM from 'react-dom/client'

// importa los estilos de personalizados para la aplicación
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles/custom.css'

// importa el componente App.jsx
import App from './App'

// renderiza App.jsx en el elemento <div id="root">
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

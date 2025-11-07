import { HashRouter, Route, Routes } from 'react-router-dom'
// Importamos las 3 'paginas' de la app
import TaskList from './TaskList' // la lista
import TaskEdit from './TaskEdit' // el formulario de editar
import TaskCreate from './TaskCreate' // el formulario de crear
// el interruptor del modo oscuro
import ThemeSwitcher from './components/ThemeSwitcher'

export default function App() {
  return (
    // Usamos HashRouter pq es el q funciona bien con Electron
    // BrowserRouter da problemas con las rutas de archivos
    <HashRouter>
      {/* El interruptor del tema, puesto arriba a la derecha */}
      <div className="d-flex justify-content-end p-2">
        <ThemeSwitcher />
      </div>
      {/* Aki definimos las 'paginas' (Rutas) */}
      <Routes>
        {/* La raiz (/) carga la lista de tareas */}
        <Route path="/" element={<TaskList />} /> {/* La pagina para crear tareas nuevas */}
        <Route path="/new" element={<TaskCreate />} />
        {/* La pagina pa editar.*/}
        <Route path="/edit/:taskId" element={<TaskEdit />} />
      </Routes>
    </HashRouter>
  )
}

import { HashRouter, Route, Routes } from 'react-router-dom'

// Componentes que harán de vistas de la aplicación
import TaskList from './TaskList'
import TaskEdit from './TaskEdit'
import TaskCreate from './TaskCreate'
//Modo oscuro
import ThemeSwitcher from './components/ThemeSwitcher'

export default function App() {
  return (
    <HashRouter>
      <div className="d-flex justify-content-end p-2">
        <ThemeSwitcher />
      </div>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/new" element={<TaskCreate />} />
        <Route path="/edit/:taskId" element={<TaskEdit />} />
      </Routes>
    </HashRouter>
  )
}

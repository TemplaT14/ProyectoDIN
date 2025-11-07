// renderer/src/TaskList.jsx
import { useState, useEffect } from 'react'
import TaskRow from './components/TaskRow'
import TaskFilters from './components/TaskFilters'
import { useNavigate } from 'react-router-dom'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({
    showCompleted: true,
    showCancelled: true,
    sortBy: 'id' 
  })
  const navigate = useNavigate()

  async function fetchList() {
    try {
      await window.api.getList()
    } catch (err) {
      alert('Error al cargar la lista de tareas')
      console.error(err)
    }
  }
  useEffect(() => {
    fetchList()
    window.electron.ipcRenderer.on('list-updated', handleUpdateList)
    return () => window.electron.ipcRenderer.removeListener('list-updated', handleUpdateList)
  }, [])

  function handleUpdateList(event, list, appliedFilters = filters) {
    setTasks(getFilteredAndSortedList(list, appliedFilters))
  }

  function getFilteredAndSortedList(list, appliedFilters) {
    const filtered = list.filter((task) => {
      let match = true 
      if (!appliedFilters.showCompleted) match = match && task.state !== 'Completada'
      if (!appliedFilters.showCancelled) match = match && task.state !== 'Cancelada'
      return match
    })
    const sortBy = appliedFilters.sortBy || 'id'
    if (sortBy === 'id') {
      return filtered.sort((a, b) => a.id - b.id)
    }
    return filtered.sort((a, b) => {
      const valA = (a[sortBy] || '').toLowerCase() 
      const valB = (b[sortBy] || '').toLowerCase()
      return valA.localeCompare(valB)
    })
  }

  function handleFilters(newFilters) {
    setFilters(newFilters)
    window.api.getList()
    window.electron.ipcRenderer.once('list-updated', (event, list) => {
      handleUpdateList(event, list, newFilters)
    })
  }

  return (
    <div className="container">
      <h1 className="text-primary">Listado de tareas</h1>
      <button className="btn btn-success mb-2" onClick={() => navigate('/new')}>
        Nueva tarea
      </button>
      <TaskFilters filterCallback={handleFilters} />

      <ul className="list-group">
        {/* 1. (AÑADIDO) Encabezado de la lista */}
        <li 
          className="list-group-item" 
          style={{ 
            backgroundColor: 'var(--bs-tertiary-bg)', 
            fontWeight: 'bold' 
          }}
        >
          <div className="d-flex justify-content-between align-items-center gap-2">
            
            {/* Lado izquierdo (Títulos) - Imita la estructura de TaskRow */}
            <div className="d-flex align-items-center gap-2 flex-grow-1">
              {/* Título */}
              <span>Título</span>
              
              {/* Estado */}
              <span style={{ width: '150px' }}>Estado</span>
              
              {/* Fecha Límite (alineada a la derecha de este bloque) */}
              <span className="ms-auto">Fecha Límite</span>
            </div>

            {/* Lado derecho (Espacio para botones) */}
            {/* Usamos 'visibility: hidden' para que ocupe espacio y alinee, pero no se vea */}
            <div style={{ visibility: 'hidden' }}>
              <button className="btn btn-sm btn-primary">Editar</button>
              <button className="btn btn-sm btn-danger">Borrar</button>
            </div>
          </div>
        </li>

        {/* 2. (EXISTENTE) Mensaje de lista vacía */}
        {tasks.length === 0 && (
          <li className="list-group-item text-muted text-center">No hay tareas que mostrar</li>
        )}
        
        {/* 3. (EXISTENTE) Mapeo de tareas */}
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}
// renderer/src/TaskList.jsx (Modificado)
import { useState, useEffect } from 'react'
import TaskRow from './components/TaskRow'
import TaskFilters from './components/TaskFilters'
import { useNavigate } from 'react-router-dom'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({
    // 'title' y 'state' eliminados del estado
    showCompleted: true,
    showCancelled: true,
    sortBy: 'id' 
  })
  const navigate = useNavigate()

  async function fetchList() {
    // ... (El resto de la función es igual)
    try {
      await window.api.getList()
    } catch (err) {
      alert('Error al cargar la lista de tareas')
      console.error(err)
    }
  }
  useEffect(() => {
    // ... (Esta función es igual)
    fetchList()
    window.electron.ipcRenderer.on('list-updated', handleUpdateList)
    return () => window.electron.ipcRenderer.removeListener('list-updated', handleUpdateList)
  }, [])

  function handleUpdateList(event, list, appliedFilters = filters) {
    setTasks(getFilteredAndSortedList(list, appliedFilters))
  }

  function getFilteredAndSortedList(list, appliedFilters) {
    
    const filtered = list.filter((task) => {
      // 1. (CAMBIADO) La condición inicial ahora es 'true'
      let match = true 
      
      // 2. (SIN CAMBIOS) Sigue filtrando por checkboxes
      if (!appliedFilters.showCompleted) match = match && task.state !== 'Completada'
      if (!appliedFilters.showCancelled) match = match && task.state !== 'Cancelada'

      // 3. (ELIMINADO) La línea 'if (appliedFilters.state)...' se ha borrado
      
      return match
    })

    // --- Lógica de ordenación (Sin cambios) ---
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
    // ... (Esta función es igual)
    setFilters(newFilters)
    window.api.getList()
    window.electron.ipcRenderer.once('list-updated', (event, list) => {
      handleUpdateList(event, list, newFilters)
    })
  }

  return (
    <div className="container">
      {/* ... (El resto del JSX es igual) ... */}
      <h1 className="text-primary">Listado de tareas</h1>
      <button className="btn btn-success mb-2" onClick={() => navigate('/new')}>
        Nueva tarea
      </button>
      <TaskFilters filterCallback={handleFilters} />
  _     <ul className="list-group">
        {tasks.length === 0 && (
          <li className="list-group-item text-muted text-center">No hay tareas que mostrar</li>
        )}
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}
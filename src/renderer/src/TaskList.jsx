import { useState, useEffect } from 'react'
import TaskRow from './components/TaskRow'
import TaskFilters from './components/TaskFilters'
import { useNavigate } from 'react-router-dom'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({
    title: '',
    state: '',
    showCompleted: true,
    showCancelled: true
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
    setTasks(getFilteredList(list, appliedFilters))
  }

  function getFilteredList(list, appliedFilters) {
    return list.filter((task) => {
      let match = task.title.toLowerCase().includes(appliedFilters.title.toLowerCase())
      if (!appliedFilters.showCompleted) match = match && task.state !== 'Completada'
      if (!appliedFilters.showCancelled) match = match && task.state !== 'Cancelada'
      if (appliedFilters.state) match = match && task.state === appliedFilters.state
      return match
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

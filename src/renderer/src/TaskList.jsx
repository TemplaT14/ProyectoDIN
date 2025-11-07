import { useState, useEffect } from 'react'
import TaskRow from './components/TaskRow'
import TaskFilters from './components/TaskFilters'
import { useNavigate } from 'react-router-dom'

// esta es la 'pagina' principal (la ruta '/')
export default function TaskList() {
  // aqui guardamos las tareas q se ven (ya filtradas y ordenadas)
  const [tasks, setTasks] = useState([]) 
  // aqui guardamos el estado de los filtros (los checkboxes y el 'ordenar por')
  const [filters, setFilters] = useState({
    showCompleted: true,
    showCancelled: true,
    sortBy: 'id'
  })
  const navigate = useNavigate() 

  // esta funcion solo 'pide' la lista al main
  async function fetchList() {
    try {
      // llama al 'main' (store:get-list),y el 'main' luego nos mandara el evento 'list-updated'
      await window.api.getList()
    } catch (err) {
      alert('Error al cargar la lista de tareas')
      console.error(err)
    }
  } 

  useEffect(() => {
    window.api.setTitle('Listado de Tareas')
    fetchList() // pide la lista la primera vez

    //esta es la linea mas importante se queda 'escuchando' el evento 'list-updated' q manda el 'main'
    window.electron.ipcRenderer.on('list-updated', handleUpdateList) 
    // esto es pa limpiar el 'listener' si salimos de esta pagina
    return () => window.electron.ipcRenderer.removeListener('list-updated', handleUpdateList)
  }, []) // el '[]' vacio significa q solo se ejecuta 1 vez

  // esta funcion la llama el 'listener' de arriba (cuando el main avisa)
  function handleUpdateList(event, list, appliedFilters = filters) {
    // actualiza la lista q se ve, pasandola por la funcion de filtrar/ordenar
    setTasks(getFilteredAndSortedList(list, appliedFilters))
  } 
  // filtra y ordena la lista 
  function getFilteredAndSortedList(list, appliedFilters) {
    // FILTRAR
    const filtered = list.filter((task) => {
      let match = true // empieza en true
      // checkboxes 
      if (!appliedFilters.showCompleted) match = match && task.state !== 'Completada'
      if (!appliedFilters.showCancelled) match = match && task.state !== 'Cancelada'
      return match
    }) // ORDENAR 
    const sortBy = appliedFilters.sortBy || 'id'
    if (sortBy === 'id') {
      // por id (numero)
      return filtered.sort((a, b) => a.id - b.id)
    } // por texto (titulo, estado, fecha)
    return filtered.sort((a, b) => {
      const valA = (a[sortBy] || '').toLowerCase()
      const valB = (b[sortBy] || '').toLowerCase()
      return valA.localeCompare(valB)
    })
  } 
  // funcion se llama cuando cambian los filtros
  function handleFilters(newFilters) {
    setFilters(newFilters) // actualiza el estado de los filtros
    window.api.getList() // pide la lista al main
    // esto es un apaño pa q pille los filtros nuevos al recargar
    // (usa 'once' en vez de 'on' para q solo se ejecute 1 vez)
    window.electron.ipcRenderer.once('list-updated', (event, list) => {
      handleUpdateList(event, list, newFilters)
    })
  }

  return (
    <div className="container">
      <h1 className="text-primary">Listado de tareas</h1>{/* el boton pa ir a /new */}
      <button className="btn btn-success mb-2" onClick={() => navigate('/new')}>
        Nueva tarea 
      </button>
      {/* el componente de los filtros */}
      <TaskFilters filterCallback={handleFilters} />
      <ul className="list-group">
        <li
          className="list-group-item"
          style={{
            backgroundColor: 'var(--bs-tertiary-bg)',
            fontWeight: 'bold'
          }}
        >
          <div className="d-flex justify-content-between align-items-center gap-2">
            <div className="d-flex align-items-center gap-2 flex-grow-1">
              {/*alinear: una flecha invisible q ocupa lo mismo q la real */}
              <i className="bi bi-chevron-right" style={{ visibility: 'hidden' }}></i>
              <span>Título</span><span style={{ width: '150px' }}>Estado</span>
              <span className="ms-auto">Fecha Límite</span>
            </div>
            {/* alinear: botones invisibles */}
            <div style={{ visibility: 'hidden' }}>
              <button className="btn btn-sm btn-primary">Editar</button>
              <button className="btn btn-sm btn-danger">Borrar</button>
            </div>
          </div>
        </li>
        {/* si no hay tareas, muestra esto */}
        {tasks.length === 0 && (
          <li className="list-group-item text-muted text-center">No hay tareas que mostrar</li>
        )}
        {/* dibuja cada fila (TaskRow) */}
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}

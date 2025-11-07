// renderer/src/components/TaskFilters.jsx (Modificado)
export default function TaskFilters({ filterCallback }) {
  
  function applyFilters() {
    const title = document.getElementById('filter-title').value
    const state = document.getElementById('filter-state').value
    const showCompleted = document.getElementById('filter-show-completed').checked
    const showCancelled = document.getElementById('filter-show-cancelled').checked
    // 1. (AÑADIDO) Leer el valor del nuevo selector
    const sortBy = document.getElementById('sort-by').value 
    
    // 2. (AÑADIDO) Pasar sortBy al callback
    filterCallback({ title, state, showCompleted, showCancelled, sortBy })
  }

  return (
    <div className="d-flex gap-2 mb-2 flex-wrap"> {/* Añadido flex-wrap por si no caben */}
      <input id="filter-title" placeholder="Buscar por título..." onChange={applyFilters} />
      <select id="filter-state" onChange={applyFilters} className="form-select" style={{ width: 'auto' }}>
        <option value="">Todos los estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En proceso">En proceso</option>
        <option value="Completada">Completada</option>
        <option value="Cancelada">Cancelada</option>
      </select>
      <label>
        <input type="checkbox" id="filter-show-completed" defaultChecked onChange={applyFilters} />
        Mostrar completadas
      </label>
      <label>
        <input type="checkbox" id="filter-show-cancelled" defaultChecked onChange={applyFilters} />
        Mostrar canceladas
      </label>

      {/* 3. (AÑADIDO) El nuevo selector de ordenación */}
      <select id="sort-by" onChange={applyFilters} className="form-select ms-auto" style={{ width: 'auto' }}>
        <option value="id">Ordenar por (Defecto)</option>
        <option value="title">Ordenar por Título</option>
        <option value="state">Ordenar por Estado</option>
        <option value="dueDate">Ordenar por Fecha</option>
      </select>
    </div>
  )
}